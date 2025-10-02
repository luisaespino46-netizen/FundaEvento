// src/componentes/layout/SidebarItems.jsx
import { NavLink } from "@mantine/core";
import { Link } from "react-router-dom";
import {
  IconHome,
  IconCalendarEvent, // ✅ usamos este en lugar de IconCalendar
  IconUsers,
  IconReportAnalytics,
  IconCalendar,
} from "@tabler/icons-react";

export default function SidebarItems() {
  return (
    <>
      <NavLink
        component={Link}
        to="/"
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
        leftSection={<IconCalendar size={18} />} // ✅ ya importado arriba
      />
      <NavLink
        component={Link}
        to="/usuarios"
        label="Usuarios"
        leftSection={<IconUsers size={18} />}
      />
      <NavLink
        component={Link}
        to="/reportes"
        label="Reportes"
        leftSection={<IconReportAnalytics size={18} />}
      />
    </>
  );
}
