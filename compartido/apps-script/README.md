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
   Revisa `PERSONAS` arriba del todo: la web de cada persona y, si quiere, otro email para los avisos.
3. Guarda (icono del disquete). Arriba, en el desplegable de funciones, elige **instalar** y pulsa **Ejecutar**.
   Google pide permisos: tu cuenta → "Configuración avanzada" → "Ir a … (no seguro)" → Permitir.
   Es normal: el script es tuyo y no está verificado por Google.
4. En **Registro de ejecución** sale `CLAVE (cópiala en LEADS_WEBHOOK_SECRET): …`. Guárdala.
5. **Implementar → Nueva implementación → Tipo: Aplicación web**.
   Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**. Implementar y copia la **URL de la aplicación web**
   (termina en `/exec`).
6. Variables de entorno de la web:
   - Vercel (proyecto `kangen`) → Settings → Environment Variables: `LEADS_WEBHOOK_URL` = la URL del paso 5,
     `LEADS_WEBHOOK_SECRET` = la clave del paso 4. Volver a desplegar.
   - Cloudflare (Worker `kangen-team`) → Settings → Variables and Secrets: las mismas dos, como *Secret*.
7. Prueba: en Apps Script ejecuta **probar**. Te llega a ti el email del webinar y el aviso, y aparece una fila de prueba.
   Bórrala después.

**Si cambias el código del script:** Implementar → Gestionar implementaciones → editar (lápiz) → Versión: *Nueva versión*.
Así la URL no cambia.

## Uso diario

- Columna **Estado**: escríbela tú (Nuevo, Contactado, Llamada, Dentro, No encaja…). Si alguien responde BAJA,
  pon `Baja` y no recibirá el recordatorio.
- **Notas**: lo que hables con cada persona.
- Para tenerla en Excel: Archivo → Descargar → Microsoft Excel.

## Límites

- Una cuenta de Gmail normal envía unos **100 emails al día** desde scripts (Google Workspace: 1.500). Cada lead gasta 2
  (su email y tu aviso) más el recordatorio. Si se queda corto, pasa a una cuenta de Workspace o a un servicio de email.
- Los emails salen de tu Gmail, con tu nombre. Para cambiar de cuenta (p. ej. un Gmail nuevo solo para esto), haz una
  copia de la hoja con esa cuenta y repite la instalación: el script envía siempre desde la cuenta dueña de la hoja.
