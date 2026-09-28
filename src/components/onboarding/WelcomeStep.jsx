import { Droplet } from 'lucide-react';

export function WelcomeStep({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-10 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center mb-5 shadow-lg shadow-slate-300">
          <Droplet size={36} className="text-white" fill="white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Glucosia</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-[260px]">Tu compañero diario para llevar el control de tu diabetes, sin complicaciones.</p>
      </div>
      <div className="pb-6">
        <button type="button" onClick={onStart} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3.5 rounded-xl">Regístrate para acceder</button>
        <p className="text-xs text-slate-300 text-center mt-4">Al continuar aceptas nuestros términos y el aviso de privacidad.</p>
      </div>
    </div>
  );
}

