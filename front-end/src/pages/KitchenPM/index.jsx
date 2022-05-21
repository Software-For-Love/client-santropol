import React from "react";
import Calendar from "../../components/Calendar";

const KitchenPM = () => {
  const kitchenPmInfo = [
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
      <Calendar info={kitchenPmInfo} variant='kitchenPM' />
    </div>
  );
};

export default KitchenPM;
