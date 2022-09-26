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
  RemoveUserFromEventModal,
} from "../../Modal";
import { Typography, Tooltip, message } from "antd";
import MissedShiftIcon from "../../../assets/missed-shift-icon.svg";
import CarIcon from "../../../assets/car.svg";
import SRCarIcon from "../../../assets/sr-car.svg";
import BicycleIcon from "../../../assets/bicycle.svg";
import OnFootIcon from "../../../assets/on-foot.svg";
import DeleteIcon from "../../../assets/close.svg";
import { AuthContext } from "../../../Contexts/AuthContext";

const DELIVERY_ICONS = {
  "Own Car": CarIcon,
  "SR Car": SRCarIcon,
  Bike: BicycleIcon,
  Foot: OnFootIcon,
};

const CalendarCell = (props) => {
  const { userType, user } = useContext(AuthContext);
  const { date, volunteerInfo, eventInfo, variant, getEvents } = props;
  //show close icon to admin users for assigned shifts
  //or to volunteer users for their own shifts
  const closeIconVisible =
    (userType === "admin" && volunteerInfo) ||
    eventInfo?.data?.uid === user.uid;
  const [modalVisibility, setModalVisibility] = useState({
    volunteerCreateKitchenEventModalVisible: false,
    volunteerUpdateKitchenEventModalVisible: false,
    volunteerCreateDeliveryEventModalVisible: false,
    volunteerUpdateDeliveryEventModalVisible: false,
    employeeUpdateDeliveryEventModalVisible: false,
    employeeUpdateKitchenEventModalVisible: false,
    removeUserFromEventModalVisible: false,
  });

  const onClickHandler = () => {
    if (userType === "volunteer") {
      if (volunteerInfo) {
        // Volunteers can only update their own events.
        if (eventInfo?.data?.uid !== user.uid) {
          console.log(eventInfo, user.uid);
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
      if (volunteerInfo) {
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
      } else {
        message.error("No volunteer assigned to this shift.");
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
      <Cell>
        {closeIconVisible && (
          <DeleteButton
            src={DeleteIcon}
            alt="delete shift"
            onClick={() =>
              setModalVisibility((prev) => ({
                ...prev,
                removeUserFromEventModalVisible: true,
              }))
            }
          />
        )}
        <div
          onClick={onClickHandler}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {volunteerInfo && (
            <>
              {eventInfo?.cancelled && userType === "admin" && (
                <MissedShiftIndicator />
              )}
              {eventInfo?.data?.type_of_delivery &&
                eventInfo?.data?.type_of_delivery !== "NA" && (
                  <DeliveryTypeIndicator
                    deliveryType={eventInfo.data.type_of_delivery}
                  />
                )}
              <Typography.Text style={{ fontSize: "1rem" }}>
                {`${volunteerInfo.firstName || "No Data"} ${
                  volunteerInfo.lastName ? `${volunteerInfo.lastName[0]}.` : ""
                }`}
              </Typography.Text>
            </>
          )}
        </div>
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
      <RemoveUserFromEventModal
        visible={modalVisibility.removeUserFromEventModalVisible}
        setVisible={setModalVisibility}
        date={date}
        getEvents={getEvents}
        eventInfo={eventInfo}
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
