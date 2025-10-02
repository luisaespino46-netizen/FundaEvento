# FUNDAEVENTO

Estructura base del proyecto para despliegue en la nube.

## Estructura
- backend (FastAPI + Supabase)
- frontend (React + Vite)

## Pasos Backend
1. Crear entorno virtual en /backend
   python -m venv venv
   source venv/bin/activate  (Linux/Mac)
   venv\Scripts\activate   (Windows)

2. Instalar dependencias
   pip install -r requirements.txt

3. Levantar servidor local
   uvicorn main:app --reload

## Pasos Frontend
1. Dentro de /frontend correr
   npm create vite@latest .
   npm install

2. Levantar servidor local
   npm run dev
