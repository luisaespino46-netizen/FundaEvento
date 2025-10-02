// src/componentes/CrearEvento.jsx
import {
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  Paper,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates"; // ✅ Import correcto
import "dayjs/locale/es"; // opcional: para que use formato en español

export default function CrearEvento() {
  return (
    <Paper p="md" shadow="sm" radius="md" withBorder>
      <Title order={2} mb="lg">Crear Nuevo Evento</Title>

      <TextInput
        label="Nombre del Evento"
        placeholder="Ej: Taller de Arte"
        mb="md"
      />
      <Textarea
        label="Descripción"
        placeholder="Descripción breve del evento..."
        mb="md"
      />

      <Group grow mb="md">
        <DateInput
          label="Fecha"
          placeholder="Selecciona la fecha"
          locale="es"
        />
        <TimeInput label="Hora" />
      </Group>

      <TextInput
        label="Lugar"
        placeholder="Ej: Centro Comunitario Norte"
        mb="md"
      />

      <Group grow mb="md">
        <NumberInput label="Cupos Máximos" placeholder="Ej: 50" />
        <NumberInput label="Presupuesto" placeholder="Ej: 5000" prefix="$" />
      </Group>

      <Group grow mb="md">
        <Select
          label="Estado"
          placeholder="Selecciona"
          data={["Activo", "Completado", "Cancelado"]}
        />
        <Select
          label="Categoría"
          placeholder="Selecciona"
          data={["Educativo", "Salud", "Deportivo"]}
        />
      </Group>

      <Group mt="lg">
        <Button color="blue">Guardar</Button>
        <Button variant="default">Cancelar</Button>
      </Group>
    </Paper>
  );
}
