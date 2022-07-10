const express = require("express");
const authRouter = express.Router();
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
      fields: ["Courriel", "full name (auto)"],
      filterByFormula: `({Courriel}=\"${email}\")`,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        try {
          if (records.length > 0) {
            records.forEach(function () {

              var record = records[0]
              var name =  record.get("full name (auto)")
              res.json({ result: true, fullName: name});
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

module.exports = authRouter;
