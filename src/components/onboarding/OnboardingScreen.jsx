import { useState } from 'react';
import { DIABETES_TYPES } from '../../data/constants';
import { t } from '../../utils/i18n';
import { WelcomeStep } from './WelcomeStep';
import { CookiesStep } from './CookiesStep';
import { ProfileFields } from './ProfileFields';
import { PinStep } from './PinStep';

export function OnboardingScreen({ onComplete, onLanguageChange }) {
  const [step, setStep] = useState('welcome');
  const [pendingProfile, setPendingProfile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoDiabetes, setTipoDiabetes] = useState(DIABETES_TYPES[0].id);
  const [idioma, setIdioma] = useState('es');
  const [esHipertenso, setEsHipertenso] = useState(false);
  const [condiciones, setCondiciones] = useState([]);
  const [condicionOtro, setCondicionOtro] = useState('');
  const [error, setError] = useState('');

  function handleSetIdioma(id) {
    setIdioma(id);
    if (onLanguageChange) onLanguageChange(id);
  }

  function handleFinish() {
    if (!nombre.trim()) { setError('Escribe tu nombre para continuar.'); return; }
    setPendingProfile({ nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, esHipertenso, condiciones, condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '' });
    setStep('pin');
  }

  if (step === 'welcome') return <WelcomeStep onStart={() => setStep('cookies')} />;
  if (step === 'cookies') return <CookiesStep onAccept={() => setStep('form')} />;
  if (step === 'pin') {
    return (
      <PinStep
        title="Protege tu información"
        subtitle="Crea un PIN de 4 dígitos para acceder a Glucosia. Es obligatorio para llevar tu registro de medicamentos."
        onDone={(pinHash, biometricCredentialId) => onComplete(pendingProfile, pinHash, biometricCredentialId)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-slate-900">{t('createProfile', idioma)}</h1>
      <p className="text-sm text-slate-400 mt-1 mb-6">{t('createProfileSubtitle', idioma)}</p>
      <ProfileFields
        nombre={nombre} setNombre={setNombre}
        edad={edad} setEdad={setEdad}
        telefono={telefono} setTelefono={setTelefono}
        correo={correo} setCorreo={setCorreo}
        tipoDiabetes={tipoDiabetes} setTipoDiabetes={setTipoDiabetes}
        idioma={idioma} setIdioma={handleSetIdioma}
        esHipertenso={esHipertenso} setEsHipertenso={setEsHipertenso}
        condiciones={condiciones} setCondiciones={setCondiciones}
        condicionOtro={condicionOtro} setCondicionOtro={setCondicionOtro}
      />
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      <button type="button" onClick={handleFinish} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3.5 rounded-xl mt-6 mb-8">{t('startUsing', idioma)}</button>
    </div>
  );
}
