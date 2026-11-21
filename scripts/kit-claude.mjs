// Kit de Claude de una persona: un solo documento con todo lo que su Claude necesita para trabajar su contenido sin
// depender de nadie (dónde está cada cosa, cómo se lee y se escribe en Notion, qué hacer con cada petición, su
// estrategia, las instrucciones de los 6 agentes y el conocimiento del equipo). Ella lo añade a su proyecto «Mi
// contenido» de Claude desde Google Drive. Saca también su guía «<Nombre> · Empieza aquí» (HTML para Google Docs):
// el paso a paso para ella y todos los textos para pedirle cosas a su Claude. Guía: contenido/agentes-web/README.md.
//   npm run kit-claude -- <enlaces.json> [salida.md]
// enlaces.json va FUERA del repositorio (es público): { "clave": "gemma", "nombre": "Gemma", "enlaces": { … },
// "privados": ["ruta/estrategia.md"] }. Los documentos de «privados» (su estrategia) se copian tal cual al kit.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const [archivoEnlaces, salidaArg] = process.argv.slice(2);
if (!archivoEnlaces) {
  console.error('Uso: npm run kit-claude -- <enlaces.json> [salida.md]. Guía: contenido/agentes-web/README.md');
  process.exit(1);
}
const datos = JSON.parse(readFileSync(archivoEnlaces, 'utf8'));
const { clave, nombre } = datos;
const e = datos.enlaces ?? {};
if (!clave || !nombre) throw new Error('enlaces.json necesita "clave" (la carpeta de equipo/) y "nombre".');
const salida = path.resolve(salidaArg ?? path.join(path.dirname(path.resolve(archivoEnlaces)), `Kit de Claude · ${nombre}.md`));
if (salida.startsWith(raiz + path.sep)) throw new Error('El kit lleva su estrategia y sus enlaces: va fuera del repositorio.');

const hoy = new Date().toISOString().slice(0, 10);
const leer = (r) => readFileSync(path.join(raiz, r), 'utf8');
// Los títulos de un documento incluido bajan de nivel para quedar dentro de su parte del kit.
const bajar = (texto, n) => texto.replace(/^(#{1,6}) /gm, (_, h) => '#'.repeat(Math.min(6, h.length + n)) + ' ');
const sinCabecera = (t) => t.replace(/^---\n[\s\S]*?\n---\n/, '');
const enlace = (texto, url) => (url ? `[${texto}](${url})` : texto);

const AGENTES = ['estrategia-100-dias', 'plan-semanal', 'guion', 'aprender', 'revisar-normas', 'entrevista-historia'];
const CONOCIMIENTO = [
  'estrategia/mensaje.md', 'estrategia/normas-comunicacion.md', 'estrategia/icp.md', 'estrategia/marketing.md',
  'estrategia/perfil-y-100-dias.md', 'contenido/README.md', 'contenido/formatos.md', 'contenido/ganchos.md',
  'contenido/aprendizajes-equipo.md', 'contenido/carruseles/README.md', 'contenido/videos/README.md',
  `equipo/${clave}/design.md`, `equipo/${clave}/contenido/aprendizajes.md`,
].filter((r) => existsSync(path.join(raiz, r)));

const filas = [
  ['Mis piezas de los 100 días (Notion)', e.vista100], ['Lo que tengo que grabar (Notion)', e.vistaGrabar],
  ['Mi ficha de voz (Notion)', e.ficha], ['Mis carruseles en Canva (mi carpeta)', e.canva], ['Mi estudio: mis vídeos y mi voz', e.estudio],
  ['Mi estrategia (documento de Claude; copia en la parte 6)', e.estrategia], ['Mi guía «Empieza aquí» (Google Doc: cómo se prepara todo y qué escribirte)', e.empiezaAqui],
  ['Mi carpeta de Drive', e.carpeta], ['Mis fotos (Drive)', e.fotos], ['Mis vídeos (Drive)', e.videos],
  ['Lo que grabo para los vídeos (Drive → Brutos)', e.brutos], ['Lo terminado (Drive → Editados)', e.editados],
  ['Mi documento de perfil y primera grabación', e.documento], ['El editor de mi web', e.editor],
  ['Mis contactos (mi hoja)', e.hoja],
].filter(([, url]) => url);

const partes = [];
partes.push(`# Kit de Claude · ${nombre}

Versión del ${hoy}. Lo prepara el equipo y se vuelve a sacar cuando cambia algo; la fecha dice cuál es el último.

> **Para Claude.** Eres el equipo de contenido de ${nombre}: estratega, guionista, diseñador y revisor. Este documento
> es tu manual y tu memoria: léelo entero al empezar cada conversación del proyecto y síguelo al pie de la letra. Lo
> que no esté aquí, búscalo en Notion o en Drive con sus conectores antes de preguntarle; pregúntale solo lo que solo
> ella sabe. Si en su Drive hay un «Kit de Claude · ${nombre}» con una fecha de versión más nueva que este, léelo con
> Google Drive, usa ese y dile que cambie el del proyecto (paso 6 de su guía «Empieza aquí»).

## 1. Cómo trabajamos

- **Ella decide, tú haces.** Propón y ejecuta tú: ideas, orden de las piezas, ganchos, textos, diseño. No le
  preguntes «¿qué prefieres?»: decide, di en una línea por qué y, si no le gusta, cámbialo y apréndelo.
- **Nada se publica ni se pone en «Aprobado» sin que ella lo diga.** Tú dejas las piezas en Idea, Guion o Para aprobar.
- **Su voz es la suya**: antes de escribir nada por ella, lee su ficha de voz en Notion. Nunca inventes sentimientos
  ni hechos de su vida; si te falta algo, pregúntale una cosa concreta.
- **Las normas mandan** (parte 8, «normas-comunicacion»): nada de dinero ni ingresos, salud, el producto, la marca ni
  el agua; ni lujo o viajes como resultado. Lo marcado con ⚠ en su ficha nunca sale en público.
- **Cada opinión suya mejora el sistema**: cuando diga qué le gusta o qué no, sigue el agente «aprender» (parte 7).
- Habla en español, corto, y con el enlace directo a lo que nombres (la pieza de Notion, la carpeta de Drive).

## 2. Dónde está todo

| Qué | Enlace |
| --- | --- |
${filas.map(([q, url]) => `| ${q} | ${url} |`).join('\n')}

## 3. Notion: cómo leer y escribir

Todo está en el espacio de Notion del equipo, en «CONTENIDO Y ANUNCIOS». Usa su conector de Notion.

- **Calendario de contenido** (\`collection://da1053df-19d6-4cfc-8547-c77f511392ae\`): una fila por pieza. Las suyas
  son las de **Persona = ${nombre}**. Nunca toques las de otras personas.
  - Columnas: **Pieza** (título), **Persona**, **Estado** (Idea → Guion → Grabado → Editado → Para aprobar →
    Aprobado → Programado → Publicado; o Descartado), **Día** (1 a 100 de su plan), **Fase** (1 · Me presento,
    2 · ¿Te suena?, 3 · Hay otra manera, 4 · Tus dudas, 5 · Ven a verlo), **Pilar** (Otra manera de ganarse la vida,
    Cambiar de vida, Invertir en ti, Mentalidad, Construyendo en público, Dudas), **Formato** (Reel, Clip corto,
    Carrusel, Imagen, Historia, Short, Vídeo largo), **Redes** (Instagram, TikTok, YouTube, Facebook), **Etapa**
    (Descubrir, Conectar, Decidir), **Fecha** (día y hora de publicación), **Gancho**, **Llamada a la acción**,
    **Estilo visual** (Álbum, Revista, Tipográfico, Documental), **Etiqueta IA**, **Revisión** (Pendiente, Pasa,
    No pasa), **Feedback**, **Notas**, **Archivo** (lo editado en Drive) y **Código** (CT-123: se pone solo).
  - El guion completo va dentro de la página de la pieza (cuerpo), con el texto de cada red.
  - **Pieza nueva**: crea la fila con Pieza, Persona = ${nombre}, Estado = Idea, Día, Fase, Pilar, Formato, Redes,
    Etapa y Gancho, y en el cuerpo por qué va ese día. Antes, mira qué hay ya en esos días para no repetir ni romper
    el hilo de su estrategia (parte 6).
- **Fichas de voz** (\`collection://8fdf7563-98ef-41e5-8899-19349d98657d\`): solo la suya${e.ficha ? ` (${e.ficha})` : ''}.
  Su historia, cómo habla, lo que no se cuenta (⚠) y, al final, «Feedback y aprendizajes».
- **Radar de referencias** (\`collection://ca35d60d-116e-4405-a39a-4c21cfc9c4d7\`): contenido de otros que funciona,
  para inspirarse (nunca copiar).
- **Propuestas para todo el equipo** (\`collection://41857db8-a618-8110-99bf-000bb8441638\`): lo que aprendáis que
  sirva a todas (una regla nueva, un cambio en una norma) va aquí como fila nueva; el equipo lo aplica.

## 4. Qué hacer cuando te pida…

| Te pide | Qué haces |
| --- | --- |
| «¿Qué toca esta semana?» / «¿Qué tengo que grabar?» | Busca en el Calendario sus piezas de los próximos 7 días y las que piden grabación; dile qué grabar, cuánto y dónde subirlo |
| «Dame ideas» / «Rellena los días 40 a 50» / «Quiero hablar de…» | Agente «estrategia-100-dias» o «plan-semanal» (parte 7): crea o cambia las filas en el Calendario, en su hilo y su fase |
| «Escríbeme el guion de…» | Agente «guion»: el guion dentro de la pieza, el texto de cada red y la llamada a la acción; Estado = Guion |
| «Esto me gusta / no me gusta…» | Agente «aprender»: regla en su ficha (o en Propuestas si vale para todas), y rehaces la pieza |
| «¿Se puede publicar?» | Agente «revisar-normas»: Revisión = Pasa o No pasa, con el porqué |
| «Actualiza mi ficha» / «Entrevístame» | Agente «entrevista-historia» |
| «¿Cómo queda el carrusel?» / cambiar el diseño | Sus carruseles están en Canva, en su carpeta (parte 2), y el enlace de cada uno en Notas de la pieza («Editar en Canva»). Explícale cómo cambiarlo allí paso a paso, con las reglas de la parte 8 («contenido/carruseles/README.md»). Si tiene el conector de Canva, puedes hacer tú cambios sencillos (texto, color, foto). En el guion, propón estilo y composición de cada imagen |
| Una imagen o un vídeo con IA | Escríbelo en Notas de la pieza empezando por «Higgsfield:»: lo genera el equipo con su cuenta. Sin caras hechas con IA |
| «Apruébala» (lo dice ella) | Estado = Aprobado. Solo si lo ha dicho ella en esta conversación |

## 5. Lo que se hace fuera de tu Claude

- **Pasar los carruseles a Canva y exportarlos**: la sesión del equipo (Claude con el repositorio) hace cada carrusel,
  lo pasa a Canva separado en capas, en su carpeta, y pone el enlace en Notas. Cuando la pieza está en Aprobado, lo
  exporta desde Canva, lo deja en Drive → Editados y en Archivo, y aprende de lo que ella haya cambiado.
- **El montaje de los vídeos**: cuando un vídeo está en «Listo» en su estudio, la sesión del equipo lo monta y lo deja
  en Drive → Editados y en Archivo de la pieza.
- **Publicar**: lo aprobado sale solo a su hora desde el publicador del equipo.
- **Higgsfield** (imágenes y vídeos con IA): con la cuenta del equipo, por Notas «Higgsfield: …».
- Si algo no funciona o falta un acceso, díselo y que se lo pase a Alejandro con una captura.
`);

for (const r of datos.privados ?? []) {
  partes.push(`## 6. Su estrategia\n\nCopia del documento de estrategia${e.estrategia ? ` (${e.estrategia})` : ''}.\n\n${bajar(readFileSync(r, 'utf8').replace(/^# .*\n/, ''), 1)}`);
}
if (!(datos.privados ?? []).length) partes.push(`## 6. Su estrategia\n\nEn su documento de estrategia${e.estrategia ? `: ${e.estrategia}` : ''}.`);

partes.push(`## 7. Las instrucciones de cada agente

Son los mismos agentes (skills) que usa el equipo. Si están instalados en su Claude, se activan solos; si no, síguelos
desde aquí. Donde citan un archivo del repositorio (\`estrategia/…\`, \`contenido/…\`, \`equipo/${clave}/…\`), está en la
parte 8 con el mismo nombre. Lo que pidan ejecutar con \`npm run …\` o escribir en su estudio (ArtifactData) no se
puede desde su Claude: apúntalo en Notas de la pieza y lo hace la sesión del equipo.

${AGENTES.map((a) => `### Agente «${a}»\n\n${bajar(sinCabecera(leer(`.claude/skills/${a}/SKILL.md`)).replace(/^# .*\n/, ''), 3)}`).join('\n\n')}`);

partes.push(`## 8. El conocimiento del equipo

${CONOCIMIENTO.map((r) => `### \`${r}\`\n\n${bajar(leer(r).replace(/^# .*\n/, ''), 3)}`).join('\n\n')}`);

mkdirSync(path.dirname(salida), { recursive: true });
const texto = partes.join('\n\n').replace(/\n{3,}/g, '\n\n');
writeFileSync(salida, texto);
console.log(`${salida} (${Math.round(texto.length / 1024)} KB): súbelo a su carpeta de Drive como documento de Google.`);

// ---------- Su guía «Empieza aquí»: el paso a paso para ella, sin dar nada por sabido, con todos los prompts.
const AGENTES_DRIVE = 'https://drive.google.com/drive/folders/1YMn-nNSC2rvmjfHGYICNFErYPYcrI7fq';
const instrucciones = (n) => `Eres mi equipo de contenido: estratega, guionista, diseñadora y revisora. Soy ${n}.
En los archivos de este proyecto está mi «Kit de Claude · ${n}»: léelo entero al empezar cada conversación y síguelo al pie de la letra. Ahí está dónde está todo lo mío (Notion, Drive, mi estudio y mi estrategia), cómo crear y cambiar mis piezas, las normas, el diseño y las instrucciones de cada agente.
Usa mis conectores de Notion y Google Drive para leer y escribir lo mío; no me pidas que copie nada a mano.
Decide tú lo que puedas decidir y dime en una línea por qué. Nunca pongas una pieza en Aprobado ni publiques nada sin que yo lo diga.
Háblame en español, corto y con el enlace directo a lo que nombres.`;

// Los prompts de la guía, por secciones: [para qué, lo que copia]. Los números se cuentan solos.
const seccionesPrompts = [
  ['Para empezar', [
    ['Comprobar que todo funciona', 'Lee mi kit y dime qué tengo que grabar esta semana y qué piezas tengo pendientes de aprobar, con los enlaces.'],
  ]],
  ['Cada semana', [
    ['El lunes: tu semana', 'Prepara mi semana: qué sale cada día, qué tengo que grabar y qué tengo que aprobar.'],
    ['Saber qué grabar', '¿Qué tengo que grabar para la pieza del día [número]? Dímelo plano a plano.'],
    ['Avisar de que ya lo has grabado', 'Ya he subido a Brutos lo de la pieza del día [número]. Apúntalo en Notion para que la monten.'],
    ['Saber cómo va una pieza', '¿Cómo va la pieza del día [número]? ¿Qué falta para publicarla?'],
  ]],
  ['Crear y cambiar piezas', [
    ['Ideas nuevas', 'Dame 5 ideas nuevas para los días [desde] a [hasta] que encajen con mi estrategia y créalas en Notion.'],
    ['Hablar de algo que se te ha ocurrido', 'Quiero hablar de [tema]. ¿En qué día de mis 100 encaja mejor? Créala o cambia la que toque.'],
    ['Ideas de lo que funciona en redes', 'Mira el Radar de referencias y dime cuáles me sirven para mis próximas piezas.'],
    ['El guion de una pieza', 'Escríbeme el guion de la pieza del día [número], con el texto de cada red.'],
    ['Cambiar el gancho', 'Cambia el gancho de la pieza del día [número]: lo quiero más [directo / cercano / corto].'],
    ['Dar tu opinión (así aprende)', 'Te doy mi opinión de la pieza del día [número]: me gusta [...] y no me gusta [...].'],
    ['Saber si se puede publicar', '¿Se puede publicar la pieza del día [número]? Revísala con las normas.'],
    ['Aprobar (solo si ya la has visto y te gusta)', 'Apruébame la pieza del día [número].'],
  ]],
  ['Diseño e imágenes', [
    ['Cambiar algo en tu carrusel', '¿Cómo cambio [la foto / el texto / el color / el tamaño] del carrusel del día [número] en Canva? Dímelo paso a paso.'],
    ['Que tu Claude lo cambie (con el conector de Canva)', 'En mi carrusel del día [número] en Canva, cambia [el texto de la imagen 3 por «…» / el color del titular a …].'],
    ['Pedir una imagen hecha con IA (nunca con tu cara)', 'Para la pieza del día [número] quiero una imagen de [qué se ve], hecha con IA. Apúntalo en Notas para el equipo.'],
  ]],
  ['Tu historia, tu voz y tu perfil', [
    ['Completar tu ficha', 'Entrevístame para completar mi ficha de voz.'],
    ['Apuntar algo tuyo', 'Apunta en mi ficha que [no quiero hablar de… / me gusta decir… / lo que sea].'],
    ['Tu presentación en redes', 'Revisa mi presentación de Instagram y TikTok según mi estrategia y dime qué cambiarías.'],
  ]],
  ['Tus redes, cada día', [
    ['Historias de hoy', 'Dame 3 ideas de historias de Instagram para hoy, según mi estrategia.'],
    ['Contestar un comentario o un mensaje', 'Me han escrito esto: «[el mensaje]». ¿Qué le contesto?'],
  ]],
  ['Mantenimiento', [
    ['Cuando Alejandro te diga que hay un kit nuevo', '¿Hay un kit más nuevo en mi Drive? (si dice que sí: en Mi contenido → Archivos, quita el viejo y añade el nuevo, como en el paso 6)'],
  ]],
];
const guia = `# ${nombre} · Empieza aquí

Tu contenido se lleva desde tu Claude: tú le pides las cosas con tus palabras y él las hace en tu Notion y en tu Drive.
Aquí tienes cómo dejarlo preparado (una sola vez, unos 30 minutos, mejor desde el ordenador) y qué escribirle cada día.
Este documento está en tu carpeta de Drive${e.carpeta ? ` ([Landing Kangen ${nombre}](${e.carpeta}))` : ''}: vuelve aquí siempre que lo necesites.

## Lo que vas a usar

| Qué | Qué es |
| --- | --- |
| **Claude** (claude.ai o la app) | Tu asistente. Le escribes como a una persona y te contesta. |
| **Tu proyecto «Mi contenido»** | Una carpeta dentro de tu Claude. Dentro de ella, Claude ya sabe todo lo tuyo: habla con él siempre ahí. |
| **Tu kit** («Kit de Claude · ${nombre}», en tu carpeta de Drive) | El manual de tu Claude: tu estrategia, tus enlaces, las normas y cómo trabajamos. No tienes que leerlo; lo lee él. |
| **Notion** | Donde están tus 100 piezas en orden. Ahí ves qué sale cada día y apruebas. |
| **Canva**${e.canva ? ` ([tu carpeta](${e.canva}))` : ''} | Donde te llegan tus carruseles e imágenes. Cambias lo que quieras: textos, letras, colores, tamaños, recortar o cambiar una foto. |
| **Tu estudio**${e.estudio ? ` ([abrir](${e.estudio}))` : ''} | Una página que se abre dentro de Claude para tus vídeos: planos, tu voz y subtítulos. |
| **Tu Drive** | Tus fotos, lo que grabas y lo terminado. |

## Prepáralo una vez

### 1. Acepta las invitaciones (5 min)

Te llegan por email (mira también en Promociones y en Spam):

1. **De Notion**: pulsa «Aceptar» o «Join» → «Continuar con Google» → tu Gmail.
2. **De Claude** (en inglés, «… shared … with you»), una por cada página: pulsa «View invitation» → entra con tu Gmail →
   «Accept». Son dos: tu estudio y tu estrategia. Una página de Claude es como una web privada: solo la ven las
   personas invitadas y se abre con su enlace (están al final de este documento).
3. **De Google Drive** (la carpeta «Agentes de Claude»): pulsa «Abrir». Si no te llega, no pasa nada: el enlace del
   paso 3 funciona igual.
4. **De Canva** (tu carpeta «${nombre}»): pulsa el botón del email → entra con tu Gmail («Continuar con Google»). Si no
   tienes cuenta, se crea gratis ahí mismo.

### 2. Conecta Notion y Google Drive a tu Claude (3 min)

1. Abre [claude.ai](https://claude.ai) y entra con tu Gmail.
2. Abre [Ajustes → Conectores](https://claude.ai/settings/connectors) (también: abajo a la izquierda, tu nombre →
   Ajustes → Conectores).
3. **Google Drive** → «Conectar» → tu Gmail → «Permitir».
4. **Notion** → «Conectar» → tu cuenta de Notion → «Permitir acceso». Si te pregunta qué páginas, marca todas.
5. GitHub no hace falta.

### 3. Sube las 6 skills del equipo (8 min)

Las skills son las instrucciones de cada tarea (el guionista, la revisora…). Se suben una vez.

1. Abre la carpeta [Agentes de Claude](${AGENTES_DRIVE}). Hay 6 archivos .zip.
2. En cada uno: clic derecho → «Descargar». Se guardan en tu carpeta de Descargas. No los abras.
3. Abre [Ajustes → Capacidades](https://claude.ai/settings/capabilities) → baja hasta «Skills» → «Subir skill» → elige
   uno de los .zip. Repite con los 6.
4. Comprueba que salen los 6, activados: estrategia-100-dias, plan-semanal, guion, aprender, revisar-normas y
   entrevista-historia.

### 4. Crea tu carpeta de trabajo: el proyecto «Mi contenido» (2 min)

1. Abre [Proyectos](https://claude.ai/projects) (también: en la barra de la izquierda de Claude, «Proyectos»).
2. Pulsa «Nuevo proyecto» (o «Crear proyecto»).
3. Nombre: **Mi contenido**. Descripción: «Mi contenido de redes». Pulsa «Crear proyecto».

### 5. Pega las instrucciones del proyecto (1 min)

1. Dentro de Mi contenido, en la columna de la derecha, busca «Instrucciones» y pulsa el lápiz o «Establecer
   instrucciones del proyecto».
2. Copia el texto de abajo entero y pégalo tal cual.
3. Pulsa «Guardar».

\`\`\`text
${instrucciones(nombre)}
\`\`\`

### 6. Añade tu kit al proyecto (1 min)

1. Dentro de Mi contenido, en la columna de la derecha, en «Archivos» (o «Conocimiento del proyecto»), pulsa «+».
2. Elige «Google Drive».
3. Busca **Kit de Claude · ${nombre}**, selecciónalo y pulsa «Añadir» o «Seleccionar».

### 7. Comprueba que funciona (2 min)

Dentro de Mi contenido, en la caja de abajo, pega el texto de «Para empezar» (más abajo) y pulsa Enviar. Si te contesta con tus piezas
y sus enlaces, ya está. Si dice que no ve Notion o Drive, repite el paso 2.

### 8. Ten a mano Canva y tu estudio (2 min)

1. Abre ${e.canva ? `[tu carpeta de Canva](${e.canva})` : 'tu carpeta de Canva'}: ahí te llegan tus carruseles. Para
   cambiar algo, ábrelo y toca lo que quieras: un texto para escribir; arriba, la letra, el tamaño y el color; arrastra
   cualquier cosa para moverla o tira de sus esquinas para cambiar el tamaño; doble toque en una foto para recortarla;
   con la foto marcada, «Sustituir» para poner otra. Se guarda solo.
2. Opcional: en [Ajustes → Conectores](https://claude.ai/settings/connectors) conecta también **Canva**, y tu Claude
   podrá hacer por ti cambios sencillos en tus carruseles (un texto, un color, una foto).
3. Abre [tu estudio](${e.estudio ?? 'https://claude.ai'}) (para tus vídeos). Se abre dentro de Claude. Arriba, en los
   tres puntos (⋯), pulsa «Fijar» para que te salga siempre en la barra de la izquierda. La primera vez que pulses
   «Traer de Google Drive», Claude te pedirá permiso: «Permitir».

### 9. En el móvil (3 min)

Instala **Claude**, **Notion** y **Canva** (App Store o Google Play) y entra con tu Gmail. Tu proyecto, tus carruseles,
tu estudio y tus piezas te salen también allí.

## Tu semana

1. **Lunes** (5 min): en Mi contenido, escríbele «Prepara mi semana…» (abajo, «Cada semana»). Te dice qué sale, qué grabar y qué aprobar.
2. **Graba** (30 min): planos de 5 a 8 segundos, en vertical, sin hablar a cámara, y las notas de voz que pida cada
   pieza. Súbelos a ${e.brutos ? `[Brutos](${e.brutos})` : 'Brutos'} o, en tu estudio, con «Subir fotos o clips».
3. **Mira y retoca** (10 min): los **carruseles e imágenes**, en ${e.canva ? `[Canva](${e.canva})` : 'Canva'} (el enlace
   de cada uno está también en Notas de la pieza, «Editar en Canva»): toca lo que quieras cambiar y se guarda solo. Los
   **vídeos**, en tu estudio: elige la pieza arriba, cambia lo que quieras y pulsa «Listo: que Claude lo prepare».
4. **Aprueba** (5 min): en ${e.vista100 ? `[tus 100 días](${e.vista100})` : 'tus 100 días de Notion'}, abre la
   pieza → Estado → **Aprobado**. O díselo a tu Claude: «Apruébame la pieza del día…». Nada se publica sin tu aprobado.
5. **Cada día** (15 min): historias, comentarios y mensajes (abajo, «Tus redes, cada día»).

## Lo que le escribes a tu Claude

Copia el texto de la columna de la derecha, cambia lo que va entre corchetes [así] y pégalo en tu proyecto Mi contenido.
Para un tema nuevo, pulsa «Nuevo chat» dentro del proyecto (no fuera). Si no sabes cómo pedir algo, pídelo con tus
palabras: Claude lo entiende igual.

${seccionesPrompts.map(([titulo, filas]) => `### ${titulo}\n\n| Para qué | Copia esto |\n| --- | --- |\n${filas.map(([para, texto]) => `| ${para} | ${texto} |`).join('\n')}`).join('\n\n')}

Lo que nunca hace tu Claude solo: poner una pieza en Aprobado o publicar (siempre lo dices tú), inventar cosas tuyas
que no estén en tu ficha, ni hacer imágenes con tu cara. Tu voz clonada, solo si tú la autorizas en tu estudio («Mi voz»).

## Si algo no va

- **Claude dice que no ve Notion o Drive**: repite el paso 2.
- **No encuentra tus piezas**: comprueba que aceptaste la invitación de Notion (paso 1) y, en el conector de Notion,
  que le diste acceso a todas las páginas.
- **Cualquier otra cosa**: haz una captura de pantalla y mándasela a Alejandro por WhatsApp.

## Tus enlaces

| Qué | Enlace |
| --- | --- |
${[
  ['Tus piezas de los 100 días (Notion)', e.vista100], ['Lo que tienes que grabar (Notion)', e.vistaGrabar],
  ['Tu ficha de voz (Notion)', e.ficha], ['Tus carruseles (Canva)', e.canva], ['Tu estudio, para los vídeos (dentro de Claude)', e.estudio],
  ['Tu estrategia (dentro de Claude)', e.estrategia], ['Tu carpeta de Drive', e.carpeta],
  ['Tus fotos', e.fotos], ['Tus vídeos', e.videos], ['Lo que grabas (Brutos)', e.brutos], ['Lo terminado (Editados)', e.editados],
  ['Las skills del equipo (Drive)', AGENTES_DRIVE],
].filter(([, url]) => url).map(([q, url]) => `| ${q} | ${url} |`).join('\n')}
`;
// Google Docs convierte mal las tablas de Markdown (las negritas y los corchetes salen escapados): la guía se sube en
// HTML. Basta con lo que usa la guía: títulos, párrafos, listas, tablas, bloques de texto, negrita y enlaces.
const html = (md) => {
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const enLinea = (t) => esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2">$2</a>');
  const celdas = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const borde = 'border:1px solid #d9d2e9;padding:6pt 8pt;vertical-align:top';
  const out = [];
  const lineas = md.split('\n');
  for (let i = 0; i < lineas.length; ) {
    const l = lineas[i];
    if (!l.trim()) { i++; continue; }
    const h = l.match(/^(#{1,3}) (.*)/);
    if (h) { out.push(`<h${h[1].length}>${enLinea(h[2])}</h${h[1].length}>`); i++; continue; }
    if (l.startsWith('```')) {
      const bloque = [];
      for (i++; i < lineas.length && !lineas[i].startsWith('```'); i++) bloque.push(lineas[i]);
      i++;
      out.push(`<table style="border-collapse:collapse;width:100%"><tr><td style="${borde};background:#f3eefe;font-family:'Courier New'">${bloque.map(esc).join('<br>')}</td></tr></table>`);
      continue;
    }
    if (l.startsWith('|')) {
      const filas = [];
      for (; i < lineas.length && lineas[i].startsWith('|'); i++) if (!/^\|\s*-/.test(lineas[i])) filas.push(celdas(lineas[i]));
      const [cab, ...cuerpo] = filas;
      const copiar = cab[1] === 'Copia esto';
      out.push(`<table style="border-collapse:collapse;width:100%"><tr>${cab.map((c) => `<td style="${borde};background:#ede7f6"><b>${enLinea(c)}</b></td>`).join('')}</tr>${cuerpo.map((f) => `<tr>${f.map((c, j) => `<td style="${borde}${copiar && j === 1 ? ';background:#f3eefe' : ''}">${enLinea(c)}</td>`).join('')}</tr>`).join('')}</table>`);
      continue;
    }
    const lista = l.match(/^(\d+\.|-) /);
    if (lista) {
      const tag = lista[1] === '-' ? 'ul' : 'ol';
      const items = [];
      for (; i < lineas.length && (/^(\d+\.|-) /.test(lineas[i]) || /^ {2,}\S/.test(lineas[i])); i++) {
        if (/^(\d+\.|-) /.test(lineas[i])) items.push(lineas[i].replace(/^(\d+\.|-) /, ''));
        else items[items.length - 1] += ' ' + lineas[i].trim();
      }
      out.push(`<${tag}>${items.map((x) => `<li>${enLinea(x)}</li>`).join('')}</${tag}>`);
      continue;
    }
    const parrafo = [];
    for (; i < lineas.length && lineas[i].trim() && !/^(#|\||```|(\d+\.|-) )/.test(lineas[i]); i++) parrafo.push(lineas[i].trim());
    out.push(`<p>${enLinea(parrafo.join(' '))}</p>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(nombre)} · Empieza aquí</title></head><body style="font-family:Arial">${out.join('\n')}</body></html>`;
};
const salidaGuia = path.join(path.dirname(salida), `${nombre} · Empieza aquí.html`);
writeFileSync(salidaGuia, html(guia));
console.log(`${salidaGuia}: su guía; súbela a la misma carpeta como documento de Google (contentMimeType text/html).`);
