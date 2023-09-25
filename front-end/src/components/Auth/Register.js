import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Button, Form, Input, Typography, Space, Checkbox } from "antd";

const { Text, Link } = Typography;
const Register = () => {
  const { register } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (value) => {
    setError("");
    if (value.password !== value.confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      await register(value.name, value.email, value.password);
      history.push("/");
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
          onFinish={handleSubmit}
          validateMessages={validateMessages}
          style={{ textAlign: "left" }}
        >
          <h1>Sign Up</h1>
          <label htmlFor="name">Name</label>
          <Form.Item name="name" rules={[{ required: true }]}>
            <Input placeholder="Your name here" />
          </Form.Item>
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
            <Input.Password placeholder="Your password" />
          </Form.Item>
          <label htmlFor="password">Confirm Password</label>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confrim your password" />
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            initialValue="false"
            rules={[
              {
                required: true,
                transform: (value) => value || undefined, // Those two lines
                type: "boolean", // Do the magic
                message: "Please agree the terms and conditions.",
              },
            ]}
          >
            <Checkbox>
              I agree to the Terms of Services and Privacy Policy
            </Checkbox>
          </Form.Item>
          <Form.Item className="submit">
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {isLoading ? "Loading..." : "Continue"}
            </Button>
          </Form.Item>
        </Form>
        <Space direction="vertical">
          <Text>
            Have an account? <Link href="/login">Sign in</Link>
          </Text>
          {error && <p>{error}</p>}
        </Space>
      </div>
    </div>
  );
};

export default Register;
