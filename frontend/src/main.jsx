// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";   // 👈 importa los estilos globales

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="light"
      theme={{
        primaryColor: "blue",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
