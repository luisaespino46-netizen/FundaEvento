import { supabase } from "./supabase";

async function probarLogin() {
  console.log("🔍 Probando conexión a Supabase...");

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@fundaevento.com",
    password: "48594329",
  });

  if (error) {
    console.error("❌ Error al iniciar sesión:", error.message);
  } else {
    console.log("✅ Sesión iniciada correctamente:", data);
  }
}

probarLogin();
