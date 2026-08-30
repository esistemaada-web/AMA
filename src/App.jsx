import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Users, ShoppingBag, ArrowLeft, PhoneCall,
  ShieldCheck, Loader2, Mic, MessageSquare,
  Send, X, Sparkles, CheckCircle2, Navigation, Info,
  AlertTriangle, Fingerprint, ScanFace, Lock,
  Star, Ticket, Volume2, Filter, Menu, HelpCircle, Check,
  Activity, Brain, Heart, Moon, Mail, UserPlus, BookOpen, Image, Leaf, ChevronDown
} from 'lucide-react';
// NOTA: logos reemplazados por componentes inline para no depender de archivos externos.
const fotoUsuarioPorDefecto = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%231e3a8a'/><text x='50%' y='50%' fill='white' font-size='14' text-anchor='middle' dy='.3em'>Foto Usuario</text></svg>";

// --- VERSIÓN DE LA APP ---
// Fuente única: se actualiza manualmente aquí cada vez que se publica una
// nueva actualización. Formato solicitado: DÍA(2 dígitos)+MES(2 dígitos)+AÑO(4 dígitos) - HORA:MINUTO
// Ejemplo: "27072026-19:05" = 27 de julio de 2026, 19:05. Se muestra, sin
// ninguna acción asociada, en la esquina superior izquierda de P-01.
const APP_VERSION = "30082026-10:33";

/**
 * APP SÉNIOR - SUITE MÓVIL ACCESIBLE (SIMULADOR DE TELÉFONO)
 * ---------------------------------------------------------
 * Accesibilidad: WCAG 2.2 AAA (Contraste 7:1, Target 64px+)
 * Diseño: Enmarcado en un mockup de teléfono celular para visualización real.
 */

// --- NUEVO COMPONENTE DE LOGO INTEGRADO ---
const AppLogo = ({ className = "w-32" }) => (
  <div className={`flex flex-col items-center justify-center ${className}`}>
    <div className="bg-gradient-to-br from-blue-900 to-emerald-600 p-5 rounded-[30px] shadow-lg border-4 border-white flex items-center justify-center relative overflow-hidden">
      <Heart size={48} className="text-amber-400 absolute animate-pulse opacity-50" />
      <Users size={56} className="text-white relative z-10" />
    </div>
  </div>
);

// --- LOGO DE MARCA VITAlidad (Árbol con raíces) ---

// --- BOTÓN DE SECCIÓN ACORDEÓN (Mi Perfil) ---
// CRÍTICO: definido FUERA del componente App para que React no lo remonte en
// cada render. Si estuviera dentro de RenderPerfil, cada tecla en un input
// causaría una nueva referencia de función, desmontando el acordeón y haciendo
// que el input perdiera el foco (efecto: solo acepta un carácter a la vez).
const SeccionBtn = ({ id, emoji, titulo, seccionAbierta, toggleSeccion, announceMenuOption }) => (
  <button
    type="button"
    onClick={() => toggleSeccion(id)}
    onMouseEnter={() => announceMenuOption(titulo)}
    className={`w-full flex items-center justify-between p-5 rounded-[25px] border-4 font-black text-xl transition-colors active:scale-95 ${seccionAbierta === id ? 'bg-blue-900 border-blue-950 text-white' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}
  >
    <span className="flex items-center gap-3">{emoji} {titulo}</span>
    <ChevronDown size={28} className={`transition-transform duration-200 ${seccionAbierta === id ? 'rotate-180' : ''}`} />
  </button>
);

// --- TARJETA DE OPCIÓN EDITABLE (Configurar el Menú Principal, P-21) ---
// CRÍTICO: definido FUERA del componente App por el mismo motivo que SeccionBtn:
// si se definiera dentro de RenderConfigurarMenu, cada tecla escrita generaría
// una nueva referencia de función y el input perdería el foco.
const OpcionMenuEditable = ({ item, value, isCustom, visible, onToggleVisible, onChangeValue, onSave, onRestore }) => {
  const restantes = 25 - value.length;
  return (
    <div className="p-5 bg-slate-50 rounded-[30px] border-4 border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-black text-slate-500 uppercase tracking-wide">{item.sub}</span>
        <button
          onClick={onToggleVisible}
          role="switch"
          aria-checked={visible}
          className={`w-20 h-11 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 border-2 ${visible ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}
          aria-label={`Mostrar u ocultar ${value}`}
        >
          <div className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-200 ${visible ? 'translate-x-9' : 'translate-x-0'}`}></div>
        </button>
      </div>

      <div>
        <label className="block text-sm font-black text-slate-600 mb-1">Nombre en el menú (máx. 25 caracteres)</label>
        <input
          type="text"
          value={value}
          maxLength={25}
          onChange={(e) => onChangeValue(e.target.value.slice(0, 25))}
          onBlur={onSave}
          className="w-full p-4 text-xl font-black border-4 border-slate-300 rounded-2xl focus:border-blue-900 outline-none bg-white text-slate-900"
          aria-label={`Nombre personalizado para ${item.sub}, máximo 25 caracteres`}
        />
        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
          <span className={`text-sm font-bold ${restantes <= 5 ? 'text-red-600' : 'text-slate-500'}`}>{restantes} caracteres restantes</span>
          {isCustom && (
            <button type="button" onClick={onRestore} className="text-sm font-black text-blue-800 underline active:scale-95">
              🔄 Restaurar nombre original
            </button>
          )}
        </div>
      </div>

      {/* VISTA PREVIA EN VIVO: así se verá el botón en el Panel Principal */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border-2 border-dashed border-slate-300">
        <div className={`${item.bg} p-2 rounded-full shrink-0`}>
          <item.Icon size={22} color="white" />
        </div>
        <div className="text-left overflow-hidden">
          <span className={`block text-sm font-black ${item.text} truncate`}>{value || item.label}</span>
          <span className="block text-[11px] font-bold text-gray-500 truncate">{item.sub}</span>
        </div>
        <span className="ml-auto text-[10px] font-bold text-slate-400 shrink-0">Vista previa</span>
      </div>
    </div>
  );
};

// --- LOGO VAS (antes VES) ---
const BrandLogo = ({ className = "w-40" }) => (
  <div
    className={`${className} aspect-square rounded-full bg-gradient-to-br from-amber-300 to-emerald-700 flex flex-col items-center justify-center mx-auto shadow-md border-2 border-amber-200`}
    style={{ containerType: "inline-size" }}
    role="img"
    aria-label="Logotipo de la marca bes: un árbol dorado con raíces visibles, con el texto Energía y Salud"
  >
    <Leaf className="text-amber-50" style={{ width: "45%", height: "45%" }} strokeWidth={2.2} />
    <span className="text-amber-50 font-black leading-none" style={{ fontSize: "22cqw" }} aria-hidden="true">VES</span>
  </div>
);

// --- LOGO DE LA EMPRESA (Pantalla de Inicio) ---
// Imagen incrustada en base64 para no depender de archivos externos.

// CompanyLogo eliminado: reemplazado por UserPhoto (definido dentro de App,
// usa el estado profilePhoto para mostrar la foto real del usuario).

// --- FUENTE ÚNICA DE OPCIONES DEL MENÚ PRINCIPAL ---
// Usada tanto por el Panel Principal (Dashboard, P-08) como por la pantalla
// "Configurar el Menú Principal" (P-21), para no duplicar la lista de
// opciones en dos sitios distintos. Cada opción define: clave, vista a la
// que navega (o action:'assistant' como caso especial para iAyuda), nombre
// por defecto, subtítulo (NO editable por el usuario), ícono y colores.
const MENU_ITEMS = [
  { key: 'compania',         view: 'compania',             label: 'Buscar Compañía',           sub: 'Centros de mayores',        Icon: Users,         bg: 'bg-blue-900',    hover: 'hover:bg-blue-50',    border: 'border-blue-900',    text: 'text-blue-900',    num: 1,  categoria: 'vitalidad' },
  { key: 'talento',          view: 'mis_talentos_resumen',  label: 'Mis Talentos',              sub: 'Comparte lo que sabes',     Icon: Star,          bg: 'bg-emerald-600', hover: 'hover:bg-emerald-50', border: 'border-emerald-600', text: 'text-emerald-900', num: 2,  categoria: 'vitalidad' },
  { key: 'buzon',            view: 'buzon',                 label: 'Buzón de Mensajes',         sub: 'Avisos e información',      Icon: Mail,          bg: 'bg-amber-500',   hover: 'hover:bg-amber-50',   border: 'border-amber-500',   text: 'text-amber-700',   num: 3,  categoria: 'salud_digital' },
  { key: 'rutas',            view: 'rutas',                 label: 'Ruta Segura',               sub: 'Caminos y avisos',          Icon: MapPin,        bg: 'bg-emerald-700', hover: 'hover:bg-emerald-50', border: 'border-emerald-700', text: 'text-emerald-900', num: 4,  categoria: 'energia' },
  { key: 'comercio',         view: 'comercio',              label: 'Comercios',                 sub: 'Hacer Check-in',            Icon: ShoppingBag,   bg: 'bg-blue-800',    hover: 'hover:bg-blue-50',    border: 'border-blue-800',    text: 'text-blue-900',    num: 5,  categoria: 'energia' },
  { key: 'centro_vitalidad', view: 'centro_vitalidad',      label: 'Centro de Vitalidad',       sub: 'Salud y descanso',          Icon: Heart,         bg: 'bg-rose-500',    hover: 'hover:bg-rose-50',    border: 'border-rose-500',    text: 'text-rose-900',    num: 6,  categoria: 'energia' },
  // NUEVO: Centro de Tratamiento — relación del usuario con un centro de tratamiento externo
  // (fisioterapia, rehabilitación, etc.), sesiones presenciales o a domicilio.
  { key: 'centro_tratamiento', view: 'centro_tratamiento',  label: 'Centro de Tratamiento',     sub: 'Sesiones y progreso',       Icon: Activity,      bg: 'bg-teal-600',    hover: 'hover:bg-teal-50',    border: 'border-teal-600',    text: 'text-teal-900',    num: 7,  categoria: 'energia' },
  { key: 'guia_digital',     view: 'guia_digital',          label: 'Mi Guía Digital',           sub: 'Novedades y Consejos',      Icon: BookOpen,      bg: 'bg-purple-800',  hover: 'hover:bg-purple-50',  border: 'border-purple-800',  text: 'text-purple-900',  num: 8,  categoria: 'salud_digital' },
  { key: 'fotos_videos',     view: 'fotos_videos',          label: 'Fotos y Videos',            sub: 'Familia y recuerdos',       Icon: Image,         bg: 'bg-amber-600',   hover: 'hover:bg-amber-50',   border: 'border-amber-600',   text: 'text-amber-800',   num: 9,  categoria: 'vitalidad' },
  { key: 'cultura',          view: 'cultura',               label: 'Cultura y Ocio',            sub: 'Eventos y museos',          Icon: Ticket,        bg: 'bg-blue-950',    hover: 'hover:bg-blue-50',    border: 'border-blue-950',    text: 'text-blue-950',    num: 10, categoria: 'vitalidad' },
  { key: 'contactos',        view: 'contactos',             label: 'Llamar a Contactos',        sub: 'Familiares y amigos',       Icon: PhoneCall,     bg: 'bg-slate-600',   hover: 'hover:bg-slate-50',   border: 'border-slate-500',   text: 'text-slate-800',   num: 11, categoria: 'vitalidad' },
  { key: 'comentarios',      view: 'comentarios',           label: 'Comentarios y Sugerencias',  sub: 'Escríbenos a VES',          Icon: MessageSquare, bg: 'bg-purple-700',  hover: 'hover:bg-purple-50',  border: 'border-purple-500',  text: 'text-purple-900',  num: 12, categoria: 'salud_digital' },
  // NUEVO: iAyuda ahora vive dentro del Menú Principal (antes estaba en el Menú Rápido / P-26).
  // action:'assistant' indica que no navega a una vista, sino que abre el asistente de voz.
  { key: 'iayuda',           view: null, action: 'assistant', label: 'iAyuda',                  sub: 'Habla con el asistente',    Icon: HelpCircle,    bg: 'bg-amber-400',   hover: 'hover:bg-amber-50',   border: 'border-amber-400',   text: 'text-amber-700',   num: 13, categoria: 'salud_digital' },
  // NUEVO: Demo de la App — recorrido guiado por voz de lo que hace el sistema
  // (Usuario Administrador y Entrar a la App), tipo ayuda pero enfocado al funcionamiento general.
  { key: 'demo_app',         view: 'demo_app',              label: 'Demo de la App',            sub: 'Cómo funciona VES',         Icon: Info,          bg: 'bg-indigo-600',  hover: 'hover:bg-indigo-50',  border: 'border-indigo-600',  text: 'text-indigo-900',  num: 14, categoria: 'salud_digital' },
];

// --- LOS 3 CONTENEDORES DEL ECOSISTEMA VES (P-08) ---
// Agrupan las 14 funcionalidades de MENU_ITEMS por el rol que cumplen en la
// vida del usuario, no por tipo técnico de pantalla. Orden pensado a propósito:
// Vitalidad primero (lo más motivador/social), Energía después, Salud Digital
// al final — refuerza que VES es ante todo una app social, no "una app técnica".
const CONTENEDORES = [
  { id: 'vitalidad',     titulo: 'Vitalidad',     frase: 'Para no estar solo: personas, lazos y salidas',        emoji: '💗', headerBg: 'bg-rose-50',    headerBorder: 'border-rose-300',    headerText: 'text-rose-900',   activeBg: 'bg-rose-600',    activeBorder: 'border-rose-800' },
  { id: 'energia',       titulo: 'Energía',       frase: 'Para moverte con seguridad, dentro y fuera de casa',   emoji: '🟠', headerBg: 'bg-amber-50',   headerBorder: 'border-amber-300',   headerText: 'text-amber-900',  activeBg: 'bg-amber-500',   activeBorder: 'border-amber-700' },
  { id: 'salud_digital', titulo: 'Salud Digital', frase: 'La tecnología, ya explicada y lista para ti',          emoji: '🔵', headerBg: 'bg-blue-50',    headerBorder: 'border-blue-300',    headerText: 'text-blue-900',   activeBg: 'bg-blue-700',    activeBorder: 'border-blue-900' },
];

const App = () => {
  // --- ESTADOS DE NAVEGACIÓN ---
  const [step, setStep] = useState('inicio');
  const [currentView, setCurrentView] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [aiSelectedTopic, setAiSelectedTopic] = useState('Todos los temas'); // Estado para almacenar el tema seleccionado en Modo IA

  // --- ESTADOS DE FUNCIONALIDAD ---
  const [isValidating, setIsValidating] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [origen, setOrigen] = useState('Plaza de España');
  const [destino, setDestino] = useState('Parque García Sanabria');
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isListeningOrigen, setIsListeningOrigen] = useState(false);
  const [isListeningDestino, setIsListeningDestino] = useState(false);
  const [isListeningName, setIsListeningName] = useState(false);
  const [isListeningFilter, setIsListeningFilter] = useState(false);
  const [callingContact, setCallingContact] = useState(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isWhereAmIOpen, setIsWhereAmIOpen] = useState(false);
  const [whereAmIInfo, setWhereAmIInfo] = useState({ titulo: '', texto: '' });
  const [quickMenuBackAction, setQuickMenuBackAction] = useState(() => () => {});
  const [enteredFromMenu, setEnteredFromMenu] = useState(false); // Memoria de procedencia para botón volver

  // --- ESTADOS DE NUEVAS PREFERENCIAS ---
  const [prefVision, setPrefVision] = useState(false);
  const [prefOido, setPrefOido] = useState(false);
  const [prefVoz, setPrefVoz] = useState(false);
  const [ordenAccesoPreferido, setOrdenAccesoPreferido] = useState('biometrico'); // 'biometrico' o 'escrito'
  // --- NUEVA VARIABLE: SEGUNDOS PARA LLAMADA AUTOMÁTICA (configurable en Datos Usuario) ---
  const [segundosLlamadaAutomatica, setSegundosLlamadaAutomatica] = useState(10);
  // --- MODAL "PEDIR AYUDA" (P-33) COMPARTIDO ENTRE P-02 (Login) Y P-08 (Panel Principal) ---
  // Vive a nivel de App (y no dentro de RenderDashboard) para que el mismo botón/modal
  // pueda activarse también desde la pantalla de Login, sin duplicar código.
  const [showPedirAyudaModal, setShowPedirAyudaModal] = useState(false);
  const [segundosRestantesAyuda, setSegundosRestantesAyuda] = useState(10);
  // --- NUEVA CONTRASEÑA EXCLUSIVA PARA ENTRAR A PERFIL ---
  const [perfilPassword, setPerfilPassword] = useState('1234');
  const [isPerfilPasswordOpen, setIsPerfilPasswordOpen] = useState(false);
  const [origenPerfil, setOrigenPerfil] = useState('inicio');
  const [perfilPasswordInput, setPerfilPasswordInput] = useState('');
  const [perfilNombreInput, setPerfilNombreInput] = useState('');
  const [perfilPasswordError, setPerfilPasswordError] = useState(false);
  // --- VISIBILIDAD DE OPCIONES DEL PANEL PRINCIPAL (Configurar el Menú Principal) ---
  const [menuVisible, setMenuVisible] = useState({
    compania: true,
    rutas: true,
    comercio: true,
    talento: true,
    centro_vitalidad: true,
    cultura: true,
    guia_digital: true,
    buzon: true,
    contactos: true,
    fotos_videos: true,
    comentarios: true,
    iayuda: true,
    centro_tratamiento: true,
    demo_app: true,
  });
  // Número de opciones por fila en P-08 (1, 2 o 3). Por defecto 3.
  const [colsMenuPrincipal, setColsMenuPrincipal] = useState(3);
  // --- NOMBRES PERSONALIZADOS DE LAS OPCIONES DEL MENÚ PRINCIPAL (P-21) ---
  // Solo se guarda la clave si el usuario cambió el nombre por defecto (máx. 25 caracteres).
  // Los subtítulos NO son editables y siempre vienen de MENU_ITEMS.
  const [nombresMenuPersonalizados, setNombresMenuPersonalizados] = useState({});
  // Aviso "cambios sin guardar" y confirmación antes de restaurar un nombre (P-21).
  // Viven a nivel de App (no dentro de RenderConfigurarMenu) porque esa pantalla
  // ahora se invoca como función simple (no como <Componente/>), y los Hooks solo
  // pueden vivir en un componente real, no en una función normal llamada condicionalmente.
  const [hayCambiosSinGuardarMenu, setHayCambiosSinGuardarMenu] = useState(false);
  const [confirmarRestaurarKey, setConfirmarRestaurarKey] = useState(null);
  // Qué contenedor (Vitalidad/Energía/Salud Digital) está desplegado en P-21,
  // mismo mecanismo de acordeón que en P-08. Vive a nivel de App porque
  // RenderConfigurarMenu se invoca como función simple, no como componente.
  const [contenedorAbiertoConfig, setContenedorAbiertoConfig] = useState(CONTENEDORES[0]?.id || null);
  // Qué contenedor (Vitalidad/Energía/Salud Digital) se está viendo en la
  // pantalla de detalle (P-35), a la que P-08 navega al tocar un contenedor.
  const [categoriaAbiertaId, setCategoriaAbiertaId] = useState(null);
  // --- VISIBILIDAD DE MÉTODOS DE ENTRADA ---
  const [entradaVisible, setEntradaVisible] = useState({
    rostro: true, huella: true, voz: true, usuario: true, certificado: true,
    escrito: true, sistema_operativo: false,
  });
  // --- CONTACTOS INCLUIDOS EN MENSAJES MASIVOS ---
  const [mensajesMasivosVisible, setMensajesMasivosVisible] = useState({
    contact1: true, contact2: true, contact3: true,
  });

  // --- ESTADOS DE MODOS DE ASISTENCIA REESTRUCTURADOS ---
  const [valorVista, setValorVista] = useState(10);
  const [dispositivoVista, setDispositivoVista] = useState(false);
  const [valorOido, setValorOido] = useState(10);
  const [dispositivoOido, setDispositivoOido] = useState(false);
  const [valorHablar, setValorHablar] = useState(10);
  const [dispositivoHablar, setDispositivoHablar] = useState(false);
  const [valorEscritura, setValorEscritura] = useState(10);
  const [dispositivoEscritura, setDispositivoEscritura] = useState(false);

  // --- ESTADOS PARA LA NUEVA SECCIÓN DE TALENTOS (Modificado para selección múltiple) ---
  const [selectedTalents, setSelectedTalents] = useState(['Habilidades Manuales']);
  const [customExplanation, setCustomExplanation] = useState('');
  const [isListeningExplanation, setIsListeningExplanation] = useState(false);

  // --- ESTADOS PARA EL NUEVO PERFIL COMPLETO FORMULARIO ---
  const [profilePhoto, setProfilePhoto] = useState(fotoUsuarioPorDefecto);
  const [profileNombre, setProfileNombre] = useState('');
  const [profileApellido, setProfileApellido] = useState('');
  const [profileDireccion, setProfileDireccion] = useState('Calle Castillo, 15');
  const [profileZonaPostal, setProfileZonaPostal] = useState('38002');
  const [profileCorreo, setProfileCorreo] = useState('manuel.rodriguez@correo.com');
  const [profileTelefono, setProfileTelefono] = useState('600123456');
  const [profileFechaNac, setProfileFechaNac] = useState('1952-08-25');
  const [profileNacionalidad, setProfileNacionalidad] = useState('Española');
  const [profileIdioma, setProfileIdioma] = useState('Español');
  const [profileGenero, setProfileGenero] = useState('Masculino');
  const [profileNombreIA, setProfileNombreIA] = useState('Chichita');
  const [profileLlamarIA, setProfileLlamarIA] = useState('Don Manuel');

  // NUEVOS ESTADOS AÑADIDOS PARA UBICACIÓN E IA
  const [profilePais, setProfilePais] = useState('España');
  const [profileProvincia, setProfileProvincia] = useState('Santa Cruz de Tenerife');
  const [profileCiudad, setProfileCiudad] = useState('Santa Cruz');
  const [profileVozIA, setProfileVozIA] = useState('Por defecto');
  const [profileInvitadoNombre, setProfileInvitadoNombre] = useState('');
  const [profileInvitadoClave, setProfileInvitadoClave] = useState('');

  // --- ESTADOS DE NUEVOS CONTACTOS DE EMERGENCIA MODIFICABLES ---
  const [contact1Name, setContact1Name] = useState('112 (URGENCIA)');
  const [contact1Phone, setContact1Phone] = useState('112');
  const [contact2Name, setContact2Name] = useState('HIJO (CARLOS)');
  const [contact2Phone, setContact2Phone] = useState('600000000');
  const [contact3Name, setContact3Name] = useState('HIJA (ANA)');
  const [contact3Phone, setContact3Phone] = useState('600000001');
  const [isEditingEmergencia, setIsEditingEmergencia] = useState(false);
  // Configuración de qué se activa al pulsar "Pedir Ayuda"
  const [emergencia112Activa, setEmergencia112Activa] = useState(true);
  const [emergenciaMasivosActiva, setEmergenciaMasivosActiva] = useState(true);
  // Contactos habilitados para mostrarse en la pantalla de emergencia (máx. 2)
  const [emergenciaContacto2Activo, setEmergenciaContacto2Activo] = useState(true);
  const [emergenciaContacto3Activo, setEmergenciaContacto3Activo] = useState(true);

  // --- ESTADOS CENTRO DE VITALIDAD (MEDICIÓN COGNITIVA) ---
  const [valProcesamiento, setValProcesamiento] = useState(5);
  const [valTrabajo, setValTrabajo] = useState(5);
  const [valMultitarea, setValMultitarea] = useState(5);
  const [valEpisodica, setValEpisodica] = useState(5);
  const [valLenguaje, setValLenguaje] = useState(5);
  const [valSemantica, setValSemantica] = useState(5);
  const [valResolucion, setValResolucion] = useState(5);

  // --- ACCESIBILIDAD: declarar el idioma del documento (WCAG 3.1.1) ---
  // Toda la app está en español; se fija aquí en vez de depender del HTML raíz
  // (que no forma parte de este archivo), para que lectores de pantalla y el
  // traductor del navegador sepan siempre en qué idioma leer el contenido.
  useEffect(() => {
    document.documentElement.lang = 'es';
  }, []);

  // Limpiar filtro al cambiar de pantalla
  useEffect(() => {
    setActiveFilter('Todos');
  }, [currentView]);

  // Sincronizar nombre de usuario con el perfil
  useEffect(() => {
    if (username && !profileNombre) {
      setProfileNombre(username);
    }
  }, [username]);

  // --- CONTEO REGRESIVO DEL MODAL "PEDIR AYUDA" (P-33) ---
  // Al abrirse, inicia una cuenta regresiva con el tiempo configurado en
  // "Segundos para Llamada Automática" (P-10, Configurar Emergencia). Si el
  // usuario no elige ninguna opción antes de llegar a 0, se ejecuta
  // automáticamente la acción principal (Llamar al 112, o si no está activa,
  // Mensajes Masivos). Aviso por voz en los últimos 3 segundos y vibración
  // (si el dispositivo la soporta) en el último segundo.
  //
  // NOTA DE ACCESIBILIDAD (WCAG 2.2.1 "Timing Adjustable"): este límite de
  // tiempo NO se puede pausar ni extender desde el usuario (se retiró
  // intencionalmente el botón "Necesito más tiempo" a pedido del cliente).
  // Se documenta como EXCEPCIÓN JUSTIFICADA: el criterio de éxito exime los
  // límites de tiempo que forman parte de una "actividad en tiempo real"
  // esencial donde el tiempo es un componente necesario del evento (en este
  // caso, activar ayuda de emergencia sin demora si la persona no puede
  // interactuar). El tiempo en sí es configurable de antemano por el usuario
  // en P-10, lo cual atenúa parcialmente el requisito. Se recomienda revisar
  // esta decisión en una auditoría formal de accesibilidad.
  useEffect(() => {
    if (!showPedirAyudaModal) return;
    const totalSegundos = Math.max(segundosLlamadaAutomatica || 10, 1);
    setSegundosRestantesAyuda(totalSegundos);
    // Contador local: evita el doble disparo del updater de estado en StrictMode,
    // para que la campana suene exactamente una vez por cada número del contador.
    let quedan = totalSegundos;
    const intervalId = setInterval(() => {
      quedan -= 1;
      if (quedan > 0) {
        playCampana(); // una campana por cada segundo que baja el contador
        if (quedan <= 3) speak(String(quedan));
        if (quedan === 1 && 'vibrate' in navigator) navigator.vibrate(400);
        setSegundosRestantesAyuda(quedan);
      } else {
        clearInterval(intervalId);
        setSegundosRestantesAyuda(0);
        setShowPedirAyudaModal(false);
        if (emergencia112Activa) {
          setCallingContact({ name: '112 (URGENCIA)', phone: '112' });
        } else if (emergenciaMasivosActiva) {
          const destinatarios = [
            mensajesMasivosVisible.contact1 && contact1Name,
            mensajesMasivosVisible.contact2 && contact2Name,
            mensajesMasivosVisible.contact3 && contact3Name,
          ].filter(Boolean);
          speak(`Enviando mensaje a ${destinatarios.join(', ')}, y llamando a Urgencias.`);
          setCallingContact({ name: contact1Name, phone: contact1Phone });
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [showPedirAyudaModal, segundosLlamadaAutomatica]);

  // --- DATOS DE PRUEBA ---
  const centrosMayores = [
    { id: 1, nombre: "Centro de Mayores de Ofra", direccion: "Calle Elías Ramos González, Ofra", detalle: "Talleres de memoria hoy a las 17:00", zona: "Barrios" },
    { id: 2, nombre: "Asociación San Gerardo", direccion: "Calle Castillo, Centro", detalle: "Baile social los domingos", zona: "Centro" }
  ];

  const rutasSeguras = [
    { id: 1, nombre: "Paseo Plaza de España", direccion: "Zona Llana (Sin adoquines)", bancos: "8 bancos con sombra", zona: "Centro" },
    { id: 2, nombre: "Rambla de Santa Cruz", direccion: "Tramo Central Adaptado", bancos: "15 bancos disponibles", zona: "Centro" },
    { id: 3, font: "bold", nombre: "Parque La Granja", direccion: "Senderos amplios de tierra batida", bancos: "Bancos cada 50 metros", zona: "Barrios" }
  ];

  const comerciosLocales = [
    { id: 1, nombre: "Recova de África", direccion: "Av. de San Sebastián", tipo: "Frutas y Verduras", zona: "Centro" },
    { id: 2, nombre: "Dulcería El Castillo", direccion: "Calle Castillo", tipo: "Cafetería Accesible", zona: "Centro" },
    { id: 3, nombre: "Farmacia Los Gladiolos", direccion: "Av. de Venezuela", tipo: "Farmacia con acceso llano", zona: "Barrios" }
  ];

  const talentoSeniors = [
    { id: 1, nombre: "Taller de Costura Tradicional", direccion: "Asociación San Gerardo", detalle: "Enseña y comparte tus habilidades con el grupo.", zona: "Centro" },
    { id: 2, nombre: "Ajedrez al aire libre", direccion: "Plaza del Príncipe", detalle: "Partidas amistosas y clases para todos los niveles.", zona: "Centro" },
    { id: 3, font: "bold", nombre: "Huerto Urbano", direccion: "Barrio de la Salud", detalle: "Cultivo de hortalizas y plantas medicinales.", zona: "Barrios" }
  ];

  const culturaOcio = [
    { id: 1, nombre: "Museo de Bellas Artes", direccion: "Calle José Murphy", detalle: "Entrada gratuita y acceso con rampas.", zona: "Centro" },
    { id: 2, nombre: "Teatro Guimerá", direccion: "Plaza Isla de la Madera", detalle: "Obra de teatro con buena acústica and accesibilidad.", zona: "Centro" },
    { id: 3, font: "bold", nombre: "Centro Ciudadano", direccion: "García Escámez", detalle: "Exposición de fotografías antiguas de la ciudad.", zona: "Barrios" }
  ];

  // --- GESTOR DE DIRECCIONAMIENTO TRAS BOTÓN VOLVER ---
  // --- UTILIDAD ÚNICA DE VOZ ---
  const speak = (text, rate = 0.9) => {
    if (!('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
    return true;
  };

  // --- ABRE EL PANEL "¿DÓNDE ESTOY?" Y LO ANUNCIA POR VOZ ---
  const openWhereAmI = (titulo, texto) => {
    setWhereAmIInfo({ titulo, texto });
    setIsWhereAmIOpen(true);
    speak(`${titulo}. ${texto}`);
  };

  const handleBackNavigation = () => {
    if (enteredFromMenu) {
      setCurrentView('dashboard');
      setIsMenuOpen(true);
    } else {
      setCurrentView('dashboard');
    }
  };

  // --- FUNCIÓN SEGURA PARA SALIR DE LA APP ---
  const handleOpenExitModal = () => {
    setIsMenuOpen(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('¿Seguro que quieres salir?');
      utterance.lang = 'es-MX';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    setIsExitModalOpen(true);
  };

  // --- ACCESO PROTEGIDO A PERFIL (requiere contraseña exclusiva) ---
  const requestPerfilAccess = () => {
    setOrigenPerfil(step);
    setPerfilPasswordInput('');
    setPerfilNombreInput('');
    setPerfilPasswordError(false);
    setIsPerfilPasswordOpen(true);
  };
  const handleValidatePerfilPassword = (e) => {
    e.preventDefault();
    // Solo verifica que los campos no estén en blanco — sin validar credenciales
    if (perfilNombreInput.trim() && perfilPasswordInput.trim()) {
      setIsPerfilPasswordOpen(false);
      setStep('dashboard');
      setIsMenuOpen(true);
    } else {
      setPerfilPasswordError(true);
    }
  };

  // --- LÓGICA DE ACCESO ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setStep('access_code');
    }
  };

  const startBiometric = (type) => {
    setBiometricType(type);
    setStep('biometric_scan');
    setTimeout(() => {
      const name = profileNombre || username || "Amigo";
      setUsername(name);
      setProfileNombre(name);
      setStep('dashboard');
      setCurrentView('dashboard');
    }, 3000);
  };

  const simulateCheckIn = (item) => {
    setSelectedItem(item);
    setShowSuccess(true);
  };

  const handleVoiceCommand = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      // Navegación inteligente al tema seleccionado tras usar el modo IA
      if (aiSelectedTopic === 'Buscar Compañía') {
        setCurrentView('compania');
      } else if (aiSelectedTopic === 'Ruta Segura') {
        setCurrentView('rutas');
      } else if (aiSelectedTopic === 'Comercio') {
        setCurrentView('comercio');
      } else if (aiSelectedTopic === 'Mi talento') {
        setCurrentView('talento');
      } else if (aiSelectedTopic === 'Centro de Vitalidad') {
        setCurrentView('centro_vitalidad');
      } else if (aiSelectedTopic === 'Cultura y ocio') {
        setCurrentView('cultura');
      } else {
        setCurrentView('rutas');
      }
      setEnteredFromMenu(false);
      setIsAssistantOpen(false);
    }, 2500);
  };

  const readInstructions = (title, data) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `Estás en la sección ${title}. Aquí tienes las opciones disponibles en pantalla. ${data.map(d =>
        `${d.nombre}, ubicado en ${d.direccion}. ${d.detalle || ''}`
      ).join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-MX';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Lo siento, este dispositivo no soporta la lectura de voz.");
    }
  };

  const handleVoiceInputRoute = (field) => {
    if (field === 'origen') {
      setIsListeningOrigen(true);
      setTimeout(() => {
        setOrigen('Plaza Weyler');
        setIsListeningOrigen(false);
      }, 2500);
    } else {
      setIsListeningDestino(true);
      setTimeout(() => {
        setDestino('Mercado de África');
        setIsListeningDestino(false);
      }, 2500);
    }
  };

  const handleVoiceInputName = () => {
    setIsListeningName(true);
    setTimeout(() => {
      setUsername('Juan Pérez');
      setProfileNombre('Juan Pérez');
      setIsListeningName(false);
    }, 2500);
  };

  const handleVoiceInputFilter = () => {
    setIsListeningFilter(true);
    setTimeout(() => {
      setActiveFilter('Centro');
      setIsListeningFilter(false);
      setIsFilterModalOpen(false);
    }, 2500);
  };

  const handleVoiceInputExplanation = () => {
    setIsListeningExplanation(true);
    setTimeout(() => {
      setCustomExplanation('Me gustaría enseñar a los jóvenes cómo sembrar papas y cuidar plantas del huerto.');
      setIsListeningExplanation(false);
    }, 2500);
  };

  // --- RETROALIMENTACIÓN AL PASAR EL MOUSE SOBRE OPCIONES DE MENÚ (Pantalla 2) ---
  // Produce un tono breve y anuncia por voz el nombre de la opción señalada.
  const announceMenuOption = (texto) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 600;
      gainNode.gain.value = 0.06;
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.08);
    } catch (e) { /* el navegador no soporta audio, se omite el tono */ }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'es-MX';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- CAMPANA DE ALERTA (P-33 "Pedir Ayuda") ---
  // Un único tañido de campana sintetizado con Web Audio: fundamental + parciales
  // inarmónicos y decaimiento exponencial. Suena a la vez que aparece el triángulo.
  const playCampana = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);
      const parciales = [
        { f: 680, g: 0.5 },
        { f: 680 * 2.76, g: 0.26 },
        { f: 680 * 5.4, g: 0.12 },
      ];
      parciales.forEach(({ f, g }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(g, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 1.8);
      });
      setTimeout(() => { try { ctx.close(); } catch (e) { /* ya cerrado */ } }, 2100);
    } catch (e) { /* el navegador no soporta Web Audio: se omite la campana */ }
  };

  // --- TIMBRE DE TELÉFONO ANTIGUO (pantalla "Llamando a...") ---
  // Repique de campana mecánica: dos tonos metálicos con modulación rápida de
  // amplitud, en patrón de doble timbre que se repite cada 3 s. Devuelve una
  // función para detenerlo (se usa al colgar / cerrar la pantalla de llamada).
  const playTimbreTelefono = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const master = ctx.createGain();
      master.gain.value = 0.16;
      master.connect(ctx.destination);
      let detenido = false;
      const timers = [];

      const repique = (startAt, dur) => {
        const oscA = ctx.createOscillator();
        const oscB = ctx.createOscillator();
        const g = ctx.createGain();
        oscA.type = 'square';
        oscB.type = 'square';
        oscA.frequency.value = 1040;
        oscB.frequency.value = 1300;
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 46;
        lfoGain.gain.value = 0.45;
        g.gain.value = 0.5;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        oscA.connect(g);
        oscB.connect(g);
        g.connect(master);
        oscA.start(startAt); oscB.start(startAt); lfo.start(startAt);
        oscA.stop(startAt + dur); oscB.stop(startAt + dur); lfo.stop(startAt + dur);
      };

      const ciclo = () => {
        if (detenido) return;
        const t = ctx.currentTime;
        repique(t, 0.4);
        repique(t + 0.6, 0.4);
        timers.push(setTimeout(ciclo, 3000));
      };
      ciclo();

      return () => {
        detenido = true;
        timers.forEach(clearTimeout);
        try { master.gain.setValueAtTime(0.0001, ctx.currentTime); } catch (e) { /* noop */ }
        setTimeout(() => { try { ctx.close(); } catch (e) { /* ya cerrado */ } }, 120);
      };
    } catch (e) {
      return () => {};
    }
  };

  // Campana al abrir el modal "Pedir Ayuda" (P-33), sincronizada con el triángulo.
  // El ref evita un doble tañido por el doble montaje de efectos de React StrictMode
  // en modo desarrollo; suena una sola vez por cada apertura del modal.
  const campanaSonadaRef = useRef(false);
  useEffect(() => {
    if (showPedirAyudaModal) {
      if (!campanaSonadaRef.current) { playCampana(); campanaSonadaRef.current = true; }
    } else {
      campanaSonadaRef.current = false;
    }
  }, [showPedirAyudaModal]);

  // Timbre de teléfono antiguo mientras está abierta la pantalla "Llamando a...".
  useEffect(() => {
    if (!callingContact) return;
    const detenerTimbre = playTimbreTelefono();
    return detenerTimbre;
  }, [callingContact]);

  // --- EXPLICACIONES POR PANTALLA PARA "¿DÓNDE ESTOY?" ---
  const explicacionesPantallas = {
    mode_selection: { titulo: "Selección de Modo", texto: "Estás en la pantalla principal. Aquí puedes elegir Modo Pantalla para ver botones grandes y mapas, o Buzón de Mensajes para ver tus avisos." },
    dashboard: { titulo: "Panel Principal", texto: "Estás en el Panel Principal. Toca cualquier botón grande para ir a Compañía, Ruta Segura, Comercios, Talentos, Centro de Vitalidad, Cultura, tu Guía Digital, llamar a Contactos, o pedir ayuda de emergencia." },
    compania: { titulo: "Buscar Compañía", texto: "Estás viendo centros de mayores cercanos. Toca Escuchar para que te lean la información, o Filtrar para ver solo tu zona." },
    rutas: { titulo: "Ruta Segura", texto: "Estás viendo rutas seguras para caminar. Toca Elegir Ruta para indicar de dónde a dónde vas, y avisa cuando llegues al punto seguro." },
    comercio: { titulo: "Comercios", texto: "Estás viendo comercios accesibles cercanos. Toca Ya Estoy Aquí cuando llegues a uno de ellos para hacer Check-in." },
    cultura: { titulo: "Cultura y Ocio", texto: "Estás viendo museos, teatros y eventos culturales cercanos con acceso fácil." },
    perfil: { titulo: "Mi Perfil", texto: "Estás en tu Perfil. Aquí puedes cambiar tu foto, tus datos personales, y la configuración de tu asistente de Inteligencia Artificial." },
    preferencias: { titulo: "Mis Preferencias", texto: "Estás en Mis Preferencias. Aquí puedes activar ayudas de vista, oído y voz, y elegir qué opción ver primero al entrar a la aplicación." },
    modos_asistencia: { titulo: "Modos de Asistencia", texto: "Estás evaluando tus capacidades de vista, oído, habla y escritura, para que la aplicación se adapte mejor a ti." },
    clasificacion_funcional: { titulo: "Clasificación Funcional", texto: "Estás viendo recomendaciones según tu nivel de movilidad: leve, moderado o severo." },
    talento: { titulo: "Mi Talento", texto: "Estás en Mis Talentos. Aquí puedes elegir qué te gustaría enseñar a otras personas y compartir tu experiencia." },
    centro_vitalidad: { titulo: "Centro de Vitalidad", texto: "Estás en el Centro de Vitalidad. Aquí encontrarás ejercicios, juegos mentales, contactos sociales, salud y descanso." },
    buzon: { titulo: "Buzón de Mensajes", texto: "Estás viendo los avisos y mensajes que la aplicación te ha enviado." },
    contactos: { titulo: "Mis Contactos", texto: "Estás viendo tu lista de contactos. Toca el nombre de la persona que quieres llamar." },
    crear_contactos: { titulo: "Crear Contacto", texto: "Estás creando un nuevo contacto. Completa el nombre, teléfono y los demás datos, y toca Guardar Contacto." },
    guia_digital: { titulo: "Mi Guía Digital", texto: "Estás en tu Guía Digital. Aquí encontrarás cursos sugeridos y consejos diarios de seguridad y bienestar." },
    emergencia: { titulo: "Pedir Ayuda", texto: "Estás en la pantalla de emergencia. Toca el botón rojo para llamar a Urgencias, o el nombre de un familiar para llamarlo a él. Si no haces nada, la app llamará a Urgencias automáticamente." },
  };

  const handleWhereAmI = () => {
    const claveEfectiva = (step === 'emergencia_login') ? 'emergencia' : currentView;
    let infoBase = explicacionesPantallas[claveEfectiva] || { titulo: "Esta pantalla", texto: "Estás usando la aplicación bes." };
    if (claveEfectiva === 'mis_talentos_resumen') {
      infoBase = selectedTalents.length === 0
        ? { titulo: "Mis Talentos", texto: "Todavía no has elegido ningún talento para compartir. Toca Elegir Mis Talentos para empezar." }
        : { titulo: "Mis Talentos", texto: `Has elegido compartir: ${selectedTalents.join(', ')}. Puedes tocar Modificar Mis Talentos para cambiarlos.` };
    }
    const info = { titulo: infoBase.titulo, texto: `${username || 'Hola'}, ${infoBase.texto}` };
    setWhereAmIInfo(info);
    setIsWhereAmIOpen(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${info.titulo}. ${info.texto}`);
      utterance.lang = 'es-MX';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Solo reproduce el audio de "¿Dónde estoy?" al pasar el mouse sobre el signo "?",
  // sin abrir la pantalla. Se detiene al salir del área del signo.
  const speakWhereAmIOnHover = () => {
    let infoBase;
    if (step === 'access_options') {
      infoBase = { titulo: "Elige tu Acceso", texto: "estás eligiendo cómo entrar a la aplicación. Puedes tocar Reconocer mi rostro, Usar mi huella, Usar mi voz, o Certificado digital." };
    } else if (step === 'username_entry') {
      infoBase = { titulo: "Usuario", texto: "aquí escribes tu nombre y tu código de acceso de 4 dígitos, y luego tocas Entrar Ahora." };
    } else if (isQuickMenuOpen) {
      infoBase = { titulo: "Menú Rápido", texto: "estás en el menú rápido. Puedes ir al Panel Principal, hablar con iAyuda, Pedir Ayuda si es una emergencia, tocar Volver para regresar, o Cerrar para irme para salir de la aplicación." };
    } else if (isExitModalOpen) {
      infoBase = { titulo: "Salir de la App", texto: "estás en la pantalla de confirmación para salir. Toca Sí, Salir Ahora para cerrar la aplicación, o Volver para quedarte." };
    } else if (isAssistantOpen) {
      infoBase = { titulo: "Asistente iAyuda", texto: `estás en el asistente de inteligencia artificial. HOLA ${profileNombre}, soy ${profileNombreIA} tu IA encargada de ayudarte en el tema que selecciones.` };
    } else if (isMenuOpen) {
      infoBase = { titulo: "Perfil", texto: "estás en tu menú de Perfil. Aquí puedes ver tus datos, tus preferencias, tus talentos, y tus contactos de emergencia." };
    } else {
      const claveEfectiva = (step === 'emergencia_login') ? 'emergencia' : currentView;
      infoBase = explicacionesPantallas[claveEfectiva] || { titulo: "Esta pantalla", texto: "Estás usando la aplicación bes." };
      if (claveEfectiva === 'mis_talentos_resumen') {
        infoBase = selectedTalents.length === 0
          ? { titulo: "Mis Talentos", texto: "Todavía no has elegido ningún talento para compartir. Toca Elegir Mis Talentos para empezar." }
          : { titulo: "Mis Talentos", texto: `Has elegido compartir: ${selectedTalents.join(', ')}. Puedes tocar Modificar Mis Talentos para cambiarlos.` };
      }
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${infoBase.titulo}. ${username || 'Hola'}, ${infoBase.texto}`);
      utterance.lang = 'es-MX';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };
  const stopWhereAmIHoverAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // --- ENCABEZADO ÚNICO REUTILIZABLE (Menú, Perfil, Logo) ---
  // Orden fijo en todas las pantallas: Menú (abre menú rápido) | Perfil (abre panel completo) | Logo + "¿Dónde estoy?"
  // --- FOTO DE USUARIO (reemplaza al antiguo CompanyLogo) ---
  const UserPhoto = ({ className = "w-40" }) => (
    <img
      src={profilePhoto}
      alt="Foto de usuario"
      className={`${className} object-contain mx-auto rounded-full`}
    />
  );

  // --- PIE DE PÁGINA REUTILIZABLE ---
  const ScreenFooter = ({ n, dark }) => (
    <div className={`absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold ${dark === '60' ? 'text-white/60' : dark ? 'text-white/40' : 'text-black'}`}>
      Pantalla {n}
    </div>
  );

  // --- CABECERA REUTILIZABLE PARA MODALES (Volver + ¿Dónde estoy?) ---
  const ModalHeaderDondeEstoy = ({ onBack, titulo, texto }) => (
    <div className="flex items-center justify-between w-full mt-3 mb-4">
      <button onClick={onBack} onMouseEnter={() => announceMenuOption('Volver')} className="flex items-center text-white font-black text-2xl py-2 w-max">
        <ArrowLeft size={36} className="mr-2" /> VOLVER
      </button>
      <button onClick={() => openWhereAmI(titulo, texto)} onMouseEnter={() => announceMenuOption('¿Dónde estoy?')} className="flex flex-col items-center gap-1 active:scale-95 transition-transform" aria-label="¿Dónde estoy?">
        <BrandLogo className="w-10" />
        <span className="text-base font-bold text-amber-200 underline">¿Dónde estoy?</span>
      </button>
    </div>
  );

  // ============================================================================
  // FOTO DEL CIUDADANO CON AYUDA — elemento reutilizable.
  //   · 1 toque / clic  -> ayuda EN VOZ de la pantalla actual (speakWhereAmIOnHover).
  //   · 2 toques / clic  -> ayuda ESCRITA: se abre el panel que indique `onAyudaEscrita`.
  // Así cada pantalla decide qué explicación escrita mostrar ("la que corresponda").
  // ============================================================================
  const FotoAyudaCiudadano = ({ onAyudaEscrita, className = "w-16" }) => {
    const tapTimerRef = useRef(null);
    const ultimoTapRef = useRef(0);
    const manejarTap = () => {
      const ahora = Date.now();
      if (ahora - ultimoTapRef.current < 350) {
        // Segundo toque dentro de la ventana -> ayuda ESCRITA
        ultimoTapRef.current = 0;
        if (tapTimerRef.current) { clearTimeout(tapTimerRef.current); tapTimerRef.current = null; }
        onAyudaEscrita();
      } else {
        // Primer toque -> si no llega un segundo en 350 ms, ayuda EN VOZ
        ultimoTapRef.current = ahora;
        if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        tapTimerRef.current = setTimeout(() => {
          tapTimerRef.current = null;
          ultimoTapRef.current = 0;
          speakWhereAmIOnHover();
        }, 350);
      }
    };
    return (
      <button
        onClick={manejarTap}
        onMouseEnter={speakWhereAmIOnHover}
        onMouseLeave={stopWhereAmIHoverAudio}
        className="active:scale-95 transition-transform rounded-full"
        aria-label="Foto del ciudadano. Un toque: ayuda en voz. Dos toques: ayuda escrita."
      >
        <UserPhoto className={className} />
      </button>
    );
  };

  // ============================================================================
  // ENCABEZADO G — cabecera reutilizable de las pantallas de contenido.
  // Solo DOS elementos:
  //   · Izquierda: botón "Menú" (abre el menú rápido).
  //   · Derecha:   foto del ciudadano (FotoAyudaCiudadano): 1 toque = ayuda en voz;
  //                2 toques = ayuda escrita de esta pantalla (handleWhereAmI).
  // (Se eliminaron el logo VES y el texto "¿Dónde estoy?" de esta cabecera.)
  // ============================================================================
  const EncabezadoG = ({ onBack }) => (
    <header className="flex items-center justify-between mt-6 mb-6 bg-white p-5 rounded-3xl shadow-sm border-2 border-gray-100">
      <button
        onClick={() => { setQuickMenuBackAction(() => onBack); setIsQuickMenuOpen(true); }}
        onMouseEnter={() => announceMenuOption('Menú')}
        className="flex flex-col items-center gap-1 text-blue-950 active:scale-95 transition-transform"
        aria-label="Abrir menú rápido"
      >
        <Menu size={40} />
        <span className="text-base font-black">Menú</span>
      </button>
      <FotoAyudaCiudadano onAyudaEscrita={handleWhereAmI} />
    </header>
  );


  // ============================================================================
  // VISTAS INTERNAS (Sin envolturas absolutas ni fixed, adaptadas al móvil)
  // ============================================================================

  const RenderBiometricScan = () => (
    <div className="flex flex-col p-6 bg-blue-950 min-h-full pb-32 animate-in zoom-in duration-300 relative">
      <div className="flex items-center justify-between mt-6 mb-6">
        <button onClick={() => setStep('login')} className="flex items-center text-white/80 font-black text-2xl py-2 w-max">
          <ArrowLeft size={36} className="mr-2" /> VOLVER
        </button>
        <UserPhoto className="w-12" />
      </div>
      <div className="flex flex-col items-center justify-center text-center flex-grow">
        <div className="relative mb-12 mt-12">
          <div className="absolute inset-0 border-4 border-amber-400 rounded-full animate-ping opacity-50"></div>
          <div className="bg-white/10 p-12 rounded-full border-4 border-amber-400">
            {biometricType === 'face' ? (
              <ScanFace size={100} className="text-amber-400 animate-pulse" />
            ) : biometricType === 'voice' ? (
              <Mic size={100} className="text-amber-400 animate-pulse" />
            ) : (
              <Fingerprint size={100} className="text-amber-400 animate-pulse" />
            )}
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4">
          {biometricType === 'face' ? "Mirando al rostro..." : biometricType === 'voice' ? "Escuchando..." : "Leyendo huella..."}
        </h2>
        <p className="text-2xl text-amber-200 font-bold">Un momento, por favor</p>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-04</div>
    </div>
  );

  // ─── PANTALLA DE VERIFICACIÓN: CERTIFICADO DIGITAL ───
  // Misma experiencia visual que la pantalla biométrica: fondo azul oscuro,
  // ícono animado, barra de progreso y mensaje hablado al entrar.
  const RenderCertSelection = () => {
    const [progreso, setProgreso] = useState(0);
    useEffect(() => {
      speak('Verificando tu certificado digital. Por favor espera.');
      const inicio = Date.now();
      const duracion = 3000;
      const intervalo = setInterval(() => {
        const transcurrido = Date.now() - inicio;
        const pct = Math.min(Math.round((transcurrido / duracion) * 100), 100);
        setProgreso(pct);
        if (pct >= 100) {
          clearInterval(intervalo);
          setTimeout(() => {
            setStep('dashboard');
            setCurrentView('dashboard');
          }, 400);
        }
      }, 50);
      return () => clearInterval(intervalo);
    }, []);
    return (
      <div className="flex flex-col p-6 bg-blue-950 min-h-full pb-6 animate-in zoom-in duration-300 relative">
        <button onClick={() => setStep('username_entry')} className="flex items-center text-white/80 font-black text-2xl py-2 w-max mt-4 mb-4">
          <ArrowLeft size={36} className="mr-2" /> CANCELAR
        </button>
        <div className="flex flex-col items-center justify-center text-center flex-grow gap-8">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-amber-400 rounded-full animate-ping opacity-50"></div>
            <div className="bg-white/10 p-12 rounded-full border-4 border-amber-400">
              <ShieldCheck size={100} className="text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Verificando tu certificado</h2>
            <p className="text-xl text-amber-200 font-bold">Por favor espera...</p>
          </div>
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-sm font-bold text-amber-200 mb-2">
              <span>Verificando</span>
              <span>{progreso}%</span>
            </div>
            <div className="w-full h-5 bg-white/10 rounded-full border-2 border-amber-400 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-100"
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40 font-bold">P-06</div>
      </div>
    );
  };

  // ─── PANTALLA DE TRANSICIÓN: ENTRADA AUTOMÁTICA POR S.O. ───
  // Se muestra entre P-01 y P-08 cuando "Entrada por S.O." está activada en P-22:
  // el usuario ya confió en la seguridad de su dispositivo, así que no se le pide
  // ningún dato adicional. Misma experiencia visual que P-06 (círculo + barra de
  // progreso), con bienvenida por voz para no perder la retroalimentación auditiva.
  const RenderEntradaAutomatica = () => {
    const [progreso, setProgreso] = useState(0);
    useEffect(() => {
      speak('Entrando automáticamente, un momento por favor.');
      const inicio = Date.now();
      const duracion = 3000;
      const intervalo = setInterval(() => {
        const transcurrido = Date.now() - inicio;
        const pct = Math.min(Math.round((transcurrido / duracion) * 100), 100);
        setProgreso(pct);
        if (pct >= 100) {
          clearInterval(intervalo);
          setTimeout(() => {
            const name = profileNombre || username || "Amigo";
            setUsername(name);
            setProfileNombre(name);
            setStep('dashboard');
            setCurrentView('dashboard');
          }, 400);
        }
      }, 50);
      return () => clearInterval(intervalo);
    }, []);
    return (
      <div className="flex flex-col p-6 bg-blue-950 min-h-full pb-6 animate-in zoom-in duration-300 relative">
        <button onClick={() => setStep('inicio')} className="flex items-center text-white/80 font-black text-2xl py-2 w-max mt-4 mb-4">
          <ArrowLeft size={36} className="mr-2" /> CANCELAR
        </button>
        <div className="flex flex-col items-center justify-center text-center flex-grow gap-8">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-amber-400 rounded-full animate-ping opacity-50"></div>
            <div className="bg-white/10 p-12 rounded-full border-4 border-amber-400">
              <ShieldCheck size={100} className="text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Entrando automáticamente</h2>
            <p className="text-xl text-amber-200 font-bold">Un momento, por favor...</p>
          </div>
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-sm font-bold text-amber-200 mb-2">
              <span>Verificando</span>
              <span>{progreso}%</span>
            </div>
            <div className="w-full h-5 bg-white/10 rounded-full border-2 border-amber-400 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-100"
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40 font-bold">P-29</div>
      </div>
    );
  };

  // ─── PANTALLA 0: BIENVENIDA (nueva pantalla de entrada) ───
  const RenderInicio = () => {
    useEffect(() => {
      speak('Bienvenidos a bes. Toca el logo para entrar a la aplicación, o Usuario Administrador para ajustar tus datos y preferencias.');
    }, []);
    return (
      <div className="flex flex-col h-full overflow-hidden bg-white animate-in fade-in duration-500 px-6 relative">
        {/* Etiqueta de versión: informativa, sin ninguna acción al tocarla */}
        <span className="absolute top-12 left-4 text-xs font-bold text-slate-600 select-none">
          Actualizado: {APP_VERSION}
          <br />
          Hola@amaves.com
        </span>
        <div className="flex flex-col items-center justify-center flex-grow gap-5">
          <div className="text-center">
            <button
              onClick={() => { if (entradaVisible.sistema_operativo) { setStep('entrada_automatica'); } else { setStep('login'); } }}
              onMouseEnter={() => announceMenuOption('Entrar a la App')}
              className="cursor-pointer active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-3xl"
              aria-label="Entrar a la App"
            >
              <BrandLogo className="w-64 mb-1" />
            </button>
          </div>
          <button onClick={() => openWhereAmI("Pantalla de Bienvenida", "estás en la pantalla de bienvenida de bes. Toca el logo para entrar a la aplicación, o Usuario Administrador para ajustar tus datos y preferencias.")}
            onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
            className="text-2xl font-black text-slate-600 underline active:scale-95 transition-transform"
            aria-label="¿Dónde estoy? Explicación de esta pantalla">
            ¿Dónde estoy?
          </button>
        </div>
        {/* Acceso discreto de administrador: pequeño y justo encima del pie de pantalla */}
        <button onClick={() => requestPerfilAccess()}
          onMouseEnter={() => announceMenuOption('Usuario Administrador')}
          className="w-full py-1.5 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wide active:scale-95 transition-colors flex items-center justify-center gap-1 mb-6">
          <ShieldCheck size={14} /> Usuario Administrador (Configurar La App)
        </button>
        <ScreenFooter n="P-01" />
      </div>
    );
  };

  const RenderLogin = () => {
    const [showSugerencias, setShowSugerencias] = useState(false);
    const [textoSugerencia, setTextoSugerencia] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const infoPantalla2 = { titulo: "Pantalla de Inicio", texto: `${username || 'Hola'}, estás en la pantalla de inicio de bes. Toca Biométrico o Escrito en Mi Acceso para entrar, o Pedir Ayuda si tienes una emergencia.` };
    const abrirDondeEstoyPantalla2 = () => {
      setWhereAmIInfo(infoPantalla2);
      setIsWhereAmIOpen(true);
      speak(`${infoPantalla2.titulo}. ${infoPantalla2.texto}`);
    };
    const escucharFotoUsuario = () => speak(`${infoPantalla2.titulo}. ${infoPantalla2.texto}`);
    const detenerEscuchaFotoUsuario = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };

    const iniciarDictado = () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { alert('Tu dispositivo no soporta dictado por voz.'); return; }
      const rec = new SR();
      rec.lang = 'es-MX';
      rec.onstart = () => setIsListening(true);
      rec.onend   = () => setIsListening(false);
      rec.onresult = (e) => setTextoSugerencia(prev => prev + ' ' + e.results[0][0].transcript);
      rec.start();
    };

    const enviarSugerencia = () => {
      if (!textoSugerencia.trim()) return;
      setTextoSugerencia('');
      setEnviado(true);
      speak('Gracias por tu sugerencia. Ha sido enviada correctamente.');
      setTimeout(() => { setEnviado(false); setShowSugerencias(false); }, 2500);
    };

    return (
    <div className="flex flex-col h-full overflow-hidden bg-white animate-in fade-in duration-500 px-4 pt-2 pb-2 relative">
      <button onClick={() => setStep('inicio')} onMouseEnter={() => announceMenuOption('Inicio')}
        className="flex items-center text-blue-950 font-black text-lg py-1 w-max" aria-label="Volver al inicio">
        <ArrowLeft size={24} className="mr-1" /> Inicio
      </button>
      <div className="flex flex-col items-center justify-center flex-grow gap-2">
        {/* LOGO VAS: hover lee ¿Dónde estoy?, clic abre el panel */}
        <div
          onMouseEnter={() => speak(`${infoPantalla2.titulo}. ${infoPantalla2.texto}`)}
          onMouseLeave={() => window.speechSynthesis.cancel()}
          className="flex flex-col items-center"
        >
          <button onClick={abrirDondeEstoyPantalla2} className="active:scale-95 transition-transform" aria-label="¿Dónde estoy?">
            <BrandLogo className="w-32" />
          </button>
          <button
            onClick={abrirDondeEstoyPantalla2}
            onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
            className="text-base font-bold text-slate-600 underline active:scale-95 transition-transform mt-1"
            aria-label="¿Dónde estoy? Explicación de esta pantalla"
          >
            ¿Dónde estoy?
          </button>
        </div>
        {/* FOTO: imagen estática sin efectos de hover ni clic */}
        <div className="flex flex-col items-center">
          <img
            src={profilePhoto}
            alt="Foto de usuario"
            className="w-36 h-36 rounded-full object-cover object-top border-4 border-blue-200 shadow-md"
            onError={(e) => { e.target.src = fotoUsuarioPorDefecto; }}
          />
          {profileNombre && <span className="text-base font-black text-blue-900 mt-1">{profileNombre}</span>}
        </div>
        <div className="w-full p-3 bg-slate-50 border-4 border-blue-900 rounded-[30px] shadow-md flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-black text-blue-900 uppercase">Mi Acceso</h2>
          <div className="flex flex-col gap-2">
            {ordenAccesoPreferido === 'escrito' ? (
              <>
                {entradaVisible.escrito && (
                <button onClick={() => setStep('username_entry')} onMouseEnter={() => announceMenuOption('Acceso Escrito')} className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-[25px] font-black text-xl uppercase shadow-lg border-b-8 border-emerald-900 active:translate-y-1 transition-colors">
                  Escrito
                </button>
                )}
                {(entradaVisible.rostro || entradaVisible.huella || entradaVisible.voz) && (
                <button onClick={() => setStep('access_options')} onMouseEnter={() => announceMenuOption('Acceso Biométrico')} className="w-full p-3 bg-blue-900 hover:bg-blue-800 text-white rounded-[25px] font-black text-xl uppercase shadow-lg border-b-8 border-blue-950 active:translate-y-1 transition-colors">
                  Biométrico
                </button>
                )}
              </>
            ) : (
              <>
                {(entradaVisible.rostro || entradaVisible.huella || entradaVisible.voz) && (
                <button onClick={() => setStep('access_options')} onMouseEnter={() => announceMenuOption('Acceso Biométrico')} className="w-full p-3 bg-blue-900 hover:bg-blue-800 text-white rounded-[25px] font-black text-xl uppercase shadow-lg border-b-8 border-blue-950 active:translate-y-1 transition-colors">
                  Biométrico
                </button>
                )}
                {entradaVisible.escrito && (
                <button onClick={() => setStep('username_entry')} onMouseEnter={() => announceMenuOption('Acceso Escrito')} className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-[25px] font-black text-xl uppercase shadow-lg border-b-8 border-emerald-900 active:translate-y-1 transition-colors">
                  Escrito
                </button>
                )}
              </>
            )}
          </div>
        </div>
        <button type="button" onClick={() => setShowPedirAyudaModal(true)} onMouseEnter={() => announceMenuOption('Pedir Ayuda')} className="w-full flex items-center justify-center p-3 bg-red-700 hover:bg-red-800 text-white rounded-[35px] shadow-xl border-b-8 border-red-900 animate-pulse transition-colors">
          <PhoneCall size={32} className="mr-3" />
          <span className="text-2xl font-black uppercase">PEDIR AYUDA</span>
        </button>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-02</div>

      {/* PANEL DE SUGERENCIAS Y COMENTARIOS */}
      {showSugerencias && (
        <div className="absolute inset-0 bg-blue-950/95 z-50 flex flex-col p-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-white">💬 Sugerencias y Comentarios</h2>
            <button onClick={() => { setShowSugerencias(false); setTextoSugerencia(''); setEnviado(false); }}
              className="text-white/60 hover:text-white active:scale-95 transition-transform" aria-label="Cerrar">
              <X size={32} />
            </button>
          </div>
          {enviado ? (
            <div className="flex flex-col items-center justify-center flex-grow gap-4">
              <CheckCircle2 size={72} className="text-emerald-400" />
              <p className="text-2xl font-black text-white text-center">¡Gracias por tu sugerencia!</p>
              <p className="text-lg font-bold text-blue-200 text-center">Ha sido enviada correctamente.</p>
            </div>
          ) : (
            <div className="flex flex-col flex-grow gap-4">
              <p className="text-lg font-bold text-blue-200 leading-relaxed">Escribe o dicta tu sugerencia o comentario. Tu opinión nos ayuda a mejorar.</p>
              <textarea
                value={textoSugerencia}
                onChange={(e) => setTextoSugerencia(e.target.value)}
                placeholder="Escribe aquí tu sugerencia o comentario..."
                className="flex-grow w-full p-4 text-xl border-4 border-amber-400 rounded-2xl font-bold bg-white text-blue-950 focus:border-amber-300 outline-none resize-none min-h-[140px]"
              />
              <div className="flex flex-col gap-3">
                <button onClick={iniciarDictado}
                  className={`w-full py-4 rounded-[25px] font-black text-xl border-4 flex items-center justify-center gap-3 transition-colors active:scale-95 ${isListening ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white/10 border-amber-400 text-amber-300'}`}>
                  <Mic size={28} /> {isListening ? 'Escuchando... (habla ahora)' : 'Dictado por voz'}
                </button>
                <button onClick={enviarSugerencia} disabled={!textoSugerencia.trim()}
                  className="w-full py-5 bg-emerald-600 disabled:bg-slate-500 text-white rounded-[25px] font-black text-2xl shadow-lg border-b-8 border-emerald-800 disabled:border-slate-600 active:translate-y-1 transition-all flex items-center justify-center gap-3">
                  <Send size={28} /> ENVIAR
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    );
  };

  // --- PANTALLA 2.1: OPCIONES DE ACCESO (Rostro, Huella, Voz, Certificado) ---
  const RenderAccessOptions = () => (
    <div className="flex flex-col p-5 bg-white min-h-full animate-in fade-in duration-500 pb-5 relative">
      <div className="flex items-center justify-between mt-3 mb-3">
        <button onClick={() => setStep('login')} onMouseEnter={() => announceMenuOption('Volver')} aria-label="Volver" className="text-blue-950 active:scale-95 transition-transform">
          <ArrowLeft size={40} />
        </button>
        <div className="flex flex-col items-center gap-1">
          <BrandLogo className="w-12" />
          <button
            onClick={() => {
              const info = { titulo: "Elige tu Acceso", texto: `${username || 'Hola'}, estás eligiendo cómo entrar a la aplicación. Puedes tocar Reconocer mi rostro, Usar mi huella, Usar mi voz, o Certificado digital.` };
              setWhereAmIInfo(info);
              setIsWhereAmIOpen(true);
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(`${info.titulo}. ${info.texto}`);
                utterance.lang = 'es-MX';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
              }
            }}
            onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
            className="text-base font-bold text-slate-600 underline active:scale-95 transition-transform"
            aria-label="¿Dónde estoy? Explicación de esta pantalla"
          >
            ¿Dónde estoy?
          </button>
        </div>
      </div>
      <button
        onMouseEnter={speakWhereAmIOnHover}
        onMouseLeave={stopWhereAmIHoverAudio}
        className="active:scale-95 transition-transform"
        aria-label="Escuchar audio de ¿Dónde estoy? al pasar sobre la foto"
      >
        <UserPhoto className="w-20 mx-auto mb-3" />
      </button>
      <div className="flex flex-col flex-grow justify-center gap-4">
        <h2 className="text-2xl font-black text-blue-900 text-center leading-tight">{username || 'Hola'}, elige tu forma de acceso</h2>
        <div className="flex flex-col gap-3">
          {entradaVisible.rostro && (
          <button onClick={() => startBiometric('face')} onMouseEnter={() => announceMenuOption('Reconocer mi rostro')} className="flex flex-col items-center justify-center p-5 bg-[#0082c9] hover:bg-[#006ca7] border-4 border-[#006ca7] text-white rounded-3xl font-black text-lg shadow-md gap-2 active:bg-[#0070ad] transition-colors">
            <ScanFace size={36} /> RECONOCER MI ROSTRO
          </button>
          )}
          {entradaVisible.huella && (
          <button onClick={() => startBiometric('fingerprint')} onMouseEnter={() => announceMenuOption('Usar mi huella')} className="flex flex-col items-center justify-center p-5 bg-[#8dc63f] hover:bg-[#7cb135] border-4 border-[#7cb135] text-white rounded-3xl font-black text-lg shadow-md gap-2 active:bg-[#7cb135] transition-colors">
            <Fingerprint size={36} /> USAR MI HUELLA
          </button>
          )}
          {entradaVisible.voz && (
          <button onClick={() => startBiometric('voice')} onMouseEnter={() => announceMenuOption('Usar mi voz')} className="flex flex-col items-center justify-center p-5 bg-amber-500 hover:bg-amber-600 border-4 border-amber-600 text-white rounded-3xl font-black text-lg shadow-md gap-2 active:bg-amber-600 transition-colors">
            <Mic size={36} /> USAR MI VOZ
          </button>
          )}
        </div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-03</div>
    </div>
  );

  // --- PANTALLA 2.2 (UNIFICADA): ENTRADA DE USUARIO + CÓDIGO DE ACCESO ---
  // Fusiona lo que antes eran las Pantallas 2.2 y 2.5 en una sola pantalla.
  const RenderUsernameEntry = () => {
    const [code, setCode] = useState('');
    const handleUnifiedEntry = (e) => {
      e.preventDefault();
      if (username.trim() && code.trim()) {
        setProfileNombre(username);
        setStep('dashboard');
        setCurrentView('dashboard');
      }
    };
    // El input de nombre usa username (estado global) directamente.
    // Para evitar que el componente pierda el foco al escribir, NO se define
    // ningún componente anidado dentro de este render — todo es JSX plano.
    return (
      <div className="flex flex-col p-5 bg-white min-h-full animate-in fade-in duration-500 pb-5 relative">
        <div className="flex items-center justify-between mt-3 mb-3">
          <button onClick={() => setStep('login')} onMouseEnter={() => announceMenuOption('Volver')} aria-label="Volver" className="text-blue-950 active:scale-95 transition-transform">
            <ArrowLeft size={40} />
          </button>
          <div className="flex flex-col items-center gap-1">
            <BrandLogo className="w-12" />
            <button
              onClick={() => openWhereAmI("Usuario", `${username || 'Hola'}, aquí escribes tu nombre y tu código de acceso de 4 dígitos, y luego tocas Entrar Ahora.`)}
              onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
              className="text-base font-bold text-slate-600 underline active:scale-95 transition-transform"
              aria-label="¿Dónde estoy? Explicación de esta pantalla"
            >
              ¿Dónde estoy?
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center mb-3">
          <UserPhoto className="w-32" />
          {profileNombre && <span className="text-lg font-black text-blue-900 mt-2">{profileNombre}</span>}
        </div>
        <div className="flex flex-col flex-grow justify-center gap-3">
          <h2 className="text-2xl font-black text-emerald-800 text-center leading-tight">Usuario</h2>
          <form onSubmit={handleUnifiedEntry} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="sr-only" htmlFor="name">Nombre de usuario</label>
              <input
                id="name"
                type="text"
                value={username}
                placeholder="Ej: Manuel"
                className="flex-grow w-full p-4 text-2xl border-4 border-gray-300 rounded-[25px] focus:border-blue-900 outline-none font-bold bg-slate-50"
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="sr-only" htmlFor="code">Código de acceso</label>
              <input
                id="code"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: 1234"
                className="w-full p-4 text-4xl border-4 border-gray-300 rounded-[25px] focus:border-blue-900 outline-none font-black bg-slate-50 text-center tracking-[1em]"
                required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-blue-900 text-white rounded-3xl font-black text-2xl shadow-lg border-b-8 border-blue-950 active:translate-y-1">
              ENTRAR AHORA
            </button>
          </form>
          <p className="text-center text-lg font-black text-slate-400 my-2 select-none">O</p>
          <button onClick={() => setStep('cert_selection')} onMouseEnter={() => announceMenuOption('Certificado digital')}
            className="w-full flex flex-col items-center justify-center p-4 bg-[#2d3134] hover:bg-[#1f2224] border-4 border-[#1f2224] text-white rounded-3xl font-black text-lg shadow-md gap-2 active:bg-[#1f2224] transition-colors">
            <ShieldCheck size={32} /> CERTIFICADO DIGITAL
          </button>
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-05</div>
      </div>
    );
  };

  const RenderAccessCode = () => {
    const [code, setCode] = useState('');
    const handleValidateCode = (e) => {
      e.preventDefault();
      if (code.trim()) {
        setProfileNombre(username);
        setStep('dashboard');
        setCurrentView('dashboard');
      }
    };
    return (
      <div className="flex flex-col p-8 bg-white min-h-full animate-in fade-in duration-500 pb-12 relative">
        <div className="flex items-center justify-between mt-6 mb-6">
          <button onClick={() => setStep('login')} className="flex items-center text-blue-950 font-black text-2xl py-2 w-max">
            <ArrowLeft size={36} className="mr-2" /> VOLVER
          </button>
          <UserPhoto className="w-12" />
        </div>
        <div className="flex flex-col items-center justify-center text-center flex-grow mt-4">
          <div className="bg-slate-100 p-8 rounded-full mb-6 border-4 border-slate-200 shadow-inner">
            <Lock size={80} className="text-blue-900" />
          </div>
          <h2 className="text-4xl font-black text-blue-900 mb-4 leading-tight">Código de Acceso</h2>
          <p className="text-xl font-bold text-gray-600 mb-8 px-4">Introduce tu CÓDIGO de acceso de 4 dígitos para continuar.</p>
          <form onSubmit={handleValidateCode} className="w-full flex flex-col gap-6">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: 1234"
              className="w-full p-6 text-4xl border-4 border-gray-300 rounded-[25px] focus:border-blue-900 outline-none font-black bg-slate-50 text-center tracking-[1em]"
              required
            />
            <button type="submit" className="w-full py-6 bg-blue-900 text-white rounded-3xl font-black text-2xl shadow-lg border-b-8 border-blue-950 active:translate-y-1 mt-4">
              VALIDAR Y ENTRAR
            </button>
          </form>
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-05b</div>
      </div>
    );
  };

  const RenderModeSelection = () => (
    <div className="flex flex-col p-6 bg-slate-50 min-h-full pb-32 animate-in fade-in duration-300 relative">
      <EncabezadoG onBack={() => setStep('login')} />
      <p className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-1">
        <CheckCircle2 size={20} /> Hola, {username || "Amigo"}
      </p>
      <div className="flex flex-col gap-6 flex-grow justify-center py-6 mt-4">
        <button
          onClick={() => setCurrentView('dashboard')}
          onMouseEnter={() => announceMenuOption('Modo Pantalla')}
          className="flex flex-col items-center justify-center p-8 bg-[#0082c9] hover:bg-[#006ca7] border-4 border-[#006ca7] text-white rounded-[35px] shadow-lg active:bg-[#0070ad] transition-colors active:scale-95"
        >
          <Users size={64} className="mb-4 text-white" />
          <span className="text-3xl font-black uppercase">Modo Pantalla</span>
          <span className="text-lg font-bold text-blue-100 mt-1">Ver botones grandes y mapas</span>
        </button>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-07</div>
    </div>
  );

  const RenderDashboard = () => {
    // Clases Tailwind completas (no interpoladas) para el grid dinámico
    const gridCols   = { 1: 'grid grid-cols-1', 2: 'grid grid-cols-2', 3: 'grid grid-cols-3' }[colsMenuPrincipal] || 'grid grid-cols-3';
    const btnPadding = colsMenuPrincipal === 1 ? 'p-6' : 'p-4';
    const iconSize   = colsMenuPrincipal === 1 ? 40 : 28;
    const labelCls   = colsMenuPrincipal === 1 ? 'text-2xl' : 'text-lg';
    const subCls     = colsMenuPrincipal === 1 ? 'text-base' : 'text-xs';

    // Reutiliza MENU_ITEMS (fuente única) aplicando el nombre personalizado
    // guardado por el usuario en P-21, si existe.
    const itemsTodos = MENU_ITEMS.map((it) => ({
      ...it,
      label: nombresMenuPersonalizados[it.key] || it.label,
      icon: <it.Icon size={iconSize} color="white" />,
    }));

    return (
      <div className="flex flex-col p-6 bg-slate-50 min-h-full pb-32 animate-in fade-in duration-300 relative">
        <EncabezadoG onBack={() => setCurrentView('dashboard')} />
        <p className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-1">
          <CheckCircle2 size={20} /> Hola, {username || "Amigo"}
        </p>
        <div className="space-y-4">
          {CONTENEDORES.map((cont) => {
            const itemsDelContenedor = itemsTodos.filter((item) => item.categoria === cont.id && menuVisible[item.key]);
            if (itemsDelContenedor.length === 0) return null;
            return (
              <button
                key={cont.id}
                type="button"
                onClick={() => { setCategoriaAbiertaId(cont.id); setCurrentView('categoria_detalle'); setEnteredFromMenu(false); }}
                onMouseEnter={() => announceMenuOption(cont.titulo)}
                className={`w-full text-left ${cont.headerBg} border-4 ${cont.headerBorder} ${cont.headerText} rounded-[25px] px-5 py-4 transition-colors active:scale-95 flex items-center justify-between gap-3`}
              >
                <span>
                  <span className="text-2xl font-black flex items-center gap-2">
                    <span aria-hidden="true">{cont.emoji}</span> {cont.titulo}
                    <span className="text-sm font-bold opacity-70">· {itemsDelContenedor.length} {itemsDelContenedor.length !== 1 ? 'opciones' : 'opción'}</span>
                  </span>
                  <span className="block text-base font-bold mt-1 opacity-80">{cont.frase}</span>
                </span>
                <ChevronDown size={32} className="shrink-0 -rotate-90" />
              </button>
            );
          })}
        </div>
        {itemsTodos.every(item => !menuVisible[item.key]) && (
          <div className="bg-amber-50 border-4 border-amber-300 p-6 rounded-[30px] text-center my-4">
            <p className="text-xl font-bold text-amber-900 leading-relaxed">No tienes opciones activadas. Ve a Perfil → Configurar el Menú Principal para activar algunas.</p>
          </div>
        )}
        <div className="mt-6">
          <button
            onClick={() => setShowPedirAyudaModal(true)}
            onMouseEnter={() => announceMenuOption('Pedir Ayuda')}
            className="w-full flex items-center justify-center p-7 bg-red-700 hover:bg-red-800 text-white rounded-[35px] shadow-xl border-b-8 border-red-900 animate-pulse transition-colors gap-4"
          >
            <PhoneCall size={40} />
            <span className="text-3xl font-black uppercase">PEDIR AYUDA</span>
          </button>
        </div>

        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-08</div>
      </div>
    );
  };

  // ─── P-35: DETALLE DE CATEGORÍA (Vitalidad / Energía / Salud Digital) ───
  // Pantalla a la que navega P-08 al tocar un contenedor. Muestra solo las
  // opciones de esa categoría, con botón Volver que regresa siempre a P-08.
  const RenderCategoriaDetalle = () => {
    const cont = CONTENEDORES.find((c) => c.id === categoriaAbiertaId) || CONTENEDORES[0];
    const gridCols   = { 1: 'grid grid-cols-1', 2: 'grid grid-cols-2', 3: 'grid grid-cols-3' }[colsMenuPrincipal] || 'grid grid-cols-3';
    const btnPadding = colsMenuPrincipal === 1 ? 'p-6' : 'p-4';
    const iconSize   = colsMenuPrincipal === 1 ? 40 : 28;
    const labelCls   = colsMenuPrincipal === 1 ? 'text-2xl' : 'text-lg';
    const subCls     = colsMenuPrincipal === 1 ? 'text-base' : 'text-xs';
    const itemsDelContenedor = MENU_ITEMS
      .filter((it) => it.categoria === cont.id && menuVisible[it.key])
      .map((it) => ({ ...it, label: nombresMenuPersonalizados[it.key] || it.label, icon: <it.Icon size={iconSize} color="white" /> }));

    useEffect(() => {
      speak(`Estás en ${cont.titulo}. ${cont.frase}.`);
    }, [cont.id]);

    return (
      <div className="flex flex-col p-6 bg-slate-50 min-h-full pb-32 animate-in fade-in duration-300 relative">
        <EncabezadoG onBack={() => setCurrentView('dashboard')} />
        <div className={`${cont.activeBg} ${cont.activeBorder} border-4 text-white rounded-[25px] px-5 py-4 mb-6`}>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <span aria-hidden="true">{cont.emoji}</span> {cont.titulo}
          </h2>
          <p className="text-base font-bold text-white/90 mt-1">{cont.frase}</p>
        </div>
        <div className={`${gridCols} gap-3`}>
          {itemsDelContenedor.map(item => (
            <button
              key={item.key}
              onClick={() => { if (item.action === 'assistant') { setIsAssistantOpen(true); } else { setCurrentView(item.view); } setEnteredFromMenu(false); }}
              onMouseEnter={() => announceMenuOption(item.label)}
              className={`relative flex flex-col items-center justify-center text-center gap-2 ${btnPadding} bg-white ${item.hover} border-4 ${item.border} rounded-[30px] shadow-md active:bg-blue-50 transition-colors`}
            >
              <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">{item.num}</span>
              <div className={`${item.bg} p-3 rounded-full`}>{item.icon}</div>
              <span className={`${labelCls} font-black ${item.text} leading-tight`}>{item.label}</span>
              <span className={`${subCls} font-bold text-gray-700 leading-tight`}>{item.sub}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setCurrentView('dashboard')}
          onMouseEnter={() => announceMenuOption('Volver')}
          className="w-full mt-8 py-5 bg-white border-4 border-slate-300 text-slate-700 rounded-[30px] font-black text-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          <ArrowLeft size={28} /> VOLVER
        </button>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-35</div>
      </div>
    );
  };

  const RenderListView = (title, data, colorClass, icon, checkInText = null) => {
    const filteredData = activeFilter === 'Todos' ? data : data.filter(item => item.zona === activeFilter);
    const isRutaSegura = title === "Ruta Segura";
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-36 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-full ${colorClass.replace('text-', 'bg-').split(' ')[0]} text-white shadow-lg`}>
            {icon}
          </div>
          <h2 className={`text-4xl font-black ${colorClass}`}>{title}</h2>
        </div>
        <div className="flex gap-3 mb-6">
          <button onClick={() => readInstructions(title, filteredData)} className="flex-1 py-4 bg-blue-50 text-blue-900 rounded-[20px] font-black text-lg flex flex-col items-center justify-center gap-2 border-4 border-blue-200 shadow-md active:translate-y-1 active:bg-blue-100">
            <Volume2 size={32} className="text-blue-700 animate-pulse" /> ESCUCHAR
          </button>
          {isRutaSegura ? (
            <button onClick={() => setIsRouteModalOpen(true)} className="flex-1 py-4 bg-emerald-50 text-emerald-900 rounded-[20px] font-black text-lg flex flex-col items-center justify-center gap-2 border-4 border-emerald-200 shadow-md active:translate-y-1 active:bg-emerald-100">
              <MapPin size={32} className="text-emerald-700" /> ELEGIR RUTA
            </button>
          ) : (
            <button onClick={() => setIsFilterModalOpen(true)} className="flex-1 py-4 bg-amber-50 text-amber-900 rounded-[20px] font-black text-lg flex flex-col items-center justify-center gap-2 border-4 border-amber-200 shadow-md active:translate-y-1 active:bg-amber-100">
              <Filter size={32} className="text-amber-700" /> FILTRAR
            </button>
          )}
        </div>
        {activeFilter !== 'Todos' && (
          <div className="bg-amber-100 border-4 border-amber-300 p-4 rounded-[20px] mb-6 text-center">
            <p className="text-amber-900 font-bold text-xl">Mostrando: {activeFilter === 'Centro' ? 'Zona Centro' : 'Otros Barrios'}</p>
            <button onClick={() => setActiveFilter('Todos')} className="text-amber-800 font-black underline mt-2 text-lg">VER TODAS LAS ZONAS</button>
          </div>
        )}
        <div className={`w-full h-72 bg-slate-100 rounded-[35px] mb-8 flex flex-col items-center justify-center border-4 ${isRutaSegura ? 'border-emerald-600' : 'border-slate-300'} relative overflow-hidden shadow-inner shrink-0`}>
          {title === "Buscar Compañía" ? (
            <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen
              src="https://maps.google.com/maps?q=centros%20de%20mayores%20santa%20cruz%20de%20tenerife&t=&z=14&ie=UTF8&iwloc=&output=embed" title="Mapa de Centros"></iframe>
          ) : isRutaSegura ? (
            <div className="w-full h-full flex flex-col relative bg-emerald-50">
              <div className="w-full bg-emerald-700 text-white font-black text-center py-2 z-10 shadow-md flex flex-col items-center justify-center px-3">
                <span className="text-xl flex items-center gap-2"><Navigation size={20}/> RUTA VERDE</span>
                <span className="text-sm text-emerald-100 leading-tight bg-emerald-800/80 px-3 py-1 rounded-lg w-full truncate mt-1">{origen} ➔ {destino}</span>
              </div>
              <iframe className="flex-grow w-full" style={{ border: 0 }} loading="lazy" allowFullScreen
                src={`https://maps.google.com/maps?saddr=${encodeURIComponent(origen + ', Santa Cruz de Tenerife')}&daddr=${encodeURIComponent(destino + ', Santa Cruz de Tenerife')}&dirflg=w&t=&z=15&ie=UTF8&iwloc=&output=embed`} title="Mapa Peatonal"></iframe>
            </div>
          ) : (
            <>
              <Navigation size={48} className="text-slate-300" />
              <p className="absolute bottom-4 font-black text-slate-600 uppercase tracking-widest text-sm">Mapa Activo</p>
            </>
          )}
        </div>
        <div className="space-y-6">
          {filteredData.length === 0 ? (
            <div className="text-center p-8 border-4 border-dashed border-gray-300 rounded-3xl">
              <p className="text-2xl font-bold text-gray-700">No hay opciones en esta zona.</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div key={item.id} className="p-7 border-4 border-slate-100 rounded-[35px] bg-white shadow-md">
                <h3 className="text-3xl font-black text-gray-900 leading-tight mb-3">{item.nombre}</h3>
                <p className="text-xl font-bold text-blue-900 mb-4 flex items-start gap-2">
                  <MapPin size={24} className="mt-1 shrink-0" /> {item.direccion}
                </p>
                {item.detalle && (
                  <div className="bg-amber-50 p-5 rounded-2xl border-4 border-amber-300 mb-5">
                    <span className="block text-sm font-black text-amber-900 uppercase tracking-widest mb-1">🎯 Actividad / Detalle:</span>
                    <p className="text-xl font-bold text-amber-950">{item.detalle}</p>
                  </div>
                )}
                {item.bancos && (
                  <div className="flex items-center gap-3 text-emerald-800 font-black text-2xl mb-6 bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200">
                    <span>🪑</span> {item.bancos}
                  </div>
                )}
                {checkInText && (
                  <button onClick={() => simulateCheckIn(item)} className="w-full py-6 bg-blue-900 text-white rounded-[25px] font-black text-2xl shadow-xl border-b-8 border-blue-950 active:translate-y-1 mt-4">
                    {checkInText}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-09</div>
      </div>
    );
  };

  const RenderEmergencia = () => {
    const handleSave = (e) => {
      e.preventDefault();
      setIsEditingEmergencia(false);
      handleBackNavigation();
    };
    const primerBotonRef = useRef(null);
    // Sonido de alerta (tipo sirena suave) sincronizado con la animación del triángulo
    // mientras esta pantalla esté visible. Si suena 25 veces sin respuesta, marca
    // automáticamente al primer contacto, con una cuenta regresiva clara por voz antes
    // (cada número con 2 segundos de espacio para que se entienda bien).
    useEffect(() => {
      // Si se abrió desde "Configurar Pedir Ayuda" (P-28), no activar alarma ni cuenta regresiva.
      if (isEditingEmergencia) return;
      let alarmCount = 0;
      const playAlertTone = () => {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          const audioCtx = new AudioCtx();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.type = 'sine';
          const now = audioCtx.currentTime;
          oscillator.frequency.setValueAtTime(700, now);
          oscillator.frequency.linearRampToValueAtTime(900, now + 0.25);
          oscillator.frequency.linearRampToValueAtTime(700, now + 0.5);
          gainNode.gain.setValueAtTime(0.08, now);
          gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
          oscillator.start(now);
          oscillator.stop(now + 0.5);
        } catch (e) { /* el navegador no soporta audio, se omite el tono */ }
      };
      const speak = (texto) => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(texto);
          utterance.lang = 'es-MX';
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        }
      };
      // Foco en el primer botón al entrar a la pantalla (sin audio automático).
      if (primerBotonRef.current) {
        primerBotonRef.current.focus();
      }
      const totalSegundos = Math.max(segundosLlamadaAutomatica || 10, 1);
      const inicioCuentaRegresiva = Math.max(totalSegundos - 6, 1);
      const tick = () => {
        alarmCount += 1;
        playAlertTone();
        // Cuenta regresiva clara, 6 segundos antes de marcar (cada número con 2 segundos de espacio)
        if (alarmCount === inicioCuentaRegresiva) {
          speak('Llamando a Urgencias en 3');
          setTimeout(() => speak('2'), 2000);
          setTimeout(() => speak('1'), 4000);
        }
        if (alarmCount >= totalSegundos) {
          clearInterval(intervalId);
          setCallingContact({ name: contact1Name, phone: contact1Phone });
        }
      };
      tick();
      const intervalId = setInterval(tick, 1000);
      return () => clearInterval(intervalId);
    }, []);
    return (
      <div className={`flex flex-col p-5 min-h-full pb-5 relative ${isEditingEmergencia ? 'bg-blue-950' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between mt-3 mb-3">
          <button onClick={() => { setIsEditingEmergencia(false); step === 'emergencia_login' ? setStep('login') : handleBackNavigation(); }} className={`flex items-center font-black text-2xl py-2 w-max ${isEditingEmergencia ? 'text-white' : 'text-blue-950'}`}>
            <ArrowLeft size={36} className="mr-2" /> VOLVER
          </button>
          <button
            onClick={handleWhereAmI}
            onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
            className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
            aria-label="¿Dónde estoy? Explicación de esta pantalla"
          >
            <BrandLogo className="w-10" />
            <span className="text-base font-bold text-slate-600 underline">¿Dónde estoy?</span>
          </button>
        </div>
        <UserPhoto className="w-14 mx-auto mb-1" />
        {!isEditingEmergencia ? (
          <div className="flex flex-col items-center justify-center text-center flex-grow">
            <AlertTriangle size={56} className="text-red-600 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-red-900 mb-3 leading-none">¿A QUIÉN LLAMAMOS?</h2>
            <button ref={primerBotonRef} onClick={() => setCallingContact({ name: contact1Name, phone: contact1Phone })} onMouseEnter={() => announceMenuOption(contact1Name)} className="w-full py-6 bg-red-700 hover:bg-red-800 text-white rounded-[40px] font-black text-3xl shadow-2xl border-b-8 border-red-950 active:translate-y-2 mb-3 flex items-center justify-center gap-4 transition-colors">
              <PhoneCall size={36} /> {contact1Name}
            </button>
            {emergenciaContacto2Activo && (
            <button onClick={() => setCallingContact({ name: contact2Name, phone: contact2Phone })} onMouseEnter={() => announceMenuOption(contact2Name)} className="w-full py-5 bg-blue-800 hover:bg-blue-900 text-white rounded-[40px] font-black text-2xl shadow-xl border-b-8 border-blue-950 active:translate-y-2 mb-3 flex items-center justify-center gap-4 transition-colors">
              <PhoneCall size={32} /> {contact2Name}
            </button>
            )}
            {emergenciaContacto3Activo && (
            <button onClick={() => setCallingContact({ name: contact3Name, phone: contact3Phone })} onMouseEnter={() => announceMenuOption(contact3Name)} className="w-full py-5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-[40px] font-black text-2xl shadow-xl border-b-8 border-emerald-950 active:translate-y-2 flex items-center justify-center gap-4 transition-colors">
              <PhoneCall size={32} /> {contact3Name}
            </button>
            )}
          </div>
        ) : (
          <div className="space-y-5 text-left overflow-y-auto pb-6">
            <h2 className="text-3xl font-black text-red-900">Configurar Emergencia</h2>

            {/* INTERRUPTORES DE ACTIVACIÓN */}
            <div className="space-y-4">
              {/* 112 activo */}
              <div className="p-5 bg-white rounded-[25px] border-4 border-red-200 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-xl font-black text-red-700 flex items-center gap-2">🔴 Llamada 112 activa</span>
                  <p className="text-base font-bold text-slate-500 mt-1">Al pulsar "Pedir Ayuda" se llama al 112 automáticamente.</p>
                  {!emergencia112Activa && (
                    <p className="text-sm font-black text-red-500 mt-1">⚠️ Desactivado: no se llamará al 112 en una emergencia.</p>
                  )}
                </div>
                <button onClick={() => setEmergencia112Activa(v => !v)}
                  role="switch" aria-checked={emergencia112Activa} aria-label="Llamada 112 activa"
                  className={`w-20 h-11 rounded-full p-1 transition-colors duration-200 shrink-0 border-2 ${emergencia112Activa ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}>
                  <div className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-200 ${emergencia112Activa ? 'translate-x-9' : 'translate-x-0'}`}></div>
                </button>
              </div>
              {/* Mensajes masivos activos */}
              <div className="p-5 bg-white rounded-[25px] border-4 border-purple-200 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <span className="text-xl font-black text-purple-800 flex items-center gap-2">📨 Mensajes masivos activos</span>
                  <p className="text-base font-bold text-slate-500 mt-1">Al pulsar "Pedir Ayuda" se envían mensajes a los contactos de mensajes masivos.</p>
                </div>
                <button onClick={() => setEmergenciaMasivosActiva(v => !v)}
                  role="switch" aria-checked={emergenciaMasivosActiva} aria-label="Mensajes masivos activos"
                  className={`w-20 h-11 rounded-full p-1 transition-colors duration-200 shrink-0 border-2 ${emergenciaMasivosActiva ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}>
                  <div className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-200 ${emergenciaMasivosActiva ? 'translate-x-9' : 'translate-x-0'}`}></div>
                </button>
              </div>
              {/* Segundos para llamada automática (antes en P-11, ahora vive aquí junto al resto de la configuración de Pedir Ayuda) */}
              <div className="p-5 bg-white rounded-[25px] border-4 border-red-200 shadow-sm">
                <label htmlFor="input-segundos-llamada" className="text-xl font-black text-red-700 flex items-center gap-2 mb-1">⏱️ Segundos para Llamada Automática</label>
                <p className="text-base font-bold text-slate-500 mb-3">Tiempo de espera antes de llamar solos si no respondes al pedir ayuda.</p>
                <input id="input-segundos-llamada" type="number" min="3" max="60" value={segundosLlamadaAutomatica}
                  onChange={(e) => setSegundosLlamadaAutomatica(parseInt(e.target.value) || segundosLlamadaAutomatica)}
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-red-700 outline-none" />
              </div>
            </div>

            {/* SELECCIÓN DE CONTACTOS (máx. 2 de la lista registrada) */}
            <div className="p-5 bg-white rounded-[25px] border-4 border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">Contactos visibles en emergencia</h3>
              <p className="text-base font-bold text-slate-500">Elige hasta 2 contactos (de tu lista ya registrada) que aparecerán en la pantalla de emergencia.</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-black text-blue-800">👤 {contact2Name}</span>
                  <button onClick={() => setEmergenciaContacto2Activo(v => !v)}
                    role="switch" aria-checked={emergenciaContacto2Activo} aria-label={`Mostrar a ${contact2Name} en emergencia`}
                    className={`w-20 h-11 rounded-full p-1 transition-colors duration-200 shrink-0 border-2 ${emergenciaContacto2Activo ? 'bg-blue-700 border-blue-900' : 'bg-slate-300 border-slate-400'}`}>
                    <div className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-200 ${emergenciaContacto2Activo ? 'translate-x-9' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-lg font-black text-emerald-800">👤 {contact3Name}</span>
                  <button onClick={() => setEmergenciaContacto3Activo(v => !v)}
                    role="switch" aria-checked={emergenciaContacto3Activo} aria-label={`Mostrar a ${contact3Name} en emergencia`}
                    className={`w-20 h-11 rounded-full p-1 transition-colors duration-200 shrink-0 border-2 ${emergenciaContacto3Activo ? 'bg-emerald-700 border-emerald-900' : 'bg-slate-300 border-slate-400'}`}>
                    <div className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-200 ${emergenciaContacto3Activo ? 'translate-x-9' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* EDICIÓN DE NOMBRES Y TELÉFONOS */}
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-2xl font-black text-red-900">Editar datos de contactos</h3>
              <div className="bg-white p-5 rounded-3xl border-4 border-red-200 space-y-3">
                <h4 className="text-xl font-black text-red-700">🚨 Contacto Principal (Botón Rojo)</h4>
                <input type="text" value={contact1Name} onChange={(e) => setContact1Name(e.target.value)} placeholder="Nombre / Título" aria-label="Nombre del contacto principal" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-red-700 outline-none" required />
                <input type="text" value={contact1Phone} onChange={(e) => setContact1Phone(e.target.value)} placeholder="Número de Teléfono" aria-label="Teléfono del contacto principal" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-red-700 outline-none" required />
              </div>
              <div className="bg-white p-5 rounded-3xl border-4 border-blue-200 space-y-3">
                <h4 className="text-xl font-black text-blue-800">👤 Contacto Secundario</h4>
                <input type="text" value={contact2Name} onChange={(e) => setContact2Name(e.target.value)} placeholder="Nombre / Título" aria-label="Nombre del contacto secundario" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-blue-800 outline-none" required />
                <input type="text" value={contact2Phone} onChange={(e) => setContact2Phone(e.target.value)} placeholder="Número de Teléfono" aria-label="Teléfono del contacto secundario" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-blue-800 outline-none" required />
              </div>
              <div className="bg-white p-5 rounded-3xl border-4 border-emerald-200 space-y-3">
                <h4 className="text-xl font-black text-emerald-800">👤 Contacto Opcional</h4>
                <input type="text" value={contact3Name} onChange={(e) => setContact3Name(e.target.value)} placeholder="Nombre / Título" aria-label="Nombre del contacto opcional" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-emerald-800 outline-none" required />
                <input type="text" value={contact3Phone} onChange={(e) => setContact3Phone(e.target.value)} placeholder="Número de Teléfono" aria-label="Teléfono del contacto opcional" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-emerald-800 outline-none" required />
              </div>
              <button type="submit" className="w-full py-6 bg-red-700 text-white rounded-3xl font-black text-2xl shadow-lg border-b-8 border-red-950 active:translate-y-1">
                GUARDAR CAMBIOS
              </button>
            </form>
          </div>
        )}
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-10</div>
      </div>
    );
  };

  const RenderPerfil = () => {
    const [seccionAbierta, setSeccionAbierta] = useState(null);
    const [hayDatosSinGuardar, setHayDatosSinGuardar] = useState(false);

    // --- REFS: cada campo tiene su ref para leer el valor solo al guardar ---
    // Así no hay ninguna actualización de estado global mientras el usuario escribe
    // o pasa entre campos → el acordeón nunca se cierra solo.
    const refs = {
      nombre:         useRef(null),
      apellido:       useRef(null),
      fechaNac:       useRef(null),
      nacionalidad:   useRef(null),
      idioma:         useRef(null),
      genero:         useRef(null),
      direccion:      useRef(null),
      telefono:       useRef(null),
      correo:         useRef(null),
      provincia:      useRef(null),
      ciudad:         useRef(null),
      zonaPostal:     useRef(null),
      pais:           useRef(null),
      nombreIA:       useRef(null),
      llamarIA:       useRef(null),
      vozIA:          useRef(null),
      segPassword:    useRef(null),
      invitadoNombre: useRef(null),
      invitadoClave:  useRef(null),
    };

    const soloTexto = (val) => (val || '').replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s@._\-+]/g, '');

    const toggleSeccion = (id) => setSeccionAbierta(prev => prev === id ? null : id);

    const handleSaveProfile = (e) => {
      e.preventDefault();
      // Leer todos los valores de los refs y actualizar el estado global de una sola vez
      setProfileNombre(soloTexto(refs.nombre.current?.value));
      setProfileApellido(soloTexto(refs.apellido.current?.value));
      setProfileFechaNac(refs.fechaNac.current?.value || profileFechaNac);
      setProfileNacionalidad(soloTexto(refs.nacionalidad.current?.value));
      setProfileIdioma(soloTexto(refs.idioma.current?.value));
      setProfileGenero(refs.genero.current?.value || profileGenero);
      setProfileDireccion(soloTexto(refs.direccion.current?.value));
      setProfileTelefono(soloTexto(refs.telefono.current?.value));
      setProfileCorreo(soloTexto(refs.correo.current?.value));
      setProfileProvincia(soloTexto(refs.provincia.current?.value));
      setProfileCiudad(soloTexto(refs.ciudad.current?.value));
      setProfileZonaPostal(soloTexto(refs.zonaPostal.current?.value));
      setProfilePais(refs.pais.current?.value || profilePais);
      setProfileNombreIA(soloTexto(refs.nombreIA.current?.value));
      setProfileLlamarIA(soloTexto(refs.llamarIA.current?.value));
      setProfileVozIA(refs.vozIA.current?.value || profileVozIA);
      setPerfilPassword(refs.segPassword.current?.value || '');
      setProfileInvitadoNombre(soloTexto(refs.invitadoNombre.current?.value));
      setProfileInvitadoClave(refs.invitadoClave.current?.value || '');
      setUsername(soloTexto(refs.nombre.current?.value));
      setHayDatosSinGuardar(false);
      setSelectedItem({ nombre: "Tu Perfil" });
      setShowSuccess(true);
    };

    const handlePhotoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { setProfilePhoto(reader.result); };
        reader.readAsDataURL(file);
      }
    };

    // Marca que hay datos sin guardar al escribir en cualquier campo
    const marcarPendiente = () => setHayDatosSinGuardar(true);

    // SeccionBtn se usa directamente (definido fuera del componente, a nivel módulo)
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 animate-in fade-in duration-300 text-left relative">
        {/* ENCABEZADO estilo P-28 (línea simple), pero con VOLVER en lugar de la
            hamburguesa: VOLVER regresa a la pantalla desde la que se entró
            (handleBackNavigation: al Menú de Perfil si se vino de ahí, o al Panel). */}
        <div className="flex items-center justify-between w-full mt-6 mb-6">
          <button
            onClick={handleBackNavigation}
            onMouseEnter={() => announceMenuOption('Volver')}
            className="flex items-center text-blue-950 font-black text-2xl py-2 w-max active:scale-95 transition-transform"
            aria-label="Volver a la pantalla anterior"
          >
            <ArrowLeft size={36} className="mr-2" /> VOLVER
          </button>
          <FotoAyudaCiudadano className="w-16" onAyudaEscrita={handleWhereAmI} />
        </div>
        <h2 className="text-4xl font-black text-blue-900 mb-6">Mi Perfil</h2>
        {hayDatosSinGuardar && (
          <div className="bg-amber-50 border-4 border-amber-400 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-lg font-black text-amber-800 leading-tight">Recuerda tocar GUARDAR PERFIL para no perder tus cambios.</p>
          </div>
        )}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <SeccionBtn id="datos" emoji="📋" titulo="Datos Personales" seccionAbierta={seccionAbierta} toggleSeccion={toggleSeccion} announceMenuOption={announceMenuOption} />
          {seccionAbierta === 'datos' && (
            <div className="bg-slate-50 p-5 rounded-[25px] border-4 border-blue-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col items-center gap-3 pb-4 border-b-2 border-slate-200">
                <img src={profilePhoto} alt="Foto de perfil" className="w-28 h-28 rounded-full object-cover border-4 border-blue-900 shadow-md"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Foto"; }} />
                <label className="cursor-pointer bg-blue-900 text-white px-6 py-3 rounded-2xl font-black text-lg shadow-md active:bg-blue-950 inline-block">
                  CAMBIAR FOTO 📷<input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="perfil-nombre" className="text-xl font-bold text-slate-700">Nombre:</label>
                  <span className="text-base font-black text-slate-400">Máx. 10 letras</span>
                </div>
                <input
                  id="perfil-nombre"
                  type="text"
                  defaultValue={profileNombre}
                  ref={refs.nombre}
                  onChange={marcarPendiente}
                  maxLength={20}
                  required
                  autoComplete="off"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-apellido" className="text-xl font-bold text-slate-700">Apellido:</label>
                <input id="perfil-apellido" type="text" defaultValue={profileApellido} ref={refs.apellido} onChange={marcarPendiente} autoComplete="off" required
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-fecha-nac" className="text-xl font-bold text-slate-700">Fecha de Nacimiento:</label>
                <input id="perfil-fecha-nac" type="date" defaultValue={profileFechaNac} ref={refs.fechaNac} onChange={marcarPendiente}
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-nacionalidad" className="text-xl font-bold text-slate-700">Nacionalidad:</label>
                <input id="perfil-nacionalidad" type="text" defaultValue={profileNacionalidad} ref={refs.nacionalidad} onChange={marcarPendiente} autoComplete="off"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-idioma" className="text-xl font-bold text-slate-700">Idioma:</label>
                <input id="perfil-idioma" type="text" defaultValue={profileIdioma} ref={refs.idioma} onChange={marcarPendiente} autoComplete="off"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-genero" className="text-xl font-bold text-slate-700">Género:</label>
                <select id="perfil-genero" defaultValue={profileGenero} ref={refs.genero} onChange={marcarPendiente}
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none">
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                  <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
              </div>
            </div>
          )}
          <SeccionBtn id="ubicacion" emoji="🌍" titulo="Contacto y Ubicación" seccionAbierta={seccionAbierta} toggleSeccion={toggleSeccion} announceMenuOption={announceMenuOption} />
          {seccionAbierta === 'ubicacion' && (
            <div className="bg-slate-50 p-5 rounded-[25px] border-4 border-blue-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-direccion" className="text-xl font-bold text-slate-700">Dirección:</label>
                <input id="perfil-direccion" type="text" defaultValue={profileDireccion} ref={refs.direccion} onChange={marcarPendiente} autoComplete="off"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-telefono" className="text-xl font-bold text-slate-700">Teléfono:</label>
                <input id="perfil-telefono" type="tel" defaultValue={profileTelefono} ref={refs.telefono} onChange={marcarPendiente} autoComplete="off" inputMode="tel"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-correo" className="text-xl font-bold text-slate-700">Correo Electrónico:</label>
                <input id="perfil-correo" type="email" defaultValue={profileCorreo} ref={refs.correo} onChange={marcarPendiente} autoComplete="off" inputMode="email"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-provincia" className="text-xl font-bold text-slate-700">Provincia o estado:</label>
                <input id="perfil-provincia" type="text" defaultValue={profileProvincia} ref={refs.provincia} onChange={marcarPendiente} autoComplete="off" placeholder="Ej: Santa Cruz de Tenerife"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-ciudad" className="text-xl font-bold text-slate-700">Ciudad:</label>
                <input id="perfil-ciudad" type="text" defaultValue={profileCiudad} ref={refs.ciudad} onChange={marcarPendiente} autoComplete="off" placeholder="Ej: Santa Cruz"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-zona-postal" className="text-xl font-bold text-slate-700">Zona Postal:</label>
                <input id="perfil-zona-postal" type="text" defaultValue={profileZonaPostal} ref={refs.zonaPostal} onChange={marcarPendiente} autoComplete="off" inputMode="numeric"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-pais" className="text-xl font-bold text-slate-700">País:</label>
                <select id="perfil-pais" defaultValue={profilePais} ref={refs.pais} onChange={marcarPendiente}
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none">
                  <option value="España">España</option>
                  <option value="México">México</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Otro">Otro...</option>
                </select>
              </div>
            </div>
          )}
          <SeccionBtn id="ia" emoji="🤖" titulo="Asistente de IA" seccionAbierta={seccionAbierta} toggleSeccion={toggleSeccion} announceMenuOption={announceMenuOption} />
          {seccionAbierta === 'ia' && (
            <div className="bg-slate-50 p-5 rounded-[25px] border-4 border-blue-200 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-nombre-ia" className="text-xl font-bold text-slate-700">Nombre para la IA:</label>
                <input id="perfil-nombre-ia" type="text" defaultValue={profileNombreIA} ref={refs.nombreIA} onChange={marcarPendiente} autoComplete="off" placeholder="Ej. Chichita"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-llamar-ia" className="text-xl font-bold text-slate-700">¿Cómo te llamará la IA?:</label>
                <input id="perfil-llamar-ia" type="text" defaultValue={profileLlamarIA} ref={refs.llamarIA} onChange={marcarPendiente} autoComplete="off" placeholder="Ej. Don Manuel"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-voz-ia" className="text-xl font-bold text-slate-700">Voz para la IA:</label>
                <select id="perfil-voz-ia" defaultValue={profileVozIA} ref={refs.vozIA} onChange={marcarPendiente} className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none">
                  <option value="Por defecto">Voz por defecto</option>
                  <option value="Hijo (Carlos)">Hijo (Carlos)</option><option value="Hija (Ana)">Hija (Ana)</option>
                </select>
              </div>
            </div>
          )}
          <SeccionBtn id="seguridad" emoji="🔒" titulo="Seguridad y Emergencia" seccionAbierta={seccionAbierta} toggleSeccion={toggleSeccion} announceMenuOption={announceMenuOption} />
          {seccionAbierta === 'seguridad' && (
            <div className="bg-slate-50 p-5 rounded-[25px] border-4 border-blue-200 space-y-4 animate-in fade-in duration-200">
              {/* NOTA: "Segundos para Llamada Automática" se movió a P-10 (Configurar Emergencia),
                  para que toda la configuración de Pedir Ayuda viva en un solo lugar. */}
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-password" className="text-xl font-bold text-slate-700">Contraseña de Perfil:</label>
                <input id="perfil-password" type="password" defaultValue={perfilPassword} ref={refs.segPassword} onChange={marcarPendiente} placeholder="Ej. 1234"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
            </div>
          )}
          <SeccionBtn id="invitados" emoji="👥" titulo="Usuarios (Invitados)" seccionAbierta={seccionAbierta} toggleSeccion={toggleSeccion} announceMenuOption={announceMenuOption} />
          {seccionAbierta === 'invitados' && (
            <div className="bg-slate-50 p-5 rounded-[25px] border-4 border-blue-200 space-y-4 animate-in fade-in duration-200">
              <p className="text-md text-slate-700 font-bold leading-tight">Añade familiares o cuidadores de apoyo. Ellos podrán entrar a VES como invitados.</p>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-invitado-nombre" className="text-xl font-bold text-slate-700">Nombre del Invitado:</label>
                <input id="perfil-invitado-nombre" type="text" defaultValue={profileInvitadoNombre} ref={refs.invitadoNombre} onChange={marcarPendiente} autoComplete="off" placeholder="Ej. Carlos (Hijo)"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="perfil-invitado-clave" className="text-xl font-bold text-slate-700">Clave de Acceso:</label>
                <input id="perfil-invitado-clave" type="password" defaultValue={profileInvitadoClave} ref={refs.invitadoClave} onChange={marcarPendiente} placeholder="Escribe una contraseña"
                  className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-white focus:border-blue-900 outline-none" />
              </div>
            </div>
          )}
          <button type="submit" className="w-full py-6 bg-blue-900 text-white rounded-3xl font-black text-2xl shadow-lg border-b-8 border-blue-950 active:translate-y-1 mt-6">
            GUARDAR PERFIL
          </button>
        </form>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-11</div>
      </div>
    );
  };
  const RenderPreferencias = () => (
    <div className="flex flex-col p-6 bg-white min-h-full pb-32 animate-in fade-in duration-300 relative">
      <EncabezadoG onBack={handleBackNavigation} />
      <h2 className="text-4xl font-black text-blue-900 mb-6">Mis Preferencias</h2>
      <p className="text-xl font-bold text-slate-700 mb-8 leading-relaxed">
        Activa o desactiva las ayudas visuales y de sonido con estos interruptores gigantes deslizantes:
      </p>
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 rounded-[35px] border-4 border-slate-200 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex-grow text-left">
            <span className="text-2xl font-black text-slate-900 flex items-center gap-2">👁 Vista</span>
            <p className="text-lg text-slate-600 font-bold mt-1">Necesito textos más grandes / Lectura de pantalla</p>
          </div>
          <button
            onClick={() => setPrefVision(!prefVision)}
            role="switch"
            aria-checked={prefVision}
            className={`w-24 h-12 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 border-2 ${prefVision ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}
            aria-label="Alternar preferencia de vista"
          >
            <div className={`bg-white w-9 h-9 rounded-full shadow-md transform transition-transform duration-200 ${prefVision ? 'translate-x-11' : 'translate-x-0'}`}></div>
          </button>
        </div>
        <div className="p-6 bg-slate-50 rounded-[35px] border-4 border-slate-200 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex-grow text-left">
            <span className="text-2xl font-black text-slate-900 flex items-center gap-2">👂 Oído</span>
            <p className="text-lg text-slate-600 font-bold mt-1">Prefiero alertas visuales y subtítulos</p>
          </div>
          <button
            onClick={() => setPrefOido(!prefOido)}
            role="switch"
            aria-checked={prefOido}
            className={`w-24 h-12 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 border-2 ${prefOido ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}
            aria-label="Alternar preferencia de oído"
          >
            <div className={`bg-white w-9 h-9 rounded-full shadow-md transform transition-transform duration-200 ${prefOido ? 'translate-x-11' : 'translate-x-0'}`}></div>
          </button>
        </div>
        <div className="p-6 bg-slate-50 rounded-[35px] border-4 border-slate-200 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex-grow text-left">
            <span className="text-2xl font-black text-slate-900 flex items-center gap-2">🗣 Habla/Escritura</span>
            <p className="text-lg text-slate-600 font-bold mt-1">Quiero usar comandos de voz en el mapa</p>
          </div>
          <button
            onClick={() => setPrefVoz(!prefVoz)}
            role="switch"
            aria-checked={prefVoz}
            className={`w-24 h-12 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 border-2 ${prefVoz ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}
            aria-label="Alternar preferencia de habla"
          >
            <div className={`bg-white w-9 h-9 rounded-full shadow-md transform transition-transform duration-200 ${prefVoz ? 'translate-x-11' : 'translate-x-0'}`}></div>
          </button>
        </div>
        {/* NUEVA PREFERENCIA: Orden de acceso preferido en la Pantalla de Inicio */}
        <div className="p-6 bg-slate-50 rounded-[35px] border-4 border-slate-200 text-left">
          <span className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-1">🔑 Acceso preferido</span>
          <p className="text-lg text-slate-600 font-bold mb-4">¿Qué quieres ver primero al entrar a la app?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setOrdenAccesoPreferido('biometrico')}
              className={`p-4 rounded-2xl text-lg font-black border-4 transition-all active:scale-95 ${ordenAccesoPreferido === 'biometrico' ? 'bg-blue-900 border-blue-950 text-white shadow-md' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              Biométrico primero
            </button>
            <button
              onClick={() => setOrdenAccesoPreferido('escrito')}
              className={`p-4 rounded-2xl text-lg font-black border-4 transition-all active:scale-95 ${ordenAccesoPreferido === 'escrito' ? 'bg-emerald-700 border-emerald-900 text-white shadow-md' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
            >
              Escrito primero
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-12</div>
    </div>
  );

  const RenderModosAsistencia = () => {
    const getEtiquetaValor = (val) => {
      if (val === 0) return "No tengo";
      if (val > 0 && val < 5) return "Mucha dificultad";
      if (val === 5) return "Con dificultad";
      if (val > 5 && val < 10) return "Poca dificultad";
      return "Excelente";
    };
    const renderSeccionAsistencia = (titulo, icono, valor, setValor, dispositivo, setDispositivo, labelDispositivo) => (
      <div className="p-6 bg-slate-50 rounded-[35px] border-4 border-slate-200 space-y-4 text-left">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={titulo}>{icono}</span>
          <h3 className="text-2xl font-black text-blue-900">{titulo}</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-600">Nivel de capacidad:</span>
            <span className="text-xl font-black text-blue-950 bg-blue-100 px-4 py-1 rounded-full">
              {valor} - {getEtiquetaValor(valor)}
            </span>
          </div>
          <input
            type="range"
            min="P-01"
            max="10"
            value={valor}
            onChange={(e) => setValor(parseInt(e.target.value))}
            className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
          />
          <div className="flex justify-between text-xs font-black text-slate-700 px-1">
            <span>0 (No tengo)</span>
            <span>5 (Con dificultad)</span>
            <span>10 (Excelente)</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t-2 border-slate-200">
          <span className="text-lg font-bold text-slate-700 leading-tight">{labelDispositivo}</span>
          <button
            type="button"
            onClick={() => setDispositivo(!dispositivo)}
            className={`px-5 py-3 rounded-2xl text-lg font-black border-2 transition-all flex items-center gap-2 shrink-0 ${dispositivo ? 'bg-emerald-600 border-emerald-800 text-white shadow-md' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 active:scale-95'}`}
          >
            {dispositivo ? "SÍ USO" : "NO USO"}
            {dispositivo && <Check size={20} />}
          </button>
        </div>
      </div>
    );
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 animate-in fade-in duration-300 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <h2 className="text-4xl font-black text-blue-900 mb-2 text-left">Modos de Asistencia</h2>
        <p className="text-xl font-bold text-slate-600 mb-6 leading-tight text-left">
          Evalúa tus capacidades y marca si necesitas dispositivos de apoyo de forma cómoda:
        </p>
        <div className="space-y-6">
          {renderSeccionAsistencia("Asistente para la Vista", "👁", valorVista, setValorVista, dispositivoVista, setDispositivoVista, "¿Usa lentes/gafas o lupas?")}
          {renderSeccionAsistencia("Oído", "👂", valorOido, setValorOido, dispositivoOido, setDispositivoOido, "¿Usa audífonos de ayuda?")}
          {renderSeccionAsistencia("Hablar", "🗣", valorHablar, setValorHablar, dispositivoHablar, setDispositivoHablar, "¿Usa micrófono o amplificador?")}
          {renderSeccionAsistencia("Escritura", "✍️", valorEscritura, setValorEscritura, dispositivoEscritura, setDispositivoEscritura, "¿Usa teclados adaptados o lápiz táctil?")}
        </div>
        <button
          onClick={() => {
            setSelectedItem({ nombre: "Configuración de Asistencia" });
            setShowSuccess(true);
          }}
          className="w-full py-6 bg-blue-950 text-white rounded-[25px] font-black text-2xl shadow-xl border-b-8 border-blue-950 active:translate-y-1 mt-8"
        >
          GUARDAR ASISTENCIA
        </button>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-13</div>
      </div>
    );
  };

  const RenderClasificacionFuncional = () => {
    const [nivel, setNivel] = useState('leve');
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 animate-in fade-in duration-300 text-left relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <h2 className="text-4xl font-black text-blue-900 mb-6">Clasificación Funcional</h2>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setNivel('leve')}
            className={`p-4 rounded-2xl text-xl font-black border-4 transition-all active:scale-95 ${nivel === 'leve' ? 'bg-emerald-600 border-emerald-800 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'}`}
          >
            Leve
          </button>
          <button
            onClick={() => setNivel('moderado')}
            className={`p-4 rounded-2xl text-xl font-black border-4 transition-all active:scale-95 ${nivel === 'moderado' ? 'bg-amber-500 border-amber-700 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'}`}
          >
            Moderado
          </button>
          <button
            onClick={() => setNivel('severo')}
            className={`p-4 rounded-2xl text-xl font-black border-4 transition-all active:scale-95 ${nivel === 'severo' ? 'bg-red-600 border-red-800 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'}`}
          >
            Severo
          </button>
        </div>
        {nivel === 'leve' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-[25px] border-4 border-emerald-200">
              <h3 className="text-2xl font-black text-emerald-900 mb-3 flex items-center gap-2">📋 INDICADORES</h3>
              <p className="text-xl font-bold text-emerald-950 leading-relaxed">
                Dolor esporádico de rodilla/cadera, sobrepeso leve, tensión controlada. Camina de forma independiente.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-[25px] border-4 border-blue-200">
              <h3 className="text-2xl font-black text-blue-900 mb-3 flex items-center gap-2">🛠 Herramientas de uso</h3>
              <p className="text-xl font-bold text-blue-950 leading-relaxed">
                Bastón ocasional, calzado ortopédico.
              </p>
            </div>
          </div>
        )}
        {nivel === 'moderado' && (
          <div className="space-y-6">
            <div className="bg-amber-50 p-6 rounded-[25px] border-4 border-amber-200">
              <h3 className="text-2xl font-black text-amber-900 mb-3 flex items-center gap-2">📋 INDICADORES</h3>
              <p className="text-xl font-bold text-amber-950 leading-relaxed">
                Dificultad moderada para caminar distancias largas, equilibrio inestable en superficies irregulares, necesidad de apoyarse en barandillas.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-[25px] border-4 border-blue-200">
              <h3 className="text-2xl font-black text-blue-900 mb-3 flex items-center gap-2">🛠 Herramientas de uso</h3>
              <p className="text-xl font-bold text-blue-950 leading-relaxed">
                Andador de apoyo, barandillas en escaleras y asideros en el hogar.
              </p>
            </div>
          </div>
        )}
        {nivel === 'severo' && (
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-[25px] border-4 border-red-200">
              <h3 className="text-2xl font-black text-red-900 mb-3 flex items-center gap-2">📋 INDICADORES</h3>
              <p className="text-xl font-bold text-red-950 leading-relaxed">
                Pérdida severa de movilidad autónoma, dependencia de asistencia constante para incorporarse y desplazarse.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-[25px] border-4 border-blue-200">
              <h3 className="text-2xl font-black text-blue-900 mb-3 flex items-center gap-2">🛠 Herramientas de uso</h3>
              <p className="text-xl font-bold text-blue-950 leading-relaxed">
                Silla de ruedas, andadores especiales con frenos manuales y asistencia técnica domiciliaria.
              </p>
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-14</div>
      </div>
    );
  };

  const RenderTalentoSelection = () => {
    const opcionesTalentos = [
      { id: 'manuales', nombre: "Manuales", detalle: "Costura, carpintería, jardinería" },
      { id: 'intelectuales', nombre: "Intelectuales", detalle: "Idiomas, matemáticas, historia" },
      { id: 'artisticas', nombre: "Artísticas", detalle: "Pintura, música, baile" },
      { id: 'culinarias', nombre: "Culinarias", detalle: "Cocina, repostería" },
      { id: 'sociales', nombre: "Sociales", detalle: "Organizar eventos, narrar historias" },
      { id: 'recreativas', nombre: "Recreativas", detalle: "Ajedrez, juegos, paseos guiados" },
      { id: 'bienestar', nombre: "Bienestar y Sabiduría de Vida", detalle: "Meditación, consejería, mentoría" },
    ];
    const toggleTalent = (nombre) => {
      if (selectedTalents.includes(nombre)) {
        setSelectedTalents(selectedTalents.filter(t => t !== nombre));
      } else {
        setSelectedTalents([...selectedTalents, nombre]);
      }
    };
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-36 animate-in fade-in duration-300 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-full bg-emerald-600 text-white shadow-lg">
            <Star size={36} />
          </div>
          <h2 className="text-4xl font-black text-emerald-600">Mis Talentos</h2>
        </div>
        <p className="text-2xl font-black text-slate-800 text-left mb-2">¿Qué habilidad tienes?</p>
        <p className="text-lg font-bold text-slate-700 text-left mb-6 leading-tight">Puedes elegir varias categorías de talentos:</p>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {opcionesTalentos.map((opcion) => {
            const isSelected = selectedTalents.includes(opcion.nombre);
            return (
              <button
                key={opcion.id}
                onClick={() => toggleTalent(opcion.nombre)}
                className={`p-5 rounded-[25px] border-4 shadow-md transition-all active:scale-95 text-left flex items-center gap-3 ${isSelected ? 'bg-emerald-600 border-emerald-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'}`}
              >
                {isSelected && <Check size={24} className="shrink-0" />}
                <div>
                  <span className="block text-xl font-black leading-tight">{opcion.nombre}</span>
                  <span className={`block text-sm font-bold leading-tight ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>{opcion.detalle}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 text-left mt-4">
          <label className="text-2xl font-black text-slate-800 ml-2">Explica con tus palabras qué te gustaría enseñar:</label>
          <div className="flex gap-3 items-end">
            <textarea
              value={customExplanation}
              onChange={(e) => setCustomExplanation(e.target.value)}
              placeholder={isListeningExplanation ? "Escuchando..." : "Ej: Me gustaría enseñar recetas típicas de dulces tradicionales canarios..."}
              className="flex-grow p-5 text-xl border-4 border-slate-300 rounded-[25px] font-bold text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-900 shadow-inner min-h-[120px]"
              disabled={isListeningExplanation}
            />
            <button
              type="button"
              onClick={handleVoiceInputExplanation}
              aria-label="Decir explicación de talento por voz"
              className={`shrink-0 p-5 h-16 w-16 rounded-[25px] border-4 flex items-center justify-center shadow-md transition-all ${isListeningExplanation ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-amber-400 border-amber-600 text-blue-950 active:scale-95'}`}
              title="Decir por voz"
            >
              <Mic size={28} />
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            const talentsSummary = selectedTalents.length > 0
              ? selectedTalents.join(', ')
              : "Tu Talento Personalizado";
            setSelectedItem({ nombre: talentsSummary });
            setShowSuccess(true);
          }}
          className="w-full py-6 bg-emerald-700 text-white rounded-[25px] font-black text-2xl shadow-xl border-b-8 border-emerald-950 active:translate-y-1 mt-8"
        >
          ¡COMPARTIR MI TALENTO!
        </button>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-15</div>
      </div>
    );
  };

  const RenderCentroVitalidad = () => {
    const renderSliderCognitivo = (titulo, descripcion, valor, setValor, colorBorder, colorText) => (
      <div className={`p-5 rounded-3xl border-4 ${colorBorder} mb-4 bg-white`}>
        <h4 className={`text-2xl font-black ${colorText} mb-2`}>{titulo}</h4>
        <p className="text-lg font-bold text-slate-700 leading-tight mb-4">{descripcion}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-600">Nivel (0-10):</span>
            <span className={`text-xl font-black ${colorText} bg-slate-50 px-4 py-1 rounded-full border-2 ${colorBorder}`}>
              {valor}
            </span>
          </div>
          <input
            type="range"
            min="P-01"
            max="10"
            value={valor}
            onChange={(e) => setValor(parseInt(e.target.value))}
            className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    );
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-36 animate-in fade-in duration-300 text-left relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-full bg-red-100 text-red-600 shadow-lg">
            <Heart size={36} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-black text-red-600 leading-tight">Centro de Vitalidad</h2>
        </div>
        {enteredFromMenu ? (
          <>
            <p className="text-xl font-bold text-slate-600 mb-8 leading-relaxed">
              Evalúa tus capacidades cognitivas fluidas y cristalizadas usando estos deslizadores:
            </p>
            <div className="mb-10 space-y-6">
              <div className="bg-blue-50 p-6 rounded-[30px] border-4 border-blue-200 shadow-sm">
                <h3 className="text-3xl font-black text-blue-900 mb-4 flex items-center gap-3 border-b-2 border-blue-200 pb-3">
                  📉 Inteligencia Fluida
                </h3>
                <p className="text-lg font-bold text-blue-800 mb-6 leading-relaxed">
                  Capacidades que tienden a disminuir: pensar lógicamente, resolver problemas nuevos y procesar información rápidamente. Estas son las áreas donde es normal notar cambios sutiles:
                </p>
                {renderSliderCognitivo("Velocidad de procesamiento", "Es común que a las personas mayores les tome un poco más de tiempo asimilar nueva información, procesarla y reaccionar.", valProcesamiento, setValProcesamiento, "border-blue-300", "text-blue-900")}
                {renderSliderCognitivo("Memoria de trabajo", "La capacidad de retener y manipular información temporalmente en la mente (como recordar un número de teléfono mientras se busca un bolígrafo) puede reducirse.", valTrabajo, setValTrabajo, "border-blue-300", "text-blue-900")}
                {renderSliderCognitivo("Atención dividida (Multitarea)", "Resulta más difícil prestar atención a múltiples estímulos al mismo tiempo o cambiar rápidamente el foco de atención entre varias tareas.", valMultitarea, setValMultitarea, "border-blue-300", "text-blue-900")}
                {renderSliderCognitivo("Memoria episódica reciente", "Recordar dónde se dejaron las llaves o los detalles de una conversación reciente puede requerir más esfuerzo.", valEpisodica, setValEpisodica, "border-blue-300", "text-blue-900")}
              </div>
              <div className="bg-emerald-50 p-6 rounded-[30px] border-4 border-emerald-200 shadow-sm">
                <h3 className="text-3xl font-black text-emerald-900 mb-4 flex items-center gap-3 border-b-2 border-emerald-200 pb-3">
                  📈 Inteligencia Cristalizada
                </h3>
                <p className="text-lg font-bold text-emerald-800 mb-6 leading-relaxed">
                  Capacidades que se mantienen o mejoran: basadas en el conocimiento acumulado, la experiencia y el vocabulario. Suelen ser muy resistentes al paso del tiempo:
                </p>
                {renderSliderCognitivo("Lenguaje y vocabulario", "La comprensión del lenguaje, la gramática y el vocabulario general no solo se mantienen, sino que a menudo siguen enriqueciéndose.", valLenguaje, setValLenguaje, "border-emerald-300", "text-emerald-900")}
                {renderSliderCognitivo("Conocimiento general (Memoria semántica)", "Los hechos, conceptos y conocimientos adquiridos a lo largo de la vida permanecen intactos.", valSemantica, setValSemantica, "border-emerald-300", "text-emerald-900")}
                {renderSliderCognitivo("Resolución de problemas cotidianos", "Gracias a la experiencia acumulada, los adultos mayores suelen ser mejores para resolver conflictos interpersonales y tomar decisiones basadas en experiencias pasadas (sabiduría).", valResolucion, setValResolucion, "border-emerald-300", "text-emerald-900")}
              </div>
              <button
                onClick={() => {
                  setSelectedItem({ nombre: "Evaluación Cognitiva" });
                  setShowSuccess(true);
                }}
                className="w-full py-6 bg-red-600 text-white rounded-[25px] font-black text-2xl shadow-xl border-b-8 border-red-800 active:translate-y-1 mt-4"
              >
                GUARDAR MIS NIVELES
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl font-bold text-slate-600 mb-8 leading-relaxed">
              Explora nuestros módulos diseñados para mantener tu mente y cuerpo activos.
            </p>
            <div className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-[30px] border-4 border-emerald-200 shadow-sm">
                <h3 className="text-3xl font-black text-emerald-900 mb-4 flex items-center gap-3 border-b-2 border-emerald-200 pb-3">
                  <Activity size={32} className="text-emerald-700" /> 1. Movimiento Vital
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-2xl font-black text-emerald-800">🏃 Rutinas adaptadas</h4>
                    <p className="text-lg font-bold text-emerald-950 leading-tight mt-1">Videos cortos y guiados de ejercicios de bajo impacto, como yoga en silla, estiramientos o fuerza con bandas.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-emerald-800">👟 Metas de pasos diarias</h4>
                    <p className="text-lg font-bold text-emerald-950 leading-tight mt-1">Podómetro integrado que celebra pequeños hitos a lo largo del día con recordatorios amables para levantarse.</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-[30px] border-4 border-blue-200 shadow-sm">
                <h3 className="text-3xl font-black text-blue-900 mb-4 flex items-center gap-3 border-b-2 border-blue-200 pb-3">
                  <Brain size={32} className="text-blue-700" /> 2. Gimnasio Mental
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-2xl font-black text-blue-800">💡 La píldora del aprendizaje</h4>
                    <p className="text-lg font-bold text-blue-950 leading-tight mt-1">Micro-curso semanal: aprende 5 palabras en un idioma nuevo, historia o a usar una función de tu teléfono.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-blue-800">🧩 Juegos de vida diaria</h4>
                    <p className="text-lg font-bold text-blue-950 leading-tight mt-1">Simuladores de memoria: recuerda una lista de la compra virtual o memoriza un recorrido en un mapa.</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 p-6 rounded-[30px] border-4 border-amber-200 shadow-sm">
                <h3 className="text-3xl font-black text-amber-900 mb-4 flex items-center gap-3 border-b-2 border-amber-200 pb-3">
                  <Users size={32} className="text-amber-700" /> 3. Círculo Social
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-2xl font-black text-amber-800">📞 Marcación rápida afectiva</h4>
                    <p className="text-lg font-bold text-amber-950 leading-tight mt-1">Pantalla con fotos grandes de familiares para videollamadas con un solo toque.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-amber-800">💬 Club de intereses</h4>
                    <p className="text-lg font-bold text-amber-950 leading-tight mt-1">Chats grupales y foros para debatir sobre libros, jardinería, películas o recetas.</p>
                  </div>
                </div>
              </div>
              <div className="bg-rose-50 p-6 rounded-[30px] border-4 border-rose-200 shadow-sm">
                <h3 className="text-3xl font-black text-rose-900 mb-4 flex items-center gap-3 border-b-2 border-rose-200 pb-3">
                  <Heart size={32} className="text-rose-700" /> 4. Corazón Sano
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-2xl font-black text-rose-800">💊 Gestor de salud</h4>
                    <p className="text-lg font-bold text-rose-950 leading-tight mt-1">Recordatorios programables para tomar medicación, medir presión arterial o beber agua.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-rose-800">🥗 Recetario protector</h4>
                    <p className="text-lg font-bold text-rose-950 leading-tight mt-1">Recetas paso a paso basadas en la dieta mediterránea (ricas en Omega-3 y antioxidantes).</p>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-[30px] border-4 border-indigo-200 shadow-sm">
                <h3 className="text-3xl font-black text-indigo-900 mb-4 flex items-center gap-3 border-b-2 border-indigo-200 pb-3">
                  <Moon size={32} className="text-indigo-700" /> 5. Buen Descanso
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-2xl font-black text-indigo-800">🎧 Rutina de viento a favor</h4>
                    <p className="text-lg font-bold text-indigo-950 leading-tight mt-1">Audios de relajación guiada y ruido blanco diseñados para escuchar 20 minutos antes de dormir.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-indigo-800">📝 Diario de energía</h4>
                    <p className="text-lg font-bold text-indigo-950 leading-tight mt-1">Registro súper sencillo al despertar usando emojis para conocer tus patrones de descanso.</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-[30px] border-4 border-purple-200 shadow-sm">
                <h3 className="text-3xl font-black text-purple-900 mb-4 flex items-center gap-3 border-b-2 border-purple-200 pb-3">
                  <Info size={32} className="text-purple-700" /> 6. Mi Guía Digital: Novedades y Consejos
                </h3>
                <div className="space-y-5">
                  <div>
                    <h4 className="text-2xl font-black text-purple-800">🎓 Cursos adaptados</h4>
                    <p className="text-lg font-bold text-purple-950 leading-tight mt-1">Sugerencias de aprendizaje continuo basadas en tu nivel de experiencia y preferencias de tu perfil.</p>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-purple-800">💡 Tips y ayudas</h4>
                    <p className="text-lg font-bold text-purple-950 leading-tight mt-1">Consejos rápidos diarios para mejorar tu bienestar, uso de la tecnología y seguridad personal.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-16</div>
      </div>
    );
  };

  // ─── CENTRO DE TRATAMIENTO ───
  // Relación del usuario con un centro de tratamiento externo (fisioterapia,
  // rehabilitación, etc.): próximas sesiones, check-in cuando el terapeuta
  // llega a domicilio, y un resumen simple de progreso compartido por el
  // centro (con consentimiento del paciente y su familia).
  const RenderCentroTratamiento = () => {
    const sesiones = [
      { id: 1, servicio: 'Fisioterapia', terapeuta: 'Lic. Marta Gómez', fecha: 'Hoy', hora: '16:00', tipo: 'domicilio' },
      { id: 2, servicio: 'Rehabilitación de rodilla', terapeuta: 'Lic. Carlos Ruiz', fecha: 'Jueves 23', hora: '10:30', tipo: 'presencial', lugar: 'Centro de Rehabilitación San Rafael' },
      { id: 3, servicio: 'Fisioterapia', terapeuta: 'Lic. Marta Gómez', fecha: 'Lunes 27', hora: '16:00', tipo: 'domicilio' },
    ];
    const sesionHoy = sesiones.find((s) => s.fecha === 'Hoy');
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 rounded-full bg-teal-600 text-white shadow-lg">
            <Activity size={36} />
          </div>
          <h2 className="text-3xl font-black text-teal-900 leading-tight">Centro de Tratamiento</h2>
        </div>

        {sesionHoy && (
          <div className="bg-teal-50 border-4 border-teal-400 rounded-[25px] p-5 mb-6 flex items-center gap-4 animate-pulse">
            <Activity size={32} className="text-teal-700 shrink-0" />
            <p className="text-lg font-black text-teal-900 leading-tight">
              Hoy a las {sesionHoy.hora} viene tu {sesionHoy.servicio.toLowerCase()} ({sesionHoy.terapeuta}).
            </p>
          </div>
        )}

        <h3 className="text-xl font-black text-slate-700 mb-3">Próximas sesiones</h3>
        <div className="space-y-4 mb-8">
          {sesiones.map((s) => (
            <div key={s.id} className="p-5 bg-slate-50 rounded-[25px] border-4 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-xl font-black text-teal-900">{s.servicio}</span>
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${s.tipo === 'domicilio' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {s.tipo === 'domicilio' ? '🏠 A domicilio' : '🏥 Presencial'}
                </span>
              </div>
              <p className="text-lg font-bold text-slate-600">{s.fecha} · {s.hora} · {s.terapeuta}</p>
              {s.lugar && <p className="text-base font-bold text-slate-500">{s.lugar}</p>}
              {s.tipo === 'domicilio' && (
                <button
                  onClick={() => simulateCheckIn({ nombre: `${s.servicio} — ${s.fecha} ${s.hora}` })}
                  className="mt-3 w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Check size={22} /> El terapeuta ya llegó
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 border-4 border-emerald-200 rounded-[25px] p-6">
          <h3 className="text-xl font-black text-emerald-900 mb-2 flex items-center gap-2">📈 Resumen de progreso</h3>
          <p className="text-lg font-black text-emerald-800">Esta semana: 2 sesiones de fisioterapia completadas</p>
          <p className="text-base font-bold text-slate-500 mt-2 leading-relaxed">Este resumen lo comparte el centro con tu consentimiento y el de tu familia. Puedes retirar el consentimiento cuando quieras desde Mi Perfil.</p>
        </div>

        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-31</div>
      </div>
    );
  };

  const RenderBuzon = () => {
    const mensajes = [
      { id: 1, icono: <MapPin size={24} className="text-emerald-600" />, titulo: "Ruta Segura", texto: "Hemos enviado un SMS a tu familiar avisando que llegaste seguro a tu destino.", tiempo: "Hoy, 10:30", bg: "bg-emerald-50", border: "border-emerald-200" },
      { id: 2, icono: <Star size={24} className="text-amber-600" />, titulo: "Talento Registrado", texto: "Tu taller ha sido registrado. Pronto te llamaremos para prepararlo.", tiempo: "Ayer", bg: "bg-amber-50", border: "border-amber-200" },
      { id: 3, icono: <ShieldCheck size={24} className="text-blue-600" />, titulo: "Perfil Actualizado", texto: "Tus preferencias de asistencia y modos de vista se guardaron con éxito.", tiempo: "Lunes", bg: "bg-blue-50", border: "border-blue-200" }
    ];
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-36 animate-in fade-in duration-300 text-left relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-full bg-amber-100 text-amber-600 shadow-lg">
            <Mail size={36} className="animate-pulse" />
          </div>
          <h2 className="text-4xl font-black text-amber-600 leading-tight">Buzón de Mensajes</h2>
        </div>
        <p className="text-xl font-bold text-slate-600 mb-8 leading-relaxed">
          Aquí llegarán todos los avisos y mensajes generados por la aplicación para ti.
        </p>
        <div className="space-y-5">
          {mensajes.map(msg => (
            <div key={msg.id} className={`p-6 rounded-[30px] border-4 ${msg.border} ${msg.bg} shadow-sm`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">{msg.icono}</div>
                  <h3 className="text-2xl font-black text-slate-800">{msg.titulo}</h3>
                </div>
                <span className="text-sm font-bold text-slate-700 bg-white px-3 py-1 rounded-xl border-2 border-slate-200">{msg.tiempo}</span>
              </div>
              <p className="text-xl font-bold text-slate-700 leading-tight">{msg.texto}</p>
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-17</div>
      </div>
    );
  };

  const RenderContactos = () => (
    <div className="flex flex-col p-6 bg-slate-50 min-h-full pb-32 relative">
      <EncabezadoG onBack={handleBackNavigation} />
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-full bg-blue-100 text-blue-600 shadow-lg">
          <PhoneCall size={36} />
        </div>
        <h2 className="text-4xl font-black text-blue-900 leading-tight">Mis Contactos</h2>
      </div>
      <p className="text-xl font-bold text-slate-600 mb-8 leading-relaxed">
        Toca a la persona que deseas llamar:
      </p>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setCallingContact({ name: contact2Name, phone: contact2Phone })}
          className="flex items-center gap-4 p-4 bg-white rounded-3xl border-4 border-slate-200 active:bg-blue-50 transition-colors text-left shadow-sm"
        >
          <img src="https://i.pravatar.cc/150?img=11" alt={`Foto de ${contact2Name}`} className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shrink-0" />
          <div className="flex-grow">
            <span className="block text-2xl font-black text-slate-800">{contact2Name}</span>
            <span className="text-lg font-bold text-slate-700">Tocar para llamar</span>
          </div>
          <PhoneCall size={32} className="text-emerald-600 shrink-0 mr-2 animate-pulse" />
        </button>
        <button
          onClick={() => setCallingContact({ name: contact3Name, phone: contact3Phone })}
          className="flex items-center gap-4 p-4 bg-white rounded-3xl border-4 border-slate-200 active:bg-blue-50 transition-colors text-left shadow-sm"
        >
          <img src="https://i.pravatar.cc/150?img=5" alt={`Foto de ${contact3Name}`} className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shrink-0" />
          <div className="flex-grow">
            <span className="block text-2xl font-black text-slate-800">{contact3Name}</span>
            <span className="text-lg font-bold text-slate-700">Tocar para llamar</span>
          </div>
          <PhoneCall size={32} className="text-emerald-600 shrink-0 mr-2 animate-pulse" />
        </button>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-18</div>
    </div>
  );

  const RenderCrearContactos = () => {
    const [fotoContacto, setFotoContacto] = useState('https://via.placeholder.com/150?text=Foto');
    const [errores, setErrores] = useState({});
    const refsContacto = {
      nombre: useRef(null),
      apellido: useRef(null),
      telefono: useRef(null),
    };
    const handleFotoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { setFotoContacto(reader.result); };
        reader.readAsDataURL(file);
      }
    };
    const handleGuardarContacto = (e) => {
      e.preventDefault();
      const nuevosErrores = {};
      if (!refsContacto.nombre.current?.value.trim()) nuevosErrores.nombre = 'Falta el nombre. Escribe el nombre del contacto.';
      if (!refsContacto.apellido.current?.value.trim()) nuevosErrores.apellido = 'Falta el apellido. Escribe el apellido del contacto.';
      if (!refsContacto.telefono.current?.value.trim()) nuevosErrores.telefono = 'Falta el teléfono. Escribe al menos un número de contacto.';
      setErrores(nuevosErrores);
      if (Object.keys(nuevosErrores).length > 0) {
        speak('Faltan datos por completar. Revisa los campos marcados en rojo.');
        return;
      }
      setSelectedItem({ nombre: "Nuevo Contacto" });
      setShowSuccess(true);
    };
    return (
      <div className="flex flex-col p-6 bg-slate-50 min-h-full pb-32 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-full bg-amber-100 text-amber-600 shadow-lg">
            <UserPlus size={36} />
          </div>
          <h2 className="text-4xl font-black text-amber-600 leading-tight">Crear Contacto</h2>
        </div>
        <p className="text-xl font-bold text-slate-600 mb-6 leading-relaxed">
          Rellena los datos para añadir a una nueva persona a tu lista:
        </p>
        <form onSubmit={handleGuardarContacto} className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border-4 border-slate-200 text-center flex flex-col items-center">
            <img src={fotoContacto} alt="Foto del nuevo contacto" className="w-32 h-32 rounded-full object-cover border-4 border-blue-900 shadow-md mb-4" />
            <label htmlFor="contacto-foto" className="cursor-pointer bg-blue-900 text-white px-6 py-3 rounded-2xl font-black text-lg shadow-md active:bg-blue-950 inline-block">
              SUBIR FOTO 📷
              <input id="contacto-foto" type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
            </label>
          </div>
          <div className="bg-white p-5 rounded-3xl border-4 border-slate-200 space-y-4 text-left">
            <div className="flex flex-col gap-1">
              <label htmlFor="contacto-nombre" className="text-xl font-bold text-slate-700">Nombre:</label>
              <input id="contacto-nombre" ref={refsContacto.nombre} type="text" required
                aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? 'contacto-nombre-error' : undefined}
                className={`w-full p-4 text-xl border-4 rounded-2xl font-bold bg-slate-50 outline-none ${errores.nombre ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-900'}`} placeholder="Ej. María" />
              {errores.nombre && <p id="contacto-nombre-error" role="alert" className="text-red-600 font-bold text-base">⚠️ {errores.nombre}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contacto-apellido" className="text-xl font-bold text-slate-700">Apellido:</label>
              <input id="contacto-apellido" ref={refsContacto.apellido} type="text" required
                aria-invalid={!!errores.apellido} aria-describedby={errores.apellido ? 'contacto-apellido-error' : undefined}
                className={`w-full p-4 text-xl border-4 rounded-2xl font-bold bg-slate-50 outline-none ${errores.apellido ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-900'}`} placeholder="Ej. González" />
              {errores.apellido && <p id="contacto-apellido-error" role="alert" className="text-red-600 font-bold text-base">⚠️ {errores.apellido}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contacto-edad" className="text-xl font-bold text-slate-700">Edad:</label>
              <input id="contacto-edad" type="number" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-blue-900 outline-none" placeholder="Ej. 65" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contacto-telefono" className="text-xl font-bold text-slate-700">Teléfono(s):</label>
              <input id="contacto-telefono" ref={refsContacto.telefono} type="tel" required
                aria-invalid={!!errores.telefono} aria-describedby={errores.telefono ? 'contacto-telefono-error' : undefined}
                className={`w-full p-4 text-xl border-4 rounded-2xl font-bold bg-slate-50 outline-none ${errores.telefono ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-900'}`} placeholder="Ej. 600 123 456" />
              {errores.telefono && <p id="contacto-telefono-error" role="alert" className="text-red-600 font-bold text-base">⚠️ {errores.telefono}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contacto-correo" className="text-xl font-bold text-slate-700">Correo Electrónico:</label>
              <input id="contacto-correo" type="email" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-blue-900 outline-none" placeholder="correo@ejemplo.com" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="contacto-direccion" className="text-xl font-bold text-slate-700">Dirección:</label>
              <input id="contacto-direccion" type="text" className="w-full p-4 text-xl border-4 border-slate-300 rounded-2xl font-bold bg-slate-50 focus:border-blue-900 outline-none" placeholder="Ej. Calle Principal 1" />
            </div>
          </div>
          <button type="submit" className="w-full py-6 bg-blue-900 text-white rounded-3xl font-black text-2xl shadow-lg border-b-8 border-blue-950 active:translate-y-1 mt-6">
            GUARDAR CONTACTO
          </button>
        </form>
      </div>
    );
  };

  const RenderGuiaDigital = () => (
    <div className="flex flex-col p-6 bg-slate-50 min-h-full pb-32 relative">
      <EncabezadoG onBack={handleBackNavigation} />
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-full bg-purple-200 text-purple-800 shadow-lg">
          <BookOpen size={36} />
        </div>
        <h2 className="text-4xl font-black text-purple-900 leading-tight">Mi Guía Digital</h2>
      </div>
      <p className="text-xl font-bold text-slate-600 mb-8 leading-relaxed">
        Novedades, cursos y consejos adaptados a tu experiencia:
      </p>
      <div className="space-y-6">
        <div className="bg-purple-100 p-6 rounded-[30px] border-4 border-purple-300 shadow-sm">
          <h3 className="text-2xl font-black text-purple-900 mb-4 flex items-center gap-2">🎓 Cursos Sugeridos</h3>
          <ul className="space-y-3">
            <li className="bg-white p-4 rounded-2xl shadow-sm border-2 border-purple-200 text-xl font-bold text-slate-800">📱 Cómo hacer videollamadas seguras</li>
            <li className="bg-white p-4 rounded-2xl shadow-sm border-2 border-purple-200 text-xl font-bold text-slate-800">📸 Fotografía básica con tu móvil</li>
          </ul>
        </div>
        <div className="bg-amber-50 p-6 rounded-[30px] border-4 border-amber-200 shadow-sm">
          <h3 className="text-2xl font-black text-amber-900 mb-4 flex items-center gap-2">💡 Tips Diarios</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-amber-200">
              <span className="font-black text-amber-800 text-lg block mb-1">Seguridad:</span>
              <span className="text-xl font-bold text-slate-700">Nunca compartas contraseñas por mensaje.</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-amber-200">
              <span className="font-black text-emerald-700 text-lg block mb-1">Bienestar:</span>
              <span className="text-xl font-bold text-slate-700">Bebe un vaso de agua al usar el móvil por primera vez en la mañana.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-19</div>
    </div>
  );

  // --- NUEVA PANTALLA: FOTOS / VIDEOS ---
  const RenderFotosVideos = () => {
    const recuerdos = [
      { id: 1, tipo: 'foto', categoria: 'Familia', titulo: 'Cumpleaños de familia', img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&auto=format&fit=crop&q=60' },
      { id: 2, tipo: 'foto', categoria: 'Amistades', titulo: 'Tarde de café con amigas', img: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&auto=format&fit=crop&q=60' },
      { id: 3, tipo: 'video', categoria: 'Familia', titulo: 'Video de los nietos', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=300&auto=format&fit=crop&q=60' },
      { id: 4, tipo: 'foto', categoria: 'Otros', titulo: 'Paseo por la Rambla', img: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=300&auto=format&fit=crop&q=60' },
    ];
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-full bg-amber-600 text-white shadow-lg">
            <Image size={36} />
          </div>
          <h2 className="text-4xl font-black text-amber-800 leading-tight">Fotos y Videos</h2>
        </div>
        <p className="text-xl font-bold text-slate-600 mb-6 leading-relaxed">
          Tus fotos y videos de familia, amistades y otros momentos:
        </p>
        <div className="grid grid-cols-2 gap-5">
          {recuerdos.map((item) => (
            <button key={item.id} className="flex flex-col rounded-[25px] overflow-hidden border-4 border-amber-200 shadow-md bg-amber-50 active:scale-95 transition-transform text-left">
              <div className="relative w-full h-32 bg-slate-200">
                <img src={item.img} alt={item.titulo} className="w-full h-full object-cover" />
                {item.tipo === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-white/90 rounded-full p-3"><Volume2 size={24} className="text-amber-700" /></div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <span className="block text-sm font-black text-amber-900 uppercase">{item.categoria}</span>
                <span className="block text-base font-bold text-slate-700 leading-tight">{item.titulo}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-20</div>
      </div>
    );
  };

  // --- NUEVA PANTALLA: CONFIGURAR EL MENÚ PRINCIPAL ---
  const RenderConfigurarMenu = () => {
    // Guarda el nombre mientras el usuario escribe (máx. 25, reforzado también aquí)
    // y marca que hay cambios pendientes de guardar.
    const handleChangeLabel = (key, val) => {
      setNombresMenuPersonalizados((prev) => ({ ...prev, [key]: val.slice(0, 25) }));
      setHayCambiosSinGuardarMenu(true);
    };
    // Al salir del campo (perder foco) se confirma por voz lo escrito.
    // Si el usuario lo dejó vacío, se restaura automáticamente el nombre original.
    const handleSaveLabel = (key) => {
      const item = MENU_ITEMS.find((it) => it.key === key);
      const val = (nombresMenuPersonalizados[key] ?? '').trim();
      if (!val) {
        setNombresMenuPersonalizados((prev) => { const next = { ...prev }; delete next[key]; return next; });
        speak(`Nombre restaurado: ${item.label}`);
        return;
      }
      speak(`Guardado: ${val}`);
    };
    // Pedir confirmación antes de restaurar (evita deshacer un cambio por error).
    const pedirConfirmacionRestaurar = (key) => setConfirmarRestaurarKey(key);
    const confirmarRestaurar = () => {
      const key = confirmarRestaurarKey;
      const item = MENU_ITEMS.find((it) => it.key === key);
      setNombresMenuPersonalizados((prev) => { const next = { ...prev }; delete next[key]; return next; });
      setHayCambiosSinGuardarMenu(true);
      setConfirmarRestaurarKey(null);
      speak(`Nombre restaurado: ${item.label}`);
    };
    const handleToggleVisible = (key) => {
      setMenuVisible((prev) => ({ ...prev, [key]: !prev[key] }));
      setHayCambiosSinGuardarMenu(true);
    };
    const handleGuardarCambios = () => {
      setHayCambiosSinGuardarMenu(false);
      speak('Cambios guardados.');
      setShowSuccess(true);
    };
    // Mismos 3 contenedores de acordeón que en P-08 (Vitalidad / Energía /
    // Salud Digital), agrupando las funcionalidades con el mismo criterio.
    const toggleContenedorConfig = (id) => setContenedorAbiertoConfig((prev) => (prev === id ? null : id));
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <h2 className="text-3xl font-black text-blue-900 mb-2">Configurar el Menú Principal</h2>
        <p className="text-lg font-bold text-slate-600 mb-4 leading-relaxed">
          Elige qué opciones quieres ver en tu Panel Principal y cómo se llaman (máx. 25 caracteres, solo el nombre). "Pedir Ayuda" siempre estará visible.
        </p>

        {hayCambiosSinGuardarMenu && (
          <div className="bg-amber-50 border-4 border-amber-400 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-lg font-black text-amber-800 leading-tight flex-grow">Recuerda tocar GUARDAR CAMBIOS para no perder tus cambios.</p>
            <button
              onClick={handleGuardarCambios}
              onMouseEnter={() => announceMenuOption('Guardar Cambios')}
              className="shrink-0 py-3 px-5 bg-emerald-700 text-white rounded-2xl font-black text-base shadow-md active:scale-95 transition-transform"
            >
              GUARDAR
            </button>
          </div>
        )}

        {/* SELECTOR DE OPCIONES POR FILA */}
        <div className="p-5 bg-blue-50 rounded-[25px] border-4 border-blue-200 mb-6">
          <h3 className="text-xl font-black text-blue-900 mb-3">Opciones por fila en el menú</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => { setColsMenuPrincipal(n); setHayCambiosSinGuardarMenu(true); }}
                className={`py-5 rounded-2xl font-black text-2xl border-4 transition-all active:scale-95 ${colsMenuPrincipal === n ? 'bg-blue-900 border-blue-950 text-white shadow-md' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                aria-label={`${n} ${n > 1 ? 'opciones' : 'opción'} por fila`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-500 mt-2 text-center">
            {colsMenuPrincipal === 1 ? '1 por fila — botones grandes (ideal para baja visión)' : colsMenuPrincipal === 2 ? '2 por fila — equilibrado' : '3 por fila — vista compacta'}
          </p>
        </div>

        {/* LOS MISMOS 3 CONTENEDORES DE P-08, COMO ACORDEÓN, MISMO CRITERIO DE AGRUPACIÓN */}
        <div className="space-y-4">
          {CONTENEDORES.map((cont) => {
            const itemsDelContenedor = MENU_ITEMS.filter((item) => item.categoria === cont.id);
            if (itemsDelContenedor.length === 0) return null;
            const abierto = contenedorAbiertoConfig === cont.id;
            return (
              <div key={cont.id}>
                <button
                  type="button"
                  onClick={() => toggleContenedorConfig(cont.id)}
                  onMouseEnter={() => announceMenuOption(cont.titulo)}
                  aria-expanded={abierto}
                  className={`w-full text-left border-4 rounded-[25px] px-5 py-4 transition-colors active:scale-95 flex items-center justify-between gap-3 ${abierto ? `${cont.activeBg} ${cont.activeBorder} text-white` : `${cont.headerBg} ${cont.headerBorder} ${cont.headerText}`}`}
                >
                  <span>
                    <span className="text-2xl font-black flex items-center gap-2">
                      <span aria-hidden="true">{cont.emoji}</span> {cont.titulo}
                    </span>
                    <span className={`block text-base font-bold mt-1 ${abierto ? 'text-white/90' : 'opacity-80'}`}>{cont.frase}</span>
                  </span>
                  <ChevronDown size={32} className={`shrink-0 transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`} />
                </button>
                {abierto && (
                  <div className="space-y-5 mt-4 animate-in fade-in duration-200">
                    {itemsDelContenedor.map((item) => {
                      const value = nombresMenuPersonalizados[item.key] ?? item.label;
                      const isCustom = nombresMenuPersonalizados[item.key] !== undefined && nombresMenuPersonalizados[item.key] !== item.label;
                      return (
                        <OpcionMenuEditable
                          key={item.key}
                          item={item}
                          value={value}
                          isCustom={isCustom}
                          visible={menuVisible[item.key]}
                          onToggleVisible={() => handleToggleVisible(item.key)}
                          onChangeValue={(val) => handleChangeLabel(item.key, val)}
                          onSave={() => handleSaveLabel(item.key)}
                          onRestore={() => pedirConfirmacionRestaurar(item.key)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTÓN GUARDAR CAMBIOS AL FINAL DE LA PANTALLA */}
        <button
          onClick={handleGuardarCambios}
          onMouseEnter={() => announceMenuOption('Guardar Cambios')}
          className="w-full mt-8 py-7 bg-emerald-700 text-white rounded-[30px] font-black text-2xl shadow-xl border-b-8 border-emerald-900 active:translate-y-1 transition-colors flex items-center justify-center gap-3"
        >
          <CheckCircle2 size={30} /> GUARDAR CAMBIOS
        </button>

        {/* CONFIRMACIÓN ANTES DE RESTAURAR UN NOMBRE */}
        {confirmarRestaurarKey && (
          <div role="dialog" aria-modal="true" aria-label="Confirmar restaurar nombre original" className="absolute inset-0 bg-blue-950/95 z-[60] p-8 flex flex-col items-center justify-center text-center">
            <div className="bg-white/10 p-8 rounded-full mb-6"><AlertTriangle size={64} className="text-amber-400" /></div>
            <h3 className="text-3xl font-black text-white mb-4 leading-tight">¿Restaurar nombre original?</h3>
            <p className="text-xl font-bold text-blue-100 mb-10">
              Volverá a llamarse "{MENU_ITEMS.find((it) => it.key === confirmarRestaurarKey)?.label}".
            </p>
            <div className="w-full max-w-sm space-y-4">
              <button onClick={confirmarRestaurar} className="w-full py-6 bg-amber-400 text-blue-950 rounded-[30px] font-black text-xl shadow-xl active:scale-95 transition-transform">
                SÍ, RESTAURAR
              </button>
              <button onClick={() => setConfirmarRestaurarKey(null)} className="w-full py-6 bg-white/10 border-4 border-white/30 text-white rounded-[30px] font-black text-xl active:scale-95 transition-transform">
                CANCELAR
              </button>
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-21</div>
      </div>
    );
  };

  // --- PANTALLA 19.1: CONFIGURAR ENTRADA BIOMÉTRICA ---
  // Controla qué métodos biométricos aparecen en Pantalla 2.1.
  // --- PANTALLA P-32: COMENTARIOS Y SUGERENCIAS ---
  const RenderComentarios = () => {
    const [texto, setTexto] = useState('');
    const [escuchando, setEscuchando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    useEffect(() => {
      speak('Cuéntanos qué piensas sobre VES, puedes escribirnos Comentarios y sugerencias.');
    }, []);

    const iniciarDictado = () => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { alert('Tu dispositivo no soporta dictado por voz.'); return; }
      const rec = new SR();
      rec.lang = 'es-MX';
      rec.onstart  = () => setEscuchando(true);
      rec.onend    = () => setEscuchando(false);
      rec.onresult = (e) => setTexto(prev => (prev + ' ' + e.results[0][0].transcript).trim());
      rec.start();
    };

    const enviar = () => {
      if (!texto.trim()) return;
      // Simulación del envío al correo corporativo de VES (Hola@amaves.com)
      // En producción se integraría con EmailJS u otro servicio de backend.
      setEnviado(true);
      speak('Tu mensaje ha sido enviado a VES. ¡Gracias!');
      setTimeout(() => {
        setTexto('');
        setEnviado(false);
        handleBackNavigation();
      }, 3000);
    };

    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <h2 className="text-3xl font-black text-blue-900 mb-2">💬 Comentarios y Sugerencias</h2>
        <p className="text-lg font-bold text-slate-500 mb-5 leading-relaxed">
          Cuéntanos qué piensas sobre VES. Puedes escribirnos tus Comentarios y sugerencias, y lo recibiremos en <span className="text-blue-800 font-black">Hola@amaves.com</span>
        </p>
        {enviado ? (
          <div className="flex flex-col items-center justify-center flex-grow gap-5">
            <CheckCircle2 size={80} className="text-emerald-500" />
            <p className="text-2xl font-black text-emerald-700 text-center">¡Mensaje enviado a VES!</p>
            <p className="text-lg font-bold text-slate-500 text-center">Gracias por ayudarnos a mejorar.</p>
          </div>
        ) : (
          <div className="flex flex-col flex-grow gap-4">
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe aquí tu comentario o sugerencia..."
              className="flex-grow w-full p-5 text-xl border-4 border-blue-200 rounded-2xl font-bold bg-slate-50 focus:border-blue-900 outline-none resize-none min-h-[180px]"
            />
            <button
              onClick={iniciarDictado}
              className={`w-full py-5 rounded-[25px] font-black text-xl border-4 flex items-center justify-center gap-3 transition-colors active:scale-95 ${escuchando ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-slate-100 border-blue-300 text-blue-900 hover:bg-blue-50'}`}
            >
              <Mic size={28} /> {escuchando ? 'Escuchando... habla ahora' : '🎤 Dictado por voz'}
            </button>
            <button
              onClick={enviar}
              disabled={!texto.trim()}
              className="w-full py-6 bg-emerald-700 disabled:bg-slate-300 text-white rounded-[30px] font-black text-2xl shadow-lg border-b-8 border-emerald-900 disabled:border-slate-400 active:translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Send size={28} /> ENVIAR A VES
            </button>
          </div>
        )}
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-32</div>
      </div>
    );
  };

  // ─── DEMO DE LA APP ───
  // Recorrido guiado (voz + lectura) de lo que hace el sistema: cubre el botón
  // "Usuario Administrador" (P-01) y el botón "Entrar a la App" (P-01). No es
  // ayuda de una función puntual, sino una explicación general del sistema.
  const RenderDemoApp = () => {
    const pasosDemo = [
      {
        id: 'administrador',
        emoji: '🛡️',
        titulo: 'Usuario Administrador (Configurar La App)',
        texto: 'Aquí es donde se preparan tus datos antes de usar la app: tu nombre, tu foto, tus contactos de emergencia, tus preferencias de vista y oído, y quién puede ayudarte a configurar todo como Usuario de Apoyo. Se usa una sola vez al principio, o cuando quieras cambiar algo.',
        cardCls: 'bg-blue-50 border-blue-200',
        titleCls: 'text-blue-900',
        textCls: 'text-blue-950',
        btnCls: 'bg-blue-600',
      },
      {
        id: 'entrar',
        emoji: '🚪',
        titulo: 'Entrar a la App',
        texto: 'Aquí es donde entras cada día a usar VES: buscar compañía, tus talentos, rutas seguras, tus contactos, tus recuerdos en fotos y videos, y el botón rojo de Pedir Ayuda, siempre disponible para cualquier apuro.',
        cardCls: 'bg-emerald-50 border-emerald-200',
        titleCls: 'text-emerald-900',
        textCls: 'text-emerald-950',
        btnCls: 'bg-emerald-600',
      },
    ];
    const reproducirDemoCompleta = () => {
      const guion = pasosDemo.map((p) => `${p.titulo}. ${p.texto}`).join(' ');
      speak(`Bienvenido a la demo de VES. ${guion}`);
    };
    useEffect(() => {
      speak('Demo de la App. Aquí te explicamos, paso a paso, todo lo que puedes hacer en VES.');
    }, []);
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 rounded-full bg-indigo-600 text-white shadow-lg">
            <Info size={36} />
          </div>
          <h2 className="text-3xl font-black text-indigo-900 leading-tight">Demo de la App</h2>
        </div>
        <p className="text-lg font-bold text-slate-600 mb-6 leading-relaxed">
          Te explicamos, paso a paso, todo lo que puedes hacer en VES — como si alguien te lo mostrara en persona.
        </p>

        <button
          onClick={reproducirDemoCompleta}
          className="w-full py-6 mb-6 bg-indigo-600 text-white rounded-[30px] font-black text-xl shadow-lg border-b-8 border-indigo-900 active:translate-y-1 transition-colors flex items-center justify-center gap-3"
        >
          <Volume2 size={28} /> ▶ Reproducir Demo Completa
        </button>

        <div className="space-y-5">
          {pasosDemo.map((p) => (
            <div key={p.id} className={`p-6 ${p.cardCls} border-4 rounded-[30px] shadow-sm`}>
              <h3 className={`text-2xl font-black ${p.titleCls} mb-2 flex items-center gap-2`}>{p.emoji} {p.titulo}</h3>
              <p className={`text-lg font-bold ${p.textCls} leading-relaxed mb-4`}>{p.texto}</p>
              <button
                onClick={() => speak(`${p.titulo}. ${p.texto}`)}
                className={`w-full py-4 ${p.btnCls} text-white rounded-2xl font-black text-lg shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2`}
              >
                <Volume2 size={22} /> 🔊 Escuchar
              </button>
            </div>
          ))}
        </div>

        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-34</div>
      </div>
    );
  };

  const RenderConfigurarEntrada = () => {
    const metodosEntrada = [
      { key: 'rostro',            nombre: 'Reconocer mi rostro',   emoji: '🫣' },
      { key: 'huella',            nombre: 'Usar mi huella',        emoji: '👆' },
      { key: 'voz',               nombre: 'Usar mi voz',           emoji: '🎤' },
      { key: 'escrito',           nombre: 'Acceso Escrito',        emoji: '✍️' },
      { key: 'sistema_operativo', nombre: 'Entrada por S.O.',      emoji: '📱' },
    ];
    // No permitir dejar los cinco métodos apagados a la vez: el usuario
    // siempre debe conservar al menos una forma de entrar a la aplicación.
    const toggleMetodo = (key) => {
      setEntradaVisible((prev) => {
        const siguiente = { ...prev, [key]: !prev[key] };
        const quedaAlMenosUno = metodosEntrada.some((m) => siguiente[m.key]);
        if (!quedaAlMenosUno) {
          speak('Debes dejar activo al menos un método para poder entrar a la aplicación.');
          return prev;
        }
        return siguiente;
      });
    };
    return (
      <div className="flex flex-col p-6 bg-white min-h-full pb-32 relative">
        <EncabezadoG onBack={handleBackNavigation} />
        <h2 className="text-3xl font-black text-blue-900 mb-2">Acceso a la App</h2>
        <p className="text-lg font-bold text-slate-600 mb-6 leading-relaxed">
          Activa o desactiva los métodos de acceso que aparecerán en la pantalla de entrada. Debes dejar al menos uno activo.
        </p>
        <div className="space-y-4">
          {metodosEntrada.map((m) => (
            <div key={m.key} className="p-5 bg-slate-50 rounded-[30px] border-4 border-slate-200 flex items-center justify-between gap-4 shadow-sm">
              <span className="text-xl font-black text-slate-900">{m.emoji} {m.nombre}</span>
              <button
                onClick={() => toggleMetodo(m.key)}
                role="switch"
                aria-checked={entradaVisible[m.key]}
                className={`w-20 h-11 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 border-2 ${entradaVisible[m.key] ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}
                aria-label={`${entradaVisible[m.key] ? 'Desactivar' : 'Activar'} ${m.nombre}`}
              >
                <div className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-200 ${entradaVisible[m.key] ? 'translate-x-9' : 'translate-x-0'}`}></div>
              </button>
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-22</div>
      </div>
    );
  };


  const RenderMisTalentosResumen = () => {
    const [talentoMenuAbierto, setTalentoMenuAbierto] = useState(null);
    const [participacionSeleccionada, setParticipacionSeleccionada] = useState({});
    const opcionesParticipacion = [
      "Como Formador",
      "Como Coordinador",
      "Como Participante",
    ];
    // Selección múltiple: se pueden elegir varias opciones a la vez para el mismo talento.
    const toggleParticipacion = (talento, opcion) => {
      setParticipacionSeleccionada((prev) => {
        const actuales = prev[talento] || [];
        const yaElegida = actuales.includes(opcion);
        return {
          ...prev,
          [talento]: yaElegida ? actuales.filter((o) => o !== opcion) : [...actuales, opcion],
        };
      });
    };
    return (
    <div className="flex flex-col p-6 bg-white min-h-full pb-32 relative">
      <EncabezadoG onBack={handleBackNavigation} />
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-full bg-emerald-600 text-white shadow-lg">
          <Star size={36} />
        </div>
        <h2 className="text-4xl font-black text-emerald-600">Mis Talentos</h2>
      </div>
      {selectedTalents.length === 0 ? (
        <div className="bg-emerald-50 border-4 border-emerald-200 p-8 rounded-[30px] text-center flex flex-col items-center gap-4">
          <Sparkles size={48} className="text-emerald-600" />
          <p className="text-xl font-bold text-emerald-900 leading-relaxed">Todavía no has elegido ningún talento. ¡Cuéntanos qué te gustaría enseñar!</p>
          <button onClick={() => { setCurrentView('talento'); setEnteredFromMenu(false); }} className="w-full py-5 bg-emerald-700 text-white rounded-[25px] font-black text-xl shadow-lg border-b-8 border-emerald-950 active:translate-y-1">
            ELEGIR MIS TALENTOS
          </button>
        </div>
      ) : (
        <>
          <p className="text-xl font-bold text-slate-700 mb-6 leading-relaxed">Estos son los talentos que elegiste compartir:</p>
          <div className="space-y-4 mb-6">
            {selectedTalents.map((t) => (
              <button key={t} onClick={() => setTalentoMenuAbierto(t)} className="w-full text-left p-5 bg-emerald-50 border-4 border-emerald-200 rounded-[25px] active:scale-95 transition-transform">
                <span className="block text-xl font-black text-emerald-900">{t}</span>
                {(participacionSeleccionada[t] || []).length > 0 && (
                  <span className="block text-sm font-bold text-emerald-700 mt-1 leading-tight">✓ {(participacionSeleccionada[t] || []).join(' · ')}</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
      {talentoMenuAbierto && (
        <div role="dialog" aria-modal="true" aria-label={`Cómo participar en ${talentoMenuAbierto}`} className="absolute inset-0 bg-blue-950 z-50 p-8 flex flex-col items-center justify-start text-center animate-in zoom-in duration-300 overflow-y-auto">
          <h2 className="text-3xl font-black text-white mb-3 mt-8 leading-tight">{talentoMenuAbierto}</h2>
          <p className="text-lg font-bold text-amber-200 mb-8">¿Cómo te gustaría participar? Puedes elegir una o varias opciones:</p>
          <div className="w-full max-w-sm space-y-4">
            {opcionesParticipacion.map((opcion) => {
              const elegida = (participacionSeleccionada[talentoMenuAbierto] || []).includes(opcion);
              return (
                <div key={opcion} className="p-5 bg-white/10 rounded-[30px] border-4 border-amber-400 flex items-center justify-between gap-4 shadow-sm">
                  <span className="text-lg font-black text-white text-left">{opcion}</span>
                  <button
                    type="button"
                    onClick={() => toggleParticipacion(talentoMenuAbierto, opcion)}
                    role="switch"
                    aria-checked={elegida}
                    aria-label={`${elegida ? 'Desactivar' : 'Activar'} ${opcion}`}
                    className={`w-20 h-11 rounded-full p-1 transition-colors duration-200 focus:outline-none shrink-0 border-2 ${elegida ? 'bg-emerald-600 border-emerald-800' : 'bg-slate-300 border-slate-400'}`}
                  >
                    <div className={`bg-white w-8 h-8 rounded-full shadow-md transform transition-transform duration-200 ${elegida ? 'translate-x-9' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={() => setTalentoMenuAbierto(null)} className="mt-10 mb-8 text-xl font-bold text-white/60 underline">
            Cerrar
          </button>
          <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40 font-bold">P-30</div>
        </div>
      )}
      <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-black font-bold">P-23</div>
    </div>
    );
  };

  // ============================================================================
  // CONTROLADOR PRINCIPAL Y ENVOLTURA DEL TELÉFONO (Mockup Celular)
  // ============================================================================

  const renderCurrentScreen = () => {
    if (step === 'inicio') return <RenderInicio />;
    if (step === 'biometric_scan') return <RenderBiometricScan />;
    if (step === 'cert_selection') return <RenderCertSelection />;
    if (step === 'entrada_automatica') return <RenderEntradaAutomatica />;
    if (step === 'login') return <RenderLogin />;
    if (step === 'access_options') return <RenderAccessOptions />;
    if (step === 'username_entry') return <RenderUsernameEntry />;
    if (step === 'access_code') return <RenderAccessCode />;
    if (step === 'emergencia_login') return <RenderEmergencia />;

    switch(currentView) {
      case 'mode_selection': return <RenderDashboard />; // P-07 sin función, redirige al Panel Principal
      case 'compania': return RenderListView("Buscar Compañía", centrosMayores, "text-blue-900", <Users size={36}/>);
      case 'rutas': return RenderListView("Ruta Segura", rutasSeguras, "text-emerald-800", <MapPin size={36}/>, "¡LLEGUÉ AL PUNTO SEGURO!");
      case 'comercio': return RenderListView("Comercios", comerciosLocales, "text-blue-800", <ShoppingBag size={36}/>, "¡YA ESTOY AQUÍ!");
      case 'talento': return <RenderTalentoSelection />;
      case 'mis_talentos_resumen': return <RenderMisTalentosResumen />;
      case 'cultura': return RenderListView("Cultura y Ocio", culturaOcio, "text-blue-950", <Ticket size={36}/>);
      case 'emergencia': return <RenderEmergencia />;
      case 'perfil': return <RenderPerfil />;
      case 'preferencias': return <RenderPreferencias />;
      case 'modos_asistencia': return <RenderModosAsistencia />;
      case 'clasificacion_funcional': return <RenderClasificacionFuncional />;
      case 'centro_vitalidad': return <RenderCentroVitalidad />;
      case 'categoria_detalle': return <RenderCategoriaDetalle />;
      case 'centro_tratamiento': return <RenderCentroTratamiento />;
      case 'buzon': return <RenderBuzon />;
      case 'contactos': return <RenderContactos />;
      case 'crear_contactos': return <RenderCrearContactos />;
      case 'guia_digital': return <RenderGuiaDigital />;
      case 'fotos_videos': return <RenderFotosVideos />;
      case 'configurar_menu': return RenderConfigurarMenu();
      case 'comentarios': return <RenderComentarios />;
      case 'demo_app': return <RenderDemoApp />;
      case 'configurar_entrada': return <RenderConfigurarEntrada />;
      default: return <RenderDashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-300 flex items-center justify-center p-4 font-sans">
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
        /* Cursor de mano sobre opciones clickeables, flecha normal en el resto */
        button, [role="button"], select, label[for] {
          cursor: pointer;
        }
        button:disabled {
          cursor: default;
        }
        /* WCAG 2.2 - 2.4.7 Foco visible: anillo de enfoque claro al navegar con teclado */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        select:focus-visible,
        textarea:focus-visible {
          outline: 4px solid #1e3a8a;
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>
      <div className="relative w-full max-w-[430px] h-[880px] bg-slate-900 rounded-[55px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-[10px] border-slate-800 p-2 overflow-hidden flex flex-col">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-44 h-8 bg-slate-900 rounded-b-3xl z-[60] flex items-center justify-center gap-4">
          <div className="w-16 h-2 bg-slate-800 rounded-full"></div>
          <div className="w-4 h-4 bg-blue-900/30 rounded-full border border-blue-900/50"></div>
        </div>
        <div className="relative w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col shadow-inner">
          <div className={`absolute inset-0 bg-slate-50 scroll-smooth ${step === 'login' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            {renderCurrentScreen()}
          </div>

          {/* MODAL GLOBAL "PEDIR AYUDA" (P-33) — compartido entre P-02 (Login) y P-08 (Panel Principal) */}
          {showPedirAyudaModal && (
            <div role="dialog" aria-modal="true" aria-label="Pedir Ayuda" className="absolute inset-0 bg-red-950/97 z-50 flex flex-col items-center justify-center p-8 gap-5 animate-in fade-in duration-200 overflow-y-auto">
              <AlertTriangle size={60} className="text-red-400 animate-bounce" />
              <h2 className="text-3xl font-black text-white text-center">¿Cómo quieres pedir ayuda?</h2>
              {/* CONTEO REGRESIVO: si nadie responde, se llama automáticamente */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-6xl font-black text-white tabular-nums">{segundosRestantesAyuda}</span>
                <span className="text-sm font-bold text-red-200 uppercase tracking-wide">Llamando automáticamente...</span>
              </div>
              {emergencia112Activa && (
                <button
                  onClick={() => { setShowPedirAyudaModal(false); setCallingContact({ name: '112 (URGENCIA)', phone: '112' }); }}
                  onMouseEnter={() => announceMenuOption('Llamar al 112')}
                  className="w-full min-h-[80px] flex items-center justify-center gap-4 bg-red-600 hover:bg-red-700 text-white rounded-[35px] font-black text-2xl shadow-2xl border-b-8 border-red-900 active:translate-y-2 transition-colors"
                >
                  <PhoneCall size={36} /> LLAMAR AL 112
                </button>
              )}
              {emergenciaMasivosActiva && (
                <button
                  onClick={() => {
                    const destinatarios = [
                      mensajesMasivosVisible.contact1 && contact1Name,
                      mensajesMasivosVisible.contact2 && contact2Name,
                      mensajesMasivosVisible.contact3 && contact3Name,
                    ].filter(Boolean);
                    speak(`Enviando mensaje a ${destinatarios.join(', ')}, y llamando a Urgencias.`);
                    setShowPedirAyudaModal(false);
                    setCallingContact({ name: contact1Name, phone: contact1Phone });
                  }}
                  onMouseEnter={() => announceMenuOption('Mensajes Masivos')}
                  className="w-full min-h-[80px] flex items-center justify-center gap-4 bg-purple-700 hover:bg-purple-800 text-white rounded-[35px] font-black text-2xl shadow-2xl border-b-8 border-purple-900 active:translate-y-2 transition-colors"
                >
                  <MessageSquare size={36} /> MENSAJES MASIVOS
                </button>
              )}
              <button
                onClick={() => setShowPedirAyudaModal(false)}
                onMouseEnter={() => announceMenuOption('Cancelar')}
                className="w-full min-h-[80px] flex items-center justify-center gap-4 bg-white/10 border-4 border-white/30 text-white rounded-[35px] font-black text-2xl active:scale-95 transition-transform"
              >
                <X size={36} /> CANCELAR
              </button>
              <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40 font-bold">P-33</div>
            </div>
          )}

          {showSuccess && (
            <div role="alert" aria-live="assertive" className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300 overflow-y-auto">
              <div className="bg-emerald-100 p-10 rounded-full mb-8 mt-10"><CheckCircle2 size={120} className="text-emerald-600" /></div>
              <h2 className="text-5xl font-black text-emerald-900 mb-4 leading-none">
                {currentView === 'talento' ? "¡Felicitaciones!" : currentView === 'perfil' ? "¡Felicitaciones!" : currentView === 'modos_asistencia' ? "¡Configurado!" : currentView === 'configurar_menu' ? "¡Guardado!" : "¡Llegaste Bien!"}
              </h2>
              {currentView === 'rutas' ? (
                <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-200 mb-10 w-full animate-pulse">
                  <MessageSquare size={48} className="text-blue-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-700 leading-tight">
                    Hemos enviado un <span className="text-blue-900 font-black">SMS a tu familiar</span> <br/>avisando que llegaste seguro a: <br/>
                    <span className="text-emerald-800 text-3xl font-black mt-2 block">{selectedItem?.nombre}</span>
                  </p>
                </div>
              ) : currentView === 'talento' ? (
                <div className="bg-emerald-50 p-6 rounded-3xl border-4 border-emerald-200 mb-10 w-full animate-pulse">
                  <Sparkles size={48} className="text-emerald-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-700 leading-tight">
                    ¡Hemos registrado tu talento!<br/>
                    <span className="text-emerald-800 text-3xl font-black mt-2 block">{selectedItem?.nombre || "Tu Talento"}</span>
                    <span className="text-xl mt-2 block text-slate-600">Pronto te llamaremos para preparar tu taller.</span>
                  </p>
                </div>
              ) : currentView === 'perfil' || currentView === 'crear_contactos' ? (
                <div className="bg-emerald-50 p-6 rounded-3xl border-4 border-emerald-200 mb-10 w-full animate-pulse">
                  <Sparkles size={48} className="text-emerald-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-700 leading-tight">
                    ¡Hemos guardado tus cambios!<br/>
                    <span className="text-emerald-800 text-3xl font-black mt-2 block">{currentView === 'crear_contactos' ? "Nuevo Contacto Añadido" : `${profileNombre} ${profileApellido}`}</span>
                    <span className="text-xl mt-2 block text-slate-600">La información ha sido guardada de forma segura.</span>
                  </p>
                </div>
              ) : currentView === 'modos_asistencia' ? (
                <div className="bg-emerald-50 p-6 rounded-3xl border-4 border-emerald-200 mb-10 w-full animate-pulse">
                  <Sparkles size={48} className="text-emerald-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-700 leading-tight">
                    ¡Ayuda Configurada Correctamente!<br/>
                    <span className="text-emerald-800 text-2xl font-black mt-2 block">Tus preferencias han sido guardadas.</span>
                    <span className="text-lg mt-2 block text-slate-600">Adaptaremos la interfaz según tu nivel de capacidad.</span>
                  </p>
                </div>
              ) : currentView === 'configurar_menu' ? (
                <div className="bg-emerald-50 p-6 rounded-3xl border-4 border-emerald-200 mb-10 w-full animate-pulse">
                  <Sparkles size={48} className="text-emerald-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-700 leading-tight">
                    ¡Hemos guardado tu Menú Principal!<br/>
                    <span className="text-emerald-800 text-2xl font-black mt-2 block">Tus opciones y nombres quedaron guardados.</span>
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-700 mb-10 leading-tight">Hemos avisado a <br/><span className="text-blue-900 text-3xl font-black">{selectedItem?.nombre}</span> <br/>que ya estás aquí.</p>
              )}
              <button onClick={() => setShowSuccess(false)} className="w-full py-6 bg-emerald-800 text-white rounded-[30px] font-black text-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform mb-10 mt-auto">
                <ArrowLeft size={32} /> VOLVER
              </button>
            </div>
          )}

          {isAssistantOpen && (
            <div className="absolute inset-0 bg-blue-950 z-50 p-8 flex flex-col items-center justify-center text-center animate-in slide-in-from-bottom duration-300 overflow-y-auto">
              <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40 font-bold">P-24</div>
              {!isListening ? (
                <div className="w-full flex flex-col items-center mt-3">
                  <div className="flex items-center justify-between w-full mb-4">
                    <button
                      onClick={() => setIsAssistantOpen(false)}
                      onMouseEnter={() => announceMenuOption('Volver')}
                      className="flex items-center text-white font-black text-2xl py-2 w-max"
                    >
                      <ArrowLeft size={36} className="mr-2" /> VOLVER
                    </button>
                    <button
                      onClick={() => {
                        const info = { titulo: "Asistente iAyuda", texto: `${username || 'Hola'}, estás en el asistente de inteligencia artificial. HOLA ${profileNombre}, soy ${profileNombreIA} tu IA encargada de ayudarte en el tema que selecciones.` };
                        setWhereAmIInfo(info);
                        setIsWhereAmIOpen(true);
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(`${info.titulo}. ${info.texto}`);
                          utterance.lang = 'es-MX';
                          utterance.rate = 0.9;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
                      className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                      aria-label="¿Dónde estoy? Explicación de esta pantalla"
                    >
                      <BrandLogo className="w-10" />
                      <span className="text-base font-bold text-amber-200 underline">¿Dónde estoy?</span>
                    </button>
                  </div>
                  <UserPhoto className="w-16 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-4 leading-tight">¿En qué te puedo ayudar?</h2>
                  <div className="bg-white/10 p-5 rounded-3xl border-2 border-white/20 mb-5 text-white text-lg font-bold max-w-sm leading-tight">
                    👋 HOLA <span className="text-amber-400 font-black">{profileNombre}</span>, soy <span className="text-amber-400 font-black">{profileNombreIA}</span> tu IA encargada de ayudarte en el tema que selecciones.
                  </div>
                  <div className="w-full max-w-sm mb-6">
                    <label className="block text-white text-lg font-black mb-2 text-left">Selecciona un tema:</label>
                    <select
                      value={aiSelectedTopic}
                      onChange={(e) => setAiSelectedTopic(e.target.value)}
                      className="w-full p-4 text-xl border-4 border-amber-400 rounded-2xl font-black bg-white text-blue-950 focus:outline-none focus:ring-4 focus:ring-amber-300"
                    >
                      <option value="">-- Elige un tema --</option>
                      <option value="Todos los temas">Todos los temas 🌟</option>
                      {menuVisible.compania && <option value="Buscar Compañía">Buscar Compañía 👥</option>}
                      {menuVisible.rutas && <option value="Ruta Segura">Ruta Segura 🗺</option>}
                      {menuVisible.comercio && <option value="Comercio">Comercio 🛍</option>}
                      {menuVisible.talento && <option value="Mi talento">Mi talento 🌟</option>}
                      {menuVisible.centro_vitalidad && <option value="Centro de Vitalidad">Centro de Vitalidad 💖</option>}
                      {menuVisible.cultura && <option value="Cultura y ocio">Cultura y ocio 🎟</option>}
                    </select>
                  </div>
                  {aiSelectedTopic ? (
                    <div className="w-full max-w-sm bg-emerald-600 text-white p-4 rounded-2xl font-black text-xl mb-6 border-4 border-emerald-400 flex items-center justify-center gap-2 shadow-lg">
                      <Sparkles size={24} className="text-amber-300 shrink-0 animate-pulse" />
                      <span>TEMA SELECCIONADO: {aiSelectedTopic}</span>
                    </div>
                  ) : (
                    <div className="w-full max-w-sm bg-red-600/20 text-red-200 p-4 rounded-2xl font-black text-lg mb-6 border-2 border-dashed border-red-500/50">
                      ⚠️ Selecciona un tema para poder hablar
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="relative mb-12 mt-10">
                    <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping scale-150"></div>
                    <div className="bg-amber-400 p-12 rounded-full relative"><Mic size={80} className="text-blue-950" /></div>
                  </div>
                  <h2 className="text-5xl font-black text-white animate-pulse mb-16">Te escucho...</h2>
                  <button onClick={() => setIsListening(false)} className="mt-auto text-3xl font-bold text-white/50 underline decoration-4 flex items-center justify-center gap-3 mb-10">
                    <ArrowLeft size={36} /> VOLVER
                  </button>
                </div>
              )}
            </div>
          )}

          {isPerfilPasswordOpen && (
            <div className="absolute inset-0 bg-blue-950 z-[150] p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 overflow-y-auto">
              <div className="flex items-center justify-between w-full mb-6">
                <button onClick={() => { setIsPerfilPasswordOpen(false); setStep(origenPerfil); }} onMouseEnter={() => announceMenuOption('Volver')}
                  className="flex items-center text-white font-black text-2xl py-2 w-max">
                  <ArrowLeft size={36} className="mr-2" /> VOLVER
                </button>
                <button onClick={() => openWhereAmI("Acceso a Perfil", "estás en la pantalla de acceso protegido al Perfil. Introduce tu nombre y tu contraseña, y toca Entrar, o toca Volver para regresar.")}
                  onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
                  className="flex flex-col items-center gap-1 active:scale-95 transition-transform" aria-label="¿Dónde estoy?">
                  <div
                    onMouseEnter={() => speak('Acceso a Perfil. estás en la pantalla de acceso protegido al Perfil. Introduce tu nombre y tu contraseña, y toca Entrar, o toca Volver para regresar.')}
                    onMouseLeave={() => window.speechSynthesis.cancel()}
                  >
                    <BrandLogo className="w-10" />
                  </div>
                  <span className="text-base font-bold text-amber-200 underline">¿Dónde estoy?</span>
                </button>
              </div>
              <div className="bg-white/10 p-6 rounded-full mb-4">
                <Lock size={56} className="text-amber-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 leading-tight">Acceso a Perfil</h2>
              <p className="text-base font-bold text-amber-300 mb-1 px-2">Usuario principal o invitado</p>
              <p className="text-base font-bold text-blue-200 mb-5 px-2">Usa el nombre y contraseña que ya tienes guardados.</p>
              <form onSubmit={handleValidatePerfilPassword} className="w-full max-w-sm flex flex-col gap-4">
                <input
                  type="text"
                  value={perfilNombreInput}
                  onChange={(e) => { setPerfilNombreInput(e.target.value); setPerfilPasswordError(false); }}
                  placeholder="Tu nombre"
                  autoComplete="off"
                  autoFocus
                  className="w-full p-5 text-2xl border-4 border-amber-400 rounded-[25px] focus:border-amber-300 outline-none font-black bg-white text-blue-950 text-center"
                />
                <input
                  type="password"
                  value={perfilPasswordInput}
                  onChange={(e) => { setPerfilPasswordInput(e.target.value); setPerfilPasswordError(false); }}
                  placeholder="Contraseña"
                  className="w-full p-5 text-3xl border-4 border-amber-400 rounded-[25px] focus:border-amber-300 outline-none font-black bg-white text-blue-950 text-center tracking-[0.3em]"
                />
                {perfilPasswordError && (
                  <p className="text-lg font-bold text-red-300">Por favor completa ambos campos para continuar.</p>
                )}
                <button type="submit" className="w-full py-5 bg-amber-400 text-blue-950 rounded-[30px] font-black text-2xl shadow-xl active:scale-95 transition-transform">
                  ENTRAR
                </button>
              </form>
              <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40 font-bold">P-25</div>
            </div>
          )}

          {isWhereAmIOpen && (
            <div className="absolute inset-0 bg-blue-950 z-[200] p-6 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 overflow-y-auto">
              <div className="bg-white/10 p-6 rounded-full mb-4 mt-6">
                <Info size={64} className="text-amber-400" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 leading-tight">{whereAmIInfo.titulo}</h2>
              <p className="text-xl font-bold text-amber-100 leading-relaxed mb-6 max-w-sm">{whereAmIInfo.texto}</p>
              <div className="w-full max-w-sm space-y-3 mt-auto mb-6">
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(`${whereAmIInfo.titulo}. ${whereAmIInfo.texto}`);
                      utterance.lang = 'es-MX';
                      utterance.rate = 0.9;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="w-full py-5 bg-white/10 border-4 border-amber-400 text-amber-300 rounded-[30px] font-black text-xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <Volume2 size={28} /> Repetir el mensaje
                </button>
                <button onClick={() => { setIsWhereAmIOpen(false); window.speechSynthesis && window.speechSynthesis.cancel(); }} className="w-full py-5 bg-amber-400 text-blue-950 rounded-[30px] font-black text-xl shadow-xl active:scale-95 transition-transform">
                  ENTENDIDO
                </button>
              </div>
            </div>
          )}

          {isQuickMenuOpen && (
            <div role="dialog" aria-modal="true" aria-label="Menú Rápido" className="absolute inset-0 bg-blue-950 z-50 p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 overflow-y-auto">
              {/* FILA SUPERIOR (estilo Encabezado G): VOLVER a la izquierda + foto del
                  ciudadano a la derecha. 1 toque en la foto = ayuda en voz del Menú
                  Rápido; 2 toques = ayuda escrita del Menú Rápido. */}
              <div className="flex items-center justify-between w-full mt-3 mb-6">
                <button
                  onClick={() => { setIsQuickMenuOpen(false); quickMenuBackAction(); }}
                  onMouseEnter={() => announceMenuOption('Volver')}
                  className="flex items-center text-white font-black text-2xl py-2 w-max"
                >
                  <ArrowLeft size={36} className="mr-2" /> VOLVER
                </button>
                <FotoAyudaCiudadano
                  className="w-20"
                  onAyudaEscrita={() => openWhereAmI("Menú Rápido", `${username || 'Hola'}, estás en el menú rápido. Puedes ir al Panel Principal, hablar con iAyuda, Pedir Ayuda si es una emergencia, tocar Volver para regresar, o Cerrar para irme para salir de la aplicación.`)}
                />
              </div>
              <div className="w-full max-w-sm space-y-4">
                {/* Atajo: ir directo al Panel Principal desde cualquier pantalla */}
                <button
                  onClick={() => { setIsQuickMenuOpen(false); setCurrentView('dashboard'); }}
                  onMouseEnter={() => announceMenuOption('Ir al Panel Principal')}
                  className="w-full py-6 bg-white text-blue-950 rounded-[30px] font-black text-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <Menu size={32} /> Panel Principal
                </button>
                {/* Atajo: abrir el asistente iAyuda */}
                <button
                  onClick={() => { setIsQuickMenuOpen(false); setIsAssistantOpen(true); }}
                  onMouseEnter={() => announceMenuOption('Hablar con iAyuda')}
                  className="w-full py-6 bg-amber-400 text-blue-950 rounded-[30px] font-black text-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <HelpCircle size={32} /> Hablar con iAyuda
                </button>
                {/* Atajo: pedir ayuda de emergencia sin volver al Panel */}
                <button
                  onClick={() => { setIsQuickMenuOpen(false); setShowPedirAyudaModal(true); }}
                  onMouseEnter={() => announceMenuOption('Pedir Ayuda')}
                  className="w-full py-6 bg-red-700 text-white rounded-[30px] font-black text-2xl shadow-xl border-b-8 border-red-900 active:translate-y-1 transition-transform flex items-center justify-center gap-3"
                >
                  <PhoneCall size={32} /> Pedir Ayuda
                </button>
                <div className="h-px bg-white/20 my-2" aria-hidden="true"></div>
                {/* Salir de la aplicación */}
                <button
                  onClick={() => { setIsQuickMenuOpen(false); handleOpenExitModal(); }}
                  onMouseEnter={() => announceMenuOption('Cerrar para irme')}
                  className="w-full py-6 bg-blue-900 text-white rounded-[30px] font-black text-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <X size={32} /> Cerrar para irme
                </button>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/60 font-bold">P-26</div>
            </div>
          )}

          {isFilterModalOpen && (
            <div className="absolute inset-0 bg-blue-950 z-50 p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 overflow-y-auto">
              <h2 className="text-5xl font-black text-white mb-8 mt-10 leading-tight">¿Qué zona prefieres?</h2>
              <button onClick={handleVoiceInputFilter} disabled={isListeningFilter} className={`w-full max-w-sm mb-8 py-6 rounded-[35px] font-black text-2xl shadow-xl flex items-center justify-center gap-4 transition-all border-4 ${isListeningFilter ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-amber-400 border-amber-600 text-blue-950 active:scale-95'}`}>
                <Mic size={40} /> {isListeningFilter ? "ESCUCHANDO..." : "DECIR ZONA POR VOZ"}
              </button>
              <div className="w-full max-w-sm space-y-6">
                <button onClick={() => { setActiveFilter('Todos'); setIsFilterModalOpen(false); }} className={`w-full py-8 rounded-[35px] font-black text-3xl shadow-xl active:scale-95 transition-colors ${activeFilter === 'Todos' ? 'bg-amber-400 text-blue-950 border-4 border-white' : 'bg-white text-blue-900'}`}>Todas las Zonas</button>
                <button onClick={() => { setActiveFilter('Centro'); setIsFilterModalOpen(false); }} className={`w-full py-8 rounded-[35px] font-black text-3xl shadow-xl active:scale-95 transition-colors ${activeFilter === 'Centro' ? 'bg-amber-400 text-blue-950 border-4 border-white' : 'bg-white text-blue-900'}`}>Zona Centro</button>
                <button onClick={() => { setActiveFilter('Barrios'); setIsFilterModalOpen(false); }} className={`w-full py-8 rounded-[35px] font-black text-3xl shadow-xl active:scale-95 transition-colors ${activeFilter === 'Barrios' ? 'bg-amber-400 text-blue-950 border-4 border-white' : 'bg-white text-blue-900'}`}>Otros Barrios</button>
              </div>
              <button onClick={() => setIsFilterModalOpen(false)} className="mt-10 text-3xl font-bold text-white/50 underline decoration-4 flex items-center justify-center w-full gap-3 mb-10">
                <ArrowLeft size={36} /> VOLVER
              </button>
            </div>
          )}

          {isRouteModalOpen && (
            <div className="absolute inset-0 bg-emerald-950 z-50 p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 overflow-y-auto">
              <h2 className="text-5xl font-black text-white mb-8 mt-10 leading-tight">¿De dónde a dónde vas?</h2>
              <div className="w-full space-y-6 text-left">
                <div className="flex flex-col gap-2">
                  <label className="text-2xl font-black text-emerald-200 ml-2">Punto de Origen:</label>
                  <div className="flex gap-3">
                    <input type="text" value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder={isListeningOrigen ? "Escuchando..." : "Ej: Mi casa..."} className="flex-grow w-full p-5 text-2xl border-4 border-emerald-300 rounded-[25px] font-bold text-emerald-950 bg-white focus:outline-none focus:border-amber-400 shadow-inner" disabled={isListeningOrigen} />
                    <button onClick={() => handleVoiceInputRoute('origen')} aria-label="Decir punto de origen por voz" className={`shrink-0 p-5 rounded-[25px] border-4 flex items-center justify-center shadow-md transition-all ${isListeningOrigen ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-amber-400 border-amber-600 text-emerald-950 active:scale-95'}`}><Mic size={36} /></button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-2xl font-black text-emerald-200 ml-2">Punto de Destino:</label>
                  <div className="flex gap-3">
                    <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} placeholder={isListeningDestino ? "Escuchando..." : "Ej: Mercado..."} className="flex-grow w-full p-5 text-2xl border-4 border-emerald-300 rounded-[25px] font-bold text-emerald-950 bg-white focus:outline-none focus:border-amber-400 shadow-inner" disabled={isListeningDestino} />
                    <button onClick={() => handleVoiceInputRoute('destino')} aria-label="Decir punto de destino por voz" className={`shrink-0 p-5 rounded-[25px] border-4 flex items-center justify-center shadow-md transition-all ${isListeningDestino ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-amber-400 border-amber-600 text-emerald-950 active:scale-95'}`}><Mic size={36} /></button>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsRouteModalOpen(false)} className="w-full mt-10 py-8 bg-emerald-400 text-emerald-950 rounded-[35px] font-black text-3xl shadow-xl active:scale-95 transition-transform border-b-8 border-emerald-600 flex items-center justify-center gap-3">
                <MapPin size={36} /> VER RUTA
              </button>
              <button onClick={() => setIsRouteModalOpen(false)} className="mt-8 text-2xl font-bold text-white/60 underline decoration-4 flex items-center justify-center w-full gap-3 mb-10">
                <ArrowLeft size={36} /> VOLVER
              </button>
            </div>
          )}

          {callingContact && (
            <div role="dialog" aria-modal="true" aria-label={`Llamando a ${callingContact?.name}`} className="absolute inset-0 bg-slate-900 z-[100] p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 overflow-y-auto">
              <div className="bg-red-500/20 p-12 rounded-full mb-8 mt-10 animate-pulse">
                <PhoneCall size={100} className="text-red-500" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4">Llamando a...</h2>
              <p className="text-5xl font-black text-amber-400 mb-2 leading-tight">{callingContact.name}</p>
              <p className="text-2xl font-bold text-slate-600 mb-16">{callingContact.phone}</p>
              <button onClick={() => setCallingContact(null)} className="mt-auto w-full py-8 bg-red-600 text-white rounded-[35px] font-black text-3xl shadow-2xl active:scale-95 transition-transform border-b-8 border-red-800 flex items-center justify-center gap-4 mb-10">
                <X size={40} /> COLGAR Y VOLVER
              </button>
            </div>
          )}

          {isExitModalOpen && (
            <div role="dialog" aria-modal="true" aria-label="¿Quieres salir de la aplicación?" className="absolute inset-0 bg-blue-950 z-[100] p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 overflow-y-auto">
              <div className="flex items-center justify-between w-full mt-3 mb-4">
                <button
                  onClick={() => setIsExitModalOpen(false)}
                  onMouseEnter={() => announceMenuOption('Volver')}
                  className="flex items-center text-white font-black text-2xl py-2 w-max"
                >
                  <ArrowLeft size={36} className="mr-2" /> VOLVER
                </button>
                <button
                  onClick={() => {
                    const info = { titulo: "Salir de la App", texto: `${username || 'Hola'}, estás en la pantalla de confirmación para salir. Toca Sí, Salir Ahora para cerrar la aplicación, o Volver para quedarte.` };
                    setWhereAmIInfo(info);
                    setIsWhereAmIOpen(true);
                    if ('speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      const utterance = new SpeechSynthesisUtterance(`${info.titulo}. ${info.texto}`);
                      utterance.lang = 'es-MX';
                      utterance.rate = 0.9;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  onMouseEnter={() => announceMenuOption('¿Dónde estoy?')}
                  className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                  aria-label="¿Dónde estoy? Explicación de esta pantalla"
                >
                  <BrandLogo className="w-10" />
                  <span className="text-base font-bold text-amber-200 underline">¿Dónde estoy?</span>
                </button>
              </div>
              <button
                onMouseEnter={speakWhereAmIOnHover}
                onMouseLeave={stopWhereAmIHoverAudio}
                className="active:scale-95 transition-transform"
                aria-label="Escuchar audio de ¿Dónde estoy? al pasar sobre la foto"
              >
                <UserPhoto className="w-24 mx-auto mb-6" />
              </button>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">¿Deseas salir de la aplicación?</h2>
              <p className="text-2xl font-bold text-blue-200 mb-12">Tendrás que volver a ingresar tu nombre para entrar.</p>
              <div className="w-full mt-auto space-y-4 mb-10">
                <button onClick={() => { setIsExitModalOpen(false); setStep('inicio'); }} className="w-full py-6 bg-red-600 text-white rounded-[30px] font-black text-2xl shadow-xl active:scale-95 transition-colors border-4 border-red-800">
                  SÍ, SALIR AHORA
                </button>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/40 font-bold">P-27</div>
            </div>
          )}

          {isMenuOpen && (
            <div role="dialog" aria-modal="true" aria-label="Menú de Perfil" className="absolute inset-0 bg-blue-950 z-50 p-8 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto text-white text-left">
              {/* ENCABEZADO estilo P-26, SIN flecha Volver: este menú de Perfil es una zona
                  de configuración independiente y no enlaza de vuelta con la app VES.
                  Se sale por "Salir de la App" o entrando a una de las opciones.
                  Solo la foto del ciudadano a la derecha: 1 toque = ayuda en voz del
                  Perfil; 2 toques = ayuda escrita. */}
              <div className="flex items-center justify-end w-full mt-3 mb-6">
                <FotoAyudaCiudadano
                  className="w-20"
                  onAyudaEscrita={() => openWhereAmI("Perfil", `${username || 'Hola'}, estás en tu menú de Perfil. Aquí puedes ver tus datos, tus preferencias, tus talentos, y tus contactos de emergencia.`)}
                />
              </div>
              <nav className="grid grid-cols-2 gap-4">
                <button onClick={() => { setCurrentView('perfil'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Datos Usuario')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <Users size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Datos Usuario</span>
                </button>
                <button onClick={() => { setCurrentView('clasificacion_funcional'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Clasificación Funcional')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <ShieldCheck size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Clasificación Funcional</span>
                </button>
                <button onClick={() => { setCurrentView('preferencias'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Mis Preferencias')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <Info size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Mis Preferencias</span>
                </button>
                <button onClick={() => { setCurrentView('modos_asistencia'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Modos de Asistencia')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <HelpCircle size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Modos de Asistencia</span>
                </button>
                <button onClick={() => { setCurrentView('talento'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Talentos')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <Star size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Talentos</span>
                </button>
                <button onClick={() => { setCurrentView('centro_vitalidad'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Centro de Vitalidad')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <Heart size={32} className="text-rose-400 animate-pulse" />
                  <span className="text-lg font-bold text-rose-100 leading-tight">Centro de Vitalidad</span>
                </button>
                <button onClick={() => { setCurrentView('emergencia'); setIsEditingEmergencia(true); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Configurar Pedir Ayuda')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <PhoneCall size={32} className="text-amber-400" />
                  <span className="text-lg font-bold text-amber-200 leading-tight">Configurar Pedir Ayuda</span>
                </button>
                <button onClick={() => { setCurrentView('crear_contactos'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Crear Contactos')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <UserPlus size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Crear Contactos</span>
                </button>
                <button onClick={() => { setCurrentView('configurar_menu'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Configurar el Menú Principal')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <Menu size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Configurar el Menú Principal</span>
                </button>
                <button onClick={() => { setCurrentView('configurar_entrada'); setIsMenuOpen(false); setEnteredFromMenu(true); }} onMouseEnter={() => announceMenuOption('Acceso a la App')} className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/15 active:scale-95 transition-transform">
                  <Fingerprint size={32} className="text-amber-400" />
                  <span className="text-lg font-bold leading-tight">Acceso a la App</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenExitModal}
                  onMouseEnter={() => announceMenuOption('Salir de la App')}
                  className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-red-900/40 border-2 border-red-500 rounded-2xl hover:bg-red-900/60 active:scale-95 transition-transform"
                >
                  <X size={32} className="text-red-400" />
                  <span className="text-lg font-black text-red-200 leading-tight">Salir de la App</span>
                </button>
              </nav>
              <div className="text-center text-[10px] text-white/40 font-bold mt-4">P-28</div>
            </div>
          )}
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-500 rounded-full z-[60]"></div>
      </div>
    </div>
  );
};

export default App;
