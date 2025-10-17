import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Badge,
  Paper,
  Group,
  Button,
  Grid,
  TextInput,
  Select,
  Loader,
  Center,
  Menu,
  ActionIcon,
  Modal,
} from "@mantine/core";
import {
  IconDots,
  IconEdit,
  IconUserOff,
  IconUserCheck,
} from "@tabler/icons-react";
import { supabase } from "../supabase";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [editarModal, setEditarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    rol: "",
    edad: "",
    sexo: "",
    telefono: "",
    direccion: "",
  });

  // 🔹 Traer usuarios
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (err) {
      console.error("❌ Error al traer usuarios:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // 🔹 Filtros dinámicos
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideRol = filtroRol ? u.rol === filtroRol : true;
    const coincideBusqueda =
      u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideRol && coincideBusqueda;
  });

  // 🔹 Métricas
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter((u) => u.rol === "Admin").length;
  const totalCoordinadores = usuarios.filter((u) => u.rol === "Coordinador").length;
  const totalParticipantes = usuarios.filter((u) => u.rol === "Participante").length;

  // 🔹 Cambiar estado (activar / desactivar)
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({ estado: nuevoEstado })
        .eq("id", id);

      if (error) throw error;
      alert(`Usuario ${nuevoEstado.toLowerCase()} correctamente.`);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al cambiar estado:", err.message);
      alert("No se pudo actualizar el estado del usuario.");
    }
  };

  // 🔹 Abrir modal para editar
  const abrirModalEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nombre: usuario.nombre || "",
      rol: usuario.rol || "",
      edad: usuario.edad || "",
      sexo: usuario.sexo || "",
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
    });
    setEditarModal(true);
  };

  // 🔹 Guardar cambios
  const guardarEdicion = async () => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({
          nombre: formData.nombre,
          rol: formData.rol,
          edad: formData.edad,
          sexo: formData.sexo,
          telefono: formData.telefono,
          direccion: formData.direccion,
        })
        .eq("id", usuarioEditando.id);

      if (error) throw error;
      alert("Información actualizada correctamente.");
      setEditarModal(false);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al editar usuario:", err.message);
      alert("No se pudo guardar la edición.");
    }
  };

  if (loading) {
    return (
      <Center style={{ height: "70vh" }}>
        <Loader color="blue" size="lg" />
      </Center>
    );
  }

  return (
    <div>
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Gestión de Usuarios</Title>
          <Text c="dimmed">
            Consulta y edita la información de los usuarios del sistema
          </Text>
        </div>
      </Group>

      {/* Modal editar */}
      <Modal
        opened={editarModal}
        onClose={() => setEditarModal(false)}
        title="Editar Información del Usuario"
        centered
      >
        <TextInput
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          mb="sm"
        />
        <Select
          label="Rol"
          data={["Admin", "Coordinador", "Participante"]}
          value={formData.rol}
          onChange={(value) => setFormData({ ...formData, rol: value })}
          mb="sm"
        />
        <TextInput
          label="Edad"
          value={formData.edad}
          onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
          mb="sm"
        />
        <Select
          label="Sexo"
          data={["Femenino", "Masculino", "Otro"]}
          value={formData.sexo}
          onChange={(value) => setFormData({ ...formData, sexo: value })}
          mb="sm"
        />
        <TextInput
          label="Teléfono"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          mb="sm"
        />
        <TextInput
          label="Dirección"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          mb="md"
        />
        <Group justify="right">
          <Button variant="default" onClick={() => setEditarModal(false)}>
            Cancelar
          </Button>
          <Button color="blue" onClick={guardarEdicion}>
            Guardar Cambios
          </Button>
        </Group>
      </Modal>

      {/* Métricas */}
      <Grid mb="lg">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Total Usuarios
            </Text>
            <Text fw={700} size="lg">
              {totalUsuarios}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Administradores
            </Text>
            <Text fw={700} size="lg" c="red">
              {totalAdmins}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Coordinadores
            </Text>
            <Text fw={700} size="lg" c="blue">
              {totalCoordinadores}
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed">
              Participantes
            </Text>
            <Text fw={700} size="lg" c="green">
              {totalParticipantes}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Filtros */}
      <Paper withBorder p="md" mb="lg" radius="md">
        <Group grow>
          <TextInput
            placeholder="Buscar usuarios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Select
            placeholder="Todos los roles"
            data={["Admin", "Coordinador", "Participante"]}
            value={filtroRol}
            onChange={setFiltroRol}
          />
          <Button
            variant="default"
            onClick={() => {
              setBusqueda("");
              setFiltroRol("");
            }}
          >
            Limpiar Filtros
          </Button>
        </Group>
      </Paper>

      {/* Grid de usuarios */}
      <Grid>
        {usuariosFiltrados.map((u) => (
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={u.id}>
            <Paper withBorder shadow="sm" radius="md" p="md">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{u.nombre}</Text>
                <Menu shadow="md" width={180} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray">
                      <IconDots size={18} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={16} />}
                      onClick={() => abrirModalEditar(u)}
                    >
                      Editar información
                    </Menu.Item>
                    {u.estado === "Activo" ? (
                      <Menu.Item
                        color="orange"
                        leftSection={<IconUserOff size={16} />}
                        onClick={() => cambiarEstado(u.id, "Inactivo")}
                      >
                        Desactivar
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        color="green"
                        leftSection={<IconUserCheck size={16} />}
                        onClick={() => cambiarEstado(u.id, "Activo")}
                      >
                        Reactivar
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </Group>

              <Text size="sm" c="dimmed" mb="xs">
                {u.email}
              </Text>

              {/* 🎯 Rol con badge de color */}
              <Badge
                color={
                  u.rol === "Admin"
                    ? "red"
                    : u.rol === "Coordinador"
                    ? "blue"
                    : "green"
                }
                mb="xs"
              >
                {u.rol || "Sin rol"}
              </Badge>

              <Text size="sm">🆔 ID: {u.auth_id?.slice(0, 8)}...</Text>
              <Text size="sm">📅 Desde: {new Date(u.creado_el).toLocaleDateString()}</Text>
              <Text size="sm">Estado: {u.estado}</Text>

              {u.edad && <Text size="sm">🎂 Edad: {u.edad}</Text>}
              {u.sexo && <Text size="sm">⚧ Sexo: {u.sexo}</Text>}
              {u.telefono && <Text size="sm">📞 Teléfono: {u.telefono}</Text>}
              {u.direccion && <Text size="sm">🏠 Dirección: {u.direccion}</Text>}
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
