import { Form, Button, Typography, Select, Divider, message } from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

// components
import SelectMonth from "../components/SelectMonth";
import SelectWeek from "../components/SelectWeek";
import TimeChoice from "../components/TimeChoice";

const Booking = () => {
  const [user, setUser] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [doctors, setDoctors] = useState(null);
  const [dayIndex, setDayIndex] = useState(null);
  const [timeIndex, setTimeIndex] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState(null);
  const [error, setError] = useState(null);

  // Sorted Lists
  const [doctorSpecList, setDoctorSpecList] = useState(null);
  const [monthYearList, setMonthYearList] = useState(null);
  const [dayList, setDayList] = useState(null);
  const [timeList, setTimeList] = useState(null);

  // Selected Choices
  const [selectDoctor, setSelectDoctor] = useState(null);
  const [selectMonth, setSelectMonth] = useState(null);
  const [selectYear, setSelectYear] = useState(null);
  const [selectDay, setSelectDay] = useState(null);
  const [selectTime, setSelectTime] = useState(null);

  const { getUser } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { Title } = Typography;
  const { Option } = Select;
  const bookedTimes = location.state?.bookedTimes || "No message received";

  useEffect(() => {
    let currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [getUser]);

  useEffect(() => {
    const availableTime = () => {
      let uniqueTime = new Set();
      availableTimes.forEach((time) => {
        let date = new Date(time);
        if (
          date.getMonth() === selectMonth &&
          date.getFullYear() === selectYear &&
          date.getDate() === selectDay
        ) {
          uniqueTime.add(new Date(time));
        }
      });

      let sortedArray = [...uniqueTime];
      sortedArray.sort((a, b) => new Date(a) - new Date(b));
      setTimeList(sortedArray);
    };

    if (selectDay !== null && selectMonth !== null && selectYear !== null) {
      availableTime();
    } else {
      setTimeList(null);
    }
  }, [selectDay, selectMonth, selectYear, selectDoctor, availableTimes]);

  useEffect(() => {
    const availableDay = () => {
      let uniqueDay = new Set();
      availableTimes.forEach((time) => {
        let date = new Date(time);
        if (
          date.getMonth() === selectMonth &&
          date.getFullYear() === selectYear
        ) {
          uniqueDay.add(
            new Date(time).toLocaleDateString("en-us", {
              day: "numeric",
              weekday: "short",
            })
          );
        }
      });

      let sortedArray = [...uniqueDay];
      sortedArray.sort((a, b) => a.split(" ")[0] - b.split(" ")[0]);

      setDayList(sortedArray);
    };

    if (selectMonth !== null && selectYear !== null) {
      availableDay();
    } else {
      setDayList(null);
    }
  }, [selectMonth, selectYear, selectDoctor, availableTimes]);

  useEffect(() => {
    const availableMonthYear = () => {
      let uniqueMonthYear = new Set();
      availableTimes.forEach((time) => {
        uniqueMonthYear.add(
          new Date(time).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
          })
        );
      });

      let sortedArray = [...uniqueMonthYear];
      sortedArray.sort((a, b) => new Date(a) - new Date(b));

      let menus = [...sortedArray].map((time, key) => {
        return (
          <Option key={key} value={time} icon={<UserOutlined />}>
            {time}
          </Option>
        );
      });

      setMonthYearList(menus);
    };

    if (selectDoctor !== null) {
      availableMonthYear();
    } else {
      setMonthYearList(null);
    }
  }, [availableTimes, selectDoctor]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        var requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        await fetch("http://localhost:3001/doctor/getAll", requestOptions)
          .then((response) => response.json())
          .then((result) => setDoctors(result));
      } catch (err) {
        console.log(err);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const doctorSort = () => {
      const groupedDoctors = {};

      doctors.forEach((doctor, key) => {
        const { specialization } = doctor;

        if (!groupedDoctors[specialization]) {
          groupedDoctors[specialization] = [];
        }

        doctor["value"] = key;

        doctor["label"] = doctor["name"];
        delete doctor["name"];

        groupedDoctors[specialization].push(doctor);
      });

      let docSpec = [];
      for (const key in groupedDoctors) {
        docSpec.push({
          label: key,
          options: groupedDoctors[key],
        });
      }

      setDoctorSpecList(docSpec);
    };

    if (doctors !== null) {
      doctorSort();
    }
  }, [doctors]);

  const chooseDocSpec = (e) => {
    setSelectYear(null);
    setSelectMonth(null);
    setSelectDay(null);
    setSelectTime(null);
    setDayIndex(null);
    setTimeIndex(null);

    const filteredDates = doctors[e].availableTimes.filter((date) => {
      const today = new Date();
      return new Date(date); // >= today;
    });
    setAvailableTimes(filteredDates);
    setSelectDoctor(doctors[e]);
  };

  const chooseMonth = (e) => {
    setSelectDay(null);
    setDayIndex(null);
    setTimeIndex(null);
    setSelectTime(null);

    let date = new Date(e);
    setSelectYear(date.getFullYear());
    setSelectMonth(date.getMonth());
  };

  const chooseDay = (e, i) => {
    setTimeIndex(null);
    setSelectTime(null);

    setSelectDay(parseInt(e.split(" ")[0]));
    setDayIndex(i);
  };

  const chooseTime = (e, i) => {
    setSelectTime(e.toISOString());
    setTimeIndex(i);
  };

  const handleSubmit = async () => {
    if (bookedTimes.includes(selectTime)) {
      messageApi.open({
        type: "error",
        content: "You already have an appointment at this time",
      });
    } else {
      if (selectTime !== null) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          patientId: user.uid,
          doctorId: selectDoctor._id,
          time: selectTime,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        try {
          setIsLoading(true);
          await fetch("http://localhost:3001/booking/create", requestOptions)
            .then((response) => response.json())
            .then((data) => {
              setBookingId(data._id);
            });
        } catch (error) {
          setError(error.message);
        }
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const doctorBookAppointment = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        time: selectTime,
        bookingId: bookingId,
      });

      var requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        await fetch(
          "http://localhost:3001/doctor/bookTime/" + selectDoctor._id,
          requestOptions
        );
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    const patientAddAppointment = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        bookingId: bookingId,
        time: selectTime,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        await fetch(
          "http://localhost:3001/patient/addAppointment/" + user.uid,
          requestOptions
        );
      } catch (error) {
        setError(error.message);
      }
    };

    const submit = async () => {
      await doctorBookAppointment();
      await patientAddAppointment();
      await setIsLoading(false);
      history.push("/");
    };

    if (bookingId !== null) {
      submit();
    }
  }, [bookingId, selectDoctor, selectTime, user, history]);

  useEffect(() => {
    if (error !== null) {
      console.log(error);
    }
  }, [error]);

  return (
    <div style={{ textAlign: "center", padding: "1.5em" }}>
      {contextHolder}
      <div
        style={{
          display: "inline-block",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <div
          style={{
            textAlign: "left",
          }}
        >
          <ArrowLeftOutlined
            style={{ color: "#ff5065" }}
            onClick={() => history.push("/")}
          />
        </div>
        <Form style={{ textAlign: "left" }} onFinish={handleSubmit}>
          <Title level={3}>Booking Appointment</Title>
          <Form.Item>
            <Select
              style={{ width: 200 }}
              options={doctorSpecList}
              onChange={chooseDocSpec}
              placeholder="choose doctor"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <SelectMonth
              monthYearList={monthYearList}
              chooseMonth={chooseMonth}
              selectMonth={selectMonth}
              selectYear={selectYear}
            />
          </Form.Item>

          {dayList === null ? null : (
            <>
              <Title level={5}>Select Schedule</Title>
              <div
                style={{
                  overflowX: "scroll",
                  overflowY: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {[...dayList].map((day, i) => {
                  return (
                    <SelectWeek
                      key={i}
                      i={i}
                      day={day}
                      dayIndex={dayIndex}
                      chooseDay={chooseDay}
                    />
                  );
                })}
              </div>
              <Divider />
            </>
          )}

          {timeList === null ? null : (
            <>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {[...timeList].map((day, i) => {
                  return (
                    <TimeChoice
                      key={i}
                      i={i}
                      day={day}
                      timeIndex={timeIndex}
                      chooseTime={chooseTime}
                    />
                  );
                })}
              </div>
              <Divider />
            </>
          )}

          <Form.Item style={{ paddingInline: "1em" }}>
            <Button
              disabled={selectTime === null}
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              {isLoading ? <LoadingOutlined /> : "Book now"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Booking;
