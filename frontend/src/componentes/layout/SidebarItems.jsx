// src/componentes/layout/SidebarItems.jsx
import { NavLink } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconHome,
  IconCalendarEvent,
  IconUsers,
  IconReportAnalytics,
  IconCalendar,
} from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth"; // 👈 para obtener el rol

export default function SidebarItems() {
  const { profile } = useAuth(); // 👈 obtenemos el perfil del usuario
  const rol = profile?.rol; // "Admin", "Coordinador" o "Participante"

  return (
    <>
      <NavLink
        component={Link}
        to="/dashboard"
        label="Dashboard"
        leftSection={<IconHome size={18} />}
      />
      <NavLink
        component={Link}
        to="/eventos"
        label="Eventos"
        leftSection={<IconCalendarEvent size={18} />}
      />
      <NavLink
        component={Link}
        to="/calendario"
        label="Calendario"
        leftSection={<IconCalendar size={18} />}
      />

      {/* 🔹 Solo el ADMIN puede ver la pestaña de Usuarios */}
      {rol === "Admin" && (
        <NavLink
          component={Link}
          to="/usuarios"
          label="Usuarios"
          leftSection={<IconUsers size={18} />}
        />
      )}

      {/* 🔹 Admin y Coordinador pueden ver Reportes */}
      {(rol === "Admin" || rol === "Coordinador") && (
        <NavLink
          component={Link}
          to="/reportes"
          label="Reportes"
          leftSection={<IconReportAnalytics size={18} />}
        />
      )}
    </>
  );
}
