export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
export function nowTimeStr() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
export function formatDateShort(dateStr) {
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}`;
}
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function formatDateLong(dateStr) {
  const parts = dateStr.split('-').map(Number);
  return `${parts[2]} de ${MESES[parts[1] - 1]} de ${parts[0]}`;
}

export async function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
export async function saveKey(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // almacenamiento no disponible; se ignora en silencio
  }
}

export function apptToDates(a) {
  const start = new Date(`${a.fecha}T${a.hora || '09:00'}:00`);
  const end = new Date(start.getTime() + 30 * 60000);
  return { start, end };
}

export function toICSDate(d) {
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
}

export function buildApptTitle(a) {
  return a.doctor ? `Cita con ${a.doctor}` : `Cita médica${a.especialidad ? ' · ' + a.especialidad : ''}`;
}

export function buildApptDetails(a) {
  const parts = [];
  if (a.especialidad) parts.push(`Especialidad: ${a.especialidad}`);
  if (a.notas) parts.push(a.notas);
  parts.push('Recordatorio creado desde Glucosia.');
  return parts.join('\n');
}

export function getGoogleCalendarUrl(a) {
  const { start, end } = apptToDates(a);
  const fmt = (d) => `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}00Z`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: buildApptTitle(a),
    dates: `${fmt(start)}/${fmt(end)}`,
    details: buildApptDetails(a),
    location: a.lugar || '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadICS(a) {
  const { start, end } = apptToDates(a);
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Glucosia//ES',
    'BEGIN:VEVENT',
    `UID:${uid()}@glucosia`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${buildApptTitle(a)}`,
    `DESCRIPTION:${buildApptDetails(a).replace(/\n/g, '\\n')}`,
    a.lugar ? `LOCATION:${a.lugar}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean);
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'cita-glucosia.ics';
  link.click();
  URL.revokeObjectURL(url);
}
