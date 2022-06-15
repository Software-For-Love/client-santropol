import React, { useContext } from "react";
import Calendar from "../../components/Calendar";
import { AuthContext } from "../../Contexts/AuthContext";

const Delivery = () => {
  const { userType } = useContext(AuthContext);
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
      <Calendar info={deliveryInfo} variant="deliv" type={userType} />
    </div>
  );
};

export default Delivery;
