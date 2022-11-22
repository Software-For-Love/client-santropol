import React from "react";
import { StyledCard } from "../VolunteerCard/styles";
import { Button } from "antd";

const SelectVolunteerCard = (props) => {
  const {
    first_name,
    last_name,
    phone_number,
    setSelectedUser,
    user,
    setUsers,
  } = props;

  return (
    <StyledCard title={`${first_name} ${last_name}`}>
      <div
        style={{
          paddingLeft: "1rem",
        }}
      >
        <p>{`Phone number: ${phone_number}`}</p>
      </div>
      <Button
        type="tertiary"
        onClick={() => {
          setSelectedUser(user);
          setUsers(null);
        }}
        style={{
          width: "100%",
          height: "100%",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
        }}
      >
        Select Volunteer
      </Button>
    </StyledCard>
  );
};

export default SelectVolunteerCard;
