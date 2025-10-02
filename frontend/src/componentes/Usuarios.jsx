// src/componentes/Usuarios.jsx
import {
  Title,
  Text,
  Badge,
  Paper,
  Group,
  Button,
  Grid,
  TextInput,
  Select,
} from "@mantine/core";

export default function Usuarios() {
  const usuarios = [
    {
      id: 1,
      nombre: "María González",
      correo: "maria.gonzalez@email.com",
      telefono: "+1234567890",
      rol: "Administrador",
      estado: "Activo",
      fechaRegistro: "2024-01-01",
      edad: 35,
      grupo: "Administración",
      eventos: 2,
    },
    {
      id: 2,
      nombre: "Carlos Rodríguez",
      correo: "carlos.rodriguez@email.com",
      telefono: "+1234567891",
      rol: "Coordinador",
      estado: "Activo",
      fechaRegistro: "2024-01-05",
      edad: 28,
      grupo: "Coordinadores",
      eventos: 2,
    },
    {
      id: 3,
      nombre: "Ana Martínez",
      correo: "ana.martinez@email.com",
      telefono: "+1234567892",
      rol: "Participante",
      estado: "Activo",
      fechaRegistro: "2024-01-10",
      edad: 12,
      grupo: "Grupo A",
      eventos: 1,
    },
  ];

  return (
    <div>
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Gestión de Usuarios</Title>
          <Text c="dimmed">Administra usuarios, roles y seguimiento de participación</Text>
        </div>
        <Button color="blue">+ Nuevo Usuario</Button>
      </Group>

      {/* Métricas */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">Total Usuarios</Text>
            <Text fw={700} size="lg">{usuarios.length}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">Administradores</Text>
            <Text fw={700} size="lg" c="red">
              {usuarios.filter((u) => u.rol === "Administrador").length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">Coordinadores</Text>
            <Text fw={700} size="lg" c="blue">
              {usuarios.filter((u) => u.rol === "Coordinador").length}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">Participantes</Text>
            <Text fw={700} size="lg" c="green">
              {usuarios.filter((u) => u.rol === "Participante").length}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Paper withBorder p="md" mb="lg" radius="md">
        <Group grow>
          <TextInput placeholder="Buscar usuarios..." />
          <Select
            placeholder="Todos los roles"
            data={["Administrador", "Coordinador", "Participante"]}
          />
          <Button variant="default">Limpiar Filtros</Button>
        </Group>
      </Paper>

      {/* Grid de usuarios */}
      <Grid>
        {usuarios.map((u) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={u.id}>
            <Paper withBorder shadow="sm" radius="md" p="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{u.nombre}</Text>
                <Badge
                  color={
                    u.rol === "Administrador"
                      ? "red"
                      : u.rol === "Coordinador"
                      ? "blue"
                      : "green"
                  }
                >
                  {u.rol}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="xs">{u.correo}</Text>
              <Text size="sm">📞 {u.telefono}</Text>
              <Text size="sm">📅 Desde: {u.fechaRegistro}</Text>
              <Text size="sm">Edad: {u.edad} años</Text>
              <Text size="sm">Grupo: {u.grupo}</Text>
              <Text size="sm">Eventos participados: {u.eventos}</Text>
              <Button mt="md" fullWidth variant="light">
                Ver Detalles
              </Button>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
