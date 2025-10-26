import { useState } from "react";
import { supabase } from "../supabase";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Image,
  Stack,
  Center,
  Divider,
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
    <Group
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
      }}
      grow
      spacing={0}
    >
      {/* Imagen del lado izquierdo */}
      <Image
        src="/fondo-login.jpg.gif"
        alt="Login Fondo"
        style={{
          width: "50%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Sección derecha con el formulario */}
      <Center style={{ width: "50%", height: "100%" }}>
        <Paper
          withBorder
          shadow="xl"
          radius="lg"
          p="3rem"
          style={{
            maxWidth: 520,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Stack align="center" spacing="xs">
            <Title order={2} c="blue" mb="xs">
              FUNDAEVENTO
            </Title>
            <Text size="sm" c="dimmed" ta="center" fw={500}>
              "Inspirando cambios, impulsando comunidad.  
              Juntos hacemos la diferencia."
            </Text>
            <Divider my="sm" style={{ width: "70%" }} />
            <Text size="sm" c="dimmed" mb="md" ta="center">
              Ingresa tus credenciales para acceder al sistema de gestión.
            </Text>
          </Stack>

          {error && (
            <Text c="red" size="sm" mb="sm" ta="center">
              {error}
            </Text>
          )}

          <form onSubmit={handleLogin} autoComplete="off">
            <Stack>
              <TextInput
                label="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
                autoComplete="off"
              />
              <PasswordInput
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                autoComplete="off"
              />
              <Button
                type="submit"
                fullWidth
                mt="md"
                loading={loading}
                color="blue"
                size="md"
                radius="md"
              >
                Iniciar Sesión
              </Button>
            </Stack>
          </form>

          <Text size="xs" mt="md" ta="center" c="dimmed">
            © 2025 FUNDAEVENTO — Sistema de Gestión
          </Text>
        </Paper>
      </Center>
    </Group>
  );
}
