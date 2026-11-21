# Carruseles e imágenes en Canva

Desde el 21 de noviembre, los carruseles y las imágenes sueltas se retocan en **Canva**, no en el estudio. El estudio
no dejaba mover, cambiar de tamaño, recortar ni cambiar el color de cada cosa con libertad. En Canva, cada texto, cada
foto y cada adorno es una pieza suelta. Se puede tocar todo (letras, colores, tamaños, recortes, cambiar una foto, añadir
o quitar), también desde la app del móvil, y para editar basta con el plan gratis. El estudio
(`contenido/estudio/README.md`) se queda para los **vídeos** y la voz.

Se eligió Canva porque el equipo ya lo conoce, tiene app para el móvil y está conectado a Claude. Así Claude crea los
diseños, lee lo que cambia cada persona (para aprender) y los exporta. Figma o un editor propio darían más trabajo y
menos comodidad.

## El camino de una pieza

1. **Claude la hace como siempre**: guion (`.claude/skills/guion/SKILL.md`), plantilla de carruseles
   (`contenido/carruseles/README.md`) y `npm run carrusel`. El encuadre de caras y las normas no cambian.
2. **Claude la pasa a Canva**: separa cada imagen en capas editables con la herramienta **Magic Layers** de Canva y
   las junta en un solo diseño, «CT-<código> · <título> (vN)», en la carpeta de la persona (**Kangen · Carruseles →
   <Nombre>**). Pone el enlace en **Notas** de la pieza en Notion («Editar en Canva: <enlace>») y deja el Estado en
   Editado.
3. **La persona (o Alejandro) lo retoca en Canva**, en el ordenador o con la app: tocar un texto para escribir, cambiar
   letra o color, arrastrar y cambiar el tamaño de cualquier cosa, doble toque en una foto para recortarla, «Sustituir»
   para cambiarla por otra de su galería, y borrar o añadir lo que quiera. Se guarda solo.
4. **Cuando le guste**, Estado = **Aprobado** en Notion (o le dice a su Claude «apruébame la pieza del día…»).
5. **En la siguiente sesión con el repositorio**, Claude exporta el diseño a PNG (abajo, «Exportar lo aprobado»), lo
   sube a Drive → Editados y lo pone en **Archivo**. Después compara lo que ha cambiado con lo que propuso y lo pasa por
   `aprender`: si ella siempre agranda los titulares o cambia un color, eso se convierte en regla.

## Cómo lo hace Claude (sesión con el repositorio y el conector de Canva)

1. `npm run carrusel -- <carpeta>` → `01.png`, `02.png`… (1080 × 1350), sin avisos de caras.
2. **Subir las imágenes**: una llamada a `create-upload-url` del conector de Canva por imagen. Cada dirección vale para
   un solo archivo y caduca en media hora. Después, `npm run canva-subir -- <carpeta>/01.png=<dirección>
   <carpeta>/02.png=<dirección> …` → el `mediaId` de cada imagen.
3. **Separar en capas**: `separate-image-layers` con `asset_id` = ese `mediaId` y el título «CT-<código> · imagen N».
   Después, `get-separate-image-layers-job` hasta que esté hecho → un diseño de una página por imagen.
4. **Juntarlas**: `merge-designs` con `type: "create_new_design"`, el título «CT-<código> · <título> (vN)» y un
   `insert_pages` por diseño, en orden. Canva pide permiso antes de cada unión: di en el chat qué imágenes juntas y con
   qué nombre. Cuando la persona pide «pásalo a Canva», ya lo está pidiendo.
5. **Ordenar**: `move-item-to-folder`. El diseño final va a la carpeta de la persona. Los de una sola imagen van a
   «Pruebas (se pueden borrar)».
6. **Revisarlo**: `read-design` con las miniaturas de cada página y su texto. Tienen que estar todos los textos, sin
   cortes. Las fotos tienen que ser las reales: Magic Layers rehace el fondo que había detrás de los textos, así que
   mira bien cada cara. Si una foto ha cambiado, cámbiala por la original: súbela con `canva-subir`, abre la edición
   con `read-design` y `open_transaction`, y aplica `edit-design` → `update_fill` y `crop_media`. Las letras las elige
   Canva entre las suyas: Caveat y la letra de máquina salen iguales; los titulares, en una muy parecida a Inter Tight;
   la palabra en cursiva (DM Serif Display) puede salir en otra cursiva. Corrígelo si hace falta.
7. **Notion**: en **Notas**, «Editar en Canva: <enlace del diseño>».

### Carpetas de Canva

| Carpeta | Enlace |
| --- | --- |
| Kangen · Carruseles | <https://www.canva.com/folder/FAHbjFsW0n0> |
| Gemma | <https://www.canva.com/folder/FAHbjOlx7nQ> |
| Alejandro | <https://www.canva.com/folder/FAHbjPydRG0> |
| Pruebas (se pueden borrar) | <https://www.canva.com/folder/FAHbjGWn6gE> |

Para una persona nueva: `create-folder` con su nombre dentro de «Kangen · Carruseles» y, en su pestaña de Pendientes
(en «Lo que haces tú con…»), compartirle la carpeta: abrir la carpeta → Compartir → su Gmail → «Puede editar». Ella
necesita una cuenta de Canva con ese Gmail; la gratis basta.

## Exportar lo aprobado

1. `get-export-formats` y `export-design` con `type: "png"` → un PNG por página (1080 × 1350).
2. Mira cada imagen a tamaño real: caras enteras, normas (`estrategia/normas-comunicacion.md`) y el sello de IA donde
   haga falta.
3. Súbelas a Drive → `Landing Kangen <Persona>/05 Contenido redes/Editados/CT-<código> <título> (vN final)` y pon la
   carpeta en **Archivo**.
4. **Aprender**: `read-design` del diseño final contra lo que propusiste (textos, tamaños, colores, fotos) →
   `aprender`. Marca **Aprendido**.

## Créditos de Canva

Magic Layers es una herramienta de IA «premium» de Canva y gasta un crédito por imagen. El plan gratis da muy pocos al
mes (el 21 de noviembre se acabaron con 6 imágenes). Canva Pro (12 € al mes, una persona) da diez veces más. Basta con
la cuenta de Alejandro, que es la conectada a las sesiones. Las demás editan con su cuenta gratis, porque editar no
gasta créditos.

Si se acaban, dilo en el chat y apúntalo en la pestaña de Alejandro de Pendientes. Mientras tanto, la pieza se entrega
como antes (PNG en Drive) con «Pendiente de pasar a Canva» en Notas, y se pasa en cuanto vuelva a haber créditos (cada
mes se recargan).

## Su Claude y Canva

Cada persona puede conectar Canva a su Claude (Ajustes → Conectores → Canva). Así su Claude ve sus diseños y puede
hacer cambios sencillos, como cambiar un texto, un color o una foto, sin gastar créditos. Separar en capas y juntar
imágenes lo hace la sesión del equipo.
