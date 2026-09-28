export function getGlucoseStatus(value) {
  const v = Number(value);
  if (v < 70) return { label: 'Bajo', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
  if (v <= 140) return { label: 'Normal', color: 'text-teal-600', bg: 'bg-teal-50', dot: 'bg-teal-500', hex: '#059669' };
  if (v <= 200) return { label: 'Elevado', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500', hex: '#d97706' };
  return { label: 'Alto', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
}
export function getPressureStatus(sistolica, diastolica) {
  const s = Number(sistolica);
  const d = Number(diastolica);
  if (s >= 180 || d >= 120) return { label: 'Crisis hipertensiva', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
  if (s >= 140 || d >= 90) return { label: 'Hipertensión etapa 2', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
  if (s >= 130 || d >= 80) return { label: 'Hipertensión etapa 1', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500', hex: '#d97706' };
  if (s >= 120) return { label: 'Elevada', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500', hex: '#d97706' };
  return { label: 'Normal', color: 'text-teal-600', bg: 'bg-teal-50', dot: 'bg-teal-500', hex: '#059669' };
}
