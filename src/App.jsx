import { useEffect, useState } from 'react';
import { HelpCircle, Loader2, Settings } from 'lucide-react';
import { Toast } from './components/shared/Toast';
import { SosModal } from './components/shared/SosModal';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { MedicalExportModal } from './components/MedicalExportModal';
import { RECIPES, STORAGE_KEYS, TABS, TAB_STR_KEY, TEXT_SIZE_SCALE } from './data/constants';
import { saveKey, loadKey, todayISO, uid } from './utils/dates';
import { t, getHeaderTitle } from './utils/i18n';
import { InicioView } from './views/InicioView';
import { GlucosaView, GlucoseForm } from './views/GlucosaView';
import { PresionView, PressureForm } from './views/PresionView';
import { MedicamentosView, MedicationForm } from './views/MedicamentosView';
import { CitasView, AppointmentForm, MedicalArchiveModal } from './views/CitasView';
import { RecetasView, RecipeDetail } from './views/RecetasView';
import { PerfilView, ProfileForm, DevicePairingView, HelpModal } from './views/PerfilView';
import { LabStudiesModal, LabStudyForm } from './views/EstudiosView';

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
  const [showSos, setShowSos] = useState(false);

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
        {activeTab === 'inicio' && <InicioView glucose={glucose} medications={medications} medLog={medLog} appointments={appointments} onToggleDose={toggleDoseTaken} onGoTab={setActiveTab} onOpenSos={() => setShowSos(true)} />}
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
      {showSos && <SosModal profile={profile} onClose={() => setShowSos(false)} onGoEditProfile={() => setShowProfileForm(true)} />}

      <Toast message={toast} />
    </div>
  );
}
