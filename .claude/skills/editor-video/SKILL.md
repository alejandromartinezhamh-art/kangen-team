---
name: editor-video
description: Editor de vídeo del equipo. Monta un vídeo vertical con la voz de una persona (su nota de voz) o con textos en pantalla sobre sus clips y fotos, con el gancho arriba, subtítulos al ritmo de la voz y sus colores. Úsala cuando una pieza del Calendario (Reel o Clip corto) ya tenga su material en Drive → Brutos, cuando una pieza sea un Reel animado (solo texto en movimiento sobre sus fotos), o cuando pidan «monta el vídeo» de una pieza. Solo funciona en una sesión con el repositorio.
---

# Montar un vídeo

## Lee primero
- `contenido/videos/README.md` (reglas, qué graba la persona, formato de `pieza.json`, cortar la voz y medir referencias).
- La pieza en el Calendario (Notion, `collection://da1053df-19d6-4cfc-8547-c77f511392ae`): su guion, sus planos y su
  **Código**. Si no tiene guion, usa antes `guion`.
- Su ficha de voz: lo marcado ⚠ y su sección «Feedback y aprendizajes». `contenido/aprendizajes-equipo.md`.

## Pasos
1. **Material**: si la pieza está en su **estudio** (`contenido/estudio/README.md`) y en «Listo», ya trae los planos,
   los textos, los tiempos y la voz: bájalos y escribe `pieza.json` con `npm run estudio -- preparar`, y sigue en el
   paso 2. Si no, en Drive → `Landing Kangen <Persona>/05 Contenido redes/Brutos`, su voz (`CT-<código> voz`) y sus
   clips. Bájalos a una carpeta de trabajo fuera del repositorio. Si falta la voz o un plano, no lo inventes: apúntalo
   en su pestaña de Pendientes y, si quieres enseñar el formato, haz una maqueta con `"vozDePrueba": true`. Si un archivo
   pesa demasiado para la sesión, pide que lo suban desde el ordenador (no es un bloqueo: lo dice el README).
2. **Mira cada clip entero**: `npm run video -- <carpeta> --planos` hace `planos.jpg` con un fotograma por segundo de
   cada uno. Fuera los que apunten al suelo, los pies o el techo, los movidos u oscuros, y los que enseñen caras de
   otras personas, matrículas, su empresa o un viaje presentado como resultado. El plano tiene que enseñar lo que dice
   su texto; elige el trozo con `desde`.
3. **Voz con tropiezos o muy larga**: `npm run video -- <carpeta> --cortar` → `guion-bruto.txt`. Lee las líneas y
   escribe `cortes.json` con lo que se quita (muletillas, titubeos, repeticiones, pausas largas; la mejor toma de cada
   línea). Vuelve a ejecutar `--cortar`: sale `voz-cortada.m4a`, `guion-cortado.txt` y la comprobación palabra a palabra.
   **Para aquí y enseña el guion cortado** (`guion-cortado.txt`) para el OK. Después pon `"voz": "voz-cortada.m4a"` en
   `pieza.json`. Si la comprobación avisa de palabras perdidas, corrige `cortes.json` antes de seguir.
4. Escribe `pieza.json` con los clips en el orden del guion y ejecuta `npm run video -- <carpeta> --storyboard` →
   `storyboard.png` y `storyboard.txt`: un fotograma por momento, con su texto y lo que se oye. **Para aquí y enseña el
   storyboard** para el OK. Es lo barato para cambiar de idea: si cambian clips, textos o el orden, se cambia
   `pieza.json` y se vuelve a hacer el storyboard antes de renderizar.
5. Con el OK, `npm run video -- <carpeta>` → `renders/v<N>.mp4` y `renders/v<N>-hoja.png`. Cada render es una versión
   nueva: nunca se pisa una anterior.
6. **Revisa** la hoja y los subtítulos: nombres propios y números, que el texto no tape una cara y que cada texto se
   pueda leer (unas 3 palabras por segundo y nunca menos de 2 segundos: el script ya alarga los clips con texto y avisa si
   con voz no da tiempo). Si algo falla, corrígelo y saca una versión nueva.
7. **Entrega** el vídeo como dice el README (si pesa más de lo que la sesión sube a Drive, lo sube quien lo tiene en su
   ordenador) y pon la pieza en **Estado** = Editado. Pásala por `revisar-normas`.

## Referencias (antes de diseñar una pieza nueva)
Si la pieza usa un vídeo de referencia del Radar, mídelo con `npm run medir -- <archivo.mp4> <carpeta>` (cortes, ritmo,
primeros dos segundos, luz y volumen) y apunta en `a_mano` lo que se ve a ojo (subtítulos, composición, textos). Nunca
guardes ni repitas el vídeo ni sus textos: solo las medidas. Lo que se repite entre referencias, con `aprender`.

## Reel animado
Si la pieza es un Reel de solo texto (en sus **Notas**: «Reel animado» o «sin grabar»), no hace falta material de
`Brutos`: sigue «Reel animado» del README con `contenido/videos/plantilla-reel-animado.html` y dos fotos reales suyas de
`01 Fotos originales`. Revisa los fotogramas igual que en el paso 6.

## Normas
- La voz publicada es siempre la de la persona. Nada de voz generada sin su permiso por escrito y sin la etiqueta de IA
  de cada red (y márcalo en **Etiqueta IA** de la pieza).
- Nunca producto, marca, agua, salud, cifras ni promesas, tampoco en los subtítulos.
- El repositorio es público: voces, clips, fotos y vídeos de referencia se quedan en Drive y en la carpeta de trabajo.
