// src/componentes/DashboardCoordinador.jsx
import {
  Grid,
  Paper,
  Title,
  Text,
  Badge,
  Group,
  Button,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import {
  IconCalendarEvent,
  IconUsers,
  IconMoneybag,
} from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CrearEventoModal from "./CrearEventoModal";

export default function DashboardCoordinador() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    totalEventos: 0,
    totalParticipantes: 0,
    fondosEjecutados: 0,
  });
  const [eventosRecientes, setEventosRecientes] = useState([]);

  // 🔹 Modal crear evento
  const [crearAbierto, setCrearAbierto] = useState(false);

  useEffect(() => {
    if (profile) fetchDatos();
  }, [profile]);

  const fetchDatos = async () => {
    try {
      setLoading(true);

      // 🔹 Obtener ID del usuario coordinador
      const { data: usuario, error: userError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_id", profile?.auth_id)
        .single();
      if (userError) throw userError;

      // 🔹 Obtener eventos coordinados por él
      const { data: eventos, error: eventosError } = await supabase
        .from("eventos")
        .select(
          "id, titulo, estado, categoria, fecha, ubicacion, participantes_actual, participantes_max, presupuesto_actual, presupuesto_max"
        )
        .eq("coordinador_id", usuario.id)
        .order("fecha", { ascending: true });

      if (eventosError) throw eventosError;

      // 🔹 Calcular métricas
      const totalEventos = eventos.length;
      const totalParticipantes = eventos.reduce(
        (sum, e) => sum + (e.participantes_actual || 0),
        0
      );
      const fondosEjecutados = eventos.reduce(
        (sum, e) => sum + (e.presupuesto_actual || 0),
        0
      );

      // 🔹 Mostrar solo los últimos 5 eventos recientes
      const recientes = eventos.slice(0, 5);

      setMetricas({
        totalEventos,
        totalParticipantes,
        fondosEjecutados,
      });
      setEventosRecientes(recientes);
    } catch (error) {
      console.error("❌ Error cargando dashboard del coordinador:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "70vh" }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  return (
    <div>
      {/* Header interno */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Dashboard del Coordinador</Title>
          <Text c="dimmed">
            Resumen de tus eventos coordinados y métricas personales
          </Text>
        </div>
        <Button variant="filled" color="blue" onClick={() => setCrearAbierto(true)}>
          + Crear Evento
        </Button>
      </Group>

      {/* Métricas principales */}
      <Grid mb="lg">
        {/* Total Eventos */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconCalendarEvent size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Total Eventos
                </Text>
                <Title order={3}>{metricas.totalEventos}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        {/* Participantes */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconUsers size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Participantes Totales
                </Text>
                <Title order={3}>{metricas.totalParticipantes}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        {/* Fondos Ejecutados */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconMoneybag size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Fondos Ejecutados
                </Text>
                <Title order={3}>
                  Q{metricas.fondosEjecutados.toLocaleString()}
                </Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Modal de creación */}
      <CrearEventoModal
        opened={crearAbierto}
        onClose={() => setCrearAbierto(false)}
        onEventoCreado={fetchDatos}
      />

      {/* Eventos recientes */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="md" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Tus Eventos Recientes</Title>
              <Button size="xs" variant="light" onClick={() => navigate("/eventos")}>
                Ver Todos
              </Button>
            </Group>

            <Stack>
              {eventosRecientes.length > 0 ? (
                eventosRecientes.map((evento) => (
                  <Paper key={evento.id} withBorder p="sm" radius="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={600}>{evento.titulo}</Text>
                        <Text size="xs" c="dimmed">
                          {new Date(evento.fecha).toLocaleDateString()} -{" "}
                          {evento.ubicacion || "Ubicación no especificada"}
                        </Text>
                        <Group gap="xs" mt="xs">
                          <Badge color="blue">{evento.categoria}</Badge>
                          <Badge
                            color={
                              evento.estado === "Activo"
                                ? "green"
                                : evento.estado === "Cancelado"
                                ? "red"
                                : "gray"
                            }
                          >
                            {evento.estado}
                          </Badge>
                        </Group>
                      </div>
                      <div>
                        <Text size="sm">
                          {evento.participantes_actual}/{evento.participantes_max}{" "}
                          participantes
                        </Text>
                        <Text fw={600}>
                          Q{evento.presupuesto_actual || 0} / Q
                          {evento.presupuesto_max || 0}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text size="sm" c="dimmed">
                  No hay eventos recientes.
                </Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Acciones rápidas */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder radius="md" shadow="sm">
            <Title order={5} mb="sm">
              Acciones Rápidas
            </Title>
            <Stack>
              <Button variant="light" onClick={() => setCrearAbierto(true)}>
                + Crear Evento
              </Button>
              <Button
                variant="light"
                color="green"
                onClick={() => navigate("/calendario")}
              >
                📅 Ver Calendario
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
}
