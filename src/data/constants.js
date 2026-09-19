import { Home, Droplet, HeartPulse, Pill, Stethoscope, UtensilsCrossed, User } from 'lucide-react';

// ---------------------------------------------------------------------------
// Datos estáticos
// ---------------------------------------------------------------------------
export const GLUCOSE_CONTEXTS = [
  { id: 'ayunas', label: 'En ayunas' },
  { id: 'antes_comida', label: 'Antes de comer' },
  { id: 'despues_comida', label: 'Después de comer' },
  { id: 'antes_dormir', label: 'Antes de dormir' },
  { id: 'otro', label: 'Otro momento' },
];

export const SPECIALTIES = ['Endocrinología', 'Medicina General', 'Nutrición', 'Oftalmología', 'Podología', 'Cardiología', 'Otro'];

export const DIABETES_TYPES = [
  { id: 'tipo1', label: 'Tipo 1' },
  { id: 'tipo2', label: 'Tipo 2' },
  { id: 'gestacional', label: 'Gestacional' },
  { id: 'prediabetes', label: 'Prediabetes' },
  { id: 'otro', label: 'Otro' },
];

export const MEDICAL_CONDITIONS = [
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

export const APP_LANGUAGES = [
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'pt', label: 'Português', flag: '🇧🇷' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'it', label: 'Italiano', flag: '🇮🇹' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { id: 'zh', label: '中文', flag: '🇨🇳' },
];

export const UI_STRINGS = {
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

export const SENSOR_BRANDS = [
  { id: 'freestyle_libre', label: 'FreeStyle Libre', maker: 'Abbott' },
  { id: 'dexcom_g6', label: 'Dexcom G6', maker: 'Dexcom' },
  { id: 'dexcom_g7', label: 'Dexcom G7', maker: 'Dexcom' },
  { id: 'medtronic_guardian', label: 'Guardian Connect', maker: 'Medtronic' },
  { id: 'contour', label: 'Contour Next One', maker: 'Ascensia' },
  { id: 'accu_chek', label: 'Accu-Chek Instant', maker: 'Roche' },
  { id: 'otro_sensor', label: 'Otro dispositivo', maker: '' },
];

export const RECIPES = [
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
  {
    id: 'r9', nombre: 'Pescado a la veracruzana', tiempo: '30 min', porciones: 3,
    calorias: 270, carbohidratos: 11, proteina: 29, grasas: 11,
    tags: ['Bajo en carbohidratos'],
    ingredientes: ['3 filetes de pescado blanco', '2 jitomates picados', '1/4 de cebolla picada', '1 chile güero (opcional)', '1 cucharada de aceitunas picadas', '1 cucharada de aceite de oliva', 'Laurel, sal y pimienta'],
    instrucciones: ['Sella el pescado en aceite y reserva.', 'Sofríe cebolla y jitomate hasta formar una salsa.', 'Agrega aceitunas, laurel y chile; cocina 5 minutos.', 'Regresa el pescado a la salsa y cocina 5 minutos más.'],
  },
  {
    id: 'r10', nombre: 'Avena nocturna con manzana y canela', tiempo: '10 min + reposo', porciones: 1,
    calorias: 230, carbohidratos: 34, proteina: 8, grasas: 5,
    tags: ['Desayuno', 'Alto en fibra'],
    ingredientes: ['1/2 taza de avena en hojuelas', '2/3 taza de leche descremada', '1/2 manzana picada', 'Canela al gusto', 'Sin azúcar añadida'],
    instrucciones: ['Mezcla la avena, la leche y la canela en un frasco.', 'Agrega la manzana picada.', 'Refrigera toda la noche y sirve frío o caliente.'],
  },
  {
    id: 'r11', nombre: 'Ensalada de garbanzo y pepino', tiempo: '15 min', porciones: 2,
    calorias: 250, carbohidratos: 28, proteina: 11, grasas: 9,
    tags: ['Alto en fibra'],
    ingredientes: ['1 taza de garbanzo cocido', '1 pepino en cubos', '1 jitomate en cubos', '1/4 de cebolla morada', 'Jugo de 1 limón', '1 cucharada de aceite de oliva', 'Perejil, sal y pimienta'],
    instrucciones: ['Mezcla el garbanzo, pepino, jitomate y cebolla en un tazón.', 'Aliña con limón, aceite de oliva, sal y pimienta.', 'Espolvorea perejil picado y sirve.'],
  },
  {
    id: 'r12', nombre: 'Pechuga rellena de espinaca y queso panela', tiempo: '30 min', porciones: 2,
    calorias: 310, carbohidratos: 6, proteina: 36, grasas: 15,
    tags: ['Alto en proteína', 'Bajo en carbohidratos'],
    ingredientes: ['2 pechugas de pollo fileteadas', '1 taza de espinaca salteada', '60 g de queso panela en tiras', 'Ajo en polvo, sal y pimienta', '1 cucharada de aceite de oliva'],
    instrucciones: ['Rellena cada pechuga con espinaca y queso panela.', 'Cierra con palillos y sazona por fuera.', 'Sella en sartén con aceite y termina la cocción tapado a fuego medio, 12-15 minutos.'],
  },
  {
    id: 'r13', nombre: 'Camote horneado con canela', tiempo: '40 min', porciones: 2,
    calorias: 160, carbohidratos: 34, proteina: 3, grasas: 1,
    tags: ['Snack', 'Alto en fibra'],
    ingredientes: ['2 camotes medianos', 'Canela al gusto', 'Sin azúcar añadida'],
    instrucciones: ['Precalienta el horno a 200°C.', 'Pica los camotes con un tenedor y hornea 35-40 minutos.', 'Corta por la mitad, espolvorea canela y sirve.'],
  },
  {
    id: 'r14', nombre: 'Crema de calabaza sin nata', tiempo: '25 min', porciones: 4,
    calorias: 140, carbohidratos: 18, proteina: 4, grasas: 5,
    tags: ['Bajo en carbohidratos'],
    ingredientes: ['500 g de calabaza de Castilla', '1/2 cebolla picada', '1 diente de ajo', '3 tazas de caldo de verduras sin sal', 'Un toque de leche descremada', 'Jengibre y pimienta al gusto'],
    instrucciones: ['Sofríe la cebolla y el ajo.', 'Agrega la calabaza y el caldo; cocina 15-18 minutos.', 'Licúa hasta obtener una crema tersa y sirve con un toque de leche.'],
  },
  {
    id: 'r15', nombre: 'Rollitos de pavo y lechuga', tiempo: '10 min', porciones: 2,
    calorias: 200, carbohidratos: 4, proteina: 24, grasas: 9,
    tags: ['Snack', 'Bajo en carbohidratos'],
    ingredientes: ['150 g de pechuga de pavo en rebanadas', 'Hojas grandes de lechuga', '1/2 aguacate', 'Mostaza al gusto', 'Jitomate en rodajas'],
    instrucciones: ['Extiende la lechuga y unta un poco de mostaza.', 'Agrega pavo, aguacate y jitomate.', 'Enrolla como taquito y sirve.'],
  },
  {
    id: 'r16', nombre: 'Arroz integral con verduras salteadas', tiempo: '25 min', porciones: 3,
    calorias: 260, carbohidratos: 40, proteina: 7, grasas: 6,
    tags: ['Alto en fibra'],
    ingredientes: ['1 taza de arroz integral cocido', '1 zanahoria en cubos', '1/2 taza de chícharos', '1/2 taza de ejotes picados', '1 diente de ajo', '1 cucharada de aceite de oliva'],
    instrucciones: ['Saltea el ajo y las verduras en aceite hasta que estén tiernas.', 'Incorpora el arroz integral y mezcla bien.', 'Sazona con sal y pimienta al gusto y sirve caliente.'],
  },
  {
    id: 'r17', nombre: 'Huevos revueltos con nopales', tiempo: '12 min', porciones: 1,
    calorias: 190, carbohidratos: 6, proteina: 15, grasas: 12,
    tags: ['Desayuno', 'Bajo en carbohidratos'],
    ingredientes: ['2 huevos', '1/2 taza de nopal cocido y picado', '1/4 de jitomate picado', '1 cucharadita de aceite', 'Cilantro y chile al gusto'],
    instrucciones: ['Calienta el aceite y saltea el nopal con jitomate.', 'Agrega los huevos batidos y cocina moviendo suavemente.', 'Espolvorea cilantro y sirve.'],
  },
  {
    id: 'r18', nombre: 'Ceviche de pescado con mucho limón', tiempo: '20 min + reposo', porciones: 3,
    calorias: 210, carbohidratos: 10, proteina: 26, grasas: 6,
    tags: ['Bajo en carbohidratos', 'Alto en proteína'],
    ingredientes: ['300 g de pescado blanco fresco en cubos', 'Jugo de 4 limones', '1/2 cebolla picada', '1 jitomate picado', 'Cilantro picado', 'Chile serrano al gusto'],
    instrucciones: ['Marina el pescado en jugo de limón 15-20 minutos hasta que "cueza".', 'Mezcla con cebolla, jitomate, cilantro y chile.', 'Sirve frío, solo o con tostadas horneadas.'],
  },
  {
    id: 'r19', nombre: 'Ensalada de espinaca, nuez y manzana', tiempo: '10 min', porciones: 2,
    calorias: 200, carbohidratos: 16, proteina: 5, grasas: 13,
    tags: ['Bajo en carbohidratos'],
    ingredientes: ['2 tazas de espinaca fresca', '1/2 manzana en cubos', '1 cucharada de nuez picada', '1 cucharada de aceite de oliva', 'Vinagre balsámico al gusto'],
    instrucciones: ['Mezcla la espinaca, manzana y nuez en un tazón.', 'Aliña con aceite de oliva y vinagre balsámico.', 'Sirve de inmediato.'],
  },
  {
    id: 'r20', nombre: 'Quesadillas de nopal con queso panela', tiempo: '15 min', porciones: 2,
    calorias: 240, carbohidratos: 22, proteina: 13, grasas: 11,
    tags: ['Snack'],
    ingredientes: ['4 tortillas de maíz pequeñas', '1 taza de nopal cocido picado', '60 g de queso panela', 'Epazote al gusto'],
    instrucciones: ['Rellena las tortillas con nopal, queso y epazote.', 'Cocina en comal o sartén antiadherente hasta dorar por ambos lados.', 'Sirve con salsa verde casera.'],
  },
  {
    id: 'r21', nombre: 'Sopa de fideo integral con verduras', tiempo: '20 min', porciones: 3,
    calorias: 190, carbohidratos: 29, proteina: 7, grasas: 4,
    tags: ['Alto en fibra'],
    ingredientes: ['1 taza de fideo integral', '1 jitomate', '1 zanahoria en cubos', '1 calabacita en cubos', '3 tazas de caldo de verduras sin sal'],
    instrucciones: ['Licúa el jitomate y cuece en un poco de aceite.', 'Agrega el caldo, la zanahoria y la calabacita; cocina 8 minutos.', 'Incorpora el fideo y cocina 6-8 minutos más.'],
  },
  {
    id: 'r22', nombre: 'Pechuga al limón con brócoli al vapor', tiempo: '20 min', porciones: 2,
    calorias: 240, carbohidratos: 8, proteina: 32, grasas: 8,
    tags: ['Alto en proteína', 'Bajo en carbohidratos'],
    ingredientes: ['2 pechugas de pollo', 'Jugo de 1 limón', '2 dientes de ajo picados', '2 tazas de brócoli', 'Pimienta y sal al gusto'],
    instrucciones: ['Marina el pollo con limón, ajo, sal y pimienta 10 minutos.', 'Cocina a la plancha 6-7 minutos por lado.', 'Cuece el brócoli al vapor y sirve junto al pollo.'],
  },
  {
    id: 'r23', nombre: 'Yogur natural con fresas y semillas de girasol', tiempo: '5 min', porciones: 1,
    calorias: 180, carbohidratos: 15, proteina: 12, grasas: 8,
    tags: ['Snack', 'Desayuno'],
    ingredientes: ['1 taza de yogur natural sin azúcar', '1/2 taza de fresas picadas', '1 cucharada de semillas de girasol'],
    instrucciones: ['Coloca el yogur en un tazón.', 'Agrega las fresas picadas.', 'Espolvorea las semillas de girasol y sirve.'],
  },
  {
    id: 'r24', nombre: 'Berenjena horneada con jitomate y poco queso', tiempo: '35 min', porciones: 3,
    calorias: 170, carbohidratos: 15, proteina: 6, grasas: 9,
    tags: ['Bajo en carbohidratos', 'Alto en fibra'],
    ingredientes: ['1 berenjena grande en rodajas', '1 taza de salsa de jitomate casera sin azúcar', '40 g de queso mozzarella rallado', 'Orégano y ajo al gusto'],
    instrucciones: ['Precalienta el horno a 190°C y coloca las rodajas de berenjena en una charola.', 'Baña con la salsa de jitomate y espolvorea orégano y ajo.', 'Hornea 20 minutos, agrega el queso y hornea 5 minutos más.'],
  },
];

export const TABS = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'glucosa', label: 'Glucosa', icon: Droplet },
  { id: 'presion', label: 'Presión', icon: HeartPulse },
  { id: 'medicamentos', label: 'Medicinas', icon: Pill },
  { id: 'citas', label: 'Citas', icon: Stethoscope },
  { id: 'recetas', label: 'Recetas', icon: UtensilsCrossed },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export const TAB_TITLES = {
  inicio: 'Hola',
  glucosa: 'Glucosa',
  presion: 'Presión arterial',
  medicamentos: 'Medicamentos',
  citas: 'Citas médicas',
  recetas: 'Recetas',
  perfil: 'Mi perfil',
};

export const TAB_STR_KEY = { inicio: 'home', glucosa: 'glucose', presion: 'pressure', medicamentos: 'meds', citas: 'appts', recetas: 'recipes', perfil: 'profile' };

export const STORAGE_KEYS = {
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

export const TEXT_SIZE_SCALE = {
  normal: 'text-base',
  grande: 'text-lg',
  gigante: 'text-xl',
};

export const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent";
