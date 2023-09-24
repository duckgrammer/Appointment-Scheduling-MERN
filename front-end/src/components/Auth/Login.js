import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Button, Form, Input } from "antd";

const Login = () => {
  const { login } = useAuth();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (value) => {
    //value.preventDefault();
    setIsLoading(true);
    try {
      await login(value.email, value.password);
      history.push("/"); // Redirect to home page
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const validateMessages = {
    required: "Required Field!",
    types: {
      email: "Not a valid email!",
    },
  };

  return (
    <div>
      <h1>Sign In</h1>
      <p>Hi there! Nice to see you again.</p>
      <Form
        onFinish={onFinish}
        validateMessages={validateMessages}
        style={{ maxWidth: 600 }}
      >
        <label htmlFor="email">Email</label>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <label htmlFor="password">Password</label>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </Form.Item>
      </Form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        Forgot your password? <Link to="/forgot-password">Reset</Link>
      </p>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
