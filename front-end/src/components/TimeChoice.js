import { Button } from "antd";

const TimeChoice = ({ i, day, timeIndex, chooseTime }) => {
  return (
    <Button
      size="large"
      key={i}
      onClick={() => chooseTime(day, i)}
      style={
        i === timeIndex
          ? {
              border: "2px solid #ff0000",
            }
          : {}
      }
    >
      {day.toLocaleTimeString("en-us", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })}
    </Button>
  );
};

export default TimeChoice;
