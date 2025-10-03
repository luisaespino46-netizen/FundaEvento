// src/auth/LogoutButton.jsx
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <Button
      color="red"
      variant="light"
      size="xs"
      onClick={handleLogout}
    >
      Cerrar Sesión
    </Button>
  );
}
