// src/componentes/Reportes.jsx
import { Title, Text, Paper, Group, Grid, Select, Button, Badge, Progress, Table, Stack } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

export default function Reportes() {
  // Datos mock (luego se conectan a Supabase)
  const totalEventos = 3;
  const participantes = 97;
  const presupuestoTotal = 16000;
  const fondosUsados = 12500;
  const fondosDisponibles = presupuestoTotal - fondosUsados;

  const detalleEventos = [
    {
      nombre: "Taller de Arte para Niños",
      fecha: "2024-01-15",
      participantes: "19/25 (76%)",
      presupuesto: "$5,000",
      gastado: "$3,200",
      estado: "Activo",
      eficiencia: "64.0%",
    },
    {
      nombre: "Jornada de Salud Infantil",
      fecha: "2024-01-20",
      participantes: "46/50 (92%)",
      presupuesto: "$8,000",
      gastado: "$6,500",
      estado: "Activo",
      eficiencia: "81.3%",
    },
    {
      nombre: "Torneo de Fútbol Juvenil",
      fecha: "2024-01-10",
      participantes: "32/32 (100%)",
      presupuesto: "$3,000",
      gastado: "$2,800",
      estado: "Completado",
      eficiencia: "93.3%",
    },
  ];

  return (
    <div>
      {/* Título */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Reportes y Análisis</Title>
          <Text c="dimmed">Transparencia total en la gestión de fondos y actividades</Text>
        </div>
        <Button leftSection={<IconDownload size={16} />} color="dark">
          Descargar Reporte
        </Button>
      </Group>

      {/* Filtros */}
      <Paper withBorder shadow="sm" radius="md" p="md" mb="lg">
        <Title order={5} mb="sm">Filtros de Reporte</Title>
        <Group grow>
          <Select label="Período" placeholder="Todos los períodos" data={["2024", "2025"]} />
          <Select label="Categoría" placeholder="Todas las categorías" data={["Educativo", "Salud", "Deportivo"]} />
        </Group>
      </Paper>

      {/* Métricas principales */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Total Eventos</Title>
            <Text fw={700} size="xl">{totalEventos}</Text>
            <Text size="sm" c="dimmed">1 completado</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Participantes</Title>
            <Text fw={700} size="xl">{participantes}</Text>
            <Text size="sm" c="dimmed">89.3% promedio asistencia</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Presupuesto Total</Title>
            <Text fw={700} size="xl">${presupuestoTotal.toLocaleString()}</Text>
            <Text size="sm" c="dimmed">Asignado a eventos</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Eficiencia</Title>
            <Text fw={700} size="xl">78.1%</Text>
            <Text size="sm" c="dimmed">Ejecución presupuestaria</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Transparencia de fondos */}
        <Grid.Col span={6}>
          <Paper withBorder shadow="sm" radius="md" p="md" mb="lg">
            <Title order={5} mb="sm">Transparencia de Fondos</Title>
            <Stack>
              <Group justify="space-between">
                <Text size="sm">Presupuesto Asignado</Text>
                <Text fw={700}>${presupuestoTotal.toLocaleString()}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Fondos Ejecutados</Text>
                <Text fw={700} c="blue">${fondosUsados.toLocaleString()}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Fondos Disponibles</Text>
                <Text fw={700} c="green">${fondosDisponibles.toLocaleString()}</Text>
              </Group>
              <Progress value={(fondosUsados / presupuestoTotal) * 100} mt="sm" />
              <Text size="xs" c="dimmed">
                {(fondosUsados / presupuestoTotal * 100).toFixed(1)}% del presupuesto ejecutado
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Métricas de rendimiento */}
        <Grid.Col span={6}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5} mb="sm">Métricas de Rendimiento</Title>
            <Stack>
              <div>
                <Text size="sm">Tasa de Finalización</Text>
                <Progress value={33.3} />
                <Text size="xs">33.3%</Text>
              </div>
              <div>
                <Text size="sm">Promedio de Asistencia</Text>
                <Progress value={89.3} />
                <Text size="xs">89.3%</Text>
              </div>
              <div>
                <Text size="sm">Eficiencia Presupuestaria</Text>
                <Progress value={78.1} />
                <Text size="xs">78.1%</Text>
              </div>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Detalle de eventos */}
      <Paper withBorder shadow="sm" radius="md" p="md" mt="lg">
        <Title order={5} mb="sm">Detalle de Eventos</Title>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Evento</Table.Th>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Participantes</Table.Th>
              <Table.Th>Presupuesto</Table.Th>
              <Table.Th>Gastado</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Eficiencia</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {detalleEventos.map((evento, i) => (
              <Table.Tr key={i}>
                <Table.Td>{evento.nombre}</Table.Td>
                <Table.Td>{evento.fecha}</Table.Td>
                <Table.Td>{evento.participantes}</Table.Td>
                <Table.Td>{evento.presupuesto}</Table.Td>
                <Table.Td>{evento.gastado}</Table.Td>
                <Table.Td>
                  <Badge color={evento.estado === "Activo" ? "green" : "blue"}>
                    {evento.estado}
                  </Badge>
                </Table.Td>
                <Table.Td>{evento.eficiencia}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
