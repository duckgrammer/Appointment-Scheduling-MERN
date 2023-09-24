import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";

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
  }, []);

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  return (
    <div>
      <h1>Profile</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {user.displayName}
          </p>
          <p>
            <strong>ID:</strong> {user.uid}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
