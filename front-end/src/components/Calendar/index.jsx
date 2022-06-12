import React, { useState, useEffect } from "react";
import Calendar from "./style";
import CalendarHeader from "./CalendarHeader";
import CalendarBody from "./CalendarBody";
import moment from "moment";
import PropTypes from "prop-types";
import AxiosInstance from "../../API/api";
import Loading from "../../components/Loading";

const CalendarComponent = (props) => {
  const { type, variant } = props; // type: admin | volunteer, info: volunteer info array
  const [date, setDate] = useState(moment());
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    setLoading(true);
    try {
      const { data } = await AxiosInstance.get("/events/getEvents", {
        params: {
          eventDate: date.format("YYYY-MM-DD"),
        },
      });
      setEvents(data.result);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  console.log(events);

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
        <CalendarBody date={date} type={type} info={events} variant={variant} />
      )}
    </>
  );
};

CalendarComponent.propTypes = {
  type: PropTypes.string.isRequired,
  variant: PropTypes.string,
};

export default CalendarComponent;
