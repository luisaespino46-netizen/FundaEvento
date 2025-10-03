import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import SidebarItems from "./SidebarItems.jsx";  // 👈 corregido
import Header from "./Header.jsx";

export default function DashboardLayout() {
  return (
    <AppShell
      padding="md"
      navbar={{ width: 250, breakpoint: "sm" }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <SidebarItems />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
