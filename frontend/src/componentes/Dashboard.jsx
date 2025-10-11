// src/componentes/Dashboard.jsx
import { useAuth } from "../hooks/useAuth";
import DashboardAdmin from "./DashboardAdmin";
import DashboardCoordinador from "./DashboardCoordinador";
import DashboardParticipante from "./DashboardParticipante";
import { Loader, Center } from "@mantine/core";

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  if (!profile) {
    return (
      <Center style={{ height: "100vh" }}>
        <p>No se encontró el perfil del usuario.</p>
      </Center>
    );
  }

  switch (profile.rol) {
    case "Admin":
      return <DashboardAdmin />;
    case "Coordinador":
      return <DashboardCoordinador />;
    case "Participante":
      return <DashboardParticipante />;
    default:
      return (
        <Center style={{ height: "100vh" }}>
          <p>Rol no reconocido: {profile.rol}</p>
        </Center>
      );
  }
}
