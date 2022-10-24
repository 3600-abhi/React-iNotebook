const jwt = require("jsonwebtoken");

// jo hmne (auth.js) me (JWT_SECRET) variable bnaya hai usi ko yahan hardcode kiya hai
const JWT_SECRET = "@abhi";

const fetchuser = (req, res, next) => {
  // Get the user from jwt token and add ID to request object
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using valid token 1" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error.message);
    return res
      .status(401)
      .send({ error: "Please authenticate using valid token 2" });
  }
};

module.exports = fetchuser;
