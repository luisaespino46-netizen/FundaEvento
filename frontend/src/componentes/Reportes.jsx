// src/componentes/Reportes.jsx
import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Paper,
  Group,
  Grid,
  Select,
  Button,
  Badge,
  Progress,
  Table,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { supabase } from "../supabase";
import { utils, writeFile } from "xlsx"; // ✅ Import necesario para Excel

const formatMoney = (n = 0) =>
  `Q${Number(n || 0).toLocaleString("es-GT", { maximumFractionDigits: 0 })}`;

const formatPercent = (n = 0) => `${Number(n || 0).toFixed(1)}%`;

const safeDate = (raw) => {
  if (!raw) return "—";
  const s =
    typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw)
      ? `${raw}T00:00:00`
      : raw;
  const d = new Date(s);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

export default function Reportes() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [presupuestoGeneral, setPresupuestoGeneral] = useState(0); // 🔹 NUEVO

  // 🔹 Traer datos desde Supabase
  const fetchEventos = async () => {
    try {
      setLoading(true);

      let query = supabase.from("eventos").select("*");

      if (categoria) query = query.eq("categoria", categoria);
      if (periodo) {
        const inicio = `${periodo}-01-01`;
        const fin = `${periodo}-12-31`;
        query = query.gte("fecha", inicio).lte("fecha", fin);
      }

      const { data, error } = await query;
      if (error) throw error;

      // 🔹 Obtener presupuesto general igual que en DashboardAdmin
      const { data: config, error: configError } = await supabase
        .from("configuracion")
        .select("presupuesto_general")
        .eq("id", 1)
        .single();

      if (!configError && config) {
        setPresupuestoGeneral(config.presupuesto_general || 0);
      }

      setEventos(data || []);
    } catch (err) {
      console.error("❌ Error al cargar eventos:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Recargar al cambiar filtros
  useEffect(() => {
    fetchEventos();
  }, [periodo, categoria]);

  if (loading) {
    return (
      <Center style={{ height: "70vh" }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  // 🔹 Cálculos globales
  const totalEventos = eventos.length;
  const eventosCompletados = eventos.filter(
    (e) => (e.estado || e.estado_manual) === "Completado"
  ).length;

  const totalParticipantes = eventos.reduce(
    (sum, e) => sum + Number(e.participantes_actual || 0),
    0
  );

  const totalCapacidad = eventos.reduce(
    (sum, e) => sum + Number(e.participantes_max || 0),
    0
  );

  const promedioAsistenciaNum =
    totalCapacidad > 0 ? (totalParticipantes / totalCapacidad) * 100 : 0;

  // 🔹 Presupuesto Total ahora viene del dashboard (tabla configuracion)
  const presupuestoTotal = presupuestoGeneral || 0;

  const fondosEjecutados = eventos.reduce(
    (sum, e) => sum + Number(e.presupuesto_actual || 0),
    0
  );

  const fondosDisponibles = presupuestoTotal - fondosEjecutados;

  const eficienciaPresupuestariaNum =
    presupuestoTotal > 0 ? (fondosEjecutados / presupuestoTotal) * 100 : 0;

  // 🔹 Detalle de eventos
  const detalleEventos = eventos.map((e) => {
    const nombre = e.titulo || e.nombre || "Sin nombre";
    const fecha = safeDate(e.fecha);
    const pAct = Number(e.participantes_actual || 0);
    const pMax = Number(e.participantes_max || 0);
    const porcAsistencia = pMax > 0 ? (pAct / pMax) * 100 : 0;
    const presu = Number(e.presupuesto_max || e.presupuesto || 0);
    const gasto = Number(e.presupuesto_actual || 0);
    const eficiencia = presu > 0 ? (gasto / presu) * 100 : 0;
    const estado = e.estado || e.estado_manual || "Activo";

    return {
      Evento: nombre,
      Fecha: fecha,
      Participantes: `${pAct}/${pMax} (${formatPercent(porcAsistencia)})`,
      "Presupuesto Asignado (Q)": presu,
      "Fondos Gastados (Q)": gasto,
      Estado: estado,
      "Eficiencia (%)": Number(eficiencia.toFixed(1)),
    };
  });

  // 🔹 Generar archivo Excel
  const exportarExcel = () => {
    const hojaResumen = [
      ["Reporte General FUNDAEVENTO"],
      [],
      ["Total de Eventos", totalEventos],
      ["Eventos Completados", eventosCompletados],
      ["Total Participantes", totalParticipantes],
      ["Promedio de Asistencia", `${promedioAsistenciaNum.toFixed(1)}%`],
      ["Presupuesto Total", `Q${presupuestoTotal.toLocaleString()}`],
      ["Fondos Ejecutados", `Q${fondosEjecutados.toLocaleString()}`],
      ["Fondos Disponibles", `Q${fondosDisponibles.toLocaleString()}`],
      ["Eficiencia Presupuestaria", `${eficienciaPresupuestariaNum.toFixed(1)}%`],
      [],
    ];

    const wb = utils.book_new();
    const wsResumen = utils.aoa_to_sheet(hojaResumen);
    const wsEventos = utils.json_to_sheet(detalleEventos);

    utils.book_append_sheet(wb, wsResumen, "Resumen");
    utils.book_append_sheet(wb, wsEventos, "Detalle de Eventos");

    writeFile(wb, "Reporte_FUNDAEVENTO.xlsx");
  };

  return (
    <div>
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Reportes y Análisis</Title>
          <Text c="dimmed">
            Transparencia total en la gestión de fondos y actividades
          </Text>
        </div>
        <Button
          leftSection={<IconDownload size={16} />}
          color="dark"
          onClick={exportarExcel}
        >
          Descargar Reporte
        </Button>
      </Group>

      {/* Filtros */}
      <Paper withBorder shadow="sm" radius="md" p="md" mb="lg">
        <Title order={5} mb="sm">
          Filtros de Reporte
        </Title>
        <Group grow>
          <Select
            label="Período"
            placeholder="Todos los períodos"
            data={["2024", "2025"]}
            value={periodo}
            onChange={setPeriodo}
          />
          <Select
            label="Categoría"
            placeholder="Todas las categorías"
            data={["Educativo", "Salud", "Deportivo", "Tecnología", "Música"]}
            value={categoria}
            onChange={setCategoria}
          />
          <Button
            variant="default"
            onClick={() => {
              setPeriodo("");
              setCategoria("");
            }}
          >
            Limpiar filtros
          </Button>
        </Group>
      </Paper>

      {/* Métricas principales */}
      <Grid mb="lg">
        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Total Eventos</Title>
            <Text fw={700} size="xl">{totalEventos}</Text>
            <Text size="sm" c="dimmed">
              {eventosCompletados} completado(s)
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Participantes</Title>
            <Text fw={700} size="xl">{totalParticipantes}</Text>
            <Text size="sm" c="dimmed">
              {formatPercent(promedioAsistenciaNum)} promedio asistencia
            </Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Presupuesto Total</Title>
            <Text fw={700} size="xl">{formatMoney(presupuestoTotal)}</Text>
            <Text size="sm" c="dimmed">Asignado a eventos</Text>
          </Paper>
        </Grid.Col>

        <Grid.Col span={3}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={6}>Eficiencia</Title>
            <Text fw={700} size="xl">
              {formatPercent(eficienciaPresupuestariaNum)}
            </Text>
            <Text size="sm" c="dimmed">Ejecución presupuestaria</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Bloques inferiores */}
      <Grid>
        <Grid.Col span={6}>
          <Paper withBorder shadow="sm" radius="md" p="md" mb="lg">
            <Title order={5} mb="sm">Transparencia de Fondos</Title>
            <Stack>
              <Group justify="space-between">
                <Text size="sm">Presupuesto Asignado</Text>
                <Text fw={700}>{formatMoney(presupuestoTotal)}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Fondos Ejecutados</Text>
                <Text fw={700} c="blue">{formatMoney(fondosEjecutados)}</Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Fondos Disponibles</Text>
                <Text fw={700} c="green">{formatMoney(fondosDisponibles)}</Text>
              </Group>
              <Progress
                value={(fondosEjecutados / (presupuestoTotal || 1)) * 100}
                mt="sm"
              />
              <Text size="xs" c="dimmed">
                {formatPercent(eficienciaPresupuestariaNum)} del presupuesto ejecutado
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper withBorder shadow="sm" radius="md" p="md">
            <Title order={5} mb="sm">Métricas de Rendimiento</Title>
            <Stack>
              <div>
                <Text size="sm">Promedio de Asistencia</Text>
                <Progress value={promedioAsistenciaNum} />
                <Text size="xs">{formatPercent(promedioAsistenciaNum)}</Text>
              </div>
              <div>
                <Text size="sm">Eficiencia Presupuestaria</Text>
                <Progress value={eficienciaPresupuestariaNum} />
                <Text size="xs">{formatPercent(eficienciaPresupuestariaNum)}</Text>
              </div>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Tabla */}
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
            {detalleEventos.map((ev, i) => (
              <Table.Tr key={i}>
                <Table.Td>{ev.Evento}</Table.Td>
                <Table.Td>{ev.Fecha}</Table.Td>
                <Table.Td>{ev.Participantes}</Table.Td>
                <Table.Td>{formatMoney(ev["Presupuesto Asignado (Q)"])}</Table.Td>
                <Table.Td>{formatMoney(ev["Fondos Gastados (Q)"])}</Table.Td>
                <Table.Td>
                  <Badge
                    color={
                      ev.Estado === "Activo"
                        ? "green"
                        : ev.Estado === "Completado"
                        ? "blue"
                        : "red"
                    }
                  >
                    {ev.Estado}
                  </Badge>
                </Table.Td>
                <Table.Td>{ev["Eficiencia (%)"]}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
