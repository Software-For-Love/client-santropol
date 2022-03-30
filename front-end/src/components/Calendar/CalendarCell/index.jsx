import React, { useState } from "react";
import Cell from "./styles";
import PropTypes from "prop-types";
import AssignSlotOverlay from "../../Modal/AssignSlotOverlay";

const CalendarCell = (props) => {
  const { type, date } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const onClickHandler = () => {
    if (type === "admin") {
      setModalVisible(true);
    }
  };

  return (
    <>
      <Cell onClick={onClickHandler} type={type}></Cell>
      <AssignSlotOverlay
        visible={modalVisible}
        setVisible={setModalVisible}
        date={date}
      />
    </>
  );
};

CalendarCell.propTypes = {
  type: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
};

export default CalendarCell;
