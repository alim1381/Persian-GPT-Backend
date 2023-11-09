const jwt = require("jsonwebtoken");

const generateToken = async (userId, expireTime) => {
  const token = jwt.sign({ id: userId }, process.env.TOKEN_SECRET_KEY, {
    expiresIn: expireTime,
  });
  return token;
};

module.exports = generateToken;
