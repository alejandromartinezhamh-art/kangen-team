# Helena Saigi — Landing Page Style & Design Reference
> A warm, Mediterranean, editorial landing that makes room for nature, water, everyday rituals and a more conscious way of living. A quiet black-ink-and-eggshell interface, softened by **#cacab0** and **#d5d5c4**, with personal storytelling rather than conventional product-selling aesthetics.

**Theme:** light  
**Languages:** Catalan (`ca`, default), Spanish (`es`), English (`en`)  
**Reference status:** faithful documentation of the **existing visual prototype**, not a final brand book or approved sales page.  
**Purpose:** portable, self-contained specification for AI website builders (Framer, Lovable, Webflow, Replit and similar tools).  
**Structural status:** the current section order is a **prototype**, not a final information architecture. The team will decide the definitive structure; retain the current design system even if the order changes.  
**Source implementation:** `Landing_Helena_Saigi_Proposta_Visual.html` (prototype used to derive the details below).

---

## Design Intent — What the Site Must Communicate

Helena Saigi's story began with a journey in 2023, a meaningful friendship and growing curiosity about everyday wellbeing. Water became an accessible, everyday entry point into bigger questions about conscious decisions, nature, sustainability, time and the role of work in a good life.

**The brand should feel:** natural · conscious · inspiring; warm, sophisticated, grounded, contemporary, quietly optimistic, human, Mediterranean, non-pretentious. The reader should feel they are visiting an independent lifestyle brand rather than a reseller's catalogue.

**It should NOT feel:** high-pressure sales, luxury resort, tech startup, medical site, generic wellness template, new-age spirituality, MLM landing, or stock-photo advertising. The product and Enagic distribution activity may be described accurately, but neither should dominate the visual identity.

The conversion goal is eventually to let interested visitors watch a webinar and optionally schedule a conversation. In the current mockup, both are **visual placeholders**, not working services. Do not promise a working webinar player, booking flow or business outcome unless a real integration exists.

## Tokens — Colors

These are the **actual prototype values**. The two requested accent replacements are already applied. Preserve all values unless the user explicitly revises them.

| Name | Hex | CSS Token | Role / Real Use |
|---|---|---|---|
| Eggshell | `#fdfcfc` | `--color-eggshell` | Main page background, white-style cards, outline buttons, modal, paper-like negative space |
| Warm Taupe | `#f5f3f1` | `--color-warm-taupe` | Quote block, webinar enclosure, calendar panel, soft secondary surfaces |
| Stone | `#ebe8e4` | `--color-stone` | 1px separators, fine outlines, quiet card borders |
| Ink | `#000000` | `--color-ink` | Primary headlines, brand, primary filled button |
| Graphite | `#44403b` | `--color-graphite` | Dense secondary headings and labels, hover on dark buttons |
| Smoke | `#777169` | `--color-smoke` | Muted headline lines, running text, subdued descriptions |
| Ash | `#a59f97` | `--color-ash` | Very subtle metadata, microcopy, fine hairline motifs |
| Natural accent A | `#cacab0` | `--color-violet-spark` *(legacy token name)* | Pale warm sage/stone accent: selection, abstract discs, subtle ornamental panels, warmer button variation |
| Natural accent B | `#d5d5c4` | `--color-ember-orange` *(legacy token name)* | Light grey-sage accent: demo bar, business band, visual cards, calendar highlights |
| Button border | `#e5e5e5` | — | Small button outlines |
| White ink on black | `#ffffff` / `white` | — | Button label or caption over photographs, not page backgrounds |

**Important:** the token names `--color-violet-spark` and `--color-ember-orange` are inherited from the original ElevenLabs style file. Their **values are no longer violet/orange**. If refactoring names in a new project, aliases are acceptable, but **do not reintroduce** `#0447ff` or `#ff4704`.

### Color treatment

- 80–90% of the interface is eggshell, taupe, fine warm greys and black ink; the two natural accents are restrained.
- `#d5d5c4` is especially noticeable in the **wide business-opportunity band**, visually balancing the page without loud colors.
- `#cacab0` appears in soft graphic circles, selected objects, calendar dots and accent details.
- Water imagery can contain natural atmospheric blue/green; do **not** turn buttons, headers or the interface into a bright-blue water-brand aesthetic.
- The sea and mountain artwork contains additional scene-specific muted tones (`#5c716b`, `#68746a`, `#6e8179`, etc.). These are **illustration pigments**, not new global UI accent colors.

## Tokens — Typography

### Display — Waldenburg Light

**CSS stack in actual prototype:** `'Waldenburg','Inter Display','Inter',ui-sans-serif,system-ui,sans-serif`.

- **Weight:** 300.
- **Actual prototype display tracking:** `-0.047em`; the statement/quote section uses `-0.055em` for extra compression.
- **Global display line height:** `1.055`; hero overrides with `1.075`.
- **Purpose:** hero, personal-story statement, pull quote, water title, webinar title, life manifesto, business heading and booking heading.
- **Fallback:** Inter Light or another similarly airy contemporary sans with restrained stroke weight. Do not replace with a bold geometric face or decorative serif.
- The original guide suggested `-0.02em`, but the **rendered Helena prototype deliberately uses tighter tracking**. When reproducing the actual prototype, prioritize the values documented here.

### Body / UI — Inter

- **Stack:** `'Inter', ui-sans-serif, system-ui, sans-serif`.
- **Weights:** 400 body, 500 links/buttons/eyebrows, rarely heavier.
- **Default page body:** 16px, line-height 1.55.
- **Typical body inside sections:** 14px with 1.8–1.9 line-height; hero description 15px / 1.75.
- **Buttons:** 13px / weight 500, compact and calm.
- **Navigation:** 12px.
- **Eyebrow / kicker:** 10.5px, tracking `.17em`, weight 500, uppercase.
- **Small over-image captions / metadata:** 9–11px with wide tracking.
- **Brand wordmark:** 22px, weight 500, tracking `-.055em`; secondary line 9px, tracking `.2em`.

### Actual type scale by use

| Role | Approx. desktop sizing | Weight | Notes |
|---|---|---|---|
| Hero headline | `clamp(45px, 4.35vw, 69px)` | 300 | Four deliberate lines, left aligned; last two in smoke grey |
| Statement quote | `clamp(46px, 5.4vw, 83px)` | 300 | Three lines; middle line smoke |
| Story headline | `clamp(35px, 3.2vw, 50px)` | 300 | Longer editorial title, right column |
| Water headline | `clamp(39px, 3.65vw, 56px)` | 300 | Left column |
| Webinar headline | `clamp(38px, 3.4vw, 52px)` | 300 | Within warm-taupe panel |
| Life manifesto | `clamp(42px, 4.3vw, 68px)` | 300 | Large left block |
| Business heading | `clamp(42px, 4vw, 63px)` | 300 | Large headline over natural accent B |
| Booking heading | `clamp(42px, 4.5vw, 67px)` | 300 | Large left block |
| Section description | 14px | 400 | Ink/smoke with generous line height |
| Minor headline / value | 18–21px | 300 | Light editorial treatment |
| Eyebrow | 10.5px | 500 | Uppercase, wide tracking |

**Font licensing:** the prototype uses font-family stacks, but does not embed licensed font binaries. Load Waldenburg only with a valid license; a Light sans fallback is acceptable.

## Tokens — Spacing & Shapes

**Layout density:** spacious editorial, with intentional contrast between open and grouped regions.  
**Layout width:** maximum `1280px`.  
**Desktop horizontal gutters:** `54px` in the actual implementation (the original reference suggested 64px; **54px is the value used in this design**).  
**Tablet gutters:** `32px` at ≤1000px.  
**Mobile gutters:** `20px` at ≤720px.  
**Section vertical rhythm:** approximately 80–150px depending on section; no crowded stacks.

| Item | Actual value | Use |
|---|---|---|
| Regular card radius | `20px` | Story visuals, value cards, video viewport |
| Large card / hero image radius | `24px` | Hero image, water art, long landscape image, webinar enclosure, calendar |
| Mobile image radius | `20px` | Hero visual |
| Button / label radius | `9999px` | Filled, outline, story photo caption |
| Button height | minimum `46px` | Standard CTA |
| Button padding | `12px 21px` | Black, outline, warm |
| Calendar / content inset | `32px` | Internal card padding |
| Hero visual minimum height | `610px` | Desktop |
| Webinar stage minimum height | `450px` | Desktop |
| Full-width life visual | `450px` | Desktop |
| Business strip vertical padding | `120px` | Desktop |
| General separators | `1px solid #ebe8e4` | Fine borders only |

### Spacing scale retained from ElevenLabs foundation

`4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 160px` — adapt between these values while keeping the **actual section relationships** illustrated below.

## Components

### 1. Provisional status bar (demo only)

- Full-width strip, 28px tall, **`#d5d5c4` background**, centered 9px uppercase text with tracking `.14em`.
- This is only a **prototype label**: `PROPOSTA VISUAL · NO ÉS LA WEB DEFINITIVA` (localized).
- Remove from a released public page, or retain only if the page is explicitly still a concept.

### 2. Header + minimal wordmark + language selector

- Total height **76px**, eggshell background and no heavy borders/shadows.
- Wordmark left: `HELENA SAIGI`; very small second line `WATER · RITUALS · LIFE`.
- Quiet inline navigation centre/right; simple **CA · ES · EN** switch; CTA `Parlem?` as dark pill at far right.
- Mobile hides nonessential nav links but keeps wordmark, language control and call CTA.
- Do **not** assume the name `Helena Saigi` is final brand naming. It is the working label used in the visual prototype.

### 3. Filled Pill Button

- Black background `#000`, white text, `9999px` radius, `min-height:46px`, `13px Inter 500`, `12px 21px` padding.
- Button hover: translates **-2px vertically**; dark background shifts to graphite `#44403b`.
- Arrow glyph can be `↗` or `↘` according to function.
- Used for discovery CTA, webinar and booking interactions.

### 4. Outline Pill Button

- Eggshell background, black text, hairline `#e5e5e5` stroke, same geometry as filled pill.
- Hover shifts surface to `#ebe8e4`.
- Side-by-side secondary CTA should never visually overpower the black primary.

### 5. Warm Accent Pill (available but rarely used)

- Fill **`#cacab0`**, black text, same geometry.
- Use only when a third restrained variation is necessary; not the dominant CTA style.

### 6. Editorial Text Link

- 13px, Inter 500, underline via bottom border, spaced arrow `↗`.
- Subtle hover expands arrow gap (26px → 38px).
- Used for soft story navigation.

### 7. Kicker / Chapter Label

- Tiny uppercase text: 10.5px, weight 500, letter spacing `.17em`, graphite.
- Examples: `01 / EL COMENÇAMENT`, `02 / UN NOU RITUAL`, `03 / VIURE BÉ, CADA DIA`.
- Chapters are **current mockup labels**, not an instruction to fix future section order.

### 8. Asymmetric Hero

- **Desktop:** 46% left text / 54% right visual, overall minimum approx. 595px.
- Text left, set 76px down inside the column, large four-line ultra-light headline.
- Last two headline lines in `#777169` rather than black.
- Small eyebrow above, short paragraph beneath, two quiet pill CTAs, small `Mediterrani · 06:42 h` metadata beneath with 41px line.
- Right visual: 24px rounded, about 610px tall, muted coastal photo if available or elegant sea SVG fallback.
- Overlay captions: small white text bottom-left and top-right. Image grading: low saturation and slightly softened contrast.
- **Mobile:** stacked text above visual; hero image approx. 430px high, 20px radius.

### 9. Keyword Marquee / Philosophy Line

- Not an animated ticker. It's a **static four-part horizontal strip** between fine stone borders.
- Keywords: `HIDRATACIÓ · CONSCIÈNCIA · NATURA · TEMPS`.
- 10px uppercase with `.21em` tracking; small soft-olive circular separators.
- Keep restrained; on mobile allow wrapping.

### 10. Personal Story Editorial Split

- Two-column grid: 43% visual / 57% text, approx. 76px gap.
- Left: tall rounded scene (aspect ratio `.80`) showing water/glass/domestic ritual; the current prototype supplies a geometric inline SVG **fallback** and a pale caption pill.
- Right: small chapter label, Light display statement, two paragraphs of body text and underline link.
- Vertical padding around **134–145px** on desktop, much less on mobile.
- The narrative currently mentions Helena's 2023 trip, a significant friendship, changes in health habits and considerable professional stress. Do not add medical outcomes or claims.

### 11. Oversized Editorial Quote Band

- Full-bleed warm taupe section `#f5f3f1`, approximately `110px 0 120px` padding.
- Huge three-line typography: `El que bevem. / El que fem. / Com vivim.`
- First and third lines ink; middle line smoke grey.
- Right: enormous nearly transparent circular outlines and a central pale `#cacab0` disc with 55% opacity.
- Decorative circles are CSS/graphic devices, not water-drop icons.

### 12. Water as Ritual / Two-Column Section

- 50/50 split with 75px gap.
- Left: quiet technical-but-human narrative, short three-row list with stone hairline divisions and `↗` on each row, dark pill CTA, 11px pale factual note.
- Right: tall abstract art panel with `#d5d5c4` background and a large soft radial sphere shifting through eggshell/taupe/`#cacab0`/`#d5d5c4`.
- White/ink contour rings evoke an editorial design object, **not** a salesy scientific molecule.
- Art frame radius 24px; approx. 610px minimum height.
- On mobile move the visual **above** the text.

### 13. Webinar Feature Panel

- A wide **taupe** `#f5f3f1` container with 24px radius, 57px internal padding.
- Top split: display headline left, short explanatory paragraph right.
- Large horizontal video placeholder: minimum **450px** height, radius **20px**. Use a calm soft-beige/grey-green abstract landscape or subtle photographic frame, not a loud YouTube graphic.
- Centre: white round play control **87px** diameter with almost invisible shadow.
- Upper-right `HELENA SAIGI / 001`; bottom-left small metadata; lower panel row with soft left caption and black filled action right.
- Playback is NOT connected. Placeholder interactions currently open a modal explaining this fact. When real video exists, replace with an accessible embedded player and captions.
- On mobile panel padding 25px, stage about 300px high.

### 14. Full-Width Natural Landscape + Life Manifesto

- A 450px-high, rounded 24px landscape visual (mountain/seaside art SVG fallback and optional unsplash image).
- Beneath: an asymmetric 56% / 44% editorial text arrangement, headline left, 14px paragraph and 18px Light quotation right.
- Three value cards along the bottom, each with **1px stone border**, 20px radius, approx. 170px desktop minimum height, no heavy shadow.
- Values are `Més natura.`, `Més presència.`, `Més temps per allò que importa.`
- On mobile this becomes one column; value cards become short vertical cards around 94px tall.

### 15. Business Option — Muted Full-Bleed Band

- Full-width background **`#d5d5c4`** (a key visual application of the requested accent).
- Two-column grid, 90px gap, desktop 120px top/bottom padding.
- Large editorial heading left. Human, factual explanatory paragraph and two pill buttons right.
- Business is one optional topic among others; no financial-freedom language, no earnings promises, no pushy marketing devices.

### 16. Booking Block + Visual Calendar Placeholder

- White-eggshell canvas; 46/54 split with 70px gap and ~145px vertical padding.
- Left: large Light heading, short invitation, dark-pill CTA.
- Right: **warm-taupe calendar card** radius 24px, fine stone border, min-height 415px, padding 32px.
- Calendar header: `HELENA / 30 MIN` and circular arrow detail in `#cacab0`.
- Calendar filler: **7-column grid**, 29px-high muted rounded cells, mixing semi-transparent `#cacab0`, stone and `#d5d5c4`.
- Centred note: the real agenda will go here; there are **no real available time slots** in the prototype.
- When the team chooses a scheduler, embed the real calendar here (Calendly, GoHighLevel or equivalent).

### 17. Footer

- Fine stone top border; generous top padding (53px).
- Left: repeated wordmark and very Light short manifesto: `Viure bé també és una decisió quotidiana.`
- Right: muted 12px note stating the mockup status and distributor context.
- Tiny final credits line separated by a hairline; include design-study provenance only in prototype, not in finished site by default.

### 18. Informational Modal — Mockup Only

- Dark translucent overlay `rgba(0,0,0,.48)`.
- Eggshell rounded dialog (24px), maximum width ~470px, padding 45px, soft shadow.
- Explains that the video or calendar is not active. Escape key, close button and outside click dismiss it.
- For production, replace the fake CTA actions with real embedded functionality; retain accessibility and focus handling.

## Do's and Don'ts

### Do

- Keep the precise muted base palette, with **#cacab0** and **#d5d5c4** as the only added interface accents.
- Reproduce the actual page's **Light display typography** and extremely spacious proportions.
- Keep contrast through black headings/filled CTAs, not loud colors.
- Use a warm, documentary Mediterranean photographic sensibility.
- Let captions, chapter labels, hairline dividers and graphic circles create editorial rhythm.
- Keep product technology as something explained with restraint and factual accuracy; water is a **narrative entry point** to a broader way of living.
- Use real owner photos in the eventual production site, ideally early-morning coastline, outdoor activity, mountain walks, quiet home rituals, water and natural textures.
- Make multilingual UI available and preserve the ability to switch CA / ES / EN.
- Keep the funnel slots unconnected until actual video and booking services are provided.
- Design all screens accessibly and responsively.

### Don't

- Do not use original bright `#0447ff` or `#ff4704` anywhere.
- Do not turn the interface into a turquoise/blue hydration template.
- Do not add flat corporate icon cards, heavy shadows, excessive buttons, urgency counters or hype copy.
- Do not replace the editorial hero with a product packshot.
- Do not imply health treatment, fertility improvement, detoxification or scientifically unsubstantiated effects of Kangen water.
- Do not claim guaranteed sales, income or lifestyle change from an independent distributor opportunity.
- Do not treat the mockup order as the **final** IA; the team will define structure jointly.
- Do not use stock photos of executives shaking hands, bright studio portraits, gym stock poses, medical labs or artificial water bubbles.
- Do not import a proprietary font file without authorization.

## Surfaces

| Level | Surface | Hex or Treatment | Use |
|---|---|---|---|
| 1 | Eggshell Canvas | `#fdfcfc` | Main scroll background |
| 2 | Quiet Taupe | `#f5f3f1` | Featured editorial blocks / webinar / calendar |
| 3 | Stone Edge | `#ebe8e4` | Dividers and borders |
| 4 | Natural Accent A | `#cacab0` | Radial highlights, circles, small UI details |
| 5 | Natural Accent B | `#d5d5c4` | Business section, visual art backing, subtle metadata strip |

## Elevation

- Most surfaces are **flat**.
- Whispers of depth only: hairline borders, 0.04-alpha small shadows, delicate radial shading on illustrations.
- Example from webinar play control: `0 8px 28px rgba(0,0,0,.04)`.
- Example from abstract water sphere: inset very subtle shadow, plus diffused low-alpha outer shadow.
- Avoid floating cards with high blur or heavy drop shadows.

## Imagery

**Dominant style:** quiet Mediterranean editorial. Natural imagery and illustration should feel like environmental observation, not product advertising.

### Actual prototype image treatments

| Area | Composition | Color / grading | Current rendering fallback |
|---|---|---|---|
| Hero | Calm Mediterranean coastline, large rounded frame on right | Saturation about 0.63, contrast about 0.88, subtle sepia | Built-in inline SVG with pale sky, muted green sea and geometric coastline |
| Story | Glass vessel on stone/light surface | Very soft daylight, warm beige/stone | Built-in abstract vector glass scene, light shafts and long shadows |
| Water | Large glowing orb with very thin rings | `#fdfcfc → #f5f3f1 → #cacab0 → #d5d5c4` | CSS radial gradient and circular outlines |
| Webinar | Wide calm mineral landscape with centre play button | Taupe, grey-sage, low contrast | CSS gradients / diagonal terrain-like overlay |
| Life | Wide layered landscape, quiet mountain silhouettes | Light olive, green-grey, muted stone | Built-in inline SVG layered mountain illustration |
| Calendar | Graphic placeholder 7-column grid | Taupe, stone, muted accent dots | CSS pattern, intentionally not a real calendar |

The HTML tries to load **two remote Unsplash editorial placeholder images**. It also includes SVG landscape fallbacks, which are visible when those images are unavailable. Never treat remote sample photographs as licensed production assets or as images of Helena.

### Photo acquisition / art direction for final site

Early morning at the sea; Helena walking with her dog; mountain paths; a lived-in kitchen; a reusable glass bottle; hands and water; tactile ceramics and linen; no conspicuous posing next to the machine; no hotel/spa staging. Real photographs should replace generic mockup imagery, while preserving the **same muted crop, balance, aspect ratios and large negative spaces**.

## Layout

### Desktop canvas

- Maximum central content width: **1280px**, within **54px lateral gutters**.
- Header: 76px tall below a 28px prototype banner.
- Hero: asymmetric 46/54 columns; right visual min-height ~610px and 24px radius; headline left.
- Keyword strip immediately below hero: fine edges and four distributed words.
- Alternation pattern: **eggshell → taupe statement → eggshell + artwork → taupe enclosure → eggshell + panorama → accent B wide band → eggshell + calendar → footer**.
- Full viewport is not divided into numerous small UI cards. Distinct large visual chapters drive attention.
- Text lengths are intentionally shorter than the whitespace around them.

### Responsive behavior

| Breakpoint | Changes from actual prototype |
|---|---|
| `>1000px` | Full desktop compositions |
| `≤1000px` | 32px horizontal padding; hero 51/49; smaller inter-column gaps and 50px hero heading |
| `≤720px` | 20px gutters; main nav links hidden; stacked hero, story, water, manifesto, business and booking; large images kept prominent; value cards stack; webinar stage shrinks; consistent 20–24px rounded surfaces |
| `prefers-reduced-motion` | Disable smooth scroll and animation durations |

### Prototype scroll map (not a locked information architecture)

The existing visual HTML contains, in order: 1) announcement strip, 2) header, 3) hero, 4) keyword strip, 5) personal story, 6) large statement band, 7) water/ritual panel, 8) webinar, 9) lifestyle/manifesto, 10) optional business band, 11) calendar booking block, 12) footer and provisional interaction modal. **The team can change this later.**

## Interactions, Localization & Accessibility

- Language switcher **CA / ES / EN** updates all copy with corresponding keys in the `translations` object from the prototype. The default is Catalan.
- Buttons and navigation to internal anchors perform real smooth-scroll navigation.
- Video play button / video CTA opens a **prototype explanation modal**, not a playing video.
- Booking CTA opens a **prototype explanation modal**, not a booking engine.
- Visible focus styles: `2px solid #44403b` outline with `4px` offset.
- The modal has dialog semantics, an accessible close button and Escape handling; a production implementation should also trap focus correctly and return focus on close.
- Images require meaningful alternate text; SVG purely decorative illustration must be marked `aria-hidden`.
- Use native semantic headings, link/button roles and correct language tags.

## Brand References — Visual Guidance Only

These references informed previous art-direction discussions; **do not copy proprietary artwork, branding, grids, or text**:

| Brand | What to learn | What to avoid |
|---|---|---|
| [Flamingo Estate](https://flamingoestate.com/) | Nature as a lived-in world; visual warmth, plant life and materials | Product-heavy ecommerce design |
| [Ffern](https://ffern.co/) | Quietness, space, seasonal visual storytelling | Excessive slowness harming usability |
| [Kinfolk](https://www.kinfolk.com/) | Quality-of-life editorial point of view; controlled composition | Becoming a magazine instead of a landing |
| [Aesop](https://www.aesop.com/) | Elevated everyday rituals, restraint and informed copy | Apothecary brown / clinical retail styling |
| [Wonder Valley](https://welcometowondervalley.com/) | Turning one commonplace element into a broader lifestyle | Over-emphasizing a product catalogue |

This **specific prototype** also borrows the formal interface vocabulary of ElevenLabs: ultra-light sans-serif, eggshell ground, pill buttons, generous white space and quiet square/rounded artwork. The result is a visual hybrid: **ElevenLabs restraint + Mediterranean editorial lifestyle imagery**.

## Agent Prompt Guide

### Master prompt for any AI website builder

> Recreate the visual design documented in this Markdown as faithfully as possible. The target is the existing Helena Saigi prototype, not a new generic wellness layout. Use eggshell `#fdfcfc`, warm taupe `#f5f3f1`, stone borders `#ebe8e4`, black ink `#000`, muted smoke `#777169`, and only the two natural UI accents `#cacab0` and `#d5d5c4`. Use Waldenburg Light or a visually similar licensed Light sans at weight 300 and tight tracking for large headlines; Inter for body/UI. Reproduce the editorial asymmetry, generous margins, oversized whisper-weight typography, pill CTAs, muted Mediterranean imagery and atmospheric SVG/gradient art. Preserve the prototype's current section styling and behaviors, but mark section order and text as provisional because the team will define the final information architecture. Support Catalan, Spanish and English. The webinar and calendar are placeholders until actual services are supplied. Do not invent product health outcomes, economic guarantees, fake testimonials or booking availability. Use the full content dictionary and CSS fidelity appendix below for precise implementation.

### Quick component prompts

1. **Hero:** Build a desktop 46/54 text/image split on eggshell, 54px outer gutters, a four-line 300-weight 69px Light display with last lines smoke grey, right-side 610px high muted sea photo/SVG, 24px radius, two understated pill CTAs and minimal sunrise-caption metadata.
2. **Story:** Create a tall (0.80 aspect) rounded glass/water editorial art scene on the left and a quiet oversized personal narrative on the right, with small uppercase chapter text and 1.85-line-height body copy.
3. **Statement:** Create a full-width warm-taupe band with a three-line very large Light headline and right-side layered rings with a `#cacab0` orb, no photography required.
4. **Water artwork:** Create a tall `#d5d5c4` visual panel with a centered radial `#fdfcfc → #f5f3f1 → #cacab0 → #d5d5c4` circle and exceptionally light contour rings.
5. **Webinar:** Place a calm abstract wide video thumbnail inside a 24px radius taupe section with 57px padding, a central white 87px circular play control, thin metadata, and a quiet black CTA.
6. **Life:** Use a 450px-high muted layered landscape followed by editorial manifesto and three clean 1px-bordered value cards.
7. **Business:** Make a very calm full-bleed `#d5d5c4` band for optional professional information; large left headline, text and two black/outline pills on right.
8. **Booking:** Compose a left editorial invitation and a right 24px rounded taupe mock calendar with seven-column pale geometric cells. Do not show invented dates.

### Implementation priorities

1. **First:** color values, display weight/letter spacing, responsive proportions, image cropping, whitespace.
2. **Second:** exact component geometry, font scale, pill CTAs, subtle hover states and separators.
3. **Third:** preserve draft copy and multilingual dictionary as editable source content.
4. **Fourth:** replace placeholders with real photos, actual webinar and scheduler only when those are provided.

## Quick Start

### CSS Custom Properties — match the prototype

```css
:root {
  --color-eggshell: #fdfcfc;
  --color-warm-taupe: #f5f3f1;
  --color-stone: #ebe8e4;
  --color-ink: #000000;
  --color-graphite: #44403b;
  --color-smoke: #777169;
  --color-ash: #a59f97;
  --color-violet-spark: #cacab0; /* legacy name; now natural accent A */
  --color-ember-orange: #d5d5c4; /* legacy name; now natural accent B */
  --font-display: 'Waldenburg', 'Inter Display', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --radius-cards: 20px;
  --radius-large: 24px;
  --radius-pill: 9999px;
}
body { margin: 0; background: var(--color-eggshell); color: #000; font-family: var(--font-body); font-size: 16px; line-height: 1.55; }
.container { max-width: 1280px; padding-inline: 54px; margin-inline: auto; }
.display { font-family: var(--font-display); font-weight: 300; letter-spacing: -.047em; line-height: 1.055; }
.btn { border-radius: 9999px; min-height: 46px; padding: 12px 21px; font-size: 13px; font-weight: 500; }
.btn.dark { background: #000; color: #fff; border: 1px solid #000; }
.btn.outline { background: #fdfcfc; color: #000; border: 1px solid #e5e5e5; }
@media (max-width: 1000px) { .container { padding-inline: 32px; } }
@media (max-width: 720px) { .container { padding-inline: 20px; } }
```

### Tailwind v4 — palette aliases only

```css
@theme {
  --color-eggshell: #fdfcfc;
  --color-warm-taupe: #f5f3f1;
  --color-stone: #ebe8e4;
  --color-ink: #000000;
  --color-graphite: #44403b;
  --color-smoke: #777169;
  --color-ash: #a59f97;
  --color-natural-a: #cacab0;
  --color-natural-b: #d5d5c4;
}
```

### Semantic page component map (existing prototype)

| Container / CSS classes | ID | Design role | Status |
|---|---|---|---|
| `.demo-bar` | — | muted prototype notice | concept only |
| `.header` | — | navigation, name, languages | working mockup |
| `.hero.container` | `#inici` (main) | text+coast, 46/54 | concept |
| `.marquee` | — | editorial values strip | concept |
| `.story.container` | `#historia` | 43/57 story split | concept |
| `.quote-band` | — | huge manifesto / rings | concept |
| `.water.container` | `#aigua` | 50/50 text and sphere | concept |
| `.webinar.container` | `#webinar` | taupe video enclosure | placeholder video |
| `.life.container` | `#vida` | panorama / philosophy / values | concept |
| `.business` | `#possibilitat` | full-width accent B band | concept |
| `.book.container` | `#parlem` | booking invitation + mock calendar | placeholder agenda |
| `.footer` | — | wordmark, manifesto, credits | concept |
| `.modal-overlay` | `#modal` | explains unconnected interactions | mockup only |

---

## Appendix A — Exact Copy Dictionary From the Prototype (CA / ES / EN)

These are **all 68 localization keys per language** from the existing HTML. The texts are draft content used to show hierarchy and line breaks, not final team-approved marketing copy. Preserve the keys and render in Catalan by default. Changing content should not change the visual design tokens.

```json
{
  "ca": {
    "nav_story": "La història",
    "nav_water": "L’aigua",
    "nav_life": "Una altra manera",
    "nav_talk": "Parlem?",
    "demo": "PROPOSTA VISUAL · NO ÉS LA WEB DEFINITIVA",
    "eyebrow": "AIGUA · NATURA · MANERA DE VIURE",
    "hero_a": "Potser no cal",
    "hero_b": "canviar-ho tot.",
    "hero_c": "Potser només cal",
    "hero_d": "començar per l’aigua.",
    "hero_desc": "Una història real sobre hidratació, rituals quotidians i la llibertat de construir una vida que s’assembli més a la que vols viure.",
    "hero_cta": "Descobreix la història",
    "hero_cta2": "Veure el webinar",
    "hero_img": "LA CALMA TAMBÉ ÉS UNA FORMA DE VIURE",
    "hero_side": "Mediterrani · 06:42 h",
    "marquee1": "HIDRATACIÓ",
    "marquee2": "CONSCIÈNCIA",
    "marquee3": "NATURA",
    "marquee4": "TEMPS",
    "chapter": "01 / EL COMENÇAMENT",
    "story_small": "DE VEGADES, EL PRINCIPI NO ÉS ALLÒ QUE ESPERAVES.",
    "story_title": "Un viatge el 2023. Una persona inesperada. I una nova manera de mirar les coses.",
    "story_p1": "Aquell any vaig marxar de viatge amb persones que no coneixia. Una d’elles es convertiria en una amiga molt important. I va ser ella qui em va parlar, per primera vegada, de Kangen.",
    "story_p2": "Jo estava en un moment personal de moltes preguntes, en què revisava els meus hàbits de salut i afrontava força estrès laboral. No buscava un negoci: buscava entendre millor què feia cada dia per cuidar-me.",
    "story_tag": "HELENA SAIGI · UNA HISTÒRIA PERSONAL",
    "pull1": "El que bevem.",
    "pull2": "El que fem.",
    "pull3": "Com vivim.",
    "pull_desc": "Hi ha decisions petites que, quan les mires amb atenció, et fan replantejar coses molt més grans.",
    "water_chapter": "02 / UN NOU RITUAL",
    "water_title": "L’aigua ja formava part de la meva vida. Només vaig començar a mirar-la diferent.",
    "water_p": "Havíem canviat les garrafes de plàstic per ampolles de vidre. Després vaig descobrir una tecnologia per tractar l’aigua de l’aixeta a casa. Em va interessar el funcionament, però també la comoditat: menys ampolles per carregar i emmagatzemar.",
    "water_label1": "Una elecció quotidiana",
    "water_label2": "Més senzillesa a casa",
    "water_label3": "Menys dependència d’aigua embotellada",
    "water_note": "La tecnologia Kangen combina filtració i electròlisi; les característiques i usos depenen del model i de l’aigua d’entrada.",
    "water_cta": "Conèixer l’experiència",
    "webinar_kicker": "UNA CONVERSA PER COMENÇAR",
    "webinar_title": "I si en parlem amb calma?",
    "webinar_text": "He preparat un espai per explicar què vaig descobrir, com funciona la tecnologia i per què aquest camí també em va fer pensar en el temps, la feina i la vida que vull construir.",
    "webinar_video": "ESPAI RESERVAT AL WEBINAR",
    "webinar_duration": "VÍDEO DE PRESENTACIÓ · PROPERAMENT",
    "webinar_cta": "Veure el webinar",
    "webinar_modal": "El webinar encara està pendent de gravar i integrar. Aquest botó mostra com funcionaria l’experiència final.",
    "life_kicker": "03 / VIURE BÉ, CADA DIA",
    "life_title": "La vida que m’agrada no comença quan acabo de treballar.",
    "life_text": "La muntanya. La platja al matí. Fer esport. Sortir amb la meva gossa. Tenir temps per les persones que m’importen. No són premis per després de la feina: també són la meva vida.",
    "life_sub": "No busco una vida perfecta. Busco una manera més conscient de viure-la.",
    "life_card_a": "Més natura.",
    "life_card_b": "Més presència.",
    "life_card_c": "Més temps per allò que importa.",
    "business_label": "UNA POSSIBILITAT QUE VA ARRIBAR DESPRÉS",
    "business_title": "Primer va ser l’aigua. Més endavant, la possibilitat de construir més opcions.",
    "business_text": "La meva professió està vinculada a les dades, els mercats i les vendes. Quan vaig entendre que Enagic treballa amb distribuïdors independents, vaig començar a explorar-ne la dimensió professional. No és una promesa de llibertat econòmica ni d’ingressos garantits: és una activitat comercial que requereix dedicació.",
    "business_a": "M’interessa l’aigua",
    "business_b": "Vull entendre el negoci",
    "book_label": "UNA CONVERSA, SENSE PRESSA",
    "book_title": "T’ha despertat curiositat?",
    "book_text": "Podem parlar de l’aigua, dels diferents equips o de com funciona el model de distribució independent. Sense compromís. Sense presses.",
    "book_button": "Reservar una conversa",
    "book_mock": "AQUÍ INTEGRAREM LA TEVA AGENDA",
    "book_mock2": "Tria de dia i hora · vista provisional",
    "book_modal": "Aquest espai es connectarà amb el teu calendari quan decidiu l’eina de reserves. Encara no es poden reservar cites des d’aquesta maqueta.",
    "footer": "Viure bé també és una decisió quotidiana.",
    "footer_small": "Maqueta de disseny provisional · Fotografies d’ambient de referència · Helena Saigi és distribuïdora independent d’Enagic.",
    "modal_close": "Tancar",
    "modal_label": "MAQUETA / FUNCIONALITAT PENDENT",
    "lang_name": "Català"
  },
  "es": {
    "nav_story": "La historia",
    "nav_water": "El agua",
    "nav_life": "Otra manera",
    "nav_talk": "¿Hablamos?",
    "demo": "PROPUESTA VISUAL · NO ES LA WEB DEFINITIVA",
    "eyebrow": "AGUA · NATURALEZA · FORMA DE VIVIR",
    "hero_a": "Quizá no haga falta",
    "hero_b": "cambiarlo todo.",
    "hero_c": "Quizá solo sea",
    "hero_d": "empezar por el agua.",
    "hero_desc": "Una historia real sobre hidratación, rituales cotidianos y la libertad de construir una vida más parecida a la que quieres vivir.",
    "hero_cta": "Descubre la historia",
    "hero_cta2": "Ver el webinar",
    "hero_img": "LA CALMA TAMBIÉN ES UNA FORMA DE VIVIR",
    "hero_side": "Mediterráneo · 06:42 h",
    "marquee1": "HIDRATACIÓN",
    "marquee2": "CONSCIENCIA",
    "marquee3": "NATURALEZA",
    "marquee4": "TIEMPO",
    "chapter": "01 / EL COMIENZO",
    "story_small": "A VECES, EL PRINCIPIO NO ES LO QUE ESPERABAS.",
    "story_title": "Un viaje en 2023. Una persona inesperada. Y una nueva forma de mirar las cosas.",
    "story_p1": "Aquel año me fui de viaje con personas que no conocía. Una de ellas se convertiría en una amiga muy importante. Fue ella quien me habló, por primera vez, de Kangen.",
    "story_p2": "Estaba en un momento personal lleno de preguntas, revisando mis hábitos de salud y afrontando mucho estrés laboral. No buscaba un negocio: quería comprender mejor cómo cuidarme cada día.",
    "story_tag": "HELENA SAIGI · UNA HISTORIA PERSONAL",
    "pull1": "Lo que bebemos.",
    "pull2": "Lo que hacemos.",
    "pull3": "Cómo vivimos.",
    "pull_desc": "Hay pequeñas decisiones que, si las miras con atención, te hacen replantearte cosas mucho mayores.",
    "water_chapter": "02 / UN NUEVO RITUAL",
    "water_title": "El agua ya formaba parte de mi vida. Solo empecé a mirarla de otra manera.",
    "water_p": "Habíamos cambiado las garrafas de plástico por botellas de vidrio. Después descubrí una tecnología para tratar el agua del grifo en casa. Me interesó cómo funcionaba y también la comodidad: menos botellas que cargar y almacenar.",
    "water_label1": "Una elección cotidiana",
    "water_label2": "Más sencillez en casa",
    "water_label3": "Menos dependencia del agua embotellada",
    "water_note": "La tecnología Kangen combina filtración y electrólisis; las características y usos dependen del modelo y del agua de entrada.",
    "water_cta": "Conocer la experiencia",
    "webinar_kicker": "UNA CONVERSACIÓN PARA EMPEZAR",
    "webinar_title": "¿Y si lo hablamos con calma?",
    "webinar_text": "He preparado un espacio para explicar qué descubrí, cómo funciona la tecnología y por qué este camino también me hizo reflexionar sobre el tiempo, el trabajo y la vida que quiero construir.",
    "webinar_video": "ESPACIO RESERVADO AL WEBINAR",
    "webinar_duration": "VÍDEO DE PRESENTACIÓN · PRÓXIMAMENTE",
    "webinar_cta": "Ver el webinar",
    "webinar_modal": "El webinar aún está pendiente de grabar e integrar. Este botón muestra cómo funcionaría la experiencia final.",
    "life_kicker": "03 / VIVIR BIEN, CADA DÍA",
    "life_title": "La vida que me gusta no empieza cuando termino de trabajar.",
    "life_text": "La montaña. La playa por la mañana. Hacer deporte. Salir con mi perra. Tener tiempo para las personas que me importan. No son premios para después del trabajo: también son mi vida.",
    "life_sub": "No busco una vida perfecta. Busco una manera más consciente de vivirla.",
    "life_card_a": "Más naturaleza.",
    "life_card_b": "Más presencia.",
    "life_card_c": "Más tiempo para lo importante.",
    "business_label": "UNA POSIBILIDAD QUE LLEGÓ DESPUÉS",
    "business_title": "Primero fue el agua. Más adelante, la posibilidad de construir más opciones.",
    "business_text": "Mi profesión está vinculada a los datos, los mercados y las ventas. Cuando entendí que Enagic trabaja con distribuidores independientes, empecé a explorar su dimensión profesional. No es una promesa de libertad económica ni de ingresos garantizados: es una actividad comercial que requiere dedicación.",
    "business_a": "Me interesa el agua",
    "business_b": "Quiero conocer el negocio",
    "book_label": "UNA CONVERSACIÓN, SIN PRISAS",
    "book_title": "¿Te ha despertado curiosidad?",
    "book_text": "Podemos hablar del agua, de los distintos equipos o de cómo funciona el modelo de distribución independiente. Sin compromiso. Sin prisas.",
    "book_button": "Reservar una conversación",
    "book_mock": "AQUÍ INTEGRAREMOS TU CALENDARIO",
    "book_mock2": "Elección de día y hora · vista provisional",
    "book_modal": "Este espacio se conectará con tu calendario cuando decidáis la herramienta de reservas. Aún no se pueden reservar citas desde esta maqueta.",
    "footer": "Vivir bien también es una decisión cotidiana.",
    "footer_small": "Maqueta de diseño provisional · Fotografías ambientales de referencia · Helena Saigi es distribuidora independiente de Enagic.",
    "modal_close": "Cerrar",
    "modal_label": "MAQUETA / FUNCIÓN PENDIENTE",
    "lang_name": "Español"
  },
  "en": {
    "nav_story": "The story",
    "nav_water": "Water",
    "nav_life": "Another way",
    "nav_talk": "Let’s talk",
    "demo": "VISUAL CONCEPT · NOT THE FINAL WEBSITE",
    "eyebrow": "WATER · NATURE · A WAY OF LIFE",
    "hero_a": "Maybe you don’t",
    "hero_b": "need to change it all.",
    "hero_c": "Maybe you just",
    "hero_d": "start with water.",
    "hero_desc": "A real story about hydration, everyday rituals, and the freedom to shape a life that feels more like the one you want to live.",
    "hero_cta": "Discover the story",
    "hero_cta2": "Watch the webinar",
    "hero_img": "CALM IS A WAY OF LIVING, TOO",
    "hero_side": "Mediterranean · 6:42 am",
    "marquee1": "HYDRATION",
    "marquee2": "AWARENESS",
    "marquee3": "NATURE",
    "marquee4": "TIME",
    "chapter": "01 / THE BEGINNING",
    "story_small": "SOMETIMES, THE BEGINNING IS UNEXPECTED.",
    "story_title": "A trip in 2023. An unexpected person. And a new way of looking at things.",
    "story_p1": "That year, I went on a trip with people I had never met. One of them would become a very important friend. She was the person who first told me about Kangen.",
    "story_p2": "I was asking a lot of personal questions, rethinking my health habits and dealing with considerable work stress. I wasn’t looking for a business: I wanted to better understand how I looked after myself every day.",
    "story_tag": "HELENA SAIGI · A PERSONAL STORY",
    "pull1": "What we drink.",
    "pull2": "What we do.",
    "pull3": "How we live.",
    "pull_desc": "Sometimes paying attention to small decisions makes you rethink much bigger things.",
    "water_chapter": "02 / A NEW RITUAL",
    "water_title": "Water was already part of my life. I simply began to see it differently.",
    "water_p": "We had switched from plastic water bottles to glass. Later, I discovered technology that could treat our tap water at home. I was interested in how it worked, but also its convenience: fewer bottles to carry and store.",
    "water_label1": "An everyday choice",
    "water_label2": "A simpler home routine",
    "water_label3": "Less reliance on bottled water",
    "water_note": "Kangen technology combines filtration and electrolysis; features and applications depend on the model and incoming water.",
    "water_cta": "Explore the experience",
    "webinar_kicker": "A CONVERSATION TO GET STARTED",
    "webinar_title": "What if we took a moment to talk?",
    "webinar_text": "I’ve created space to share what I discovered, how the technology works, and why this path also made me rethink time, work, and the life I want to build.",
    "webinar_video": "WEBINAR PLACEHOLDER",
    "webinar_duration": "PRESENTATION VIDEO · COMING SOON",
    "webinar_cta": "Watch the webinar",
    "webinar_modal": "The webinar still needs to be recorded and embedded. This button demonstrates the intended experience.",
    "life_kicker": "03 / LIVING WELL, EVERY DAY",
    "life_title": "The life I love doesn’t begin when work ends.",
    "life_text": "The mountains. An early morning at the beach. Exercise. Walks with my dog. Time with the people I love. These aren’t rewards for finishing work: they are my life too.",
    "life_sub": "I’m not looking for a perfect life. I’m looking for a more intentional way to live it.",
    "life_card_a": "More nature.",
    "life_card_b": "More presence.",
    "life_card_c": "More time for what matters.",
    "business_label": "AN OPPORTUNITY I DISCOVERED LATER",
    "business_title": "First came water. Then came the possibility of building more options.",
    "business_text": "My professional background is in data, market research and sales. When I learned that Enagic works through independent distributors, I began exploring that professional side. This is not a promise of financial freedom or guaranteed earnings: it is a sales-based activity that takes work.",
    "business_a": "I’m interested in water",
    "business_b": "Tell me about the business",
    "book_label": "A CONVERSATION, NO PRESSURE",
    "book_title": "Curious to learn more?",
    "book_text": "We can talk about water, different machines, or how independent distribution works. No commitment. No pressure.",
    "book_button": "Book a conversation",
    "book_mock": "YOUR CALENDAR WILL GO HERE",
    "book_mock2": "Choose day and time · visual placeholder",
    "book_modal": "This space will connect to your calendar once you choose a booking platform. No appointments can be booked through this mockup yet.",
    "footer": "Living well is an everyday choice, too.",
    "footer_small": "Provisional design mockup · Reference lifestyle imagery · Helena Saigi is an independent Enagic distributor.",
    "modal_close": "Close",
    "modal_label": "MOCKUP / NOT CONNECTED",
    "lang_name": "English"
  }
}
```

## Appendix B — Exact Prototype CSS (Fidelity Reference)

This is the **full CSS extracted from the delivered HTML mockup**. It is provided to minimize interpretation in AI builders able to ingest CSS. The original prototype uses inline SVG artwork and a localization script in addition to this stylesheet; rebuild those visual layers or substitute equivalent licensed images. **Do not assume this CSS alone is a complete webpage.**

```css
:root {
 /* Tokens exactament basats en el Markdown de referència */
 --color-eggshell:#fdfcfc; --color-warm-taupe:#f5f3f1; --color-stone:#ebe8e4;
 --color-ink:#000000; --color-graphite:#44403b; --color-smoke:#777169;
 --color-ash:#a59f97; --color-violet-spark:#cacab0; --color-ember-orange:#d5d5c4;
 --radius-cards:20px; --radius-large:24px; --radius-pill:9999px;
 --font-display:'Waldenburg','Inter Display','Inter',ui-sans-serif,system-ui,sans-serif;
 --font-body:'Inter',ui-sans-serif,system-ui,sans-serif;
 --body:16px;
}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--color-eggshell);color:var(--color-ink);font-family:var(--font-body);font-size:16px;font-weight:400;line-height:1.55;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}button{font:inherit;cursor:pointer}button:focus-visible,a:focus-visible{outline:2px solid #44403b;outline-offset:4px}img{max-width:100%;display:block}::selection{background:#cacab0;color:#000}
.container{max-width:1280px;padding-inline:54px;margin-inline:auto}.kicker{font-size:10.5px;letter-spacing:.17em;font-weight:500;line-height:1.7;color:var(--color-graphite);text-transform:uppercase}.muted{color:var(--color-smoke)}.display{font-family:var(--font-display);font-weight:300;letter-spacing:-.047em;line-height:1.055}.btn{display:inline-flex;align-items:center;justify-content:center;gap:22px;min-height:46px;border-radius:var(--radius-pill);font-size:13px;font-weight:500;padding:12px 21px;border:1px solid #e5e5e5;transition:background-color .25s ease,transform .25s ease,color .25s ease}.btn:hover{transform:translateY(-2px)}.btn.dark{color:#fff;background:#000;border-color:#000}.btn.dark:hover{background:#44403b}.btn.outline{color:#000;background:#fdfcfc}.btn.outline:hover{background:#ebe8e4}.btn.warm{background:#cacab0;color:#000;border-color:#cacab0}.arrow{display:inline-block;font-size:18px;font-weight:300;line-height:1}.text-link{border-bottom:1px solid #000;padding-bottom:6px;font-size:13px;font-weight:500;display:inline-flex;gap:26px;align-items:center;transition:gap .2s}.text-link:hover{gap:38px}
.demo-bar{height:28px;background:#d5d5c4;display:flex;justify-content:center;align-items:center;font-size:9px;letter-spacing:.14em;font-weight:500;color:#44403b}.header{height:76px;display:flex;align-items:center;background:#fdfcfc}.header-inner{width:100%;max-width:1280px;padding-inline:54px;margin:auto;display:flex;justify-content:space-between;align-items:center}.brand{display:block;font-size:22px;font-weight:500;letter-spacing:-.055em;line-height:1}.brand small{display:block;font-size:9px;letter-spacing:.2em;line-height:1;margin-top:7px;font-weight:400;color:#777169}.nav{display:flex;align-items:center;gap:35px;font-size:12px;color:#44403b}.nav a:hover{text-decoration:underline;text-underline-offset:5px}.nav-group{display:flex;align-items:center;gap:23px}.lang{display:flex;gap:6px;align-items:center;font-size:10px}.lang button{border:0;background:transparent;padding:5px;color:#777169;font-size:10px;font-weight:500}.lang button.active{color:#000;text-decoration:underline;text-underline-offset:4px}
.hero{padding:24px 0 90px}.hero-grid{display:grid;grid-template-columns:46% 54%;min-height:595px;gap:0}.hero-copy{position:relative;z-index:1;padding:76px 30px 35px 0;display:flex;flex-direction:column;align-items:flex-start}.hero h1{font-size:clamp(45px,4.35vw,69px);margin:31px -56px 27px 0;line-height:1.075}.hero h1 span{display:block}.hero h1 .soft{color:#777169}.hero p{max-width:410px;font-size:15px;color:#777169;line-height:1.75;margin:0 0 28px}.hero-actions{display:flex;gap:12px;flex-wrap:wrap}.hero-small{margin-top:auto;padding-top:45px;display:flex;gap:14px;align-items:center}.fine-line{height:1px;width:41px;background:#a59f97}.hero-visual{border-radius:24px;min-height:610px;position:relative;overflow:hidden;background:#d5d5c4}.photo{position:absolute;width:100%;height:100%;inset:0;object-fit:cover;transition:opacity .7s;filter:saturate(.65) contrast(.9)}.hero-visual .photo{object-position:center 58%;filter:saturate(.63) contrast(.88) sepia(.09)}.hero-visual:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(20,21,17,.07),transparent 50%),linear-gradient(0deg,rgba(5,12,12,.33),transparent 37%)}.hero-caption{position:absolute;z-index:2;left:35px;bottom:35px;color:#fff;font-size:11px;letter-spacing:.15em;font-weight:500}.photo-caption{position:absolute;z-index:2;top:27px;right:29px;color:rgba(255,255,255,.87);font-size:9px;letter-spacing:.13em}.sea-art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.marquee{border-top:1px solid #ebe8e4;border-bottom:1px solid #ebe8e4;padding:23px 0}.marquee-inner{display:flex;justify-content:space-between;gap:15px;flex-wrap:wrap;color:#777169;font-size:10px;letter-spacing:.21em;font-weight:500}.marquee i{height:5px;width:5px;background:#cacab0;border-radius:50%;align-self:center}
.story{padding:134px 0 145px}.story-grid{display:grid;grid-template-columns:43% 57%;gap:76px;align-items:center}.scene-photo{position:relative;overflow:hidden;border-radius:20px;background:#d5d5c4}.story-photo{aspect-ratio:.80;background:linear-gradient(125deg,#cacab0,#f5f3f1)}.story-image-caption{position:absolute;bottom:25px;left:25px;color:#44403b;background:rgba(253,252,252,.82);padding:10px 14px;font-size:10px;letter-spacing:.08em;border-radius:99px}.story-copy{padding-right:50px}.story-copy h2{font-size:clamp(35px,3.2vw,50px);margin:21px 0 29px}.story-copy p{font-size:14px;color:#777169;line-height:1.85;margin-bottom:17px;max-width:530px}.story-copy .text-link{margin-top:22px}.side-caption{position:absolute;top:20px;right:18px;font-size:10px;letter-spacing:.15em;color:#777169;writing-mode:vertical-rl}
.quote-band{background:#f5f3f1;position:relative;padding:110px 0 120px;overflow:hidden}.quote-band .rings{position:absolute;right:-140px;top:-155px;width:650px;height:650px;border-radius:50%;border:1px solid rgba(119,113,105,.2)}.quote-band .rings:before{content:"";position:absolute;inset:70px;border:1px solid rgba(119,113,105,.17);border-radius:50%}.quote-band .rings:after{content:"";position:absolute;inset:160px;background:#cacab0;border-radius:50%;opacity:.55}.quote-inner{position:relative;z-index:1}.quote-band h2{font-size:clamp(46px,5.4vw,83px);max-width:1090px;margin:32px 0;letter-spacing:-.055em}.quote-band h2 span{display:block}.quote-band h2 span:nth-child(2){color:#777169}.quote-band p{max-width:520px;font-size:14px;color:#777169;margin:0}
.water{padding:132px 0}.water-grid{display:grid;grid-template-columns:1fr 1fr;gap:75px;align-items:center}.water-copy h2{font-size:clamp(39px,3.65vw,56px);margin:27px 0 23px}.water-copy p{font-size:14px;line-height:1.85;max-width:475px;color:#777169}.water-list{margin:30px 0 34px;padding:0;list-style:none;max-width:475px}.water-list li{display:flex;justify-content:space-between;border-bottom:1px solid #ebe8e4;padding:13px 0;font-size:13px;color:#44403b}.water-list li:after{content:'↗';font-size:15px}.water-copy .note{font-size:11px;line-height:1.65;color:#a59f97;max-width:475px;margin-top:22px}.water-art{min-height:610px;background:#d5d5c4;border-radius:24px;overflow:hidden;position:relative;display:grid;place-items:center}.water-art .large-circle{width:71%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 34% 32%,#fdfcfc 0,#f5f3f1 13%,#cacab0 48%,#d5d5c4 79%);box-shadow:inset -17px -15px 55px rgba(105,107,83,.09),0 25px 80px rgba(105,107,83,.12);position:relative}.water-art .large-circle:before{content:"";position:absolute;inset:6%;border:1px solid rgba(255,255,255,.48);border-radius:50%}.water-art .large-circle:after{content:"";position:absolute;inset:20%;border:1px solid rgba(68,64,59,.13);border-radius:50%}.water-art .ring{position:absolute;width:102%;aspect-ratio:1;border:1px solid rgba(68,64,59,.12);border-radius:50%}.water-art .k{position:absolute;left:35px;top:35px;z-index:2}.water-art .a{position:absolute;bottom:32px;right:30px;color:#777169}
.webinar{padding:22px 0 144px}.webinar-wrap{background:#f5f3f1;border-radius:24px;padding:57px}.webinar-top{display:flex;justify-content:space-between;gap:60px;align-items:end;padding-bottom:37px}.webinar-top h2{font-size:clamp(38px,3.4vw,52px);margin:17px 0 0}.webinar-top p{font-size:14px;color:#777169;max-width:400px;line-height:1.8;margin-bottom:2px}.video-stage{min-height:450px;position:relative;overflow:hidden;border-radius:20px;background:linear-gradient(145deg,#d5d5c4,#cacab0)}.video-stage:before{content:"";position:absolute;inset:0;background-image:radial-gradient(ellipse at 65% 5%,rgba(253,252,252,.75),transparent 47%),linear-gradient(190deg,transparent 52%,rgba(70,75,62,.2) 53%,rgba(70,75,62,.08) 56%,transparent 57%),linear-gradient(180deg,transparent 52%,rgba(253,252,252,.4) 53%,rgba(116,127,109,.15) 100%)}.video-inner{position:absolute;inset:0;display:grid;place-items:center;text-align:center}.play-btn{width:87px;height:87px;border-radius:50%;background:#fdfcfc;display:grid;place-items:center;border:1px solid #ebe8e4;font-size:24px;box-shadow:0 8px 28px rgba(0,0,0,.04);transition:transform .2s}.play-btn:hover{transform:scale(1.05)}.video-meta{position:absolute;left:32px;bottom:24px;font-size:10px;letter-spacing:.13em;color:#44403b}.video-corner{position:absolute;top:24px;right:30px;font-size:11px;letter-spacing:.15em;color:#44403b}.webinar-cta{display:flex;justify-content:space-between;align-items:center;padding-top:28px;gap:20px}.webinar-cta p{font-size:12px;color:#777169;margin:0}
.life{padding-bottom:150px}.life-hero{height:450px;border-radius:24px;position:relative;overflow:hidden;background:linear-gradient(130deg,#d5d5c4,#ebe8e4 50%,#cacab0);}.life-hero img{object-position:center 53%;filter:saturate(.62) contrast(.92)}.life-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(20,25,20,.28),transparent 55%)}.life-hero span{position:absolute;left:35px;bottom:31px;color:white;font-size:11px;letter-spacing:.13em;z-index:2}.life-text{display:grid;grid-template-columns:56% 44%;gap:55px;padding:76px 8px 54px}.life-text h2{font-size:clamp(42px,4.3vw,68px);margin:15px 0 0;max-width:650px}.life-aside{padding-top:50px}.life-aside p{font-size:14px;color:#777169;line-height:1.85;max-width:380px}.life-aside .pull{margin-top:30px;font-size:18px;color:#44403b;font-family:var(--font-display);font-weight:300}.life-values{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.value{border:1px solid #ebe8e4;padding:30px;border-radius:20px;min-height:170px;display:flex;justify-content:space-between;flex-direction:column;background:#fdfcfc}.value strong{font-size:21px;font-family:var(--font-display);font-weight:300;letter-spacing:-.03em}.value span{font-size:10px;color:#a59f97;letter-spacing:.15em}
.business{padding:120px 0;background:#d5d5c4}.business-grid{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center}.business h2{font-size:clamp(42px,4vw,63px);margin:23px 0 0}.business p{font-size:14px;line-height:1.9;color:#44403b;max-width:490px}.business-actions{display:flex;gap:12px;margin-top:32px;flex-wrap:wrap}
.book{padding:145px 0}.book-grid{display:grid;grid-template-columns:46% 54%;gap:70px;align-items:center}.book h2{font-size:clamp(42px,4.5vw,67px);margin:24px 0}.book p{font-size:14px;line-height:1.85;max-width:375px;color:#777169;margin-bottom:26px}.book-calendar{border:1px solid #ebe8e4;border-radius:24px;min-height:415px;padding:32px;background:#f5f3f1}.calendar-head{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ebe8e4;padding-bottom:18px}.cal-id{font-size:12px;font-weight:500}.cal-circle{height:34px;width:34px;background:#cacab0;border-radius:50%;display:grid;place-items:center;font-size:13px}.calendar-filler{padding-top:35px;display:grid;grid-template-columns:repeat(7,1fr);gap:13px}.calendar-filler span{height:29px;background:rgba(202,202,176,.52);border-radius:6px}.calendar-filler span:nth-child(3n){background:#ebe8e4}.calendar-filler span:nth-child(7n){background:#d5d5c4}.calendar-filler span:nth-child(1),.calendar-filler span:nth-child(2),.calendar-filler span:nth-child(8){background:transparent}.calendar-footer{text-align:center;margin-top:34px}.calendar-footer h3{font-weight:500;font-size:12px;letter-spacing:.07em}.calendar-footer p{font-size:11px;margin:auto;color:#777169}.footer{border-top:1px solid #ebe8e4;padding:53px 0 30px}.footer-flex{display:flex;justify-content:space-between;gap:40px;align-items:start}.footer-head{font-size:30px;font-weight:300;letter-spacing:-.04em;margin:0 0 9px}.footer-right{max-width:400px;text-align:right;font-size:12px;line-height:1.8;color:#777169}.credits{border-top:1px solid #ebe8e4;margin-top:50px;padding-top:16px;color:#a59f97;font-size:10px;display:flex;justify-content:space-between;gap:30px;flex-wrap:wrap}.credits a{text-decoration:underline}.modal-overlay{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.48);z-index:100;padding:25px}.modal-overlay.on{display:flex}.modal{border-radius:24px;background:#fdfcfc;padding:45px;max-width:470px;width:100%;box-shadow:0 12px 50px rgba(0,0,0,.1)}.modal p{font-size:15px;line-height:1.8;color:#777169}.modal .btn{margin-top:12px}.mobile-toggle{display:none}
@media(max-width:1000px){.container,.header-inner{padding-inline:32px}.nav{gap:14px}.hero-grid{grid-template-columns:51% 49%}.hero-copy{padding-top:46px}.hero h1{font-size:50px;margin-right:-40px}.story-grid{gap:35px}.story-copy{padding-right:0}.water-grid{gap:40px}.water-art{min-height:540px}.business-grid{gap:45px}.book-grid{gap:30px}.webinar-wrap{padding:40px}}
@media(max-width:720px){.demo-bar{height:26px;font-size:7.4px;letter-spacing:.09em}.container,.header-inner{padding-inline:20px}.header{height:73px}.brand{font-size:19px}.nav{gap:11px}.nav .nav-link{display:none}.nav .btn{padding:9px 13px;min-height:38px;font-size:11px}.nav-group{gap:11px}.lang button{font-size:9px}.hero{padding:12px 0 60px}.hero-grid{display:flex;flex-direction:column;min-height:unset}.hero-copy{padding:38px 0 40px}.hero h1{font-size:clamp(43px,9.5vw,64px);margin:23px 0 21px}.hero p{font-size:14px;line-height:1.7;margin-bottom:25px}.hero-visual{min-height:430px;border-radius:20px}.hero-small{padding-top:26px}.hero-caption{left:18px;bottom:21px;max-width:180px;font-size:9px}.photo-caption{right:14px;top:17px;font-size:8px}.marquee{padding:17px 0}.marquee-inner{font-size:8px;letter-spacing:.12em;gap:9px}.story{padding:75px 0 85px}.story-grid{grid-template-columns:1fr;gap:40px}.story-photo{aspect-ratio:1.12}.story-copy h2{font-size:40px}.quote-band{padding:80px 0}.quote-band h2{font-size:48px}.quote-band .rings{right:-420px}.water{padding:80px 0}.water-grid{grid-template-columns:1fr;gap:37px}.water-copy h2{font-size:43px}.water-art{min-height:440px;order:-1}.webinar{padding:0 0 85px}.webinar-wrap{padding:25px;border-radius:20px}.webinar-top{display:block}.webinar-top h2{font-size:42px}.webinar-top p{padding-top:10px}.video-stage{min-height:300px}.video-meta{font-size:8px;left:16px;bottom:14px}.video-corner{top:14px;right:15px}.webinar-cta{flex-wrap:wrap}.life{padding-bottom:86px}.life-hero{height:360px}.life-text{grid-template-columns:1fr;gap:0;padding:50px 0 34px}.life-text h2{font-size:47px}.life-aside{padding-top:13px}.life-values{grid-template-columns:1fr;gap:8px}.value{min-height:94px;padding:20px}.business{padding:78px 0}.business-grid{grid-template-columns:1fr;gap:26px}.business h2{font-size:46px}.book{padding:85px 0}.book-grid{grid-template-columns:1fr;gap:40px}.book h2{font-size:51px}.book-calendar{min-height:390px}.footer-flex{display:block}.footer-right{text-align:left;margin-top:20px}.credits{margin-top:30px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{transition-duration:0s!important;animation-duration:0s!important}}
```

## Acceptance Checklist for the Generated Page

- [ ] Main canvas is `#fdfcfc`; taupe blocks are `#f5f3f1`; dividers are `#ebe8e4`.
- [ ] Both requested colors appear: `#cacab0` and `#d5d5c4`; the removed violet/orange values do not.
- [ ] Display type is visibly light (`300`), airy, tightly spaced and not a chunky SaaS headline.
- [ ] Desktop hero is genuinely asymmetric, not a stock centred hero.
- [ ] Coastline/landscape visuals are muted, editorial and atmospheric, with graceful fallbacks.
- [ ] Video section is an understated taupe enclosure with a large play control.
- [ ] Optional business band uses `#d5d5c4`, not a contrasting promotional color.
- [ ] Booking placeholder is clearly a placeholder, not a fabricated live calendar.
- [ ] Multilingual UI contains Catalan, Spanish and English text, with Catalan default.
- [ ] Mobile stacks content cleanly and maintains generous negative space.
- [ ] The webpage looks like a Mediterranean personal editorial lifestyle brand, not a product push.
- [ ] The team can later rearrange or rewrite draft sections while retaining the same design system.
