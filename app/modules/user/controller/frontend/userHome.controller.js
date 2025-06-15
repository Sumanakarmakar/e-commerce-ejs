const hashPassword = require("../../../../helper/hashPassword");
const { getRelativePath } = require("../../../../helper/ImageUpload");
const categoryRepositories = require("../../../category/repositories/category.repositories");
const roleRepositories = require("../../../roles/repositories/role.repositories");
const userRepositories = require("../../repositories/user.repositories");
const fs = require("fs");
const path = require("path");
const { UserSchemaValidate } = require("../../model/user.model");
const TokenModel = require("../../model/token.model");
const {
  sendEmailVerificationRegister,
} = require("../../../../helper/mailCheck");
const sendSMS = require("../../../../helper/sendSMS");
const crypto = require("crypto");
const comparePassword = require("../../../../helper/comparePassword");
const jwt = require("jsonwebtoken");

class UserHomeController {
  //for auth check
  async authcheckUser(req, res, next) {
    // console.log("ab",res);

    if (req.user) {
      // console.log("after login user", req.admin);
      next();
    } else {
      console.log("Error While User Auth");
      res.redirect("/login");
    }
  }

  async home(req, res) {
    try {
      const categories = await categoryRepositories.allCategories();
      res.render("user/views/frontend/home", {
        title: "Home Page",
        data: req.user,
        categories,
      });
    } catch (error) {
      console.log(`Error in getting home page ${error}`);
    }
  }

  //user registration
  async registrationPage(req, res) {
    try {
      const roles = await roleRepositories.findRoles();
      const slicedRole = roles.find((r) => r.roleName === "user");
      res.render("user/views/frontend/registration", {
        title: "User Registration",
        data: req.user,
        slicedRole,
      });
    } catch (error) {
      console.log(`Error in getting registration page ${error}`);
    }
  }

  async createUser(req, res) {
    try {
      const { name, email, phone, password, roleId } = req.body;
      //   if (!name || !email || !phone || !password || !roleId) {
      //     req.flash('error', "All Fields are Required")
      //     return res.status(400).json({
      //       message: "",
      //     });
      //   }
      //check duplicate email
      const existingEmail = await userRepositories.findOne({ email });
      if (existingEmail) {
        fs.unlink(
          "./public/backend/uploads/user/" + path.basename(req.file.path),
          (err) => {
            console.log(`Error in removing the pic ${err}`);
          }
        );
        req.flash("error", "Email Already Exists. Please proceed for login");
        return res.redirect("/register");
      }

      const hashpassword = await hashPassword(password);
      const userdata = {
        name,
        email,
        phone,
        password: hashpassword,
        roleId,
      };

      if (req.file) {
        userdata.profile_pic = getRelativePath(req.file.path);
      }

      //validating the request
      const { error, value } = await UserSchemaValidate.validate(userdata);
      // console.log("ll", value);
      if (error) {
        fs.unlink(
          "./public/backend/uploads/user/" + path.basename(req.file.path),
          (err) => {
            console.log(`Error in removing the pic ${err}`);
          }
        );

        req.flash("error", `${error.details[0].message}`);
        return res.redirect("/register");
      } else {
        //call the create post function in the service and pass the data from the request
        const savedUserdata = await userRepositories.save(value);
        // console.log(savedUserdata);

        if (savedUserdata) {
          const token_model = new TokenModel({
            userId: savedUserdata._id,
            token: crypto.randomBytes(16).toString("hex"),
          });
          const token_data = await token_model.save();
          sendEmailVerificationRegister(req, savedUserdata, token_data.token);
          sendSMS(
            savedUserdata,
            `A Verification Link is sent to your email ${savedUserdata.email}. Please verify`
          );
          req.flash(
            "success",
            "A Verification Link is sent to your email, please verify the link before 4 minutes"
          );
          return res.redirect("/login");
        }
      }
    } catch (error) {
      console.log(`Error in creating user ${error}`);
      fs.unlink(
        "./public/backend/uploads/user/" + path.basename(req.file.path),
        (err) => {
          console.log(`Error in removing the pic ${err}`);
        }
      );
      return res.redirect("/register");
    }
  }

  //for confirmation
  async confirmation(req, res) {
    try {
      const token = await TokenModel.findOne({ token: req.params.token });
      const user = await userRepositories.findOne({
        _id: token.userId,
        email: req.params.email,
      });
      if (!token) {
        console.log("Verification link may be expired");
        req.flash("error", "Verification link may be expired");
        return res.redirect("/register");
      } else {
        if (!user) {
          req.flash("error", "User Not Found");
          return res.redirect("/register");
        } else if (user.isVerified) {
          req.flash("success", "User Already Verified");
          return res.redirect("/login");
        } else {
          user.isVerified = true;
          user.save();
          req.flash("success", "User Verification Successful");
          return res.redirect("/login");
        }
      }
    } catch (error) {
      console.log(`Error in confirmation ${error}`);
    }
  }

  //user login
  async loginPage(req, res) {
    try {
      res.render("user/views/frontend/login", {
        title: "User Login",
        data: req.user,
      });
    } catch (error) {
      console.log(`Error in getting login page ${error}`);
    }
  }

  //user login
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      //validation
      if (!email || !password) {
        req.flash("error", "All fields are Required");
        return res.redirect("/login");
      }

      //validate if user exist in database
      const user = await userRepositories.findOne({ email });
      if (!user) {
        req.flash("error", "Email does not exist");
        return res.redirect("/login");
      }

      const matchPassword = await comparePassword(password, user.password);
      if (!matchPassword) {
        req.flash("error", "Incorrect Password Detected");
        res.redirect("/login");
      }

      const role = await roleRepositories.findOne({ _id: user.roleId });
      if (role.roleName !== "user") {
        req.flash("error", "Please provide user credentials");
        return res.redirect("/login");
      }

      if (
        user &&
        matchPassword &&
        user.isVerified &&
        role.roleName === "user"
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
          res.cookie("userToken", token);
          sendSMS(user, "You are successfully logged in to E-Store");
          req.flash("success", "Logged in Successfully");
          res.redirect("/");
        } else {
          req.flash("error", "Login Failed");
          res.redirect("/login");
        }
      }
    } catch (err) {
      console.log(`Error in login admin ${err}`);
    }
  }

  //dashboard
  async dashboard(req, res) {
    try {
      const memberdata = await userRepositories.findById(req.user.id);
      res.render("user/views/frontend/dashboard", {
        title: "User Dashboard",
        data: req.user,
        memberdata,
      });
    } catch (error) {
      console.log(`Error in getting dashboard ${error}`);
    }
  }

  //logout
  async logout(req, res) {
    try {
      res.clearCookie("userToken");
      res.redirect("/login");
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserHomeController();
