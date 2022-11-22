class Event {
  static event_times = {
      deldr: {
        first_shift: {
          time_start: "14:15",
          time_end: "17:30"
        }, 
        normal_shift: {
          time_start: "14:45",
          time_end: "18:00"
        }
      },
      kitpm: {
        normal_shift: {
          time_start: "13:30",
          time_end: "16:30"
        }
      },
      kitam: {
        normal_shift: {
          time_start: "9:30",
          time_end: "12:30"
        }
      }
    }

  constructor(){
      this.event_date = "";
      this.event_time_end = "";
      this.event_time_start = "";
      this.event_type= "";
      this.first_name = "";
      this.first_shift = false;
      this.is_current = true;
      this.is_important_event = false;
      this.key = "";
      this.last_name = "";
      this.note = "";
      this.slot = "";
      this.uid = "";
      this.no_show = false;
      this.completed = false;
      this.cancelled = false;
      this.recurring_event = false;
  }

  constructor(req_body){
    this.event_date = req_body.event_date ? req_body.event_date: "";
    this.event_time_end = req_body.event_time_end ? req_body.event_time_end : "";
    this.event_time_start = req_body.event_time_start ? req_body.event_time_start : "";
    this.event_type = req_body.event_type ? req_body.event_type : "";
    this.first_name = req_body.first_name ? req_body.first_name : "";
    this.first_shift = req_body.first_shift ? req_body.first_shift : false;
    this.is_current = req_body.is_current ? req_body.is_current : true;
    this.is_important_event = req_body.is_important_event ? req_body.is_important_event : false;
    this.key = req_body.key ? req_body.key : "";
    this.last_name = req_body.last_name ? req_body.last_name : "";
    this.note = req_body.note ? req_body.note : "";
    this.slot = req_body.slot ? req_body.slot : "";
    this.uid = req_body.uid ? req_body.uid : "";
    this.no_show = req_body.no_show ? req_body.no_show : false;
    this.completed = req_body.completed ? req_body.completed : false;
    this.cancelled =  req_body.cancelled ? req_body.cancelled : false;
    this.recurring_event = req_body.recurring_event ? req_body.recurring_event : false;
  }


  set setCompleted(completed) {
    this.completed = completed;
  }
  set setCancelled(cancelled){
    this.cancelled = cancelled;
  }
  set setDate(event_date){
    this.event_date = event_date;
  }
  set setTimeEnd(event_time_end){
    this.event_time_end = event_time_end ;
  }
  set setTimeStart(event_time_start){
    this.event_time_start = event_time_start;
  }
  set setEventType(event_type){ 
    this.event_type = event_type;
  }
  set setFirstName(first_name){
    this.first_name = first_name;
  }
  set setLastName(last_name) {
    this.last_name = last_name;
  }
  set setFirstShift(first_shift){
    this.first_shift = first_shift;
  }
  set setNote(note){
    this.note = note;
  }
  set setNoShow(no_show){
    this.no_show = no_show;
  }
  set setKey(key){
    this.key = key;
  }
  set setSlot(num){
    this.slot = num;
  }
  set setUid(uid){
    this.uid = uid;
  }
  
  set recurringEvent(truth_val){
    this.recurringEvent = truth_val;
  }

  get getCompleted(){
    return this.completed;
  }
  get getCancelled(){
    return this.cancelled;
  }
  get getDate(){
    return this.event_date;
  }
  get getTimeEnd(){
    return this.event_time_end;
  }
  get getTimeStart(){
    return this.event_time_start;
  }
  get getEventType(){ 
    return this.event_type;
  }
  get getFirstName(){
    return this.first_name;
  }
  get getLastName() {
    return this.last_name;
  }
  get getFirstShift(){
   return this.first_shift;
  }
  get getNote(){
    return this.note;
  }
  get getNoShow(){
    return this.no_show;
  }
  get getKey(){
    return this.key;
  }
  get getSlot(){
   return this.slot;
  }
  get getUid(){
    return this.uid;
  }
  get recurringEvent(){
    return this.recurringEvent;
  }
}



module.exports = {Event};