// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Función para obtener datos del usuario desde la tabla "usuarios"
  const fetchUserProfile = async (userId) => {
    console.log("🔍 Buscando perfil con auth_id:", userId);
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("auth_id", userId) // ✅ nombre correcto en tu tabla
      .single();

    if (error) {
      console.warn("⚠️ Usuario no encontrado en la tabla usuarios:", error.message);
      setProfile(null);
    } else {
      console.log("✅ Perfil cargado:", data);
      setProfile(data);
    }
  };

  // 🔹 Valida la sesión actual
  useEffect(() => {
    console.log("🟢 Iniciando validación de sesión...");
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data?.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) fetchUserProfile(sessionUser.id);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) fetchUserProfile(sessionUser.id);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
