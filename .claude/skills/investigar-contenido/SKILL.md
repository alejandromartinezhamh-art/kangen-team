---
name: investigar-contenido
description: Investigador del equipo. Busca contenido que ya funciona en redes (Reels, TikToks, Shorts y anuncios activos de Meta) sobre negocio y alternativas a un sueldo, cambiar de vida, invertir en uno mismo y mentalidad, explica por qué funciona y propone cómo adaptarlo a una persona del equipo. Deja cada hallazgo en Notion → Radar de referencias. Úsala los lunes antes del plan semanal o cuando pidan ideas o referencias.
---

# Investigar contenido que funciona

Objetivo: que el plan de cada semana parta de formatos y ganchos que **ya han demostrado** que funcionan, adaptados a la
historia y la voz de cada persona. **Se adapta la estructura, nunca se copia** el texto, el vídeo ni la idea concreta.

## Antes de buscar
Lee `estrategia/marketing.md` (tipos de contenido y límites), `estrategia/icp.md`, `estrategia/normas-comunicacion.md`,
`contenido/aprendizajes-equipo.md` y, si es para una persona, su ficha de voz en Notion
(`collection://8fdf7563-98ef-41e5-8899-19349d98657d`) y su `aprendizajes.md`. Mira en el Radar (Notion,
`collection://ca35d60d-116e-4405-a39a-4c21cfc9c4d7`) lo que ya hay para no repetir.

## Dónde buscar

Con Firecrawl (`firecrawl_scrape` con `alexandria`; los contratos, con `firecrawl_find_tools`). Varias búsquedas en una
sola llamada (hasta 10).

| Fuente | Proveedor y capacidad | Coste | Cómo usarla |
|---|---|---|---|
| Reels de Instagram | `oriane` · `instagram/posts-search` | 50 créditos por búsqueda (`projection: default`, trae visualizaciones y seguidores) | `caption` con una **frase concreta** («dejé mi trabajo», «sin dejar tu trabajo», «zona de confort»). Ordena por `engagementRatePerFollowers:desc` o `viewsCount:desc`, `limit` 12-15 |
| TikToks | `oriane` · `tiktok/posts-search` | 50 créditos | Igual que Instagram |
| YouTube y Shorts | `youtube-com` · `videos/search_videos`, `video_transcript`, `video_comments` | 5 créditos | `sort: view_count`. Los comentarios dicen qué ha tocado a la gente |
| Anuncios de Meta | `upspring` · `ads/search`, `ads/detail` | 50 créditos por página | Su base es sobre todo de marcas de EE. UU.: úsala para estructuras de anuncio. Para anuncios en España, la biblioteca de anuncios de Meta (país España, por palabra clave) |
| Cuentas de referencia | Las mismas capacidades con `handle` | 50 créditos | Las cuentas que el equipo apunta en la pregunta 9.3 del cuestionario y las que ya han dado buenas referencias |
| Lo que nos funciona a nosotros | Analista (hoja de leads con el código CT-123) | — | Cuando haya datos, manda sobre todo lo demás |

Presupuesto orientativo: unos 300-400 créditos por ronda semanal.

**La regla para saber si algo funciona**: no basta con muchas visualizaciones (una cuenta grande siempre las tiene).
Cuenta lo que **se sale de su cuenta**:
- Visualizaciones de **más de 1 vez sus seguidores** (`viewsRatePerFollowers` > 100) en cuentas de menos de 100 mil, o
  de 3 veces la media de sus últimos vídeos si la conoces.
- Y además alguna de estas: **compartidos** de más del 1 % de las visualizaciones, **comentarios** de más del 1 %, o el
  mismo formato funcionando dos veces (en la misma cuenta o en otras).
- Un anuncio que lleva **meses activo**.

Lo aprendido en la primera ronda (31 de octubre de 2026):
- Palabras sueltas como «sueldo» traen política, fútbol y humor: busca frases que diría nuestro cliente ideal.
- Si no hay visualizaciones (carruseles), la señal son los comentarios y los compartidos.
- Con `projection: default` no hay transcripción ni enlace directo: el enlace se arma con el código de la miniatura
  (`instagram.com/p/<código>/`, `tiktok.com/@<cuenta>/video/<id>`) y la estructura por segundos se apunta al ver el vídeo.
  Para 1-2 finalistas, `projection: full` (65 créditos) trae la transcripción.

Temas (los seis pilares): alternativas a depender de un sueldo, emprender sin dejar el trabajo, cobrar por horas frente
a construir algo, cambiar de vida a los 30/40/50, la relación con el dinero e invertir en uno mismo, mentalidad y zona de
confort, construir en público, dudas de quien empieza. En español, y en inglés si el formato es trasladable. **No**
contenido de producto, salud, «hazte rico», bolsa, cripto ni rentabilidades: si algo funciona pero incumple las normas,
apúntalo como **Descartada** con el motivo (sirve de ejemplo al equipo).

## Qué apuntar (una fila por referencia en el Radar)
- **Referencia**: título corto · **Enlace** · **Red** · **Formato** · **Cuenta**.
- **Señal**: los números (visualizaciones frente a seguidores, compartidos, comentarios, meses activo) y la fecha.
- **Por qué funciona**: gancho (literal), estructura (tramos y duración), emoción, plano, texto en pantalla.
- **Idea adaptada**: cómo lo haría la persona con su historia y su voz, en 2-3 frases, cumpliendo las normas.
- **Pilar**, **Para** (persona o «Todo el equipo»), **Estado** = Nueva.

Entre 5 y 10 referencias por semana es suficiente; mejor pocas y bien explicadas.

## Nunca
- Proponer copiar el vídeo, el texto o la música de otra persona.
- Referencias que incumplan las normas (cifras, lujo, salud, producto, marca, «es un trabajo»).
- Datos que no hayas visto: si no ves el número, escribe «no visible».
