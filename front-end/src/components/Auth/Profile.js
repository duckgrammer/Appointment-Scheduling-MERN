import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { Button } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";

const Profile = () => {
  const { logout, getUser } = useAuth();
  const history = useHistory();

  const [user, setUser] = useState(null);
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      console.log(currentUser);
      setIsLoading(false);
    }
  }, [getUser]);

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <h1>{user.displayName}'s Appointments</h1>
            <DownloadOutlined
              rotate={270}
              style={{ fontSize: "20px", color: "#ff5065" }}
              onClick={handleLogout}
            />
          </div>
          <p>
            <strong>Name:</strong> {user.displayName}
          </p>
          <p>
            <strong>ID:</strong> {user.uid}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <Button
            onClick={() => history.push("/booking")}
            type="primary"
            size={"large"}
            icon={
              <PlusOutlined style={{ strokeWidth: "80", stroke: "white" }} />
            }
          >
            Booking Appointment
          </Button>
        </div>
      )}
    </div>
  );
};

export default Profile;
