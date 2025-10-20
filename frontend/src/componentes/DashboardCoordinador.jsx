// src/componentes/DashboardCoordinador.jsx
import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Group,
  Grid,
  Button,
  Badge,
} from "@mantine/core";
import { IconCalendar, IconPlus } from "@tabler/icons-react";
import { supabase } from "../supabase";
import CrearEventoModal from "./CrearEventoModal";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function DashboardCoordinador() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [opened, setOpened] = useState(false);
  const [fondosEjecutados, setFondosEjecutados] = useState(0);

  const fetchEventos = async () => {
    try {
      if (!profile) return;
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("id")
        .eq("auth_id", profile.auth_id)
        .single();

      const { data: eventosData } = await supabase
        .from("eventos")
        .select("*")
        .eq("coordinador_id", usuario.id);

      setEventos(eventosData || []);
      const totalFondos =
        eventosData?.reduce(
          (acc, ev) => acc + (ev.presupuesto_actual || 0),
          0
        ) || 0;
      setFondosEjecutados(totalFondos);
    } catch (error) {
      console.error("Error al traer eventos:", error.message);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, [profile]);

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Dashboard del Coordinador</Title>
          <Text c="dimmed">
            Resumen de tus eventos coordinados y métricas personales
          </Text>
        </div>
        {/* 🔹 Eliminado el botón superior de Crear Evento */}
      </Group>

      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Text fw={700} size="lg">
              {eventos.length}
            </Text>
            <Text size="sm" c="dimmed">
              Total Eventos
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Text fw={700} size="lg">
              0
            </Text>
            <Text size="sm" c="dimmed">
              Participantes Totales
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Text fw={700} size="lg">
              Q{fondosEjecutados.toLocaleString()}
            </Text>
            <Text size="sm" c="dimmed">
              Fondos Ejecutados
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Title order={4} mb="xs">
        Tus Eventos Recientes
      </Title>
      {eventos.length === 0 ? (
        <Text c="dimmed">No tienes eventos recientes.</Text>
      ) : (
        eventos.slice(0, 3).map((evento) => (
          <Paper key={evento.id} withBorder p="md" mb="sm" radius="md">
            <Group justify="space-between">
              <div>
                <Text fw={600}>{evento.titulo}</Text>
                <Text size="sm" c="dimmed">
                  {evento.fecha} - {evento.ubicacion || "Ubicación no especificada"}
                </Text>
                <Group mt={4}>
                  <Badge color="blue" variant="light">
                    {evento.categoria}
                  </Badge>
                  <Badge color="green" variant="filled">
                    {evento.estado || "Activo"}
                  </Badge>
                </Group>
              </div>
              <Text fw={500}>
                Q{evento.presupuesto_actual} / Q{evento.presupuesto_max}
              </Text>
            </Group>
          </Paper>
        ))
      )}

      <Grid mt="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Text fw={600} mb="sm">
              Acciones Rápidas
            </Text>

            <Button
              leftSection={<IconPlus size={16} />}
              fullWidth
              color="blue"
              mb="sm"
              onClick={() => setOpened(true)} // 🔹 Abre el modal
            >
              + Crear Evento
            </Button>

            <Button
              leftSection={<IconCalendar size={16} />}
              fullWidth
              color="green"
              variant="light"
              onClick={() => navigate("/calendario")} // 🔹 Ir al calendario
            >
              Ver Calendario
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* 🔹 Modal de creación de evento */}
      <CrearEventoModal
        opened={opened}
        onClose={() => setOpened(false)}
        onEventoCreado={fetchEventos}
      />
    </div>
  );
}
