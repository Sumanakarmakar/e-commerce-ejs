const comparePassword = require("../../../../helper/comparePassword");
const hashPassword = require("../../../../helper/hashPassword");
const TokenModel = require("../../model/token.model");
const userRepositories = require("../../repositories/user.repositories");
const crypto = require("crypto");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const roleRepositories = require("../../../roles/repositories/role.repositories");
const { getRelativePath } = require("../../../../helper/ImageUpload");

class UserController {
  //for auth check
  async authcheckUser(req, res, next) {
    // console.log("ab",res);

    if (req.admin) {
      // console.log("after login user", req.admin);
      next();
    } else {
      console.log("Error While Admin Auth");
      res.redirect("/admin");
    }
  }

  async loginPage(req, res) {
    try {
      res.render("user/views/backend/login", {
        title: "Admin Login",
        data: req.admin,
        layout: false,
      });
    } catch (error) {
      console.log(`Error in login page ${error}`);
    }
  }

  //user login
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;

      //validation
      if (!email || !password) {
        req.flash("error", "All fields are Required");
        return res.redirect("/admin");
      }

      //validate if user exist in database
      const user = await userRepositories.findOne({ email });
      if (!user) {
        req.flash("error", "Email does not exist");
        return res.redirect("/admin");
      }

      const matchPassword = await comparePassword(password, user.password);
      if (!matchPassword) {
        req.flash("error", "Incorrect Password Detected");
        res.redirect("/admin");
      }

      const role = await roleRepositories.findOne({ _id: user.roleId });
      if (role.roleName !== "admin") {
        req.flash("error", "Please provide admin credentials");
        return res.redirect("/admin");
      }

      if (
        user &&
        matchPassword &&
        user.isVerified &&
        role.roleName === "admin"
      ) {
        //create token
        const token = jwt.sign(
          {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profile_pic: user.profile_pic,
          },
          process.env.JWT_SECRET,
          { expiresIn: "12h" }
        );

        if (token) {
          res.cookie("adminToken", token);
          req.flash("success", "Logged in Successfully");
          res.redirect("/admin/dashboard");
        } else {
          req.flash("error", "Login Failed");
          res.redirect("/admin");
        }
      }
    } catch (err) {
      console.log(`Error in login admin ${err}`);
    }
  }

  //admin dashboard
  async dashboard(req, res) {
    try {
      res.render("user/views/backend/dashboard", {
        title: "Admin Dashboard",
        data: req.admin,
      });
    } catch (error) {
      console.log(`Error in dashboard page ${error}`);
    }
  }

  //all users
  async alluserspage(req, res) {
    try {
      const alluserdata=await userRepositories.alluser()
      res.render("user/views/backend/allUsers", {
        title: "All Users",
        data: req.admin,
        alluserdata,
      });
    } catch (error) {
      console.log(`Error in dashboard page ${error}`);
    }
  }

  //user profile
  async profile(req, res) {
    try {
      const id = req.admin.id;
      const singledata = await userRepositories.findById(id);
      res.render("user/views/backend/profiledata", {
        title: "Admin Profile",
        data: req.admin,
        singledata,
      });
    } catch (error) {
      console.log(`Error in getting profile page ${error}`);
    }
  }

  async editProfilePicPage(req, res) {
    try {
      const id = req.admin.id;
      const singledata = await userRepositories.findById(id);
      res.render("user/views/backend/editProfilePic", {
        title: "Edit Profile Picture",
        data: req.admin,
        singledata,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //for updating profile pic
  async updateProfilePic(req, res) {
    try {
      const id = req.admin.id;
      const existingUser = await userRepositories.findById(id);
      if (req.file) {
        req.body.profile_pic = getRelativePath(req.file.path);
        fs.unlink(
          "./public/uploads/user/" + path.basename(existingUser.profile_pic),
          (err) => {
            console.log(`Error in removing old pic ${err}`);
          }
        );
      } else {
        req.body.profile_pic = existingUser.profile_pic;
      }

      const updatedPic = await userRepositories.findByIdAndUpdate(id, req.body);
      if (updatedPic) {
        req.flash("success", "Profile Image updated Successfully");
        res.redirect("/admin/profile");
      } else {
        req.flash("error", "Error detected");
        res.redirect(`/admin/profile_pic/edit/${id}`);
      }
    } catch (error) {
      console.log(`Error in updating profile pic ${error}`);
    }
  }

  //for edit profile details page
  async editProfilePage(req, res) {
    try {
      const detaildata = await userRepositories.findById(req.admin.id);
      res.render("user/views/backend/editProfileDetails", {
        title: "Update Profile Details",
        data: req.admin,
        detaildata,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //for update profile details
  async updateProfile(req, res) {
    try {
      const id = req.admin.id;
      const detaildata = await userRepositories.findById(id);
      const userdata = await userRepositories.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
      });
      if (userdata) {
        req.flash("success", "Member Data updated Successfully");
        res.redirect("/admin/profile");
      } else {
        (req.body.name = detaildata.name),
          (req.body.phone = detaildata.phone),
          req.flash("error", "Error detected in updating profile");
        res.redirect(`/admin/profile/edit/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //for update password page
  async editPasswordPage(req, res) {
    try {
      const detaildata = await userRepositories.findById(req.admin.id);
      res.render("user/views/backend/updatePassword", {
        title: "Update Password",
        data: req.admin,
        detaildata,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //update new password
  async updatePassword(req, res) {
    try {
      const id = req.admin.id;
      const { currentPassword, newPassword } = req.body;
      const user = await userRepositories.findById(id);
      const existingComparePW = await comparePassword(
        currentPassword,
        user.password
      );
      if (!existingComparePW) {
        req.flash("error", "Invalid Current Password");
        res.redirect(`/admin/password/edit/${id}`);
      }

      if (currentPassword === newPassword) {
        req.flash(
          "error",
          "New Password must be different from current password"
        );
        res.redirect(`/admin/password/edit/${id}`);
      }
      const hashedPW = await hashPassword(newPassword);
      const savedPWData = await userRepositories.findByIdAndUpdate(id, {
        password: hashedPW,
      });
      if (savedPWData) {
        req.flash("success", "Your Password is updated Successfully");
        res.redirect("/admin/profile");
      } else {
        req.flash("error", "Error detected in updating password");
        res.redirect(`/admin/password/edit/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("adminToken");
      res.redirect("/admin");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserController();
