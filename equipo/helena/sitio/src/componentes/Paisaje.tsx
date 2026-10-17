// Paisaje de montaña por capas para la sección "Viure bé". Es un sustituto decorativo:
// cuando haya una foto propia de montaña, cámbialo por <img className="photo" ...>.
// Los verdes son pigmentos de ilustración del documento de diseño, no colores de interfaz.
export function Paisaje() {
  return (
    <svg viewBox="0 0 1200 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ebe8e4" />
          <stop offset="0.6" stopColor="#f5f3f1" />
          <stop offset="1" stopColor="#d5d5c4" />
        </linearGradient>
      </defs>
      <rect width="1200" height="450" fill="url(#cielo)" />
      <circle cx="860" cy="130" r="54" fill="#fdfcfc" opacity="0.8" />
      <path d="M0 250 L140 190 L260 230 L400 150 L540 220 L660 170 L820 230 L960 160 L1100 210 L1200 180 V450 H0Z" fill="#cacab0" opacity="0.7" />
      <path d="M0 300 L120 250 L250 290 L380 220 L520 290 L700 230 L860 300 L1000 240 L1200 290 V450 H0Z" fill="#6e8179" opacity="0.45" />
      <path d="M0 350 L160 300 L320 345 L480 290 L640 350 L820 305 L980 360 L1200 320 V450 H0Z" fill="#68746a" opacity="0.6" />
      <path d="M0 400 L200 365 L420 405 L640 370 L880 410 L1080 380 L1200 400 V450 H0Z" fill="#5c716b" opacity="0.75" />
    </svg>
  );
}
