import React from "react";
import { Route, Switch } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./pages/PrivateRoute";

// Routes
//import Home from "./components/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";

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
