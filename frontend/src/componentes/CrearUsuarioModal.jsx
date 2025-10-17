import { useState } from "react";
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Select,
  Group,
} from "@mantine/core";
import { crearUsuario } from "../API/createUser";

export default function CrearUsuarioModal({ opened, onClose, onUsuarioCreado }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.password || !form.rol) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await crearUsuario(
        form.nombre,
        form.email,
        form.password,
        form.rol
      );

      if (res.ok) {
        alert("✅ Usuario registrado correctamente.");
        onUsuarioCreado?.(); // 🔹 refresca lista de usuarios
        setForm({ nombre: "", email: "", password: "", rol: "" });
        onClose();
      } else {
        alert("❌ Error al crear usuario: " + res.error);
      }
    } catch (err) {
      console.error("Error al crear usuario:", err);
      alert("Error inesperado al registrar usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Crear Nuevo Usuario"
      centered
    >
      <TextInput
        label="Nombre completo"
        placeholder="Nombre del usuario"
        value={form.nombre}
        onChange={(e) => handleChange("nombre", e.target.value)}
        required
        mb="sm"
      />

      <TextInput
        label="Correo electrónico"
        placeholder="usuario@fundaevento.com"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
        mb="sm"
      />

      <PasswordInput
        label="Contraseña"
        placeholder="••••••••"
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
        mb="sm"
      />

      <Select
        label="Rol"
        placeholder="Selecciona un rol"
        data={[
          { value: "Admin", label: "Administrador" },
          { value: "Coordinador", label: "Coordinador" },
          { value: "Participante", label: "Participante" },
        ]}
        value={form.rol}
        onChange={(value) => handleChange("rol", value)}
        required
        mb="md"
      />

      <Group justify="right" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancelar
        </Button>
        <Button color="blue" loading={loading} onClick={handleSubmit}>
          Crear Usuario
        </Button>
      </Group>
    </Modal>
  );
}
