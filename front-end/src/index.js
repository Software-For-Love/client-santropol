import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "styled-components";
import theme from "./Theme";
import { ConfigProvider } from "antd";
import en_GB from "antd/lib/locale-provider/en_GB";
import moment from "moment";
import "moment/locale/en-gb"; // important!
import { AuthProvider } from "./Contexts/AuthContext";

moment.locale("en-gb");

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ConfigProvider locale={en_GB}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
