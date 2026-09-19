import { ShieldCheck } from 'lucide-react';

export function CookiesStep({ onAccept }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-10 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
          <ShieldCheck size={28} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Tu privacidad importa</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-[280px]">Usamos cookies y almacenamiento local para guardar tus datos de salud en este dispositivo y mejorar tu experiencia dentro de Glucosia.</p>
      </div>
      <div className="pb-6">
        <button type="button" onClick={onAccept} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3.5 rounded-xl">Aceptar todas las cookies</button>
      </div>
    </div>
  );
}

