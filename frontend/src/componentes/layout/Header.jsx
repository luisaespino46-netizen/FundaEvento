// src/componentes/layout/Header.jsx
import { Group, Text, ActionIcon, Indicator, Avatar, Menu } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";

export default function Header({ user, onLogout }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b">
      {/* Logo */}
      <Text fw={700} size="lg" c="blue">
        FUNDAEVENTO
      </Text>

      {/* Sección derecha */}
      <Group>
        {/* Notificaciones */}
        <Indicator label="3" size={18} color="red">
          <ActionIcon variant="subtle" color="dark" radius="xl">
            <IconBell size={20} />
          </ActionIcon>
        </Indicator>

        {/* Usuario */}
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Group spacing="xs" className="cursor-pointer">
              <Avatar color="blue" radius="xl">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </Avatar>
              <Text fw={500}>{user?.email || "Admin"}</Text>
            </Group>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>Perfil</Menu.Item>
            <Menu.Item>Configuración</Menu.Item>
            <Menu.Item color="red" onClick={onLogout}>
              Cerrar sesión
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
}
