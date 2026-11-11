# TTUTIS
## Documento técnico de arquitectura, alcance y estado del desarrollo

**Versión:** 1.0  
**Fecha:** 5 de noviembre de 2026  
**Estado:** Desarrollo inicial — preparación del primer colegio piloto  
**Empresa desarrolladora:** ARCANA CORP  
**Producto:** Plataforma de gestión y comunicación educativa

---

# 1. Visión general del producto

TTUTIS es una plataforma tecnológica para la gestión de instituciones educativas, diseñada para centralizar la información académica, administrativa y operativa de un colegio, mejorar la comunicación entre la institución y las familias, y digitalizar procesos escolares que normalmente se realizan de manera manual.

El producto debe permitir que un colegio gestione sus alumnos, apoderados, docentes, personal, matrículas, aulas, horarios, asistencia y comunicaciones desde un sistema centralizado.

Su principal propuesta de valor es conectar tres elementos:

1. **Gestión institucional:** administración de información, personal, alumnos y procesos escolares.
2. **Seguimiento académico y operativo:** asistencia, horarios, calificaciones, observaciones y evolución del alumno.
3. **Comunicación con las familias:** notificaciones y acceso a información relevante de sus hijos.

TTUTIS no debe convertirse en un conjunto de aplicaciones independientes que duplican información. Debe funcionar como una plataforma integrada con una fuente de datos central.

## 1.1. Objetivo inicial

Implementar TTUTIS en un primer colegio piloto con las siguientes características:

- Más de 800 alumnos.
- Todos los alumnos pertenecen al nivel secundario.
- Cinco grados.
- Cuatro secciones por grado.
- Aproximadamente 40 alumnos por sección.
- Docentes, apoderados y personal administrativo.
- Año académico de demostración 2027.

El objetivo inmediato es construir una versión funcional, estable y segura que pueda operar en este colegio.

No se debe desarrollar toda la funcionalidad futura antes de validar el funcionamiento de los procesos principales.

---

# 2. Alcance funcional

## 2.1. Aplicación del alumno

El alumno tendrá una cuenta personal desde la que podrá consultar:

- Inicio y resumen de actividad.
- Horario de clases.
- Cursos y asignaturas.
- Asistencia.
- Calificaciones, cuando esté habilitado el módulo.
- Comunicados institucionales.
- Notificaciones.
- Perfil personal.

El alumno no podrá modificar información académica o administrativa que corresponda al colegio.

## 2.2. Aplicación del apoderado

El apoderado tendrá una cuenta desde la que podrá consultar la información de uno o varios alumnos bajo su representación.

Funciones previstas:

- Consultar la información de sus hijos.
- Cambiar entre hijos mediante un selector familiar.
- Consultar asistencias.
- Recibir notificaciones de ingreso y salida.
- Consultar horarios.
- Consultar calificaciones.
- Recibir comunicados.
- Consultar observaciones y llamados de atención.
- Recibir citaciones y reuniones.
- Consultar información de pagos escolares cuando el colegio tenga habilitado ese módulo.

El sistema debe permitir que un apoderado tenga varios hijos, incluso en diferentes grados, secciones, niveles o instituciones.

La relación entre apoderado y alumno debe ser explícita, verificable y administrable por la institución.

Un usuario no obtiene acceso a un alumno únicamente por conocer su código o sus datos personales.

## 2.3. Aplicación del docente

El docente tendrá acceso a sus asignaciones y a las herramientas que correspondan a sus permisos.

Funciones previstas:

- Consultar sus cursos y secciones.
- Consultar listas de alumnos.
- Consultar horarios.
- Registrar asistencia cuando tenga autorización.
- Registrar calificaciones cuando esté habilitado.
- Registrar observaciones.
- Realizar seguimiento de alumnos.
- Publicar comunicados según permisos.
- Consultar información académica de sus secciones asignadas.

Un docente no debe tener acceso automático a todos los alumnos del colegio.

El acceso debe estar determinado por su relación institucional, asignaciones y permisos.

## 2.4. Panel administrativo del colegio

El personal autorizado administrará la operación del colegio.

Funciones previstas:

### Administración institucional
- Información general del colegio.
- Configuración institucional.
- Gestión de sedes.
- Gestión de personal.
- Gestión de roles y permisos.

### Gestión de personas
- Registro de alumnos.
- Registro de apoderados.
- Registro de docentes.
- Registro de personal administrativo.
- Edición y actualización de información.

### Gestión académica
- Años académicos.
- Periodos académicos.
- Grados.
- Secciones.
- Asignaturas.
- Oferta académica.
- Matrículas.
- Asignaciones docentes.
- Horarios.

### Gestión operativa
- Asistencia.
- Ingresos y salidas.
- Credenciales QR.
- Dispositivos de lectura.
- Correcciones de asistencia.
- Historial de eventos.

### Gestión de comunicación
- Comunicados.
- Notificaciones.
- Citaciones.
- Reuniones.
- Observaciones.
- Seguimiento de alumnos.

### Gestión financiera
- Pagos escolares.
- Conceptos de cobro.
- Estado de cuenta familiar.
- Historial de pagos.
- Reportes financieros.

El módulo financiero será independiente del núcleo académico y podrá habilitarse posteriormente.

---

# 3. Alcance del MVP

El MVP debe priorizar los procesos necesarios para que el primer colegio pueda comenzar a operar.

## 3.1. Prioridad inmediata

1. Estructura institucional del colegio.
2. Gestión de alumnos y apoderados.
3. Gestión de docentes y personal.
4. Matrículas y organización académica.
5. Aprovisionamiento de cuentas.
6. Autenticación y autorización.
7. Carnets QR.
8. Registro de ingresos y salidas.
9. Consulta de asistencia.
10. Notificaciones esenciales a los apoderados.
11. Panel administrativo.

## 3.2. Funcionalidades posteriores

- Registro completo de calificaciones.
- Observaciones y seguimiento conductual.
- Comunicados avanzados.
- Citaciones y reuniones.
- Importaciones masivas más completas.
- Pagos escolares.
- Reportes avanzados.
- Aplicación institucional con funcionalidades adicionales.

Estas funcionalidades deben incorporarse progresivamente, sin bloquear la implementación de los procesos principales.

## 3.3. Criterio de alcance

No construir funcionalidades que todavía no sean necesarias para el primer colegio.

La arquitectura debe permitir agregarlas posteriormente, pero no se deben crear tablas, servicios, integraciones o procesos complejos sin una necesidad funcional concreta.

---

# 4. Arquitectura tecnológica

## 4.1. Backend y base de datos

**Supabase + PostgreSQL**

Supabase será la infraestructura principal de backend.

Componentes:

- PostgreSQL: persistencia de datos.
- Supabase Auth: autenticación de usuarios.
- Edge Functions: lógica de servidor y operaciones privilegiadas.
- Row Level Security (RLS): control de acceso a registros.
- Storage: almacenamiento de archivos e imágenes.
- Realtime: actualizaciones en tiempo real cuando sean necesarias.

La base de datos debe ser la fuente central de información del sistema.

## 4.2. Frontend

La arquitectura prevista contempla:

- Aplicaciones móviles con React Native y Expo.
- Panel web administrativo con Next.js.
- TypeScript como lenguaje principal.
- Componentes y lógica compartida cuando resulte conveniente.

El frontend nunca debe contener claves privilegiadas de Supabase.

Las operaciones sensibles deben pasar por el backend.

## 4.3. Patrón arquitectónico

Se recomienda un **monolito modular con backend centralizado**.

No necesitamos microservicios en esta etapa.

Los dominios deben mantenerse separados a nivel lógico:

- Core institucional.
- Personas e identidades.
- Gestión académica.
- Asistencia.
- Autenticación y acceso.
- Comunicación.
- Finanzas.

Esto permite evolucionar cada dominio sin añadir complejidad de infraestructura innecesaria.

---

# 5. Modelo de datos y estructura existente

La base de datos ya contiene una estructura considerable. El desarrollo no debe comenzar nuevamente desde cero.

Se ha trabajado con dominios que cubren:

## 5.1. Núcleo institucional

Tablas principales:

- `institutions`
- `campuses`
- `profiles`
- `institution_memberships`
- `membership_campuses`
- `roles`
- `permissions`
- `role_permissions`
- `membership_role_assignments`

Responsabilidades:

- Identificar la institución.
- Administrar sedes.
- Vincular usuarios con instituciones.
- Gestionar roles.
- Gestionar permisos.
- Determinar el alcance de acceso a sedes.

## 5.2. Personas y relaciones

Tablas principales:

- `people`
- `students`
- `student_guardians`
- `institution_staff`
- `teacher_details`
- `profile_person_links`
- `user_access_codes`

Responsabilidades:

- Mantener identidades personales.
- Registrar alumnos.
- Registrar apoderados.
- Registrar personal.
- Vincular cuentas de usuario con personas.
- Administrar códigos de acceso.

Una identidad personal no debe confundirse con una cuenta de autenticación.

Una persona puede existir en el colegio sin tener una cuenta activa.

## 5.3. Gestión académica

Tablas principales:

- `academic_years`
- `academic_periods`
- `grades`
- `sections`
- `enrollments`
- `subjects`
- `course_offerings`
- `teacher_assignments`
- Tablas relacionadas con horarios.

Responsabilidades:

- Definir años académicos.
- Configurar periodos.
- Organizar grados y secciones.
- Registrar matrículas.
- Configurar asignaturas.
- Relacionar docentes con ofertas académicas.
- Administrar horarios.

## 5.4. Asistencia

La estructura incluye tablas para:

- Credenciales QR.
- Dispositivos de asistencia.
- Eventos de asistencia.
- Registros de asistencia.
- Ajustes de asistencia.
- Sesiones de asistencia.
- Procesamiento de notificaciones mediante outbox.

Tablas identificadas durante el trabajo:

- `qr_credentials`
- `attendance_devices`
- `attendance_events`
- `attendance_records`
- `attendance_adjustments`

La asistencia debe mantener una separación entre:

1. Evento físico registrado por el dispositivo.
2. Interpretación del evento.
3. Registro consolidado de asistencia.
4. Corrección o ajuste autorizado.

No se debe permitir que una corrección administrativa elimine la trazabilidad del evento original.

## 5.5. Estado de la base de datos

Durante la auditoría se identificaron 37 tablas públicas con RLS habilitado, distribuidas principalmente en los dominios institucional, personas, académico y asistencia.

Esto no significa que todas las funcionalidades estén terminadas.

RLS habilitado tampoco significa que todas las políticas de seguridad estén implementadas y verificadas.

Antes de abrir el acceso desde los clientes se deben revisar las políticas de cada tabla.

---

# 6. Modelo de identidad y autenticación

Esta es una de las partes más importantes de TTUTIS.

## 6.1. Separación entre persona y cuenta

Se utilizan dos conceptos:

**Persona (`people`):** representa a un individuo dentro de los datos del colegio.

**Perfil (`profiles`):** representa una cuenta de usuario global asociada a Supabase Auth.

La relación es:

`auth.users` → `profiles` → `profile_person_links` → `people`

Esto permite que una persona tenga una identidad institucional y que una cuenta pueda vincularse a distintas identidades institucionales cuando corresponda.

No se deben crear cuentas automáticamente por el simple hecho de registrar una persona.

## 6.2. Tipos de acceso

### Alumnos
- Código institucional.
- Contraseña.

### Docentes
- Código institucional.
- Contraseña.

### Personal administrativo
- Código institucional.
- Contraseña.

### Apoderados
- Código global.
- Contraseña.
- Una cuenta puede gestionar varios hijos.

### Administrador general del colegio
- Correo electrónico.
- Contraseña.

## 6.3. Formato de códigos

Se definió como formato de referencia:

`^[A-Z][0-9]{8}$`

Ejemplos:

- S78529630
- N52639025
- A70506930

Los códigos son identificadores aleatorios.

No deben generarse a partir del DNI ni de sus dígitos reordenados.

El DNI, cuando exista, debe mantenerse como dato personal independiente.

## 6.4. Tabla `user_access_codes`

Estructura existente:

- `id`
- `profile_id`
- `institution_id`
- `code`
- `code_type`
- `status`
- `created_at`
- `revoked_at`

Tipos:

- `GLOBAL`: código global, sin institución.
- `INSTITUTIONAL`: código vinculado a una institución.

Restricciones importantes:

- Los códigos son únicos globalmente.
- Un perfil puede tener un código global activo.
- Un perfil puede tener un código institucional activo por institución.
- Los códigos revocados no se reutilizan.
- Un código identifica al usuario, pero no autoriza operaciones.

## 6.5. Flujo de autenticación

Supabase Auth utiliza normalmente correo electrónico y contraseña.

El acceso mediante códigos personalizados necesita una capa de resolución.

Flujo previsto:

1. El usuario ingresa su código y contraseña.
2. El cliente envía los datos al endpoint de autenticación.
3. Una Edge Function valida el formato del código.
4. Busca el código activo.
5. Resuelve el perfil asociado.
6. Obtiene la identidad de autenticación correspondiente de forma segura.
7. Ejecuta la autenticación de Supabase.
8. Devuelve la sesión al cliente.
9. El backend verifica posteriormente membresías, roles y permisos.

La implementación no debe exponer el correo interno de Auth ni permitir enumerar códigos existentes.

Se deben implementar respuestas genéricas, protección contra fuerza bruta, limitación de solicitudes y auditoría.

No se deben almacenar contraseñas propias ni contraseñas en texto plano.

## 6.6. Autorización

Autenticación y autorización son procesos distintos.

Estar autenticado no significa tener permiso para consultar o modificar cualquier información.

La autorización debe considerar:

- Estado de la cuenta.
- Membresía institucional.
- Estado de la membresía.
- Roles asignados.
- Permisos.
- Alcance de sedes.
- Relación entre apoderado y alumno.
- Asignaciones académicas.
- Contexto de la operación.

---

# 7. Aprovisionamiento de cuentas

ARCANA/operadores TTUTIS crearán las cuentas iniciales del colegio.

El colegio podrá registrar alumnos y docentes mediante:

- Registro manual.
- Importación sencilla CSV o Excel.

Proceso previsto:

1. Registrar o importar los datos.
2. Validar los registros.
3. Revisar duplicados y errores.
4. Confirmar la información.
5. Crear las cuentas correspondientes.
6. Generar códigos de acceso.
7. Establecer contraseñas provisionales.
8. Enviar las credenciales.

La carga de datos no debe enviar credenciales automáticamente.

Primero se revisa y confirma la información.

Para el primer MVP se puede priorizar el envío por correo electrónico. La integración de WhatsApp queda para una etapa posterior.

## 7.1. Contraseñas provisionales

Las cuentas creadas mediante aprovisionamiento deben recibir una contraseña provisional segura.

Debe existir un proceso para obligar al usuario a cambiarla en su primer acceso.

La contraseña provisional no debe guardarse en la base de datos en texto plano ni registrarse en logs.

---

# 8. Seguridad y control de acceso

La seguridad debe diseñarse desde el backend y la base de datos.

## 8.1. Row Level Security

Las tablas sensibles deben tener RLS.

Las políticas deben garantizar que un usuario solo acceda a los registros autorizados.

No basta con filtrar datos desde React o Next.js.

## 8.2. Claves privilegiadas

La clave `service_role` no debe utilizarse en:

- Aplicaciones móviles.
- Navegadores.
- Código frontend.
- Variables públicas.
- Repositorios públicos.

Su uso debe quedar restringido al backend seguro.

## 8.3. Edge Functions

Las operaciones privilegiadas deben ejecutarse desde funciones de servidor.

Ejemplos:

- Aprovisionamiento de usuarios.
- Resolución de códigos de acceso.
- Emisión de credenciales.
- Operaciones administrativas sensibles.
- Procesos de notificación.

Toda función privilegiada debe verificar quién realiza la solicitud y qué permisos tiene.

## 8.4. Auditoría

Las operaciones sensibles deben dejar trazabilidad:

- Quién ejecutó la operación.
- Qué operación realizó.
- Sobre qué entidad.
- Cuándo ocurrió.
- Resultado.
- Motivo cuando corresponda.

No se debe confiar únicamente en los datos enviados por el cliente para determinar la identidad del operador.

---

# 9. Sistema de asistencia mediante QR

El colegio utilizará carnets físicos para identificar a los alumnos.

Cada carnet contendrá:

- Identidad visual del colegio.
- Fotografía.
- Nombres y apellidos.
- Código de alumno.
- Grado y sección.
- Código QR.

## 9.1. Seguridad del QR

El QR no debe contener DNI, nombres, correo ni otra información personal.

Debe contener un token opaco, aleatorio y revocable.

El sistema debe permitir:

- Emitir credenciales.
- Renovarlas.
- Revocarlas.
- Consultar su historial.
- Asociarlas a un alumno.

## 9.2. Registro de eventos

El sistema debe soportar:

- `ENTRY`: ingreso.
- `EXIT`: salida.
- `TEMP_EXIT`: salida temporal.
- `RETURN`: retorno.

El colegio podrá habilitar o deshabilitar los tipos de eventos que utilice.

No todas las instituciones necesariamente necesitarán salidas temporales.

## 9.3. Dispositivos

El sistema debe permitir registrar dispositivos autorizados para escanear carnets.

Cada dispositivo debe estar vinculado a la institución y contar con los permisos correspondientes.

No cualquier usuario puede registrar eventos de asistencia.

---

# 10. Datos de demostración ya creados

Se ha inicializado una institución ficticia para desarrollar y probar TTUTIS.

## 10.1. Institución

- Nombre legal: Colegio Demo TTUTIS.
- Nombre comercial: TTUTIS Demo.
- Slug: `ttutis-demo`.
- ID: `278f0a45-2a3c-4521-88a9-e7a47a97d9da`.

Sede principal:

- Nombre: Sede Principal.
- Código: `SEDE-01`.
- ID: `6a3dfb5a-45fd-4c81-be48-1cbfd43e44f5`.

## 10.2. Año académico

Año: 2027.

- ID: `c8451b54-f329-4525-a69e-33c798bc8ee1`.
- Inicio: 1 de marzo de 2027.
- Fin: 31 de diciembre de 2027.
- Estado: `PLANNED`.

Se crearon cuatro bimestres:

- BIM-01: Primer Bimestre.
- BIM-02: Segundo Bimestre.
- BIM-03: Tercer Bimestre.
- BIM-04: Cuarto Bimestre.

Las fechas son referenciales para la demostración, no constituyen un calendario oficial del colegio.

## 10.3. Grados y secciones

Se crearon cinco grados de secundaria.

Cada grado tiene cuatro secciones:

- A
- B
- C
- D

Total:

- 5 grados.
- 20 secciones.
- 4 secciones por grado.

## 10.4. Asignaturas

Se registraron diez áreas curriculares de demostración:

1. Matemática.
2. Comunicación.
3. Inglés.
4. Arte y Cultura.
5. Ciencias Sociales.
6. Desarrollo Personal, Ciudadanía y Cívica.
7. Educación Física.
8. Educación Religiosa.
9. Ciencia y Tecnología.
10. Educación para el Trabajo.

Se crearon 200 ofertas académicas: diez asignaturas para cada una de las veinte secciones.

Estas asignaturas son datos de demostración y deberán validarse con el colegio.

## 10.5. Docentes

Se registraron diez docentes ficticios.

Cada uno tiene asignaciones en las veinte secciones.

Total:

- 10 identidades docentes.
- 10 registros de personal.
- 10 registros de detalles docentes.
- 200 asignaciones docentes.

Esta distribución es simplificada para la demostración. No representa una distribución realista de carga horaria.

## 10.6. Alumnos

Se crearon:

- 800 identidades personales.
- 800 registros de alumnos.
- 800 matrículas.

Distribución:

- 40 alumnos por sección.
- 160 alumnos por grado.
- 800 alumnos en total.

Los códigos de demostración van desde `DEMO0001` hasta `DEMO0800`.

No se utilizaron DNI, teléfonos ni correos reales.

## 10.7. Apoderados

Se crearon:

- 800 identidades ficticias de apoderados.
- 800 relaciones entre alumnos y apoderados.

Todas las relaciones están en estado `PENDING`.

No existen todavía relaciones verificadas ni cuentas activas de esos apoderados.

Los correos terminados en `.invalid` son marcadores de demostración y no deben utilizarse como destinos reales de envío.

**Importante:** los datos de demostración no implican que las cuentas, credenciales, matrículas o relaciones familiares estén listas para producción.

---

# 11. Estado actual del desarrollo de Edge Functions

El repositorio local está ubicado en:

`D:\STARTUP\ttutis`

Se instaló y ejecutó Supabase CLI:

- Versión: 3.0.0.
- Se ejecutó `supabase init`.
- Se creó `supabase/functions/provision-user`.

El proyecto Supabase correcto está vinculado:

- Nombre: `ttutis app`.
- Project Ref: `eeybnagdnlmiazdyvylp`.
- Región: East US (Ohio).

La base de datos fue comprobada mediante SQL Editor y se verificó la existencia de:

- `institutions`
- `people`
- `students`
- `profiles`
- `profile_person_links`
- `user_access_codes`

Por lo tanto, el repositorio local está vinculado al proyecto TTUTIS correcto.

## 11.1. Configuración existente

Archivo `supabase/config.toml`:

```toml
[functions.provision-user]
enabled = true
verify_jwt = true
import_map = "./functions/provision-user/deno.json"
entrypoint = "./functions/provision-user/index.ts"
```

La función se creó utilizando:

```powershell
npx supabase functions new provision-user --auth user
```

Plantilla generada:

```typescript
import "@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "@supabase/server"

console.log("Hello from Functions!")

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    const email = ctx.userClaims?.email;

    return Response.json({
      message: `Hello ${email}!`,
    })
  }),
}
```

Es una plantilla inicial, no una implementación terminada.

Se debe mantener la compatibilidad con la versión de Supabase CLI instalada y su modelo actual de ejecución.

## 11.2. Función `provision-user`

Su responsabilidad será aprovisionar cuentas de usuarios de TTUTIS.

Flujo esperado:

1. Recibir una solicitud autenticada.
2. Verificar que el solicitante sea un operador autorizado de ARCANA/TTUTIS.
3. Validar los datos del usuario que se desea crear.
4. Comprobar la institución y la identidad personal.
5. Crear el usuario mediante Supabase Auth.
6. Crear el registro correspondiente en `profiles`.
7. Crear el vínculo institucional en `profile_person_links`, cuando corresponda.
8. Generar el código de acceso.
9. Crear el registro en `user_access_codes`.
10. Devolver una respuesta controlada sin exponer información sensible.

La función debe evitar duplicados y manejar fallos parciales de manera segura.

No debe crear cuentas o perfiles desde el SQL Editor mediante operaciones manuales sobre `auth.users`.

## 11.3. Autorización de operadores

La estructura actual de roles institucionales existe, pero la consulta ejecutada sobre `roles` no devolvió registros.

Esto no significa que el sistema no pueda tener roles institucionales más adelante. Significa que todavía no hay roles configurados.

Los operadores globales de ARCANA no deben confundirse con los administradores de un colegio.

Para la primera implementación se está evaluando autorizar operadores globales mediante una lista de UUID configurada como secreto de la Edge Function:

`TTUTIS_OPERATOR_IDS`

El UUID del operador todavía debe identificarse desde Authentication → Users del proyecto TTUTIS.

La lista de operadores debe comprobarse en el backend. Nunca debe confiarse en un identificador de operador enviado por el frontend.

---

# 12. Estado de las decisiones arquitectónicas

## Confirmado

- TTUTIS es una plataforma de gestión educativa.
- El primer objetivo es un colegio piloto con más de 800 alumnos.
- La base de datos ya contiene una estructura institucional preparada para crecer.
- Se separan perfiles globales e identidades personales.
- Se utiliza Supabase Auth.
- Alumnos, docentes y administrativos utilizan código institucional y contraseña.
- Apoderados utilizan código global y contraseña.
- Administradores generales utilizan correo y contraseña.
- Los códigos son aleatorios y no derivados del DNI.
- Un apoderado puede tener varios hijos.
- Las relaciones familiares requieren verificación.
- Los carnets utilizan QR con tokens opacos.
- La asistencia debe conservar trazabilidad.
- Las cuentas iniciales serán aprovisionadas por ARCANA/TTUTIS.
- El envío de credenciales se realizará después de revisar los registros.
- El módulo de pagos será independiente.
- Las claves privilegiadas no se exponen al frontend.
- El desarrollo debe evitar nuevas migraciones innecesarias.

## Pendiente de implementación

- Definir y registrar operadores globales.
- Terminar `provision-user`.
- Implementar el flujo de autenticación mediante código.
- Implementar cambio obligatorio de contraseña provisional.
- Configurar roles institucionales iniciales.
- Revisar las políticas RLS.
- Implementar las interfaces del MVP.
- Implementar la operación completa de asistencia.
- Implementar notificaciones.
- Implementar importación validada de alumnos y docentes.
- Implementar verificación de relaciones familiares.
- Implementar pruebas de seguridad y funcionamiento.

---

# 13. Plan de trabajo técnico

El orden de desarrollo debe ser el siguiente:

## Fase 1. Preparación de backend

- Confirmar operador autorizado.
- Implementar `provision-user`.
- Crear una cuenta de prueba.
- Comprobar creación de Auth y `profiles`.
- Comprobar generación del código de acceso.
- Verificar errores y rollback lógico.
- Probar duplicados.

## Fase 2. Autenticación

- Implementar acceso de administrador por correo.
- Implementar acceso por código institucional.
- Implementar acceso por código global.
- Implementar cierre de sesión.
- Implementar recuperación de contraseña.
- Implementar cambio obligatorio de contraseña provisional.

## Fase 3. Gestión de personas

- Registro de alumnos.
- Registro de docentes.
- Registro de personal.
- Registro de apoderados.
- Importación CSV/Excel.
- Validación y revisión de datos.
- Aprovisionamiento de cuentas.
- Envío de credenciales.

## Fase 4. Operación académica

- Consultar grados y secciones.
- Consultar matrículas.
- Consultar asignaturas.
- Consultar docentes.
- Consultar horarios.
- Construir interfaces administrativas.

## Fase 5. Asistencia

- Emisión de QR.
- Registro de dispositivos.
- Lectura de credenciales.
- Registro de ingresos y salidas.
- Consulta de asistencia.
- Correcciones autorizadas.
- Historial de eventos.

## Fase 6. Experiencias de usuario

- Aplicación del alumno.
- Aplicación del apoderado.
- Aplicación del docente.
- Panel administrativo.
- Selector de hijos.
- Notificaciones esenciales.

## Fase 7. Validación del piloto

- Pruebas con datos de demostración.
- Pruebas con usuarios reales autorizados.
- Pruebas de concurrencia.
- Pruebas de permisos.
- Pruebas de asistencia.
- Pruebas de recuperación ante errores.
- Validación con el colegio.

---

# 14. Criterios de calidad

TTUTIS debe desarrollarse con estándares de producción, aunque inicialmente opere en un solo colegio.

Los siguientes principios son obligatorios:

1. No duplicar identidades innecesariamente.
2. No mezclar autenticación con autorización.
3. No confiar en el frontend para proteger información.
4. No exponer claves privilegiadas.
5. Mantener integridad referencial.
6. Mantener trazabilidad de operaciones sensibles.
7. Utilizar transacciones para operaciones relacionadas.
8. Evitar consultas N+1 y problemas de rendimiento.
9. Utilizar índices según patrones reales de consulta.
10. Validar entradas tanto en frontend como en backend.
11. Mantener tipado y contratos claros entre cliente y servidor.
12. No crear infraestructura distribuida innecesaria.
13. No introducir migraciones sin revisar primero el esquema existente.
14. Probar las operaciones críticas antes de habilitarlas en producción.

---

# 15. Escalabilidad futura

La arquitectura debe conservar la posibilidad de evolucionar a una plataforma multiinstitucional completa.

No es necesario desarrollar toda esa operación ahora.

Sin embargo, deben conservarse los siguientes principios:

- Cada dato institucional debe mantener su relación con `institution_id`.
- Las relaciones deben conservar integridad entre institución y entidades relacionadas.
- Los perfiles deben seguir siendo globales.
- Las membresías deben determinar el acceso institucional.
- Los roles y permisos deben permitir distintos niveles de administración.
- Las sedes deben poder limitar el alcance de acceso.
- Las relaciones familiares deben permitir alumnos de distintas instituciones.
- Los módulos deben poder habilitarse por institución.
- La configuración académica debe ser independiente por colegio.
- Las operaciones privilegiadas deben mantenerse centralizadas en el backend.

Cuando se incorpore un segundo colegio, el objetivo será habilitarlo mediante configuración y aprovisionamiento, no reconstruir el núcleo del sistema.

---

# 16. Reglas para continuar el desarrollo

Cualquier desarrollador que continúe TTUTIS debe respetar estas reglas:

### Regla 1: no reconstruir lo que ya existe

Antes de crear una tabla, función o migración, revisar la estructura actual.

### Regla 2: priorizar el primer colegio

Toda funcionalidad debe evaluarse según su necesidad para el piloto.

### Regla 3: preservar la escalabilidad

No eliminar `institution_id`, perfiles globales, membresías ni relaciones institucionales para simplificar artificialmente el MVP.

### Regla 4: no sobrearquitecturar

No crear microservicios, colas distribuidas ni infraestructura adicional sin una necesidad demostrable.

### Regla 5: seguridad desde el servidor

Toda operación sensible debe validarse en el backend.

### Regla 6: no asumir que algo está terminado

Una tabla existente no significa que su funcionalidad esté implementada.

Una función creada no significa que esté desplegada.

Una política RLS habilitada no significa que esté correctamente probada.

### Regla 7: documentar cambios

Cada migración, Edge Function y decisión importante debe quedar documentada.

---

# 17. Estado exacto al momento de este documento

**Infraestructura:**
- Proyecto Supabase creado.
- CLI instalada y autenticada.
- Repositorio local inicializado.
- Repositorio vinculado al proyecto TTUTIS correcto.
- Base de datos comprobada.

**Base de datos:**
- Esquema institucional y académico existente.
- Datos de demostración creados.
- 800 alumnos.
- 800 matrículas.
- 800 relaciones pendientes de apoderados.
- 10 docentes.
- 200 asignaciones docentes.
- 20 secciones.
- 200 ofertas académicas.

**Autenticación:**
- Tablas de perfiles y códigos existentes.
- Estructura de membresías y roles existente.
- No se han terminado los flujos de autenticación por código.

**Edge Functions:**
- `provision-user` creada.
- Configuración JWT habilitada.
- Código todavía en plantilla.
- No desplegada.
- Autorización global de operadores pendiente.

**Interfaz:**
- No debe considerarse completado el producto funcional por el hecho de tener el esquema y datos de demostración.

---

# 18. Próximo objetivo inmediato

El siguiente objetivo técnico es terminar el aprovisionamiento seguro de usuarios.

El orden concreto es:

1. Identificar el UUID del operador autorizado de ARCANA.
2. Configurar el secreto de operadores.
3. Implementar `provision-user`.
4. Probar la creación de una cuenta.
5. Comprobar `auth.users`, `profiles` y `user_access_codes`.
6. Comprobar la vinculación con la identidad personal.
7. Probar el rechazo de solicitudes no autorizadas.
8. Continuar con el login y la gestión de usuarios.

**No desplegar la función hasta revisar y probar su implementación.**

---

# Conclusión

TTUTIS debe convertirse en una plataforma educativa sólida, no solamente en un sistema de registro de asistencia.

La prioridad actual es entregar una primera versión operativa en un colegio con más de 800 alumnos, resolver los procesos esenciales y validar el producto en condiciones reales.

La arquitectura debe mantener una separación correcta entre personas, perfiles, instituciones, membresías, permisos y operaciones académicas.

La escalabilidad multiinstitucional se conserva en el diseño, pero la complejidad operativa se incorpora cuando el producto y los colegios lo requieran.

**Principio rector del desarrollo: construir lo necesario para operar hoy, sin tomar decisiones que obliguen a reconstruir mañana.**