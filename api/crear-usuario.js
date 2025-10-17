// /api/crear-usuario.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "TU_SUPABASE_URL";
const SERVICE_ROLE_KEY = "TU_SERVICE_ROLE_KEY"; // NO uses anon key aquí

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  // 1. Crea usuario en Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // 2. Guarda usuario en tabla 'usuarios'
  const auth_id = data.user.id;
  const { error: errorInsert } = await supabase.from("usuarios").insert([
    {
      nombre,
      email,
      rol,
      estado: "Activo",
      creado_el: new Date().toISOString(),
      auth_id
    }
  ]);

  if (errorInsert) {
    return res.status(400).json({ error: errorInsert.message });
  }

  return res.status(200).json({ ok: true, user: data.user });
}
