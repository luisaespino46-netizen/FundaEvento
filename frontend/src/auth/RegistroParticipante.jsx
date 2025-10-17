// src/auth/RegistroParticipante.jsx
import { useState } from "react";
import { supabase } from "../supabase";
import { Paper, TextInput, PasswordInput, Button, Title, Text } from "@mantine/core";

export default function RegistroParticipante({ onVolverLogin }) {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    // REGISTRO en Supabase Auth, mandando el nombre en metadata:
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre
        }
      }
    });

    if (error) {
      setMensaje("❌ " + error.message);
      setLoading(false);
      return;
    }

    setMensaje("¡Registro exitoso! Revisa tu correo para confirmar.");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Paper withBorder shadow="md" p="xl" radius="md" w={400}>
        <Title order={3} align="center" mb="lg">
          Registro de Participante
        </Title>
        {mensaje && <Text c={mensaje.startsWith("❌") ? "red" : "green"} size="sm" mb="sm">{mensaje}</Text>}
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nombre completo"
            placeholder="Ejemplo: Juana Pérez"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <TextInput
            label="Correo electrónico"
            placeholder="tucorreo@email.com"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            mt="md"
          />
          <PasswordInput
            label="Contraseña"
            placeholder="********"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            mt="md"
          />
          <Button type="submit" fullWidth mt="lg" loading={loading}>
            Registrarse
          </Button>
        </form>
        <Button variant="subtle" fullWidth mt="sm" onClick={onVolverLogin}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Paper>
    </div>
  );
}
