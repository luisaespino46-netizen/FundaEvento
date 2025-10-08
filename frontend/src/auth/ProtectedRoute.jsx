// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useAuth();

  // 🟡 Mientras se carga la sesión o el perfil
  if (loading || (user && !profile)) {
    console.log("⏳ Esperando que cargue el perfil del usuario...");
    return <p style={{ textAlign: "center" }}>Cargando sesión...</p>;
  }

  // 🔴 Si no hay usuario autenticado
  if (!user) {
    console.warn("⛔ Usuario no autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // 🔴 Si hay usuario pero el perfil no está cargado correctamente
  if (!profile) {
    console.warn("⚠️ Usuario autenticado pero sin registro en la tabla 'usuarios'");
    return <Navigate to="/login" replace />;
  }

  // 🚫 Verificación de roles
  if (roles && !roles.includes(profile.rol)) {
    console.warn(
      `🚫 Rol no autorizado: ${profile.rol}. Acceso restringido a ${roles.join(", ")}`
    );
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Si todo está correcto
  console.log(`✅ Acceso autorizado para: ${profile.nombre} (${profile.rol})`);
  return children;
}
