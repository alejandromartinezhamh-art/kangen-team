// Fotos subidas desde el editor: se reducen en el móvil o el ordenador antes de enviarlas
// (máx. 2000 px por lado, JPG), como pide el README para todo lo que va a la web.

const LADO = 2000;

export async function reducirFoto(archivo: File): Promise<string> {
  const imagen = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
  const escala = Math.min(1, LADO / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  lienzo.getContext('2d')!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  // Calidad más baja si sigue pesando mucho (objetivo: menos de 500 KB).
  let datos = '';
  for (const calidad of [0.82, 0.72, 0.62]) {
    datos = lienzo.toDataURL('image/jpeg', calidad);
    if (datos.length * 0.75 < 500_000) break;
  }
  return datos;
}

export const esFotoNueva = (src: unknown): src is string => typeof src === 'string' && src.startsWith('data:image/');
