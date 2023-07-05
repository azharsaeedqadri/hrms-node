const auth = require("../utils/token");
module.exports = (req, res, next) => {
  console.log("Requested resources", req)
  try {
    let token = req.headers.authorization;
    if (token.startsWith("Bearer ")) {
      token = token.substring(7, token.length);
    } else {
      //Error
    }
    let payload = auth.verify(token);

    if (!payload) {
      res.status(200).json({
        data: null,
        statusCode: 400,
        message: "Invalid token",
      });
    } else {
      next();
    }
  } catch (e) {
    res.status(200).json({
      data: null,
      statusCode: 400,
      message: "Not logged in",
    });
  }
};
