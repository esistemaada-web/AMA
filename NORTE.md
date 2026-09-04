# NORTE.md — Mundo AMA

> Mapa operativo para el equipo y los agentes. Actualizar al finalizar cada sprint y mentoría.

## Estado actual
- Fase: recuperación del MVP y preparación de beta local.
- Mercado inicial: San Cristóbal de La Laguna / Canarias.
- Objetivo inmediato: desplegar un staging funcional y validar un flujo completo del puente digital → territorio.
- Horizonte de trabajo: beta interna hacia finales de septiembre de 2026, sujeta a criterios de calidad.

## Slice prioritario
“¿Qué puedo hacer este fin de semana en La Laguna?”

El usuario debe poder:
1. ver 3–5 opciones vigentes y relevantes;
2. entender requisitos, accesibilidad, fecha, ubicación y coste;
3. guardar, contactar, pedir ayuda o apuntarse;
4. completar una acción real;
5. dar feedback sobre el resultado.

## Arquitectura inicial
- Frontend: PWA/web accesible.
- Repositorio: Git.
- Deploy: Vercel Preview + Production.
- Backend: Supabase/Postgres.
- Auth MVP: Supabase Auth + RLS.
- Archivos: Supabase Storage.
- DNS/CDN: Cloudflare.
- Fuentes: APIs y open data; Apify como apoyo controlado.
- CRM institucional: Twenty cuando sea necesario.
- Observabilidad de IA: Langfuse cuando haya IA en producción.

## Entidades mínimas
- Citizen
- Companion
- Organization
- Resource
- Source
- FreshnessCheck
- Need
- Action
- Outcome
- Report
- Consent

## Roles iniciales
- citizen
- companion
- organization_editor
- verifier
- moderator
- admin

## Eventos de producto
- resource_browse
- resource_open
- resource_save
- support_requested
- external_contact_started
- bridge_completed
- resource_reported
- companion_setup_completed

## Definition of Done — staging
- Instalación reproducible desde README.
- Variables de entorno documentadas sin secretos en el repo.
- Build sin errores.
- URL de Vercel accesible.
- Login funcional.
- RLS activado y probado.
- 25–50 recursos verificados de La Laguna.
- Fuente y fecha de frescura visibles internamente.
- Flujo prioritario completo.
- Analytics mínimos operativos.
- 5 pruebas de usuario documentadas.

## Sprint 1 — recuperar
- [ ] Localizar y ordenar el código actual.
- [ ] Inicializar Git y crear README.
- [ ] Ejecutar auditoría con Claude Code.
- [ ] Resolver errores de build.
- [ ] Eliminar secretos y datos de prueba sensibles.
- [ ] Desplegar preview en Vercel.

## Sprint 2 — estructurar
- [ ] Crear esquema Supabase.
- [ ] Implementar Auth + RLS.
- [ ] Modelar recursos, fuentes y frescura.
- [ ] Cargar piloto La Laguna.
- [ ] Crear rol de familiar/acompañante.

## Sprint 3 — validar puente
- [ ] Implementar slice “este fin de semana”.
- [ ] Medir las acciones clave.
- [ ] Probar con 5–10 personas y acompañantes.
- [ ] Registrar fricciones, abandonos y resultados reales.
- [ ] Decidir siguiente funcionalidad por evidencia.

## Decisiones aplazadas
- App nativa iOS/Android.
- WhatsApp como canal principal.
- Agentes autónomos.
- RAG/knowledge graph avanzado.
- Wearables y datos de salud.
- Expansión fuera de Canarias.
- Monetización obligatoria de Puntos Verdes.

## Guardarraíles
- La IA propone; el sistema determinista controla identidad, permisos y acciones irreversibles.
- No inferir edad, salud u otros atributos sensibles desde fotos o datos indirectos.
- No recopilar datos que no sean necesarios para el servicio.
- No automatizar publicación de datos sin fuente, fecha y verificación.
- No depender de una plataforma externa sin alternativa y estimación de coste.

## Preparación para mentoría #2
Compartir 48 horas antes:
- URL de Vercel.
- Repo o export del código.
- README del stack.
- Capturas del flujo principal.
- Lista de errores o decisiones abiertas.
- Resultado de las primeras pruebas.
