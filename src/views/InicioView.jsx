import { Calendar, Check, ChevronRight, AlertTriangle } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GLUCOSE_CONTEXTS } from '../data/constants';
import { formatDateLong, formatDateShort, todayISO } from '../utils/dates';
import { getGlucoseStatus } from '../utils/health';

export function InicioView({ glucose, medications, medLog, appointments, onToggleDose, onGoTab, onOpenSos }) {
  const today = todayISO();
  const sortedGlucose = [...glucose].sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  const lastReading = sortedGlucose[0];

  const todayDoses = [];
  medications.forEach((m) => {
    (m.horarios || []).forEach((time) => {
      const taken = medLog.some((l) => l.logId === `${m.id}_${today}_${time}`);
      todayDoses.push({ med: m, time, taken });
    });
  });
  todayDoses.sort((a, b) => a.time.localeCompare(b.time));

  const chartData = [...sortedGlucose].slice(0, 7).reverse().map((g) => ({ fecha: formatDateShort(g.fecha), valor: Number(g.valor) }));

  const nextAppt = [...appointments]
    .filter((a) => a.fecha >= today)
    .sort((a, b) => (a.fecha + (a.hora || '')).localeCompare(b.fecha + (b.hora || '')))[0];

  const timeline = [
    ...glucose.map((g) => ({ type: 'glucosa', date: g.fecha, time: g.hora, text: `Glucosa: ${g.valor} mg/dL`, sub: GLUCOSE_CONTEXTS.find((c) => c.id === g.contexto)?.label || '' })),
    ...medLog.map((l) => ({ type: 'medicamento', date: l.date, time: l.time, text: `${l.medName} tomado`, sub: '' })),
    ...appointments.map((a) => ({ type: 'cita', date: a.fecha, time: a.hora, text: `Cita: ${a.doctor || a.especialidad}`, sub: a.especialidad || '' })),
  ].sort((a, b) => (b.date + (b.time || '')).localeCompare(a.date + (a.time || ''))).slice(0, 8);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 -mt-1">Herramienta de apoyo personal; no reemplaza el consejo de tu médico.</p>

      <button
        type="button"
        onClick={onOpenSos}
        className="w-full bg-red-600 text-white font-bold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
      >
        <AlertTriangle size={18} /> SOS — Necesito ayuda ahora
      </button>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Última lectura de glucosa</p>
          {lastReading && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getGlucoseStatus(lastReading.valor).bg} ${getGlucoseStatus(lastReading.valor).color}`}>
              {getGlucoseStatus(lastReading.valor).label}
            </span>
          )}
        </div>
        {lastReading ? (
          <>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">{lastReading.valor}</span>
              <span className="text-sm text-slate-500">mg/dL</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatDateLong(lastReading.fecha)} · {lastReading.hora}</p>
          </>
        ) : (
          <button onClick={() => onGoTab('glucosa')} className="text-sm text-yellow-600 font-medium mt-2">Agrega tu primera lectura →</button>
        )}
        {chartData.length > 1 && (
          <div className="h-32 mt-3 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['dataMin - 20', 'dataMax + 20']} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="valor" stroke="#d97706" strokeWidth={2} dot={{ r: 3, fill: '#d97706' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {todayDoses.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Medicamentos de hoy</p>
          <div className="space-y-2">
            {todayDoses.map((d, i) => (
              <button key={i} onClick={() => onToggleDose(d.med, d.time)} className="w-full flex items-center gap-3 transition-transform active:scale-[0.98]">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${d.taken ? 'bg-teal-500 border-teal-500' : 'border-slate-200'}`}>
                  {d.taken && <Check size={13} className="text-white" />}
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-sm font-medium ${d.taken ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{d.med.nombre}</p>
                  <p className="text-xs text-slate-400">{d.time} · {d.med.dosis}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {nextAppt && (
        <button onClick={() => onGoTab('citas')} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 transition-transform active:scale-[0.98]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center flex-shrink-0">
            <Calendar size={17} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-slate-900">Próxima cita: {nextAppt.doctor || nextAppt.especialidad || 'Cita médica'}</p>
            <p className="text-xs text-slate-400">{formatDateLong(nextAppt.fecha)} · {nextAppt.hora}</p>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      )}

      {timeline.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Actividad reciente</p>
          <div className="space-y-3">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400">{formatDateShort(item.date)}{item.time ? ` · ${item.time}` : ''}{item.sub ? ` · ${item.sub}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
