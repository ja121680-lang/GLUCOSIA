import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Droplet, Pill, Calendar, Plus, X, Camera, Check,
  AlertTriangle, TrendingUp, Clock, MapPin, Trash2,
  Pencil, Package, Star, Image as ImageIcon, Stethoscope,
  UtensilsCrossed, ArrowLeft, Loader2, User, Phone, Mail,
  Globe, Bluetooth, Settings, ChevronRight, LogOut, Cake,
  ShieldCheck, RefreshCw, HelpCircle, FolderOpen, Search,
  HeartPulse, FileText, Printer, TestTube,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ---------------------------------------------------------------------------
// Datos estáticos
// ---------------------------------------------------------------------------
const GLUCOSE_CONTEXTS = [
  { id: 'ayunas', label: 'En ayunas' },
  { id: 'antes_comida', label: 'Antes de comer' },
  { id: 'despues_comida', label: 'Después de comer' },
  { id: 'antes_dormir', label: 'Antes de dormir' },
  { id: 'otro', label: 'Otro momento' },
];

const SPECIALTIES = ['Endocrinología', 'Medicina General', 'Nutrición', 'Oftalmología', 'Podología', 'Cardiología', 'Otro'];

const DIABETES_TYPES = [
  { id: 'tipo1', label: 'Tipo 1' },
  { id: 'tipo2', label: 'Tipo 2' },
  { id: 'gestacional', label: 'Gestacional' },
  { id: 'prediabetes', label: 'Prediabetes' },
  { id: 'otro', label: 'Otro' },
];

const MEDICAL_CONDITIONS = [
  { id: 'hipertension', label: 'Hipertensión' },
  { id: 'colesterol', label: 'Colesterol alto' },
  { id: 'cardiopatia', label: 'Enfermedad cardíaca' },
  { id: 'renal', label: 'Enfermedad renal' },
  { id: 'tiroides', label: 'Problemas de tiroides' },
  { id: 'obesidad', label: 'Obesidad' },
  { id: 'cirugia', label: 'Cirugía previa' },
  { id: 'fractura', label: 'Fractura u ortopedia' },
  { id: 'embarazo', label: 'Embarazo' },
  { id: 'otro', label: 'Otro' },
];

const APP_LANGUAGES = [
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'it', label: 'Italiano', flag: '🇮🇹' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'zh', label: '中文', flag: '🇨🇳' },
];

const UI_STRINGS = {
  es: {
    home: 'Inicio', glucose: 'Glucosa', pressure: 'Presión', meds: 'Medicinas', appts: 'Citas', recipes: 'Recetas',
    greeting: 'Hola', profile: 'Mi perfil', language: 'Idioma', device: 'Sensor de glucosa',
    createProfile: 'Crea tu perfil', createProfileSubtitle: 'Completa tus datos para personalizar Glucosia.', startUsing: 'Comenzar a usar Glucosia',
    fullName: 'Nombre completo', age: 'Edad', phone: 'Teléfono', email: 'Correo electrónico', diabetesType: 'Tipo de diabetes',
    hypertensionQuestion: '¿Eres hipertenso?', hypertensionHint: 'Actívalo para habilitar el seguimiento de presión arterial en la pestaña Presión.',
    medicalConditions: 'Antecedentes médicos', medicalConditionsHint: 'Selecciona los padecimientos que apliquen. Puedes elegir varios.',
    yes: 'Sí', no: 'No', editProfileTitle: 'Editar perfil', saveChanges: 'Guardar cambios', cancel: 'Cancelar',
    editInfo: 'Editar información', deleteProfileBtn: 'Eliminar perfil',
    exportHistory: 'Exportar historial médico', exportHistorySubtitle: 'Genera un PDF para compartir con tu médico',
    labStudies: 'Estudios de laboratorio', labStudiesSubtitle: 'Guarda tus resultados y análisis',
  },
  en: {
    home: 'Home', glucose: 'Glucose', pressure: 'Pressure', meds: 'Meds', appts: 'Appointments', recipes: 'Recipes',
    greeting: 'Hello', profile: 'My profile', language: 'Language', device: 'Glucose sensor',
    createProfile: 'Create your profile', createProfileSubtitle: 'Fill in your details to personalize Glucosia.', startUsing: 'Start using Glucosia',
    fullName: 'Full name', age: 'Age', phone: 'Phone', email: 'Email', diabetesType: 'Diabetes type',
    hypertensionQuestion: 'Are you hypertensive?', hypertensionHint: 'Turn this on to enable blood pressure tracking in the Pressure tab.',
    medicalConditions: 'Medical history', medicalConditionsHint: 'Select any conditions that apply. You can choose more than one.',
    yes: 'Yes', no: 'No', editProfileTitle: 'Edit profile', saveChanges: 'Save changes', cancel: 'Cancel',
    editInfo: 'Edit information', deleteProfileBtn: 'Delete profile',
    exportHistory: 'Export medical history', exportHistorySubtitle: 'Generate a PDF to share with your doctor',
    labStudies: 'Lab studies', labStudiesSubtitle: 'Save your test results',
  },
  pt: {
    home: 'Início', glucose: 'Glicose', pressure: 'Pressão', meds: 'Remédios', appts: 'Consultas', recipes: 'Receitas',
    greeting: 'Olá', profile: 'Meu perfil', language: 'Idioma', device: 'Sensor de glicose',
    createProfile: 'Crie seu perfil', createProfileSubtitle: 'Preencha seus dados para personalizar o Glucosia.', startUsing: 'Começar a usar o Glucosia',
    fullName: 'Nome completo', age: 'Idade', phone: 'Telefone', email: 'E-mail', diabetesType: 'Tipo de diabetes',
    hypertensionQuestion: 'Você é hipertenso?', hypertensionHint: 'Ative para habilitar o acompanhamento da pressão arterial na aba Pressão.',
    medicalConditions: 'Histórico médico', medicalConditionsHint: 'Selecione as condições que se aplicam. Você pode escolher mais de uma.',
    yes: 'Sim', no: 'Não', editProfileTitle: 'Editar perfil', saveChanges: 'Salvar alterações', cancel: 'Cancelar',
    editInfo: 'Editar informações', deleteProfileBtn: 'Excluir perfil',
    exportHistory: 'Exportar histórico médico', exportHistorySubtitle: 'Gere um PDF para compartilhar com seu médico',
    labStudies: 'Exames laboratoriais', labStudiesSubtitle: 'Guarde os resultados dos seus exames',
  },
  fr: {
    home: 'Accueil', glucose: 'Glycémie', pressure: 'Tension', meds: 'Médicaments', appts: 'Rendez-vous', recipes: 'Recettes',
    greeting: 'Bonjour', profile: 'Mon profil', language: 'Langue', device: 'Capteur de glycémie',
    createProfile: 'Créez votre profil', createProfileSubtitle: 'Renseignez vos informations pour personnaliser Glucosia.', startUsing: 'Commencer à utiliser Glucosia',
    fullName: 'Nom complet', age: 'Âge', phone: 'Téléphone', email: 'E-mail', diabetesType: 'Type de diabète',
    hypertensionQuestion: 'Êtes-vous hypertendu(e) ?', hypertensionHint: "Activez cette option pour suivre votre tension artérielle dans l'onglet Tension.",
    medicalConditions: 'Antécédents médicaux', medicalConditionsHint: "Sélectionnez les affections qui s'appliquent. Vous pouvez en choisir plusieurs.",
    yes: 'Oui', no: 'Non', editProfileTitle: 'Modifier le profil', saveChanges: 'Enregistrer les modifications', cancel: 'Annuler',
    editInfo: 'Modifier les informations', deleteProfileBtn: 'Supprimer le profil',
    exportHistory: 'Exporter le dossier médical', exportHistorySubtitle: 'Générez un PDF à partager avec votre médecin',
    labStudies: 'Analyses de laboratoire', labStudiesSubtitle: "Enregistrez vos résultats d'analyses",
  },
  it: {
    home: 'Home', glucose: 'Glicemia', pressure: 'Pressione', meds: 'Farmaci', appts: 'Appuntamenti', recipes: 'Ricette',
    greeting: 'Ciao', profile: 'Il mio profilo', language: 'Lingua', device: 'Sensore di glicemia',
    createProfile: 'Crea il tuo profilo', createProfileSubtitle: 'Inserisci i tuoi dati per personalizzare Glucosia.', startUsing: 'Inizia a usare Glucosia',
    fullName: 'Nome completo', age: 'Età', phone: 'Telefono', email: 'Email', diabetesType: 'Tipo di diabete',
    hypertensionQuestion: 'Sei iperteso?', hypertensionHint: 'Attivalo per abilitare il monitoraggio della pressione nella scheda Pressione.',
    medicalConditions: 'Anamnesi medica', medicalConditionsHint: 'Seleziona le condizioni applicabili. Puoi sceglierne più di una.',
    yes: 'Sì', no: 'No', editProfileTitle: 'Modifica profilo', saveChanges: 'Salva modifiche', cancel: 'Annulla',
    editInfo: 'Modifica informazioni', deleteProfileBtn: 'Elimina profilo',
    exportHistory: 'Esporta cartella clinica', exportHistorySubtitle: 'Genera un PDF da condividere con il tuo medico',
    labStudies: 'Esami di laboratorio', labStudiesSubtitle: 'Salva i tuoi risultati',
  },
  de: {
    home: 'Start', glucose: 'Glukose', pressure: 'Blutdruck', meds: 'Medikamente', appts: 'Termine', recipes: 'Rezepte',
    greeting: 'Hallo', profile: 'Mein Profil', language: 'Sprache', device: 'Glukosesensor',
    createProfile: 'Erstelle dein Profil', createProfileSubtitle: 'Gib deine Daten ein, um Glucosia zu personalisieren.', startUsing: 'Glucosia jetzt nutzen',
    fullName: 'Vollständiger Name', age: 'Alter', phone: 'Telefon', email: 'E-Mail', diabetesType: 'Diabetestyp',
    hypertensionQuestion: 'Hast du Bluthochdruck?', hypertensionHint: 'Aktiviere dies, um die Blutdrucküberwachung im Tab Blutdruck zu nutzen.',
    medicalConditions: 'Krankengeschichte', medicalConditionsHint: 'Wähle alle zutreffenden Erkrankungen aus. Mehrfachauswahl möglich.',
    yes: 'Ja', no: 'Nein', editProfileTitle: 'Profil bearbeiten', saveChanges: 'Änderungen speichern', cancel: 'Abbrechen',
    editInfo: 'Informationen bearbeiten', deleteProfileBtn: 'Profil löschen',
    exportHistory: 'Krankengeschichte exportieren', exportHistorySubtitle: 'Erstelle ein PDF zum Teilen mit deinem Arzt',
    labStudies: 'Laboruntersuchungen', labStudiesSubtitle: 'Speichere deine Testergebnisse',
  },
  zh: {
    home: '首页', glucose: '血糖', pressure: '血压', meds: '药物', appts: '预约', recipes: '食谱',
    greeting: '你好', profile: '我的档案', language: '语言', device: '血糖传感器',
    createProfile: '创建你的档案', createProfileSubtitle: '填写你的信息以个性化 Glucosia。', startUsing: '开始使用 Glucosia',
    fullName: '姓名', age: '年龄', phone: '电话', email: '电子邮箱', diabetesType: '糖尿病类型',
    hypertensionQuestion: '你有高血压吗？', hypertensionHint: '开启后可在血压标签中记录血压。',
    medicalConditions: '病史', medicalConditionsHint: '请选择适用的情况，可多选。',
    yes: '是', no: '否', editProfileTitle: '编辑档案', saveChanges: '保存更改', cancel: '取消',
    editInfo: '编辑信息', deleteProfileBtn: '删除档案',
    exportHistory: '导出病历', exportHistorySubtitle: '生成可与医生分享的 PDF',
    labStudies: '化验检查', labStudiesSubtitle: '保存你的检验结果',
  },
};

const SENSOR_BRANDS = [
  { id: 'freestyle_libre', label: 'FreeStyle Libre', maker: 'Abbott' },
  { id: 'dexcom_g6', label: 'Dexcom G6', maker: 'Dexcom' },
  { id: 'dexcom_g7', label: 'Dexcom G7', maker: 'Dexcom' },
  { id: 'medtronic_guardian', label: 'Guardian Connect', maker: 'Medtronic' },
  { id: 'contour', label: 'Contour Next One', maker: 'Ascensia' },
  { id: 'accu_chek', label: 'Accu-Chek Instant', maker: 'Roche' },
  { id: 'otro_sensor', label: 'Otro dispositivo', maker: '' },
];

const RECIPES = [
  {
    id: 'r1', nombre: 'Ensalada de pollo y aguacate', tiempo: '15 min', porciones: 2,
    calorias: 320, carbohidratos: 12, proteina: 28, grasas: 18,
    tags: ['Bajo en carbohidratos'],
    ingredientes: ['200 g de pechuga de pollo cocida y desmenuzada', '1 aguacate maduro en cubos', '2 tazas de espinacas frescas', '1/4 de cebolla morada en rodajas finas', 'Jugo de 1 limón', '1 cucharada de aceite de oliva', 'Sal y pimienta al gusto'],
    instrucciones: ['Coloca las espinacas como base en un tazón grande.', 'Agrega el pollo desmenuzado y el aguacate en cubos.', 'Distribuye la cebolla morada por encima.', 'Mezcla el jugo de limón con el aceite de oliva, sal y pimienta.', 'Vierte el aderezo sobre la ensalada y mezcla suavemente antes de servir.'],
  },
  {
    id: 'r2', nombre: 'Salmón al horno con espárragos', tiempo: '25 min', porciones: 2,
    calorias: 380, carbohidratos: 8, proteina: 34, grasas: 22,
    tags: ['Alto en proteína', 'Bajo en carbohidratos'],
    ingredientes: ['2 filetes de salmón (150 g cada uno)', '1 manojo de espárragos', '2 cucharadas de aceite de oliva', '2 dientes de ajo picados', 'Jugo de 1/2 limón', 'Sal, pimienta y hierbas al gusto'],
    instrucciones: ['Precalienta el horno a 200°C.', 'Coloca el salmón y los espárragos en una bandeja para hornear.', 'Rocía con aceite de oliva, ajo, limón, sal y pimienta.', 'Hornea de 15 a 18 minutos hasta que el salmón esté bien cocido.'],
  },
  {
    id: 'r3', nombre: 'Omelette de claras con espinaca', tiempo: '10 min', porciones: 1,
    calorias: 180, carbohidratos: 5, proteina: 22, grasas: 7,
    tags: ['Bajo en carbohidratos', 'Desayuno'],
    ingredientes: ['4 claras de huevo', '1 taza de espinaca picada', '1/2 taza de champiñones en rodajas', '1 cucharadita de aceite de oliva', 'Sal y pimienta al gusto'],
    instrucciones: ['Calienta el aceite en un sartén antiadherente a fuego medio.', 'Saltea los champiñones y la espinaca hasta que se suavicen.', 'Agrega las claras batidas y cocina moviendo suavemente.', 'Dobla el omelette por la mitad cuando esté cocido y sirve.'],
  },
  {
    id: 'r4', nombre: 'Sopa de lentejas con verduras', tiempo: '35 min', porciones: 4,
    calorias: 210, carbohidratos: 30, proteina: 14, grasas: 4,
    tags: ['Alto en fibra'],
    ingredientes: ['1 taza de lentejas secas', '1 zanahoria picada', '1 tallo de apio picado', '1/2 cebolla picada', '2 dientes de ajo picados', '1.5 litros de caldo de verduras', 'Sal, pimienta y comino al gusto'],
    instrucciones: ['Sofríe la cebolla, el ajo, la zanahoria y el apio unos minutos.', 'Agrega las lentejas y el caldo de verduras.', 'Cocina a fuego medio de 25 a 30 minutos hasta que las lentejas estén suaves.', 'Sazona al gusto y sirve caliente.'],
  },
  {
    id: 'r5', nombre: 'Pavo con ejotes salteados', tiempo: '20 min', porciones: 2,
    calorias: 290, carbohidratos: 10, proteina: 32, grasas: 12,
    tags: ['Alto en proteína'],
    ingredientes: ['2 filetes de pechuga de pavo', '2 tazas de ejotes', '2 dientes de ajo picados', '1 cucharada de aceite de oliva', 'Sal, pimienta y paprika al gusto'],
    instrucciones: ['Sazona el pavo con sal, pimienta y paprika.', 'Cocina el pavo en un sartén con un poco de aceite, de 5 a 6 minutos por lado.', 'En otro sartén, saltea los ejotes con ajo hasta que estén tiernos.', 'Sirve el pavo acompañado de los ejotes.'],
  },
  {
    id: 'r6', nombre: 'Yogur griego con nueces y canela', tiempo: '5 min', porciones: 1,
    calorias: 220, carbohidratos: 14, proteina: 18, grasas: 11,
    tags: ['Snack', 'Bajo en carbohidratos'],
    ingredientes: ['1 taza de yogur griego natural sin azúcar', '1 cucharada de nueces picadas', 'Canela al gusto', 'Unas gotas de esencia de vainilla (opcional)'],
    instrucciones: ['Coloca el yogur en un tazón.', 'Agrega las nueces picadas por encima.', 'Espolvorea canela al gusto y sirve.'],
  },
  {
    id: 'r7', nombre: 'Tacos de lechuga con carne molida', tiempo: '20 min', porciones: 3,
    calorias: 260, carbohidratos: 9, proteina: 26, grasas: 13,
    tags: ['Bajo en carbohidratos'],
    ingredientes: ['300 g de carne molida magra', '8 hojas grandes de lechuga romana', '1 tomate picado', '1/4 de cebolla picada', 'Jugo de 1 limón', 'Comino, ajo en polvo, sal y pimienta'],
    instrucciones: ['Cocina la carne molida con las especias hasta que esté bien dorada.', 'Prepara el pico de gallo mezclando tomate, cebolla y jugo de limón.', 'Sirve la carne sobre las hojas de lechuga y añade el pico de gallo.'],
  },
  {
    id: 'r8', nombre: 'Pudín de chía con frutos rojos', tiempo: '10 min + reposo', porciones: 2,
    calorias: 190, carbohidratos: 16, proteina: 7, grasas: 10,
    tags: ['Desayuno', 'Alto en fibra'],
    ingredientes: ['4 cucharadas de semillas de chía', '1 taza de leche de almendra sin azúcar', '1/2 taza de frutos rojos', 'Esencia de vainilla al gusto'],
    instrucciones: ['Mezcla las semillas de chía con la leche de almendra y la vainilla.', 'Refrigera al menos 3 horas o toda la noche, revolviendo una vez.', 'Sirve frío con los frutos rojos encima.'],
  },
];

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'glucosa', label: 'Glucosa', icon: Droplet },
  { id: 'presion', label: 'Presión', icon: HeartPulse },
  { id: 'medicamentos', label: 'Medicinas', icon: Pill },
  { id: 'citas', label: 'Citas', icon: Stethoscope },
  { id: 'recetas', label: 'Recetas', icon: UtensilsCrossed },
  { id: 'perfil', label: 'Perfil', icon: User },
];

const TAB_TITLES = {
  inicio: 'Hola',
  glucosa: 'Glucosa',
  presion: 'Presión arterial',
  medicamentos: 'Medicamentos',
  citas: 'Citas médicas',
  recetas: 'Recetas',
  perfil: 'Mi perfil',
};

const TAB_STR_KEY = { inicio: 'home', glucosa: 'glucose', presion: 'pressure', medicamentos: 'meds', citas: 'appts', recetas: 'recipes', perfil: 'profile' };

function t(key, lang) {
  return (UI_STRINGS[lang] || UI_STRINGS.es)[key] || key;
}

function getHeaderTitle(tabId, lang) {
  if (tabId === 'inicio') return `${t('greeting', lang)}`;
  return t(TAB_STR_KEY[tabId], lang) || TAB_TITLES[tabId];
}

const STORAGE_KEYS = {
  glucose: 'glucose-readings',
  pressure: 'pressure-readings',
  medications: 'medications-list',
  medicationLog: 'medication-taken-log',
  appointments: 'appointments-list',
  labStudies: 'lab-studies-list',
  favorites: 'recipe-favorites',
  profile: 'user-profile',
  language: 'app-language',
  device: 'linked-device',
  textSize: 'app-text-size',
};

const TEXT_SIZE_SCALE = {
  normal: 'text-base',
  grande: 'text-lg',
  gigante: 'text-xl',
};

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent";

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function pad2(n) {
  return String(n).padStart(2, '0');
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function nowTimeStr() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function formatDateShort(dateStr) {
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}`;
}
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function formatDateLong(dateStr) {
  const parts = dateStr.split('-').map(Number);
  return `${parts[2]} de ${MESES[parts[1] - 1]} de ${parts[0]}`;
}

async function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // almacenamiento no disponible; se ignora en silencio
  }
}

function apptToDates(a) {
  const start = new Date(`${a.fecha}T${a.hora || '09:00'}:00`);
  const end = new Date(start.getTime() + 30 * 60000);
  return { start, end };
}

function toICSDate(d) {
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}00`;
}

function buildApptTitle(a) {
  return a.doctor ? `Cita con ${a.doctor}` : `Cita médica${a.especialidad ? ' · ' + a.especialidad : ''}`;
}

function buildApptDetails(a) {
  const parts = [];
  if (a.especialidad) parts.push(`Especialidad: ${a.especialidad}`);
  if (a.notas) parts.push(a.notas);
  parts.push('Recordatorio creado desde Glucosia.');
  return parts.join('\n');
}

function getGoogleCalendarUrl(a) {
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

function downloadICS(a) {
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

function getGlucoseStatus(value) {
  const v = Number(value);
  if (v < 70) return { label: 'Bajo', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
  if (v <= 140) return { label: 'Normal', color: 'text-teal-600', bg: 'bg-teal-50', dot: 'bg-teal-500', hex: '#059669' };
  if (v <= 200) return { label: 'Elevado', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500', hex: '#d97706' };
  return { label: 'Alto', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
}
function getPressureStatus(sistolica, diastolica) {
  const s = Number(sistolica);
  const d = Number(diastolica);
  if (s >= 180 || d >= 120) return { label: 'Crisis hipertensiva', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
  if (s >= 140 || d >= 90) return { label: 'Hipertensión etapa 2', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500', hex: '#dc2626' };
  if (s >= 130 || d >= 80) return { label: 'Hipertensión etapa 1', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500', hex: '#d97706' };
  if (s >= 120) return { label: 'Elevada', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500', hex: '#d97706' };
  return { label: 'Normal', color: 'text-teal-600', bg: 'bg-teal-50', dot: 'bg-teal-500', hex: '#059669' };
}

// ---------------------------------------------------------------------------
// Componentes compartidos
// ---------------------------------------------------------------------------
function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Icon size={24} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-400 max-w-[220px]">{text}</p>
    </div>
  );
}

function FormLabel({ children }) {
  return <label className="block text-xs font-medium text-slate-500 mb-1.5">{children}</label>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-50 z-30 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="font-bold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
            <X size={16} className="text-slate-500" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg z-40">
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Registro e ingreso
// ---------------------------------------------------------------------------
function WelcomeStep({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-10 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center mb-5 shadow-lg shadow-slate-300">
          <Droplet size={36} className="text-white" fill="white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Glucosia</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-[260px]">Tu compañero diario para llevar el control de tu diabetes, sin complicaciones.</p>
      </div>
      <div className="pb-6">
        <button type="button" onClick={onStart} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3.5 rounded-xl">Regístrate para acceder</button>
        <p className="text-xs text-slate-300 text-center mt-4">Al continuar aceptas nuestros términos y el aviso de privacidad.</p>
      </div>
    </div>
  );
}

function CookiesStep({ onAccept }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-10 flex flex-col overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
          <ShieldCheck size={28} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Tu privacidad importa</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-[280px]">Usamos cookies y almacenamiento local para guardar tus datos de salud en este dispositivo y mejorar tu experiencia dentro de Glucosia.</p>
      </div>
      <div className="pb-6">
        <button type="button" onClick={onAccept} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3.5 rounded-xl">Aceptar todas las cookies</button>
      </div>
    </div>
  );
}

function ProfileFields({ nombre, setNombre, edad, setEdad, telefono, setTelefono, correo, setCorreo, tipoDiabetes, setTipoDiabetes, idioma, setIdioma, esHipertenso, setEsHipertenso, condiciones, setCondiciones, condicionOtro, setCondicionOtro }) {
  function toggleCondicion(id) {
    setCondiciones((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }
  return (
    <div className="space-y-4">
      <div>
        <FormLabel>{t('language', idioma)}</FormLabel>
        <div className="flex flex-wrap gap-2">
          {APP_LANGUAGES.map((l) => (
            <button key={l.id} type="button" onClick={() => setIdioma(l.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border flex items-center gap-1.5 ${idioma === l.id ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              <span>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FormLabel>{t('fullName', idioma)}</FormLabel>
        <input autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} placeholder={t('fullName', idioma)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel>{t('age', idioma)}</FormLabel>
          <input type="number" min="0" max="120" value={edad} onChange={(e) => setEdad(e.target.value)} className={inputClass} placeholder="45" />
        </div>
        <div>
          <FormLabel>{t('phone', idioma)}</FormLabel>
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={inputClass} placeholder="555 123 4567" />
        </div>
      </div>
      <div>
        <FormLabel>{t('email', idioma)}</FormLabel>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className={inputClass} placeholder="correo@ejemplo.com" />
      </div>
      <div>
        <FormLabel>{t('diabetesType', idioma)}</FormLabel>
        <div className="flex flex-wrap gap-2">
          {DIABETES_TYPES.map((tp) => (
            <button key={tp.id} type="button" onClick={() => setTipoDiabetes(tp.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border ${tipoDiabetes === tp.id ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              {tp.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FormLabel>{t('hypertensionQuestion', idioma)}</FormLabel>
        <p className="text-xs text-slate-500 -mt-1 mb-2">{t('hypertensionHint', idioma)}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setEsHipertenso(true)} className={`px-4 py-2 rounded-xl text-sm font-medium border ${esHipertenso === true ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>{t('yes', idioma)}</button>
          <button type="button" onClick={() => setEsHipertenso(false)} className={`px-4 py-2 rounded-xl text-sm font-medium border ${esHipertenso === false ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>{t('no', idioma)}</button>
        </div>
      </div>
      <div>
        <FormLabel>{t('medicalConditions', idioma)}</FormLabel>
        <p className="text-xs text-slate-500 -mt-1 mb-2">{t('medicalConditionsHint', idioma)}</p>
        <div className="flex flex-wrap gap-2">
          {MEDICAL_CONDITIONS.map((c) => (
            <button key={c.id} type="button" onClick={() => toggleCondicion(c.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border ${condiciones.includes(c.id) ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
        {condiciones.includes('otro') && (
          <input value={condicionOtro} onChange={(e) => setCondicionOtro(e.target.value)} className={`${inputClass} mt-2.5`} placeholder="Describe el otro padecimiento" />
        )}
      </div>
    </div>
  );
}

function OnboardingScreen({ onComplete, onLanguageChange }) {
  const [step, setStep] = useState('welcome');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoDiabetes, setTipoDiabetes] = useState(DIABETES_TYPES[0].id);
  const [idioma, setIdioma] = useState('es');
  const [esHipertenso, setEsHipertenso] = useState(false);
  const [condiciones, setCondiciones] = useState([]);
  const [condicionOtro, setCondicionOtro] = useState('');
  const [error, setError] = useState('');

  function handleSetIdioma(id) {
    setIdioma(id);
    if (onLanguageChange) onLanguageChange(id);
  }

  function handleFinish() {
    if (!nombre.trim()) { setError('Escribe tu nombre para continuar.'); return; }
    onComplete({ nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, esHipertenso, condiciones, condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '' });
  }

  if (step === 'welcome') return <WelcomeStep onStart={() => setStep('cookies')} />;
  if (step === 'cookies') return <CookiesStep onAccept={() => setStep('form')} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 font-sans max-w-md mx-auto px-6 py-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-slate-900">{t('createProfile', idioma)}</h1>
      <p className="text-sm text-slate-400 mt-1 mb-6">{t('createProfileSubtitle', idioma)}</p>
      <ProfileFields
        nombre={nombre} setNombre={setNombre}
        edad={edad} setEdad={setEdad}
        telefono={telefono} setTelefono={setTelefono}
        correo={correo} setCorreo={setCorreo}
        tipoDiabetes={tipoDiabetes} setTipoDiabetes={setTipoDiabetes}
        idioma={idioma} setIdioma={handleSetIdioma}
        esHipertenso={esHipertenso} setEsHipertenso={setEsHipertenso}
        condiciones={condiciones} setCondiciones={setCondiciones}
        condicionOtro={condicionOtro} setCondicionOtro={setCondicionOtro}
      />
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      <button type="button" onClick={handleFinish} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3.5 rounded-xl mt-6 mb-8">{t('startUsing', idioma)}</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vista: Glucosa
// ---------------------------------------------------------------------------
function GlucosaView({ glucose, onAdd, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);
  const grouped = {};
  glucose.forEach((g) => {
    if (!grouped[g.fecha]) grouped[g.fecha] = [];
    grouped[g.fecha].push(g);
  });
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      <button onClick={onAdd} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl shadow-sm active:bg-yellow-600">
        <Plus size={18} /> Nueva lectura
      </button>

      {dates.length === 0 ? (
        <EmptyState icon={Droplet} text="Aún no tienes lecturas de glucosa. Agrega la primera para comenzar tu seguimiento." />
      ) : (
        dates.map((date) => (
          <div key={date}>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">{formatDateLong(date)}</p>
            <div className="space-y-2">
              {grouped[date].sort((a, b) => b.hora.localeCompare(a.hora)).map((g) => {
                const status = getGlucoseStatus(g.valor);
                const isOpen = expandedId === g.id;
                return (
                  <div key={g.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <button onClick={() => setExpandedId(isOpen ? null : g.id)} className="w-full flex items-center gap-3 p-3.5">
                      <div className={`w-2 h-10 rounded-full ${status.dot}`} />
                      <div className="flex-1 text-left">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-slate-900 tabular-nums">{g.valor}</span>
                          <span className="text-xs text-slate-500">mg/dL</span>
                        </div>
                        <p className="text-xs text-slate-500">{g.hora} · {GLUCOSE_CONTEXTS.find((c) => c.id === g.contexto)?.label || 'Otro'}</p>
                      </div>
                      {g.imagen && <ImageIcon size={16} className="text-slate-300" />}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 border-t border-slate-50 pt-3">
                        {g.imagen && <img src={g.imagen} alt="Lectura" className="w-full max-h-48 object-cover rounded-xl mb-2" />}
                        {g.notas && <p className="text-sm text-slate-600 mb-2">{g.notas}</p>}
                        <button onClick={() => onDelete(g.id)} className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
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

function GlucoseForm({ onSave, onClose }) {
  const [valor, setValor] = useState('');
  const [fecha, setFecha] = useState(todayISO());
  const [hora, setHora] = useState(nowTimeStr());
  const [contexto, setContexto] = useState('ayunas');
  const [notas, setNotas] = useState('');
  const [imagen, setImagen] = useState(null);
  const [processingImg, setProcessingImg] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function handleImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setProcessingImg(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImagen(reader.result);
      setProcessingImg(false);
    };
    reader.onerror = () => setProcessingImg(false);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!valor || !fecha || !hora) {
      setError('Completa el valor, la fecha y la hora.');
      return;
    }
    onSave({ valor: Number(valor), fecha, hora, contexto, notas, imagen });
  }

  return (
    <Modal title="Nueva lectura de glucosa" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <FormLabel>Glucosa (mg/dL)</FormLabel>
          <input type="number" inputMode="numeric" autoFocus value={valor} onChange={(e) => setValor(e.target.value)} className={inputClass} placeholder="Ej. 110" />
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
          <FormLabel>Foto del glucómetro (opcional)</FormLabel>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
          {imagen ? (
            <div className="relative">
              <img src={imagen} alt="Lectura" className="w-full h-32 object-cover rounded-xl" />
              <button type="button" onClick={() => setImagen(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900 bg-opacity-60 flex items-center justify-center">
                <X size={14} className="text-white" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={processingImg} className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl py-4 text-slate-400 text-sm">
              {processingImg ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              {processingImg ? 'Procesando...' : 'Agregar foto'}
            </button>
          )}
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

// ---------------------------------------------------------------------------
// Vista: Presión arterial
// ---------------------------------------------------------------------------
function PresionView({ pressure, onAdd, onDelete }) {
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

function PressureForm({ onSave, onClose }) {
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

// ---------------------------------------------------------------------------
// Vista: Medicamentos
// ---------------------------------------------------------------------------
function MedicamentosView({ medications, medLog, onAdd, onEdit, onDelete, onToggleDose }) {
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

function MedicationForm({ initial, onSave, onClose }) {
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

// ---------------------------------------------------------------------------
// Vista: Citas médicas
// ---------------------------------------------------------------------------
function AppointmentCard({ a, onEdit, onDelete, past }) {
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
              {a.documentos.map((d) => <img key={d.id} src={d.imagen} alt={d.nombre} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />)}
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

function CitasView({ appointments, onAdd, onEdit, onDelete, onOpenArchive }) {
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

function AppointmentForm({ initial, onSave, onClose }) {
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
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {documentos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto mb-2">
              {documentos.map((d) => (
                <div key={d.id} className="relative flex-shrink-0">
                  <img src={d.imagen} alt={d.nombre} className="w-16 h-16 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeDoc(d.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={processingImg} className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl py-3 text-slate-400 text-sm">
            {processingImg ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {processingImg ? 'Procesando...' : 'Agregar foto de receta o resultado'}
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

function MedicalArchiveModal({ appointments, onClose }) {
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
                          <img key={d.id} src={d.imagen} alt={d.nombre} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
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

function MedicalExportModal({ profile, glucose, pressure, medications, appointments, labStudies, onClose }) {
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

// ---------------------------------------------------------------------------
// Estudios de laboratorio
// ---------------------------------------------------------------------------
function LabStudyForm({ onSave, onClose }) {
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
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          {documentos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto mb-2">
              {documentos.map((d) => (
                <div key={d.id} className="relative flex-shrink-0">
                  <img src={d.imagen} alt={d.nombre} className="w-16 h-16 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeDoc(d.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} disabled={processingImg} className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl py-3 text-slate-400 text-sm">
            {processingImg ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {processingImg ? 'Procesando...' : 'Tomar foto o escanear resultado'}
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

function LabStudyCard({ item, onDelete }) {
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
            <img key={d.id} src={d.imagen} alt={d.nombre} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
          ))}
        </div>
      )}
    </div>
  );
}

function LabStudiesModal({ labStudies, onAdd, onDelete, onClose }) {
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

// ---------------------------------------------------------------------------
// Vista: Recetas
// ---------------------------------------------------------------------------
function RecetasView({ recipes, favorites, onSelect, onToggleFavorite }) {
  const [filter, setFilter] = useState('todas');
  const shown = filter === 'favoritas' ? recipes.filter((r) => favorites.includes(r.id)) : recipes;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setFilter('todas')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${filter === 'todas' ? 'bg-yellow-400 text-slate-900' : 'bg-white text-slate-500 border border-slate-200'}`}>Todas</button>
        <button onClick={() => setFilter('favoritas')} className={`flex-1 py-2 rounded-xl text-sm font-medium ${filter === 'favoritas' ? 'bg-yellow-400 text-slate-900' : 'bg-white text-slate-500 border border-slate-200'}`}>Favoritas</button>
      </div>

      {shown.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} text="Aún no tienes recetas favoritas. Explora el catálogo y guarda las que más te gusten." />
      ) : (
        <div className="space-y-2.5">
          {shown.map((r) => {
            const isFav = favorites.includes(r.id);
            return (
              <button key={r.id} onClick={() => onSelect(r)} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{r.nombre}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.tiempo} · {r.calorias} kcal · {r.carbohidratos} g carbs</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); onToggleFavorite(r.id); }} className="flex-shrink-0">
                  <Star size={18} className={isFav ? 'text-yellow-400' : 'text-slate-200'} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecipeDetail({ recipe, isFavorite, onToggleFavorite, onClose }) {
  return (
    <Modal title={recipe.nombre} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {recipe.tags.map((tag) => <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-50 text-teal-600">{tag}</span>)}
          </div>
          <button type="button" onClick={() => onToggleFavorite()} className="flex-shrink-0">
            <Star size={20} className={isFavorite ? 'text-yellow-400' : 'text-slate-200'} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.calorias}</p>
            <p className="text-[10px] text-slate-400">kcal</p>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.carbohidratos}g</p>
            <p className="text-[10px] text-slate-400">carbs</p>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.proteina}g</p>
            <p className="text-[10px] text-slate-400">proteína</p>
          </div>
          <div className="bg-slate-50 rounded-xl py-2.5">
            <p className="text-sm font-bold text-slate-900">{recipe.grasas}g</p>
            <p className="text-[10px] text-slate-400">grasas</p>
          </div>
        </div>

        <p className="text-xs text-slate-400">{recipe.tiempo} · {recipe.porciones} porciones</p>

        <div>
          <p className="font-semibold text-slate-900 text-sm mb-2">Ingredientes</p>
          <ul className="space-y-1.5">
            {recipe.ingredientes.map((ing, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                {ing}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 text-sm mb-2">Preparación</p>
          <ol className="space-y-2.5">
            {recipe.instrucciones.map((step, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Vista: Perfil
// ---------------------------------------------------------------------------
function ProfileForm({ initial, onSave, onClose, onLanguageChange }) {
  const [nombre, setNombre] = useState(initial?.nombre || '');
  const [edad, setEdad] = useState(initial?.edad || '');
  const [telefono, setTelefono] = useState(initial?.telefono || '');
  const [correo, setCorreo] = useState(initial?.correo || '');
  const [tipoDiabetes, setTipoDiabetes] = useState(initial?.tipoDiabetes || DIABETES_TYPES[0].id);
  const [idioma, setIdioma] = useState(initial?.idioma || 'es');
  const [esHipertenso, setEsHipertenso] = useState(initial?.esHipertenso ?? false);
  const [condiciones, setCondiciones] = useState(initial?.condiciones || []);
  const [condicionOtro, setCondicionOtro] = useState(initial?.condicionOtro || '');
  const [error, setError] = useState('');

  function handleSetIdioma(id) {
    setIdioma(id);
    if (onLanguageChange) onLanguageChange(id);
  }

  function handleSave() {
    if (!nombre.trim()) { setError('Escribe tu nombre para continuar.'); return; }
    onSave({ nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, esHipertenso, condiciones, condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '' });
  }

  return (
    <Modal title={t('editProfileTitle', idioma)} onClose={onClose}>
      <ProfileFields
        nombre={nombre} setNombre={setNombre}
        edad={edad} setEdad={setEdad}
        telefono={telefono} setTelefono={setTelefono}
        correo={correo} setCorreo={setCorreo}
        tipoDiabetes={tipoDiabetes} setTipoDiabetes={setTipoDiabetes}
        idioma={idioma} setIdioma={handleSetIdioma}
        esHipertenso={esHipertenso} setEsHipertenso={setEsHipertenso}
        condiciones={condiciones} setCondiciones={setCondiciones}
        condicionOtro={condicionOtro} setCondicionOtro={setCondicionOtro}
      />
      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      <div className="flex gap-2 mt-5">
        <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-3 rounded-xl">{t('cancel', idioma)}</button>
        <button type="button" onClick={handleSave} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-semibold py-3 rounded-xl">{t('saveChanges', idioma)}</button>
      </div>
    </Modal>
  );
}

function DeleteProfileConfirm({ onConfirm, onClose }) {
  return (
    <Modal title="Eliminar perfil" onClose={onClose}>
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <p className="font-semibold text-slate-900">¿Eliminar tu perfil?</p>
        <p className="text-sm text-slate-500 mt-1.5 max-w-[280px] mx-auto">Se borrarán tus datos personales y volverás a la pantalla de registro. Tus lecturas, medicamentos y citas no se eliminan.</p>
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 bg-slate-50 text-slate-700 font-medium text-sm py-2.5 rounded-xl">Cancelar</button>
          <button type="button" onClick={onConfirm} className="flex-1 bg-red-500 text-white font-medium text-sm py-2.5 rounded-xl">Eliminar</button>
        </div>
      </div>
    </Modal>
  );
}

function PerfilView({ profile, device, language, onEditProfile, onChangeLanguage, onOpenDevice, onDeleteProfile, onExportHistory, onOpenLabStudies }) {
  const diabetesLabel = DIABETES_TYPES.find((tp) => tp.id === profile?.tipoDiabetes)?.label || '—';
  const avatarInitial = (profile?.nombre || '?').trim().charAt(0).toUpperCase();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const condicionesLabels = (profile?.condiciones || [])
    .map((id) => id === 'otro' ? (profile?.condicionOtro || 'Otro') : (MEDICAL_CONDITIONS.find((c) => c.id === id)?.label || id));
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-slate-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">{avatarInitial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900 truncate">{profile?.nombre || 'Sin nombre'}</p>
            <p className="text-xs text-slate-500 mt-0.5">{profile?.edad ? `${profile.edad} años · ` : ''}{diabetesLabel}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Phone size={15} className="text-slate-400 flex-shrink-0" />
            <span>{profile?.telefono || 'Sin teléfono registrado'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <Mail size={15} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">{profile?.correo || 'Sin correo registrado'}</span>
          </div>
        </div>
        {condicionesLabels.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-2">{t('medicalConditions', language)}</p>
            <div className="flex flex-wrap gap-1.5">
              {condicionesLabels.map((label, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-600">{label}</span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2 mt-4">
          <button type="button" onClick={onEditProfile} className="w-full bg-slate-50 text-slate-700 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5">
            <Pencil size={14} /> {t('editInfo', language)}
          </button>
          <button type="button" onClick={() => setShowDeleteConfirm(true)} className="w-full bg-red-50 text-red-500 font-medium text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5">
            <Trash2 size={14} /> {t('deleteProfileBtn', language)}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1.5"><Globe size={13} /> {t('language', language)}</p>
        <div className="flex flex-wrap gap-2">
          {APP_LANGUAGES.map((l) => (
            <button key={l.id} type="button" onClick={() => onChangeLanguage(l.id)} className={`px-3.5 py-2 rounded-xl text-sm font-medium border flex items-center gap-1.5 ${language === l.id ? 'bg-yellow-400 text-slate-900 border-yellow-400' : 'bg-white text-slate-600 border-slate-200'}`}>
              <span>{l.flag}</span>{l.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={onOpenDevice} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <Bluetooth size={17} className="text-slate-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900">{t('device', language)}</p>
          <p className="text-xs text-slate-400">{device ? device.label : 'Sin vincular'}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>

      <button type="button" onClick={onOpenLabStudies} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <TestTube size={17} className="text-slate-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900">{t('labStudies', language)}</p>
          <p className="text-xs text-slate-400">{t('labStudiesSubtitle', language)}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>

      <button type="button" onClick={onExportHistory} className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
          <FileText size={17} className="text-slate-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900">{t('exportHistory', language)}</p>
          <p className="text-xs text-slate-400">{t('exportHistorySubtitle', language)}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </button>

      {showDeleteConfirm && (
        <DeleteProfileConfirm onConfirm={() => { setShowDeleteConfirm(false); onDeleteProfile(); }} onClose={() => setShowDeleteConfirm(false)} />
      )}
    </div>
  );
}

function DevicePairingView({ initial, onSave, onClose }) {
  const [step, setStep] = useState(initial ? 'connected' : 'select');
  const [selectedBrand, setSelectedBrand] = useState(
    initial ? SENSOR_BRANDS.find((b) => b.id === initial.id) || null : null
  );

  function handleSelect(brand) {
    setSelectedBrand(brand);
    setStep('connecting');
    setTimeout(() => {
      const device = { id: brand.id, label: brand.label, maker: brand.maker };
      onSave(device);
      setStep('connected');
    }, 1800);
  }

  function handleUnlink() {
    onSave(null);
    setSelectedBrand(null);
    setStep('select');
  }

  return (
    <Modal title="Sensor de glucosa" onClose={onClose}>
      {step === 'select' && (
        <div>
          <p className="text-sm text-slate-400 mb-1">Elige la marca o tipo de sensor que usas.</p>
          <div className="space-y-2 mt-3">
            {SENSOR_BRANDS.map((b) => (
              <button key={b.id} type="button" onClick={() => handleSelect(b)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200">
                <Bluetooth size={17} className="text-slate-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-900">{b.label}</p>
                  {b.maker && <p className="text-xs text-slate-400">{b.maker}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 'connecting' && (
        <div className="text-center py-8">
          <Loader2 size={32} className="animate-spin text-yellow-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-900">Buscando {selectedBrand?.label}...</p>
          <p className="text-xs text-slate-400 mt-1">Mantén el Bluetooth activado y el sensor cerca.</p>
        </div>
      )}
      {step === 'connected' && (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
            <Check size={26} className="text-teal-600" />
          </div>
          <p className="font-semibold text-slate-900">Dispositivo vinculado</p>
          <p className="text-sm text-slate-400 mt-1">{selectedBrand?.label}{selectedBrand?.maker ? ` · ${selectedBrand.maker}` : ''}</p>
          <p className="text-xs text-slate-400 mt-4 bg-slate-50 rounded-xl p-3 text-left">Por ahora esta vinculación es una simulación. La lectura automática de tu sensor llegará en una futura actualización.</p>
          <button type="button" onClick={handleUnlink} className="w-full bg-red-50 text-red-500 font-medium text-sm py-2.5 rounded-xl mt-4">Desvincular dispositivo</button>
        </div>
      )}
    </Modal>
  );
}

function HelpModal({ onClose }) {
  const faqs = [
    { q: '¿Mis datos están seguros?', a: 'Toda tu información se guarda únicamente en este dispositivo, en el almacenamiento local del navegador. Glucosia no envía tus datos a ningún servidor.' },
    { q: '¿Cómo agrego una lectura de glucosa o presión?', a: 'Ve a la pestaña correspondiente y toca "Nueva lectura". Puedes agregar el valor, la fecha, la hora y el momento del día.' },
    { q: '¿Puedo compartir mis citas con mi calendario?', a: 'Sí. Dentro de cada cita puedes agregarla a Google Calendar o descargar un archivo .ics compatible con la mayoría de calendarios.' },
    { q: '¿Qué pasa si elimino mi perfil?', a: 'Se borran tus datos personales, pero tus lecturas, medicamentos y citas se conservan en este dispositivo.' },
  ];
  return (
    <Modal title="Ayuda" onClose={onClose}>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div key={i}>
            <p className="text-sm font-semibold text-slate-900 flex items-start gap-2">
              <HelpCircle size={15} className="text-yellow-500 flex-shrink-0 mt-0.5" /> {f.q}
            </p>
            <p className="text-sm text-slate-500 mt-1 pl-6">{f.a}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Vista: Inicio
// ---------------------------------------------------------------------------
function InicioView({ glucose, medications, medLog, appointments, onToggleDose, onGoTab }) {
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
              <button key={i} onClick={() => onToggleDose(d.med, d.time)} className="w-full flex items-center gap-3">
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
        <button onClick={() => onGoTab('citas')} className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
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

// ---------------------------------------------------------------------------
// App principal
// ---------------------------------------------------------------------------
export default function ControlDiabetesApp() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [loading, setLoading] = useState(true);
  const [glucose, setGlucose] = useState([]);
  const [pressure, setPressure] = useState([]);
  const [medications, setMedications] = useState([]);
  const [medLog, setMedLog] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labStudies, setLabStudies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState('');

  const [showGlucoseForm, setShowGlucoseForm] = useState(false);
  const [showPressureForm, setShowPressureForm] = useState(false);
  const [showMedForm, setShowMedForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [showApptForm, setShowApptForm] = useState(false);
  const [editingAppt, setEditingAppt] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [profile, setProfile] = useState(null);
  const [language, setLanguage] = useState('es');
  const [device, setDevice] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDevicePairing, setShowDevicePairing] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [showHelp, setShowHelp] = useState(false);
  const [showTextSizeMenu, setShowTextSizeMenu] = useState(false);
  const [showMedicalArchive, setShowMedicalArchive] = useState(false);
  const [showMedicalExport, setShowMedicalExport] = useState(false);
  const [showLabStudies, setShowLabStudies] = useState(false);
  const [showLabStudyForm, setShowLabStudyForm] = useState(false);

  useEffect(() => {
    (async () => {
      const [g, pr, m, ml, a, ls, f, p, lang, dev, ts] = await Promise.all([
        loadKey(STORAGE_KEYS.glucose, []),
        loadKey(STORAGE_KEYS.pressure, []),
        loadKey(STORAGE_KEYS.medications, []),
        loadKey(STORAGE_KEYS.medicationLog, []),
        loadKey(STORAGE_KEYS.appointments, []),
        loadKey(STORAGE_KEYS.labStudies, []),
        loadKey(STORAGE_KEYS.favorites, []),
        loadKey(STORAGE_KEYS.profile, null),
        loadKey(STORAGE_KEYS.language, 'es'),
        loadKey(STORAGE_KEYS.device, null),
        loadKey(STORAGE_KEYS.textSize, 'normal'),
      ]);
      setGlucose(g);
      setPressure(pr);
      setMedications(m);
      setMedLog(ml);
      setAppointments(a);
      setLabStudies(ls);
      setFavorites(f);
      setProfile(p);
      setLanguage(lang);
      setDevice(dev);
      setTextSize(ts);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (activeTab === 'presion' && profile && !profile.esHipertenso) {
      setActiveTab('inicio');
    }
  }, [activeTab, profile]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  async function addGlucoseReading(entry) {
    const updated = [{ ...entry, id: uid() }, ...glucose];
    setGlucose(updated);
    await saveKey(STORAGE_KEYS.glucose, updated);
    setShowGlucoseForm(false);
    showToast('Lectura guardada');
  }
  async function deleteGlucoseReading(id) {
    const updated = glucose.filter((g) => g.id !== id);
    setGlucose(updated);
    await saveKey(STORAGE_KEYS.glucose, updated);
    showToast('Lectura eliminada');
  }

  async function addPressureReading(entry) {
    const updated = [{ ...entry, id: uid() }, ...pressure];
    setPressure(updated);
    await saveKey(STORAGE_KEYS.pressure, updated);
    setShowPressureForm(false);
    showToast('Lectura guardada');
  }
  async function deletePressureReading(id) {
    const updated = pressure.filter((p) => p.id !== id);
    setPressure(updated);
    await saveKey(STORAGE_KEYS.pressure, updated);
    showToast('Lectura eliminada');
  }

  async function saveMedication(med) {
    const updated = med.id ? medications.map((m) => (m.id === med.id ? med : m)) : [...medications, { ...med, id: uid() }];
    setMedications(updated);
    await saveKey(STORAGE_KEYS.medications, updated);
    setShowMedForm(false);
    setEditingMed(null);
    showToast('Medicamento guardado');
  }
  async function deleteMedication(id) {
    const updated = medications.filter((m) => m.id !== id);
    setMedications(updated);
    await saveKey(STORAGE_KEYS.medications, updated);
    showToast('Medicamento eliminado');
  }
  async function toggleDoseTaken(med, time) {
    const date = todayISO();
    const logId = `${med.id}_${date}_${time}`;
    const exists = medLog.find((l) => l.logId === logId);
    let updatedLog, updatedMeds;
    const hasStock = med.existencia !== '' && med.existencia !== undefined && med.existencia !== null;
    if (exists) {
      updatedLog = medLog.filter((l) => l.logId !== logId);
      updatedMeds = hasStock
        ? medications.map((m) => (m.id === med.id ? { ...m, existencia: Number(m.existencia) + 1 } : m))
        : medications;
    } else {
      updatedLog = [...medLog, { logId, medId: med.id, medName: med.nombre, date, time }];
      updatedMeds = hasStock
        ? medications.map((m) => (m.id === med.id ? { ...m, existencia: Math.max(0, Number(m.existencia) - 1) } : m))
        : medications;
    }
    setMedLog(updatedLog);
    setMedications(updatedMeds);
    await saveKey(STORAGE_KEYS.medicationLog, updatedLog);
    await saveKey(STORAGE_KEYS.medications, updatedMeds);
  }

  async function saveAppointment(appt) {
    const updated = appt.id ? appointments.map((a) => (a.id === appt.id ? appt : a)) : [...appointments, { ...appt, id: uid() }];
    setAppointments(updated);
    await saveKey(STORAGE_KEYS.appointments, updated);
    setShowApptForm(false);
    setEditingAppt(null);
    showToast('Cita guardada');
  }
  async function deleteAppointment(id) {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    await saveKey(STORAGE_KEYS.appointments, updated);
    showToast('Cita eliminada');
  }

  async function addLabStudy(entry) {
    const updated = [{ ...entry, id: uid() }, ...labStudies];
    setLabStudies(updated);
    await saveKey(STORAGE_KEYS.labStudies, updated);
    setShowLabStudyForm(false);
    showToast('Estudio guardado');
  }
  async function deleteLabStudy(id) {
    const updated = labStudies.filter((l) => l.id !== id);
    setLabStudies(updated);
    await saveKey(STORAGE_KEYS.labStudies, updated);
    showToast('Estudio eliminado');
  }

  async function toggleFavorite(id) {
    const updated = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(updated);
    await saveKey(STORAGE_KEYS.favorites, updated);
  }

  async function changeLanguage(lang) {
    setLanguage(lang);
    await saveKey(STORAGE_KEYS.language, lang);
  }

  async function saveProfile(p) {
    setProfile(p);
    await saveKey(STORAGE_KEYS.profile, p);
    if (p.idioma) {
      setLanguage(p.idioma);
      await saveKey(STORAGE_KEYS.language, p.idioma);
    }
    setShowProfileForm(false);
    showToast('Perfil actualizado');
  }
  async function deleteProfile() {
    setProfile(null);
    await saveKey(STORAGE_KEYS.profile, null);
    showToast('Perfil eliminado');
  }

  async function saveDevice(d) {
    setDevice(d);
    await saveKey(STORAGE_KEYS.device, d);
    showToast(d ? 'Dispositivo vinculado' : 'Dispositivo desvinculado');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-amber-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!profile) {
    return <OnboardingScreen onComplete={saveProfile} onLanguageChange={changeLanguage} />;
  }

  const firstName = (profile.nombre || '').split(' ')[0];

  return (
    <div className={`min-h-screen bg-slate-50 font-sans max-w-md mx-auto pb-24 ${TEXT_SIZE_SCALE[textSize] || TEXT_SIZE_SCALE.normal}`}>
      <header className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 px-5 pt-6 pb-5 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-300">{activeTab === 'inicio' ? `${t('greeting', language)}, ${firstName}` : t(TAB_STR_KEY[activeTab], language)}</p>
            <h1 className="text-xl font-bold text-white mt-0.5">{getHeaderTitle(activeTab, language)}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button type="button" onClick={() => setShowTextSizeMenu(!showTextSizeMenu)} className="w-9 h-9 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
                <Settings size={16} className="text-white" />
              </button>
              {showTextSizeMenu && (
                <div className="absolute right-0 top-11 bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 w-36 z-20">
                  {Object.keys(TEXT_SIZE_SCALE).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => { setTextSize(size); saveKey(STORAGE_KEYS.textSize, size); setShowTextSizeMenu(false); }}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg capitalize ${textSize === size ? 'bg-yellow-50 text-yellow-700 font-medium' : 'text-slate-600'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={() => setShowHelp(true)} className="w-9 h-9 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
              <HelpCircle size={16} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-5 py-5">
        {activeTab === 'inicio' && <InicioView glucose={glucose} medications={medications} medLog={medLog} appointments={appointments} onToggleDose={toggleDoseTaken} onGoTab={setActiveTab} />}
        {activeTab === 'glucosa' && <GlucosaView glucose={glucose} onAdd={() => setShowGlucoseForm(true)} onDelete={deleteGlucoseReading} />}
        {activeTab === 'presion' && <PresionView pressure={pressure} onAdd={() => setShowPressureForm(true)} onDelete={deletePressureReading} />}
        {activeTab === 'medicamentos' && (
          <MedicamentosView
            medications={medications}
            medLog={medLog}
            onAdd={() => { setEditingMed(null); setShowMedForm(true); }}
            onEdit={(m) => { setEditingMed(m); setShowMedForm(true); }}
            onDelete={deleteMedication}
            onToggleDose={toggleDoseTaken}
          />
        )}
        {activeTab === 'citas' && (
          <CitasView
            appointments={appointments}
            onAdd={() => { setEditingAppt(null); setShowApptForm(true); }}
            onEdit={(a) => { setEditingAppt(a); setShowApptForm(true); }}
            onDelete={deleteAppointment}
            onOpenArchive={() => setShowMedicalArchive(true)}
          />
        )}
        {activeTab === 'recetas' && (
          <RecetasView recipes={RECIPES} favorites={favorites} onSelect={setSelectedRecipe} onToggleFavorite={toggleFavorite} />
        )}
        {activeTab === 'perfil' && (
          <PerfilView
            profile={profile}
            device={device}
            language={language}
            onEditProfile={() => setShowProfileForm(true)}
            onChangeLanguage={changeLanguage}
            onOpenDevice={() => setShowDevicePairing(true)}
            onDeleteProfile={deleteProfile}
            onExportHistory={() => setShowMedicalExport(true)}
            onOpenLabStudies={() => setShowLabStudies(true)}
          />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 border-t border-slate-800 flex z-20">
        {TABS.filter((tab) => tab.id !== 'presion' || profile?.esHipertenso).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex flex-col items-center gap-1 py-2.5 ${active ? 'text-yellow-400' : 'text-slate-400'}`}>
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-xs font-medium">{t(TAB_STR_KEY[tab.id], language)}</span>
            </button>
          );
        })}
      </nav>

      {showGlucoseForm && <GlucoseForm onSave={addGlucoseReading} onClose={() => setShowGlucoseForm(false)} />}
      {showPressureForm && <PressureForm onSave={addPressureReading} onClose={() => setShowPressureForm(false)} />}
      {showMedForm && <MedicationForm initial={editingMed} onSave={saveMedication} onClose={() => { setShowMedForm(false); setEditingMed(null); }} />}
      {showApptForm && <AppointmentForm initial={editingAppt} onSave={saveAppointment} onClose={() => { setShowApptForm(false); setEditingAppt(null); }} />}
      {selectedRecipe && (
        <RecipeDetail recipe={selectedRecipe} isFavorite={favorites.includes(selectedRecipe.id)} onToggleFavorite={() => toggleFavorite(selectedRecipe.id)} onClose={() => setSelectedRecipe(null)} />
      )}
      {showProfileForm && <ProfileForm initial={profile} onSave={saveProfile} onClose={() => setShowProfileForm(false)} onLanguageChange={changeLanguage} />}
      {showDevicePairing && <DevicePairingView initial={device} onSave={saveDevice} onClose={() => setShowDevicePairing(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showMedicalArchive && <MedicalArchiveModal appointments={appointments} onClose={() => setShowMedicalArchive(false)} />}
      {showMedicalExport && <MedicalExportModal profile={profile} glucose={glucose} pressure={pressure} medications={medications} appointments={appointments} labStudies={labStudies} onClose={() => setShowMedicalExport(false)} />}
      {showLabStudies && <LabStudiesModal labStudies={labStudies} onAdd={() => setShowLabStudyForm(true)} onDelete={deleteLabStudy} onClose={() => setShowLabStudies(false)} />}
      {showLabStudyForm && <LabStudyForm onSave={addLabStudy} onClose={() => setShowLabStudyForm(false)} />}

      <Toast message={toast} />
    </div>
  );
}
