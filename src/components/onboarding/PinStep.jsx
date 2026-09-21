import { useEffect, useState } from 'react';
import { Fingerprint, Lock } from 'lucide-react';
import { hashPin, isBiometricAvailable, registerBiometric } from '../../utils/security';

export function PinStep({ onDone, title, subtitle }) {
  const [stage, setStage] = useState('create'); // 'create' | 'confirm'
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    isBiometricAvailable().then(setBiometricAvailable);
  }, []);

  async function finish(confirmedPin) {
    setSaving(true);
    const credentialId = biometricEnabled ? await registerBiometric() : null;
    onDone(hashPin(confirmedPin), credentialId);
  }

  function handleKey(k) {
    if (saving) return;
    const current = stage === 'create' ? pin : confirmPin;
    const setCurrent = stage === 'create' ? setPin : setConfirmPin;
    if (k === 'del') { setCurrent(current.slice(0, -1)); setError(''); return; }
    if (current.length >= 4) return;
    const next = current + k;
    setCurrent(next);
    setError('');
    if (next.length === 4) {
      if (stage === 'create') {
        setTimeout(() => setStage('confirm'), 150);
      } else if (next === pin) {
        setTimeout(() => finish(next), 150);
      } else {
        setTimeout(() => {
          setError('Los PIN no coinciden. Intenta de nuevo.');
          setPin('');
          setConfirmPin('');
          setStage('create');
        }, 150);
      }
    }
  }

  const current = stage === 'create' ? pin : confirmPin;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-10 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center mb-5 shadow-lg shadow-slate-300">
          <Lock size={28} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">{title || (stage === 'create' ? 'Crea tu PIN de acceso' : 'Confirma tu PIN')}</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-[280px]">{subtitle || 'Este PIN protege tu información médica. Es obligatorio para usar Glucosia.'}</p>
        <div className="flex gap-3 mt-6 mb-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full ${i < current.length ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-[260px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, idx) => (
            k === '' ? <div key={idx} /> : (
              <button
                key={idx}
                type="button"
                onClick={() => handleKey(k)}
                disabled={saving}
                className="h-14 rounded-2xl bg-white shadow text-lg font-semibold text-slate-900 flex items-center justify-center"
              >
                {k === 'del' ? '⌫' : k}
              </button>
            )
          ))}
        </div>
        {biometricAvailable && (
          <button
            type="button"
            onClick={() => setBiometricEnabled((v) => !v)}
            disabled={saving}
            className={`flex items-center gap-2 mt-6 px-4 py-2 rounded-xl text-sm font-medium ${biometricEnabled ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            <Fingerprint size={18} />
            {biometricEnabled ? 'Huella/Face ID activada' : 'Activar huella/Face ID como acceso rápido'}
          </button>
        )}
      </div>
    </div>
  );
}
