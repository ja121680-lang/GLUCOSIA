import { useRef, useState } from 'react';
import { Camera, Droplet, Image as ImageIcon, Loader2, Plus, Trash2, X } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { FormLabel } from '../components/shared/FormLabel';
import { Modal } from '../components/shared/Modal';
import { GLUCOSE_CONTEXTS, inputClass } from '../data/constants';
import { formatDateLong, nowTimeStr, todayISO } from '../utils/dates';
import { getGlucoseStatus } from '../utils/health';

export function GlucosaView({ glucose, onAdd, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const grouped = {};
  glucose.forEach((g) => {
    if (!grouped[g.fecha]) grouped[g.fecha] = [];
    grouped[g.fecha].push(g);
  });
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl shadow-sm active:bg-yellow-600">
        <Plus size={18} /> Nueva lectura
      </button>

      {dates.length === 0 ? (
        <EmptyState icon={Droplet} text="Aún no tienes lecturas de glucosa. Agrega la primera para comenzar tu seguimiento." />
      ) : (
        dates.map((date) => (
          <div key={date}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{formatDateLong(date)}</p>
            <div className="space-y-2">
              {grouped[date].sort((a, b) => b.hora.localeCompare(a.hora)).map((g) => {
                const status = getGlucoseStatus(g.valor);
                const isOpen = expandedId === g.id;
                return (
                  <div key={g.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <button onClick={() => setExpandedId(isOpen ? null : g.id)} className="w-full flex items-center gap-3 p-3.5">
                      <div className={`w-2 h-10 rounded-full ${status.dot}`} />
                      <div className="flex-1 text-left">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-slate-900 tabular-nums">{g.valor}</span>
                          <span className="text-xs text-slate-500">mg/dL</span>
                        </div>
                        <p className="text-xs text-slate-500">{g.hora} · {GLUCOSE_CONTEXTS.find((c) => c.id === g.contexto)?.label || 'Otro'}</p>
                      </div>
                      {g.imagen && <ImageIcon size={16} className="text-slate-300" />}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 border-t border-slate-50 pt-3">
                        {g.imagen && <img src={g.imagen} alt="Lectura" className="w-full max-h-48 object-cover rounded-xl mb-2" />}
                        {g.notas && <p className="text-sm text-slate-600 mb-2">{g.notas}</p>}
                        <button onClick={() => onDelete(g.id)} className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function GlucoseForm({ onSave, onClose }) {
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState(todayISO());
  const [hora, setHora] = useState(nowTimeStr());
  const [contexto, setContexto] = useState('ayunas');
  const [notas, setNotas] = useState('');
  const [imagen, setImagen] = useState(null);
  const [processingImg, setProcessingImg] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setProcessingImg(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImagen(reader.result);
      setProcessingImg(false);
    };
    reader.onerror = () => setProcessingImg(false);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!valor || !fecha || !hora) {
      setError('Completa el valor, la fecha y la hora.');
      return;
    }
    onSave({ valor: Number(valor), fecha, hora, contexto, notas, imagen });
  }

  return (
    <Modal title="Nueva lectura de glucosa" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FormLabel>Glucosa (mg/dL)</FormLabel>
          <input type="number" inputMode="numeric" autoFocus value={valor} onChange={(e) => setValor(e.target.value)} className={inputClass} placeholder="Ej. 110" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FormLabel>Fecha</FormLabel>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
          </div>
          <div>
            <FormLabel>Hora</FormLabel>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <FormLabel>Momento</FormLabel>
          <select value={contexto} onChange={(e) => setContexto(e.target.value)} className={inputClass}>
            {GLUCOSE_CONTEXTS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <FormLabel>Foto del glucómetro (opcional)</FormLabel>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
          {imagen ? (
            <div className="relative">
              <img src={imagen} alt="Lectura" className="w-full h-32 object-cover rounded-xl" />
              <button type="button" onClick={() => setImagen(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900 bg-opacity-60 flex items-center justify-center">
                <X size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={processingImg} className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl py-4 text-slate-400 text-sm">
              {processingImg ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              {processingImg ? 'Procesando...' : 'Agregar foto'}
            </button>
          )}
        </div>
        <div>
          <FormLabel>Notas (opcional)</FormLabel>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className={inputClass} placeholder="Ej. después de caminar" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-3 rounded-xl">Cancelar</button>
          <button type="button" onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl">Guardar lectura</button>
        </div>
      </div>
    </Modal>
  );
}
