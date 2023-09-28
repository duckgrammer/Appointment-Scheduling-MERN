import { Typography, Card, Popover } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
const { Text } = Typography;
const { Meta } = Card;

const DateDivider = ({ key, i, appointmentDayList, deleteAppointment }) => {
  return (
    <div key={i}>
      <div
        key={i}
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "#f0f0f0",
          marginBottom: "1em",
          padding: "0.25em",
        }}
      >
        <Text>{key}</Text>
      </div>
      {appointmentDayList[key].map((detail, j) => (
        <Card
          key={j}
          title={
            <>
              {detail.name}
              <Popover
                placement="top"
                content={
                  <div
                    style={{ cursor: "pointer", color: "#ff5065" }}
                    onClick={() => deleteAppointment(detail)}
                  >
                    delete
                  </div>
                }
              >
                <EllipsisOutlined
                  style={{ marginInline: "0.5em", cursor: "pointer" }}
                />
              </Popover>
            </>
          }
          extra={new Date(detail.time).toLocaleTimeString("en-us", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
          style={{
            marginBottom: "1em",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f0f0f0",
            marginInline: "1em",
          }}
          description="This is the description"
        >
          <Meta description={detail.specialization} />
        </Card>
      ))}
    </div>
  );
};

export default DateDivider;
