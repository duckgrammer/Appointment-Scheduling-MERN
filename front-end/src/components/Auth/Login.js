import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Button, Form, Input, Typography, Space } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
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
    <div style={{ padding: "1em", textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          maxWidth: "400px",
          width: "100%",
          fontWeight: 500,
        }}
      >
        <Form
          onFinish={onFinish}
          validateMessages={validateMessages}
          style={{ textAlign: "left" }}
          requiredMark={false}
          layout="vertical"
        >
          <h1>Sign In</h1>
          <p style={{ color: "#bbb" }}>Hi there! Nice to see you again.</p>
          <Form.Item
            name="email"
            label={<label style={{ color: "#ff5065" }}>Email</label>}
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input size="large" placeholder="Your email address" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true }]}
            label={<label style={{ color: "#ff5065" }}>Password</label>}
          >
            <Input.Password size="large" placeholder="Password" />
          </Form.Item>
          <Form.Item style={{ paddingInline: "1em" }}>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {isLoading ? (
                <>
                  <LoadingOutlined /> <Text>Loading</Text>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Form.Item>
        </Form>
        <Space direction="vertical">
          <Text style={{ color: "#bbb" }}>
            Don't have an account? <Link href="/register">Register</Link>
          </Text>
          <Text style={{ color: "#bbb" }}>
            Forgot your password? <Link href="/forgot-password">Reset</Link>
          </Text>
          {error && <p>Invlaid login credentials</p>}
        </Space>
      </div>
    </div>
  );
};

export default Login;
