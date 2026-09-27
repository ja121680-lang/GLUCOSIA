from pathlib import Path

path = Path('control-diabetes.jsx')
text = path.read_text(encoding='utf-8')
original = text

def once(old, new, label):
    global text
    if new in text:
        return
    if old not in text:
        raise SystemExit(f'GA patch anchor missing: {label}')
    text = text.replace(old, new, 1)

# 1) Country / region is separate from language.
regions = """
const APP_REGIONS = [
  { id: 'MX', label: 'México' },
  { id: 'US', label: 'Estados Unidos' },
  { id: 'CA', label: 'Canadá' },
  { id: 'ES', label: 'España' },
  { id: 'BR', label: 'Brasil' },
  { id: 'AR', label: 'Argentina' },
  { id: 'CO', label: 'Colombia' },
  { id: 'CL', label: 'Chile' },
  { id: 'PE', label: 'Perú' },
  { id: 'EC', label: 'Ecuador' },
  { id: 'FR', label: 'Francia' },
  { id: 'DE', label: 'Alemania' },
  { id: 'IT', label: 'Italia' },
  { id: 'PT', label: 'Portugal' },
  { id: 'OTHER', label: 'Otro país / región' },
];

"""
once('const UI_STRINGS = {', regions + 'const UI_STRINGS = {', 'APP_REGIONS')

once(
"function ProfileFields({ nombre, setNombre, edad, setEdad, telefono, setTelefono, correo, setCorreo, tipoDiabetes, setTipoDiabetes, idioma, setIdioma, esHipertenso, setEsHipertenso, condiciones, setCondiciones, condicionOtro, setCondicionOtro }) {",
"function ProfileFields({ nombre, setNombre, edad, setEdad, telefono, setTelefono, correo, setCorreo, tipoDiabetes, setTipoDiabetes, idioma, setIdioma, region, setRegion, esHipertenso, setEsHipertenso, condiciones, setCondiciones, condicionOtro, setCondicionOtro }) {",
'ProfileFields signature')

region_block = """      </div>
      <div>
        <FormLabel>País / región</FormLabel>
        <p className=\"text-xs text-slate-500 -mt-1 mb-2\">Se guarda por separado del idioma para adaptar formatos y funciones regionales.</p>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
          {APP_REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>
      <div>
        <FormLabel>{t('fullName', idioma)}</FormLabel>"""
once("""      </div>
      <div>
        <FormLabel>{t('fullName', idioma)}</FormLabel>""", region_block, 'region field')

once("  const [idioma, setIdioma] = useState('es');\n  const [esHipertenso, setEsHipertenso] = useState(false);",
     "  const [idioma, setIdioma] = useState('es');\n  const [region, setRegion] = useState('MX');\n  const [esHipertenso, setEsHipertenso] = useState(false);",
     'onboarding region state')
once("onComplete({ nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, esHipertenso, condiciones, condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '' });",
     "onComplete({ nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, region, esHipertenso, condiciones, condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '' });",
     'onboarding save region')
once("        idioma={idioma} setIdioma={handleSetIdioma}\n        esHipertenso={esHipertenso}",
     "        idioma={idioma} setIdioma={handleSetIdioma}\n        region={region} setRegion={setRegion}\n        esHipertenso={esHipertenso}",
     'onboarding props region')

# Profile edit state/save/props.
once("  const [idioma, setIdioma] = useState(initial?.idioma || 'es');\n  const [esHipertenso, setEsHipertenso] = useState(initial?.esHipertenso ?? false);",
     "  const [idioma, setIdioma] = useState(initial?.idioma || 'es');\n  const [region, setRegion] = useState(initial?.region || 'MX');\n  const [esHipertenso, setEsHipertenso] = useState(initial?.esHipertenso ?? false);",
     'profile region state')
once("onSave({ nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, esHipertenso, condiciones, condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '' });",
     "onSave({ nombre: nombre.trim(), edad, telefono, correo, tipoDiabetes, idioma, region, esHipertenso, condiciones, condicionOtro: condiciones.includes('otro') ? condicionOtro.trim() : '' });",
     'profile save region')
# second occurrence of ProfileFields props is profile editor; first was already replaced above.
anchor = "        idioma={idioma} setIdioma={handleSetIdioma}\n        esHipertenso={esHipertenso}"
if anchor in text:
    text = text.replace(anchor, "        idioma={idioma} setIdioma={handleSetIdioma}\n        region={region} setRegion={setRegion}\n        esHipertenso={esHipertenso}", 1)

# Show region in profile card.
once("""          <div className=\"flex items-center gap-2.5 text-sm text-slate-600\">
            <Mail size={15} className=\"text-slate-400 flex-shrink-0\" />
            <span className=\"truncate\">{profile?.correo || 'Sin correo registrado'}</span>
          </div>""",
"""          <div className=\"flex items-center gap-2.5 text-sm text-slate-600\">
            <Mail size={15} className=\"text-slate-400 flex-shrink-0\" />
            <span className=\"truncate\">{profile?.correo || 'Sin correo registrado'}</span>
          </div>
          <div className=\"flex items-center gap-2.5 text-sm text-slate-600\">
            <MapPin size={15} className=\"text-slate-400 flex-shrink-0\" />
            <span>{APP_REGIONS.find((r) => r.id === profile?.region)?.label || 'Región no registrada'}</span>
          </div>""",
'profile region display')

# Include region in exported report.
once("""            {profile?.correo && <p className=\"text-xs text-slate-600\">{profile.correo}</p>}
            <p className=\"text-xs text-slate-600 mt-1\">Tipo de diabetes: {diabetesLabel}</p>""",
"""            {profile?.correo && <p className=\"text-xs text-slate-600\">{profile.correo}</p>}
            <p className=\"text-xs text-slate-600\">País / región: {APP_REGIONS.find((r) => r.id === profile?.region)?.label || 'No registrado'}</p>
            <p className=\"text-xs text-slate-600 mt-1\">Tipo de diabetes: {diabetesLabel}</p>""",
'report region')

# 2) Replace simulated device pairing with real browser Bluetooth discovery.
once("""  const [selectedBrand, setSelectedBrand] = useState(
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
  }""",
"""  const [selectedBrand, setSelectedBrand] = useState(
    initial ? SENSOR_BRANDS.find((b) => b.id === initial.id) || null : null
  );
  const [pairingError, setPairingError] = useState('');

  async function handleSelect(brand) {
    setSelectedBrand(brand);
    setPairingError('');
    if (!navigator.bluetooth || !navigator.bluetooth.requestDevice) {
      setPairingError('Este navegador no permite buscar dispositivos Bluetooth desde la web. Puedes seguir registrando lecturas manualmente.');
      setStep('select');
      return;
    }
    setStep('connecting');
    try {
      const browserDevice = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      const device = {
        id: brand.id,
        label: browserDevice.name || brand.label,
        maker: brand.maker,
        bluetoothId: browserDevice.id || '',
        discoveredWithWebBluetooth: true,
      };
      onSave(device);
      setStep('connected');
    } catch (err) {
      setStep('select');
      if (err && err.name === 'NotFoundError') {
        setPairingError('No seleccionaste ningún dispositivo. Inténtalo de nuevo cuando estés listo.');
      } else {
        setPairingError('No se pudo completar la búsqueda Bluetooth. Revisa permisos, Bluetooth y compatibilidad del navegador.');
      }
    }
  }""",
'real Web Bluetooth pairing')

once("""          <p className=\"text-sm text-slate-400 mb-1\">Elige la marca o tipo de sensor que usas.</p>
          <div className=\"space-y-2 mt-3\">""",
"""          <p className=\"text-sm text-slate-400 mb-1\">Elige la marca o tipo de sensor que usas. El navegador abrirá su selector Bluetooth para que tú confirmes el dispositivo.</p>
          {pairingError && <p className=\"text-sm text-red-500 bg-red-50 rounded-xl p-3 mt-3\">{pairingError}</p>}
          <div className=\"space-y-2 mt-3\">""",
'pairing error UI')

once("""          <p className=\"text-xs text-slate-400 mt-4 bg-slate-50 rounded-xl p-3 text-left\">Por ahora esta vinculación es una simulación. La lectura automática de tu sensor llegará en una futura actualización.</p>""",
"""          <p className=\"text-xs text-slate-400 mt-4 bg-slate-50 rounded-xl p-3 text-left\">Dispositivo seleccionado mediante Bluetooth del navegador. Glucosia guarda la referencia localmente. La lectura automática de glucosa depende del protocolo compatible de cada modelo; si no está integrado, continúa registrando tus lecturas manualmente.</p>""",
'connected device honesty')

# 3) Slightly improve the welcome brand copy without changing app logic.
once('<h1 className="text-3xl font-bold text-slate-900">Glucosia</h1>', '<h1 className="text-3xl font-bold text-slate-900">GA Glucosia</h1>', 'welcome GA brand')
once('Tu compañero diario para llevar el control de tu diabetes, sin complicaciones.', 'Seguimiento claro de glucosa, medicamentos y citas, con accesibilidad y control de tus datos.', 'welcome premium copy')

if text != original:
    path.write_text(text, encoding='utf-8')
    print('GA Glucosia final patch applied.')
else:
    print('GA Glucosia final patch already applied.')
