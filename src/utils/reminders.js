import { pad2 } from './dates';

export function todayISOFrom(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function nowHHMM(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function shiftMinutes(timeStr, deltaMinutes) {
  const [h, m] = timeStr.split(':').map(Number);
  let total = h * 60 + m + deltaMinutes;
  total = ((total % 1440) + 1440) % 1440;
  return `${pad2(Math.floor(total / 60))}:${pad2(total % 60)}`;
}

function isDoseTaken(medLog, medId, date, time) {
  return medLog.some((l) => l.medId === medId && l.date === date && l.time === time);
}

/** Medicamentos cuyo horario es justo ahora y aún no se marcaron como tomados hoy. */
export function dueMedications(medications, medLog, now) {
  const date = todayISOFrom(now);
  const hhmm = nowHHMM(now);
  const due = [];
  for (const med of medications) {
    for (const time of med.horarios || []) {
      if (time === hhmm && !isDoseTaken(medLog, med.id, date, time)) {
        due.push({ type: 'medication', id: `med-${med.id}-${date}-${time}`, medId: med.id, nombre: med.nombre, dosis: med.dosis, time });
      }
    }
  }
  return due;
}

/** Citas médicas de hoy: un aviso previo y otro justo a la hora. */
export function dueAppointments(appointments, now, minutesBefore = 30) {
  const date = todayISOFrom(now);
  const hhmm = nowHHMM(now);
  const due = [];
  for (const appt of appointments) {
    if (appt.fecha !== date || !appt.hora) continue;
    const preTime = shiftMinutes(appt.hora, -minutesBefore);
    if (preTime === hhmm) {
      due.push({ type: 'appointment-soon', id: `appt-${appt.id}-pre`, minutesBefore, ...appt });
    }
    if (appt.hora === hhmm) {
      due.push({ type: 'appointment-now', id: `appt-${appt.id}-now`, ...appt });
    }
  }
  return due;
}

export function dueReminders(medications, medLog, appointments, now = new Date()) {
  return [...dueMedications(medications, medLog, now), ...dueAppointments(appointments, now)];
}

export function reminderMessage(item) {
  if (item.type === 'medication') {
    return `Hora de tomar ${item.nombre}${item.dosis ? ' (' + item.dosis + ')' : ''}`;
  }
  const quien = item.doctor || item.especialidad || 'tu médico';
  if (item.type === 'appointment-soon') {
    return `En ${item.minutesBefore} minutos: cita con ${quien}`;
  }
  return `Ahora: cita con ${quien}`;
}
