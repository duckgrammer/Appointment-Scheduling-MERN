import React from "react";
import { Route, Switch } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Routes
//import Home from "./components/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Profile";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Booking from "./components/Booking";

const Router = () => {
  // use PrivateRoute for protected routes
  return (
    <AuthProvider>
      <Switch>
        <PrivateRoute exact path="/" component={Profile} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/booking" component={Booking} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
      </Switch>
    </AuthProvider>
  );
};

export default Router;
