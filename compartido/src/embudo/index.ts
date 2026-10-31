// Embudo de Instagram → cuestionario → email → webinar, común a todas las webs que lo usan.
// Cada web: <Embudo persona={persona} contenido={contenido} /> en su App.tsx. Ver Embudo.tsx.
export { Embudo } from './Embudo';
export { useEmbudo } from './contexto';
export { default as Enfasis } from './Enfasis';
export type { ContenidoEmbudo, DatosEmbudo, Paso, Campo } from './tipos';
