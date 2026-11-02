# Curso privado: el negocio en detalle

El paso del embudo entre la primera conversación y la decisión. Quien ha visto el webinar y ha hablado con nosotros
recibe acceso a un curso corto (unas 20 lecciones, menos de dos horas) donde se lo explicamos todo: el modelo, la
empresa, los números y el día a día. Al final, un botón de WhatsApp para hablarlo.

Instagram → cuestionario → webinar → WhatsApp → primera videollamada → **curso** → conversación final → decisión

Se inspira en el «Proceso de Descubrimiento» de Becoming Present (Drive → `Becoming Present`: vídeos, transcripciones y
el resumen lección a lección). Nos quedamos con el orden (cada lección responde la duda que abre la anterior), el
tono de las dudas frecuentes, la lección de «para quién no es» y el ejercicio de pensar como una empresa. Dejamos fuera
las promesas de salud, las demostraciones con el agua, la urgencia, las penalizaciones por cancelar, empujar a pedir un
préstamo y las historias de «dejé mi trabajo en X meses».

## Cómo funciona

| Qué | Dónde |
|---|---|
| La página | `/curso` de la web de cada persona (por ejemplo, `alejandromartinez.vercel.app/curso`) |
| Dar acceso | CRM → tarjeta del lead (de *WhatsApp* en adelante) → **Dar acceso al curso** → tocar otra vez para confirmar |
| Lo que recibe el lead | Un email desde el Gmail de la persona con su usuario (su email), una contraseña y el botón para entrar |
| Si pierde la contraseña | En el CRM, **Reenviar acceso al curso**: le llega una nueva y la anterior deja de valer |
| Su progreso | En el CRM (*Curso · 5 de 19 lecciones*, *Curso terminado*, *WhatsApp desde el curso*) y en la hoja (columnas *Curso…*) |
| Avisos | Email a la persona cuando el lead termina el curso y cuando pulsa WhatsApp al final |
| Etapa del CRM | Al dar acceso, el lead pasa solo a **Curso** (entre *Videollamada* y *Compra*) |

La contraseña no se guarda en la hoja: solo una huella cifrada. La sesión del lead dura 60 días en su navegador.

### Qué se cambia y dónde

- **Común a todo el equipo** (`compartido/curso/curso.json`): módulos, lecciones, textos, vídeos y cifras. Se cambia
  pidiéndoselo a Claude («pon este vídeo en la lección 2.3») o editando el archivo y ejecutando `npm run generar-api`.
  Pasa `npm run comprobar` (también en GitHub), que revisa las normas de abajo. No va en el editor de cada persona porque
  lo que cambia una persona lo verían los leads de todo el equipo.
- **De cada persona** (su editor, `/editar`):
  - **Curso**: los textos de la página de acceso y de dentro del curso, su bienvenida y el mensaje del final.
    *Pantalla 1* es el acceso y *Pantalla final*, el curso por dentro.
  - **Diseño → Enlaces → Vídeo de bienvenida del curso**.
  - **Emails → Acceso al curso**: el email que recibe el lead.

### Para que funcione en una web

1. El script de su hoja actualizado: `Embudo.gs` y `CRM.html` nuevos, **Implementar → Gestionar implementaciones →
   lápiz → Versión: Nueva versión → Implementar** (misma URL). Pasos en `compartido/apps-script/README.md`.
2. Nada más: usa las mismas variables de Vercel del formulario (`LEADS_WEBHOOK_URL` y `LEADS_WEBHOOK_SECRET`). Para la
   vista previa en el editor, `EDITOR_CLAVE` (ya está si el editor funciona).

Si una hoja no está actualizada, `/curso` dice que ahora no se puede entrar; nunca crea leads ni envía emails por error.

## Antes de dar acceso a nadie

1. **Aprobación de Enagic por escrito.** Sus normas (resumen en Notion → LEGAL) piden aprobación para el material que
   habla de la empresa o del producto (§9.4) y prohíben enseñar comisiones o proyecciones de ingresos (§9.3). El curso
   habla de las dos cosas: hay que enviárselo y esperar su respuesta por escrito.
2. **Cifras oficiales.** Precios, rangos, rango de inicio de cada paquete y comisiones, con la documentación oficial
   (plan de compensación y lista de precios de España) y su fecha. Las que hay ahora salen del curso de Becoming Present y
   no están confirmadas.
   - `cifras.confirmadas: true` cuando los precios y los rangos estén comprobados: el lead ve la tabla de rangos y los
     precios.
   - `cifras.comisionesAprobadas: true` solo cuando Enagic apruebe por escrito enseñar comisiones: el lead ve la
     calculadora. Si no lo aprueba, la calculadora se queda apagada y esas cifras se explican en la videollamada con la
     documentación oficial.
   - Mientras tanto el lead ve una nota («te lo enseño en la videollamada») y el equipo, en el editor, las cifras con un
     aviso naranja. Las cifras que no se pueden enseñar ni siquiera salen de `/api/curso`.
3. **Datos de las lecciones que hay que comprobar** (web oficial y documentación de Enagic España):
   - 2.4: la venta multinivel regulada por la Ley de Ordenación del Comercio Minorista y la venta piramidal prohibida por
     la Ley de Competencia Desleal.
   - 3.1: fundada en 1974, fábrica propia en Japón, vende en España.
   - 3.1, 3.3 y 6.1: sin cuota de entrada, sin cuotas mensuales ni mínimos de compra, licencia para siempre al comprar un
     producto, y el producto sigue siendo tuyo si lo dejas.
   - 3.2: cómo describir la K8 (qué hace y sus usos en casa) con las palabras que acepte Enagic.
   - 4.1: el sistema de 8 puntos, los rangos 1A-6A, las ventas de cada rango y los puntos por venta.
   - 4.2: qué incluye cada paquete y con qué rango se empieza.
   - 7.1: los enlaces a la documentación oficial (plan de compensación, lista de precios).
4. **Los vídeos grabados** (abajo). Sin vídeo, la lección enseña el texto con el aviso «vídeo en preparación»: el curso ya
   se puede leer entero.

## Estructura y guion de cada vídeo

Duración orientativa. **Quién**: Alejandro graba las comunes (o quien decida él, por ejemplo una persona del equipo para
«El día a día»); cada persona graba solo su bienvenida. Cada vídeo: un tema, a cámara o con diapositivas del estilo del
webinar, empezando por la pregunta que responde y terminando con la siguiente lección.

| | Lección | Min | Quién | Qué contar |
|---|---|---|---|---|
| **1** | **Empieza aquí** | | | |
| 1.1 | Bienvenida | 3 | Cada persona | Quién eres en dos frases, por qué estás en esto (tu historia corta, sin cifras) y qué va a encontrar. «Apunta tus dudas: al final lo hablamos.» |
| 1.2 | Cómo aprovechar este curso | 3 | Común | Qué hay en el curso, cuánto dura, los tres consejos (velo entero, apunta dudas, decide con la información completa) y que decir que no también vale. |
| **2** | **El modelo de negocio** | | | |
| 2.1 | Un negocio en paralelo | 6 | Común | La mayoría sigue con su trabajo. Sueldo = horas por dinero, con techo ajeno; algo propio = otra manera, con riesgos. Piensa en meses. |
| 2.2 | Recomendar un producto de alto valor | 6 | Común | Muchas ventas pequeñas frente a pocas de valor (el ejemplo de los gastos fijos del modelo barato). Qué hace la empresa (fabricar, enviar, cobrar) y qué haces tú. Sin presionar nunca. |
| 2.3 | Cómo llega la gente: el sistema | 7 | Común | El recorrido que ha hecho el propio lead: contenido → cuestionario → webinar → conversación. No se persigue a amigos ni familia. Lo que ya está montado y lo que es tuyo. Primero orgánico, anuncios después. |
| 2.4 | ¿Es legal? | 6 | Común | Multinivel legal y regulado frente a pirámide prohibida, con los cuatro criterios para distinguirlo. «Investiga y pregunta todo.» |
| **3** | **La empresa y el producto** | | | |
| 3.1 | La empresa | 6 | Común | Datos comprobados de Enagic y por qué la elegimos. Invitar a comprobarlo en la web oficial. |
| 3.2 | El producto, sin promesas | 7 | Común | Qué es la K8, cómo funciona y para qué la usamos en casa. Decirlo claro: **nunca prometemos nada sobre la salud**, y si alguien lo hace, desconfía. El resto de la gama, de pasada. |
| 3.3 | Cómo te haces distribuidor | 4 | Común | Licencia al comprar un producto, sin cuotas; qué puedes hacer desde ese día; el producto es tuyo. |
| **4** | **Los números** | | | |
| 4.1 | El plan de 8 puntos | 10 | Común | Los 8 puntos de cada venta, los rangos y cómo se sube, el valor del punto según el producto. Solo con el plan oficial en pantalla. |
| 4.2 | Maneras de empezar | 8 | Común | Las opciones de menor a mayor, qué incluye cada una y con qué rango se empieza. Más grande = más rango y más riesgo. **Elige lo que puedas pagar sin poner en riesgo tu economía; no recomendamos endeudarse.** |
| 4.3 | ¿En qué venta recuperas la inversión? | 6 | Común | Solo si Enagic lo aprueba: cómo leer la calculadora (ventas que harían falta, no las que harás). Decir en voz alta que hay quien no la recupera nunca. Si no se aprueba: explicarlo en la videollamada. |
| 4.4 | Pensar como una empresa | 7 | Común | Reinvertir, impuestos y alta de autónomo (gestoría), plazos de 9-12 meses, no dejar el trabajo antes de tiempo, y que la mayoría no llega a los rangos altos. Un error propio si lo hay. |
| **5** | **El día a día** | | | |
| 5.1 | Tu semana tipo | 6 | Común | 1-2 horas al día: contenido, conversaciones, formación, revisión. Enseñar tu semana real. El perfil como parte del negocio. |
| 5.2 | El sistema y el equipo | 6 | Común | Lo que recibe al entrar (web y editor, hoja y CRM, este curso, ayuda con el contenido, sesiones y acompañamiento) y lo que es suyo. Enseñar la pantalla de cada cosa. |
| 5.3 | Tus primeras 6 semanas | 6 | Común | El plan semana a semana (alta e historia, cuentas y fotos, primeras piezas, webinar y embudo, primeras conversaciones). |
| **6** | **Dudas y decisión** | | | |
| 6.1 | Las dudas de siempre | 10 | Común | No sé vender · no tengo tiempo · mi entorno · ¿recuperaré la inversión? · ¿es una pirámide? · ¿préstamo? · ¿y si lo dejo? Reconocer el miedo y responder con una acción, sin prometer. |
| 6.2 | Para quién no es | 4 | Común | La lista de quién no debería entrar (de `estrategia/icp.md`, anti-ICP) y para quién sí. Da credibilidad y filtra. |
| 6.3 | Siguiente paso | 2 | Común (texto de cada persona) | El botón de WhatsApp. Sin vídeo hace falta poco: el texto de cada persona en su editor. |
| **7** | **Extra** | | | |
| 7.1 | Documentación oficial | — | — | Enlaces a la documentación oficial. No cuenta para el progreso. |

## Normas del curso

El curso no es contenido público (solo lo ve quien tiene acceso), pero se aplican `estrategia/mensaje.md`,
`estrategia/normas-comunicacion.md` y las normas de Enagic. `npm run comprobar` revisa `curso.json`.

- **Sí**: nombrar a Enagic y el producto (qué es, cómo funciona, usos en casa), cifras oficiales con su fuente y fecha
  (cuando estén confirmadas y aprobadas), riesgos y plazos realistas.
- **Nunca**: afirmaciones de salud (tampoco «me siento mejor desde…», ni citando a médicos o estudios), promesas o
  previsiones de ingresos fuera de la calculadora con su aviso, lujo o viajes, empujar a pedir un préstamo, urgencia
  («plazas limitadas»), presentarlo como un empleo.
- La calculadora siempre con su aviso: no es una previsión de ingresos y muchas personas no recuperan la inversión.

## Cómo grabar

- **OBS Studio** (gratis, sin límite de tiempo, Full HD): escena con la cámara y, si hace falta, las diapositivas.
  Ajustes → Vídeo 1920 × 1080; Salida → formato MP4.
- Para recortar: Clipchamp (Windows) o iMovie (Mac).
- Subir a **YouTube como «Oculto»** (no público) y copiar el enlace: si es común, se lo pasas a Claude con el número de
  la lección; tu bienvenida va en tu editor (Diseño → Enlaces).
- Lecciones de 3 a 10 minutos: mejor varias cortas que una larga. Si una pasa de 10, se parte en dos.

## Después del curso

El botón final abre WhatsApp con el mensaje de cada persona y avisa por email. La conversación final (dudas, decidir
con qué empezar, el alta) tendrá su guía junto con el guion de WhatsApp del lead, cuando esté la historia de Alejandro.
