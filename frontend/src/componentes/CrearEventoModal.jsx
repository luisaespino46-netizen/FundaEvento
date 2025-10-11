import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
} from "@mantine/core";
import { DateInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import { supabase } from "../supabase";

export default function CrearEventoModal({
  opened,
  onClose,
  onEventoCreado,
  eventoEditar,
}) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: null,
    hora: "",
    lugar: "",
    participantes_max: 0,
    presupuesto_max: 0,
    presupuesto_actual: 0,
    categoria: "",
  });

  useEffect(() => {
    if (eventoEditar) {
      setForm({
        titulo: eventoEditar.titulo || "",
        descripcion: eventoEditar.descripcion || "",
        fecha: eventoEditar.fecha ? new Date(eventoEditar.fecha) : null,
        hora: eventoEditar.hora || "",
        lugar: eventoEditar.ubicacion || "",
        participantes_max: eventoEditar.participantes_max || eventoEditar.cupo_maximo || 0,
        presupuesto_max: eventoEditar.presupuesto_max || eventoEditar.presupuesto || 0,
        presupuesto_actual: eventoEditar.presupuesto_actual ?? 0,
        categoria: eventoEditar.categoria || "",
      });
    } else {
      setForm({
        titulo: "",
        descripcion: "",
        fecha: null,
        hora: "",
        lugar: "",
        participantes_max: 0,
        presupuesto_max: 0,
        presupuesto_actual: 0,
        categoria: "",
      });
    }
  }, [eventoEditar, opened]);

  const handleSubmit = async () => {
    const evento = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      fecha: form.fecha ? dayjs(form.fecha).format("YYYY-MM-DD") : null,
      hora: form.hora ? dayjs(`2000-01-01T${form.hora}`).format("HH:mm:ss") : null,
      ubicacion: form.lugar,
      cupo_maximo: form.participantes_max,
      participantes_max: form.participantes_max,
      presupuesto_max: form.presupuesto_max,
      presupuesto_actual:
        form.presupuesto_actual === undefined || form.presupuesto_actual === null
          ? 0
          : form.presupuesto_actual,
      categoria: form.categoria,
      estado: "Activo",
    };

    try {
      let error;

      if (eventoEditar && eventoEditar.id) {
        const res = await supabase
          .from("eventos")
          .update(evento)
          .eq("id", eventoEditar.id);
        error = res.error;
        if (!error) alert("Evento actualizado correctamente ✅");
      } else {
        const res = await supabase.from("eventos").insert([evento]);
        error = res.error;
        if (!error) alert("Evento creado correctamente ✅");
      }

      if (error) throw error;
      if (onEventoCreado) onEventoCreado();
      onClose();
    } catch (err) {
      console.error("❌ ERROR Supabase:", err);
      alert("Hubo un error al guardar el evento ❌");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={eventoEditar ? "Editar Evento" : "Crear Nuevo Evento"}
      centered
    >
      <TextInput
        label="Título del Evento *"
        placeholder="Nombre del evento"
        required
        value={form.titulo}
        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        mb="sm"
      />
      <TextInput
        label="Descripción"
        placeholder="Descripción del evento"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        mb="sm"
      />
      <Group grow mb="sm">
        <DateInput
          label="Fecha *"
          placeholder="Selecciona fecha"
          value={form.fecha}
          onChange={(value) => setForm({ ...form, fecha: value })}
          required
        />
        <TimeInput
          label="Hora *"
          withSeconds={false}
          value={form.hora}
          onChange={(e) => setForm({ ...form, hora: e.currentTarget.value })}
          required
        />
      </Group>
      <TextInput
        label="Ubicación *"
        placeholder="Dirección o lugar"
        value={form.lugar}
        onChange={(e) => setForm({ ...form, lugar: e.target.value })}
        mb="sm"
        required
      />
      <Group grow mb="sm">
        <NumberInput
          label="Cupo Máximo"
          value={form.participantes_max}
          onChange={(value) => setForm({ ...form, participantes_max: value })}
        />
        <NumberInput
          label="Presupuesto Máximo"
          value={form.presupuesto_max}
          onChange={(value) => setForm({ ...form, presupuesto_max: value })}
        />
        <NumberInput
          label="Presupuesto Actual"
          value={form.presupuesto_actual}
          onChange={(value) => setForm({ ...form, presupuesto_actual: value })}
        />
      </Group>
      <Select
        label="Categoría"
        placeholder="Selecciona una categoría"
        data={[
          "Educativo",
          "Salud",
          "Deportivo",
          "Tecnología",
          "Innovación",
          "Música",
        ]}
        value={form.categoria}
        onChange={(value) => setForm({ ...form, categoria: value })}
        mb="md"
      />
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancelar
        </Button>
        <Button color="blue" onClick={handleSubmit}>
          {eventoEditar ? "Actualizar Evento" : "Crear Evento"}
        </Button>
      </Group>
    </Modal>
  );
}
