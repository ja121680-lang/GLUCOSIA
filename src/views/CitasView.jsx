import { useRef, useState } from 'react';
import { Camera, ChevronRight, FolderOpen, Loader2, MapPin, Pencil, Plus, Search, Stethoscope, Trash2 } from 'lucide-react';
import { DocThumb } from '../components/shared/DocThumb';
import { EmptyState } from '../components/shared/EmptyState';
import { FormLabel } from '../components/shared/FormLabel';
import { Modal } from '../components/shared/Modal';
import { SPECIALTIES, inputClass } from '../data/constants';
import { downloadICS, formatDateLong, getGoogleCalendarUrl, todayISO, uid } from '../utils/dates';

export function AppointmentCard({ a, onEdit, onDelete, past }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${past ? 'opacity-60' : ''}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 p-3.5 text-left">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center flex-shrink-0">
          <Stethoscope size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate">{a.doctor || a.especialidad || 'Cita médica'}</p>
          <p className="text-xs text-slate-500">{formatDateLong(a.fecha)} · {a.hora}</p>
        </div>
        <ChevronRight size={16} className={`text-slate-300 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="px-3.5 pb-3.5 border-t border-slate-50 pt-3 space-y-2.5">
          {a.especialidad && <p className="text-sm text-slate-600 flex items-center gap-1.5"><Stethoscope size={13} className="text-slate-400" /> {a.especialidad}</p>}
          {a.lugar && <p className="text-sm text-slate-600 flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {a.lugar}</p>}
          {a.notas && <p className="text-sm text-slate-600">{a.notas}</p>}
          {a.documentos && a.documentos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {a.documentos.map((d) => <DocThumb key={d.id} doc={d} className="w-14 h-14" />)}
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <a href={getGoogleCalendarUrl(a)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs font-medium bg-slate-50 text-slate-600 py-2 rounded-lg">Google Calendar</a>
            <button type="button" onClick={() => downloadICS(a)} className="flex-1 text-xs font-medium bg-slate-50 text-slate-600 py-2 rounded-lg">Descargar .ics</button>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => onEdit(a)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-slate-600 font-medium py-2">
              <Pencil size={13} /> Editar
            </button>
            <button type="button" onClick={() => onDelete(a.id)} className="flex-1 flex items-center justify-center gap-1.5 text-sm text-red-500 font-medium py-2">
              <Trash2 size={13} /> Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function CitasView({ appointments, onAdd, onEdit, onDelete, onOpenArchive }) {
  const sorted = [...appointments].sort((a, b) => (a.fecha + (a.hora || '')).localeCompare(b.fecha + (b.hora || '')));
  const today = todayISO();
  const upcoming = sorted.filter((a) => a.fecha >= today);
  const past = sorted.filter((a) => a.fecha < today).reverse();

  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl shadow-sm active:bg-yellow-600">
        <Plus size={18} /> Nueva cita
      </button>
      <button onClick={onOpenArchive} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 font-medium text-sm py-2.5 rounded-xl">
        <FolderOpen size={16} /> Ver archivo médico
      </button>

      {appointments.length === 0 ? (
        <EmptyState icon={Stethoscope} text="Agenda tu primera cita para llevar el control de tus consultas médicas." />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Próximas</p>
              <div className="space-y-2.5">
                {upcoming.map((a) => <AppointmentCard key={a.id} a={a} onEdit={onEdit} onDelete={onDelete} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Pasadas</p>
              <div className="space-y-2.5">
                {past.map((a) => <AppointmentCard key={a.id} a={a} onEdit={onEdit} onDelete={onDelete} past />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function AppointmentForm({ initial, onSave, onClose }) {
  const [fecha, setFecha] = useState(initial?.fecha || todayISO());
  const [hora, setHora] = useState(initial?.hora || '09:00');
  const [doctor, setDoctor] = useState(initial?.doctor || '');
  const [especialidad, setEspecialidad] = useState(initial?.especialidad || SPECIALTIES[0]);
  const [lugar, setLugar] = useState(initial?.lugar || '');
  const [notas, setNotas] = useState(initial?.notas || '');
  const [documentos, setDocumentos] = useState(initial?.documentos || []);
  const [processingImg, setProcessingImg] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setProcessingImg(true);
    const reader = new FileReader();
    reader.onload = () => {
      setDocumentos((prev) => [...prev, { id: uid(), nombre: file.name, imagen: reader.result }]);
      setProcessingImg(false);
    };
    reader.onerror = () => setProcessingImg(false);
    reader.readAsDataURL(file);
  }
  function removeDoc(id) {
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  }

  function handleSave() {
    if (!fecha || !hora) { setError('Completa la fecha y la hora.'); return; }
    onSave({ id: initial?.id, fecha, hora, doctor: doctor.trim(), especialidad, lugar: lugar.trim(), notas: notas.trim(), documentos });
  }

  return (
    <Modal title={initial ? 'Editar cita' : 'Nueva cita'} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FormLabel>Fecha</FormLabel>
            <input type="date" autoFocus value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
          </div>
          <div>
            <FormLabel>Hora</FormLabel>
            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div>
          <FormLabel>Médico (opcional)</FormLabel>
          <input value={doctor} onChange={(e) => setDoctor(e.target.value)} className={inputClass} placeholder="Ej. Dra. Ramírez" />
        </div>
        <div>
          <FormLabel>Especialidad</FormLabel>
          <select value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} className={inputClass}>
            {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <FormLabel>Lugar (opcional)</FormLabel>
          <input value={lugar} onChange={(e) => setLugar(e.target.value)} className={inputClass} placeholder="Ej. Hospital Ángeles" />
        </div>
        <div>
          <FormLabel>Notas (opcional)</FormLabel>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className={inputClass} placeholder="Ej. llevar estudios previos" />
        </div>
        <div>
          <FormLabel>Documentos (opcional)</FormLabel>
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
          {documentos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto mb-2">
              {documentos.map((d) => (
                <DocThumb key={d.id} doc={d} onRemove={() => removeDoc(d.id)} />
              ))}
            </div>
          )}
          <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={processingImg} className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl py-3 text-slate-400 text-sm">
            {processingImg ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {processingImg ? 'Procesando...' : 'Agregar foto o PDF de receta o resultado'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-3 rounded-xl">Cancelar</button>
          <button type="button" onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl">Guardar cita</button>
        </div>
      </div>
    </Modal>
  );
}

export function MedicalArchiveModal({ appointments, onClose }) {
  const [query, setQuery] = useState('');

  const withDocs = appointments.filter((a) => (a.documentos?.length || 0) > 0);

  const filtered = withDocs.filter((a) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      (a.especialidad || '').toLowerCase().includes(q) ||
      (a.doctor || '').toLowerCase().includes(q) ||
      (a.lugar || '').toLowerCase().includes(q) ||
      (a.notas || '').toLowerCase().includes(q)
    );
  });

  const groups = {};
  filtered.forEach((a) => {
    const key = a.especialidad || 'Otro';
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  });
  Object.values(groups).forEach((list) => list.sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora)));

  return (
    <Modal title="Archivo médico" onClose={onClose}>
      <div className="space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por especialidad, médico o lugar"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {withDocs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Todavía no has guardado documentos en ninguna cita. Cuando agregues una foto de una receta o resultado desde una cita, aparecerá aquí.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No encontramos documentos que coincidan con esa búsqueda.</p>
        ) : (
          <div className="space-y-5">
            {Object.keys(groups).map((especialidad) => (
              <div key={especialidad}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{especialidad}</p>
                <div className="space-y-3">
                  {groups[especialidad].map((a) => (
                    <div key={a.id} className="border border-slate-100 rounded-xl p-3">
                      <p className="text-sm font-semibold text-slate-900">{a.doctor || 'Cita médica'}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatDateLong(a.fecha)}{a.lugar ? ` · ${a.lugar}` : ''}</p>
                      <div className="flex gap-2 mt-2.5 overflow-x-auto">
                        {a.documentos.map((d) => (
                          <DocThumb key={d.id} doc={d} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

