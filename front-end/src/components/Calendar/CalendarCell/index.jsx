import React, { useState, useContext } from "react";
import Cell, { Icon, DeleteButton } from "./styles";
import PropTypes from "prop-types";
import { CreateDeliveryEventModal, CreateKitchenEventModal } from "../../Modal";
import { Typography, Tooltip } from "antd";
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
  const { userType } = useContext(AuthContext);
  const { date, volunteerInfo, variant, getEvents } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

  const onClickHandler = () => {
    if (variant !== "deliv") {
      setModalVisible(true);
    } else {
      setDeliveryModalVisible(true);
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
        { (
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
      <CreateKitchenEventModal
        visible={modalVisible}
        setVisible={setModalVisible}
        date={date}
        getEvents={getEvents}
      />
      <CreateDeliveryEventModal
        visible={deliveryModalVisible}
        setVisible={setDeliveryModalVisible}
        date={date}
        getEvents={getEvents}
      />
    </>
  );
};

CalendarCell.propTypes = {
  variant: PropTypes.string, // delivery | kitchenAM | kitchenPM
  date: PropTypes.object.isRequired,
  volunteerInfo: PropTypes.object,
};

export default CalendarCell;
