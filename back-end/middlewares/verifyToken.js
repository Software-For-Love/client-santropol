const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  try {
    // don't need to check for token when user is trying to register
    if (!req.url?.startsWith("/auth")) {
      const token = req.headers.authorization;
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; //now we can use req.user to get the user object
      next();
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Unauthorized" });
  }
};

module.exports = verifyToken;
