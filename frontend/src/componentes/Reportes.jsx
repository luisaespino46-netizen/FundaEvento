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
import { utils, writeFile } from "xlsx";

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

// 🔹 Lógica de estado igual que en Eventos.jsx
const calcularEstadoLocal = (e) => {
  if (e.estado_manual) return e.estado_manual;
  const fechaEvento = new Date(e.fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaEvento.setHours(0, 0, 0, 0);
  return fechaEvento < hoy ? "Completado" : "Activo";
};

export default function Reportes() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [presupuestoGeneral, setPresupuestoGeneral] = useState(0);
  const [totalParticipantes, setTotalParticipantes] = useState(0);

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

      const { data: eventosData, error } = await query;
      if (error) throw error;

      const { data: config, error: configError } = await supabase
        .from("configuracion")
        .select("presupuesto_general")
        .eq("id", 1)
        .single();

      if (!configError && config) {
        setPresupuestoGeneral(config.presupuesto_general || 0);
      }

      const { count: participantesCount, error: participantesError } =
        await supabase.from("participantes").select("id", { count: "exact" });

      if (!participantesError) {
        setTotalParticipantes(participantesCount || 0);
      }

      setEventos(eventosData || []);
    } catch (err) {
      console.error("❌ Error al cargar eventos:", err.message);
    } finally {
      setLoading(false);
    }
  };

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

  // ✅ Usa la misma lógica de estado que en Eventos.jsx
  const eventosCompletados = eventos.filter(
    (e) => calcularEstadoLocal(e) === "Completado"
  ).length;

  const totalCapacidad = eventos.reduce(
    (sum, e) => sum + Number(e.participantes_max || 0),
    0
  );

  const promedioAsistenciaNum =
    totalCapacidad > 0 ? (totalParticipantes / totalCapacidad) * 100 : 0;

  const presupuestoTotal = presupuestoGeneral || 0;

  const fondosEjecutados = eventos.reduce(
    (sum, e) => sum + Number(e.presupuesto_actual || 0),
    0
  );

  const fondosDisponibles = presupuestoTotal - fondosEjecutados;

  const eficienciaPresupuestariaNum =
    presupuestoTotal > 0 ? (fondosEjecutados / presupuestoTotal) * 100 : 0;

  // 🔹 Detalle de eventos (solo se cambia el estado)
  const detalleEventos = eventos.map((e) => {
    const nombre = e.titulo || e.nombre || "Sin nombre";
    const fecha = safeDate(e.fecha);
    const pMax = Number(e.participantes_max || 0);
    const presu = Number(e.presupuesto_max || e.presupuesto || 0);
    const gasto = Number(e.presupuesto_actual || 0);
    const eficiencia = presu > 0 ? (gasto / presu) * 100 : 0;
    const estado = calcularEstadoLocal(e); // ✅ aquí se usa la nueva lógica

    return {
      Evento: nombre,
      Fecha: fecha,
      Participantes: `${pMax > 0 ? "—" : "—"}`,
      "Presupuesto Asignado (Q)": presu,
      "Fondos Gastados (Q)": gasto,
      Estado: estado,
      "Eficiencia (%)": Number(eficiencia.toFixed(1)),
    };
  });

  // 🔹 Exportar a Excel
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

      {/* Tabla de detalle */}
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
