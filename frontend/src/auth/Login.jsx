// src/auth/Login.jsx
import { useState } from "react";
import { supabase } from "../supabase";
import { Paper, TextInput, PasswordInput, Button, Title, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("❌ " + error.message);
    } else {
      localStorage.setItem("session", JSON.stringify(data.session));
      navigate("/dashboard");
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
            placeholder="admin@fundaevento.com"
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
          <Button type="submit" fullWidth mt="lg" loading={loading}>
            Entrar
          </Button>
        </form>
      </Paper>
    </div>
  );
}
