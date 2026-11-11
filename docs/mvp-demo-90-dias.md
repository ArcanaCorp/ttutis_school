# TTUTIS — plan de MVP para demo y primeros colegios

**Objetivo:** llegar al inicio del año escolar con un MVP demostrable y operable para tres colegios de secundaria, cada uno con más de 800 alumnos (objetivo de capacidad: al menos 2.400 alumnos en total).

**Horizonte:** 90 días de preparación antes del inicio de clases. Las fechas de calendario deben fijarse cuando cada colegio confirme su fecha de apertura y disponibilidad para el piloto.

## Resultado que buscamos

Al finalizar el plan, TTUTIS debe poder demostrar y operar, con datos autorizados, los flujos esenciales de tres instituciones independientes:

1. El administrador configura el colegio, sus cinco grados, secciones, personal y alumnos mediante una importación revisable.
2. El colegio aprovisiona cuentas de alumnos, docentes y apoderados con autorización y trazabilidad.
3. El personal registra ingresos y salidas con QR y consulta/corrige asistencia conservando el historial.
4. Alumnos y apoderados consultan únicamente la información a la que tienen derecho.
5. La operación de un colegio no permite leer ni modificar datos de los otros dos.

La meta comercial propuesta es cerrar tres acuerdos de piloto o prestación antes del inicio de clases. Se debe acordar aparte si cuentan contratos firmados, pagos o cartas de intención.

## Alcance demostrable del MVP

### Incluir

- Autenticación funcional y aprovisionamiento administrado de cuentas.
- Roles y permisos mínimos: operador TTUTIS, administrador del colegio, operador de asistencia, docente, alumno y apoderado.
- Configuración institucional: sede, año académico, grados, secciones, asignaturas, docentes y matrículas.
- Importación CSV con vista previa, validación, errores descargables y confirmación antes de guardar.
- Relación verificable entre apoderados y alumnos; selector de hijos para apoderados con más de uno.
- Carnet QR con token opaco, revocación y rotación.
- Registro de entrada y salida, historial de eventos, consulta diaria y ajustes autorizados.
- Consulta móvil de perfil académico, horario y asistencia para alumno/apoderado.
- Comunicados básicos y notificación dentro de la app; push solo si el entorno de piloto está listo.
- Panel administrativo web para preparación y operación del colegio.
- Registro de auditoría de operaciones privilegiadas y exportación básica de asistencia.

### Dejar fuera del primer MVP

- Pagos y conciliación financiera.
- Libro completo de calificaciones.
- Gestión conductual avanzada, citaciones con confirmación y analítica avanzada.
- Integraciones externas y automatizaciones que no sean necesarias para operar asistencia y matrículas.

Estas funciones pueden aparecer como próximas etapas en la demo comercial, identificadas claramente como futuras y no como funciones disponibles.

## Secuencia de 90 días

| Etapa | Ventana | Entregable verificable | Criterio de salida |
|---|---:|---|---|
| 0. Cerrar alcance y entorno | Días 1–7 | Guion de demo, roles, datos de muestra y ambiente separado de producción | Ninguna prueba ni carga de demo altera la base real; se acuerda la fecha de clases y el responsable de cada colegio |
| 1. Acceso seguro | Días 8–21 | Políticas RLS por rol/institución, login, aprovisionamiento y cuentas de prueba | Pruebas de acceso cruzado entre tres colegios rechazadas; alta duplicada controlada |
| 2. Preparar colegios | Días 22–35 | Configuración académica, importación CSV y revisión de registros | Carga repetible de tres conjuntos sintéticos de 800+ alumnos; errores identificables antes de confirmar |
| 3. Operar asistencia | Días 36–52 | QR, lector/flujo de registro, entrada/salida, correcciones e historial | Eventos repetidos no duplican asistencia; ajustes conservan evento y motivo |
| 4. Experiencia de familias | Días 53–68 | App alumno/apoderado, horario, asistencia, selector familiar y comunicados | Cuentas de demostración solo muestran alumnos vinculados y datos del colegio correspondiente |
| 5. Piloto de tres colegios | Días 69–82 | Incorporación guiada, capacitación y ensayo con responsables | Cada colegio completa sus flujos principales y reporta incidencias con dueño y prioridad |
| 6. Demo comercial | Días 83–90 | Guion de 10 minutos, cuentas reiniciables, material comercial y checklist de demo | Demo ensayada sin acceso a producción ni datos personales reales; funciones futuras separadas de las disponibles |

## Guion sugerido para la demo del primer colegio

1. **Administrador:** muestra el tablero del colegio, la carga de alumnos y la organización de grados/secciones.
2. **Aprovisionamiento:** enseña cómo se revisa un registro y se emite una cuenta sin revelar secretos ni permitir auto-registro abierto.
3. **Apoderado:** abre la cuenta, cambia entre dos hijos y revisa el horario y la asistencia.
4. **Ingreso:** el operador escanea el QR de un alumno; aparece el evento y la asistencia consolidada.
5. **Trazabilidad:** el administrador consulta el historial y registra una corrección justificada sin borrar el evento original.
6. **Multiinstitución:** cambia a otra cuenta demo y demuestra que no puede ver el primer colegio.
7. **Cierre comercial:** presenta módulos futuros como roadmap, con estado explícito.

## Datos de demo y protección de producción

- Usar un proyecto/branch de staging separado del proyecto productivo `ttutis app`.
- Generar datos sintéticos para tres instituciones; no reutilizar nombres, documentos, teléfonos, credenciales ni tokens de alumnos reales.
- Crear cuentas demo con contraseñas temporales rotables y reset del entorno antes de cada presentación.
- No habilitar clientes hasta que las políticas RLS estén definidas y comprobadas por rol y por institución.
- Mantener claves privilegiadas exclusivamente en backend/secretos.

## Estado inicial confirmado en Supabase

- 35 tablas públicas; RLS está habilitado en todas, pero no hay políticas en ninguna.
- Historial remoto de migraciones vacío; es necesario establecer cómo se versionará el esquema antes de continuar con cambios.
- No hay Edge Functions desplegadas; `provision-user` existe solo como plantilla local.
- Datos base: 800 alumnos y matrículas, 20 secciones, 10 docentes, 200 ofertas y 200 asignaciones.
- Las 800 relaciones alumno-apoderado están en estado `PENDING`; no existen perfiles, membresías ni roles de colegio.
- No hay horarios, dispositivos QR ni registros de asistencia.
- Avisos Supabase: 29 claves foráneas sin índice de cobertura, un índice duplicado, 7 funciones con `search_path` mutable y una función `SECURITY DEFINER` con ejecución concedida a `anon` y `authenticated`.

## Decisiones que pueden mover el calendario

- Confirmar si el primer MVP se ofrece como producto operativo o como piloto acompañado por ARCANA; el segundo permite resolver excepciones manualmente mientras se valida.
- Acordar el hardware de lectura QR y si el primer piloto requiere operación sin conexión.
- Confirmar formatos y calidad de los padrones de los tres colegios.
- Definir responsable de soporte durante las primeras semanas de clases.
- Confirmar infraestructura de staging y presupuesto de operación.

## Orden inmediato de trabajo

1. Crear/confirmar ambiente de staging y datos sintéticos; no usar producción para pruebas.
2. Diseñar y revisar la matriz de roles/RLS antes de abrir acceso desde la app.
3. Definir contratos de importación y aprovisionamiento de cuentas.
4. Implementar y validar el primer recorrido vertical: importar alumno → vincular apoderado → emitir acceso → registrar QR → consultar asistencia.
5. Convertir ese recorrido en demo repetible y después ampliar a los tres colegios.
