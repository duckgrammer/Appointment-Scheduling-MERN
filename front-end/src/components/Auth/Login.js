import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Button, Form, Input, Typography, Space } from "antd";
const { Text, Link } = Typography;

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
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Form
          onFinish={onFinish}
          validateMessages={validateMessages}
          style={{ textAlign: "left" }}
        >
          <h1>Sign In</h1>
          <p>Hi there! Nice to see you again.</p>
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
            <Input placeholder="Your email address" />
          </Form.Item>
          <label htmlFor="password">Password</label>
          <Form.Item name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
        <Space direction="vertical">
          <Text>
            Don't have an account? <Link href="/register">Register</Link>
          </Text>
          <Text>
            Forgot your password? <Link href="/forgot-password">Reset</Link>
          </Text>
          {error && <p>Invlaid login credentials</p>}
        </Space>
      </div>
    </div>
  );
};

export default Login;
