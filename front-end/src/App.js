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
          colorLink: "#ff5065",
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
