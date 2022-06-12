const express = require("express");
const eventRouter = express.Router();
const {
  getFirestore,
  getDocs,
  setDoc,
  doc,
  collection,
  query,
  where,
} = require("firebase/firestore");
const moment = require("moment");

/**
 *  Request to get events for the current week optional paramater is the date selected.
 *
 */
eventRouter.get("/getEvents", async (req, res) => {
  const db = getFirestore();

  const today = req.query.eventDate
    ? moment(req.query.eventDate).add(1, "day").toDate()
    : new Date();

  var year = today.getFullYear() % 100;
  var month =
    today.getMonth() + 1 < 10
      ? "0" + (today.getMonth() + 1).toString()
      : today.getMonth() + 1;
  var day =
    today.getDate() + 1 < 10
      ? "0" + (today.getDate() + 1).toString()
      : today.getDate() + 1;

  var nextweek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );
  var nextweekYear = nextweek.getFullYear() % 100;
  var nextweekMonth =
    nextweek.getMonth() + 1 < 10
      ? "0" + (nextweek.getMonth() + 1).toString()
      : nextweek.getMonth() + 1;
  var nextweekDay =
    nextweek.getDate() + 1 < 10
      ? "0" + (nextweek.getDate() + 1).toString()
      : nextweek.getDate() + 1;

  var lowerDateBound = parseInt(year + month + day);
  var upperDateBound = parseInt(nextweekYear + nextweekMonth + nextweekDay);

  var result = [];

  const q = query(
    collection(db, "event"),
    where("event_date", "<=", upperDateBound),
    where("event_date", ">=", lowerDateBound)
  );
  await getDocs(q)
    .catch((err) => res.json({ success: false, result: err }))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        result.push({ id: doc.id, data: doc.data() });
      });
      res.json({ success: true, result });
    });

  //get all the events for the current week
});

/**
 *  Request to create an Event for a user:
 * @description:
 * For a volunteer we are creating an event if they havent worked 3 shifts this current week
 * For a  staff we just always create the event.
 * When an event is created we need to check if the event time slot exists for that event.
 * If the event time slot does not exist we just create it. If it does then we add the existing
 *  event time slot referemce to the user event document.
 * @param userId
 * @param userType
 * @param eventDate
 * @param eventType
 * @param firstName
 * @param comment
 * @param slot;
 */
eventRouter.post("/createEvent", async (req, res) => {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const eventType = req.query.eventType;
  const userId = req.query.userId;
  const slot = req.query.slot;
  const date = req.query.eventDate ? req.query.eventDate : Date.now();
  const db = getFirestore();
  var dbDate = parseInt(date);

  const userEventRef = doc(collection(db, "event"));
  await setDoc(userEventRef, {
    uid: userId,
    event_date: dbDate,
    slot: slot,
    event_type: eventType,
    first_name: firstName,
    last_name: lastName,
  })
    .catch((err) => res.json({ success: false, result: err }))
    .then((writeResult) => {
      res.json({ success: true, result: writeResult });
    });

  //get all the events for the current week
});

module.exports = eventRouter;
