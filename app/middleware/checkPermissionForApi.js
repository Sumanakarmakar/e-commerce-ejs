const permissions = require("../helper/permissions");


const checkPermissionApi = (permission) => {
  return async (req, res, next) => {
    const user = req.user ? req.user.id : "anonymous";
    // console.log("user",user);
    
    const userPermissions = await permissions.getPermissionsByRoleName(user);
    // console.log("userpermission",userPermissions);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      res.status(403).json({
        message: "Access Denied"
      })
    }
  };
};
module.exports = { checkPermissionApi };