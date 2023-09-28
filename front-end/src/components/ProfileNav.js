import { Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
const { Title } = Typography;

const ProfileNav = ({ user, handleLogout }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1em",
        marginBottom: "1em",
      }}
    >
      <Title
        level={5}
        style={{ marginBlock: "0px", flexGrow: 1, textAlign: "center" }}
      >
        {user.displayName}'s Appointments
      </Title>
      <DownloadOutlined
        rotate={270}
        style={{ fontSize: "20px", color: "#ff5065" }}
        onClick={handleLogout}
      />
    </div>
  );
};

export default ProfileNav;
