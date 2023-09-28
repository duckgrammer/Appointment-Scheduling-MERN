import { Typography } from "antd";
const { Text } = Typography;

const SelectWeek = ({ i, day, dayIndex, chooseDay }) => {
  return (
    <div
      style={{
        display: "inline-block",
        width: "52px",
        height: "52px",
        margin: "2px",
      }}
      key={i}
    >
      <div
        key={i}
        onClick={() => chooseDay(day, i)}
        style={
          i === dayIndex
            ? {
                border: "2px solid #ff0000",
                backgroundColor: "#f0f0f0",
                textAlign: "center",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
              }
            : {
                backgroundColor: "#f0f0f0",
                border: "2px solid #f0f0f0",
                textAlign: "center",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
              }
        }
      >
        <Text>{day.split(" ")[1]}</Text>
        <Text>{day.split(" ")[0]}</Text>
      </div>
    </div>
  );
};

export default SelectWeek;
