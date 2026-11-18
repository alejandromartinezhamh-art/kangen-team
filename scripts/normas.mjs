// Lo que nunca puede salir en un texto público (estrategia/normas-comunicacion.md). Lo usan npm run comprobar (webs y
// curso) y npm run publicar (el texto de cada pieza antes de mandarla a las redes).
export const PROHIBIDO = [
  [/\b(kangen|enagic)\b/i, 'marca (Kangen / Enagic)'],
  [/\d[\d.,]*\s*(€|euros?\b|k€)/i, 'cifra de dinero'],
  [/(€|\$)\s*\d/, 'cifra de dinero'],
  [/hazte ric|sin esfuerzo|dinero f[aá]cil|libertad financiera|ingresos pasivos|trabaja (solo )?1 hora/i, 'promesa económica'],
  [/\b(alcalin\w*|ioniza\w*|antioxidante\w*|cur(a|ar|ación)\b|enfermedad\w*|hidrógeno|detox\w*|desintoxica\w*|alivia\w*|sistema inmun\w*)/i, 'afirmación de salud o producto'],
  [/buscamos personal|contratamos|oferta de trabajo|puesto de trabajo|se busca(n)? (personas|gente)/i, 'parece una oferta de empleo'],
];

// [[dónde, texto]] → ['dónde: motivo («lo encontrado»)']
export function incumplimientos(textos, reglas = PROHIBIDO) {
  const fallos = [];
  for (const [donde, texto] of textos) {
    for (const [patron, motivo] of reglas) {
      const m = texto.match(patron);
      if (m) fallos.push(`${donde ? `${donde}: ` : ''}${motivo} («${m[0]}»)`);
    }
  }
  return fallos;
}
