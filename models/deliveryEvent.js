const { Event } = require("./event");

class DeliveryEvent extends Event {

    constructor(){
        super();
        this.delivery_type = "";
    }
    set setDeliveryType(delivery_type){
        this.delivery_type = delivery_type;
    }
    get getDeliveryType(){
        return this.delivery_type;
    }
}