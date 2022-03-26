import React, { useState } from "react";
import Calendar from "./style";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
import moment from "moment";
import PropTypes from "prop-types";

const CalendarComponent = (props) => {
  const { type } = props; // admin | volunteer
  const [date, setDate] = useState(moment());

  return (
    <>
      <Calendar
        value={date}
        fullscreen
        headerRender={() => <CalendarHeader date={date} setDate={setDate} />}
        dateFullCellRender={() => null}
        dateCellRender={() => null}
        monthCellRender={() => null}
        monthFullCellRender={() => null}
      />
      <CalendarBody date={date} type={type} />
    </>
  );
};

CalendarComponent.propTypes = {
  type: PropTypes.string.isRequired,
};

export default CalendarComponent;
