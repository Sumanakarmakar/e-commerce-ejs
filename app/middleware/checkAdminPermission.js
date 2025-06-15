const permissions = require("../helper/permissions");

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const user = req.admin ? req.admin.id : "anonymous";
    // console.log("user",user);

    const userPermissions = await permissions.getPermissionsByRoleName(user);
    // console.log("userpermission",userPermissions);

    if (userPermissions.includes(permission)) {
      return next();
    } else {
      req.flash("error", "Access Denied");
      if (req.url.startsWith("/category")) {
        res.redirect("/admin/category/list");
      } else if (req.url.startsWith("/product")) {
        res.redirect("/admin/product/list");
      } else {
        res.redirect("/admin/dashboard");
      }
    }
  };
};
module.exports = { checkPermission };
