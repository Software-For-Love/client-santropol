import React, { useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import Calendar from "../../components/Calendar";

const KitchenAM = () => {
  const { userType } = useContext(AuthContext);

  return (
    <div>
      <Calendar type={userType} variant="kitam" />
    </div>
  );
};

export default KitchenAM;
