import { AlarmClock, Check } from 'lucide-react';
import { reminderMessage } from '../../utils/reminders';

/**
 * Banner de alarma en pantalla completa: no desaparece solo, hay que
 * tocar el botón para confirmarlo. Pensado para que una persona mayor no
 * se lo pierda ni lo cierre por accidente.
 */
export function ReminderBanner({ reminder, onDismiss }) {
  if (!reminder) return null;
  const isNow = reminder.type === 'medication' || reminder.type === 'appointment-now';

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full sm:max-w-sm rounded-3xl p-6 text-center shadow-2xl">
        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isNow ? 'bg-red-50' : 'bg-yellow-50'}`}>
          <AlarmClock size={28} className={isNow ? 'text-red-500' : 'text-yellow-600'} />
        </div>
        <p className="text-lg font-bold text-slate-900 mt-4">{reminderMessage(reminder)}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3.5 rounded-xl mt-6 flex items-center justify-center gap-2"
        >
          <Check size={18} /> {reminder.type === 'medication' ? 'Ya lo tomé' : 'Entendido'}
        </button>
      </div>
    </div>
  );
}
