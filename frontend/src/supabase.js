// src/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qylqbhcoycyysmmzhzva.supabase.co";  // ✅ tu Project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5bHFiaGNveWN5eXNtbXpoenZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyOTMwNjAsImV4cCI6MjA3NDg2OTA2MH0.5IEJtq9GWm7p6vX6UfCzCx80Io8Bxzl25DUeaEHH5oo"               // ✅ la anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
