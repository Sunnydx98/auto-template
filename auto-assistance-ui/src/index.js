import React from "react";
import ReactDOM from "react-dom"; // ✅ 这里要去掉 /client
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root")); // ✅ 适用于 React 16
