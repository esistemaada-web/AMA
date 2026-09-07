# CLAUDE.md — Mundo AMA

Instrucciones para Claude Code al trabajar en este repo. Se lee automáticamente al
iniciar sesión, en **cualquier equipo** (viaja por Git). Es el "cerebro común"
entre la laptop y la PC de escritorio.

## Qué es esto

App **"Mundo AMA"** (a.k.a. VES): prototipo React de una app de accesibilidad para
personas adultas mayores. Casi todo el código de la app está en un único archivo,
**`src/App.jsx`** (~4000 líneas, un solo componente grande). Las pantallas se
identifican con números: P-01 (bienvenida), P-06 (selector VES/TAM), P-08 (Panel
Principal), P-35 (detalle de categoría), P-40 (mundo TAM), etc.

Documentos de referencia (ya en el repo):
- `SOUL.md` — propósito y principios no negociables.
- `NORTE.md` — estado, roadmap y arquitectura objetivo.
- `README.md` — stack y cómo arrancar (`npm install` + `npm run dev`).

## Trabajo en 2 equipos (laptop ↔ PC de escritorio)

El código vive en GitHub (`github.com/esistemaada-web/AMA`, rama `main`) como punto
común. Cada equipo tiene su propio clon local y su propia conversación de Claude.
Frases para sincronizar (hacerlas **sin pedir confirmación**):

### "TRABAJAR AQUÍ" — al empezar en un equipo
1. `git pull` en la carpeta del repo (clonar antes si no existe).
2. Si falta `node_modules`: `npm install`.
3. Leer la **Bitácora** (más abajo) para saber qué se hizo en la última sesión.
4. Decir al usuario en qué commit y `APP_VERSION` queda.
5. Si `git pull` da conflicto o hay cambios locales que chocan: avisar, NO forzar
   (nada de `reset --hard` ni `push --force` sin permiso explícito).

### "YA TERMINÉ AQUÍ" / "haz respaldo" — al terminar en un equipo
1. **Git** — comprobar `APP_VERSION` actualizada si se editó `App.jsx`;
   `git add` **SOLO** archivos de la app (`src/`, `public/`, config, `index.html`,
   `package*.json`, `.gitignore`, este `CLAUDE.md`) — **nunca** `Fotos/` ni nada
   personal; `git commit` con mensaje en español, varias `-m` para las viñetas y
   terminar con `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
2. **GitHub** — `git push` a `main`.
3. **Vercel** — el push dispara el redeploy solo; verificar comparando el
   `APP_VERSION` en `https://ama-eta-black.vercel.app/` con el del commit recién
   subido. Si el build de Vercel falla, avisar.
4. **Bitácora** — añadir 2-3 líneas al principio de la sección de abajo con lo que
   se hizo en esta sesión, y commitear/pushear también ese cambio.

## Trabajo en la sesión remota ("Nube GitHub")

Además de la laptop y la PC de escritorio, existe una **tercera forma de trabajar**:
una sesión de Claude Code en la nube (contenedor remoto efímero, se borra al cerrar
la sesión). Ahí el repo ya viene clonado solo al iniciar la sesión (no hace falta
`git clone` manual), pero **no hay forma de ver `localhost` en el navegador del
usuario** porque el servidor corre en la máquina remota, no en la del usuario.
Frases para esta sesión (hacerlas **sin pedir confirmación**):

### "Ver_Local_Nube" — para ver el avance sin publicar aún
1. Levantar `npm run dev` en el contenedor remoto.
2. Con el navegador headless disponible en el entorno, sacar capturas de pantalla
   de las pantallas relevantes al cambio hecho.
3. Mostrar las capturas al usuario en la conversación (no requiere push ni Vercel).

### "Terminar_NUBE" — para cerrar la sesión y publicar de verdad
Mismos pasos que "YA TERMINÉ AQUÍ" (ver abajo), con la diferencia de que acá la
sesión trabaja sobre una rama propia (no directo en `main`):
1. **Git** — comprobar `APP_VERSION` si se editó `App.jsx`; `git add` **SOLO**
   archivos de la app (nunca `Fotos/` ni nada personal); `git commit` con mensaje
   en español.
2. **GitHub** — mezclar (merge) la rama de la sesión a `main` y hacer `push` a
   `main`.
3. **Vercel** — verificar que el redeploy tomó el `APP_VERSION` nuevo en
   `https://ama-eta-black.vercel.app/`.
4. **Bitácora** — añadir 2-3 líneas al principio de la sección de abajo, y
   commitear/pushear también ese cambio a `main`.

## Convenciones

- **`APP_VERSION`**: constante al inicio de `src/App.jsx`, formato `DDMMAAAA-HH:MM`.
  Subirla en CADA edición de `App.jsx`, antes de terminar. Se muestra en P-01.
- Nunca `git add -A` a ciegas: `Fotos/` y otras carpetas personales no van al repo.
- El usuario escribe en español → responder en español.
- Verificar los cambios en el navegador (`npm run dev`, `localhost`) antes de darlos
  por hechos.
- Antes de tocar nada en un equipo, `git pull`. Antes de cambiar de equipo, push.

## Bitácora (lo más reciente arriba)

### 2026-09-07 — commit 6d25a65 · APP_VERSION 07092026-11:24
- P-16 Centro de Vitalidad: dos modos. **Config** (desde Datos Ciudadano):
  checklist con las 12 opciones + GUARDAR. **Normal** (desde el Panel Principal):
  solo se ven las opciones tildadas; contenedor sin nada marcado se oculta;
  aviso si no hay ninguna. Estado `vitalidadSel` + array `MODULOS_VITALIDAD`.
- Al GUARDAR en pantallas de Datos Ciudadano (P-12/P-13/P-14/Mis Talentos/Centro
  de Vitalidad) → confirmación **"Se grabó perfectamente"**, ahora pantalla
  **P-38**. VOLVER en P-38 regresa a P-11 y restaura `enteredFromMenu`, para que
  el siguiente VOLVER en P-11 vaya a P-28.
- Mis Talentos y Centro de Vitalidad: el mensaje/retorno a P-11 solo si se entró
  desde Datos Ciudadano (`subDesdeDatosCiudadano`).

### 2026-09-07 — commit d897136 · APP_VERSION 07092026-05:54
- Patrón común "acordeón exclusivo + GUARDAR fijo al pie + aviso al salir sin
  guardar" aplicado a P-21, P-11 y a las sub-pantallas de Datos Ciudadano
  (P-12 Mis Preferencias, P-13 Modos de Asistencia, P-14 Clasificación Funcional).
- P-21: al entrar, los 3 contenedores cerrados; al abrir uno se ocultan los otros.
- P-11: al abrir un apartado se ocultan los demás y los accesos de abajo; la barra
  GUARDAR guarda el apartado abierto.
- Diálogos "salir sin guardar": P-36 (de P-21) y P-37 (de P-11/P-12/P-13/P-14),
  con campana + vibración (móvil) + temblor (PC). Componentes reutilizables
  `BarraGuardarFija` y `DialogoSalirSinGuardar`.
- P-16 Centro de Vitalidad: checklist en cada uno de los 6 contenedores (12
  casillas) para elegir qué ver en el menú principal (estado `vitalidadSel`, aún
  sin cablear a una pantalla concreta).
- "Citas y Tratamientos" (antes "Centro de Tratamiento"); "Crear Actores" (antes
  "Crear Contactos"). Mis Talentos y Centro de Vitalidad movidos dentro de
  "Datos Ciudadano".
- `APP_VERSION` se toma SIEMPRE de la hora real de la PC (`date`), nunca estimada.

### 2026-09-07 — commit 1aa6ab6 · APP_VERSION 07092026-10:20
- P-11 "Datos Ciudadano" (antes "Datos Usuario"): ahora contiene Mis Preferencias,
  Clasificación Funcional, Modos de Asistencia, **Mis Talentos** y **Centro de
  Vitalidad** como sub-pantallas. Quitadas del menú P-28. Cada apartado del perfil
  tiene su propio botón GUARDAR.
- VOLVER inteligente (`subDesdeDatosCiudadano`): Mis Talentos / Centro de Vitalidad
  vuelven a P-11 si se entró desde ahí; desde el mundo VES o el asistente, igual que
  antes.
- "Centro de Tratamiento" renombrado a **"Citas y Tratamientos"** (id interno
  `centro_tratamiento` sin cambios). "Crear Contactos" → "Crear Actores".
- P-21 "Configura el Menú VES": fuera el botón grande "GUARDAR CAMBIOS" y los avisos
  anteriores; un único aviso centrado al final + botón GUARDAR ("Recuerda tocar
  GUARDAR para no perder los cambios hechos recientemente").
- P-21: al pulsar VOLVER con cambios sin guardar → campana de alerta + vibración
  (móvil) + temblor de pantalla (PC) + voz, y abre el diálogo **P-36** con
  GUARDAR Y SALIR / SALIR SIN GUARDAR / VOLVER. No deja salir sin elegir.

### 2026-09-05 — commit 8a88f8d · APP_VERSION 05092026-19:30
- P-08 / P-40 / P-21: los 3 contenedores muestran frases ("un Espacio Para
  Compartir", "para MOVERTE con seguridad, dentro y fuera de casa", "la TECNOLOGÍA,
  ya explicada para ti") en vez de "Soledad / Movilidad / Tecnología".
- iAyuda sacada de las 3 categorías (P-08, P-35 y P-21); sigue accesible desde el
  Menú Rápido. "la TECNOLOGÍA" pasó de 5 a 4 opciones.
- Chip indicador de continente: 2 líneas — fila 1 `[logo] + VES/TAM`, fila 2 la
  ruta donde está el usuario (categoría, o "categoría, opción"). Misma forma en
  P-08 y P-40.
- P-06: pantalla estática, sin scroll ni rebote; el contenido se encoge para que
  "PEDIR AYUDA" quepa entero siempre.
- P-35 "Espacio Para Compartir": descripción basada en sus submenús.
- Corregido bug móvil: la voz al tocar la foto "Ayudas" no sonaba en el teléfono
  (Safari/iOS bloquea `speechSynthesis` si no se llama dentro del gesto; se quitó
  el `setTimeout` y ahora habla de inmediato al primer toque).
- Responsive real: sin la maqueta decorativa de teléfono en móvil/tablet (<1280px);
  la app ocupa toda la pantalla del dispositivo.
