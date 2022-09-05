import React, { useState, useContext } from "react";
import Cell, { Icon, DeleteButton } from "./styles";
import PropTypes from "prop-types";
import {
  VolunteerCreateDeliveryEventModal,
  VolunteerCreateKitchenEventModal,
  VolunteerUpdateDeliveryEventModal,
  VolunteerUpdateKitchenEventModal,
  EmployeeUpdateDeliveryEventModal,
  EmployeeUpdateKitchenEventModal,
} from "../../Modal";
import { Typography, Tooltip, message } from "antd";
import MissedShiftIcon from "../../../assets/missed-shift-icon.svg";
import CarIcon from "../../../assets/car.svg";
import BicycleIcon from "../../../assets/bicycle.svg";
import OnFootIcon from "../../../assets/on-foot.svg";
import DeleteIcon from "../../../assets/close.svg";
import { AuthContext } from "../../../Contexts/AuthContext";
import AxiosInstance from "../../../API/api";

const DELIVERY_ICONS = {
  "Own Car": CarIcon,
  "SR Car": CarIcon,
  Bike: BicycleIcon,
  Foot: OnFootIcon,
};

const CalendarCell = (props) => {
  const { userType, user } = useContext(AuthContext);
  const { date, volunteerInfo, eventInfo, variant, getEvents } = props;
  const [modalVisibility, setModalVisibility] = useState({
    volunteerCreateKitchenEventModalVisible: false,
    volunteerUpdateKitchenEventModalVisible: false,
    volunteerCreateDeliveryEventModalVisible: false,
    volunteerUpdateDeliveryEventModalVisible: false,
    employeeUpdateDeliveryEventModalVisible: false,
    employeeUpdateKitchenEventModalVisible: false,
  });

  const onClickHandler = () => {
    if (userType === "volunteer") {
      if (volunteerInfo) {
        // Volunteers can only update their own events.
        if (eventInfo.uid !== user.uid) {
          message.error("You can only see your own shifts.");
        } else {
          if (variant === "deliv") {
            setModalVisibility({
              ...modalVisibility,
              volunteerUpdateDeliveryEventModalVisible: true,
            });
          } else {
            setModalVisibility({
              ...modalVisibility,
              volunteerUpdateKitchenEventModalVisible: true,
            });
          }
        }
      } else {
        if (variant === "deliv") {
          setModalVisibility({
            ...modalVisibility,
            volunteerCreateDeliveryEventModalVisible: true,
          });
        } else {
          setModalVisibility({
            ...modalVisibility,
            volunteerCreateKitchenEventModalVisible: true,
          });
        }
      }
    } else {
      if (variant === "deliv") {
        setModalVisibility({
          ...modalVisibility,
          employeeUpdateDeliveryEventModalVisible: true,
        });
      } else {
        setModalVisibility({
          ...modalVisibility,
          employeeUpdateKitchenEventModalVisible: true,
        });
      }
    }
  };

  const MissedShiftIndicator = () => (
    <Tooltip title="Missed more than 3 shifts">
      <Icon src={MissedShiftIcon} alt="missed-three-shifts" />
    </Tooltip>
  );

  const DeliveryTypeIndicator = ({ deliveryType }) => (
    <Icon src={DELIVERY_ICONS[deliveryType]} alt="delivery-icon" />
  );

  return (
    <>
      <Cell onClick={onClickHandler}>
        {userType === "admin" && volunteerInfo &&  (
          <DeleteButton src={DeleteIcon} alt="delete shift" onClick={async ()=>{
             const event_id = props.event_id;
             await AxiosInstance.post("/events/deleteEvent", {
             event_id
            });
            getEvents();
            }
          }/>
        )}
        {volunteerInfo && (
          <>
            {volunteerInfo.missedShifts && userType === "admin" && (
              <MissedShiftIndicator />
            )}
            {volunteerInfo.deliveryType && (
              <DeliveryTypeIndicator
                deliveryType={volunteerInfo.deliveryType}
              />
            )}
            <Typography.Text style={{ fontSize: "1rem" }}>
              {`${volunteerInfo.firstName || "No Data"} ${
                volunteerInfo.lastName ? `${volunteerInfo.lastName[0]}.` : ""
              }`}
            </Typography.Text>
          </>
        )}
      </Cell>
      <VolunteerCreateKitchenEventModal
        visible={modalVisibility.volunteerCreateKitchenEventModalVisible}
        setVisible={setModalVisibility}
        date={date}
        getEvents={getEvents}
      />
      <VolunteerCreateDeliveryEventModal
        visible={modalVisibility.volunteerCreateDeliveryEventModalVisible}
        setVisible={setModalVisibility}
        date={date}
        getEvents={getEvents}
      />
      <VolunteerUpdateKitchenEventModal
        visible={modalVisibility.volunteerUpdateKitchenEventModalVisible}
        setVisible={setModalVisibility}
        date={date}
        getEvents={getEvents}
        volunteerInfo={volunteerInfo}
        eventInfo={eventInfo}
      />
      <VolunteerUpdateDeliveryEventModal
        visible={modalVisibility.volunteerUpdateDeliveryEventModalVisible}
        setVisible={setModalVisibility}
        date={date}
        getEvents={getEvents}
        volunteerInfo={volunteerInfo}
        eventInfo={eventInfo}
      />
      <EmployeeUpdateDeliveryEventModal
        visible={modalVisibility.employeeUpdateDeliveryEventModalVisible}
        setVisible={setModalVisibility}
        date={date}
        getEvents={getEvents}
        eventInfo={eventInfo}
        volunteerInfo={volunteerInfo}
      />
      <EmployeeUpdateKitchenEventModal
        visible={modalVisibility.employeeUpdateKitchenEventModalVisible}
        setVisible={setModalVisibility}
        date={date}
        getEvents={getEvents}
        eventInfo={eventInfo}
        volunteerInfo={volunteerInfo}
      />
    </>
  );
};

CalendarCell.propTypes = {
  variant: PropTypes.string, // delivery | kitchenAM | kitchenPM
  date: PropTypes.object.isRequired,
  volunteerInfo: PropTypes.object,
  eventInfo: PropTypes.object,
};

export default CalendarCell;
