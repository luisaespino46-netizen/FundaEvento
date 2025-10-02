// src/componentes/Eventos.jsx
import {
  Title,
  Text,
  Button,
  Badge,
  Group,
  Paper,
  Grid,
  Progress,
  TextInput,
  Select,
} from "@mantine/core";

export default function Eventos() {
  const eventos = [
    {
      id: 1,
      nombre: "Taller de Arte para Niños",
      descripcion: "Actividad creativa para desarrollar habilidades artísticas en niños de 6-12 años",
      fecha: "2024-01-15",
      hora: "14:00",
      lugar: "Centro Comunitario Norte",
      participantes: { actual: 19, max: 25 },
      presupuesto: { actual: 3200, max: 5000 },
      categoria: "Educativo",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Jornada de Salud Infantil",
      descripcion: "Revisiones médicas gratuitas y charlas sobre nutrición",
      fecha: "2024-01-20",
      hora: "09:00",
      lugar: "Hospital Municipal",
      participantes: { actual: 46, max: 50 },
      presupuesto: { actual: 6500, max: 8000 },
      categoria: "Salud",
      estado: "Activo",
    },
    {
      id: 3,
      nombre: "Torneo de Fútbol Juvenil",
      descripcion: "Competencia deportiva para jóvenes de 13-17 años",
      fecha: "2024-01-10",
      hora: "16:00",
      lugar: "Polideportivo Central",
      participantes: { actual: 32, max: 32 },
      presupuesto: { actual: 2800, max: 3000 },
      categoria: "Deportivo",
      estado: "Completado",
    },
  ];

  return (
    <div>
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Gestión de Eventos</Title>
          <Text c="dimmed">Administra todos los eventos de FUNDAEVENTO</Text>
        </div>
        <Button variant="filled" color="blue">+ Nuevo Evento</Button>
      </Group>

      {/* Filtros */}
      <Paper p="md" mb="lg" withBorder radius="md">
        <Group grow>
          <TextInput placeholder="Buscar eventos..." />
          <Select placeholder="Todos los estados" data={["Activo", "Completado"]} />
          <Select placeholder="Todas las categorías" data={["Educativo", "Salud", "Deportivo"]} />
          <Button variant="default">Limpiar Filtros</Button>
        </Group>
      </Paper>

      {/* Grid de eventos */}
      <Grid>
        {eventos.map((evento) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={evento.id}>
            <Paper withBorder shadow="sm" radius="md" p="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{evento.nombre}</Text>
                <Badge color={evento.estado === "Activo" ? "green" : "gray"}>
                  {evento.estado}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" mb="sm">{evento.descripcion}</Text>

              <Group gap="xs" mb="xs">
                <Text size="xs">📅 {evento.fecha}</Text>
                <Text size="xs">🕒 {evento.hora}</Text>
              </Group>
              <Text size="xs" mb="xs">📍 {evento.lugar}</Text>

              {/* Participantes */}
              <Text size="xs" fw={500}>Participantes</Text>
              <Progress
                value={(evento.participantes.actual / evento.participantes.max) * 100}
                size="sm"
                color="blue"
                mb="sm"
              />
              <Text size="xs">
                {evento.participantes.actual}/{evento.participantes.max}
              </Text>

              {/* Presupuesto */}
              <Text size="xs" fw={500} mt="sm">Presupuesto</Text>
              <Progress
                value={(evento.presupuesto.actual / evento.presupuesto.max) * 100}
                size="sm"
                color="teal"
                mb="sm"
              />
              <Text size="xs">
                ${evento.presupuesto.actual.toLocaleString()} / ${evento.presupuesto.max.toLocaleString()}
              </Text>

              {/* Categoría */}
              <Badge mt="sm" color="blue" variant="light">{evento.categoria}</Badge>

              {/* Acciones */}
              <Group mt="md">
                <Button size="xs" variant="default">Ver Detalles</Button>
                <Button size="xs" color="dark">Inscribirse</Button>
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
