import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Button, Typography, Card } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const Profile = () => {
  const { logout, getUser } = useAuth();
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [bookingList, setBookingList] = useState(null);
  const [appointmentList, setAppointmentList] = useState([]);
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
    }
  }, [user]);

  useEffect(() => {
    const getBooking = async () => {
      let alist = [];

      for (let i = 0; i < bookingList.length; i++) {
        var requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        await fetch(
          "http://localhost:3001/booking/getBooking/" + bookingList[i],
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => alist.push(result[0]));
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
          <p>Loading...</p>
        ) : (
          <div>
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
            <p>
              <strong>ID:</strong> {user.uid}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {appointmentList.map((detail, i) => {
              return (
                <Card
                  key={i}
                  title={detail.doctorId}
                  extra={new Date(detail.time).toLocaleTimeString("en-us", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Text>{detail.patientId}</Text>
                </Card>
              );
            })}
            <Button
              style={{ marginTop: "0.5em" }}
              onClick={() => history.push("/booking")}
              type="primary"
              size={"large"}
              icon={
                <PlusOutlined style={{ strokeWidth: "80", stroke: "white" }} />
              }
              block
            >
              Booking Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
