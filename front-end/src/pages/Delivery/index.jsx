import React from "react";
import Calendar from "../../components/Calendar";

const Delivery = () => {
  const deliveryInfo = [
    {
      firstName: "Juliet",
      lastName: "Aaaa",
      deliveryType: "Own Car",
    },
    {
      firstName: "Parth",
      lastName: "Aaaa",
      deliveryType: "Bike",
    },
    {
      firstName: "Maahi",
      lastName: "Aaaa",
      deliveryType: "Foot",
    },
  ];
  return (
    <div>
      <Calendar info={deliveryInfo} variant='delivery' type='admin' />
    </div>
  );
};

export default Delivery;
