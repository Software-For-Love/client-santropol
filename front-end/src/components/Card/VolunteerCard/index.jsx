import React, { useState } from "react";
import { StyledCard } from "./styles";
import { Button, message } from "antd";
import VolunteerPastShiftsModal from "../../Modal/Volunteer/VolunteerPastShiftsModal";
import AxiosInstance from "../../../API/api";

const VolunteerCard = (props) => {
  const { uid, first_name, last_name, phone_number } = props;
  const [pastShiftsModalVisible, setPastShiftsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const onClick = async () => {
    setLoading(true);
    try {
      const { data } = await AxiosInstance.get("/events/getUserPastEvents", {
        params: {
          uid,
          role: "admin",
        },
      });
      if (data.success) {
        setData(data.result);
        setPastShiftsModalVisible(true);
      } else {
        message.error(data.error);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <StyledCard title={`${first_name} ${last_name}`}>
      <p>{`Phone number: ${phone_number}`}</p>
      <Button
        type="tertiary"
        onClick={onClick}
        loading={loading}
        style={{
          width: "100%",
          height: "100%",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
        }}
      >
        View Past Shifts
      </Button>
      <VolunteerPastShiftsModal
        visible={pastShiftsModalVisible}
        setVisible={setPastShiftsModalVisible}
        volunteer={props}
        data={data}
      />
    </StyledCard>
  );
};

export default VolunteerCard;
