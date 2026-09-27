import { useRef, useState } from 'react';
import { MessageCircle, Mic, Send, X } from 'lucide-react';

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u00f1\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

const TAB_LABELS = {
  inicio: ['inicio', 'home', 'accueil', 'inicio', 'start', '首页'],
  glucosa: ['glucosa', 'glucose', 'glicose', 'glycemie', 'glycémie', 'glicemia', 'glukose', '血糖'],
  presion: ['presion', 'pressure', 'pressao', 'pressão', 'tension', 'pressione', 'blutdruck', '血压'],
  medicamentos: ['medicinas', 'meds', 'remedios', 'remédios', 'medicaments', 'médicaments', 'farmaci', 'medikamente', '药物'],
  citas: ['citas', 'appointments', 'consultas', 'rendez vous', 'rendez-vous', 'appuntamenti', 'termine', '预约'],
  recetas: ['recetas', 'recipes', 'receitas', 'recettes', 'ricette', 'rezepte', '食谱'],
  perfil: ['mi perfil', 'my profile', 'meu perfil', 'mon profil', 'il mio profilo', 'mein profil', 'perfil', 'profile', '个人资料'],
};

const INTENTS = {
  inicio: ['inicio', 'home', 'principal', 'pantalla principal', 'volver al inicio', 'regresar al inicio'],
  glucosa: ['glucosa', 'azucar', 'azucar en sangre', 'medicion de glucosa', 'mis lecturas', 'mis niveles'],
  presion: ['presion', 'presion arterial', 'tension arterial', 'sistolica', 'diastolica', 'pulso'],
  medicamentos: ['medicamento', 'medicamentos', 'medicina', 'medicinas', 'pastilla', 'pastillas', 'dosis'],
  citas: ['cita', 'citas', 'agenda', 'doctor', 'consulta', 'proxima cita'],
  recetas: ['receta', 'recetas', 'recetario', 'comida', 'que puedo cocinar'],
  perfil: ['perfil', 'mis datos', 'configuracion', 'idioma', 'sensor', 'dispositivo'],
};

const EXPORT_LABELS = [
  'exportar historial medico',
  'export medical history',
  'exportar historico medico',
  'exporter le dossier medical',
  'esporta cartella clinica',
  'krankengeschichte exportieren',
];

function findButtonByText(labels, root = document) {
  const wanted = labels.map(normalize);
  const buttons = Array.from(root.querySelectorAll('button'));
  return buttons.find((button) => {
    const text = normalize(button.textContent);
    return wanted.some((label) => text.includes(label));
  });
}

function clickTab(tabId) {
  const nav = document.querySelector('nav');
  if (!nav) return false;
  const button = findButtonByText(TAB_LABELS[tabId] || [], nav);
  if (!button) return false;
  button.click();
  return true;
}

export function GAAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState('¿En qué te ayudo?');
  const [listening, setListening] = useState(false);
  const pendingAction = useRef(null);

  function speak(text) {
    setAnswer(text);
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      // Voice output is optional; text remains visible and screen-reader friendly.
    }
  }

  function navigate(tabId, message) {
    if (clickTab(tabId)) {
      speak(message);
      return true;
    }
    speak('Esa sección todavía no está disponible en esta pantalla. Si estás en el inicio de sesión o en el registro, complétalo primero.');
    return false;
  }

  function requestSensitive(label, action) {
    pendingAction.current = { label, action };
    speak('Esta acción puede generar o exponer información médica. Para continuar, di o escribe “confirmar”. Para cancelar, di o escribe “cancelar”.');
  }

  function confirmPending() {
    if (!pendingAction.current) {
      speak('No hay ninguna acción sensible pendiente.');
      return;
    }
    const current = pendingAction.current;
    pendingAction.current = null;
    try {
      current.action();
      speak('Confirmado. Abrí la función solicitada. Revisa la información antes de compartirla.');
    } catch (_) {
      speak('No pude completar esa acción desde el asistente. Puedes abrirla manualmente desde Mi perfil.');
    }
  }

  function cancelPending() {
    pendingAction.current = null;
    speak('Acción cancelada. No se exportó ni compartió información.');
  }

  function openMedicalExport() {
    if (!clickTab('perfil')) {
      speak('Primero desbloquea Glucosia y entra a tu perfil.');
      return;
    }
    window.setTimeout(() => {
      const button = findButtonByText(EXPORT_LABELS);
      if (button) button.click();
      else speak('No encontré el botón de exportación en esta pantalla. Puedes abrirlo manualmente desde Mi perfil.');
    }, 80);
  }

  function route(rawText) {
    const text = normalize(rawText);
    if (!text) {
      speak('Puedes decirme, por ejemplo: “quiero ver mi glucosa”, “abre mis medicamentos”, “muéstrame mis citas” o “quiero exportar mi historial”.');
      return;
    }

    if (pendingAction.current && containsAny(text, ['confirmar', 'confirmo', 'si confirmo', 'adelante', 'continuar'])) {
      confirmPending();
      return;
    }
    if (pendingAction.current && containsAny(text, ['cancelar', 'cancela', 'detener', 'no continuar'])) {
      cancelPending();
      return;
    }

    if (containsAny(text, ['que puedes hacer', 'como me ayudas', 'ayudame', 'ayuda', 'opciones'])) {
      speak('Puedo llevarte a Inicio, Glucosa, Presión, Medicamentos, Citas, Recetas o Mi perfil. También puedo abrir la exportación de tu historial, pero esa acción requiere confirmación. No realizo diagnósticos médicos.');
      return;
    }

    if (containsAny(text, ['exportar historial', 'descargar historial', 'reporte medico', 'informe medico', 'compartir historial', 'enviar historial'])) {
      requestSensitive('exportar historial médico', openMedicalExport);
      return;
    }

    if (containsAny(text, ['diagnostico', 'diagnosticar', 'que enfermedad tengo', 'que tengo', 'interpretame esto'])) {
      speak('No puedo diagnosticar enfermedades ni sustituir a un profesional de salud. Sí puedo ayudarte a encontrar tus lecturas, medicamentos, citas y estudios para revisarlos con tu médico.');
      return;
    }

    if (containsAny(text, ['emergencia', 'urgencia', 'auxilio', 'me siento muy mal'])) {
      speak('Si estás ante una emergencia real, contacta de inmediato a los servicios de emergencia de tu zona. Glucosia puede ayudarte a consultar tus datos, pero no sustituye atención médica urgente.');
      return;
    }

    for (const [tabId, terms] of Object.entries(INTENTS)) {
      if (containsAny(text, terms)) {
        const messages = {
          inicio: 'Volví al inicio de Glucosia.',
          glucosa: 'Abrí Glucosa para que revises o registres tus lecturas.',
          presion: 'Abrí Presión para que revises tus registros.',
          medicamentos: 'Abrí Medicamentos para que revises tus dosis y recordatorios.',
          citas: 'Abrí Citas para que revises tu agenda médica.',
          recetas: 'Abrí Recetas.',
          perfil: 'Abrí Mi perfil.',
        };
        navigate(tabId, messages[tabId]);
        return;
      }
    }

    speak('No identifiqué exactamente lo que necesitas. Dímelo con tus propias palabras, por ejemplo: “quiero ver mis últimas lecturas de glucosa” o “abre mis citas”.');
  }

  function submit() {
    route(input);
  }

  function listen() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speak('El reconocimiento de voz no está disponible en este navegador. Puedes escribir tu solicitud.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-MX';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => {
        setListening(false);
        speak('No pude escuchar con claridad. Intenta otra vez o escribe tu solicitud.');
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        route(transcript);
      };
      recognition.start();
    } catch (_) {
      setListening(false);
      speak('No pude activar el micrófono. Puedes escribir tu solicitud.');
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente conversacional GA"
        title="Asistente GA"
        className="fixed right-4 bottom-24 z-40 w-14 h-14 rounded-full bg-yellow-500 text-black border-2 border-yellow-300 shadow-xl flex items-center justify-center font-bold"
      >
        <MessageCircle size={24} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-3" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="ga-assistant-title"
            className="w-full max-w-lg rounded-2xl border border-yellow-500 bg-slate-900 text-white shadow-2xl p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 id="ga-assistant-title" className="text-xl font-bold text-yellow-400">Asistente GA</h2>
                <p className="text-sm text-slate-300 mt-1">Habla o escribe con lenguaje natural. Las acciones sensibles requieren confirmación.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente" className="w-11 h-11 rounded-full border border-slate-700 flex items-center justify-center">
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 min-h-20 rounded-xl border border-slate-700 bg-slate-800 p-4 text-base leading-relaxed" aria-live="polite">
              {answer}
            </div>

            <label className="block mt-4 text-sm font-semibold text-slate-200" htmlFor="ga-assistant-input">
              Tu solicitud
            </label>
            <input
              id="ga-assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  submit();
                }
              }}
              autoComplete="off"
              placeholder="Ej. Quiero ver mis últimas lecturas"
              className="mt-2 w-full min-h-12 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-lg text-white"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <button type="button" onClick={listen} disabled={listening} className="min-h-12 rounded-xl border border-yellow-500 text-yellow-400 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                <Mic size={20} aria-hidden="true" /> {listening ? 'Escuchando…' : 'Hablar'}
              </button>
              <button type="button" onClick={submit} className="min-h-12 rounded-xl bg-yellow-500 text-black font-bold flex items-center justify-center gap-2">
                <Send size={20} aria-hidden="true" /> Enviar
              </button>
            </div>

            <button type="button" onClick={() => route('que puedes hacer')} className="mt-3 w-full min-h-11 text-sm text-slate-300 underline underline-offset-4">
              ¿Qué puedo pedir?
            </button>
          </section>
        </div>
      )}
    </>
  );
}
