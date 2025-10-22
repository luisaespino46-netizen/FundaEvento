// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import DashboardLayout from "./componentes/layout/DashboardLayout";
import Dashboard from "./componentes/Dashboard";
import Eventos from "./componentes/Eventos";
import Calendario from "./componentes/Calendario";
import Usuarios from "./componentes/Usuarios";
import ProtectedRoute from "./auth/ProtectedRoute";

// 🔹 Importamos los componentes de reportes
import ReportesSwitch from "./componentes/ReportesSwitch"; // ✅ Detecta rol y muestra el reporte correcto

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Rutas protegidas dentro del DashboardLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["Admin", "Coordinador", "Participante"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* 🔹 Redirección inicial */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* 🔹 Vistas accesibles por todos los roles */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute roles={["Admin", "Coordinador", "Participante"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="eventos"
            element={
              <ProtectedRoute roles={["Admin", "Coordinador", "Participante"]}>
                <Eventos />
              </ProtectedRoute>
            }
          />
          <Route
            path="calendario"
            element={
              <ProtectedRoute roles={["Admin", "Coordinador", "Participante"]}>
                <Calendario />
              </ProtectedRoute>
            }
          />

          {/* 🔹 Solo visible para Admin */}
          <Route
            path="usuarios"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          {/* 🔹 Ruta de reportes (Admin y Coordinador comparten la misma) */}
          <Route
            path="reportes"
            element={
              <ProtectedRoute roles={["Admin", "Coordinador"]}>
                <ReportesSwitch /> {/* 👈 Automáticamente muestra el reporte correcto */}
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 🚫 Cualquier ruta desconocida redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
