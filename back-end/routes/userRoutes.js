const express = require("express");
const admin = require("firebase-admin");

const userRouter = express.Router();

userRouter.post("/claim-user-admin", async (req, res) => {
  try {
    const uid = req.body.uid;
    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
    });
    res.json({ result: true });
  } catch (error) {
    console.error(error);
    res.json({ result: false });
  }
});

module.exports = userRouter;
