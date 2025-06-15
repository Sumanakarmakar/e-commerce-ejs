const bcrypt = require("bcryptjs");

module.exports = comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};
