export interface StarPoint {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  size?: number;
}

export interface ConstellationData {
  id: string;
  name: string;
  latinName: string;
  season: 'Primavera' | 'Verano' | 'Otoño' | 'Invierno';
  hemisphere: 'Norte' | 'Sur' | 'Ambos';
  description: string;
  brightestStar: string;
  funFact: string;
  color: string;
  center: { x: number; y: number }; // Percentage 0 - 100 on sky canvas
  stars: StarPoint[];
  lines: [number, number][]; // pairs of star index connections
}

export const CONSTELLATIONS_DATA: ConstellationData[] = [
  {
    id: 'ori',
    name: 'Orión',
    latinName: 'Orion (El Cazador)',
    season: 'Invierno',
    hemisphere: 'Ambos',
    description: 'Una de las constelaciones más reconocibles del cielo nocturno. Famosa por "Las Tres Marías" (el Cinturón de Orión) y las supergigantes Betelgeuse y Rigel.',
    brightestStar: 'Rigel (Alfa Orionis)',
    funFact: 'Betelgeuse es una supergigante roja tan grande que si estuviera en el lugar del Sol, llegaría hasta la órbita de Júpiter.',
    color: '#38bdf8',
    center: { x: 30, y: 40 },
    stars: [
      { x: 22, y: 25, size: 5 }, // 0: Betelgeuse
      { x: 38, y: 27, size: 4 }, // 1: Bellatrix
      { x: 26, y: 42, size: 3 }, // 2: Alnitak
      { x: 30, y: 41, size: 3 }, // 3: Alnilam
      { x: 34, y: 40, size: 3 }, // 4: Mintaka
      { x: 24, y: 58, size: 4 }, // 5: Saiph
      { x: 37, y: 55, size: 5 }, // 6: Rigel
    ],
    lines: [
      [0, 1], [0, 2], [1, 4],
      [2, 3], [3, 4],
      [2, 5], [4, 6], [5, 6]
    ]
  },
  {
    id: 'cru',
    name: 'Cruz del Sur',
    latinName: 'Crux',
    season: 'Primavera',
    hemisphere: 'Sur',
    description: 'La constelación más pequeña de las 88 reconocidas, pero un ícono fundamental de navegación en el hemisferio sur.',
    brightestStar: 'Acrux (Alfa Crucis)',
    funFact: 'Apunta directamente hacia el Polo Sur Celestial trazando una línea recta 4.5 veces su eje mayor.',
    color: '#facc15',
    center: { x: 75, y: 65 },
    stars: [
      { x: 75, y: 55, size: 4 }, // 0: Gacrux (Arriba)
      { x: 75, y: 75, size: 5 }, // 1: Acrux (Abajo)
      { x: 68, y: 65, size: 4 }, // 2: Mimosa (Izquierda)
      { x: 81, y: 63, size: 3 }, // 3: Imai (Derecha)
    ],
    lines: [
      [0, 1], [2, 3]
    ]
  },
  {
    id: 'uma',
    name: 'Osa Mayor',
    latinName: 'Ursa Major',
    season: 'Primavera',
    hemisphere: 'Norte',
    description: 'Conocida popularmente como "El Cazo" o "El Carro", es visible durante todo el año en el hemisferio norte.',
    brightestStar: 'Alioth (Epsilon Ursae Majoris)',
    funFact: 'Las dos estrellas del extremo exterior del cazo (Dubhe y Merak) se usan para encontrar la Estrella Polar (Polaris).',
    color: '#ec4899',
    center: { x: 25, y: 75 },
    stars: [
      { x: 12, y: 82, size: 3.5 }, // 0: Alkaid
      { x: 17, y: 80, size: 3.5 }, // 1: Mizar
      { x: 21, y: 77, size: 3.5 }, // 2: Alioth
      { x: 26, y: 76, size: 3 },   // 3: Megrez
      { x: 25, y: 84, size: 3 },   // 4: Phecda
      { x: 33, y: 83, size: 4 },   // 5: Merak
      { x: 34, y: 73, size: 4 },   // 6: Dubhe
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]
    ]
  },
  {
    id: 'sco',
    name: 'Escorpio',
    latinName: 'Scorpius',
    season: 'Verano',
    hemisphere: 'Ambos',
    description: 'Una de las constelaciones más impresionantes del zodiaco con forma inequívoca de escorpión y su corazón brillante Antares.',
    brightestStar: 'Antares (Rival de Marte)',
    funFact: 'Antares se llama así ("Anti-Ares") porque su color rojo fuego rivaliza con el planeta Marte (Ares en griego).',
    color: '#ef4444',
    center: { x: 55, y: 35 },
    stars: [
      { x: 44, y: 22, size: 3 }, // 0: Garfio sup
      { x: 47, y: 27, size: 3.5 }, // 1: Dschubba
      { x: 52, y: 32, size: 5 }, // 2: Antares (Corazón)
      { x: 56, y: 39, size: 3 }, // 3: Larawag
      { x: 60, y: 46, size: 3 }, // 4: Sargas
      { x: 63, y: 44, size: 3.5 }, // 5: Shaula (Aguijón)
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5]
    ]
  },
  {
    id: 'cas',
    name: 'Casiopea',
    latinName: 'Cassiopeia',
    season: 'Otoño',
    hemisphere: 'Norte',
    description: 'Fácilmente identificable por su característica forma de "W" o "M" en el cielo del norte.',
    brightestStar: 'Schedar (Alpha Cassiopeiae)',
    funFact: 'Representa a la reina vanidosa de la mitología griega, castigada a girar eternamente boca abajo alrededor del polo.',
    color: '#a855f7',
    center: { x: 80, y: 25 },
    stars: [
      { x: 70, y: 28, size: 4 }, // 0: Caph
      { x: 74, y: 20, size: 4 }, // 1: Schedar
      { x: 79, y: 24, size: 4 }, // 2: Gamma Cassiopeiae
      { x: 84, y: 18, size: 3.5 }, // 3: Rukbah
      { x: 89, y: 23, size: 3.5 }, // 4: Segin
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  }
];
