import type { ComponentType } from 'react';
import Ejemplo from './Ejemplo';

// Cada landing se publica en /l/<clave>. Usa una por campaña o anuncio para medir qué funciona.
export const landings: Record<string, ComponentType> = {
  ejemplo: Ejemplo,
};
