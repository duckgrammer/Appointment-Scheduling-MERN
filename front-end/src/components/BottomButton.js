import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const BottomButton = ({ bookedTimes, history }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "2em",
        }}
      >
        <Button
          onClick={() => history.push("/booking", { bookedTimes: bookedTimes })}
          type="primary"
          size="large"
          style={{ maxWidth: "500px" }}
          icon={<PlusOutlined style={{ strokeWidth: "80", stroke: "white" }} />}
          block
        >
          Booking Appointment
        </Button>
      </div>
    </div>
  );
};

export default BottomButton;
