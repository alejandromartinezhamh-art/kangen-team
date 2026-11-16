---
name: editor-video
description: Editor de vídeo del equipo. Monta un vídeo vertical con la voz de una persona (su nota de voz) o con textos en pantalla sobre sus clips y fotos, con el gancho arriba, subtítulos al ritmo de la voz y sus colores. Úsala cuando una pieza del Calendario (Reel o Clip corto) ya tenga su material en Drive → Brutos, cuando una pieza sea un Reel animado (solo texto en movimiento sobre sus fotos), o cuando pidan «monta el vídeo» de una pieza. Solo funciona en una sesión con el repositorio.
---

# Montar un vídeo

## Lee primero
- `contenido/videos/README.md` (reglas, qué graba la persona y formato de `pieza.json`).
- La pieza en el Calendario (Notion, `collection://da1053df-19d6-4cfc-8547-c77f511392ae`): su guion, sus planos y su
  **Código**. Si no tiene guion, usa antes `guion`.
- Su ficha de voz: lo marcado ⚠ y su sección «Feedback y aprendizajes». `contenido/aprendizajes-equipo.md`.

## Pasos
1. **Material**: en Drive → `Landing Kangen <Persona>/05 Contenido redes/Brutos`, su voz (`CT-<código> voz`) y sus
   clips. Bájalos a una carpeta de trabajo fuera del repositorio. Si falta la voz o un plano, no lo inventes: apúntalo
   en su pestaña de Pendientes y, si quieres enseñar el formato, haz una maqueta con `"vozDePrueba": true`.
2. **Mira cada clip entero**: `npm run video -- <carpeta> --planos` hace `planos.jpg` con un fotograma por segundo de
   cada uno. Fuera los que apunten al suelo, los pies o el techo, los movidos u oscuros, y los que enseñen caras de
   otras personas, matrículas, su empresa o un viaje presentado como resultado. El plano tiene que enseñar lo que dice
   su texto; elige el trozo con `desde`.
3. Escribe `pieza.json` con los clips en el orden del guion y ejecuta `npm run video -- <carpeta>`.
4. **Revisa** `hoja.png` y los subtítulos: nombres propios y números, que el texto no tape una cara y que cada texto
   se pueda leer (unas 3 palabras por segundo y nunca menos de 2 segundos: el script ya alarga los clips con texto y
   avisa si con voz no da tiempo). Corrige `transcripcion.json` y repite si hace falta.
5. **Entrega** el vídeo como dice el README (en el chat si la sesión es en la nube) y pon la pieza en **Estado** =
   Editado. Pásala por `revisar-normas`.

## Reel animado
Si la pieza es un Reel de solo texto (en sus **Notas**: «Reel animado» o «sin grabar»), no hace falta material de
`Brutos`: sigue «Reel animado» del README con `contenido/videos/plantilla-reel-animado.html` y dos fotos reales suyas de
`01 Fotos originales`. Revisa los fotogramas igual que en el paso 4.

## Normas
- La voz publicada es siempre la de la persona. Nada de voz generada sin su permiso por escrito y sin la etiqueta de IA
  de cada red (y márcalo en **Etiqueta IA** de la pieza).
- Nunca producto, marca, agua, salud, cifras ni promesas, tampoco en los subtítulos.
- El repositorio es público: voces, clips y fotos se quedan en Drive y en la carpeta de trabajo.
