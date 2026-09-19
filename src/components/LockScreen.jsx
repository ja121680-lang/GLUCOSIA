import { useCallback, useEffect, useState } from 'react';
import { Fingerprint, Lock } from 'lucide-react';
import { hashPin, verifyBiometric } from '../utils/security';

export function LockScreen({ pinHash, biometricCredentialId, onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checkingBiometric, setCheckingBiometric] = useState(false);

  const tryBiometric = useCallback(async () => {
    if (!biometricCredentialId) return;
    setCheckingBiometric(true);
    const ok = await verifyBiometric(biometricCredentialId);
    setCheckingBiometric(false);
    if (ok) onUnlock();
  }, [biometricCredentialId, onUnlock]);

  useEffect(() => { tryBiometric(); }, [tryBiometric]);

  function handleKey(k) {
    if (k === 'del') { setPin((p) => p.slice(0, -1)); setError(''); return; }
    if (pin.length >= 4) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (hashPin(next) === pinHash) {
          onUnlock();
        } else {
          setError('PIN incorrecto, intenta de nuevo.');
          setPin('');
        }
      }, 150);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-10 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center mb-5 shadow-lg shadow-slate-300">
          <Lock size={28} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Ingresa tu PIN</h1>
        <p className="text-sm text-slate-500 mt-2">Protegemos tu información médica.</p>
        <div className="flex gap-3 mt-6 mb-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full ${i < pin.length ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        <div className="grid grid-cols-3 gap-3 mt-6 w-full max-w-[260px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, idx) => (
            k === '' ? <div key={idx} /> : (
              <button key={idx} type="button" onClick={() => handleKey(k)} className="h-14 rounded-2xl bg-white shadow text-lg font-semibold text-slate-900 flex items-center justify-center">
                {k === 'del' ? '⌫' : k}
              </button>
            )
          ))}
        </div>
        {biometricCredentialId && (
          <button type="button" onClick={tryBiometric} disabled={checkingBiometric} className="flex items-center gap-2 mt-6 px-4 py-2 rounded-xl text-sm font-medium bg-white text-slate-600 border border-slate-200">
            <Fingerprint size={18} />
            {checkingBiometric ? 'Verificando...' : 'Usar huella/Face ID'}
          </button>
        )}
      </div>
    </div>
  );
}
