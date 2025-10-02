// src/componentes/auth/Login.jsx
import { useState } from "react";
import { supabase } from "./supabase";
import { Paper, TextInput, PasswordInput, Button, Title, Text } from "@mantine/core";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Paper withBorder shadow="md" p="xl" radius="md" w={400}>
        <Title order={3} align="center" mb="lg">
          Iniciar Sesión
        </Title>
        {error && <Text c="red" size="sm" mb="sm">{error}</Text>}
        <form onSubmit={handleLogin}>
          <TextInput
            label="Correo electrónico"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Contraseña"
            placeholder="********"
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Button type="submit" fullWidth mt="lg">
            Entrar
          </Button>
        </form>
      </Paper>
    </div>
  );
}
