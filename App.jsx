import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { supabase } from "./supabase";
import Login from "./auth/Login.jsx";
import DashboardLayout from "./componentes/layout/DashboardLayout.jsx";
import Dashboard from "./componentes/Dashboard.jsx";
import Eventos from "./componentes/Eventos.jsx";
import Calendario from "./componentes/Calendario.jsx";
import Usuarios from "./componentes/Usuarios.jsx";
import Reportes from "./componentes/Reportes.jsx";
import Participantes from "./componentes/Participantes.jsx";
import CrearEvento from "./componentes/CrearEvento.jsx";

function ProtectedLayout({ session, loading, onLogout }) {
  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout user={session.user} onLogout={onLogout}>
      <Outlet />
    </DashboardLayout>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/"
          element={
            <ProtectedLayout
              session={session}
              loading={loading}
              onLogout={handleLogout}
            />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="participantes" element={<Participantes />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="crear-evento" element={<CrearEvento />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        <Route path="*" element={<Navigate to={session ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
