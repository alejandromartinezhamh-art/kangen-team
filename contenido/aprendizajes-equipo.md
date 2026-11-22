# Aprendizajes del equipo

Lo que funciona (y lo que no) y vale para todos. Lo escriben el analista cada domingo, con datos, y el agente
`aprender`, con cada opinión sobre una pieza o una versión final que cambia algo para todo el equipo. Lo leen el
estratega, el guionista y el revisor. Los datos de una sola persona van en `equipo/<persona>/contenido/aprendizajes.md`;
las opiniones sobre su voz, en su ficha de voz (privada). Aquí nunca va nada personal: el repositorio es público.

Formato de cada entrada: fecha · qué hemos visto · con qué datos o de quién es la opinión · qué cambiamos.

## Opiniones y versiones finales
- 2026-11-14 · Carrusel CT-1 (v1): todas las imágenes con el mismo diseño y una sola foto; «muy aburrido, se ve
  estático» · opinión de Alejandro · Regla: cada carrusel con al menos 4 composiciones distintas, nunca dos iguales
  seguidas, al menos 3 fotos reales y un hilo visual que cruce todas las imágenes. Plantilla de carruseles rehecha con
  8 composiciones (`contenido/carruseles/`).
- 2026-11-14 · Carrusel CT-1 (v2): con 8 composiciones, 6 fotos reales y el camino de puntos «me gusta bastante más» ·
  opinión de Alejandro · Se mantiene la regla anterior como estándar de todos los carruseles.

- 2026-11-14 · Las decisiones de contenido (qué herramientas usar, qué 10 ideas hacer) estaban apuntadas como tareas
  para decidir; «no quiero que sea pendientes: si lo publicamos y no funciona, ya te lo diré» · opinión de Alejandro ·
  Regla: lo que Claude puede decidir, lo decide y lo ejecuta, y lo explica en una línea. Pendientes es solo para lo que
  únicamente puede hacer una persona (`CLAUDE.md`, «Decide tú»).
- 2026-11-14 · Había ideas sueltas, pero faltaba la estrategia: qué poner en la presentación, en las destacadas y en lo
  fijado, y por qué se publica cada cosa y en qué orden · opinión de Alejandro · Regla: antes de producir piezas, cada
  persona tiene su perfil definido red por red y sus 100 primeras piezas ordenadas por fases, cada una con su «por qué
  hoy» (`estrategia/perfil-y-100-dias.md`, agente `estrategia-100-dias`). La semana sale de ese plan.

- 2026-11-15 · Los carruseles eran todos de imágenes quietas; «ahora se lleva el motion: la imagen moviéndose, la
  bolita subiendo y bajando por la montaña rusa… no únicamente un carrusel estático» · opinión de Alejandro · Regla:
  cuando el movimiento cuenta la idea, el carrusel lleva una o dos imágenes con movimiento (un vídeo de 5 a 7 segundos:
  un recorrido que se dibuja, una lista que se marca, el titular entrando sobre un vídeo real de la persona). Se hacen
  con `npm run carrusel-animado` (`contenido/carruseles/README.md`).

- 2026-11-16 · Fotos con la cara cortada (frente, barbilla) porque se encuadraban sin saber dónde estaba la cara ·
  opinión de Alejandro · Regla: cada foto se coloca según sus caras y una comprobación automática no deja entregar una
  cara cortada o con texto encima (`npm run carrusel`, `scripts/encuadre.mjs`). Revisión de cada imagen a tamaño real.
- 2026-11-16 · Los carruseles «se van a parecer unos a otros»: diseño plano, misma estructura y mismo número de
  imágenes · opinión de Alejandro · Regla: el largo lo marca el contenido (3, 5, 7-10), un estilo por carrusel distinto
  de los tres anteriores (álbum, revista, tipográfico, documental), titulares que se ajustan a su hueco y dibujos que
  señalan (flechas, círculos, subrayados, pegatinas). Plantilla nueva con 20 composiciones
  (`contenido/carruseles/README.md`).
- 2026-11-16 · Un vídeo con un clip del café apuntando al suelo de la calle · opinión de Alejandro · Regla: cada clip se
  mira entero antes de usarlo (`npm run video -- <carpeta> --planos`, un fotograma por segundo) y el plano enseña lo que
  dice su texto: nada de suelo, pies, techo, movidos ni caras de otros.
- 2026-11-16 · «Algunas letras salen demasiado rápido, cuesta leerlas» · opinión de Alejandro · Regla: cada texto en
  pantalla se queda quieto y entero el tiempo de leerlo: unas 3 palabras por segundo y nunca menos de 2 segundos. Lo
  calculan `npm run video` y la plantilla del Reel animado, y `npm run carrusel-animado` no renderiza si no se cumple.
- 2026-11-16 · «Que pueda elegir yo la foto y editarla, y editar los vídeos con la voz en off sin irnos a otra
  herramienta» · petición de Alejandro · Hecho: cada persona tiene su estudio en Claude (`contenido/estudio/README.md`)
  con su galería; ahí se cambian fotos, encuadre, textos, dibujos e imágenes, se montan los vídeos con su nota de voz y
  avisa en directo de caras cortadas y textos que no se leen.
- 2026-11-16 · Revisión de las versiones 2 de Gemma · aprendido al revisarlas · Reglas: el círculo dibujado solo en
  palabras de la primera línea del titular (debajo pisa la línea de arriba y parece tachado; ahí, subrayado); la hoja
  de libreta, con letra grande y alta, para que no deje media imagen vacía; los largos varían de verdad (de 3 a 8).
- 2026-11-17 · «Que pueda tocar yo los colores de las letras o de los subtítulos, que vaya más rápido o más lento,
  acortar y el tema de la voz» · petición de Alejandro · Hecho: el estudio tiene letras (estilos, colores, caja, tamaño
  y altura), ritmo (velocidad sin cambiar el tono), recortes de la voz, quitar pausas y frases, y subtítulos editables.
- 2026-11-17 · «Clonar la voz de Gemma para todos los vídeos; que lo pueda hacer yo y ella, todo en la nube» ·
  petición de Alejandro · Regla: la voz clonada se puede usar en cualquier pieza, pero solo la de la propia persona,
  con su permiso dado por ella en su estudio («Mi voz») y con la etiqueta de IA; si la pieza cuenta su historia, mejor
  su voz grabada. Se genera en la nube con Qwen3-TTS (gratis).
- 2026-11-20 · Carruseles: «me pones 4 cositas y no está mal, pero se queda muy justo»; faltan imágenes que den
  contexto a lo que se cuenta · opinión de Alejandro · Regla: cada idea con su imagen; si la persona no tiene la foto
  (su trabajo, el camino de vuelta, una mañana), imagen de contexto con IA: sin caras, sin marcas ni texto, con aspecto
  de foto de móvil y con el sello «Imagen creada con IA» y la etiqueta de cada red. Las caras, siempre fotos reales.
  Como mucho dos imágenes seguidas sin foto (`contenido/carruseles/README.md`). Ejemplo: CT-8 de Gemma (v3).
- 2026-11-21 · «La edición de fotos del estudio es muy limitada: no puedo cambiar el formato de las imágenes,
  recortarlas, moverlas, reducir tamaños ni cambiar colores; mejor Canva» · opinión de Alejandro · Regla: los carruseles
  y las imágenes se retocan en Canva. Claude hace la propuesta con la plantilla, la pasa a Canva separada en capas
  (Magic Layers) en la carpeta de la persona, y allí se cambia todo. Lo aprobado se exporta desde Canva y lo que han
  cambiado se aprende (`contenido/canva/README.md`). El estudio se queda para los vídeos.

## Hipótesis de partida (sin datos todavía)
- Los vídeos de historia personal y de dudas frecuentes traerán más leads cualificados que los de estilo de vida.
- Los ganchos con una escena concreta («un domingo por la tarde…») retendrán más que los genéricos.
- Publicar a las 13:00 y a las 20:30 (hora de España).
