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
            time_start: ""
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

    set setDate(event_date){
      this.event_date = event_date;
    }
    set setDateTxt(event_date_txt){
      this.event_date_txt = event_date_txt;
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
    set setfirstName(first_name){
      this.first_name = first_name;
    }
    set setlastName(last_name) {
      this.last_name = last_name;
    }
    set setfirstShift(first_shift){
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
}

module.exports = {Event};