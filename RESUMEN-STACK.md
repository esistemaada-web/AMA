# Mundo AMA — Resumen del stack (para mentoría #2)

_Última actualización: 2026-09-10 · `APP_VERSION` desplegada: `09092026-09:12`_

## En una frase

Prototipo funcional (clicable) de la app **VES / Mundo AMA** para personas adultas
mayores: navegación, accesibilidad y todos los flujos de pantalla están
implementados y se pueden recorrer en vivo. **Todavía no hay backend**: no hay
base de datos, ni login real, ni datos de recursos de La Laguna. Es la base sobre
la que construir el slice que se habló en la mentoría #1.

## Enlaces

- **Staging (Vercel):** https://ama-eta-black.vercel.app/
- **Repo (GitHub):** https://github.com/esistemaada-web/AMA — rama `main`
- **Documentos de criterio:** [`SOUL.md`](./SOUL.md) (principios) · [`NORTE.md`](./NORTE.md) (roadmap y arquitectura objetivo)

## Stack actual

| Capa | Tecnología | Notas |
|---|---|---|
| UI | React 19 + Vite 8 | SPA, un solo bundle |
| Estilos | Tailwind CSS 4 (vía `@tailwindcss/postcss`) | |
| Iconos | lucide-react | |
| Estado | `useState` / `useRef` locales en un componente `App` | Sin store, sin router |
| Backend | — | No existe todavía |
| Persistencia | — | La app **no guarda nada**; al recargar vuelve a los valores por defecto (que se editan en los `useState` iniciales) |
| Auth | Simulada | Pantallas de reconocimiento facial / huella / contraseña son de mentira; la de "Acceso a Perfil" sí compara contra una contraseña en memoria |
| Hosting | Vercel | Deploy automático en cada push a `main`; preset Vite, sin variables de entorno |
| DNS | — | URL `*.vercel.app` por defecto |

## Estructura del código

- **`src/App.jsx` (~5400 líneas)** — casi toda la app. Un componente `App` gigante
  con ~40 funciones `RenderXxx` (una por pantalla) que cierran sobre el estado de
  `App`. Las pantallas se numeran: P-01 bienvenida, P-06 selector VES/TAM, P-08
  panel principal, P-33 pedir ayuda, P-39 crear actores, P-41/P-42 encuesta de
  ánimo, etc.
- `src/index.css`, `src/main.jsx` — arranque estándar de Vite.
- `src/*.jpg` / `*.png` — logos y foto de ciudadano por defecto, importados como assets.
- `CLAUDE.md` — convenciones + bitácora de sesiones (registro de cambios reciente).
- `Fotos/` — imágenes de referencia; no forma parte de la app.

Sin backend, sin carpeta `api/`, sin migraciones, sin tests.

## Pipeline de despliegue

`git push` a `main` → Vercel detecta el cambio → `npm run build` (Vite) →
publica `dist/` en https://ama-eta-black.vercel.app/. La versión visible en la
esquina de P-01 (`APP_VERSION`) permite verificar que el deploy tomó el último commit.

`npm run build` pasa limpio. `npm run lint` reporta 17 avisos, todos de hooks/estructura (ver deuda arquitectónica); el código muerto ya se limpió.

## Qué es real y qué está simulado hoy

| Funciona de verdad | Simulado / maqueta |
|---|---|
| Navegación entre pantallas y "¿Dónde estoy?" | Login biométrico (huella / rostro) |
| Accesibilidad: botones grandes, alto contraste, voz (`speechSynthesis`) | Llamadas telefónicas (pantalla de llamada de mentira) |
| Configuración del menú, perfil, contactos/actores (P-39) — en memoria | Datos de recursos, centros, rutas, comercios (arrays fijos de ejemplo) |
| "Envío real" de avisos de emergencia por enlaces `sms:` / `wa.me` / `mailto:` que abren las apps del teléfono (Opción A, sin servidor) | Envío automático de SMS/WhatsApp/correo (necesitaría backend + Twilio/Resend) |
| Encuesta de estado de ánimo (P-41/P-42) — en memoria | Persistencia del historial de ánimo |

## Auditoría 2026-09-10 — hallazgos y estado

Ordenados por impacto. Los 8 hallazgos fueron corregidos salvo donde se indica:

1. **Componentes definidos dentro del render** (5 casos): se remontan en cada
   cambio de estado global → un temporizador que salta borra lo que el usuario
   estaba tecleando. **Corregido de forma contenida en "Crear Actores"** (P-39):
   sus campos ahora son inputs controlados con estado a nivel de App, así que el
   remonte ya no pierde datos. El patrón de fondo (los otros 4 casos: `UserPhoto`,
   `FotoAyudaCiudadano`, `EncabezadoG`) se resuelve al partir el archivo — ver
   deuda arquitectónica; hoy no causan pérdida de datos visible.
2. ✅ **Cuenta atrás de "Pedir Ayuda"**: ya no dice "enviando mensaje" en falso;
   al agotarse con "mensajes masivos" activos abre el sub-paso con los enlaces
   reales `sms:`/`wa.me`/`mailto:` (que incluye el botón 112).
3. ✅ **Enlace `sms:`**: cambiado a `?&body=`, compatible con iOS y Android.
4. ✅ **`emergencia112Activa`**: ahora sí actúa — si se desactiva, al agotarse la
   cuenta atrás se llama al contacto principal en vez de al 112.
5. ✅ Pausar la cuenta atrás para ver los enlaces ahora la **reanuda** desde donde
   quedó, no la reinicia.
6. ✅ Guardar la encuesta de ánimo muestra su propio mensaje de éxito.
7. ✅ `min="P-01"` → `min="0"` en los dos sliders.
8. ✅ Lint: eliminadas las 32 variables/funciones muertas. Quedan 17 avisos de
   hooks/estructura, atados al refactor de módulos.

Ninguno rompía el build ni el staging.

## Deuda arquitectónica de fondo

- Todo en un archivo de ~5300 líneas y un único componente con decenas de `useState`.
  Los ~40 componentes de pantalla y los 5 ayudantes se definen **dentro** de ese
  componente, por lo que React los remonta en cada render (los 17 avisos de lint
  restantes vienen de aquí). Antes de meter backend conviene partir: `data/`,
  `components/`, `screens/`, `utils/` y consolidar estado (reducer o contextos por
  dominio).
- Sin persistencia, sin modelo de datos, sin capa de red.
- Sin tests ni CI.

## Siguiente paso (el slice de la mentoría #1)

"Que una persona pueda descubrir opciones verificadas en La Laguna y completar
una acción real fuera de la pantalla." Implica el Sprint 2 de `NORTE.md`:
Supabase (Postgres + Auth + RLS + Storage), modelo de datos (Citizen, Resource,
Source, FreshnessCheck, Action, Outcome…), roles/permisos, y cargar 25–50 recursos
verificados de La Laguna con fuente y fecha de frescura.
