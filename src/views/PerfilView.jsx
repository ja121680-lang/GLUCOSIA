import { useEffect, useState } from 'react';
import { AlertTriangle, AlarmClock, Bluetooth, Check, ChevronRight, FileText, Globe, HelpCircle, Loader2, Lock, Mail, Pencil, Phone, TestTube, Trash2 } from 'lucide-react';
import { Modal } from '../components/shared/Modal';
import { ProfileFields } from '../components/onboarding/ProfileFields';
import { APP_LANGUAGES, DIABETES_TYPES, MEDICAL_CONDITIONS, SENSOR_BRANDS } from '../data/constants';
import { requestReminderPermission } from '../hooks/useReminderLoop';
import { t } from '../utils/i18n';

function ReminderPermissionTile() {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && window.Notification ? Notification.permission : 'unsupported',
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Notification) {
      setPermission(Notification.permission);
    }
  }, []);

  async function handleTap() {
    if (permission === 'granted') return;
    const result = await requestReminderPermission();
    setPermission(result);
  }

  const subtitle =
    permission === 'granted'
      ? 'Activados: avisan con sonido y notificación cuando abras la app'
      : permission === 'unsupported'
        ? 'Tu navegador no soporta avisos del sistema; el aviso en pantalla sigue funcionando'
        : 'Tócalo para activar el sonido y la notificación al llegar la hora';

  return (
    <button type="button" onClick={handleTap} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        <AlarmClock size={17} className="text-slate-400" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-slate-900">Recordatorios y alarmas</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      {permission === 'granted' ? <Check size={16} className="text-emerald-500" /> : <ChevronRight size={16} className="text-slate-300" />}
    </button>
  );
}

export function ProfileForm({ initial, onSave, onClose, onLanguageChange }) {
  const [nombre, setNombre] = useState(initial?.nombre || '');
  const [edad, setEdad] = useState(initial?.edad || '');
  const [telefono, setTelefono] = useState(initial?.telefono || '');
  const [correo, setCorreo] = useState(initial?.correo || '');
  const [tipoDiabetes, setTipoDiabetes] = useState(initial?.tipoDiabetes || DIABETES_TYPES[0].id);
  const [idioma, setIdioma] = useState(initial?.idioma || 'es');
  const [esHipertenso, setEsHipertenso] = useState(initial?.esHipertenso ?? false);
  const [condiciones, setCondiciones] = useState(initial?.condiciones || []);
  const [condicionOtro, setCondicionOtro] = useState(initial?.condicionOtro || '');
  const [contactoEmergenciaNombre, setContactoEmergenciaNombre] = useState(initial?.contactoEmergenciaNombre || '');
  const [contactoEmergenciaTelefono, setContactoEmergenciaTelefono] = useState(initial?.contactoEmergenciaTelefono || '');
  const [error, setError] = useState('');

  function handleSetIdioma(id) {
    setIdioma(id);
    if (onLanguageChange) onLanguageChange(id);
  }

  function handleSave() {
    if (!nombre.trim()) { setError('Escribe tu nombre para continuar.'); return; }
    onSave({
      nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, esHipertenso, condiciones,
      condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '',
      contactoEmergenciaNombre: contactoEmergenciaNombre.trim(),
      contactoEmergenciaTelefono: contactoEmergenciaTelefono.trim(),
    });
  }

  return (
    <Modal title={t('editProfileTitle', idioma)} onClose={onClose}>
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
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500 mb-1">🆘 Contacto de emergencia</p>
        <p className="text-xs text-slate-400 mb-2.5">Esta persona recibirá un SMS con tu ubicación si usas el botón SOS.</p>
        <input
          type="text"
          value={contactoEmergenciaNombre}
          onChange={(e) => setContactoEmergenciaNombre(e.target.value)}
          placeholder="Nombre del contacto"
          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm mb-2"
        />
        <input
          type="tel"
          value={contactoEmergenciaTelefono}
          onChange={(e) => setContactoEmergenciaTelefono(e.target.value)}
          placeholder="Teléfono (10 dígitos)"
          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      <div className="flex gap-2 mt-5">
        <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-3 rounded-xl">{t('cancel', idioma)}</button>
        <button type="button" onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl">{t('saveChanges', idioma)}</button>
      </div>
    </Modal>
  );
}

export function DeleteProfileConfirm({ onConfirm, onClose }) {
  return (
    <Modal title="Eliminar perfil" onClose={onClose}>
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <p className="font-semibold text-slate-900">¿Eliminar tu perfil?</p>
        <p className="text-sm text-slate-500 mt-1.5 max-w-[280px] mx-auto">Se borrarán tus datos personales y volverás a la pantalla de registro. Tus lecturas, medicamentos y citas no se eliminan.</p>
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-2.5 rounded-xl">Cancelar</button>
          <button type="button" onClick={onConfirm} className="flex-1 bg-red-500 text-white font-medium text-sm py-2.5 rounded-xl">Eliminar</button>
        </div>
      </div>
    </Modal>
  );
}

export function PerfilView({ profile, device, language, onEditProfile, onChangeLanguage, onOpenDevice, onDeleteProfile, onExportHistory, onOpenLabStudies, onLock }) {
  const diabetesLabel = DIABETES_TYPES.find((tp) => tp.id === profile?.tipoDiabetes)?.label || '—';
  const avatarInitial = (profile?.nombre || '?').trim().charAt(0).toUpperCase();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const condicionesLabels = (profile?.condiciones || [])
    .map((id) => id === 'otro' ? (profile?.condicionOtro || 'Otro') : (MEDICAL_CONDITIONS.find((c) => c.id === id)?.label || id));
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">{avatarInitial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900 truncate">{profile?.nombre || 'Sin nombre'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{profile?.edad ? `${profile.edad} años · ` : ''}{diabetesLabel}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Phone size={15} className="text-slate-400 flex-shrink-0" />
            <span>{profile?.telefono || 'Sin teléfono registrado'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Mail size={15} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{profile?.correo || 'Sin correo registrado'}</span>
          </div>
        </div>
        {condicionesLabels.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-2">{t('medicalConditions', language)}</p>
            <div className="flex flex-wrap gap-1.5">
              {condicionesLabels.map((label, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-600">{label}</span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 mt-4">
          <button type="button" onClick={onEditProfile} className="w-full bg-slate-50 text-slate-700 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5">
            <Pencil size={14} /> {t('editInfo', language)}
          </button>
          <button type="button" onClick={() => setShowDeleteConfirm(true)} className="w-full bg-red-50 text-red-500 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5">
            <Trash2 size={14} /> {t('deleteProfileBtn', language)}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1.5"><Globe size={13} /> {t('language', language)}</p>
        <div className="flex flex-wrap gap-2">
          {APP_LANGUAGES.map((l) => (
            <button key={l.id} type="button" onClick={() => onChangeLanguage(l.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border flex items-center gap-1.5 ${language === l.id ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              <span>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={onOpenDevice} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <Bluetooth size={17} className="text-slate-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900">{t('device', language)}</p>
          <p className="text-xs text-slate-400">{device ? device.label : 'Sin vincular'}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>

      <button type="button" onClick={onLock} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <Lock size={17} className="text-slate-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900">Bloquear aplicación</p>
          <p className="text-xs text-slate-400">Pide tu PIN o huella la próxima vez que abras Glucosia</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>

      <ReminderPermissionTile />

      <button type="button" onClick={onOpenLabStudies} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <TestTube size={17} className="text-slate-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900">{t('labStudies', language)}</p>
          <p className="text-xs text-slate-400">{t('labStudiesSubtitle', language)}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>

      <button type="button" onClick={onExportHistory} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <FileText size={17} className="text-slate-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900">{t('exportHistory', language)}</p>
          <p className="text-xs text-slate-400">{t('exportHistorySubtitle', language)}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>

      {showDeleteConfirm && (
        <DeleteProfileConfirm onConfirm={() => { setShowDeleteConfirm(false); onDeleteProfile(); }} onClose={() => setShowDeleteConfirm(false)} />
      )}
    </div>
  );
}

export function DevicePairingView({ initial, onSave, onClose }) {
  const [step, setStep] = useState(initial ? 'connected' : 'select');
  const [selectedBrand, setSelectedBrand] = useState(
    initial ? SENSOR_BRANDS.find((b) => b.id === initial.id) || null : null
  );
  const [pairedName, setPairedName] = useState(initial?.pairedName || '');
  const [error, setError] = useState('');

  async function handleSelect(brand) {
    setError('');
    if (!navigator.bluetooth) {
      setError('Este navegador no soporta Bluetooth. Prueba en Chrome/Edge en Android, o registra tus lecturas a mano.');
      return;
    }
    setSelectedBrand(brand);
    setStep('connecting');
    try {
      // Conexión real por Web Bluetooth: se pide al sistema el selector de
      // dispositivos cercanos. FreeStyle Libre/Dexcom/Guardian usan
      // protocolos cerrados y encriptados del fabricante — no es posible
      // leer sus valores de glucosa por esta vía genérica, solo emparejar
      // el dispositivo. Ver la nota dentro de la pantalla "connected".
      const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      setPairedName(device.name || brand.label);
      onSave({ id: brand.id, label: brand.label, maker: brand.maker, pairedName: device.name || brand.label });
      setStep('connected');
    } catch (err) {
      if (err && err.name === 'NotFoundError') {
        // el usuario cerró el selector sin elegir nada — no es un error real
        setStep('select');
        return;
      }
      setError('No se pudo vincular el dispositivo: ' + (err?.message || 'error desconocido'));
      setStep('select');
    }
  }

  function handleUnlink() {
    onSave(null);
    setSelectedBrand(null);
    setStep('select');
  }

  return (
    <Modal title="Sensor de glucosa" onClose={onClose}>
      {step === 'select' && (
        <div>
          <p className="text-sm text-slate-400 mb-1">Elige la marca o tipo de sensor que usas.</p>
          {error && <p className="text-xs text-red-500 mt-1 mb-2">{error}</p>}
          <div className="space-y-2 mt-3">
            {SENSOR_BRANDS.map((b) => (
              <button key={b.id} type="button" onClick={() => handleSelect(b)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <Bluetooth size={17} className="text-slate-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900">{b.label}</p>
                  {b.maker && <p className="text-xs text-slate-400">{b.maker}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 'connecting' && (
        <div className="text-center py-8">
          <Loader2 size={32} className="animate-spin text-yellow-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-900">Buscando dispositivos cercanos...</p>
          <p className="text-xs text-slate-400 mt-1">Elige tu {selectedBrand?.label} en la ventana que abrió el sistema.</p>
        </div>
      )}
      {step === 'connected' && (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
            <Check size={26} className="text-teal-600" />
          </div>
          <p className="font-semibold text-slate-900">Dispositivo vinculado</p>
          <p className="text-sm text-slate-400 mt-1">{pairedName || selectedBrand?.label}{selectedBrand?.maker ? ` · ${selectedBrand.maker}` : ''}</p>
          <p className="text-xs text-slate-400 mt-4 bg-slate-50 rounded-xl p-3 text-left">La conexión Bluetooth con tu dispositivo es real. La lectura automática de valores de glucosa no está disponible todavía: FreeStyle Libre, Dexcom y equipos similares usan un protocolo cerrado del fabricante que no se puede leer por esta vía — por ahora, registra tu valor a mano en la pestaña Glucosa.</p>
          <button type="button" onClick={handleUnlink} className="w-full bg-red-50 text-red-500 font-medium text-sm py-2.5 rounded-xl mt-4">Desvincular dispositivo</button>
        </div>
      )}
    </Modal>
  );
}

export function HelpModal({ onClose }) {
  const faqs = [
    { q: '¿Mis datos están seguros?', a: 'Toda tu información se guarda únicamente en este dispositivo, en el almacenamiento local del navegador. Glucosia no envía tus datos a ningún servidor.' },
    { q: '¿Cómo agrego una lectura de glucosa o presión?', a: 'Ve a la pestaña correspondiente y toca "Nueva lectura". Puedes agregar el valor, la fecha, la hora y el momento del día.' },
    { q: '¿Puedo compartir mis citas con mi calendario?', a: 'Sí. Dentro de cada cita puedes agregarla a Google Calendar o descargar un archivo .ics compatible con la mayoría de calendarios.' },
    { q: '¿Qué pasa si elimino mi perfil?', a: 'Se borran tus datos personales, pero tus lecturas, medicamentos y citas se conservan en este dispositivo.' },
  ];
  return (
    <Modal title="Ayuda" onClose={onClose}>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i}>
            <p className="text-sm font-semibold text-slate-900 flex items-start gap-2">
              <HelpCircle size={15} className="text-yellow-500 flex-shrink-0 mt-0.5" /> {f.q}
            </p>
            <p className="text-sm text-slate-500 mt-1 pl-6">{f.a}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
