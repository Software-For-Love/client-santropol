export class Event {
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
      this.event_date_txt = "";
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
  }

  set date(event_date){
    this.event_date = event_date;
  }
  set dateTxt(event_date_txt){
    this.event_date_txt = event_date_txt;
  }
  set timeEnd(event_time_end){
    this.event_time_end = event_time_end ;
  }
  set timeStart(event_time_start){
    this.event_time_start = event_time_start;
  }
  set eventType(event_type){ 
    this.event_type = event_type;
  }
  set firstName(first_name){
    this.first_name = first_name;
  }
  set lastName(last_name) {
    this.last_name = last_name;
  }
  set firstShift(first_shift){
    this.first_shift = first_shift;
  }
  set note(note){
    this.note = note;
  }
  set noShow(no_show){
    this.no_show = no_show;
  }
  set skey(key){
    this.key = key;
  }
  set slot(num){
    this.slot = num;
  }
  set uid(uid){
    this.uid = uid;
  }
  

  get date(){
    this.event_date = event_date;
  }
  get dateTxt(){
    this.event_date_txt = event_date_txt;
  }
  get timeEnd(){
    this.event_time_end = event_time_end ;
  }
  get timeStart(){
    this.event_time_start = event_time_start;
  }
  get eventType(){ 
    this.event_type = event_type;
  }
  get firstName(){
    this.first_name = first_name;
  }
  get lastName() {
    this.last_name = last_name;
  }
  get firstShift(){
    this.first_shift = first_shift;
  }
  get note(){
    this.note = note;
  }
  get noShow(){
    this.no_show = no_show;
  }
  get key(){
    this.key = key;
  }
  get slot(){
    this.slot = num;
  }
  get uid(){
    this.uid = uid;
  }
}



module.exports = {Event};