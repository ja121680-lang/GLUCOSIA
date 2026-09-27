# GLUCOSIA — GA APP STANDARD 2026

## Regla de trabajo
- Producción `main` no se modifica durante la terminación.
- Todo cambio debe validarse primero en una rama de cierre.
- Diseño: negro / dorado / blanco, tipografía legible, mobile-first.
- Idioma y país/región deben mantenerse separados.
- No se aceptan pantallas simuladas o botones sin función cuando la función es parte del alcance.

## Alcance de cierre
1. Auditoría visual y funcional completa.
2. Normalización de navegación, cierres y estados vacíos.
3. Revisión del registro de glucosa y diagnósticos.
4. Reporte médico completo y exportable.
5. Preparación de integración Bluetooth para glucómetro compatible.
6. Revisión de recetario y contenido por condición.
7. Responsive móvil/escritorio.
8. Build de producción sin errores.
9. Preview de validación antes de cualquier cambio en `main`.
10. Respaldo final y checklist comercial.

## Estado inicial detectado
El repositorio actual concentra prácticamente toda la interfaz en `control-diabetes.jsx`; se conservará la base funcional y se refactorizará solo cuando reduzca riesgo y facilite QA.
