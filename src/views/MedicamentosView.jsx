import { useState } from 'react';
import { Check, Package, Pencil, Pill, Plus, Trash2, X } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { FormLabel } from '../components/shared/FormLabel';
import { Modal } from '../components/shared/Modal';
import { inputClass } from '../data/constants';
import { todayISO } from '../utils/dates';

export function MedicamentosView({ medications, medLog, onAdd, onEdit, onDelete, onToggleDose }) {
  const today = todayISO();
  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl shadow-sm active:bg-yellow-600">
        <Plus size={18} /> Nuevo medicamento
      </button>
      {medications.length === 0 ? (
        <EmptyState icon={Pill} text="Agrega tus medicamentos para llevar el control de horarios y existencia." />
      ) : (
        <div className="space-y-2.5">
          {medications.map((m) => {
            const hasStock = m.existencia !== '' && m.existencia !== undefined && m.existencia !== null;
            const lowStock = hasStock && Number(m.existencia) <= 5;
            return (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{m.nombre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.dosis}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(m.horarios || []).map((time) => {
                        const taken = medLog.some((l) => l.logId === `${m.id}_${today}_${time}`);
                        return (
                          <button key={time} onClick={() => onToggleDose(m, time)} className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${taken ? 'bg-teal-50 text-teal-600' : 'bg-slate-50 text-slate-500'}`}>
                            {taken && <Check size={11} />} {time}
                          </button>
                        );
                      })}
                    </div>
                    {hasStock && (
                      <p className={`text-xs mt-2 flex items-center gap-1 ${lowStock ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>
                        <Package size={12} /> {m.existencia} unidades disponibles{lowStock ? ' · pronto se agotará' : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button onClick={() => onEdit(m)} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center">
                      <Pencil size={13} className="text-slate-500" />
                    </button>
                    <button onClick={() => onDelete(m.id)} className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
                      <Trash2 size={13} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MedicationForm({ initial, onSave, onClose }) {
  const [nombre, setNombre] = useState(initial?.nombre || '');
  const [dosis, setDosis] = useState(initial?.dosis || '');
  const [horarios, setHorarios] = useState(initial?.horarios && initial.horarios.length ? initial.horarios : ['08:00']);
  const [existencia, setExistencia] = useState(initial?.existencia !== undefined ? initial.existencia : '');
  const [error, setError] = useState('');

  function updateHorario(idx, value) {
    setHorarios((prev) => prev.map((h, i) => (i === idx ? value : h)));
  }
  function addHorario() {
    setHorarios((prev) => [...prev, '08:00']);
  }
  function removeHorario(idx) {
    setHorarios((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    if (!nombre.trim()) { setError('Escribe el nombre del medicamento.'); return; }
    onSave({ id: initial?.id, nombre: nombre.trim(), dosis: dosis.trim(), horarios: horarios.filter(Boolean), existencia });
  }

  return (
    <Modal title={initial ? 'Editar medicamento' : 'Nuevo medicamento'} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FormLabel>Nombre del medicamento</FormLabel>
          <input autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} placeholder="Ej. Metformina" />
        </div>
        <div>
          <FormLabel>Dosis</FormLabel>
          <input value={dosis} onChange={(e) => setDosis(e.target.value)} className={inputClass} placeholder="Ej. 850 mg" />
        </div>
        <div>
          <FormLabel>Horarios</FormLabel>
          <div className="space-y-2">
            {horarios.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input type="time" value={h} onChange={(e) => updateHorario(idx, e.target.value)} className={inputClass} />
                {horarios.length > 1 && (
                  <button type="button" onClick={() => removeHorario(idx)} className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <X size={14} className="text-slate-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addHorario} className="text-sm text-yellow-600 font-medium mt-2 flex items-center gap-1">
            <Plus size={14} /> Agregar horario
          </button>
        </div>
        <div>
          <FormLabel>Existencia (opcional)</FormLabel>
          <input type="number" min="0" inputMode="numeric" value={existencia} onChange={(e) => setExistencia(e.target.value)} className={inputClass} placeholder="Ej. 30" />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-3 rounded-xl">Cancelar</button>
          <button type="button" onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl">Guardar medicamento</button>
        </div>
      </div>
    </Modal>
  );
}
