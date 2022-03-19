import React, { useState } from "react";
import Calendar from "./style";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
import moment from "moment";

const CalendarComponent = () => {
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
      <CalendarBody date={date} />
    </>
  );
};

export default CalendarComponent;
