import React from "react";
import Header, { LeftIcon, RightIcon, DateText } from "./styles";
import PropTypes from "prop-types";
import moment from "moment";

const CalendarHeader = (props) => {
  const { date, setDate } = props;
  const startOfWeek = moment(date).startOf("week").format("MMMM Do");
  const endOfWeek = moment(date).endOf("week").format("MMMM Do");

  const onLeftIconClick = () => {
    setDate(date.subtract(1, "week").clone());
  };

  const onRightIconClick = () => {
    setDate(date.add(1, "week").clone());
  };

  return (
    <Header justify='center' align='middle'>
      <LeftIcon onClick={onLeftIconClick} />
      <DateText>{`${startOfWeek} - ${endOfWeek}`}</DateText>
      <RightIcon onClick={onRightIconClick} />
    </Header>
  );
};

CalendarHeader.propTypes = {
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
};

export default CalendarHeader;
