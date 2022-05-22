const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

/* eslint-disable */

/**
 * Cloud function used to delete shifts that have passed and generate future shifts. To run every Sunday at 9:00 AM.
 */
exports.scheduledShiftGenerator = functions.pubsub.schedule("00 9 * * sun").timeZone("America/New_York").onRun((context) => {

  let incrementInMilliseconds = 24 * 60 * 60 * 1000; //Full day in miliseconds
  let firstDate = new Date();
  firstDate.setTime(firstDate.getTime() + incrementInMilliseconds); //monday
  let firstDateNumber = getDateNumber(firstDate);

  incrementInMilliseconds = 24 * 60 * 60 * 1000 * 7 * 12; //12 weeks
  firstDate.setTime(firstDate.getTime()+incrementInMilliseconds);
  
  console.log('creating...');
  printStrings(firstDate).then(() => {
    admin.database().ref('/event').on("child_added", function (snapshot) {
      if (snapshot.val().event_date < firstDateNumber) { //it's the same date and type
        if (snapshot.val().key != "nan"){
          var eventNameRef = admin.database().ref('/past_events/' + snapshot.key);
          let late = false;
          if(snapshot.val().is_late){
            late = true;
          }
          eventNameRef.set({
            event_date: snapshot.val().event_date,
            event_date_txt: snapshot.val().event_date_txt,
            event_time_end: snapshot.val().event_time_end,
            event_time_start: snapshot.val().event_time_start,
            event_type: snapshot.val().event_type,
            first_name: snapshot.val().first_name,
            first_shift: snapshot.val().first_shift,
            is_current: false,
            is_important_event: snapshot.val().is_important_event,
            is_late: late,
            key: snapshot.val().key,
            last_name: snapshot.val().last_name,
            note: snapshot.val().note,
            slot: snapshot.val().slot,
            uid: snapshot.val().uid
          });
        }
        console.log("Deleted: " + snapshot.key);
        snapshot.ref.remove();
      }
      return 0;
    });
    console.log('deleting...');
  });
});

function printStrings(date) {
  var types = ['deldr', 'deliv', 'kitam', 'kitpm'];
  var slotAmount = [4, 10, 6, 6];
  var startTimes = ['14:45', '14:45', '9:30', '13:30'];
  var endTimes = ['18:00', '18:00', '12:30', '16:00'];
  var startTimesSat = ['14:15', '14:15', '9:00', '13:00'];
  var endTimesSat = ['17:30', '17:30', '12:00', '15:30'];
  for (let weekdayNo = 0; weekdayNo < 6; weekdayNo++) { //for each weekday
    if (weekdayNo == 3) { //thursday
      let incrementInMilliseconds = weekdayNo * 24 * 60 * 60 * 1000;
      let date2 = new Date(date.toDateString());
      date2.setTime(date.getTime() + incrementInMilliseconds);
      let dateNumber = getDateNumber(date2);
      let dateString = getDateString(date2);
      for (let j = 0; j < slotAmount[3]; j++) { //for each slot
        console.log("Created" + dateNumber + 'kitpm' + pad(j + 1, 2));
        var eventNameRef = admin.database().ref('/event/' + dateNumber + 'kitpm' + pad(j + 1, 2));
        eventNameRef.set({
          event_date: dateNumber,
          event_date_txt: dateString,
          event_time_end: endTimes[3],
          event_time_start: startTimes[3],
          event_type: 'kitpm',
          first_name: '',
          first_shift: false,
          is_current: true,
          is_important_event: false,
          key: 'nan',
          last_name: '',
          note: '',
          slot: pad(j + 1, 2),
          uid: 'nan'
        });
      }
    }
    else {
      for (let i = 0; i < types.length; i++) { //for each type
        let incrementInMilliseconds = weekdayNo * 24 * 60 * 60 * 1000;
        let date2 = new Date(date.toDateString());
        date2.setTime(date.getTime() + incrementInMilliseconds);
        let dateNumber = getDateNumber(date2);
        let dateString = getDateString(date2);
        for (let j = 0; j < slotAmount[i]; j++) { //for each slot
          console.log("Created" + dateNumber + types[i] + pad(j + 1, 2));
          var eventNameRef = admin.database().ref('/event/' + dateNumber + types[i] + pad(j + 1, 2));
          eventNameRef.set({
            event_date: dateNumber,
            event_date_txt: dateString,
            event_time_end: endTimes[i],
            event_time_start: startTimes[i],
            event_type: types[i],
            first_name: '',
            first_shift: false,
            is_current: true,
            is_important_event: false,
            key: 'nan',
            last_name: '',
            note: '',
            slot: pad(j + 1, 2),
            uid: 'nan'
          });
        }
      }
    }
  }
  return new Promise(resolve => {
    console.log("Creating new shifts complete");
    resolve();
  });
}

function getDates(firstDate, lastDate, freq) {
  let validDates = [];

  while (firstDate <= lastDate) {
    //push the first Date
    validDates.push(getDateNumber(firstDate));
    let incrementInMilliseconds = (freq) * 7 * 24 * 60 * 60 * 1000;
    firstDate.setTime(firstDate.getTime() + incrementInMilliseconds);
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