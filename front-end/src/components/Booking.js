import { Form, Button, Typography, Select, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
const { Text, Title } = Typography;
const { Option } = Select;

const Booking = () => {
  const [doctors, setDoctors] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  const [selectDoctor, setSelectDoctor] = useState(null);
  const [dateList, setDateList] = useState(null);
  const [selectMonth, setSelectMonth] = useState(null);
  const [dayList, setDayList] = useState(null);

  useEffect(() => {
    const availableDay = () => {
      let uniqueDay = new Set();
      selectDoctor.availableTimes.forEach((time) => {
        let date = new Date(time);
        let monthYear = new Date(selectMonth);
        if (
          date.getMonth() === monthYear.getMonth() &&
          date.getFullYear() === monthYear.getFullYear()
        ) {
          uniqueDay.add(
            date.toLocaleDateString("en-us", {
              day: "numeric",
              weekday: "short",
            })
          );
        }
      });
      setDayList(uniqueDay);
    };

    if (selectMonth !== null) {
      availableDay();
    }
  }, [selectMonth, selectDoctor]);

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
      setDateList(menus);
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
    setSelectMonth(e);
  };

  const chooseDay = (e) => {
    console.log(e.target.outerText);
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
        <Form style={{ textAlign: "left" }}>
          <Title level={2}>Booking Appointment</Title>
          <Form.Item>
            <Select placeholder="Select Doctor" onChange={chooseDoctor}>
              {doctorList}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select placeholder="Select Date" onChange={chooseMonth}>
              {dateList}
            </Select>
          </Form.Item>

          <Text>Select Schedule</Text>
          <div style={{ display: "flex", gap: "10px" }}>
            {dayList === null
              ? null
              : [...dayList].map((day, i) => {
                  return (
                    <Button key={i} value={day} onClick={chooseDay}>
                      {day}
                    </Button>
                  );
                })}
          </div>
          <Divider />
          <Divider />
          <Form.Item>
            <Button type="primary" block>
              Book now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Booking;
