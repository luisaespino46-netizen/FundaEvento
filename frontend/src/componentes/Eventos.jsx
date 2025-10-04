import { useState, useEffect } from "react";
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
import { IconCalendar, IconClock, IconMapPin } from "@tabler/icons-react";
import { supabase } from "../supabase";
import CrearEventoModal from "./CrearEventoModal";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [opened, setOpened] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);

  const fetchEventos = async () => {
    const { data, error } = await supabase.from("eventos").select("*");
    if (!error) setEventos(data);
    else console.error("Error al traer eventos:", error.message);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Gestión de Eventos</Title>
          <Text c="dimmed">Administra todos los eventos de FUNDAEVENTO</Text>
        </div>
        <Button color="blue" onClick={() => { setEventoEditando(null); setOpened(true); }}>
          + Nuevo Evento
        </Button>
      </Group>

      <CrearEventoModal
        opened={opened}
        onClose={() => setOpened(false)}
        onEventoCreado={fetchEventos}
        eventoEditar={eventoEditando}
      />

      {/* Filtros */}
      <Paper p="md" mb="lg" withBorder radius="md">
        <Group grow>
          <TextInput placeholder="Buscar eventos..." />
          <Select placeholder="Todos los estados" data={["Activo", "Completado"]} />
          <Select placeholder="Todas las categorías" data={["Educativo", "Salud", "Deportivo", "Tecnología", "Innovación", "Música"]} />
          <Button variant="default">Limpiar Filtros</Button>
        </Group>
      </Paper>

      {/* Grid de eventos */}
      <Grid>
        {eventos.map((evento) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={evento.id}>
            <Paper withBorder shadow="sm" radius="md" p="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{evento.titulo}</Text>
                <Badge color={evento.estado === "Activo" ? "green" : "gray"}>
                  {evento.estado}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" mb="sm">{evento.descripcion}</Text>

              <Group gap="xs" mb="xs">
                <IconCalendar size={16} />
                <Text size="xs">{evento.fecha}</Text>
                <IconClock size={16} />
                <Text size="xs">{evento.hora}</Text>
              </Group>

              <Group gap="xs" mb="xs">
                <IconMapPin size={16} />
                <Text size="xs">{evento.ubicacion ?? evento.lugar}</Text>
              </Group>

              {/* Participantes */}
              <Text size="xs" fw={500}>Participantes</Text>
              <Progress
                value={
                  evento.participantes_max
                    ? (evento.participantes_actual / evento.participantes_max) * 100
                    : 0
                }
                size="sm"
                color="blue"
                mb="xs"
              />
              <Text size="xs">
                {evento.participantes_actual ?? 0}/{evento.participantes_max ?? evento.cupo_maximo ?? 0}
              </Text>

              {/* Presupuesto */}
              <Text size="xs" fw={500} mt="sm">Presupuesto</Text>
              <Progress
                value={
                  evento.presupuesto_max
                    ? (evento.presupuesto_actual / evento.presupuesto_max) * 100
                    : 0
                }
                size="sm"
                color="teal"
                mb="xs"
              />
              <Text size="xs">
                ${evento.presupuesto_actual?.toLocaleString() ?? 0} / ${evento.presupuesto_max?.toLocaleString() ?? evento.presupuesto ?? 0}
              </Text>

              <Badge mt="sm" color="blue" variant="light">{evento.categoria}</Badge>

              <Group mt="md">
                <Button size="xs" color="dark">Inscribirse</Button>
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => {
                    setEventoEditando(evento);
                    setOpened(true);
                  }}
                >
                  Editar
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
