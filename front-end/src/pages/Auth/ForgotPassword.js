import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { Button, Form, Input, Typography } from "antd";
const { Title, Text, Link } = Typography;

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    setMessage("");
    setError("");
    forgotPassword(email)
      .then(() => {
        setMessage("Check your email for a reset link");
        setEmail("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div style={{ padding: "1em", textAlign: "center" }}>
      <div
        style={{
          display: "inline-block",
          maxWidth: "400px",
          width: "100%",
          fontWeight: 500,
          textAlign: "left",
        }}
      >
        <Title level={2}>Forgot Password</Title>
        <Form onFinish={handleSubmit}>
          <Form.Item
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input
              placeholder="Email"
              value={email}
              size="large"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
        {message && <Text>{message}</Text>}
        {error && <Text>{error}</Text>}
        <p>
          <Link href="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
