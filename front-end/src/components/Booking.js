import { Form, Button, Typography, Select, Divider } from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
const { Text, Title } = Typography;
const { Option } = Select;

const Booking = () => {
  const { getUser } = useAuth();
  const [user, setUser] = useState(null);
  const history = useHistory();
  const [doctors, setDoctors] = useState(null);
  const [dayIndex, setDayIndex] = useState(null);
  const [timeIndex, setTimeIndex] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    let currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, [getUser]);

  useEffect(() => {
    const availableTime = () => {
      let uniqueTime = new Set();
      selectDoctor.availableTimes.forEach((time) => {
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
  }, [selectDay, selectMonth, selectYear, selectDoctor]);

  useEffect(() => {
    const availableDay = () => {
      let uniqueDay = new Set();
      selectDoctor.availableTimes.forEach((time) => {
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
      console.log(sortedArray[0]);
      console.log(sortedArray[1]);

      setDayList(sortedArray);
    };

    if (selectMonth !== null && selectYear !== null) {
      availableDay();
    } else {
      setDayList(null);
    }
  }, [selectMonth, selectYear, selectDoctor]);

  useEffect(() => {
    const availableMonthYear = () => {
      let uniqueMonthYear = new Set();
      selectDoctor.availableTimes.forEach((time) => {
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
  }, [selectDoctor]);

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
            <Select
              style={{ width: 200 }}
              disabled={monthYearList === null || monthYearList.length === 0}
              placeholder="choose month"
              onChange={chooseMonth}
              size="large"
              value={
                monthYearList === null || monthYearList.length === 0
                  ? "no availability"
                  : selectYear === null || selectMonth === null
                  ? null
                  : new Date(selectYear, selectMonth).toLocaleDateString(
                      "en-us",
                      {
                        year: "numeric",
                        month: "long",
                      }
                    )
              }
            >
              {monthYearList}
            </Select>
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
                    <div
                      style={{
                        display: "inline-block",
                        width: "52px",
                        height: "52px",
                        margin: "2px",
                      }}
                      key={i}
                    >
                      <div
                        key={i}
                        onClick={() => chooseDay(day, i)}
                        style={
                          i === dayIndex
                            ? {
                                border: "2px solid #ff0000",
                                backgroundColor: "#f0f0f0",
                                textAlign: "center",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                              }
                            : {
                                backgroundColor: "#f0f0f0",
                                border: "2px solid #f0f0f0",
                                textAlign: "center",
                                borderRadius: "8px",
                                display: "flex",
                                flexDirection: "column",
                              }
                        }
                      >
                        <Text>{day.split(" ")[1]}</Text>
                        <Text>{day.split(" ")[0]}</Text>
                      </div>
                    </div>
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
                    <Button
                      size="large"
                      key={i}
                      onClick={() => chooseTime(day, i)}
                      style={
                        i === timeIndex
                          ? {
                              border: "2px solid #ff0000",
                            }
                          : {}
                      }
                    >
                      {day.toLocaleTimeString("en-us", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </Button>
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
