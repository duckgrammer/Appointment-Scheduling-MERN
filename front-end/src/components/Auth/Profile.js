import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Button, Typography, Card } from "antd";
import {
  DownloadOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
const { Text, Title } = Typography;
const { Meta } = Card;

const Profile = () => {
  const { logout, getUser } = useAuth();
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [bookingList, setBookingList] = useState(null);
  const [appointmentList, setAppointmentList] = useState(null);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setIsLoading(false);
    }
  }, [getUser]);

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  useEffect(() => {
    const getAppointment = async () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {
        await fetch(
          "http://localhost:3001/patient/getPatient/" + user.uid,
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => setBookingList(result[0].bookings));
      } catch (err) {
        console.log(err);
      }
    };

    if (user !== null) {
      getAppointment();
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const getDoctorById = async (doctorId, time) => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "http://localhost:3001/doctor/getDoctor/" + doctorId,
          requestOptions
        );
        const result = await response.json();

        const doctorInfo = {
          name: result[0].name,
          specialization: result[0].specialization,
          time: time,
        };
        return doctorInfo;
      } catch (err) {
        console.log(err);
      }
    };

    const getBooking = async () => {
      let alist = [];

      for (let i = 0; i < bookingList.length; i++) {
        var requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          "http://localhost:3001/booking/getBooking/" + bookingList[i],
          requestOptions
        );
        const result = await response.json();

        const doctorInfo = await getDoctorById(
          result[0].doctorId,
          result[0].time
        );
        alist.push(doctorInfo);
      }

      setAppointmentList(alist);
    };

    if (bookingList !== null) {
      getBooking();
    }
  }, [bookingList]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          maxWidth: "400px",
          width: "100%",
          textAlign: "left",
        }}
      >
        {isLoading ? (
          <LoadingOutlined style={{ marginBottom: "0.5em" }} />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBlock: "0.5em",
            }}
          >
            <Title level={2} style={{ marginBlock: "0px" }}>
              {user.displayName}'s Appointments
            </Title>
            <DownloadOutlined
              rotate={270}
              style={{ fontSize: "20px", color: "#ff5065" }}
              onClick={handleLogout}
            />
          </div>
        )}
        {appointmentList === null ? (
          <Text>
            <LoadingOutlined /> Loading
          </Text>
        ) : (
          appointmentList.map((detail, i) => {
            return (
              <Card
                key={i}
                title={detail.name}
                extra={new Date(detail.time).toLocaleTimeString("en-us", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
                style={{
                  marginBottom: "0.5em",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#f0f0f0",
                }}
                description="This is the description"
              >
                <Meta description={detail.specialization} />
              </Card>
            );
          })
        )}
        <Button
          onClick={() => history.push("/booking")}
          type="primary"
          size={"large"}
          icon={<PlusOutlined style={{ strokeWidth: "80", stroke: "white" }} />}
          block
        >
          Booking Appointment
        </Button>
      </div>
    </div>
  );
};

export default Profile;
