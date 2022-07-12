const express = require("express");
const moment = require("moment");
const eventRouter = express.Router();
const {
  getFirestore,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
  addDoc,
} = require("firebase/firestore");
const {getAuth, } = require("firebase/auth")
const acceptedEventStates = ["completed", "cancelled"];
const { Event } = require("../../models/event");
const {deliveryEvent} = require("../../models/deliveryEvent")
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
      : today.getMonth() + 1;
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

function getStartOfWeek(event_date){
  console.log("Started");  
  const year = event_date.toString().substring(0, 2);
  const month = event_date.toString().substring(2, 4);
  const day = event_date.toString().substring(4, 6);
  const eventDate = moment(`20${year}-${month}-${day}`);
  const startOfTheWeek = eventDate.subtract(eventDate.toDate().getDay(), "days");
  return startOfTheWeek;
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
  console.log("Date Int:"+ intDate);
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
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const eventType = req.body.eventType;
    const userId = req.body.userId;
    const slot = req.body.slot;
    const date = req.body.eventDate ? req.body.eventDate : Date.now();
    const typeOfDelivery = req.body.typeOfDelivery;
    const userType = req.body.userType;

    const userComment = req.body.userComment ? req.body.userComment : "";
    const db = getFirestore();
    const dbDate = parseInt(date);
    
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = getStartOfWeek(date).add(6,"days");
    const validUserEvent = await checkUserEventsLimit(userId,startOfWeek.toDate(),endOfWeek.toDate());
    console.log("User event is valid : "+ validUserEvent);
    if(!validUserEvent && userType === 'volunteer'){
      res.json({ success: false, error: "User has volunteered for 3 events this week" });
      return;
    }
    const userEventRef = doc(collection(db, "event"));
    const result = await setDoc(userEventRef, {
      uid: userId,
      event_date: dbDate,
      slot: slot,
      event_type: eventType,
      first_name: firstName,
      last_name: lastName,
      user_comment: userComment
    });
    res.json({ success: true, result: result || "no result" });
  } catch (error) {
    console.log("Error occurred");
    res.json({ success: false, error: error });
  }
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
  Remove a user from their assigned event
  Copy the event to the user_cancelled_event location in the db in order to keep track of user cancelled events
  
  @req
  @param key : The key of the unique event in firestore that is having the current user removed

*/
eventRouter.post("/removeUserFromEvent", async (req, res) => {
  

  if(req.body.role == "volunteer" && moment(req.body.event_date).date() - moment().date() < 2) { 
    res.status(403).json({result: "Not allowed to remove less than 2 days before event"});
  } 
  else {
    db = getFirestore()
    q = query(db,
      where("key", "==", req.body.key)
    )
    let event;
    try{
      event = await getDocsWrapper(q,res)[0];
      if(!event.uid){
        res.status(405).json({sucess: false, result: "No uid in event"})
      }
      else if(res.status != 400){
        // if(doc.getEventType == "deldr"){
        //   eventMetadata = deliveryEvent(event);
        // } 
        // else {
        //   eveventMetadata = Event(event);
        // }
        await updateDoc(event.ref, {"uid": ""});
        await addDoc(collection(db, "user_cancelled_events"), event.data());
        res.status(200).json({success: true});
      }
    } catch(e){
      res.status(400).json({success: false, result: err});
    }
  }
})







function mockStaffAuth(req,res,next){ //There would be an actual auth check to see if 
  if(req.body.role == 'staff'){
    req.user = {};
    req.body.uid = 'gr5146032532';
    next();
  } else {
   res.status(401).json({success: false, error: "Not staff"});
  }
}

/** 
 * @description:
  Request to get events depending on a user.
  Can include query parameters to get completed or cancelled events. 
  This route is accessible by ALL staff, not by any volunteers
  route parameters: 
  userId

  
* @queryParameters
  event_status -> completed or cancelled
*/
eventRouter.get('/getUserPastEvents/',  (req, res)=> {
  //Temp pass in staff or volunteer type in req, DO NOT LEAVE AS LONG TERM SOLUTION
  if (req.body.uid && req.user.role == "staff"){
    const db = getFirestore();
    if(req.query.event_status == acceptedEventStates[1]){
      const q = query(
        collection(db, "user_cancelled_events" ),
        where("uid", "==", req.body.uid)
        );
      getDocsWrapper(q).then(results => res.status(200).json({result: results}))
      .catch(err => res.status(400).json({success: false, result: err}));
    } 
    else if (req.query.event_status == acceptedEventStates[0]){
      const q = query(
        collection(db, "past_events" ),
        // where(req.query.event_status, "==", true),
        where("uid", "==", req.body.uid)
        );
      getDocsWrapper(q).then(results => res.status(200).json({result: results}))
      .catch(err => res.status(400).json({success: false, result: err}));
    }
    else{
      const q = query(
        collection(db, "past_events" ),
        where("uid", "==", req.body.uid)
        );
      getDocsWrapper(q).then(results => res.status(200).json({result: results}))
        .catch(err => res.status(400).json({success: false, result: err}));
    }
  }
  else if (req.body.uid) {

  }
})


function getDocsWrapper(query){
  return getDocs(query).then((querySnapshot) => {
    let counter = 0;
    let results = [];
    let extraDocInfo = [];
    querySnapshot.docs.forEach(doc => {
      results.push(doc);
      extraDocInfo.push({"ref":doc.ref});
    })
    return results;
    // res.status(200).json({result: results});
  }).catch(err => {throw new Error(err)});  //catch(err => res.status(400).json({success: false, result: err}))
}


module.exports = eventRouter;
