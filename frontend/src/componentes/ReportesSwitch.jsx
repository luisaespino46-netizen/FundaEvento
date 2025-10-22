// src/componentes/ReportesSwitch.jsx
import { Center, Loader } from "@mantine/core";
import { useAuth } from "../hooks/useAuth";
import Reportes from "./Reportes"; // Reporte global del Admin
import ReportesCoordinador from "./ReportesCoordinador"; // Reporte individual del Coordinador

export default function ReportesSwitch() {
  const { profile, loading } = useAuth();

  // 🔹 Mientras se carga el perfil, mostramos un loader
  if (loading || !profile) {
    return (
      <Center style={{ height: "70vh" }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  // 🔹 Si es Coordinador → muestra su propio reporte
  if (profile.rol === "Coordinador") {
    return <ReportesCoordinador coordinadorId={profile.id} />;
  }

  // 🔹 Si es Admin u otro rol → muestra el reporte global
  return <Reportes />;
}
