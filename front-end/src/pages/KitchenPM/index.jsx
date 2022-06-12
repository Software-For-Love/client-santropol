import React, { useContext } from "react";
import Calendar from "../../components/Calendar";
import { AuthContext } from "../../Contexts/AuthContext";

const KitchenPM = () => {
  const { userType } = useContext(AuthContext);
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
      <Calendar info={kitchenPmInfo} variant="kitchenPM" type={userType} />
    </div>
  );
};

export default KitchenPM;
