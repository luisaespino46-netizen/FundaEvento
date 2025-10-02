import { Grid, Paper, Title, Text, Badge, Group, Button, Stack } from "@mantine/core";

export default function Dashboard() {
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

      {/* Métricas */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">Total Eventos</Text>
            <Title order={3}>3</Title>
            <Text size="xs" c="green">2 activos</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">Participantes</Text>
            <Title order={3}>97</Title>
            <Text size="xs">Total registrados</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">Presupuesto Total</Text>
            <Title order={3}>$16,000</Title>
            <Text size="xs">Asignado a eventos</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Text size="sm" c="dimmed">Fondos Utilizados</Text>
            <Title order={3}>$12,500</Title>
            <Text size="xs">78.1% del total</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Eventos recientes */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="md" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={4}>Eventos Recientes</Title>
              <Button size="xs" variant="light">Ver Todos</Button>
            </Group>

            <Stack>
              <Paper withBorder p="sm" radius="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={600}>Taller de Arte para Niños</Text>
                    <Text size="xs" c="dimmed">2024-01-15 - Centro Comunitario Norte</Text>
                    <Group gap="xs" mt="xs">
                      <Badge color="blue">Educativo</Badge>
                      <Badge color="green">Activo</Badge>
                    </Group>
                  </div>
                  <div>
                    <Text size="sm">19/25 participantes</Text>
                    <Text fw={600}>$3,200 / $5,000</Text>
                  </div>
                </Group>
              </Paper>
              {/* Aquí puedes mapear más eventos */}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Panel derecho */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            {/* Notificaciones */}
            <Paper p="md" withBorder radius="md" shadow="sm">
              <Title order={5} mb="sm">Notificaciones</Title>
              <Paper p="xs" mb="xs" radius="md" withBorder bg="yellow.1">
                <Text size="sm">Evento próximo: Taller de Arte (Mañana 14:00)</Text>
              </Paper>
              <Paper p="xs" mb="xs" radius="md" withBorder bg="blue.1">
                <Text size="sm">Cupos limitados: Jornada de Salud</Text>
              </Paper>
              <Paper p="xs" radius="md" withBorder bg="green.1">
                <Text size="sm">Evento completado: Torneo de Fútbol</Text>
              </Paper>
            </Paper>

            {/* Acciones rápidas */}
            <Paper p="md" withBorder radius="md" shadow="sm">
              <Title order={5} mb="sm">Acciones Rápidas</Title>
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
