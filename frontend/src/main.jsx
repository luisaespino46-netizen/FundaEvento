// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";   // 👈 Importa el DatesProvider

// Estilos globales
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";              // 👈 Importa los estilos de calendario

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="light"
      theme={{
        primaryColor: "blue",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* 👇 Encapsula tu app con DatesProvider */}
      <DatesProvider settings={{ locale: "en", firstDayOfWeek: 0 }}>
        <App />
      </DatesProvider>
    </MantineProvider>
  </React.StrictMode>
);
