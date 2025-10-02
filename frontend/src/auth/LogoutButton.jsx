import { Button } from "@mantine/core";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // 👈 vuelve al login
  };

  return (
    <Button color="red" onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  );
}
