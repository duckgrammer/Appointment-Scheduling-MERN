import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
// custom components
import DateDivider from "../components/DateDivider";
import ProfileNav from "../components/ProfileNav";
import BottomButton from "../components/BottomButton";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookedTimes, setBookedTimes] = useState(null);
  const [bookingList, setBookingList] = useState(null);
  const [appointmentDayList, setAppointmentDayList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { logout, getUser } = useAuth();
  const history = useHistory();
  const { Text } = Typography;

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
        {user ? <ProfileNav user={user} handleLogout={handleLogout} /> : null}
        {appointmentDayList ? (
          Object.keys(appointmentDayList).map((key, i) => (
            <DateDivider
              key={key}
              i={i}
              appointmentDayList={appointmentDayList}
              deleteAppointment={deleteAppointment}
            />
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
      <BottomButton bookedTimes={bookedTimes} history={history} />
    </div>
  );
};

export default Profile;
