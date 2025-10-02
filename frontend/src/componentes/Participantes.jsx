// src/componentes/Participantes.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Participantes() {
  const [participantes, setParticipantes] = useState([]);

  useEffect(() => {
    async function cargarParticipantes() {
      const { data, error } = await supabase.from("participantes").select("*");
      if (error) console.error("Error:", error);
      else setParticipantes(data);
    }
    cargarParticipantes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Participantes</h2>
      {participantes.length === 0 ? (
        <p>No hay participantes registrados.</p>
      ) : (
        <ul className="space-y-2">
          {participantes.map((p) => (
            <li key={p.id} className="p-3 border rounded bg-white">
              {p.nombre} – {p.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Participantes;
