# Panel público de webs del equipo

Versión de solo lectura del panel del equipo (el editable está en Claude:
https://claude.ai/artifact/MUtZJCy2XWeD9Z56R7dYRP), para quien no tiene cuenta de Claude.

- `index.html`: la página.
- `datos.json`: las fichas (fase, enlaces y siguiente paso de cada persona). Para actualizar la web pública,
  se cambia este archivo y se hace push.

Publicación: proyecto de Vercel aparte con **Root Directory `panel`**, sin framework ni comando de build.
No toca la web de Alejandro (proyecto `kangen`).
