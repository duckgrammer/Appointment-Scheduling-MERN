import { Form, Button, Typography, Select, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
const { Text, Title } = Typography;
const { Option } = Select;

const Booking = () => {
  const [doctors, setDoctors] = useState(null);
  const [dayIndex, setDayIndex] = useState(null);
  const [timeIndex, setTimeIndex] = useState(null);

  // Sorted Lists
  const [doctorList, setDoctorList] = useState(null);
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
    const availableTime = () => {
      let uniqueTime = new Set();
      selectDoctor.availableTimes.forEach((time) => {
        let date = new Date(time);
        if (
          date.getMonth() === selectMonth &&
          date.getFullYear() === selectYear &&
          date.getDay() === selectDay
        ) {
          uniqueTime.add(new Date(time));
        }
      });

      setTimeList(uniqueTime);
    };

    if (selectDay !== null && selectMonth !== null && selectYear !== null) {
      availableTime();
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

      setDayList(uniqueDay);
    };

    if (selectMonth !== null && selectYear !== null) {
      availableDay();
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

      let menus = [...uniqueMonthYear].map((time, key) => {
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
    const doctorMenu = () => {
      let menus = doctors.map((doctor, key) => {
        return (
          <Option key={key} value={doctor.key} icon={<UserOutlined />}>
            {doctor.name}
          </Option>
        );
      });
      setDoctorList(menus);
    };

    if (doctors !== null) {
      doctorMenu();
    }
  }, [doctors]);

  const chooseDoctor = (e) => {
    setSelectDoctor(doctors[e]);
  };

  const chooseMonth = (e) => {
    let date = new Date(e);
    setSelectYear(date.getFullYear());
    setSelectMonth(date.getMonth());
  };

  const chooseDay = (e, i) => {
    setSelectDay(parseInt(e.split(" ")[0]) - 1);
    setDayIndex(i);
  };

  const chooseTime = (e, i) => {
    setSelectTime(e.toISOString());
    setTimeIndex(i);
  };

  const handleSubmit = () => {
    if (selectTime !== null) {
      console.log(selectTime);
      console.log(selectDoctor._id);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Form style={{ textAlign: "left" }} onFinish={handleSubmit}>
          <Title level={2}>Booking Appointment</Title>
          <Form.Item>
            <Select placeholder="Select Doctor" onChange={chooseDoctor}>
              {doctorList}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              disabled={selectDoctor === null}
              placeholder="Select Date"
              onChange={chooseMonth}
            >
              {monthYearList}
            </Select>
          </Form.Item>

          <Text>Select Schedule</Text>
          <div style={{ display: "flex", gap: "10px" }}>
            {dayList === null
              ? null
              : [...dayList].map((day, i) => {
                  return (
                    <Button
                      key={i}
                      onClick={() => chooseDay(day, i)}
                      style={i === dayIndex ? { borderColor: "#ff0000" } : {}}
                    >
                      {day}
                    </Button>
                  );
                })}
          </div>
          <Divider />
          <div style={{ display: "flex", gap: "10px" }}>
            {timeList === null
              ? null
              : [...timeList].map((day, i) => {
                  return (
                    <Button
                      key={i}
                      onClick={() => chooseTime(day, i)}
                      style={i === timeIndex ? { borderColor: "#ff0000" } : {}}
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
          <Form.Item>
            <Button
              disabled={selectTime === null}
              type="primary"
              htmlType="submit"
              block
            >
              Book now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Booking;
