const jwt = require("jsonwebtoken");

const getResponse = (data, code, message) => {
  return { data, code, message };
};

const getUserIDByBearerToken = (token) => {
  try {
    const decoded = jwt.decode(token);

    return decoded.user_id;
  } catch (err) {
    console.error("Error: ", err);
  }
};

module.exports = {
  getResponse,
  getUserIDByBearerToken,
};
