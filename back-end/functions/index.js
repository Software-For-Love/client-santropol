/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const { Event } = require("./event");
const { DeliveryEvent } = require("./deliveryEvent");
const { rejects } = require("assert");
admin.initializeApp();

const firestoreService = admin.firestore();
const eventsRef = firestoreService.collection("events");
const recurEventRef = firestoreService.collection("recurring_events");
const oneDayMilliseconds = 24 * 60 * 60 * 1000;
const maxEventsPerWeek = 3;
const numOfWeeksAhead = 3;

exports.sampleCreation = functions.https.onRequest((req, res) => {
  let testEvent = new Event();
  testEvent.setDate = 220624;
  testEvent.setEventType = "kitpm";
  testEvent.setFirstName = "carl";
  testEvent.setLastName = "Anthoney";
  testEvent.setUid = "ad121asd3";
  testEvent.setSlot = 1;
  let {...a} = testEvent;
  eventsRef.add(a).then(() =>{
      recurEventRef.add({
      end_date: "2022-12-01T05:00:00.000Z",
      event_type: "deldr",
      delivery_type: "car",
      last_name: "carl",
      uid: "ad121asd3",
      int_day_of_week: 2,
      first_name: "Anthoney",
      new_recurring_event: true
    })
    recurEventRef.add({
      end_date: "2022-12-01T05:00:00.000Z",
      event_type: "kitpm",
      last_name: "carl",
      uid: "ad121asd3",
      int_day_of_week: 3,
      first_name: "Anthoney",
      new_recurring_event: true
    })
  })
})
/**
 * Cloud function used to delete shifts that have passed and generate future shifts. To run every Sunday at 9:00 AM.
 */
exports.createEvent = functions.https.onRequest(async (req,res)=> {
// exports.scheduledShiftGenerator = functions.pubsub.schedule("0 9 * * 0").timeZone("America/New_York").onRun(async (context) =>{
  console.log('creating...');
  let recurringEvents = await recurEventRef.get();
  for (let item of recurringEvents.docs) {
  let futureStartDate = new Date();
    let event = createEvent(item);
    //If this is a new recurring event, need to setup all the future weeks. Otherwise, just add the event to the furthest future week
    if(item.data().new_recurring_event){
      for (let i = 0; i <= numOfWeeksAhead; i++){
        futureStartDate = new Date();
        futureStartDate.setTime(futureStartDate.getTime() + i * oneDayMilliseconds * 7);
        try{
          await fillRecurringEvents(item, futureStartDate);
          await recurEventRef.doc(item.id).update({new_recurring_event: false});
        } catch(err){
          console.log("couldn't set the document to false or couldn't make event");
          return;
        }
      }

    } 
    else {
      futureStartDate.setTime(futureStartDate.getTime() + numOfWeeksAhead * 7 * oneDayMilliseconds);
      await fillRecurringEvents(item, futureStartDate);

    }
  }
});

//Typically should be sunday (starts at 0)
async function fillRecurringEvents(item, futureStartingDate){ 
          let newDate = new Date(futureStartingDate);
          futureStartingDate = new Date(futureStartingDate);
          let newEvent = createEvent(item);
  		    newDate.setTime(newDate.getTime() + item.data().int_day_of_week*oneDayMilliseconds); 
          // let newRecurEventCondition = await checkIfNewRecurringEvent(item, newDate);
			    let eventLimitCondition = await checkUserEventsLimit(item.data().uid,futureStartingDate.getTime());          
          if(newDate < new Date(item.data().end_date) && eventLimitCondition) {
            let dateNumber = getDateNumber(newDate);
            let dateString = getDateString(newDate);
            newEvent.setDate = dateNumber;
            newEvent.setDateTxt = dateString;
            if(item.data().event_type === "deldr") {
              newEvent = new DeliveryEvent(newEvent);
              newEvent.setDeliveryType = item.data().delivery_type;
            }
            try{
              await eventsRef.doc(newEvent.getKey).create(JSON.parse(JSON.stringify(newEvent)));
              return true;

            }catch(err){
              console.log(err);
            }
            
          } 
          else if (!eventLimitCondition) {
            console.log("yes events exceeded" + getDateNumber(newDate));
          }
        return false;
}

function createEvent(item) {
  let event = new Event();
  event.setTimeEnd =
    Event.event_times[item.data().event_type]["normal_shift"].time_end;
  event.setTimeStart =
    Event.event_times[item.data().event_type]["normal_shift"].time_start;
  event.setEventType = item.data().event_type;
  event.setFirstName = item.data().first_name;
  event.setKey = eventsRef.doc().id;
  event.setLastName = item.data().last_name;
  event.setNote = item.data().comment ? item.data().comment : "";
  event.setUid = item.data().uid;
  return event;
}

function getSlotNumber(eventDate, eventType) {
  let existingEvents = eventsRef
    .where("event_date", "==", eventDate)
    .where("event_type", "==", eventType)
    .orderBy("slot", "desc")
    .get();
  return existingEvents.then((docs) => {
    if (docs.size == 0) {
      return 1;
    } else {
      return docs.docs[0].data().slot + 1;
    }
  });
}

//Check the number of events a user has in upcoming week. Must not exceed current limit
//Current limit: 3
async function checkUserEventsLimit(userid, weekStartDate) {
  weekStartDate = new Date(weekStartDate);
  let weekEndDate = new Date(weekStartDate);
  weekEndDate.setTime(weekEndDate.getTime() + 5 * oneDayMilliseconds);
  let weekStartDateNumber = getDateNumber(weekStartDate);
  let weekEndDateNumber = getDateNumber(weekEndDate);
  let results = await eventsRef
    .where("event_date", ">=", weekStartDateNumber)
    .where("event_date", "<=", weekEndDateNumber)
    .where("uid", "==", userid)
    .get();
  return results.size < maxEventsPerWeek ? true : false;
}

//Check in advance, at least a week, to see if this recurring event has already been done before.
// function checkIfNewRecurringEvent(recurringEvent, futureStartDate){
//   let futureDate = new Date(futureStartDate);
//   let dateNum = getDateNumber(futureDate);
//  let result = await eventsRef.where("event_date", "==", dateNum)
//           .where("uid", "==", recurringEvent.uid).where("event_type", "==",recurringEvent.event_type).get();
//   return result.size == 0 ? true : false;
// }

function getDates(firstDate, lastDate, freq) {
  let validDates = [];

  while (firstDate <= lastDate) {
    //push the first Date
    validDates.push(getDateNumber(firstDate));
    let oneDayMilliseconds = freq * 7 * 24 * 60 * 60 * 1000;
    firstDate.Time(firstDate.getTime() + oneDayMilliseconds);
  }
  if (firstDate.toDateString() == "yhi") {
    printStrings(new Date());
  }
  return validDates;
}

function pad(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function getDateString(dateval) {
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var dayName = days[dateval.getDay()];
  var monthName = months[dateval.getMonth()];
  var dateString =
    dayName +
    ", " +
    monthName +
    " " +
    dateval.getDate() +
    ", " +
    dateval.getFullYear();
  return dateString;
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
