# GLUCOSIA — GA APP STANDARD 2026

## Regla de trabajo
- Producción `main` permanece intacta durante la terminación.
- Todo cambio se valida primero en `ga/glucosia-final-standard-2026`.
- Diseño GA: negro / dorado / blanco, mobile-first, tipografía legible.
- Idioma y país/región deben mantenerse separados.
- No se aceptan botones simulados ni pantallas incompletas dentro del alcance principal.

## Criterios de cierre
1. Auditoría visual y funcional completa.
2. Navegación, cierre de modales y estados vacíos consistentes.
3. Registro de glucosa para Tipo 1, Tipo 2, gestacional, prediabetes y otros perfiles.
4. Presión arterial habilitada según perfil y antecedentes.
5. Reporte médico completo y exportable.
6. Laboratorios y documentos dentro del expediente.
7. Preparación de integración Bluetooth para dispositivos compatibles, sin prometer compatibilidad no validada.
8. Recetario y contenido alineados al perfil del usuario.
9. Responsive móvil/escritorio.
10. Build de producción y preview antes de cualquier merge a `main`.

## Estado de base
La aplicación actual está construida con React + Vite. La mayor parte de la funcionalidad vive en `control-diabetes.jsx`; se conservará la base funcional y se refactorizará únicamente cuando reduzca riesgo y facilite QA.
