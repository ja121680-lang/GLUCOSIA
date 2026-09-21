import { useState } from 'react';
import { HeartPulse, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { FormLabel } from '../components/shared/FormLabel';
import { Modal } from '../components/shared/Modal';
import { GLUCOSE_CONTEXTS, inputClass } from '../data/constants';
import { formatDateLong, nowTimeStr, todayISO } from '../utils/dates';
import { getPressureStatus } from '../utils/health';

export function PresionView({ pressure, onAdd, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const grouped = {};
  pressure.forEach((p) => {
    if (!grouped[p.fecha]) grouped[p.fecha] = [];
    grouped[p.fecha].push(p);
  });
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl shadow-sm active:bg-yellow-600">
        <Plus size={18} /> Nueva lectura
      </button>

      {dates.length === 0 ? (
        <EmptyState icon={HeartPulse} text="Aún no tienes lecturas de presión arterial. Agrega la primera para comenzar tu seguimiento." />
      ) : (
        dates.map((date) => (
          <div key={date}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{formatDateLong(date)}</p>
            <div className="space-y-2">
              {grouped[date].sort((a, b) => b.hora.localeCompare(a.hora)).map((p) => {
                const status = getPressureStatus(p.sistolica, p.diastolica);
                const isOpen = expandedId === p.id;
                return (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <button onClick={() => setExpandedId(isOpen ? null : p.id)} className="w-full flex items-center gap-3 p-3.5">
                      <div className={`w-2 h-10 rounded-full ${status.dot}`} />
                      <div className="flex-1 text-left">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-slate-900 tabular-nums">{p.sistolica}/{p.diastolica}</span>
                          <span className="text-xs text-slate-500">mmHg</span>
                        </div>
                        <p className="text-xs text-slate-500">{p.hora} · {GLUCOSE_CONTEXTS.find((c) => c.id === p.contexto)?.label || 'Otro'}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 border-t border-slate-50 pt-3">
                        {p.notas && <p className="text-sm text-slate-600 mb-2">{p.notas}</p>}
                        <button onClick={() => onDelete(p.id)} className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
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

export function PressureForm({ onSave, onClose }) {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');
  const [fecha, setFecha] = useState(todayISO());
  const [hora, setHora] = useState(nowTimeStr());
  const [contexto, setContexto] = useState('ayunas');
  const [notas, setNotas] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    if (!sistolica || !diastolica || !fecha || !hora) {
      setError('Completa la sistólica, la diastólica, la fecha y la hora.');
      return;
    }
    onSave({ sistolica: Number(sistolica), diastolica: Number(diastolica), fecha, hora, contexto, notas });
  }

  return (
    <Modal title="Nueva lectura de presión" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FormLabel>Sistólica (mmHg)</FormLabel>
            <input type="number" inputMode="numeric" autoFocus value={sistolica} onChange={(e) => setSistolica(e.target.value)} className={inputClass} placeholder="Ej. 120" />
          </div>
          <div>
            <FormLabel>Diastólica (mmHg)</FormLabel>
            <input type="number" inputMode="numeric" value={diastolica} onChange={(e) => setDiastolica(e.target.value)} className={inputClass} placeholder="Ej. 80" />
          </div>
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
