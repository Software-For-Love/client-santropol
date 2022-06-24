const express = require("express");
const authRouter = express.Router();
const admin = require("firebase-admin");
var Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIR_TABLE_API,
});

var airTableBase = Airtable.base("appB7a5gvGu8ELiEp");

authRouter.post("/register", async (req, res) => {
  const email = req.body.email;

  airTableBase("👥 Volunteers")
    .select({
      fields: ["Courriel"],
      filterByFormula: `({Courriel}=\"${email}\")`,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        try {
          if (records.length > 0) {
            records.forEach(function () {
              res.json({ result: true });
            });
          } else {
            res.json({ result: false });
          }
        } catch (error) {
          res.json({ result: false });
        }
      },
      function done(err) {
        if (err) {
          console.error(err);
          res.json({ result: false });
        }
        res.json({ result: false });
      }
    );
});

authRouter.post("/claim-user-admin", async (req, res) => {
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

module.exports = authRouter;
