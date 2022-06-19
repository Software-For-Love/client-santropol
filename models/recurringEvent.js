class RecurringEvent {

    constructor(){
        this.end_date = "";
        this.event_type = "";
        this.last_name = "";
        this.first_name = "";
        this.uid = "";
        this.int_day_of_week = null;
        this.start_date = "";
        this.new_recurring_event = true;
    }

    get getEndDate(){
        return this.end_date;
    }
    get getEventType(){
        return this.event_type;
    }
    get getLastName(){
        return this.last_name;
    }
    get getFirstName(){
        return this.first_name;
    }
    get getUid(){
        return this.uid;
    }
    get getDayOfWeek(){
        return this.int_day_of_week;
    }
    get getStartDate(){
        return this.start_date;
    }
 

    set setEndDate(start_date){
        this.end_date = start_date;
    }
    set setEventType(event_type){
        this.event_type = event_type;
    }
    set setLastName(last_name){
        this.last_name = last_name;
    }
    set setFirstName(first_name){
        this.first_name = first_name;
    }
    set setUid(uid){
        this.uid = uid;
    }
    set setDayOfWeek(int_day_of_week){
        this.int_day_of_week = int_day_of_week;
    }
    set setStartDate(start_date){
        this.start_date = start_date;
    }
}

module.exports = {RecurringEvent}