const express = require("express");
const moment = require("moment");
const eventRouter = express.Router();
const {
  getFirestore,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
  addDoc,
  getDoc,
} = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const acceptedEventStates = ["completed", "cancelled"];
const { Event } = require("../../models/event");
const { deliveryEvent } = require("../../models/deliveryEvent");
const e = require("express");

eventRouter.post("/setEventGroup", async (req, res) => {
  const db = getFirestore();
  const eventType = req.body.eventType ? req.body.eventType : "kitam";
  const eventDate = req.body.eventDate;
  const slots = req.body.slots;

  const userEventRef = doc(
    collection(db, "event_group"),
    eventType + eventDate
  );
  await setDoc(userEventRef, {
    eventType: eventType,
    dateNumber: parseInt(eventDate),
    slots,
  })
    .catch((err) => {
      res.json({ success: false, result: err });
    })
    .then((wr) => {
      res.json({ success: true, result: "Add Slot Success" });
    });
});

/**
 *  Request to get events for the current week optional paramater is the date selected.
 *
 *  @param  eventType: Optional parameter for event type default value is kit am
 *  @param  eventDate: Optional parameter for event date default value is today
 *
 *
 */

eventRouter.get("/getWeeklyEventSlots", async (req, res) => {
  const db = getFirestore();
  let eventType = req.query.eventType ? req.query.eventType : "kitam";
  const today = req.query.eventDate;
  let defaultWeeklyEvents = [3, 3, 3, 3, 3, 3, 3];

  const upperBound = getDateNumber(getStartOfWeek(today).add(6, "days"));
  const lowerBound = parseInt(today);
  var result = [];

  const q = query(
    collection(db, "event_group"),
    where("dateNumber", "<=", upperBound),
    where("dateNumber", ">=", lowerBound),
    where("eventType", "==", eventType)
  );
  try {
    await getDocs(q)
      .catch((err) =>
        //  res.json({ success: false, result: err };
        console.error(err)
      )
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          result.push({ id: doc.id, data: doc.data() });
        });
        res.json({ success: true, result: result });
      });
  } catch (e) {
    res.json({ success: false, result: e });
  }
});
/**
 *  Request to get events for the current week optional paramater is the date selected.
 *
 *  @param  eventType: Optional parameter for event type default value is kit am
 *  @param  eventDate: Optional parameter for event date default value is today
 *
 *
 */
eventRouter.get("/getEvents", async (req, res) => {
  //Optional event type, default value is kitam
  let eventType = req.query.eventType ? req.query.eventType : "kitam";
  const db = getFirestore();
  const today = req.query.eventDate
    ? moment(req.query.eventDate).toDate()
    : new Date();
  var year = today.getFullYear() % 100;
  var month =
    today.getMonth() + 1 < 10
      ? "0" + (today.getMonth() + 1).toString()
      : (today.getMonth() + 1).toString();
  var day =
    today.getDate() < 10 ? "0" + today.getDate().toString() : today.getDate();
  var nextweek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 6
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
    where("event_date", ">=", lowerDateBound),
    where("event_type", "==", eventType)
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

function getStartOfWeek(event_date) {
  let year, month, day, eventDate;
  if (event_date.length != 6) {
    eventDate = moment(event_date);
  } else {
    eventDate = getDBDateFromString(event_date);
  }

  startOfTheWeek = eventDate.subtract(eventDate.toDate().getDay(), "days");
  return startOfTheWeek;
}

function getDBDateFromString(event_date) {
  year = event_date.toString().substring(0, 2);
  month = event_date.toString().substring(2, 4);
  day = event_date.toString().substring(4, 6);
  eventDate = moment(`20${year}-${month}-${day}`);
  return eventDate;
}

async function checkUserEventsLimit(userid, weekStartDate, endDate) {
  const db = getFirestore();
  let weekStartDateNumber = getDateNumber(weekStartDate);
  let weekEndDateNumber = getDateNumber(endDate);

  const q = query(
    collection(db, "event"),
    where("event_date", ">=", weekStartDateNumber),
    where("event_date", "<", weekEndDateNumber),
    where("uid", "==", userid)
  );
  const results = await getDocs(q);
  return results.size < 3;
}

function getDateNumber(date) {
  let month = "";
  let day = "";
  if (date.length == 6) {
    return date;
  }
  date = moment(date);
  if (date.month() + 1 < 10) {
    month = "0" + (date.month() + 1).toString();
  } else {
    month = (date.month() + 1).toString();
  }
  if (date.day() < 10) {
    day = "0" + date.day().toString();
  } else {
    day = date.day().toString();
  }
  let dateString = date.year().toString().substring(2, 4) + month + day;
  let intDate = +dateString;
  return intDate;
}

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
  const db = getFirestore();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const eventType = req.body.eventType;
  const userId = req.body.userId;
  const slot = req.body.slot;
  const typeOfDelivery = req.body.typeOfDelivery;
  const userType = req.body.userType;
  const date = req.body.eventDate ? req.body.eventDate : Date.now();

  const userComment = req.body.userComment ? req.body.userComment : "";

  var dbDate = parseInt(getDateNumber(date));

  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = getStartOfWeek(date).add(6, "days");
  const validUserEvent = await checkUserEventsLimit(
    userId,
    startOfWeek,
    endOfWeek
  );

  if (!validUserEvent && userType === "volunteer") {
    res.json({
      success: false,
      error: "User has volunteered for 3 events this week",
    });
    return;
  }

  const userEventRef = doc(collection(db, "event"));
  await setDoc(userEventRef, {
    uid: userId,
    event_date: dbDate,
    slot: slot || 0,
    event_type: eventType,
    first_name: firstName,
    last_name: lastName,
    key: userEventRef.id,
    user_comment: userComment,
  })
    .catch((err) => res.json({ success: false, result: err }))
    .then((writeResult) => {
      res.json({ success: true, result: writeResult });
    });
});

/**
 *  Request to create an Event for a user:
 * @description:
 * For a volunteer we are creating an event if they havent worked 3 shifts this current week
 * For a  staff we just always create the event.
 * When an event is created we need to check if the event time slot exists for that event.
 * If the event time slot does not exist we just create it. If it does then we add the existing
 *  event time slot referemce to the user event document.
 *
 * @param event_id the ID of the event document to be edited **Mandatory
 * @param userId
 * @param userType
 * @param eventDate
 * @param eventType
 * @param firstName
 * @param comment
 * @param slot;
 */
eventRouter.post("/editEvent", async (req, res) => {
  const eventId = req.body.event_id;
  if (!eventId) {
    res.json({ success: false, result: "Event ID is required" });
  }
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const eventType = req.body.eventType;
  const userId = req.body.userId;
  const slot = req.body.slot;
  const date = req.body.eventDate ? req.body.eventDate : Date.now();
  const userComment = req.body.userComment ? req.body.userComment : "";

  const db = getFirestore();
  var dbDate = parseInt(date);

  const userEventRef = doc(collection(db, "event"), eventId);
  await updateDoc(userEventRef, {
    uid: userId,
    event_date: dbDate,
    slot: slot,
    event_type: eventType,
    first_name: firstName,
    last_name: lastName,
    user_comment: userComment,
  })
    .catch((err) => res.json({ success: false, result: err }))
    .then((writeResult) => {
      res.json({ success: true, result: writeResult });
    });

  //get all the events for the current week
});

/** 
 * @description:
  Remove a user from their assigned event. A user can do this, as long as the event is not two days before the event. 
  If so, staff/admin will need to be contacted.
  Copy the event to the user_cancelled_event location in the db in order to keep track of user cancelled events
  
  @param key: The key of the unique event in firestore that is having the current user removed
  @param role: Role of the user making the request -> volunteer, staff, or admin
  @param uid
  @param reason: The reason for the cancellation
*/
eventRouter.post("/removeUserFromEvent", async (req, res) => {
  let db = getFirestore();
  let eventCollectionRef = collection(db, "event");
  let q;
  let event;
  let cancel_event;
  try {
    if (req.body.key && req.body.role) {
      q = query(eventCollectionRef, where("key", "==", req.body.key));
      event = (await getDocsWrapper(q))[0];
    } else {
      res
        .status(400)
        .json({ success: false, result: "No valid body parameters" });
    }
    if (!event) {
      res.status(404).json({ success: false, result: "No returned values" });
    }
    //Can only remove as a volunteer if greater than 2 days away, staff/admin can remove anytime. Considered cancelled
    else if (
      req.body.role == "volunteer" &&
      (event.data().event_date - getDateNumber(new Date()) < 2 ||
        req.body.uid != req.user.uid)
    ) {
      res
        .status(403)
        .json({
          success: false,
          result: "Not allowed to remove, contact staff",
        });
    } else {
      cancel_event = {
        event_id: event.id,
        uid: req.body.uid,
        reason: req.body.reason ? req.body.reason : "",
      };
      await updateDoc(event.ref, { uid: "" });
      await addDoc(collection(db, "user_cancelled_event"), cancel_event);
      res.status(200).json({ success: true, result: cancel_event });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, result: e });
  }
});

/** 
 * @description:
  Request to get events depending on a user.
  Can include query parameters to get completed or cancelled events. 
  This route is accessible by ALL staff/admin, not by any volunteers
* 
* @BodyParameters
* @param uid    The user ID whose past events are in question
*  @param role   The role of the current user making the request (SHOULD also be added to user object in db)
* 
* @queryParameters
* @param event_status   Values -> completed or cancelled
*/
eventRouter.get("/getUserPastEvents", async (req, res) => {
  let q;
  //Checking if user is staff.  if volunteer, then that person ONLY accessing their own data
  if (
    req.body.uid &&
    (req.body.role == "staff" ||
      req.body.role == "admin" ||
      req.body.uid == req.user.uid)
  ) {
    const db = getFirestore();
    if (req.query.event_status == acceptedEventStates[1]) {
      q = query(
        collection(db, "user_cancelled_event"),
        where("uid", "==", req.body.uid)
      );
      getDocsWrapper(q)
        .then((results) =>
          res.status(200).json({ result: results.map((val) => val.data()) })
        )
        .catch((err) => res.status(400).json({ success: false, result: err }));
    } else if (req.query.event_status == acceptedEventStates[0]) {
      q = query(
        collection(db, "event"),
        where(req.query.event_status, "==", true),
        where("uid", "==", req.body.uid)
      );
      getDocsWrapper(q)
        .then((results) =>
          res.status(200).json({ result: results.map((val) => val.data()) })
        )
        .catch((err) => res.status(400).json({ success: false, result: err }));
    }
    //If no query is supplied, give both cancelled and past events
    else {
      q = query(collection(db, "event"), where("uid", "==", req.body.uid));
      let q2 = query(
        collection(db, "user_cancelled_event"),
        where("uid", "==", req.body.uid)
      );
      try {
        let result1 = await getDocsWrapper(q);
        let result2 = await getDocsWrapper(q2);
        res
          .status(200)
          .json({
            success: true,
            result: {
              ...result1.map((val) => val.data()),
              ...result2.map((val) => val.data()),
            },
          });
      } catch (err) {
        res.status(400).json({ success: false, result: err });
      }
    }
  } else {
    res
      .status(403)
      .json({
        success: false,
        result: "Not authorized to get this user's data",
      });
  }
});

function getDocsWrapper(query) {
  return getDocs(query)
    .then((querySnapshot) => {
      let results = [];
      querySnapshot.docs.forEach((doc) => {
        results.push(doc);
      });
      return results;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

function getDateNumber(date) {
  let month = "";
  let day = "";
  if (date.getMonth() + 1 < 10) {
    month = "0" + (date.getMonth() + 1).toString();
  } else {
    month = (date.getMonth() + 1).toString();
  }
  if (date.getDate() < 10) {
    day = "0" + date.getDate().toString();
  } else {
    day = date.getDate().toString();
  }
  let dateString = date.getFullYear().toString().substring(2, 4) + month + day;
  let intDate = +dateString;
  return intDate;
}

eventRouter.post("/deleteEvent", async (req, res) => {
  const db = getFirestore();
  const eventId = req.body.event_id;
  console.log("Event Delete request");
  if (!eventId) {
    res.json({ success: false, result: "Event ID is required" });
  }
  const userDeleteEventRef = doc(collection(db, "event"), eventId);
  await deleteDoc(userDeleteEventRef)
    .catch((err) => res.json({ success: false, result: err }))
    .then((result) => {
      res.json({ success: true, result: "Event Delete Success" });
    });
  return;

  //get all the events for the current week
});

module.exports = eventRouter;
