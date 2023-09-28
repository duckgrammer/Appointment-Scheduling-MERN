import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { Button, Form, Input, Typography, Space, Checkbox } from "antd";
const { Text, Link } = Typography;

const Register = () => {
  const { register, getUser } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setUserId] = useState(null);
  const [checked, setChecked] = useState(false);

  const handleSubmit = async (value) => {
    setError("");
    if (value.password !== value.confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      setIsLoading(true);
      await register(value.name, value.email, value.password);
      createUser();
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const createUser = async () => {
    let currentUser = getUser();
    if (currentUser) {
      setUserId(currentUser.uid);
    }
  };

  useEffect(() => {
    const fetchFact = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      try {
        var raw = JSON.stringify({
          _id: currentUserId,
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        await fetch("http://localhost:3001/patient/create", requestOptions);
        history.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    if (currentUserId !== null) {
      fetchFact();
    }
  }, [currentUserId, history]);

  const validateMessages = {
    required: "Required Field!",
    types: {
      email: "Not a valid email!",
    },
  };

  const onChange = (e) => {
    setChecked(e.target.checked);
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
          onFinish={handleSubmit}
          validateMessages={validateMessages}
          style={{ textAlign: "left" }}
          requiredMark={false}
        >
          <h1>Sign Up</h1>
          <Form.Item
            name="name"
            rules={[{ required: true }]}
            label={<label style={{ color: "#ff5065" }}>Name</label>}
          >
            <Input size="large" placeholder="Your name here" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
            label={<label style={{ color: "#ff5065" }}>Email</label>}
          >
            <Input size="large" placeholder="Your email address" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true }]}
            label={<label style={{ color: "#ff5065" }}>Password</label>}
          >
            <Input.Password size="large" placeholder="Your password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            label={<label style={{ color: "#ff5065" }}>Confirm Password</label>}
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
            <Input.Password size="large" placeholder="Confrim your password" />
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
            <Checkbox onChange={onChange}>
              I agree to the <Link>Terms of Services</Link> and{" "}
              <Link>Privacy Policy</Link>
            </Checkbox>
          </Form.Item>
          <Form.Item className="submit">
            <Button
              block
              type="primary"
              htmlType="submit"
              className="login-form-button"
              disabled={!checked}
            >
              {isLoading ? "Loading..." : "Continue"}
            </Button>
          </Form.Item>
        </Form>
        <Space direction="vertical">
          <Text style={{ color: "#bbb" }}>
            Have an account? <Link href="/login">Sign in</Link>
          </Text>
          {error && <p>{error}</p>}
        </Space>
      </div>
    </div>
  );
};

export default Register;
