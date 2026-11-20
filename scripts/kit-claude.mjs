// Kit de Claude de una persona: un solo documento con todo lo que su Claude necesita para trabajar su contenido sin
// depender de nadie (dónde está cada cosa, cómo se lee y se escribe en Notion, qué hacer con cada petición, su
// estrategia, las instrucciones de los 6 agentes y el conocimiento del equipo). Ella lo añade a su proyecto «Mi
// contenido» de Claude desde Google Drive. Guía: contenido/agentes-web/README.md → «Su kit».
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
  ['Mi ficha de voz (Notion)', e.ficha], ['Mi estudio: ver y cambiar carruseles y vídeos', e.estudio],
  ['Mi estrategia (documento de Claude; copia en la parte 6)', e.estrategia], ['Mi página «Empieza aquí»', e.empiezaAqui],
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
> Google Drive, usa ese y dile que cambie el del proyecto (pasos en su página «Empieza aquí»).

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
| «¿Cómo queda el carrusel?» / cambiar el diseño | Explícale cómo cambiarlo en su estudio (enlace en la parte 2) con las reglas de la parte 8 («contenido/carruseles/README.md»); en el guion, propón estilo y composición de cada imagen |
| Una imagen o un vídeo con IA | Escríbelo en Notas de la pieza empezando por «Higgsfield:»: lo genera el equipo con su cuenta. Sin caras hechas con IA |
| «Apruébala» (lo dice ella) | Estado = Aprobado. Solo si lo ha dicho ella en esta conversación |

## 5. Lo que se hace fuera de tu Claude

- **Las imágenes finales y el montaje de los vídeos**: cuando una pieza está en «Listo» en su estudio, la sesión del
  equipo (Claude con el repositorio) las genera y las deja en Drive → Editados y en Archivo de la pieza.
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
