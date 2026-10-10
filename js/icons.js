// Рисованные иконки планов: линия «чернилами», 32×32.
// class="b" — заливка цветом бумаги (чтобы передний предмет перекрывал задний),
// class="f" — заливка чернилами (мелкие точки, акценты).

const r = (n) => Math.round(n * 100) / 100;

// лучи / спицы вокруг центра
function rays(cx, cy, r1, r2, n, start = 0) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = start + (i * 2 * Math.PI) / n;
    d += `M${r(cx + Math.cos(a) * r1)} ${r(cy + Math.sin(a) * r1)}L${r(cx + Math.cos(a) * r2)} ${r(cy + Math.sin(a) * r2)}`;
  }
  return `<path d="${d}"/>`;
}
function dotsOnCircle(cx, cy, rad, n, size, start = 0) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = start + (i * 2 * Math.PI) / n;
    s += `<circle class="b" cx="${r(cx + Math.cos(a) * rad)}" cy="${r(cy + Math.sin(a) * rad)}" r="${size}"/>`;
  }
  return s;
}
// верёвочный мостик: перила и настил провисают, между ними подвесы и доски
function ropeBridge() {
  const q = (y0, sag, t) => y0 + 4 * sag * t * (1 - t);
  let hang = "", planks = "";
  for (let i = 1; i < 8; i++) {
    const t = i / 8, x = 4 + 24 * t;
    hang += `M${r(x)} ${r(q(10, 4, t))}V${r(q(17, 4, t))}`;
    planks += `M${r(x - 1.2)} ${r(q(17, 4, t) + 0.2)}l2.4 0`;
  }
  return `<path d="M4 6V29M28 6V29M2 29h4M26 29h4"/><path d="M4 10Q16 18 28 10M4 17Q16 25 28 17"/><path d="${hang}" stroke-width="1"/><path d="${planks}" stroke-width="2.2"/>`;
}

const I = {
  cards: {
    name: "Карты",
    svg: `<rect class="b" x="5" y="6" width="13" height="19" rx="1.6" transform="rotate(-13 11.5 15.5)"/>
      <path d="M8 10.5l2 0M8.6 20.5l.8-3" transform="rotate(-13 11.5 15.5)"/>
      <rect class="b" x="13.5" y="6.5" width="13" height="19" rx="1.6" transform="rotate(9 20 16)"/>
      <g transform="rotate(9 20 16)"><path d="M15.5 16q4.5-4.6 9 0q-4.5 4.6-9 0z"/><circle class="f" cx="20" cy="16" r="1.5"/><path d="M20 9.5v1.6M20 20.9v1.6"/></g>`,
  },
  teapot: {
    name: "Чайник",
    svg: `<path d="M24 8.5q-1.2-1.6 0-3.2M27 9.5q-1.2-1.6 0-3.2"/>
      <path class="b" d="M7 15h13v3.5a6.5 6.5 0 0 1-6.5 6.5a6.5 6.5 0 0 1-6.5-6.5z"/>
      <path d="M10 15q3.5-4.5 7 0"/><circle class="f" cx="13.5" cy="9.7" r="1.1"/>
      <path d="M20 17q4 .5 5.5-4.5M7 16.3q-3.8.3-3.5 3.6q.3 2.4 3.6 2.6M5 28h17"/>`,
  },
  cheers: {
    name: "Бокалы",
    svg: `<g transform="rotate(-14 10 18)"><path class="b" d="M5 10l1.7 16h6.6L15 10z"/><path d="M5.6 15.5h8.8"/></g>
      <g transform="rotate(14 22 18)"><path class="b" d="M17 10l1.7 16h6.6L27 10z"/><path d="M17.6 15.5h8.8"/></g>
      <path d="M16 7.5V3.5M12.6 8.2l-1.7-2.8M19.4 8.2l1.7-2.8"/>
      <circle class="f" cx="9.8" cy="19.4" r=".7"/><circle class="f" cx="22.4" cy="20.5" r=".7"/>`,
  },
  cigarette: {
    name: "Сигарета",
    svg: `<path d="M24.5 16.5c-2.4-2 2.2-3.6 0-6s2.2-3.8 0-6.5M27.5 15.5c-1.6-1.4 1.6-2.4 0-4.2"/>
      <rect class="b" x="3" y="19" width="21" height="4.5" rx=".8"/>
      <path d="M9.5 19v4.5"/><path class="f" d="M24 19h2.3q.9 0 .9 1v2.5q0 1-.9 1H24z"/>
      <path d="M4.5 27.5h20" stroke-dasharray="1.5 2.5"/>`,
  },
  torii: {
    name: "Тории",
    svg: `<path d="M3 7.5Q16 4 29 7.5"/><path d="M4.5 10h23M7 14h18M16 10v4"/>
      <path d="M9.5 10v16.5M22.5 10v16.5" stroke-width="2.2"/>
      <path d="M6.5 27h6M19.5 27h6M2 29.5h28" stroke-width="1.2"/>`,
  },
  gondola: {
    name: "Гондола",
    svg: `<path class="b" d="M2.5 15q1.5 7 10 7.5h9q6.5-.5 8-8.5l-1.6.6Q26 20 21 20.3H12Q5.5 20 2.5 15z"/>
      <path d="M2.5 15q-1-2.4.8-3.6M30 14l.2-2.3-1.8-.5"/>
      <circle cx="21.5" cy="5" r="1.6"/><path d="M21.5 6.6v6.4M21.5 13l-1.5 7M21.5 13l1.4 7M21.5 9l-3 2.2"/>
      <path d="M17 7.5L26 29" stroke-width="1.3"/>
      <path d="M2 26.5q2-1.3 4 0t4 0t4 0M15.5 26.5q2-1.3 4 0" stroke-width="1.2"/>`,
  },
  picnic: {
    name: "Пикник на закате",
    svg: `<path d="M7.5 18.5a8.5 8.5 0 0 1 17 0M2.5 18.5h27M16 6V3M8 10.5L6 8.5M24 10.5L26 8.5M4 14.5H2M28 14.5h2"/>
      <path class="b" d="M8.5 20.5h15l-1.2 7.5H9.7z"/><path d="M11.5 20.5q4.5-6 9 0"/>
      <path d="M9.2 23.3h13.6M9.6 25.8h12.8" stroke-width="1"/>`,
  },
  masks: {
    name: "Театральные маски",
    svg: `<path class="b" d="M3.5 5q7-2.3 13.5 0q.3 9.5-6.7 12Q3.2 14.5 3.5 5z"/>
      <path d="M6.3 9.4q1.6-1.4 3.2 0M11.1 9.4q1.6-1.4 3.2 0M7.3 12.6q3 3 6 0"/>
      <path class="b" d="M15 13q7-2.3 13.5 0q.3 9.5-6.7 12q-7.1-2.5-6.8-12z"/>
      <path d="M17.8 17.2q1.6 1.4 3.2 0M22.6 17.2q1.6 1.4 3.2 0M18.8 22.3q3-3 6 0M3.5 5q-1.7 3-1.6 6.5"/>`,
  },
  kart: {
    name: "Картинг",
    svg: `<path d="M2 12.5h4M1 15.5h3.5M3 18.5h2"/>
      <circle cx="15.5" cy="10" r="2.8" class="b"/><path d="M14 10h3.5"/>
      <path d="M15 13l-1 5.5M15.3 14.6l4.2 1.4M20.5 13.5l.6 4"/>
      <path class="b" d="M6.5 22.5v-4.5h4l1.5-1.5h3.5l2 1.5h9.5l1.5 4.5z"/>
      <circle class="b" cx="9.5" cy="23.5" r="3.4"/><circle class="b" cx="23.5" cy="23.5" r="3.4"/>
      <circle class="f" cx="9.5" cy="23.5" r="1"/><circle class="f" cx="23.5" cy="23.5" r="1"/>`,
  },
  winterVideo: {
    name: "Зимнее видео",
    svg: `<rect class="b" x="9" y="3.5" width="13.5" height="25" rx="2.5"/><path d="M14 6.3h3.5M14.5 25.8h2.5"/>
      <path d="M13.8 12.3l6 3.7-6 3.7z"/>
      <path d="M26.5 4v7M23.5 5.75l6 3.5M23.5 9.25l6-3.5M4.5 18v6M1.9 19.5l5.2 3M1.9 22.5l5.2-3" stroke-width="1.2"/>`,
  },
  skate: {
    name: "Конёк",
    svg: `<path class="b" d="M8 3.5h7.5v9q0 2.2 2.2 3.2l6 2.6q2.3 1 2.3 3.4V23H8z"/>
      <path d="M10.5 7h3M10.5 10h3M10.5 13h4"/>
      <path d="M4.5 27h20.5q3 0 3-3M11 23v4M22 23v4"/>`,
  },
  snowman: {
    name: "Снеговик",
    svg: `<path d="M11 15.5l-5.5-3.5M6.5 12.6l-1-2.4M21 15.5l5.5-3.5M25.5 12.6l1.6-2"/>
      <circle class="b" cx="16" cy="24.2" r="5.6"/><circle class="b" cx="16" cy="15.4" r="4.2"/><circle class="b" cx="16" cy="8.2" r="3.6"/>
      <path class="b" d="M12 5.4h8M13.4 5.4V1.8h5.2v3.6"/>
      <circle class="f" cx="14.6" cy="7.6" r=".55"/><circle class="f" cx="17.4" cy="7.6" r=".55"/>
      <path d="M16 9.2l2.8.7-2.8.6" stroke-width="1"/><circle class="f" cx="16" cy="14.2" r=".6"/><circle class="f" cx="16" cy="16.8" r=".6"/>`,
  },
  handCast: {
    name: "Слепок рук",
    svg: `<path class="b" d="M11.5 26V21.5L6.6 16.4Q5.5 14.6 7.6 14l3.9 3.4V7.2q0-1.6 1.5-1.6t1.5 1.6V15V5.1q0-1.6 1.5-1.6t1.5 1.6V15V6.1q0-1.6 1.5-1.6t1.5 1.6v9.4V9q0-1.6 1.5-1.6T23.5 9v11q0 3.6-2.5 6z"/>
      <path class="b" d="M6 26h20v3H6z"/>`,
  },
  ostrich: {
    name: "Страус",
    svg: `<path class="b" d="M5.5 19.5q2.5-7 10.5-6.4q6 .4 8.5 4.9q-3.5 4.6-10 4.6q-6.2 0-9-3.1z"/>
      <path d="M5.5 19.5q-3.2-2.8-2-6.6M7.5 16.6q-3-2.2-1.2-5.6M11 14q-1.5-2.5 0-4.5"/>
      <path d="M21.5 14.5q2.6-5.5.6-9.4q-.8-1.8 1-2.6"/><circle class="b" cx="23.8" cy="3.8" r="1.9"/>
      <path d="M25.6 3.6l3 1.2-3 .7"/><circle class="f" cx="23.7" cy="3.5" r=".5"/>
      <path d="M13 22.5l-.8 6.5h-2M17.5 22.5l1.2 6.5h2.3"/>`,
  },
  dice: {
    name: "Кости",
    svg: `<g transform="rotate(-14 10 18)"><rect class="b" x="4" y="12" width="12" height="12" rx="2.2"/>
      <circle class="f" cx="7.3" cy="15.3" r="1"/><circle class="f" cx="10" cy="18" r="1"/><circle class="f" cx="12.7" cy="20.7" r="1"/></g>
      <g transform="rotate(16 21 14)"><rect class="b" x="15" y="8" width="12" height="12" rx="2.2"/>
      <circle class="f" cx="18.3" cy="11.3" r="1"/><circle class="f" cx="23.7" cy="11.3" r="1"/><circle class="f" cx="18.3" cy="16.7" r="1"/><circle class="f" cx="23.7" cy="16.7" r="1"/><circle class="f" cx="21" cy="14" r="1"/></g>
      <path d="M22 3.5l.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2z" stroke-width="1"/>`,
  },
  pistol: {
    name: "Пистолет",
    svg: `<path class="b" d="M4 9.5h20.5v5.5H15l-1.3 2.2h-2.5l-1-2.2H4z"/><path d="M6 9.5V8M21 12h3.5"/>
      <path class="b" d="M8.5 15l-3 10.5h5.2l2.4-8.3"/><path d="M13.7 17.2q.8 3.3 4.3 1.3"/>
      <path d="M26.5 10.5l1.5-.4M26.6 13l2.3.3M26.3 15.4l1.8 1" stroke-width="1.2"/>`,
  },
  steeringWheel: {
    name: "Руль",
    svg: `<circle cx="16" cy="16" r="11.5"/><circle cx="16" cy="16" r="9" stroke-width="1"/><circle class="b" cx="16" cy="16" r="3.4"/>
      <path d="M4.8 15h7.8M19.4 15h7.8M16 19.4v7.6" stroke-width="2"/>
      <path d="M1.5 9.5l2 .8M1 13.5h2M28.5 9.5l2-.8M29 13.5h2" stroke-width="1.1"/>`,
  },
  carabiner: {
    name: "Скалодром",
    svg: `<path class="b" d="M5 29l1.5-24h19L27 29z"/>
      <path d="M16.5 1.5V11" stroke-dasharray="1.3 1.4" stroke-width="1"/>
      <circle cx="16.5" cy="12.5" r="1.6"/><path d="M16.8 14.1l.7 5.4M16.9 15.3l-3.6-3.2M17.1 15.2l4-3.4M17.5 19.5l-3 2.2.4 3M17.5 19.5l3.5 1.6 1 3"/>
      <path class="f" d="M12.5 11.6q.8-.9 1.5 0q.3 1-.7 1.1q-1 0-.8-1.1zM21 11.4q.9-.8 1.5.1q.2 1-.8 1q-.9 0-.7-1.1zM14 25.3q.9-.8 1.5.2q.1.9-.8.9t-.7-1.1zM21.4 24.6q.9-.7 1.5.2q0 1-.9.9q-.9-.1-.6-1.1zM9 18q.9-.8 1.5.1q.2 1-.8 1q-.9 0-.7-1.1zM23.5 17q.9-.8 1.5.1q.2 1-.8 1q-.9 0-.7-1.1zM10.5 7q.9-.8 1.5.1q.2 1-.8 1q-.9 0-.7-1.1zM20.5 6.5q.9-.8 1.5.1q.2 1-.8 1q-.9 0-.7-1.1z"/>`,
  },
  parachute: {
    name: "Парашют",
    svg: `<path class="b" d="M3.5 13Q4 2.5 16 2.5T28.5 13q-1.6-1.8-3.1 0q-1.6-1.8-3.1 0q-1.6-1.8-3.1 0q-1.6-1.8-3.2 0q-1.6-1.8-3.1 0q-1.6-1.8-3.1 0q-1.6-1.8-3.1 0q-1.5-1.8-3.2 0z"/>
      <path d="M16 2.5Q11 6 10.3 13M16 2.5q5 3.5 5.6 10.5"/>
      <path d="M3.5 13l11 9.5M10.3 13l4.7 9M21.7 13L17 22M28.5 13l-11 9.5" stroke-width="1"/>
      <circle cx="16" cy="20.5" r="1.6"/><path d="M16 22.1v4.4M16 26.5l-2 3M16 26.5l2 3M13.4 23.2l2.6 1 2.6-1"/>`,
  },
  paraglider: {
    name: "Параплан",
    svg: `<path class="b" d="M2.5 10Q16 .5 29.5 10Q16 4.8 2.5 10z"/><path d="M9 6.2l.6 2.6M16 4.6v1.8M23 6.2l-.6 2.6" stroke-width="1"/>
      <path d="M2.5 10L15.5 22.5M9.6 8.8l6.4 13.7M22.4 8.8L18 22.5M29.5 10L18.5 22.5" stroke-width=".9"/>
      <circle cx="17" cy="21" r="1.4"/><path class="b" d="M14.8 22.6h4.6l-.8 3.2h-3z"/>
      <path d="M20.5 29.5q1-2.4 3.3-1.6q1-1.8 3-.8q2.2-.4 2.7 2.4z" stroke-width="1.1"/>`,
  },
  horse: {
    name: "Лошадь",
    svg: `<path class="b" d="M10 29q-1.5-9.5 3-14.6l-1.3-6.2 3.2 2.6q3.3-2.8 7.3-.6l6.3 6.4q1.4 1.6 0 3l-1 1q-1.6 1.1-3.1 0l-3.2-2.1q-2.2 4.3-1.2 10.5z"/>
      <path d="M13.2 8.6q-4.6 4.2-4.3 10.5q-1 4.6-.4 9.9M11.5 11q-2 1-3 3"/>
      <circle class="f" cx="19.5" cy="12" r=".75"/><circle class="f" cx="25.6" cy="16.6" r=".6"/>`,
  },
  ferris: {
    name: "Колесо обозрения",
    svg: `<path d="M16 13L9.5 29M16 13l6.5 16M7 29h18"/>
      <circle cx="16" cy="13" r="9.5"/>${rays(16, 13, 1.5, 9.5, 8)}<circle class="f" cx="16" cy="13" r="1.5"/>
      ${dotsOnCircle(16, 13, 9.5, 8, 1.7, Math.PI / 8)}`,
  },
  surf: {
    name: "Волна и доска",
    svg: `<path d="M2 23Q5 9 15.5 9.5q6.5.3 7 6q.2 3-2.7 3.3q-2.7.2-2.7-2.6q0-2 2.3-2.1"/>
      <path d="M2 23q3-6 8.5-9" stroke-width="1"/>
      <path d="M2 27.5q2.5-1.6 5 0t5 0t5 0t5 0t5 0t5 0"/>
      <path class="b" d="M17 24.5q6-8.5 12.5-10q-2.2 7-12.5 10z"/><path d="M19.5 22.4q4-4.3 8.4-6.3" stroke-width="1"/>`,
  },
  mountains: {
    name: "Горы",
    svg: `<path class="b" d="M2 27L11 12.5l4.5 6.5L21 9l9 18z"/>
      <path d="M18.6 13.3l1.2 1 1.2-1.2 1.3 1.2 1-1.2"/><path d="M21 9V3.5l4.2 1.6L21 6.7"/>
      <path d="M9 27q3-3.5 7-3.2t6.5-3.5" stroke-dasharray="1.6 1.8" stroke-width="1.1"/>`,
  },
  tent: {
    name: "Палатка в лесу",
    svg: `<path d="M2 27.5h28"/>
      <path d="M6 27.5v-2.8M6 24.7H2.8l3.2-5H3.8L6 15.3l2.2 4.4H6l3.2 5z"/>
      <path class="b" d="M10 27.5l8.5-17 8.5 17z"/><path d="M15.5 27.5l3-8 3 8M18.5 10.5l-1.6-3M18.5 10.5l1.6-3"/>
      <path d="M26.5 5.5a3 3 0 1 0 2.8 4a2.4 2.4 0 0 1-2.8-4z"/>`,
  },
  waterSlide: {
    name: "Водная горка",
    svg: `<path d="M4 29V7M9 29V7M3 7h7M4 11.5h5M4 16h5M4 20.5h5M4 25h5"/>
      <path class="b" d="M9 7c8 0 6 9.5 12 12c4 1.6 5 3.5 5 7h-3.5c0-2.4-.6-3.3-3.4-4.4C13.5 19.3 14.5 11 9 11z"/>
      <path d="M12.5 29q2-1.4 4 0t4 0t4 0t4 0" stroke-width="1.2"/><path d="M27.5 24l1.5-2M29 26.5l1.8-.6" stroke-width="1.1"/>`,
  },
  aquarium: {
    name: "Океанариум",
    svg: `<path class="b" d="M4 28.5V12a12 12 0 0 1 24 0v16.5z"/>
      <path d="M9.5 17.5q5.5-5.6 11 0q-5.5 5.6-11 0zM9.5 17.5l-3.2-2.8v5.6z"/><circle class="f" cx="17.3" cy="16.6" r=".7"/>
      <circle cx="22.8" cy="11.5" r="1.1"/><circle cx="24.5" cy="8" r=".7"/>
      <path d="M23.5 28.5q-2-3 0-5.2q2-2.2 0-4.5M8 28.5q1.6-2 0-3.8" stroke-width="1.2"/>`,
  },
  driveIn: {
    name: "Автокинотеатр",
    svg: `<rect class="b" x="4" y="3.5" width="24" height="12.5" rx="1"/><path d="M14 6.8l5.2 3-5.2 3z"/>
      <path d="M9.5 16v3.5M22.5 16v3.5"/>
      <path class="b" d="M6.5 29v-4.3q0-2.1 2-2.4l2.3-3.8h10.4l2.3 3.8q2 .3 2 2.4V29z"/>
      <path d="M11.8 19.6h8.4l1.4 2.7H10.4z" stroke-width="1"/><path d="M8.5 26h2.5M21 26h2.5"/>`,
  },
  guitar: {
    name: "Гитара",
    svg: `<g transform="rotate(38 16 16)">
      <path class="b" d="M16 10.5q-4.8 0-4.4 4.7q.3 1.9-1.6 3.4q-3 2.4-2.1 5.9q1 4.4 8.1 4.4t8.1-4.4q.9-3.5-2.1-5.9q-1.9-1.5-1.6-3.4q.4-4.7-4.4-4.7z"/>
      <circle cx="16" cy="20" r="1.9"/><path d="M14 25h4"/>
      <path class="b" d="M15 10.6V3h2v7.6"/><path d="M14.3 3h3.4V.5h-3.4z"/></g>
      <path d="M25 6.5v4.5a1.3 1.1 0 1 1-1.1-1.1M25 6.5l2.6-1" stroke-width="1.1"/>`,
  },
  fireworks: {
    name: "Салют",
    svg: `${rays(11.5, 10, 2.5, 7, 10)}<circle class="f" cx="11.5" cy="10" r="1"/>
      ${rays(24, 16, 1.8, 5, 8, 0.4)}<circle class="f" cx="24" cy="16" r=".8"/>
      <path d="M11.5 18v10M24 22v6" stroke-dasharray="1.4 1.6" stroke-width="1.1"/>
      <path d="M3 29h26"/><circle class="f" cx="27.5" cy="5" r=".7"/><circle class="f" cx="4" cy="20" r=".7"/>`,
  },
  bicycle: {
    name: "Велосипед",
    svg: `<circle cx="7.5" cy="21" r="5.5"/><circle cx="24.5" cy="21" r="5.5"/>
      <path d="M7.5 21l5-8.5 3 8.5zM12.5 12.5h9l-6 8.5M21.5 12.5l3 8.5M21.5 12.5l-1-3.3h3M10.5 11h4M15.5 21l1.6 2"/>`,
  },
  golf: {
    name: "Гольф",
    svg: `<path d="M13 27.5V3.5"/><path class="f" d="M13 3.5l9 3.6-9 3.6z"/>
      <path d="M6.5 28q6.5-3 13 0"/><circle class="b" cx="24" cy="24.5" r="2.4"/>
      <path d="M29 9l-5 11.5 3 1" stroke-width="1.8"/>`,
  },
  easel: {
    name: "Выставка",
    svg: `<path d="M9 29.5L14.5 4.5M23 29.5L17.5 4.5M16 4.5V29.5"/>
      <rect class="b" x="5.5" y="7.5" width="21" height="14" rx=".6"/>
      <path d="M7.8 19.5l5-6 3.5 3.6 2.2-2.2 5.7 4.6" stroke-width="1.2"/><circle cx="21.2" cy="11.3" r="1.4"/>
      <path d="M5 23.5h22" stroke-width="2"/>`,
  },
  tennis: {
    name: "Теннис",
    svg: `<g transform="rotate(-35 13 12)"><ellipse class="b" cx="13" cy="12" rx="6.5" ry="8.5"/>
      <path d="M10 4.5v15M13 3.5v17M16 4.5v15M7.3 8h11.4M6.5 12h13M7.3 16h11.4" stroke-width=".7"/>
      <path d="M13 20.5V29"/><rect class="f" x="11.8" y="24" width="2.4" height="5.5" rx=".8"/></g>
      <circle class="b" cx="25" cy="24.5" r="3.4"/><path d="M22.3 22.8q2.7 1.7 0 3.4M27.7 22.8q-2.7 1.7 0 3.4" stroke-width="1"/>`,
  },
  pottery: {
    name: "Гончарный круг",
    svg: `<path class="b" d="M12.5 3.5h7M13.3 3.5q0 3-1.2 4.2Q7.5 11.5 8.2 18q.8 6.3 7.8 7.1q7-.8 7.8-7.1q.7-6.5-3.9-10.3q-1.2-1.2-1.2-4.2"/>
      <path d="M9 15.5h14M8.7 18.5h14.6" stroke-width="1"/>
      <path class="b" d="M4 25.5h24v2H4z"/><path d="M12 27.5v2.5h8v-2.5"/>`,
  },
  balloon: {
    name: "Воздушный шар",
    svg: `<path class="b" d="M16 2.5q10.5 0 10.5 10.5q0 6.5-7.3 11.5h-6.4Q5.5 19.5 5.5 13Q5.5 2.5 16 2.5z"/>
      <path d="M16 2.5q-4.6 8.5-3.2 22M16 2.5q4.6 8.5 3.2 22M5.8 11.5h20.4" stroke-width="1"/>
      <path d="M12.8 24.5l1 2.5M19.2 24.5l-1 2.5"/><rect class="b" x="13" y="27" width="6" height="3.2" rx=".5"/>`,
  },
  sneaker: {
    name: "Кроссовок",
    svg: `<path d="M1.5 11.5h4M1 14.5h3M2 17.5h3"/>
      <path class="b" d="M6.5 23.5q-.5-4.5 1.5-6.5l3-6.5q2.3 1.4 4.6 0l1.5 3.2q4.2 3.2 9.6 3.8q3.8.6 3.8 4.4v1.6z"/>
      <path d="M6 23.5h24.5v2.4q0 .8-.8.8H6.8q-.8 0-.8-.8z"/><path d="M11.5 14l2.8 1.8M10.2 16.8l2.8 1.8M18 20.5q4 1.2 8-1" stroke-width="1.2"/>`,
  },
  photos: {
    name: "Фотоальбом",
    svg: `<rect class="b" x="3.5" y="5" width="14" height="16.5" rx=".8" transform="rotate(-11 10.5 13)"/>
      <rect class="b" x="12.5" y="8.5" width="15.5" height="18.5" rx=".8" transform="rotate(8 20 18)"/>
      <g transform="rotate(8 20 18)"><rect x="14.5" y="10.5" width="11.5" height="11" stroke-width="1"/>
      <path class="f" d="M20.2 19q-3.6-2.4-3.4-4.6q.3-1.8 2-1.7q.9.1 1.4 1q.5-.9 1.4-1q1.7-.1 2 1.7q.2 2.2-3.4 4.6z"/></g>`,
  },
  divingMask: {
    name: "Дайвинг",
    svg: `<path d="M28 3.5V20q0 5.5-5.5 5.5H20v-3"/>
      <path class="b" d="M4.5 13.5q0-4.2 4.2-4.2h13.6q4.2 0 4.2 4.2v2.8q0 4.2-4.2 4.2h-3q-2 0-2.5-1.9q-.4-1.4-1.3-1.4h-.9q-.9 0-1.3 1.4q-.5 1.9-2.5 1.9h-2.1q-4.2 0-4.2-4.2z"/>
      <path d="M4.5 14H1.5M8 12.7l2.2-1.4M19 12.7l2.2-1.4" stroke-width="1.1"/>
      <circle cx="9" cy="5" r="1.1"/><circle cx="12.5" cy="2.8" r=".7"/><path d="M3 28q2.5-1.6 5 0t5 0" stroke-width="1.1"/>`,
  },
  gym: {
    name: "Спортзал",
    svg: `<g transform="rotate(-20 16 16)"><path d="M9.5 16h13" stroke-width="2.4"/>
      <rect class="b" x="2.5" y="8.5" width="4.4" height="15" rx="1.3"/><rect class="b" x="6.6" y="10.8" width="3.2" height="10.4" rx="1"/>
      <rect class="b" x="25.1" y="8.5" width="4.4" height="15" rx="1.3"/><rect class="b" x="22.2" y="10.8" width="3.2" height="10.4" rx="1"/></g>`,
  },
  photoRedo: {
    name: "Старое фото заново",
    svg: `<rect class="b" x="5" y="4" width="18" height="21" rx="1" transform="rotate(-6 14 14.5)"/>
      <g transform="rotate(-6 14 14.5)"><rect x="7.5" y="6.5" width="13" height="12" stroke-width="1"/>
      <circle cx="12" cy="11" r="1.7"/><circle cx="16.3" cy="11.3" r="1.7"/><path d="M8.8 18.5q.4-4.5 3.2-4.5t3 2.5q.4-2.3 1.3-2.3q2.8 0 3.2 4.3"/></g>
      <circle class="b" cx="25" cy="24" r="5.6" stroke-width="1.2"/><path d="M28 21.6a3.6 3.6 0 1 0 .9 3.4" stroke-width="1.4"/><path class="f" d="M29.6 19.4l.2 3.8-3.6-1.1z" stroke-width=".8"/>`,
  },
  chefHat: {
    name: "Готовим вместе",
    svg: `<path class="b" d="M9 18.5q-5-1-5-5.5q0-4.5 5-4.6q1-4.9 7-4.9t7 4.9q5 .1 5 4.6q0 4.5-5 5.5V27H9z"/>
      <path d="M9 22.5h14M12.5 18v4.5M16 17.5v5M19.5 18v4.5" stroke-width="1.1"/>
      <path d="M11.5 10.5q.6-2.4 3-3" stroke-width="1.1"/>`,
  },
  burgerCup: {
    name: "Битва бургеров",
    svg: `<path class="b" d="M8 4.5h16v5q0 7.5-8 8.5q-8-1-8-8.5z"/><path d="M8 7H4.5q0 6 5 7M24 7h3.5q0 6-5 7"/>
      <path d="M16 18v4.5M11 27.5h10l-1.2-5h-7.6z"/><path d="M8.5 30h15"/>
      <path class="f" d="M11.5 10.5q0-3.3 4.5-3.3t4.5 3.3z"/><path d="M11.3 12.2h9.4" stroke-width="1.3"/><path class="f" d="M11.8 13.6h8.4q0 1.6-1.4 1.6h-5.6q-1.4 0-1.4-1.6z"/>`,
  },
  puzzle: {
    name: "Квест-загадка",
    svg: `<path class="b" d="M5 9h6q-1.6-4.4 2.5-4.5Q17.6 4.6 16 9h6v6q4.4-1.6 4.5 2.5q.1 4.1-4.5 2.5v6h-6q1.6-4.4-2.5-4.5Q9.4 21.6 11 26H5v-6.5q4 1.5 4-2.2T5 15z"/>
      <path d="M12.6 13.2q0-2 2-2t2 1.8q0 1.3-2 2v1.4" stroke-width="1.3"/><circle class="f" cx="14.6" cy="18.6" r=".75"/>`,
  },
  skull: {
    name: "Хоррор-квест",
    svg: `<path class="b" d="M16 3.5q10 0 10 9.8q0 4.6-3.6 6.7v3.8q0 1.6-1.6 1.6H11.2q-1.6 0-1.6-1.6V20Q6 17.9 6 13.3Q6 3.5 16 3.5z"/>
      <path class="f" d="M9.6 13.5q0-2.6 2.8-2.6t2.5 2.9q-.3 2.6-2.8 2.6t-2.5-2.9zM17.1 13.8q-.1-2.9 2.5-2.9t2.8 2.6q0 2.9-2.5 2.9t-2.8-2.6z"/>
      <path class="f" d="M16 16.8l1.4 2.6h-2.8z"/><path d="M13 21.5v3.9M16 21.5v3.9M19 21.5v3.9" stroke-width="1.1"/>
`,
  },
  telescope: {
    name: "Звёздное небо",
    svg: `<g transform="rotate(-28 15 15)"><rect class="b" x="5" y="12.5" width="17" height="5.4" rx="1"/><rect class="b" x="21.5" y="11.4" width="4.5" height="7.6" rx="1"/><rect class="b" x="1.8" y="13.4" width="3.4" height="3.6" rx=".6"/></g>
      <path d="M15 19l-5 10M15 19l5 10M15 19v10"/>
      <path class="f" d="M8 2.5l.8 1.8 1.9.2-1.4 1.3.4 1.9-1.7-1-1.7 1 .4-1.9-1.4-1.3 1.9-.2z"/>
      <circle class="f" cx="15" cy="4" r=".8"/><circle class="f" cx="3.5" cy="11" r=".7"/><circle class="f" cx="29" cy="14" r=".7"/><path d="M28.5 23.5l.01 0M25 27l.01 0" stroke-width="1.6"/>`,
  },
  quizBulb: {
    name: "Квиз",
    svg: `<path class="b" d="M16 2.5a8.5 8.5 0 0 1 5.2 15.2V21H10.8v-3.3A8.5 8.5 0 0 1 16 2.5z"/>
      <path d="M13.6 9.2q0-2.6 2.4-2.6t2.4 2.3q0 1.7-2.4 2.8v2"/><circle class="f" cx="16" cy="16.6" r=".8"/>
      <path d="M11.3 23.6h9.4M12.3 26.2h7.4M14 28.7h4M3.5 10h2.5M26 10h2.5M5.5 3.5l2 1.8M26.5 3.5l-2 1.8"/>`,
  },
  buggy: {
    name: "Багги",
    svg: `<path d="M9 17l2.4-8.5h7.2l3.4 8.5M14.8 8.5V17"/><circle class="b" cx="16.8" cy="13.2" r="1.9"/>
      <path class="b" d="M2.5 21l2.5-4h18l5 2.3 1.5 1.7z"/>
      <circle class="b" cx="8" cy="23.5" r="4.6"/><circle class="b" cx="24.5" cy="23.5" r="4.6"/>
      <circle cx="8" cy="23.5" r="1.5"/><circle cx="24.5" cy="23.5" r="1.5"/><path d="M.8 27.5h2.4M.5 24.5h1.8" stroke-width="1.1"/>`,
  },
  perfume: {
    name: "Парфюм",
    svg: `<path d="M19.5 6.8h5q2.3 0 2.3 2.4"/><circle class="b" cx="26.8" cy="11.5" r="2.4"/>
      <rect class="b" x="13" y="8.5" width="6" height="4" rx=".6"/><rect class="f" x="12.2" y="5" width="7.6" height="3.5" rx=".8"/>
      <rect class="b" x="7.5" y="12.5" width="17" height="16" rx="3.2"/>
      <path d="M16 23.5q-3.5-2.3-3.3-4.4q.3-1.7 1.9-1.6q.9.1 1.4 1q.5-.9 1.4-1q1.6-.1 1.9 1.6q.2 2.1-3.3 4.4z" stroke-width="1.1"/>
      <circle class="f" cx="4" cy="5.5" r=".6"/><circle class="f" cx="6.5" cy="3.5" r=".6"/><circle class="f" cx="3.5" cy="9" r=".6"/><circle class="f" cx="7.5" cy="7" r=".6"/>`,
  },
  ropeJump: {
    name: "Роупджампинг",
    svg: `<path d="M1.5 7h29M3.5 7q12.5 13 25 0M8 7v4.7M12 7v7.3M20 7v7.3M24 7v4.7" stroke-width="1.2"/>
      <path d="M16 7Q12.5 17.5 8.5 22.5"/><circle class="b" cx="7.6" cy="24" r="1.7"/><path d="M7.2 25.6l-1 3.4M5 27l2-.6"/>
      <path d="M9 28.5q8 3 16-3" stroke-dasharray="1.4 1.8" stroke-width="1.1"/>`,
  },
  zipline: {
    name: "Зиплайн",
    svg: `<path d="M3 4.5v25M29 21.5v8M1.5 29.5h4M27.5 29.5h3"/><path d="M3 6.5l26 15"/>
      <circle class="b" cx="15" cy="13.4" r="1.8"/><path d="M15 15.2v3.6M12.5 18.8h5"/>
      <path d="M13 18.8l2 4 2-4"/><circle class="b" cx="15" cy="22" r="1.4"/><path d="M15 23.4v3.6M15 27l-1.6 2.5M15 27l1.6 2.5"/>`,
  },
  ropePark: { name: "Верёвочный парк", svg: ropeBridge() },
  bow: {
    name: "Лук и стрела",
    svg: `<path d="M8 3q14 13 0 26" stroke-width="2"/><path d="M8 3v26" stroke-width="1"/>
      <path d="M3 16h25M28 16l-3.4-2.2M28 16l-3.4 2.2"/>
      <path d="M5 16l-2.2-2.6M5 16l-2.2 2.6M7.4 16l-2.2-2.6M7.4 16l-2.2 2.6" stroke-width="1.1"/>`,
  },
  wine: {
    name: "Вино",
    svg: `<path class="b" d="M5 28.5V14q0-3 2.6-4.5V3.5h3.3v6q2.6 1.5 2.6 4.5v14.5z"/>
      <rect x="6.6" y="17" width="5.3" height="6" stroke-width="1"/>
      <path class="b" d="M18.5 9h9q0 7.7-4.5 8.7q-4.5-1-4.5-8.7z"/><path class="f" d="M18.8 12h8.4q-.6 4.8-4.2 5.6q-3.6-.8-4.2-5.6z"/>
      <path d="M23 17.7v8.5M19.5 26.2h7"/>`,
  },
  metro: {
    name: "Метро",
    svg: `<rect class="b" x="6.5" y="3.5" width="19" height="21.5" rx="4"/><rect x="9.5" y="6.8" width="13" height="7.2" rx="1"/>
      <path d="M16 6.8V14"/><circle class="f" cx="11" cy="19.5" r="1.3"/><circle class="f" cx="21" cy="19.5" r="1.3"/>
      <path d="M10 25l-3.5 4.5M22 25l3.5 4.5M3.5 29.5h25M14 21.5h4"/>`,
  },
  koreanBowl: {
    name: "Корейская кухня",
    svg: `<path d="M18.5 2.5L10 15.5M23 3.5l-9 12"/><path d="M8 12.5q-1.3-2 0-4M25 13q-1.3-2 0-4" stroke-width="1.1"/>
      <path class="b" d="M3.5 15.5h25q-.9 9.6-12.5 10.6Q4.4 25.1 3.5 15.5z"/>
      <path d="M11.5 26.5l.6 2.4h7.8l.6-2.4M6.5 19h19" stroke-width="1"/>`,
  },
  carWash: {
    name: "Мойка машины",
    svg: `<circle cx="7" cy="6.5" r="2.2"/><circle cx="12.5" cy="3.8" r="1.4"/><circle cx="19" cy="6" r="1.8"/><circle cx="25" cy="3.5" r="1.1"/><circle cx="24.5" cy="9.5" r="1.3"/>
      <path class="b" d="M3 24.5v-4q0-2.2 2.4-2.6l3.4-5.2q1-1.5 3-1.5h8.4q2 0 3 1.5l3.4 5.2q2.4.4 2.4 2.6v4z"/>
      <path d="M10.5 13.2l-2 4.5h15l-2-4.5zM16 13.2v4.5" stroke-width="1"/>
      <circle class="b" cx="9" cy="24.5" r="2.8"/><circle class="b" cx="23" cy="24.5" r="2.8"/>`,
  },
  openBook: {
    name: "Книга",
    svg: `<path class="b" d="M16 9.5q-6-3.3-13-1.3v18q7-2 13 1.3q6-3.3 13-1.3v-18q-7-2-13 1.3z"/><path d="M16 9.5v18"/>
      <path d="M6 12.5q4-.8 7.3.6M6 16q4-.8 7.3.6M6 19.5q4-.8 7.3.6M18.7 13.1q3.3-1.4 7.3-.6M18.7 16.6q3.3-1.4 7.3-.6" stroke-width="1"/>
      <path class="f" d="M16 6.5q-2.8-1.8-2.7-3.2q.2-1.2 1.4-1.1q.8.1 1.3.8q.5-.7 1.3-.8q1.2-.1 1.4 1.1q.1 1.4-2.7 3.2z"/>`,
  },
  steak: {
    name: "Стейк",
    svg: `<path class="b" d="M19.6 10.6L26 4.2M21.8 12.8l6.4-6.4"/>
      <circle class="b" cx="26.4" cy="3.6" r="1.7"/><circle class="b" cx="28.8" cy="6" r="1.7"/>
      <path d="M19.6 10.6l6.4-6.4M21.8 12.8l6.4-6.4"/>
      <path class="b" d="M3 18q0-9 9-10.2q8.2-1 10.3 5.6q1.6 6-4.6 9.6q-6 3.4-11 .4Q3 21.6 3 18z"/>
      <path d="M5.6 18q0-6.4 7-7.6M8 16.5q3-2 6-.2M9 20.5q3 1 6-1.5" stroke-width="1.1"/>`,
  },
  ketchup: {
    name: "Кетчуп",
    svg: `<path d="M15 6.2l1-3.7 1 3.7"/><rect class="f" x="12.8" y="6" width="6.4" height="3.4" rx=".8"/>
      <path class="b" d="M10 12.5q0-3.1 3.1-3.1h5.8q3.1 0 3.1 3.1v13.4q0 3.1-3.1 3.1h-5.8q-3.1 0-3.1-3.1z"/>
      <circle cx="16" cy="19" r="3.2"/><path d="M16 15.8q.3-1.5 1.8-2"/>
      <path class="f" d="M25.5 12q2.2 3 1.2 4.4q-1.2 1-2.4 0q-1-1.4 1.2-4.4z"/>`,
  },
  burger: {
    name: "Бургер",
    svg: `<path class="b" d="M4.5 14q0-9 11.5-9t11.5 9z"/>
      <path d="M11 9l1-.6M15.5 7.6h1.2M20 9l1 .6M13.5 11.2h1M18 11.4l1 .4" stroke-width="1.2"/>
      <path d="M3.5 16.5q2-1.5 4 0t4 0t4 0t4 0t4 0t4 0" stroke-width="1.3"/>
      <rect class="f" x="4.5" y="18.5" width="23" height="4" rx="2"/>
      <path class="b" d="M4.5 24.5h23q0 4-4 4h-15q-4 0-4-4z"/>`,
  },
  faceMask: {
    name: "Масочки",
    svg: `<ellipse class="b" cx="15.5" cy="16.5" rx="9" ry="11"/><path d="M6.8 12q8.7-9.5 17.4 0" stroke-width="2"/>
      <path d="M9.8 15.5q2.2-1.6 4.3 0q-2.2 1.6-4.3 0zM16.9 15.5q2.2-1.6 4.3 0q-2.2 1.6-4.3 0zM12.7 22.3q2.8 2 5.6 0"/>
      <circle cx="10" cy="20" r=".6" class="f"/><circle cx="21" cy="20" r=".6" class="f"/>
      <path d="M27.5 3.5v5M25 6h5M28.5 25v3M27 26.5h3" stroke-width="1.1"/>`,
  },
  nightKiss: {
    name: "Ночной поцелуй",
    svg: `<rect x="2.5" y="3" width="7" height="8" rx="1.2"/><path d="M5 9V5h1.7q1.8 0 1.8 1.5T6.7 8H5" stroke-width="1.2"/>
      <path d="M24.5 3a6 6 0 1 0 5 9.5a5 5 0 0 1-5-9.5z"/><circle class="f" cx="16" cy="5" r=".6"/><circle class="f" cx="19.5" cy="11" r=".6"/>
      <path class="b" d="M4 22q4.5-5.5 8.5-3.8q1.2.6 2.5.6t2.5-.6q4-1.7 8.5 3.8q-4.8 7-11 7T4 22z"/>
      <path d="M4 22q11 2.4 22 0" stroke-width="1.2"/>`,
  },

  // запасные — для новых планов
  heart: {
    name: "Сердце",
    svg: `<path class="b" d="M16 27.5Q4 19.5 4 11.5q0-5.5 5.4-5.8Q13.5 5.6 16 9.5q2.5-3.9 6.6-3.8Q28 6 28 11.5q0 8-12 16z"/>
      <path d="M8 11.5q.2-2.5 2.6-2.8" stroke-width="1.1"/>`,
  },
  star: {
    name: "Звезда",
    svg: `<path class="b" d="M16 3.5l3.7 8 8.8 1-6.5 6 1.8 8.7L16 22.8l-7.8 4.4L10 18.5l-6.5-6 8.8-1z"/>`,
  },
  plane: {
    name: "Самолёт",
    svg: `<path class="b" d="M28.5 4.5q-1.8-1.8-4.5.5l-5.5 5-12-3.5-2.5 2.5 10 6-5.5 6.2-4-1L2.5 22l5 2.5 2.5 5 1.8-2-1-4 6.2-5.5 6 10 2.5-2.5-3.5-12 5-5.5q2.3-2.7.5-4.5z"/>`,
  },
  camera: {
    name: "Фотоаппарат",
    svg: `<path class="b" d="M3.5 10.5q0-2 2-2h4.3l2-3h8.4l2 3h4.3q2 0 2 2V24q0 2-2 2h-21q-2 0-2-2z"/>
      <circle class="b" cx="16" cy="16.8" r="5.4"/><circle cx="16" cy="16.8" r="2.6"/><circle class="f" cx="24.5" cy="12" r=".9"/>`,
  },
  map: {
    name: "Карта",
    svg: `<path class="b" d="M3.5 7l7-2.5 11 3 7-2.5v20.5l-7 2.5-11-3-7 2.5z"/><path d="M10.5 4.5V25M21.5 7.5V28" stroke-width="1"/>
      <path d="M6 20q4-1 6-4.5t7-2.5" stroke-dasharray="1.4 1.6" stroke-width="1.1"/><path d="M23.5 10.5l3 3M26.5 10.5l-3 3"/>`,
  },
  gift: {
    name: "Подарок",
    svg: `<rect class="b" x="5" y="13" width="22" height="15" rx=".8"/><rect class="b" x="3.5" y="9" width="25" height="4.5" rx=".8"/>
      <path d="M16 9v19"/><path d="M16 9q-7-6-8-1.5T16 9q7-6 8-1.5T16 9z"/>`,
  },
  music: {
    name: "Музыка",
    svg: `<path d="M12 23V7l14-3v15.5"/><path d="M12 11.5l14-3" stroke-width="1"/>
      <ellipse class="f" cx="8.5" cy="23.5" rx="3.6" ry="2.8"/><ellipse class="f" cx="22.5" cy="20" rx="3.6" ry="2.8"/>`,
  },
  sun: {
    name: "Солнце",
    svg: `<circle class="b" cx="16" cy="16" r="6"/>${rays(16, 16, 8.5, 12.5, 12)}`,
  },
  flower: {
    name: "Цветок",
    svg: `<path d="M16 17v12M16 24q-5-.5-6.5-5q5 0 6.5 5zM16 26q4.5-1 5.5-5.5q-4.5.5-5.5 5.5z"/>
      ${dotsOnCircle(16, 10, 4.6, 6, 3.4)}<circle class="f" cx="16" cy="10" r="2.6"/>`,
  },
  key: {
    name: "Ключ",
    svg: `<circle class="b" cx="9.5" cy="16" r="5.8"/><circle cx="9.5" cy="16" r="2"/><path d="M15.3 16h13.2M24.5 16v4.5M28 16v3.5"/>`,
  },
  house: {
    name: "Дом",
    svg: `<path class="b" d="M5 14.5L16 4.5l11 10V28H5z"/><path d="M2.5 16.5L16 4.5l13.5 12"/>
      <path class="b" d="M13 28v-7.5h6V28"/><rect x="8" y="16" width="3.5" height="3.5"/><path d="M21.5 9V5.5H24v6"/>`,
  },
  ring: {
    name: "Кольцо",
    svg: `<circle cx="16" cy="19.5" r="8.5"/><circle cx="16" cy="19.5" r="6.5" stroke-width="1"/>
      <path class="b" d="M12.5 11l1.8-4h3.4l1.8 4L16 14z"/><path d="M12.5 11h7M14.3 7L16 14l1.7-7" stroke-width="1"/>
      <path d="M24 5l1 2M27.5 8.5l-2 .8M8 5l-1 2" stroke-width="1.1"/>`,
  },
  candle: {
    name: "Свеча",
    svg: `<path class="b" d="M16 3.5q3 3.5 3 6q0 3-3 3t-3-3q0-2.5 3-6z"/><path d="M16 12.5v2.5"/>
      <rect class="b" x="12" y="15" width="8" height="12" rx=".6"/><path d="M7 27.5h18M14 18v4" stroke-width="1.1"/>`,
  },
  compass: {
    name: "Компас",
    svg: `<circle class="b" cx="16" cy="16" r="12"/>${rays(16, 16, 9.8, 12, 16)}
      <path class="f" d="M16 6.5l2.3 9.5H13.7z"/><path class="b" d="M16 25.5l-2.3-9.5h4.6z"/>`,
  },
  ticket: {
    name: "Билет",
    svg: `<path class="b" d="M3 9.5h26v4a2.5 2.5 0 0 0 0 5v4H3v-4a2.5 2.5 0 0 0 0-5z"/>
      <path d="M21.5 9.5v13" stroke-dasharray="1.3 1.6"/><path d="M7 14h11M7 18h8" stroke-width="1.1"/>`,
  },
  cake: {
    name: "Торт",
    svg: `<path d="M16 3.5q1.6 1.8 0 3.2q-1.6-1.4 0-3.2zM16 7v3.5"/>
      <rect class="b" x="6" y="10.5" width="20" height="7" rx="1"/><rect class="b" x="4" y="17.5" width="24" height="10" rx="1"/>
      <path d="M6 14q2.5 2 5 0t5 0t5 0t5 0M4 21.5q3 2.3 6 0t6 0t6 0t6 0M2 27.5h28" stroke-width="1.1"/>`,
  },
};

export const ICONS = I;
export const ICON_KEYS = Object.keys(I);
export const DEFAULT_ICON = "heart";

export function iconSvg(key) {
  const ic = I[key] || I[DEFAULT_ICON];
  return `<svg class="ic" viewBox="0 0 32 32" aria-hidden="true">${ic.svg}</svg>`;
}
