const { RecurringEvent } = require("./recurringEvent");

class RecurringDelivery extends RecurringEvent {

    constructor(){
        super();
        this.delivery_type = "";
    }

    get getDeliveryType(){
        return this.delivery_type;
    }

    set setDeliveryType(delivery_type){
        this.delivery_type = delivery_type;
    }

}


module.exports = {RecurringDelivery}