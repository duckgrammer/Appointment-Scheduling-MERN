import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  // If the user is logged in, render the component. Otherwise, redirect to login.
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}
