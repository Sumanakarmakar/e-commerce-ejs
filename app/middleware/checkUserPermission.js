const permissions = require("../helper/permissions");

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const user = req.user ? req.user.id : "anonymous";
    // console.log("user",user);
    
    const userPermissions = await permissions.getPermissionsByRoleName(user);
    // console.log("userpermission",userPermissions);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      req.flash("message", "Access Denied")
      res.redirect('/products')
    }
  };
};
module.exports = { checkPermission };
