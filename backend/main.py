from fastapi import FastAPI
from pydantic import BaseModel
import psycopg2
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# 🔹 Cargar variables de entorno (.env)
load_dotenv()

# 🔹 Crear la aplicación FastAPI
app = FastAPI()

# 🔹 Configurar CORS (permitir peticiones desde el frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Conexión a la base de datos (Supabase/Postgres)
DATABASE_URL = os.getenv("DATABASE_URL")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

# =========================
# 📌 MODELO DE EVENTO (para POST)
# =========================
class Evento(BaseModel):
    titulo: str
    descripcion: str
    fecha: str
    hora: str
    ubicacion: str
    cupo_maximo: int
    presupuesto: float | None = None
    categoria: str
    estado: str

# =========================
# 📌 ENDPOINTS
# =========================

@app.get("/")
def root():
    return {"message": "FUNDAEVENTO Backend Activo"}

@app.get("/eventos")
def get_eventos():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, titulo, descripcion, fecha, hora, ubicacion, cupo_maximo, presupuesto, categoria, estado FROM eventos;")
        rows = cur.fetchall()
        conn.close()

        eventos = []
        for r in rows:
            eventos.append({
                "id": r[0],
                "titulo": r[1],
                "descripcion": r[2],
                "fecha": str(r[3]),
                "hora": str(r[4]),
                "ubicacion": r[5],
                "cupo_maximo": r[6],
                "presupuesto": float(r[7]) if r[7] else None,
                "categoria": r[8],
                "estado": r[9],
            })
        return {"eventos": eventos}
    except Exception as e:
        return {"error": str(e)}

# ✅ NUEVO ENDPOINT PARA INSERTAR EVENTOS
@app.post("/eventos")
def crear_evento(evento: Evento):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO eventos (titulo, descripcion, fecha, hora, ubicacion, cupo_maximo, presupuesto, categoria, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (evento.titulo, evento.descripcion, evento.fecha, evento.hora, evento.ubicacion,
              evento.cupo_maximo, evento.presupuesto, evento.categoria, evento.estado))
        
        nuevo_id = cur.fetchone()[0]
        conn.commit()
        conn.close()
        return {"message": "Evento creado con éxito", "id": nuevo_id}
    except Exception as e:
        return {"error": str(e)}
