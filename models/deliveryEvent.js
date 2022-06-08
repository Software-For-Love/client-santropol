const { Event } = require("./event");

 class DeliveryEvent extends Event {

    //A  coded version of downcasting, but for JS
    constructor(eventObj){ 
        super();
        if(eventObj){
        Object.entries(eventObj).forEach((property) => {
            Object.defineProperty(this, property[0], {
                writable: true,
                value: property[1]
            });
        });
        }
    }
     set setDeliveryType(delivery_type){
        this.delivery_type = delivery_type;
    }
    get getDeliveryType(){
        return this.delivery_type;
    }
}

module.exports ={ DeliveryEvent};