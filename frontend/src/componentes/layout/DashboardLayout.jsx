// src/componentes/layout/DashboardLayout.jsx
import { AppShell } from "@mantine/core";
import SidebarItems from "./SidebarItems";
import Header from "./Header";

export default function DashboardLayout({ children, user, onLogout }) {
  return (
    <AppShell
      padding="md"
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: false } }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Header user={user} onLogout={onLogout} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <SidebarItems />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
