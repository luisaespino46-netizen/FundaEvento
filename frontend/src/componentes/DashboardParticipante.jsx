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
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import {
  IconCalendarEvent,
  IconListCheck,
  IconUserCheck,
} from "@tabler/icons-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardParticipante() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState({
    totalInscritos: 0,
    activos: 0,
    completados: 0,
  });
  const [eventosRecientes, setEventosRecientes] = useState([]);

  useEffect(() => {
    if (profile) fetchDatos();
  }, [profile]);

  // 🔹 Cargar métricas y eventos inscritos del participante
  const fetchDatos = async () => {
    try {
      setLoading(true);

      // ✅ Usamos el UUID del usuario logueado desde Supabase Auth
      const usuarioUuid = profile?.auth_id;
      if (!usuarioUuid) throw new Error("No se encontró el UUID del usuario.");

      // 🔹 Buscar los eventos en los que está inscrito (usando el UUID)
      const { data: participaciones, error: partError } = await supabase
        .from("participantes")
        .select(
          "evento_id, eventos(id, titulo, estado, categoria, fecha, ubicacion)"
        )
        .eq("usuario_id", usuarioUuid); // ✅ Corregido: antes usaba el id numérico

      if (partError) throw partError;

      // 🔹 Extraer los eventos asociados a las participaciones
      const eventos = (participaciones || [])
        .map((p) => p.eventos)
        .filter((e) => e !== null);

      // 🔹 Calcular métricas
      const totalInscritos = eventos.length;
      const activos = eventos.filter((e) => e.estado === "Activo").length;
      const completados = eventos.filter(
        (e) => e.estado === "Completado"
      ).length;

      // 🔹 Mostrar los últimos 5 eventos
      const recientes = eventos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);

      // 🔹 Guardar datos en estado
      setMetricas({ totalInscritos, activos, completados });
      setEventosRecientes(recientes);
    } catch (error) {
      console.error("❌ Error cargando dashboard del participante:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Loader de carga inicial
  if (loading) {
    return (
      <Center style={{ height: "70vh" }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  return (
    <div>
      {/* 🔹 Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Dashboard del Participante</Title>
          <Text c="dimmed">Resumen de tus eventos inscritos y próximos</Text>
        </div>
        <Button
          variant="light"
          color="green"
          onClick={() => navigate("/calendario")}
        >
          📅 Ver Calendario
        </Button>
      </Group>

      {/* 🔹 Métricas principales */}
      <Grid mb="lg">
        {/* Eventos inscritos */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconCalendarEvent size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Eventos Inscritos
                </Text>
                <Title order={3}>{metricas.totalInscritos}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        {/* Activos */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconUserCheck size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Activos
                </Text>
                <Title order={3}>{metricas.activos}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>

        {/* Completados */}
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Group align="center">
              <IconListCheck size={28} />
              <div>
                <Text size="sm" c="dimmed">
                  Completados
                </Text>
                <Title order={3}>{metricas.completados}</Title>
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* 🔹 Eventos recientes */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="md" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Mis Eventos Recientes</Title>
              <Button
                size="xs"
                variant="light"
                onClick={() => navigate("/eventos")}
              >
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
                                : evento.estado === "Completado"
                                ? "gray"
                                : evento.estado === "Cancelado"
                                ? "red"
                                : "yellow"
                            }
                          >
                            {evento.estado}
                          </Badge>
                        </Group>
                      </div>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text size="sm" c="dimmed">
                  No tienes eventos inscritos aún.
                </Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* 🔹 Acciones rápidas */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="md" withBorder radius="md" shadow="sm">
            <Title order={5} mb="sm">
              Acciones Rápidas
            </Title>
            <Stack>
              <Button
                variant="light"
                color="green"
                onClick={() => navigate("/calendario")}
              >
                📅 Ver Calendario
              </Button>
              <Button
                variant="light"
                color="blue"
                onClick={() => navigate("/eventos")}
              >
                🔍 Explorar Eventos
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
}
