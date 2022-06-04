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
        this.event_date = ""
    }
}