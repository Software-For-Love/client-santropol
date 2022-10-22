const express = require("express");
const moment = require("moment");
const eventRouter = express.Router();
const {
  addDoc,
  getFirestore,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
  writeBatch,
} = require("firebase/firestore");

const WEEKLY_EVENT_LIMIT = 3;

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
      await deleteDoc(event.ref);
      let eventCancelRef = await addDoc(
        collection(db, "user_cancelled_event", cancel_event.uid, "cancels"),
        cancel_event
      );
      let count = 0;
      let userCancelledEvents = await getDocs(
        collection(db, "user_cancelled_event", cancel_event.uid, "cancels")
      );
      userCancelledEvents.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        count++;
      });

      let userEventCancelIncrment = await setDoc(
        doc(db, "user_cancelled_event", cancel_event.uid),
        { cancellations: count }
      );
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
  let eventDate = null;
  if (today.length == 6) {
    year = today.substring(0, 2);
    month = today.substring(2, 4);
    day = today.substring(4, 6);
    eventDate = moment(`20${year}-${month}-${day}`);
  }
  if (!eventDate) {
    res.json({ success: false, result: "Invalid Date format provided" });
  }
  const oneWeekLater = eventDate.add(6, "days");
  const oneWeekLaterFormatted = oneWeekLater.format("YYMMDD");

  const upperBound = parseInt(oneWeekLaterFormatted);
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
  const eventDate = req.query.eventDate;
  if (eventDate.length != 6) {
    res.json({ success: false, error: "Invalid Date Provided" });
  }
  let dateYear = eventDate.substring(0, 2);
  let dateMonth = eventDate.substring(2, 4);
  let dateDay = eventDate.substring(4, 6);
  let nextWeekDate = moment(`20${dateYear}-${dateMonth}-${dateDay}`)
    .add(6, "days")
    .format("YYMMDD");

  var lowerDateBound = parseInt(eventDate);
  var upperDateBound = parseInt(nextWeekDate);

  const cancelQuery = query(
    collection(db, "user_cancelled_event"),
    where("cancellations", ">=", 3)
  );

  let usersWithMoreThanThreeCancellations = await getDocs(cancelQuery);
  let userIdsWithMoreThanThreeCancellations = new Set();
  usersWithMoreThanThreeCancellations.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    userIdsWithMoreThanThreeCancellations.add(doc.id);
  });

  var result = [];
  const q = query(
    collection(db, "event"),
    where("event_date", "<=", upperDateBound),
    where("event_date", ">=", lowerDateBound),
    where("event_type", "==", eventType)
  );
  try {
    await getDocs(q)
      .catch((err) => res.json({ success: false, result: err }))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          var record = { id: doc.id, data: doc.data() };
          let hasCancelledThreeOrMoreEvents =
            userIdsWithMoreThanThreeCancellations.has(record.data.uid);
          record["cancelled"] = hasCancelledThreeOrMoreEvents;
          result.push(record);
        });

        res.json({ success: true, result });
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, result: e });
  }

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
  return results.size < WEEKLY_EVENT_LIMIT;
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
  const adminComment = req.body.adminComment? req.body.adminComment: 'NA';
  const typeOfDelivery = req.body.typeOfDelivery
    ? req.body.typeOfDelivery
    : "NA";
  const userType = req.body.userType ? req.body.userType : "admin";
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
    type_of_delivery: typeOfDelivery,
    admin_comment: adminComment,
    recurring_event: false
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
  const adminComment = req.body.adminComment? req.body.adminComment: 'NA';
  const typeOfDelivery = req.body.typeOfDelivery
    ? req.body.typeOfDelivery
    : "NA";

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
    type_of_delivery: typeOfDelivery,
    admin_comment: adminComment,
  })
    .catch((err) => res.json({ success: false, result: err }))
    .then((writeResult) => {
      res.json({ success: true, result: writeResult });
    });

  //get all the events for the current week
});

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
 * @param eventType
 * @param firstName
 * @param lastName
 * @param endDate
 * @param startDate
 * @param userType
 * @param comment
 * @param slot
 * @param adminComment
 * @param typeOfDelivery
 */
eventRouter.post("/recurringEvent", async (req,res)=> {
  const db = getFirestore();
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const eventType = req.body.eventType;
  const userId = req.body.userId;
  const slot = req.body.slot;
  const adminComment = req.body.adminComment? req.body.adminComment: 'NA';
  const typeOfDelivery = req.body.typeOfDelivery
    ? req.body.typeOfDelivery
    : "NA";
  const userType = req.body.userType ? req.body.userType : "admin";
  const startDate = req.body.startDate.length != 6 ? moment(req.body.startDate) : getDBDateFromString(req.body.startDate);
  const endDate = req.body.endDate.length != 6 ? moment(req.body.endDate) : getDBDateFromString(req.body.endDate);
  const userComment = req.body.userComment ? req.body.userComment : "";

 //Need to determine number of weeks in advance as set by the end date
 //Need to create event
  while(startDate <= endDate){
    var userEventRef = doc(collection(db, "event"));
    var startOfWeek = getStartOfWeek(startDate);
    var endOfWeek = getStartOfWeek(startDate).add(6, "days");
    let dbDate =  startDate.format("YYMMDD");  //parseInt(getDateNumber(startDate));
    const validUserEvent = await checkUserEventsLimit(
      userId,
      startOfWeek,
      endOfWeek
    );
    if(validUserEvent || userType != "volunteer"){
      await setDoc(userEventRef, {
        uid: userId,
        event_date: dbDate,
        slot: slot || 0,
        event_type: eventType,
        first_name: firstName,
        last_name: lastName,
        key: userEventRef.id,
        user_comment: userComment,
        type_of_delivery: typeOfDelivery,
        admin_comment: adminComment,
        recurring_event: true
      })
    }
    startDate.add(7, "days");
  }
  res.status(200).json({success: true, result: "Added events, please verify future events" })
})
module.exports = eventRouter;
