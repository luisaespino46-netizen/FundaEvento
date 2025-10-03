// src/componentes/layout/Header.jsx
import { Group, Flex, Text, ActionIcon, Avatar, Button } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import LogoutButton from "../../auth/LogoutButton";

export default function Header() {
  return (
    <Flex
      justify="space-between"
      align="center"
      px="md"
      py="sm"
      style={{ borderBottom: "1px solid #eaeaea", background: "#fff" }}
    >
      {/* Logo */}
      <Text fw={700} c="blue">
        FUNDAEVENTO
      </Text>

      {/* Sección derecha */}
      <Group spacing="lg">
        {/* Notificación */}
        <ActionIcon variant="subtle" color="dark">
          <IconBell size={20} />
        </ActionIcon>

        {/* Avatar + Nombre */}
        <Group spacing="xs">
          <Avatar radius="xl" color="blue">
            A
          </Avatar>
          <Text fw={500}>Admin</Text>
        </Group>

        {/* Botón de Logout */}
        <LogoutButton />
      </Group>
    </Flex>
  );
}
