import React, { useState } from "react";
import Cell, { Icon, DeleteButton } from "./styles";
import PropTypes from "prop-types";
import AssignSlotOverlay from "../../Modal/AssignSlotOverlay";
import { Typography, Tooltip } from "antd";
import MissedShiftIcon from "../../../assets/missed-shift-icon.svg";
import CarIcon from "../../../assets/car.svg";
import BicycleIcon from "../../../assets/bicycle.svg";
import OnFootIcon from "../../../assets/on-foot.svg";
import DeliveryOverlay from "../../Modal/DeliveryOverlay";
import DeleteIcon from "../../../assets/close.svg";

const DELIVERY_ICONS = {
  "Own Car": CarIcon,
  "SR Car": CarIcon,
  Bike: BicycleIcon,
  Foot: OnFootIcon,
};

const CalendarCell = (props) => {
  const { type, date, volunteerInfo, variant } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

  const onClickHandler = () => {
    console.log(type, variant);
    if (type === "admin") {
      if (variant !== "delivery") {
        setModalVisible(true);
      } else {
        setDeliveryModalVisible(true);
      }
    }
  };

  const MissedShiftIndicator = () => (
    <Tooltip title='Missed more than 3 shifts'>
      <Icon src={MissedShiftIcon} alt='missed-three-shifts' />
    </Tooltip>
  );

  const DeliveryTypeIndicator = ({ type }) => (
    <Icon src={DELIVERY_ICONS[type]} alt='delivery-icon' />
  );

  return (
    <>
      <Cell onClick={onClickHandler} type={type}>
        {type === "admin" && volunteerInfo && (
          <DeleteButton src={DeleteIcon} alt='delete shift' />
        )}
        {volunteerInfo && (
          <>
            {volunteerInfo.missedShifts && type === "admin" && (
              <MissedShiftIndicator />
            )}
            {volunteerInfo.deliveryType && (
              <DeliveryTypeIndicator type={volunteerInfo.deliveryType} />
            )}
            <Typography.Text style={{ fontSize: "1rem" }}>
              {`${volunteerInfo.firstName} ${volunteerInfo.lastName[0]}.`}
            </Typography.Text>
          </>
        )}
      </Cell>
      <AssignSlotOverlay
        visible={modalVisible}
        setVisible={setModalVisible}
        date={date}
      />
      <DeliveryOverlay
        visible={deliveryModalVisible}
        setVisible={setDeliveryModalVisible}
        type={volunteerInfo?.deliveryType}
        date={date}
      />
    </>
  );
};

CalendarCell.propTypes = {
  variant: PropTypes.string, // delivery | kitchenAM | kitchenPM
  type: PropTypes.string.isRequired, // admin, volunteer
  date: PropTypes.object.isRequired,
  volunteerInfo: PropTypes.object,
};

export default CalendarCell;
