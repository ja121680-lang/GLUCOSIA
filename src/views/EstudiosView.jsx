import { useRef, useState } from 'react';
import { Camera, Loader2, Plus, Trash2 } from 'lucide-react';
import { DocThumb } from '../components/shared/DocThumb';
import { FormLabel } from '../components/shared/FormLabel';
import { Modal } from '../components/shared/Modal';
import { inputClass } from '../data/constants';
import { formatDateLong, todayISO, uid } from '../utils/dates';

export function LabStudyForm({ onSave, onClose }) {
  const [fecha, setFecha] = useState(todayISO());
  const [tipo, setTipo] = useState('');
  const [laboratorio, setLaboratorio] = useState('');
  const [notas, setNotas] = useState('');
  const [documentos, setDocumentos] = useState([]);
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
    if (!fecha || !tipo.trim()) { setError('Completa la fecha y el tipo de estudio.'); return; }
    onSave({ fecha, tipo: tipo.trim(), laboratorio: laboratorio.trim(), notas: notas.trim(), documentos });
  }

  return (
    <Modal title="Nuevo estudio" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FormLabel>Fecha</FormLabel>
          <input type="date" autoFocus value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
        </div>
        <div>
          <FormLabel>Tipo de estudio</FormLabel>
          <input value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass} placeholder="Ej. Perfil lipídico, hemoglobina glucosilada" />
        </div>
        <div>
          <FormLabel>Laboratorio (opcional)</FormLabel>
          <input value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)} className={inputClass} placeholder="Ej. Laboratorio Clínico del Sur" />
        </div>
        <div>
          <FormLabel>Notas (opcional)</FormLabel>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className={inputClass} placeholder="Ej. en ayunas, valores fuera de rango" />
        </div>
        <div>
          <FormLabel>Resultado (opcional)</FormLabel>
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
            {processingImg ? 'Procesando...' : 'Tomar foto o subir PDF del resultado'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-3 rounded-xl">Cancelar</button>
          <button type="button" onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl">Guardar estudio</button>
        </div>
      </div>
    </Modal>
  );
}

export function LabStudyCard({ item, onDelete }) {
  return (
    <div className="border border-slate-100 rounded-xl p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{item.tipo || 'Estudio de laboratorio'}</p>
          <p className="text-xs text-slate-500 mt-0.5">{formatDateLong(item.fecha)}{item.laboratorio ? ` · ${item.laboratorio}` : ''}</p>
        </div>
        <button type="button" onClick={() => onDelete(item.id)} className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
          <Trash2 size={13} className="text-slate-400" />
        </button>
      </div>
      {item.notas && <p className="text-xs text-slate-500 mt-2">{item.notas}</p>}
      {item.documentos?.length > 0 && (
        <div className="flex gap-2 mt-2.5 overflow-x-auto">
          {item.documentos.map((d) => (
            <DocThumb key={d.id} doc={d} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LabStudiesModal({ labStudies, onAdd, onDelete, onClose }) {
  const sorted = [...labStudies].sort((a, b) => b.fecha.localeCompare(a.fecha));
  return (
    <Modal title="Estudios de laboratorio" onClose={onClose}>
      <div className="space-y-4">
        <button type="button" onClick={onAdd} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl">
          <Plus size={16} /> Agregar estudio
        </button>
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Todavía no has guardado estudios de laboratorio. Agrega uno y toma foto o escanea el resultado para guardarlo aquí.</p>
        ) : (
          <div className="space-y-3">
            {sorted.map((item) => (
              <LabStudyCard key={item.id} item={item} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
