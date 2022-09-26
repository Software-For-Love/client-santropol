import React, { useState, useEffect } from "react";
import Calendar from "./style";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
import moment from "moment";
import PropTypes from "prop-types";
import AxiosInstance from "../../API/api";
import Loading from "../../components/Loading";

const CalendarComponent = (props) => {
  const { variant } = props; //kitam | kitpm | deliv
  const [date, setDate] = useState(moment());
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventSlots, setEventSlots] = useState([]);

  const getEvents = async () => {
    setLoading(true);
    try {
      const { data } = await AxiosInstance.get("/events/getEvents", {
        params: {
          eventDate: date.startOf("week").format("YYMMDD"),
          eventType: variant,
        },
      });
      setEvents(data.result);
    } catch (err) {
      console.log(err);
    }
    try {
      const { data } = await AxiosInstance.get("/events/getWeeklyEventSlots", {
        params: {
          eventDate: date.format("YYMMDD"),
          eventType: variant,
        },
      });
      setEventSlots(data.result);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

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
      {loading ? (
        <Loading />
      ) : (
        <CalendarBody
          eventSlots={eventSlots}
          date={date}
          info={events}
          variant={variant}
          getEvents={getEvents}
        />
      )}
    </>
  );
};

CalendarComponent.propTypes = {
  variant: PropTypes.string,
};

export default CalendarComponent;
