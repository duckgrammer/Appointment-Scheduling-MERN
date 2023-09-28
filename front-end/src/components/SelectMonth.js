import { Select } from "antd";

const SelectMonth = ({
  monthYearList,
  chooseMonth,
  selectMonth,
  selectYear,
}) => {
  return (
    <Select
      style={{ width: 200 }}
      disabled={monthYearList === null || monthYearList.length === 0}
      placeholder="choose month"
      onChange={chooseMonth}
      size="large"
      value={
        monthYearList === null || monthYearList.length === 0
          ? "no availability"
          : selectYear === null || selectMonth === null
          ? null
          : new Date(selectYear, selectMonth).toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
            })
      }
    >
      {monthYearList}
    </Select>
  );
};
export default SelectMonth;
