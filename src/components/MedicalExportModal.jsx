import { Droplet, Printer, X } from 'lucide-react';
import { DIABETES_TYPES, GLUCOSE_CONTEXTS, MEDICAL_CONDITIONS } from '../data/constants';
import { MESES, formatDateShort } from '../utils/dates';
import { getGlucoseStatus, getPressureStatus } from '../utils/health';

export function MedicalExportModal({ profile, glucose, pressure, medications, appointments, labStudies, onClose }) {
  const diabetesLabel = DIABETES_TYPES.find((tp) => tp.id === profile?.tipoDiabetes)?.label || '—';
  const condicionesLabels = (profile?.condiciones || [])
    .map((id) => id === 'otro' ? (profile?.condicionOtro || 'Otro') : (MEDICAL_CONDITIONS.find((c) => c.id === id)?.label || id));
  const glucoseSorted = [...glucose].sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  const pressureSorted = [...pressure].sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  const apptsSorted = [...appointments].sort((a, b) => (b.fecha + (b.hora || '')).localeCompare(a.fecha + (a.hora || '')));
  const labSorted = [...(labStudies || [])].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const hoy = new Date();
  const fechaExportacion = `${hoy.getDate()} de ${MESES[hoy.getMonth()]} de ${hoy.getFullYear()}`;

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-30 flex items-end sm:items-center justify-center">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .medical-export-printable, .medical-export-printable * { visibility: visible; }
          .medical-export-printable { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="no-print flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="font-bold text-slate-900">Historial médico</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        <div className="medical-export-printable p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center flex-shrink-0">
              <Droplet size={18} className="text-white" fill="white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Glucosia · Historial médico</p>
              <p className="text-xs text-slate-400">Generado el {fechaExportacion}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Datos del paciente</p>
            <p className="text-sm text-slate-900 font-medium">{profile?.nombre || 'Sin nombre'}</p>
            <p className="text-xs text-slate-600">{profile?.edad ? `${profile.edad} años` : 'Edad no registrada'}{profile?.telefono ? ` · ${profile.telefono}` : ''}</p>
            {profile?.correo && <p className="text-xs text-slate-600">{profile.correo}</p>}
            <p className="text-xs text-slate-600 mt-1">Tipo de diabetes: {diabetesLabel}</p>
            <p className="text-xs text-slate-600">Hipertensión: {profile?.esHipertenso ? 'Sí' : 'No'}</p>
            {condicionesLabels.length > 0 && (
              <p className="text-xs text-slate-600">Antecedentes: {condicionesLabels.join(', ')}</p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Glucosa ({glucoseSorted.length} lecturas)</p>
            {glucoseSorted.length === 0 ? (
              <p className="text-xs text-slate-400">Sin lecturas registradas.</p>
            ) : (
              <div className="space-y-1">
                {glucoseSorted.map((g) => {
                  const status = getGlucoseStatus(g.valor);
                  return (
                    <p key={g.id} className="text-xs text-slate-600">
                      {formatDateShort(g.fecha)} {g.hora} — {g.valor} mg/dL ({status.label}) · {GLUCOSE_CONTEXTS.find((c) => c.id === g.contexto)?.label || 'Otro'}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {pressureSorted.length > 0 && (
            <div className="border-t border-slate-100 pt-3 mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Presión arterial ({pressureSorted.length} lecturas)</p>
              <div className="space-y-1">
                {pressureSorted.map((p) => {
                  const status = getPressureStatus(p.sistolica, p.diastolica);
                  return (
                    <p key={p.id} className="text-xs text-slate-600">
                      {formatDateShort(p.fecha)} {p.hora} — {p.sistolica}/{p.diastolica} mmHg ({status.label})
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-3 mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Medicamentos actuales ({medications.length})</p>
            {medications.length === 0 ? (
              <p className="text-xs text-slate-400">Sin medicamentos registrados.</p>
            ) : (
              <div className="space-y-1">
                {medications.map((m) => (
                  <p key={m.id} className="text-xs text-slate-600">{m.nombre} — {m.dosis || 'sin dosis especificada'}{m.frecuencia ? ` · ${m.frecuencia}` : ''}</p>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Citas médicas ({apptsSorted.length})</p>
            {apptsSorted.length === 0 ? (
              <p className="text-xs text-slate-400">Sin citas registradas.</p>
            ) : (
              <div className="space-y-1">
                {apptsSorted.map((a) => (
                  <p key={a.id} className="text-xs text-slate-600">{formatDateShort(a.fecha)} {a.hora || ''} — {a.doctor || 'Cita médica'}{a.especialidad ? ` · ${a.especialidad}` : ''}{a.lugar ? ` · ${a.lugar}` : ''}</p>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Estudios de laboratorio ({labSorted.length})</p>
            {labSorted.length === 0 ? (
              <p className="text-xs text-slate-400">Sin estudios registrados.</p>
            ) : (
              <div className="space-y-1">
                {labSorted.map((l) => (
                  <p key={l.id} className="text-xs text-slate-600">{formatDateShort(l.fecha)} — {l.tipo}{l.laboratorio ? ` · ${l.laboratorio}` : ''}</p>
                ))}
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-300 leading-relaxed">Este documento se generó automáticamente a partir de los datos registrados por el paciente en Glucosia y no sustituye una evaluación médica profesional.</p>
        </div>
        <div className="no-print px-5 pb-5">
          <button type="button" onClick={() => window.print()} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
            <Printer size={17} /> Descargar como PDF
          </button>
        </div>
      </div>
    </div>
  );
}
