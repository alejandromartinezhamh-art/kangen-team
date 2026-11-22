// Paquete de agentes para Claude en la web (cada persona con su Claude): npm run paquete-agentes
// Crea dist/agentes-web/<agente>.zip, uno por agente, para subirlos en claude.ai → Ajustes → Capacidades →
// Skills. Cada zip lleva el SKILL.md del agente (con una descripción corta y una nota para Claude en la web) y, en
// repo/, los archivos del repositorio que citan los agentes, con la misma ruta. Pasos: contenido/agentes-web/README.md.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const raiz = path.resolve(import.meta.dirname, '..');
const salida = path.join(raiz, 'dist', 'agentes-web');

// La ayuda de Claude limita la descripción a 200 caracteres al subir una skill: aquí va una versión corta.
const AGENTES = {
  'entrevista-historia':
    'Pasa el cuestionario de historia de una persona del equipo a su ficha de voz en Notion o la entrevista con preguntas cortas. Úsala con «entrevístame» o «actualiza mi ficha».',
  'estrategia-100-dias':
    'Define la estrategia de perfil de una persona del equipo y sus 100 primeras piezas, por fases, en el Calendario de Notion. Úsala una vez por persona o cuando pidan su estrategia.',
  'plan-semanal':
    'Prepara el plan de contenido de la semana de una persona en el Calendario de Notion: pilar, formato, fecha, gancho y guion. Úsala los lunes o cuando pidan el plan de la semana.',
  guion:
    'Escribe el guion de un vídeo o carrusel con la voz de una persona del equipo, el texto de cada red y la llamada a la acción. Úsala para cada pieza del Calendario de Notion.',
  'revisar-normas':
    'Comprueba que una pieza o un anuncio cumple las normas del equipo y de cada red. Úsala antes de pasar una pieza a «Para aprobar» o cuando pregunten si algo se puede publicar.',
  aprender:
    'Convierte cada opinión sobre una idea o una pieza, y cada versión final, en reglas para la ficha de voz y el equipo, y rehace lo pendiente. Úsala cuando alguien diga qué le gusta o no.',
};

// Archivos del repositorio que citan los agentes (el repositorio es público: aquí no hay nada personal).
const personas = readdirSync(path.join(raiz, 'equipo')).filter((p) => existsSync(path.join(raiz, 'equipo', p, 'sitio')));
const REFERENCIAS = [
  'estrategia/marketing.md',
  'estrategia/mensaje.md',
  'estrategia/normas-comunicacion.md',
  'estrategia/icp.md',
  'estrategia/perfil-y-100-dias.md',
  'contenido/README.md',
  'contenido/formatos.md',
  'contenido/ganchos.md',
  'contenido/aprendizajes-equipo.md',
  'contenido/carruseles/README.md',
  'contenido/carruseles/plantilla.html',
  ...personas.flatMap((p) => [`equipo/${p}/design.md`, `equipo/${p}/contenido/aprendizajes.md`]),
].filter((r) => existsSync(path.join(raiz, r)));

const hoy = new Date().toISOString().slice(0, 10);
const nota = `> **Claude en la web.** Copia del agente del equipo del ${hoy}. Los archivos del repositorio que cita
> (\`estrategia/…\`, \`contenido/…\`, \`equipo/<persona>/…\`) están dentro de esta skill, en \`repo/\`, con la misma ruta;
> el dominio de cada web está en \`repo/equipo/<persona>/sitio/src/config.ts\`. Notion y Google Drive se usan con sus
> conectores: si no están conectados, pide a la persona que los conecte (Ajustes → Conectores). Aquí nunca escribes en
> el repositorio ni en GitHub: lo que estas instrucciones manden guardar en un archivo del repositorio va a Notion →
> **Propuestas para todo el equipo** (\`collection://41857db8-a618-8110-99bf-000bb8441638\`). Lo que pidan ejecutar con
> \`npm run …\` no se puede aquí: apúntalo en **Notas** de la pieza para la siguiente sesión con el repositorio.
`;

function comprobar(nombre, descripcion) {
  if (!/^[a-z0-9-]{1,64}$/.test(nombre)) throw new Error(`Nombre no válido: ${nombre}`);
  if (descripcion.length > 200) throw new Error(`${nombre}: la descripción corta pasa de 200 caracteres (${descripcion.length})`);
  if (/[<>]/.test(descripcion)) throw new Error(`${nombre}: la descripción no puede llevar < ni >`);
}

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

for (const [nombre, descripcion] of Object.entries(AGENTES)) {
  comprobar(nombre, descripcion);
  const original = readFileSync(path.join(raiz, '.claude/skills', nombre, 'SKILL.md'), 'utf8');
  const cuerpo = original.replace(/^---\n[\s\S]*?\n---\n/, '');
  const carpeta = path.join(salida, nombre);
  mkdirSync(carpeta, { recursive: true });
  writeFileSync(
    path.join(carpeta, 'SKILL.md'),
    `---\nname: ${nombre}\ndescription: ${descripcion}\n---\n\n${nota}${cuerpo}`,
  );
  for (const r of REFERENCIAS) cpSync(path.join(raiz, r), path.join(carpeta, 'repo', r));
  // Del config.ts de cada web, solo lo que usa el guionista (el dominio), sin emails ni datos legales.
  for (const p of personas) {
    const config = readFileSync(path.join(raiz, 'equipo', p, 'sitio/src/config.ts'), 'utf8');
    const dominio = config.match(/dominio:\s*'([^']+)'/)?.[1];
    if (!dominio) continue;
    const destino = path.join(carpeta, 'repo/equipo', p, 'sitio/src/config.ts');
    mkdirSync(path.dirname(destino), { recursive: true });
    writeFileSync(destino, `// Copia reducida para Claude en la web: solo el dominio de su web.\nexport const dominio = '${dominio}';\n`);
  }
  execFileSync('zip', ['-qr', `${nombre}.zip`, nombre], { cwd: salida });
  rmSync(carpeta, { recursive: true });
  console.log(`${nombre}.zip`);
}
console.log(`\n${Object.keys(AGENTES).length} agentes en ${path.relative(raiz, salida)}/ (${REFERENCIAS.length} archivos de referencia en cada uno)`);
