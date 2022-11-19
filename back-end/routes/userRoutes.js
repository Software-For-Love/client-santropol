const express = require("express");
const admin = require("firebase-admin");
const userRouter = express.Router();
var Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIR_TABLE_API,
});

var airTableBase = Airtable.base("appB7a5gvGu8ELiEp");

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

/** collect-users
 * A script to migrate all firebase auth users to firestore users collection with First Name, Last Name, Email
 * 
 */
userRouter.post("/collect-users", async (req, res) => {
  try {
    const uid = req.body.uid;
    let userRecords = [];
    await admin.auth().listUsers(5).then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        console.log('user', userRecord.toJSON());
        userRecords.push(userRecord);

        //check if we have the email in firestore -> haveEmailInUsersCollection? addUIDtoExistingUserDoc: createNewUserDocWithEmailAndId

      });
      userRecords.forEach((user)=>{
        let 

      })
      
      // res.json({ result: true });



    }).catch((error) => {
      console.log('Error listing users:', error);
    });
  } catch (error) {
    console.error(error);
    res.json({ result: false });
  }
});

async function checkIfUserEmailExistsInUsers(email){

  
}
/**
 * @param: first_name
 * @param: last_name
 * @return: List of users who have that first name and last_name
 * 
 */
userRouter.post("/retrieve-users", async (req, res) => {
  try {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const db = getFirestore();

    let firstNameQuery = null;
    let lastNameQuery = null;
    let usersWithFirstName = [];
    let usersWithLastName  = [];
    if(first_name){
      firstNameQuery = query(
        collection(db, "user"),
        where("first_name", "==", first_name)
      );
      usersWithFirstName = await getDocsWrapper(firstNameQuery);
    }
    if(last_name){
      lastNameQuery = query(
        collection(db, "user"),
        where("last_name", "==", last_name)
      );
      usersWithLastName = await getDocsWrapper(lastNameQuery);

    }
    
    let result = [...new Set([...usersWithFirstName,...usersWithLastName])];
    res.json({ success: true, result});

  } catch (error) {
    console.error(error);
    res.json({ success: false, error });
  }
});

function getDocsWrapper(query) {
  return getDocs(query)
    .then((querySnapshot) => {
      let results = [];
      querySnapshot.docs.forEach((doc) => {
        results.push(doc.data());
      });
      return results;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

userRouter.put("/update-user-info", async (req, res) => {
  try {
    const { phoneNumber, pronouns, name, email } = req.body;
    if (email.split("@")[1] === "softwareforlove.com") {
      res.json({ result: true });
      return;
    }

    // find user in Airtable and update their info
    airTableBase("👥 Volunteers")
      .select({
        fields: ["Courriel", "full name (auto)"],
        filterByFormula: `({Courriel}=\"${email}\")`,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          try {
            records.forEach(async function () {
              const record = records[0];
              await airTableBase("👥 Volunteers").update(record.id, {
                Téléphone: phoneNumber,
                Courriel: email,
                Pronoun: pronouns,
                "full name (auto)": name,
              });
              res.json({ result: true });
            });
          } catch (error) {
            res.json({ result: false });
          }
        },
        function done(err) {
          console.error(err);
          res.json({ result: false });
        }
      );
  } catch (e) {
    console.error("Error updating user info ", e);
    res.json({ result: false, message: e });
  }
});

userRouter.get("/get-user-info", async (req, res) => {
  try {
    const { email } = req.query;
    // for test users, send dummy data
    if (email.split("@")[1] === "softwareforlove.com") {
      res.json({
        result: true,
        phoneNumber: "555-555-5555",
        pronouns: "they/them",
      });
    }

    airTableBase("👥 Volunteers")
      .select({
        fields: ["Courriel", "full name (auto)", "Téléphone", "Pronoun"],
        filterByFormula: `({Courriel}=\"${email}\")`,
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function () {
            const record = records[0];
            const displayName = record.get("full name (auto)");
            const phoneNumber = record.get("Téléphone");
            const pronouns = record.get("Pronoun");
            res.json({ result: true, displayName, phoneNumber, pronouns });
          });
        },
        function done(err) {
          if (err) {
            console.error(err);
            res.json({ result: false });
          }
          res.json({ result: false });
        }
      );
  } catch (e) {
    console.error("Error getting user info ", e);
    res.json({ result: false, message: e });
  }
});

module.exports = userRouter;
