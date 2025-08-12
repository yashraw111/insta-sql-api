const bcrypt = require("bcryptjs");

exports.plainToHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

exports.hashToPlain = async (password, hashPassword) => {
  const output = await bcrypt.compare(password, hashPassword);
  return output;               
};
