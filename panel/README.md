# Panel público de webs del equipo

Versión de solo lectura del panel del equipo (el editable está en Claude:
https://claude.ai/artifact/MUtZJCy2XWeD9Z56R7dYRP), para quien no tiene cuenta de Claude.

- `index.html`: la página.
- `datos.json`: las fichas (fase, enlaces y siguiente paso de cada persona; la página no muestra el enlace al código). Para actualizar la web pública,
  se cambia este archivo y se hace push.

Publicación: proyecto de Vercel aparte con **Root Directory `panel`**, sin framework ni comando de build.
No toca la web de Alejandro (proyecto `kangen`).

Diferencia con el panel de Claude: en la página pública el «Borrador» de Helena apunta a su carpeta de Drive
«08 Web para retocar» (archivo para retocar con ChatGPT), porque el artifact de Claude no lo puede abrir quien no tiene cuenta.
