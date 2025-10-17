// src/componentes/DashboardAdmin.jsx
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
  Modal,
  NumberInput,
} from "@mantine/core";
import { supabase } from "../supabase";
import { useEffect, useState } from "react";
import {
  IconCalendarEvent,
  IconUsers,
  IconMoneybag,
  IconReport,
  IconEdit,
} from "@tabler/icons-react";

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    totalEventos: 0,
    totalParticipantes: 0,
    presupuestoTotal: 0,
    fondosUtilizados: 0,
  });
  const [eventosRecientes, setEventosRecientes] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  // 🔹 Para modal de edición de presupuesto
  const [opened, setOpened] = useState(false);
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState(0);

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      setLoading(true);

      // 🔹 Obtener presupuesto general manual desde tabla configuracion
      const { data: config, error: configError } = await supabase
        .from("configuracion")
        .select("presupuesto_general")
        .eq("id", 1)
        .single();
      if (configError) throw configError;

      // 🔹 Obtener eventos
      const { data: eventos, error: eventosError } = await supabase
        .from("eventos")
        .select("*");
      if (eventosError) throw eventosError;

      // 🔹 Contar participantes
      const { count: totalParticipantes, error: partError } = await supabase
        .from("participantes")
        .select("*", { count: "exact", head: true });
      if (partError) throw partError;

      // 🔹 Calcular fondos utilizados automáticamente
      const fondosUtilizados = eventos.reduce(
        (sum, e) => sum + (e.presupuesto_actual || 0),
        0
      );

      // 🔹 Fechas para eventos recientes
      const hoy = new Date();
      const hace30 = new Date(hoy);
      const dentro30 = new Date(hoy);
      hace30.setDate(hoy.getDate() - 30);
      dentro30.setDate(hoy.getDate() + 30);

      // 🔹 Eventos recientes
      const { data: recientes } = await supabase
        .from("eventos")
        .select(
          "id, titulo, estado, categoria, fecha, ubicacion, participantes_actual, participantes_max, presupuesto_actual, presupuesto_max"
        )
        .gte("fecha", hace30.toISOString().split("T")[0])
        .lte("fecha", dentro30.toISOString().split("T")[0])
        .order("fecha", { ascending: true })
        .limit(5);

      // 🔹 Notificaciones
      const notificacionesTemp = [];
      eventos.forEach((e) => {
        const fecha = new Date(e.fecha);
        const diff = (fecha - hoy) / (1000 * 60 * 60 * 24);

        if (e.estado === "Cancelado") {
          notificacionesTemp.push(`Evento cancelado: ${e.titulo}`);
        } else if (diff <= 7 && diff >= 0) {
          notificacionesTemp.push(
            `Evento próximo: ${e.titulo} (${fecha.toLocaleDateString()})`
          );
        } else if (e.estado === "Completado") {
          notificacionesTemp.push(`Evento completado: ${e.titulo}`);
        }
      });

      setMetricas({
        totalEventos: eventos.length,
        totalParticipantes,
        presupuestoTotal: config?.presupuesto_general || 0,
        fondosUtilizados,
      });
      setEventosRecientes(recientes || []);
      setNotificaciones(notificacionesTemp.slice(0, 5));
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Guardar presupuesto manual en tabla configuracion
  const guardarPresupuesto = async () => {
    try {
      const { error } = await supabase
        .from("configuracion")
        .update({ presupuesto_general: nuevoPresupuesto })
        .eq("id", 1);

      if (error) throw error;

      setMetricas((prev) => ({
        ...prev,
        presupuestoTotal: nuevoPresupuesto,
      }));
      setOpened(false);
    } catch (error) {
      console.error("Error actualizando presupuesto:", error.message);
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
          <Title order={2}>Dashboard</Title>
          <Text c="dimmed">Resumen general de FUNDAEVENTO</Text>
        </div>
        <Button variant="filled" color="blue">
          + Nuevo Evento
        </Button>
      </Group>

      {/* Métricas principales */}
      <Grid mb="lg">
        {/* Total Eventos */}
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
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
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconUsers size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Participantes
                </Text>
                <Title order={3}>{metricas.totalParticipantes}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        {/* Presupuesto total editable */}
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center" justify="space-between">
              <Group align="center">
                <IconMoneybag size={28} />
                <div>
                  <Text size="sm" c="dimmed">
                    Presupuesto Total
                  </Text>
                  <Title order={3}>
                    Q{metricas.presupuestoTotal.toLocaleString()}
                  </Title>
                </div>
              </Group>
              <Button
                size="xs"
                variant="subtle"
                leftSection={<IconEdit size={14} />}
                onClick={() => {
                  setNuevoPresupuesto(metricas.presupuestoTotal);
                  setOpened(true);
                }}
              >
                Editar
              </Button>
            </Group>
          </Paper>
        </Grid.Col>

        {/* Fondos utilizados */}
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconReport size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Fondos Utilizados
                </Text>
                <Title order={3}>
                  Q{metricas.fondosUtilizados.toLocaleString()}
                </Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Modal de edición */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Editar Presupuesto General"
        centered
      >
        <NumberInput
          label="Nuevo presupuesto (Q)"
          value={nuevoPresupuesto}
          onChange={setNuevoPresupuesto}
          thousandSeparator
          min={0}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancelar
          </Button>
          <Button color="blue" onClick={guardarPresupuesto}>
            Guardar
          </Button>
        </Group>
      </Modal>

      {/* Resto de la estructura */}
      <Grid>
        {/* Eventos recientes */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="md" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Eventos Recientes</Title>
              <Button size="xs" variant="light">
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
                          {evento.participantes_actual}/
                          {evento.participantes_max} participantes
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

        {/* Panel derecho */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            {/* Notificaciones */}
            <Paper p="md" withBorder radius="md" shadow="sm">
              <Title order={5} mb="sm">
                Notificaciones
              </Title>
              {notificaciones.length > 0 ? (
                notificaciones.map((n, i) => (
                  <Paper key={i} p="xs" mb="xs" radius="md" withBorder bg="blue.1">
                    <Text size="sm">{n}</Text>
                  </Paper>
                ))
              ) : (
                <Text size="sm" c="dimmed">
                  No hay notificaciones recientes.
                </Text>
              )}
            </Paper>

            {/* Acciones rápidas */}
            <Paper p="md" withBorder radius="md" shadow="sm">
              <Title order={5} mb="sm">
                Acciones Rápidas
              </Title>
              <Stack>
                <Button variant="light">+ Crear Evento</Button>
                <Button variant="light">📊 Generar Reporte</Button>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
}
