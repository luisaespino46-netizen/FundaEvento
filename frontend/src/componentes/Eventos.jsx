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
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconDots,
  IconUser,
} from "@tabler/icons-react";
import { supabase } from "../supabase";
import CrearEventoModal from "./CrearEventoModal";
import { useAuth } from "../hooks/useAuth";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [opened, setOpened] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);
  const { profile } = useAuth();

  // 🔹 Obtener el ID real del usuario desde la tabla "usuarios"
  const obtenerUsuarioId = async () => {
    if (!profile?.auth_id) return;
    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .eq("auth_id", profile.auth_id)
      .single();
    if (!error && data) setUsuarioId(data.id);
  };

  // 🔹 Cargar eventos
  const fetchEventos = async () => {
    try {
      let query = supabase
        .from("eventos")
        .select("*, coordinador:coordinador_id(nombre, rol)")
        .order("fecha", { ascending: true });

      const { data: eventosData, error } = await query;
      if (error) throw error;

      const normalizados = (eventosData || []).map((e) => ({
        ...e,
        id: e.id || e.identificación,
        titulo: e.titulo || e.título,
        descripcion: e.descripcion || e.Descripción,
        categoria: e.categoria || e.categorías,
        presupuesto_max: e.presupuesto_max || e.presupuesto_máximo,
      }));

      setEventos(normalizados);
    } catch (err) {
      console.error("Error al traer eventos:", err.message);
    }
  };

  useEffect(() => {
    if (profile) {
      obtenerUsuarioId();
      fetchEventos();
    }
  }, [profile]);

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
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Gestión de Eventos</Title>
          <Text c="dimmed">
            {profile?.rol === "Coordinador"
              ? "Visualiza todos los eventos y gestiona los tuyos."
              : "Administra todos los eventos de FUNDAEVENTO"}
          </Text>
        </div>

        {(profile?.rol === "Admin" || profile?.rol === "Coordinador") && (
          <Button
            color="blue"
            onClick={() => {
              setEventoEditando(null);
              setOpened(true);
            }}
          >
            + Nuevo Evento
          </Button>
        )}
      </Group>

      <CrearEventoModal
        opened={opened}
        onClose={() => {
          setOpened(false);
          fetchEventos();
        }}
        onEventoCreado={fetchEventos}
        eventoEditar={eventoEditando}
      />

      <Paper p="md" mb="lg" withBorder radius="md">
        <Group grow>
          <TextInput placeholder="Buscar eventos..." />
          <Select
            placeholder="Todos los estados"
            data={["Activo", "Completado", "Cancelado"]}
          />
          <Select
            placeholder="Todas las categorías"
            data={[
              "Educativo",
              "Salud",
              "Deportivo",
              "Tecnología",
              "Innovación",
              "Música",
            ]}
          />
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
                    calcularEstado(evento) === "Cancelado"
                      ? "red"
                      : calcularEstado(evento) === "Completado"
                      ? "blue"
                      : "green"
                  }
                >
                  {calcularEstado(evento)}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed" mb="sm">
                {evento.descripcion}
              </Text>

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

              {/* 🔹 Mostrar creador o coordinador */}
              <Group gap="xs" mb="xs">
                <IconUser size={16} />
                <Text size="xs">
                  {evento.coordinador
                    ? `Coordinador: ${evento.coordinador.nombre} (${evento.coordinador.rol})`
                    : "Creado por: Administrador (Admin)"}
                </Text>
              </Group>

              <Text size="xs" fw={500}>
                Participantes
              </Text>
              <Progress
                value={
                  evento.participantes_max
                    ? (evento.participantes_actual /
                        evento.participantes_max) *
                      100
                    : 0
                }
                size="sm"
                color="blue"
                mb="xs"
              />
              <Text size="xs">
                {evento.participantes_actual ?? 0}/
                {evento.participantes_max ?? evento.cupo_maximo ?? 0}
              </Text>

              <Badge mt="sm" color="blue" variant="light">
                {evento.categoria}
              </Badge>

              {/* 🔹 Acciones: admin o coordinador dueño */}
              {(profile?.rol === "Admin" ||
                (profile?.rol === "Coordinador" &&
                  evento.coordinador_id === usuarioId)) && (
                <Group mt="md" justify="space-between">
                  <Menu shadow="md" width={180} position="bottom-end" withArrow>
                    <Menu.Target>
                      <Button size="xs" variant="default">
                        <IconDots size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          setEventoEditando(evento);
                          setOpened(true);
                        }}
                      >
                        Editar
                      </Menu.Item>

                      {calcularEstado(evento) === "Activo" && (
                        <>
                          <Menu.Item
                            onClick={() =>
                              cambiarEstadoManual(evento.id, "Cancelado")
                            }
                          >
                            Cancelar
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              cambiarEstadoManual(evento.id, "Completado")
                            }
                          >
                            Completar
                          </Menu.Item>
                        </>
                      )}

                      {calcularEstado(evento) === "Cancelado" && (
                        <Menu.Item
                          onClick={() =>
                            cambiarEstadoManual(evento.id, "Activo")
                          }
                        >
                          Reactivar
                        </Menu.Item>
                      )}

                      <Menu.Item
                        color="red"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "¿Estás seguro de eliminar este evento?"
                            )
                          ) {
                            const { error } = await supabase
                              .from("eventos")
                              .delete()
                              .eq("id", evento.id);
                            if (!error) fetchEventos();
                            else alert("Error al eliminar el evento.");
                          }
                        }}
                      >
                        Eliminar
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              )}
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}

