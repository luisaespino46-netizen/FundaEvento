// src/componentes/Eventos.jsx
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
  Menu,
} from "@mantine/core";
import { IconCalendar, IconClock, IconMapPin, IconDots } from "@tabler/icons-react";
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

  const calcularEstado = (evento) => {
    if (evento.estado_manual) return evento.estado_manual;
    const fechaEvento = new Date(evento.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaEvento.setHours(0, 0, 0, 0);
    return fechaEvento < hoy ? "Completado" : "Activo";
  };

  const cambiarEstadoManual = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from("eventos")
      .update({ estado_manual: nuevoEstado })
      .eq("id", id);
    if (!error) fetchEventos();
    else alert("Error al actualizar el estado.");
  };

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

      <Paper p="md" mb="lg" withBorder radius="md">
        <Group grow>
          <TextInput placeholder="Buscar eventos..." />
          <Select placeholder="Todos los estados" data={["Activo", "Completado"]} />
          <Select placeholder="Todas las categorías" data={["Educativo", "Salud", "Deportivo", "Tecnología", "Innovación", "Música"]} />
          <Button variant="default">Limpiar Filtros</Button>
        </Group>
      </Paper>

      <Grid>
        {eventos.map((evento) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={evento.id}>
            <Paper withBorder shadow="sm" radius="md" p="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{evento.titulo}</Text>
                <Badge
                  color={
                    calcularEstado(evento) === "Cancelado" ? "red" :
                    calcularEstado(evento) === "Completado" ? "blue" : "green"
                  }
                >
                  {calcularEstado(evento)}
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

              <Text size="xs" fw={500}>Participantes</Text>
              <Progress
                value={evento.participantes_max ? (evento.participantes_actual / evento.participantes_max) * 100 : 0}
                size="sm"
                color="blue"
                mb="xs"
              />
              <Text size="xs">
                {evento.participantes_actual ?? 0}/{evento.participantes_max ?? evento.cupo_maximo ?? 0}
              </Text>

              <Text size="xs" fw={500} mt="sm">Presupuesto</Text>
              <Progress
                value={evento.presupuesto_max ? (evento.presupuesto_actual / evento.presupuesto_max) * 100 : 0}
                size="sm"
                color="teal"
                mb="xs"
              />
              <Text size="xs">
                ${evento.presupuesto_actual?.toLocaleString() ?? 0} / ${evento.presupuesto_max?.toLocaleString() ?? evento.presupuesto ?? 0}
              </Text>

              <Badge mt="sm" color="blue" variant="light">{evento.categoria}</Badge>

              <Group mt="md" justify="space-between">
                <Button size="xs" color="dark">Inscribirse</Button>

                <Menu shadow="md" width={180} position="bottom-end" withArrow>
                  <Menu.Target>
                    <Button size="xs" variant="default">
                      <IconDots size={16} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => { setEventoEditando(evento); setOpened(true); }}>
                      Editar
                    </Menu.Item>

                    {calcularEstado(evento) === "Activo" && (
                      <Menu.Item onClick={() => cambiarEstadoManual(evento.id, "Cancelado")}>Cancelar</Menu.Item>
                    )}

                    {calcularEstado(evento) === "Activo" && (
                      <Menu.Item onClick={() => cambiarEstadoManual(evento.id, "Completado")}>Completar</Menu.Item>
                    )}

                    {calcularEstado(evento) === "Cancelado" && (
                      <Menu.Item onClick={() => cambiarEstadoManual(evento.id, "Activo")}>Reactivar</Menu.Item>
                    )}

                    <Menu.Item color="red" onClick={async () => {
                      const confirmacion = window.confirm("¿Estás seguro de eliminar este evento?");
                      if (confirmacion) {
                        const { error } = await supabase.from("eventos").delete().eq("id", evento.id);
                        if (!error) fetchEventos();
                        else alert("Error al eliminar el evento.");
                      }
                    }}>
                      Eliminar
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
