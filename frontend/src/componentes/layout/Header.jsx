// src/componentes/layout/Header.jsx
import { Group, Text, Button, Avatar } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { supabase } from "../../supabase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // 🔹 Si aún no se ha cargado el perfil
  if (!profile) {
    return (
      <Group justify="space-between" p="sm">
        <Text>FUNDAEVENTO</Text>
        <Text size="sm" c="dimmed">
          Cargando...
        </Text>
      </Group>
    );
  }

  // 🔹 Inicial del nombre para el avatar
  const inicial = profile.nombre ? profile.nombre.charAt(0).toUpperCase() : "?";

  return (
    <Group justify="space-between" p="sm">
      <Text fw={700} fz="lg">
        FUNDAEVENTO
      </Text>

      <Group>
        {/* 🔔 Icono de notificaciones */}
        <IconBell size={20} style={{ marginRight: "10px" }} />

        {/* 👤 Avatar dinámico */}
        <Avatar color="blue" radius="xl">
          {inicial}
        </Avatar>

        {/* 🧑 Nombre y rol dinámico */}
        <Text fw={500}>
          {profile.nombre}{" "}
          <Text span c="dimmed" fz="sm">
            ({profile.rol})
          </Text>
        </Text>

        {/* 🔴 Botón de cerrar sesión */}
        <Button color="red" variant="light" size="xs" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Group>
    </Group>
  );
}
