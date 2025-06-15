const jwt = require("jsonwebtoken");

const UserAuthCheck = (req, res, next) => {
  // console.log("cookie", req.cookies);

  if (req.cookies && req.cookies.userToken) {
    jwt.verify(req.cookies.userToken, process.env.JWT_SECRET, (err, data) => {
      req.user = data;
      // console.log("requser", req.admin);
      next();
    });
  } else {
    next();
  }
};

module.exports = UserAuthCheck;
