import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import Router from "./Router";
import "./index.css";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff5065",
          //colorBgContainer: "#f6ffed",
        },
      }}
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
