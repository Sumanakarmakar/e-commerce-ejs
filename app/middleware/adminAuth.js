const jwt = require("jsonwebtoken");

const AdminAuthCheck = (req, res, next) => {
  // console.log("cookie", req.cookies);

  if (req.cookies && req.cookies.adminToken) {
    jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET, (err, data) => {
      req.admin = data;
      // console.log("requser", req.admin);
      next();
    });
  } else {
    next();
  }
};

module.exports = AdminAuthCheck;
