import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Loader,
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

  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

  // 🔹 Cargar categorías desde Supabase
  const cargarCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nombre")
        .eq("estado", true)
        .order("nombre", { ascending: true });
      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    } finally {
      setLoadingCategorias(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (eventoEditar) {
      setForm({
        titulo: eventoEditar.titulo || "",
        descripcion: eventoEditar.descripcion || "",
        fecha: eventoEditar.fecha ? new Date(eventoEditar.fecha) : null,
        hora: eventoEditar.hora || "",
        lugar: eventoEditar.ubicacion || "",
        participantes_max:
          eventoEditar.participantes_max || eventoEditar.cupo_maximo || 0,
        presupuesto_max:
          eventoEditar.presupuesto_max ||
          eventoEditar.presupuesto_maximo ||
          0,
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

  // 🔹 Crear nueva categoría directamente desde el select
  const crearNuevaCategoria = async (nombreCategoria) => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .insert([{ nombre: nombreCategoria, estado: true }])
        .select("nombre")
        .single();

      if (error) throw error;

      // agregar la nueva al listado
      setCategorias((prev) => [...prev, data]);
      setForm((prev) => ({ ...prev, categoria: data.nombre }));
    } catch (err) {
      console.error("❌ Error al crear categoría:", err);
      alert("No se pudo crear la categoría");
    }
  };

  // 🔹 Guardar o actualizar evento
  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: usuarioData, error: userError } = await supabase
        .from("usuarios")
        .select("id, rol")
        .eq("auth_id", user?.id)
        .single();

      if (userError) throw userError;

      const evento = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        fecha: form.fecha ? dayjs(form.fecha).format("YYYY-MM-DD") : null,
        hora: form.hora
          ? dayjs(`2000-01-01T${form.hora}`).format("HH:mm:ss")
          : null,
        ubicacion: form.lugar,
        cupo_maximo: form.participantes_max,
        participantes_max: form.participantes_max,
        presupuesto_max: form.presupuesto_max,
        presupuesto_actual:
          form.presupuesto_actual === undefined ||
          form.presupuesto_actual === null
            ? 0
            : form.presupuesto_actual,
        categoria: form.categoria,
        estado: "Activo",
      };

      if (usuarioData?.rol === "Coordinador") {
        evento.coordinador_id = usuarioData.id;
      }

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
        placeholder="Selecciona o crea una categoría"
        searchable
        nothingfound="Sin categorías"
        rightSection={loadingCategorias ? <Loader size={16} /> : null}
        data={categorias.map((c) => ({ value: c.nombre, label: c.nombre }))}
        value={form.categoria}
        onChange={(value) => {
          if (!value) return;
          const existe = categorias.some(
            (c) => c.nombre.toLowerCase() === value.toLowerCase()
          );
          if (!existe) {
            if (confirm(`¿Crear nueva categoría "${value}"?`)) {
              crearNuevaCategoria(value);
            }
          } else {
            setForm({ ...form, categoria: value });
          }
        }}
        creatable
        getCreateLabel={(query) => `➕ Crear nueva categoría: "${query}"`}
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
