import { useEffect, useState } from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { Modal } from './Modal';

// Nota técnica importante: un navegador NO puede marcar el 911 ni enviar un
// SMS de forma verdaderamente automática sin que la persona lo confirme con
// un toque — es una restricción de seguridad del propio sistema operativo
// (para que ninguna página web pueda marcar o mandar mensajes por su cuenta).
// Lo más cercano y seguro que se puede ofrecer es: un botón grande que ya
// tiene todo listo (número, mensaje, ubicación) para que baste un solo toque
// más para confirmar la llamada o el envío.
function armarMensajeSOS(profile, coords) {
  const nombre = profile?.nombre || 'Un usuario de Glucosia';
  let msg = `🆘 ALERTA: ${nombre} presionó el botón de emergencia y podría estar teniendo una baja de glucosa u otra urgencia.`;
  msg += coords ? ` Ubicación: https://maps.google.com/?q=${coords.lat},${coords.lon}` : ' No se pudo obtener su ubicación exacta.';
  msg += ` Hora: ${new Date().toLocaleString('es-MX')}`;
  return msg;
}

export function SosModal({ profile, onClose, onGoEditProfile }) {
  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState('Obteniendo tu ubicación…');

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocStatus('Tu navegador no permite compartir ubicación. Se avisará sin ella.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocStatus('📍 Ubicación lista — se incluirá en el mensaje.');
      },
      () => setLocStatus('No se pudo obtener tu ubicación (revisa permisos). Se avisará sin ella.'),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const contactName = profile?.contactoEmergenciaNombre;
  const contactPhone = profile?.contactoEmergenciaTelefono;
  const mensaje = armarMensajeSOS(profile, coords);

  return (
    <Modal title="🆘 Alerta de emergencia" onClose={onClose}>
      <div className="space-y-4">
        <a
          href="tel:911"
          className="w-full bg-red-600 text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <Phone size={20} /> Llamar al 911
        </a>
        <p className="text-xs text-slate-400 -mt-2 text-center">Tu teléfono te pedirá confirmar la llamada — así lo exige el sistema, para que ninguna app pueda marcar sola.</p>

        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl p-3">
          <MapPin size={16} className="flex-shrink-0 text-slate-400" />
          <span>{locStatus}</span>
        </div>

        {contactPhone ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Avisar a {contactName || 'tu contacto de emergencia'}</p>
            <a
              href={`sms:${contactPhone}?body=${encodeURIComponent(mensaje)}`}
              className="w-full bg-yellow-400 text-slate-900 font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> Enviar SMS a {contactPhone}
            </a>
            <a
              href={`tel:${contactPhone}`}
              className="w-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Phone size={18} /> Llamar a {contactPhone}
            </a>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-600 mb-3">No has agregado un contacto de emergencia todavía.</p>
            <button
              type="button"
              onClick={() => { onClose(); onGoEditProfile(); }}
              className="text-sm font-semibold text-yellow-600"
            >
              Agregar contacto ahora
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
