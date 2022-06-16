/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const { Event } = require("./event");
const { DeliveryEvent } = require("./deliveryEvent")  ;
const { rejects } = require("assert");
admin.initializeApp();

const firestoreService=admin.firestore();
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
    return recurEventRef.add({
      end_date: "2022-12-01T05:00:00.000Z",
      event_type: "deldr",
      delivery_type: "car",
      last_name: "carl",
      uid: "ad121asd3",
      int_day_of_week: 2,
      first_name: "Anthoney"
    })
  })
})
/**
 * Cloud function used to delete shifts that have passed and generate future shifts. To run every Sunday at 9:00 AM.
 */
exports.createEvent = functions.https.onRequest((req,res)=> {
// exports.scheduledShiftGenerator = functions.pubsub.schedule("11 6 * * *").timeZone("America/New_York").onRun((context) =>{

  let futureStartDate = new Date();
  
  console.log('creating...');
  //This is some start date in the future to start adding events to that week
  futureStartDate = futureStartDate.setTime(futureStartDate.getTime() + 7 * oneDayMilliseconds)
  fillRecurringEvents(futureStartDate);
});

function printStrings(date) {
  var types = ['deldr', 'deliv', 'kitam', 'kitpm'];
  var slotAmount = [4, 10, 6, 6];
  var startTimes = ['14:45', '14:45', '9:30', '13:30'];
  var endTimes = ['18:00', '18:00', '12:30', '16:00'];
  var startTimesSat = ['14:15', '14:15', '9:00', '13:00'];
  var endTimesSat = ['17:30', '17:30', '12:00', '15:30'];


  for (let weekdayNo = 0; weekdayNo < 6; weekdayNo++) { //for each weekday
    // if (weekdayNo == 3) { //thursday
    //   let oneDayMilliseconds = weekdayNo * 24 * 60 * 60 * 1000;
    //   let date2 = new Date(date.toDateString());
    //   date2.Time(date.getTime() + oneDayMilliseconds);
    //   let dateNumber = getDateNumber(date2);
    //   let dateString = getDateString(date2);
    //   for (let j = 0; j < slotAmount[3]; j++) { //for each slot
    //     console.log("Created" + dateNumber + 'kitpm' + pad(j + 1, 2));
    //     var eventNameRef = admin.database().ref('/event/' + dateNumber + 'kitpm' + pad(j + 1, 2));
    //     eventNameRef.set({
    //       event_date: dateNumber,
    //       event_date_txt: dateString,
    //       event_time_end: endTimes[3],
    //       event_time_start: startTimes[3],
    //       event_type: 'kitpm',
    //       first_name: '',
    //       first_shift: false,
    //       is_current: true,
    //       is_important_event: false,
    //       key: 'nan',
    //       last_name: '',
    //       note: '',
    //       slot: pad(j + 1, 2),
    //       uid: 'nan'
    //     });
    //   }
    // }
    // else {
      // let tempEventModel = eventModel;
      for (let i = 0; i < types.length; i++) { //for each type
        let oneDayMilliseconds = weekdayNo * 24 * 60 * 60 * 1000; //The next day
        let date2 = new Date(date.toDateString());
        date2.Time(date.getTime() + oneDayMilliseconds);
        let dateNumber = getDateNumber(date2);
        let dateString = getDateString(date2);
        for (let j = 0; j < slotAmount[i]; j++) { //for each slot
          console.log("Created" + dateNumber + types[i] + pad(j + 1, 2));
          tempEventModel["event_date"] = dateNumber;
          tempEventModel["event_date_txt"] = dateString;
          tempEventModel["event_time_end"] = endTimes[i];
          tempEventModel["event_time_start"] = startTimes[i];
          tempEventModel["event_type"] = types[i];
          tempEventModel["first_name"] = "";
          tempEventModel["first_shift"] = false;
          tempEventModel["is_current"] = true;
          tempEventModel["is_important_event"] = false;
          tempEventModel["key"] = "nan";
          tempEventModel["last_name"] = "";
          tempEventModel["note"] = "";
          tempEventModel["slot"] = pad(j + 1, 2);
          tempEventModel["uid"] = "nan";

          let eventNameRef = firestoreService.collection("event_test").doc( dateNumber + types[i] + pad(j + 1, 2))          
          .set(tempEventModel);

          //This is a promise
          // var eventNameRef = admin.database().ref('/event/' + dateNumber + types[i] + pad(j + 1, 2));
          // eventNameRef.set({
          //   event_date: dateNumber,
          //   event_date_txt: dateString,
          //   event_time_end: endTimes[i],
          //   event_time_start: startTimes[i],
          //   event_type: types[i],
          //   first_name: '',
          //   first_shift: false,
          //   is_current: true,
          //   is_important_event: false,
          //   key: 'nan',
          //   last_name: '',
          //   note: '',
          //   slot: pad(j + 1, 2),
          //   uid: 'nan'
          // });
        }
      // }
    }
  }
  return new Promise(resolve => {
    console.log("Creating new shifts complete");
    resolve();
  });
}

async function fillRecurringEvents(futureStartingDate){ //Typically should be sunday (starts at 0)
      let eventModel = new Event();
      let oneDayMilliseconds = 24 * 60 * 60 * 1000; //Full day in miliseconds
      let recurringEvents = await recurEventRef.get();
      for (let item of recurringEvents.docs) {
          let flag = true;
          let newDate = new Date(futureStartingDate);
		  newDate.setTime(newDate.getTime() + item.data().int_day_of_week*oneDayMilliseconds); 
          let newRecurEventCondition = await checkIfNewRecurringEvent(item, newDate);
          eventModel.setTimeEnd = Event.event_times[item.data().event_type]["normal_shift"].time_end;
          eventModel.setTimeStart = Event.event_times[item.data().event_type]["normal_shift"].time_start;
          eventModel.setEventType = item.data().event_type;
          eventModel.setFirstName = item.data().first_name;
          eventModel.setKey = "nan"; /// Not sure
          eventModel.setLastName = item.data().last_name;
          eventModel.setNote = item.data().comment ? item.data().comment : "";
          eventModel.setSlot = await getSlotNumber(dateNumber, item.data().event_type);
          eventModel.setUid = item.data().uid;
          for(let i = 0; i < numOfWeeksAhead; i++){
			let eventLimitCondition = await checkUserEventsLimit(item.data().uid,futureStartingDate.getTime() + i*oneDayMilliseconds);
			if(flag){
				if(newDate < new Date(item.data().end_date) && eventLimitCondition) {
					
				}
            } 
            else {
              break;
            }
          }
          
          if(newDate < new Date(item.data().end_date) && eventLimitCondition && !newRecurEventCondition) {
            let dateNumber = getDateNumber(newDate);
            let dateString = getDateString(newDate);
            eventModel.setDate = dateNumber;
            eventModel.setDateTxt = dateString;
            if(item.data().event_type === "deldr") {
              eventModel = new DeliveryEvent(eventModel);
              eventModel.setDeliveryType = item.data().delivery_type;
            }

            try{
              await eventsRef.doc(eventModel.getDate + eventModel.getEventType + eventModel.getSlot).create(JSON.parse(JSON.stringify(eventModel)));

            }catch(err){
              console.log(err);
            }
            
          } 
          else if (!eventLimitCondition) {
            console.log("yes events exceeded");
          }
      }
}

function getSlotNumber(eventDate, eventType){
   let existingEvents= eventsRef.where("event_date", "==", eventDate)
  .where("event_type", "==", eventType).orderBy("slot", "desc").get();
  return existingEvents.then(docs => {
    if(docs.size == 0) {
      return 1;
    } 
    else {
      return docs.docs[0].data().slot+1;
    }
  })

}

//Check the number of events a user has in upcoming week. Must not exceed current limit
//Current limit: 3
async function checkUserEventsLimit(userid, weekStartDate){
    let weekEndDate = new Date(weekStartDate);
    weekEndDate.setTime(weekEndDate.getTime() + 5*oneDayMilliseconds);
    let dateNumber = getDateNumber(weekEndDate);
    let results = await eventsRef.where("event_date", "<=", dateNumber)
                  .where("uid", "==", userid).get();
    return results.size < maxEventsPerWeek ? true : false ;

}

//Check in advance, at least a week, to see if this recurring event has already been done before.
function checkIfNewRecurringEvent(recurringEvent, futureStartDate){
  let futureDate = new Date(futureStartDate);
  let dateNum = getDateNumber(futureDate);
 let result = await eventsRef.where("event_date", "==", dateNum)
          .where("uid", "==", recurringEvent.uid).where("event_type", "==",recurringEvent.event_type).get();
  return result.size == 0 ? true : false;
}

function getDates(firstDate, lastDate, freq) {
  let validDates = [];

  while (firstDate <= lastDate) {
    //push the first Date
    validDates.push(getDateNumber(firstDate));
    let oneDayMilliseconds = (freq) * 7 * 24 * 60 * 60 * 1000;
    firstDate.Time(firstDate.getTime() + oneDayMilliseconds);
  }
  if (firstDate.toDateString() == 'yhi') {
    printStrings(new Date());
  }
  return validDates;
}

function pad(num, size) {
  let s = num + "";
  while (s.length < size)
    s = "0" + s;
  return s;
}

function getDateString(dateval) {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var dayName = days[dateval.getDay()];
  var monthName = months[dateval.getMonth()];
  var dateString = dayName + ", " + monthName + " " + dateval.getDate() + ", " + dateval.getFullYear();
  return dateString;
}

function getDateNumber(date) {
  let month = "";
  let day = "";
  if (date.getMonth() + 1 < 10) {
    month = "0" + (date.getMonth() + 1).toString();
  }
  else {
    month = (date.getMonth() + 1).toString();
  }
  if (date.getDate() < 10) {
    day = "0" + date.getDate().toString();
  }
  else {
    day = date.getDate().toString();
  }
  let dateString = (date.getFullYear().toString()).substring(2, 4) + month + day;
  let intDate = +dateString;
  return intDate;
}
