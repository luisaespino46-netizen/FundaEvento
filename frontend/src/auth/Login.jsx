import { useState } from "react";
import { supabase } from "../supabase";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
} from "@mantine/core";
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
    <div className="relative w-screen h-screen bg-gray-100">
      <div
        className="absolute left-1/2 top-[55%] transform -translate-x-1/2 -translate-y-1/2"
      >
        <Paper
          withBorder
          shadow="lg"
          p="xl"
          radius="lg"
          style={{
            width: 400,
            textAlign: "center",
          }}
        >
          <Title order={2} mb="lg">
            Iniciar Sesión
          </Title>

          {error && (
            <Text c="red" size="sm" mb="sm">
              {error}
            </Text>
          )}

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
    </div>
  );
}
