// src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { loginAdmin } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const result = await loginAdmin(formData);
    
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    }
    // Se ha successo, la server action fa il redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-sm w-full p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 p-4 rounded-2xl text-white">
            <Lock size={32} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Area Riservata</h1>
        <p className="text-center text-slate-500 mb-8 text-sm">Inserisci la password amministratore per accedere agli ordini.</p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-0 outline-none transition-all text-center text-lg tracking-widest"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center font-bold bg-red-50 p-2 rounded-lg">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? "Verifica..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}