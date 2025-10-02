// src/componentes/Calendario.jsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import { Title, Text, Paper, Group, Badge, Stack } from "@mantine/core";

export default function Calendario() {
  // Eventos de ejemplo (mock)
  const eventos = [
    {
      title: "Taller de Arte",
      date: "2025-10-05",
      color: "green",
    },
    {
      title: "Jornada de Salud",
      date: "2025-10-12",
      color: "blue",
    },
    {
      title: "Torneo de Fútbol",
      date: "2025-10-20",
      color: "red",
    },
  ];

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
            locale={esLocale} // 👈 idioma español
            events={eventos}
            height="80vh"
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
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5}>Selecciona una fecha</Title>
            <Text size="sm" c="dimmed">
              Haz clic en una fecha para ver los eventos
            </Text>
          </Paper>

          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5} mb="sm">Leyenda</Title>
            <Stack gap="xs">
              <Badge color="green">Eventos Activos</Badge>
              <Badge color="blue">Eventos Completados</Badge>
              <Badge color="red">Eventos Cancelados</Badge>
            </Stack>
          </Paper>

          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5} mb="sm">Estadísticas del Mes</Title>
            <Text size="sm">Total eventos: 3</Text>
            <Text size="sm">Activos: 1</Text>
            <Text size="sm">Completados: 1</Text>
            <Text size="sm">Cancelados: 1</Text>
          </Paper>
        </Stack>
      </Group>
    </div>
  );
}
