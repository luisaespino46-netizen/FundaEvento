import { useEffect, useState } from "react";
import { Title, Text, Paper, Grid, Badge, Group, Loader, Center } from "@mantine/core";
import { supabase } from "../supabase";
import { useAuth } from "../hooks/useAuth";

export default function DashboardParticipante() {
  const { profile } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar eventos inscritos desde Supabase con JOIN real
  const fetchEventosParticipante = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("participantes")
        .select(`
          id,
          estado,
          fecha_inscripcion,
          eventos (
            id,
            titulo,
            fecha,
            hora,
            estado,
            estado_manual
          )
        `)
        .eq("usuario_id", profile?.auth_id);

      if (error) throw error;

      // 🔸 Extraer los datos del evento asociado
      const eventosInscritos = data
        .map((p) => ({
          ...p.eventos,
          estadoParticipacion: p.estado,
        }))
        .filter((e) => e?.id); // evitar nulls si hay registros huérfanos

      setEventos(eventosInscritos);
    } catch (err) {
      console.error("Error al cargar eventos del participante:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.auth_id) fetchEventosParticipante();
  }, [profile]);

  // 🔹 Calcular métricas
  const activos = eventos.filter((e) => (e.estado_manual || e.estado) === "Activo");
  const completados = eventos.filter((e) => (e.estado_manual || e.estado) === "Completado");
  const proximos = eventos.filter((e) => new Date(e.fecha) >= new Date());

  return (
    <div>
      <Title order={2}>Mi Panel de Participante</Title>
      <Text mb="md">Bienvenido a FUNDAEVENTO, {profile?.nombre}</Text>

      {loading ? (
        <Center mt="xl">
          <Loader color="blue" />
        </Center>
      ) : (
        <>
          {/* 🔹 Métricas */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder p="md" radius="md">
                <Text fw={600}>Mis eventos activos</Text>
                <Title order={3}>{activos.length}</Title>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder p="md" radius="md">
                <Text fw={600}>Eventos completados</Text>
                <Title order={3}>{completados.length}</Title>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder p="md" radius="md">
                <Text fw={600}>Total de eventos inscritos</Text>
                <Title order={3}>{eventos.length}</Title>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* 🔹 Próximos eventos */}
          <Paper withBorder p="md" radius="md" mt="xl">
            <Title order={4} mb="sm">
              Mis próximos eventos
            </Title>

            {proximos.length > 0 ? (
              proximos.map((e) => (
                <Group key={e.id} mb="sm" position="apart">
                  <div>
                    <Text fw={500}>{e.titulo}</Text>
                    <Text size="sm" c="dimmed">
                      {new Date(e.fecha).toLocaleDateString("es-ES")}
                    </Text>
                  </div>
                  <Badge
                    color={
                      (e.estado_manual || e.estado) === "Activo"
                        ? "green"
                        : (e.estado_manual || e.estado) === "Completado"
                        ? "blue"
                        : "red"
                    }
                  >
                    {e.estado_manual || e.estado}
                  </Badge>
                </Group>
              ))
            ) : (
              <Text size="sm" c="dimmed">
                No tienes eventos inscritos actualmente.
              </Text>
            )}
          </Paper>

          {/* 🔹 Notificaciones */}
          <Paper withBorder p="md" radius="md" mt="md">
            <Title order={4} mb="sm">
              Notificaciones
            </Title>
            <Text size="sm" c="dimmed">
              No hay notificaciones por ahora.
            </Text>
          </Paper>
        </>
      )}
    </div>
  );
}
