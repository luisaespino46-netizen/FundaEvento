// src/API/createUser.js

export async function crearUsuario(nombre, email, password, rol) {
  // Llama a tu backend propio (en Vercel o donde sea)
  const res = await fetch('/api/crear-usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password, rol }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { ok: false, error: data.error || "Error desconocido" };
  }

  return { ok: true, user: data.user };
}
