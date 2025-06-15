const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userRepositories = require("../modules/user/repositories/user.repositories");
const hashPassword = require("../helper/hashPassword");
const { UserSchemaValidate } = require("../modules/user/model/user.model");
const {
  sendEmailVerificationRegister,
  sendEmailVerificationForgotPW,
} = require("../helper/mailCheckforApi");
const TokenModel = require("../modules/user/model/token.model");
const comparePassword = require("../helper/comparePassword");
const { getRelativePath } = require("../helper/ImageUpload");
const sendSMS = require("../helper/sendSMS");

class UserApiController {
  //create user
  async createUser(req, res) {
    try {
      const { name, email, phone, password, roleId } = req.body;
      if (!name || !email || !phone || !password || !roleId) {
        return res.status(400).json({
          message: "All Fields are Required",
        });
      }
      //check duplicate email
      const existingEmail = await userRepositories.findOne({ email });
      if (existingEmail) {
        fs.unlink(
          "./public/backend/uploads/user/" + path.basename(req.file.path),
          (err) => {
            console.log(`Error in removing the pic ${err}`);
          }
        );
        return res.status(400).json({
          message: "Email Already Exists. Please proceed for login",
        });
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

        return res.status(400).json({
          message: `${error.details[0].message}`,
        });
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
          return res.status(201).json({
            status: 200,
            message:
              "A Verification Link is sent to your email, please verify the link before 4 minutes",
            data: savedUserdata,
          });
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
      return res.status(500).json({
        message: "Internal Server Error",
      });
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
        sendEmailVerificationRegister(req, req.params.email, req.params.token);
        return res.status(400).json({
          message: "Verification link may be expired",
        });
      } else {
        if (!user) {
          return res.status(400).json({
            message: "User Not Found",
          });
        } else if (user.isVerified) {
          return res.status(400).json({
            message: "User is Already Verified",
          });
        } else {
          user.isVerified = true;
          user.save();
          sendSMS(user, "User Registration Successful");
          return res.status(200).json({
            message:
              "User Verification Successful, now you can proceed for login",
          });
        }
      }
    } catch (error) {
      console.log(`Error in confirmation ${error}`);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  //for login
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      //validation
      if (!email || !password) {
        return res.status(500).json({
          message: "Invalid email or password",
        });
      }

      //validate if user exist in database
      const user = await userRepositories.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "Email does not exist",
        });
      }

      const matchPassword = await comparePassword(password, user.password);
      if (!matchPassword) {
        return res.status(400).json({
          message: "Incorrect Password Detected",
        });
      }

      if (user && matchPassword && user.isVerified) {
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
          return res.status(200).json({
            status: 200,
            message: "Logged in Successfully",
            data: user,
            token: token,
          });
        } else {
          return res.status(400).json({
            message: "Login Failed",
          });
        }
      }
    } catch (err) {
      console.log(`Error in login user ${err}`);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  //get profile details
  async profile(req, res) {
    try {
      const id = req.user.id;
      const userdata = await userRepositories.findById(id);
      if (userdata) {
        return res.status(200).json({
          message: "Profile data fetched successfully",
          details: userdata,
        });
      } else {
        return res.status(400).json({
          message: "Error occured in fetching profile details",
        });
      }
    } catch (error) {
      console.log(`Error in getting profile ${error}`);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  //edit profile pic
  async updateProfilePic(req, res) {
    try {
      const id = req.user.id;
      const existingUser = await userRepositories.findById(id);
      if (req.file) {
        fs.unlink(
          "./public/backend/uploads/user/" +
            path.basename(existingUser.profile_pic),
          (err) => {
            console.log(`Error in removing old pic ${err}`);
          }
        );
        req.body.profile_pic = getRelativePath(req.file.path);
      } else {
        req.body.profile_pic = existingUser.profile_pic;
      }

      const updatedPic = await userRepositories.findByIdAndUpdate(id, req.body);
      if (updatedPic) {
        return res.status(200).json({
          status: 200,
          message: "Profile Image Updated Successfully",
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: "Error detected in updating profile picture",
        });
      }
    } catch (error) {
      console.log(`Error in updating profile pic ${error}`);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  //for updating profile details
  async updateProfileData(req, res) {
    try {
      const id = req.user.id;
      const detaildata = await userRepositories.findById(id);
      const userdata = await userRepositories.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
      });
      if (userdata) {
        return res.status(200).json({
          status: 200,
          message: "Member Data updated Successfully",
        });
      } else {
        (req.body.name = detaildata.name), (req.body.phone = detaildata.phone);
        return res.status(400).json({
          status: 400,
          message: "Error detected in updating profile details",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  //for updating password
  async updatePassword(req, res) {
    try {
      const id = req.user.id;
      const { currentPassword, newPassword } = req.body;
      const user = await userRepositories.findById(id);
      const existingComparePW = await comparePassword(
        currentPassword,
        user.password
      );
      if (!existingComparePW) {
        return res.status(400).json({
          status: 400,
          message: "Invalid Current Password",
        });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          status: 400,
          message: "New Password must be different from current password",
        });
      }
      const hashedPW = await hashPassword(newPassword);
      const savedPWData = await userRepositories.findByIdAndUpdate(id, {
        password: hashedPW,
      });
      if (savedPWData) {
        return res.status(200).json({
          status: 200,
          message: "Your Password is updated Successfully",
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: "Error detected in updating password",
        });
      }
    } catch (error) {
      console.log(`Error in updating passsword ${error}`);
      return res.status(500).json({
        message: "Interna Server Error",
      });
    }
  }

  //forget password
  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await userRepositories.findOne({ email });
      const token_model = new TokenModel({
        userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      const token_data = await token_model.save();

      if (!user) {
        return res.status(400).json({
          status: 400,
          message: "Please enter the registered Email ID",
        });
      } else {
        sendEmailVerificationForgotPW(req, user, token_data.token);
        sendSMS(
          user,
          `A password reset link is sent to this email ${user.email}. Please verify.`
        );
        return res.status(200).json({
          status: 200,
          message:
            "A password reset link is sent to your email ID. Please verify within 4 minutes.",
        });
      }
    } catch (error) {
      console.log(`Error in forget password email verify ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async resetPWConfirmation(req, res) {
    try {
      const { email, token } = req.params;
      const tokendata = await TokenModel.findOne({ token });
      if (!tokendata) {
        return res
          .status(400)
          .json({ message: "Verification link may have expired." });
      }

      const userdata = await userRepositories.findOne({
        _id: tokendata.userId,
        email,
      });

      if (!userdata) {
        return res.status(400).json({
          status: 400,
          message: "Please Register Yourself First",
        });
      } else {
        return res.status(200).json({
          status: 200,
          message: "Password reset verification successful",
        });
      }
    } catch (error) {
      console.log(`Error in password reset confirmation ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email } = req.params;
      const { newPassword } = req.body;

      const existingUser = await userRepositories.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          status: 400,
          message: "User doesn't exist",
        });
      }

      const hashedPW = await hashPassword(newPassword);
      const updatedPw = await userRepositories.findByIdAndUpdate(
        existingUser._id,
        { password: hashedPW }
      );
      if (updatedPw) {
        sendSMS(existingUser, "Your Password Reset Successful");
        return res.status(200).json({
          status: 200,
          message: "Your password reset successful",
        });
      }
    } catch (error) {
      console.log(`Error in reset password ${error}`);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
}

module.exports = new UserApiController();
