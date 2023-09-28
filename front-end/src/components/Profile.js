import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Button, Typography, Card, Popover } from "antd";
import {
  DownloadOutlined,
  LoadingOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
const { Text, Title } = Typography;
const { Meta } = Card;

const Profile = () => {
  const { logout, getUser } = useAuth();
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [bookedTimes, setBookedTimes] = useState(null);
  const [bookingList, setBookingList] = useState(null);
  const [appointmentDayList, setAppointmentDayList] = useState(null);
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
          .then((result) => {
            setBookingList(result[0].bookings);
            setBookedTimes(result[0].bookedTimes);
          });
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
    const getDoctorById = async (id, doctorId, time) => {
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
          id: id,
          doctorId: doctorId,
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

        if (result.length !== 0 && new Date(result[0].time) >= new Date()) {
          const doctorInfo = await getDoctorById(
            result[0]._id,
            result[0].doctorId,
            result[0].time
          );

          alist.push(doctorInfo);
        }
      }

      alist.forEach((item) => {
        item.time = new Date(item.time);
      });

      alist.sort((a, b) => a.time - b.time);

      const groupedData = {};
      alist.forEach((item) => {
        let dateKey = item.time.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const today = new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        if (dateKey === today) {
          dateKey = "Today";
        }

        if (!groupedData[dateKey]) {
          groupedData[dateKey] = [];
        }
        groupedData[dateKey].push(item);
      });

      setAppointmentDayList(groupedData);
    };

    if (bookingList !== null) {
      getBooking();
    }
  }, [bookingList]);

  const deleteAppointment = async (e) => {
    console.log(e);
    console.log(user.uid);
    try {
      // Delete booking
      var requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      await fetch(
        "http://localhost:3001/booking/removeBooking/" + e.id,
        requestOptions
      );

      //Delete Doctor Booking
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        time: e.time,
        bookingId: e.id,
      });

      var requestOptions2 = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      await fetch(
        "http://localhost:3001/doctor/unbookTime/" + e.doctorId,
        requestOptions2
      );

      // Delete Patient Booking
      var myHeaders3 = new Headers();
      myHeaders3.append("Content-Type", "application/json");

      var raw3 = JSON.stringify({
        bookingId: e.id,
        time: e.time,
      });

      var requestOptions3 = {
        method: "DELETE",
        headers: myHeaders3,
        body: raw3,
        redirect: "follow",
      };

      await fetch(
        "http://localhost:3001/patient/removeAppointment/" + user.uid,
        requestOptions3
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          maxWidth: "600px",
          width: "100%",
          textAlign: "left",
          minHeight: "100vh",
          marginTop: "1em",
        }}
      >
        {isLoading ? (
          <>
            <LoadingOutlined /> <Text>Loading</Text>
          </>
        ) : null}
        {user ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "1em",
              marginBottom: "1em",
            }}
          >
            <Title
              level={5}
              style={{ marginBlock: "0px", flexGrow: 1, textAlign: "center" }}
            >
              {user.displayName}'s Appointments
            </Title>
            <DownloadOutlined
              rotate={270}
              style={{ fontSize: "20px", color: "#ff5065" }}
              onClick={handleLogout}
            />
          </div>
        ) : null}
        {appointmentDayList ? (
          Object.keys(appointmentDayList).map((key, i) => (
            <div key={i}>
              <div
                key={i}
                style={{
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "#f0f0f0",
                  marginBottom: "1em",
                  padding: "0.25em",
                }}
              >
                <Text>{key}</Text>
              </div>
              {appointmentDayList[key].map((detail, j) => (
                <Card
                  key={j}
                  title={
                    <>
                      {detail.name}
                      <Popover
                        placement="top"
                        content={
                          <div
                            style={{ cursor: "pointer", color: "#ff5065" }}
                            onClick={() => deleteAppointment(detail)}
                          >
                            delete
                          </div>
                        }
                      >
                        <EllipsisOutlined
                          style={{ marginInline: "0.5em", cursor: "pointer" }}
                        />
                      </Popover>
                    </>
                  }
                  extra={new Date(detail.time).toLocaleTimeString("en-us", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                  style={{
                    marginBottom: "1em",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f0f0f0",
                    marginInline: "1em",
                  }}
                  description="This is the description"
                >
                  <Meta description={detail.specialization} />
                </Card>
              ))}
            </div>
          ))
        ) : (
          <div
            style={{
              marginLeft: "1em",
              paddingBottom: "2em",
            }}
          >
            <LoadingOutlined /> <Text>Loading</Text>
          </div>
        )}
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            padding: "2em",
          }}
        >
          <Button
            onClick={() =>
              history.push("/booking", { bookedTimes: bookedTimes })
            }
            type="primary"
            size="large"
            style={{ maxWidth: "500px" }}
            icon={
              <PlusOutlined style={{ strokeWidth: "80", stroke: "white" }} />
            }
            block
          >
            Booking Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
