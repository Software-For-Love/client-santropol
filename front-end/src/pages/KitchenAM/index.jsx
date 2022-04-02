import React from "react";
import Calendar from "../../components/Calendar";

const KitchenAM = () => {
  const kitchenAmInfo = [
    {
      firstName: "Juliet",
      lastName: "Aaaa",
    },
    {
      firstName: "Parth",
      lastName: "Aaaa",
      missedShifts: true,
    },
    {
      firstName: "Maahi",
      lastName: "Aaaa",
    },
  ];
  return (
    <div>
      <Calendar type='admin' info={kitchenAmInfo} variant='kitchenAM' />
    </div>
  );
};

export default KitchenAM;
