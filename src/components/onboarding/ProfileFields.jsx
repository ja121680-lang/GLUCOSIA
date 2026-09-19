import { FormLabel } from '../shared/FormLabel';
import { APP_LANGUAGES, DIABETES_TYPES, MEDICAL_CONDITIONS, inputClass } from '../../data/constants';
import { t } from '../../utils/i18n';

export function ProfileFields({ nombre, setNombre, edad, setEdad, telefono, setTelefono, correo, setCorreo, tipoDiabetes, setTipoDiabetes, idioma, setIdioma, esHipertenso, setEsHipertenso, condiciones, setCondiciones, condicionOtro, setCondicionOtro }) {
  function toggleCondicion(id) {
    setCondiciones((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>{t('language', idioma)}</FormLabel>
        <div className="flex flex-wrap gap-2">
          {APP_LANGUAGES.map((l) => (
            <button key={l.id} type="button" onClick={() => setIdioma(l.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border flex items-center gap-1.5 ${idioma === l.id ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              <span>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FormLabel>{t('fullName', idioma)}</FormLabel>
        <input autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} placeholder={t('fullName', idioma)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>{t('age', idioma)}</FormLabel>
          <input type="number" min="0" max="120" value={edad} onChange={(e) => setEdad(e.target.value)} className={inputClass} placeholder="45" />
        </div>
        <div>
          <FormLabel>{t('phone', idioma)}</FormLabel>
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={inputClass} placeholder="555 123 4567" />
        </div>
      </div>
      <div>
        <FormLabel>{t('email', idioma)}</FormLabel>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className={inputClass} placeholder="correo@ejemplo.com" />
      </div>
      <div>
        <FormLabel>{t('diabetesType', idioma)}</FormLabel>
        <div className="flex flex-wrap gap-2">
          {DIABETES_TYPES.map((tp) => (
            <button key={tp.id} type="button" onClick={() => setTipoDiabetes(tp.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border ${tipoDiabetes === tp.id ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              {tp.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FormLabel>{t('hypertensionQuestion', idioma)}</FormLabel>
        <p className="text-xs text-slate-500 -mt-1 mb-2">{t('hypertensionHint', idioma)}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setEsHipertenso(true)} className={`px-4 py-2 rounded-xl text-sm font-medium border ${esHipertenso === true ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>{t('yes', idioma)}</button>
          <button type="button" onClick={() => setEsHipertenso(false)} className={`px-4 py-2 rounded-xl text-sm font-medium border ${esHipertenso === false ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>{t('no', idioma)}</button>
        </div>
      </div>
      <div>
        <FormLabel>{t('medicalConditions', idioma)}</FormLabel>
        <p className="text-xs text-slate-500 -mt-1 mb-2">{t('medicalConditionsHint', idioma)}</p>
        <div className="flex flex-wrap gap-2">
          {MEDICAL_CONDITIONS.map((c) => (
            <button key={c.id} type="button" onClick={() => toggleCondicion(c.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border ${condiciones.includes(c.id) ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
        {condiciones.includes('otro') && (
          <input value={condicionOtro} onChange={(e) => setCondicionOtro(e.target.value)} className={`${inputClass} mt-2.5`} placeholder="Describe el otro padecimiento" />
        )}
      </div>
    </div>
  );
}

