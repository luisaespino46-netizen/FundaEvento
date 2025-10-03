// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import DashboardLayout from "./componentes/layout/DashboardLayout";
import Dashboard from "./componentes/Dashboard";
import Eventos from "./componentes/Eventos";
import Calendario from "./componentes/Calendario";
import Usuarios from "./componentes/Usuarios";
import Reportes from "./componentes/Reportes";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>

        {/* Cualquier ruta desconocida redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
