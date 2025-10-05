import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import { Title, Text, Paper, Group, Badge, Stack } from "@mantine/core";
import { supabase } from "../supabase";

export default function Calendario() {
  const [eventos, setEventos] = useState([]);
  const [eventosDelDia, setEventosDelDia] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const fetchEventos = async () => {
    const { data, error } = await supabase.from("eventos").select("*");
    if (!error) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const eventosFormateados = data.map((evento) => {
        const fechaEvento = new Date(evento.fecha);
        fechaEvento.setHours(0, 0, 0, 0);

        let estado = evento.estado_manual || (fechaEvento < hoy ? "Completado" : "Activo");

        return {
          id: evento.id,
          title: evento.titulo,
          start: `${evento.fecha}T${evento.hora ?? "00:00"}`,
          fecha: evento.fecha,
          estado: estado,
          color:
            estado === "Activo"
              ? "green"
              : estado === "Completado"
              ? "blue"
              : "red",
        };
      });

      setEventos(eventosFormateados);
    } else {
      console.error("Error al traer eventos:", error.message);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDateClick = (arg) => {
    const fechaClic = arg.dateStr;
    setFechaSeleccionada(fechaClic);
    const eventosEnFecha = eventos.filter((e) => e.fecha === fechaClic);
    setEventosDelDia(eventosEnFecha);
  };

  const formatearFechaLarga = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Calendario de Eventos</Title>
          <Text c="dimmed">Vista general de todos los eventos programados</Text>
        </div>
      </Group>

      <Group align="flex-start" grow>
        {/* Calendario */}
        <Paper withBorder shadow="sm" radius="md" p="md" style={{ flex: 2 }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            events={eventos}
            height="80vh"
            dateClick={handleDateClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
          />
        </Paper>

        {/* Panel lateral */}
        <Stack style={{ flex: 1 }}>
          {/* Eventos por fecha */}
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5} mb="xs">
              Eventos -{" "}
              {fechaSeleccionada
                ? formatearFechaLarga(fechaSeleccionada)
                : "Selecciona una fecha"}
            </Title>
            {eventosDelDia.length > 0 ? (
              eventosDelDia.map((evento) => (
                <Text size="sm" key={evento.id}>
                  <Badge color={evento.color} mr="xs" />
                  {evento.title}
                </Text>
              ))
            ) : (
              <Text size="sm" c="dimmed">
                No hay eventos programados para esta fecha
              </Text>
            )}
          </Paper>

          {/* Leyenda */}
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5} mb="sm">Leyenda</Title>
            <Stack gap="xs">
              <Badge color="green">Eventos Activos</Badge>
              <Badge color="blue">Eventos Completados</Badge>
              <Badge color="red">Eventos Cancelados</Badge>
            </Stack>
          </Paper>

          {/* Estadísticas */}
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5} mb="sm">Estadísticas del Mes</Title>
            <Text size="sm">Total eventos: {eventos.length}</Text>
            <Text size="sm">Activos: {eventos.filter(e => e.color === "green").length}</Text>
            <Text size="sm">Completados: {eventos.filter(e => e.color === "blue").length}</Text>
            <Text size="sm">Cancelados: {eventos.filter(e => e.color === "red").length}</Text>
          </Paper>
        </Stack>
      </Group>
    </div>
  );
}
