# Mundo AMA

Puente de confianza entre el mundo digital y la vida real para personas adultas mayores. Ver [SOUL.md](./SOUL.md) (propósito y principios) y [NORTE.md](./NORTE.md) (estado, roadmap y arquitectura objetivo).

## Estado actual

Prototipo clicable en React (simulador de teléfono), sin backend todavía. Es el punto de partida del Sprint 1 descrito en NORTE.md: recuperar el MVP, auditarlo y desplegarlo en staging antes de construir el slice "¿Qué puedo hacer este fin de semana en La Laguna?".

## Stack

- React 19 + Vite
- Tailwind CSS 4
- lucide-react (iconos)
- Sin backend aún (Supabase/Postgres es el objetivo, ver NORTE.md → Arquitectura inicial)

## Arrancar en local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Variables de entorno

Ninguna por ahora. Cuando se incorpore Supabase (Sprint 2 de NORTE.md), documentar aquí las variables necesarias (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc.) sin exponer secretos en el repo.

## Notas

- La carpeta `Fotos/` contiene imágenes usadas como referencia/demo; pendiente de revisión de privacidad antes de la beta.
- Versión de la app: constante `APP_VERSION` en [`src/App.jsx`](./src/App.jsx), formato `DDMMAAAA-HH:MM`.
