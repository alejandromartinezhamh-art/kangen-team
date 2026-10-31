import { createContext, useContext } from 'react';
import type { DatosEmbudo, Paso } from './tipos';

export const ContextoEmbudo = createContext<DatosEmbudo | null>(null);

/** Persona y contenido.json de la web. Se lee al pintar (no al importar) para que el editor pueda cambiarlo. */
export function useEmbudo() {
  const datos = useContext(ContextoEmbudo);
  if (!datos) throw new Error('Las páginas del embudo van dentro de <Embudo>');
  const { contenido } = datos;
  return {
    ...datos,
    pasos: contenido.cuestionario.pasos as Paso[],
    /** Enlace del vídeo del webinar (YouTube, Vimeo o .mp4). Vacío = aviso de "muy pronto" */
    video: contenido.enlaces.webinar.trim(),
  };
}
