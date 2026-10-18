# Embudo de Instagram en una hoja de Google

```
Bio de Instagram → /l/instagram → /cuestionario → hoja "Leads" → email con el webinar → /webinar
                                                      │                                  │
                                                      └─ aviso a la persona del equipo    └─ "Webinar abierto" y "Quiere hablar"
```

- **La web** (`/cuestionario`, preguntas en `sitio/src/cuestionario.ts`) envía cada lead a `/api/lead`.
- **`/api/lead`** (Vercel o Cloudflare) lo reenvía a la URL del script con una clave secreta.
- **El script** (`Embudo.gs`, dentro de la hoja):
  - guarda una fila por lead, con una columna por pregunta;
  - envía el email del webinar desde el Gmail del dueño de la hoja;
  - avisa a la persona del equipo;
  - a las 24 h manda un recordatorio a quien no ha abierto el webinar (una sola vez).
- **`/webinar?l=<id>`** apunta en la hoja cuándo lo abre, y el formulario del final marca "Quiere hablar".

## Instalación (una vez, unos 10 minutos)

1. Abre la hoja (Alejandro: `Landing Kangen Alejandro/Leads webinar Alejandro` en Drive).
2. **Extensiones → Apps Script**. Borra lo que haya en `Código.gs` y pega todo `Embudo.gs`
   (en Drive está también como documento: `Script del embudo (copiar en Apps Script)`).
   Revisa arriba del todo `PERSONAS` (la web de cada persona y, si quiere, otro email para los avisos) y que
   `PERSONA` sea la persona de esta hoja.
3. Guarda (icono del disquete). Arriba, en el desplegable de funciones, elige **instalar** y pulsa **Ejecutar**.
   Google pide permisos (hoja, enviar emails en tu nombre y activadores): tu cuenta → "Configuración avanzada" → "Ir a … (no seguro)" → Permitir.
   Es normal: el script es tuyo y no está verificado por Google.
4. En **Registro de ejecución** sale `CLAVE (cópiala en LEADS_WEBHOOK_SECRET): …`. Guárdala.
   (Si `CLAVE_INICIAL` viene rellena arriba del script, usa esa: ya puede estar puesta en Vercel.)
5. **Implementar → Nueva implementación → Tipo: Aplicación web**.
   Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**. Implementar y copia la **URL de la aplicación web**
   (termina en `/exec`).
6. Variables de entorno de la web:
   - Vercel (proyecto `alejandromartinez`) → Settings → Environment Variables: `LEADS_WEBHOOK_URL` = la URL del paso 5,
     `LEADS_WEBHOOK_SECRET` = la clave del paso 4. Volver a desplegar.
   - Cloudflare (Worker `kangen-team`) → Settings → Variables and Secrets: las mismas dos, como *Secret*.
7. Prueba: en Apps Script ejecuta **probar**. Te llega a ti el email del webinar y el aviso, y aparece una fila de prueba.
   Bórrala después.

**Si cambias el código del script:** Implementar → Gestionar implementaciones → editar (lápiz) → Versión: *Nueva versión*.
Así la URL no cambia.

## Otra persona del equipo (ejemplo: Gemma)

Cada persona tiene **su propia hoja, su script y su CRM**; el código es el mismo para todas.

1. **Su web**: copia de `equipo/alejandro/sitio` las piezas del embudo (`cuestionario.ts`, `paginas/Cuestionario.tsx`,
   `paginas/Webinar.tsx`, `componentes/VideoWebinar.tsx`, `landings/Instagram.tsx`) y adáptalas a su diseño
   (así está hecho `equipo/gemma/sitio`, con `embudo.css`). En su `config.ts`: su WhatsApp y el vídeo del webinar.
2. **Su entrada en `PERSONAS`** (arriba de `Embudo.gs`): nombre, web (`https://nombre-apellido.vercel.app`), foto de la firma y colores de su web.
3. **Su hoja**: `Leads webinar <Nombre>` en su carpeta de Drive. Sigue la instalación de arriba con estos cambios:
   - en el script, `const PERSONA = '<su clave>';` (p. ej. `'gemma'`);
   - **mejor que lo instale ella con su cuenta de Google**: los emails salen de su Gmail y las respuestas y avisos le
     llegan a ella. Si lo instala otra persona, los emails salen del Gmail de quien instala (con el nombre de ella):
     pon entonces su email en `aviso` y en `responder` de su entrada en `PERSONAS`.
4. **Su proyecto de Vercel**, llamado `nombre-apellido` (es su URL; nunca la marca), con *Root Directory* `equipo/<persona>/sitio` y las dos variables
   (`LEADS_WEBHOOK_URL` y `LEADS_WEBHOOK_SECRET`) de **su** script.

## CRM (ver y gestionar los leads)

`CRM.html` es un tablero privado, en horizontal, con una columna por etapa:

**Nuevo lead → Recontactado → Vio el vídeo → WhatsApp → Videollamada → Compra → Onboarding** (y Descartado).

- **Lo que mueve el script solo, siempre hacia delante:**
  - al enviar el recordatorio: Nuevo lead → Recontactado;
  - al ver el 80 % del webinar: → Vio el vídeo;
  - al pulsar WhatsApp: → WhatsApp.
- **Lo demás lo mueves tú:** arrastrando la tarjeta en el ordenador, o con el desplegable en el móvil.
- **Cada tarjeta** lleva teléfono, email e Instagram; las señales (vídeo abierto o visto, recordatorio, WhatsApp pulsado); botones de WhatsApp y email; sus respuestas, y notas que se guardan solas.
- **Hoja y CRM son lo mismo.** El CRM lee la hoja en directo (se refresca cada minuto) y solo escribe Estado y Notas.
  - En la hoja, el menú **Leads → Abrir CRM** abre el tablero.
  - La columna Estado tiene un desplegable con las mismas etapas, así que da igual cambiarlo en un sitio o en el otro.
  - **Leads → Preparar la hoja** vuelve a poner el desplegable si se pierde.

1. En Apps Script: **+ → HTML**, nómbralo `CRM` (sin .html) y pega `CRM.html`.
2. Guarda y publica una versión nueva: **Implementar → Gestionar implementaciones → lápiz → Versión: Nueva versión → Implementar**.
   La URL no cambia.
3. Ejecuta **enlaceCrm**: el registro muestra el enlace privado (`…/exec?crm=CLAVE`). Guárdalo en favoritos o en la pantalla de
   inicio del móvil y **no lo compartas**: con él se ven todos los leads.

## Uso diario

- Columna **Estado**: mejor desde el CRM. Con `Descartado` no recibe el recordatorio.
- **Notas**: lo que hables con cada persona.
- Para tenerla en Excel: Archivo → Descargar → Microsoft Excel.

## Límites

- Una cuenta de Gmail normal envía unos **100 emails al día** desde scripts (Google Workspace: 1.500). Cada lead gasta 2
  (su email y tu aviso) más el recordatorio. Si se queda corto, pasa a una cuenta de Workspace o a un servicio de email.
- Los emails salen de tu Gmail, con tu nombre. Para cambiar de cuenta (p. ej. un Gmail nuevo solo para esto), haz una
  copia de la hoja con esa cuenta y repite la instalación: el script envía siempre desde la cuenta dueña de la hoja.
