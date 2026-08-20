export type SpaceObjectType = 'galaxy' | 'blackhole' | 'nebula' | 'star' | 'planet' | 'asteroid_belt' | 'cluster';

export interface SpaceFact {
  label: string;
  value: string;
}

export interface SpaceObject {
  id: string;
  name: string;
  subtitle: string;
  category: 'Estructura Profunda' | 'Estrella' | 'Planeta' | 'Cuerpo Menor';
  type: SpaceObjectType;
  description: string;
  details: SpaceFact[];
  color: string;
  position: [number, number, number];
  size: number;
  orbitRadius?: number;
  orbitSpeed?: number;
  ringColor?: string;
  viewCategory: 'galaxy' | 'solar';
  tag: string;
}

export const UNIVERSE_OBJECTS: SpaceObject[] = [
  // --- ESTRUCTURAS PROFUNDAS ---
  {
    id: 'via-lactea',
    name: 'Galaxia Vía Láctea',
    subtitle: 'Nuestra galaxia espiral barrada',
    category: 'Estructura Profunda',
    type: 'galaxy',
    description: 'La Vía Láctea es una galaxia espiral barrada que contiene entre 100 y 400 mil millones de estrellas. Nuestro Sistema Solar se encuentra en el brazo de Orión, a unos 27,000 años luz del núcleo galáctico.',
    details: [
      { label: 'Diámetro estimado', value: '100,000 – 180,000 años luz' },
      { label: 'Número de estrellas', value: '~200,000,000,000' },
      { label: 'Masa total', value: '1.5 billones de masas solares' },
      { label: 'Ubicación del Sol', value: 'Brazo de Orión (a ~27k años luz del centro)' },
      { label: 'Velocidad de rotación', value: '220 km/s (período galáctico: ~230M años)' }
    ],
    color: '#8b5cf6',
    position: [0, 0, 0],
    size: 250,
    viewCategory: 'galaxy',
    tag: 'Galaxia'
  },
  {
    id: 'sgra',
    name: 'Sagitario A* (Sgr A*)',
    subtitle: 'Agujero negro supermasivo central',
    category: 'Estructura Profunda',
    type: 'blackhole',
    description: 'Sagitario A* es el agujero negro supermasivo que reside en el centro dinámico de la Vía Láctea. Posee una masa equivalente a 4 millones de veces la masa del Sol concentrada en un volumen infinitamente denso.',
    details: [
      { label: 'Masa', value: '4.15 millones de masas solares' },
      { label: 'Distancia a la Tierra', value: '26,673 años luz' },
      { label: 'Diámetro del horizonte de eventos', value: '~24 millones de km' },
      { label: 'Descubrimiento', value: '1974 (Confirmado visualmente por EHT en 2022)' },
      { label: 'Efecto gravitacional', value: 'Orbita estrellas a velocidades > 30% de la luz' }
    ],
    color: '#f59e0b',
    position: [0, 0, 0],
    size: 15,
    viewCategory: 'galaxy',
    tag: 'Agujero Negro'
  },
  {
    id: 'orion-nebula',
    name: 'Nebulosa de Orión (M42)',
    subtitle: 'Vivero estelar en el Brazo de Orión',
    category: 'Estructura Profunda',
    type: 'nebula',
    description: 'Una gigantesca nube de gas plasma y polvo cósmico a 1,344 años luz de distancia. Es una de las nebulosas más brillantes y la región de formación estelar más cercana a nuestro planeta.',
    details: [
      { label: 'Distancia', value: '1,344 años luz' },
      { label: 'Diámetro', value: '24 años luz' },
      { label: 'Tipo', value: 'Nebulosa de emisión y reflexión' },
      { label: 'Características', value: 'Alberga el cúmulo del Trapecio de estrellas nacientes' },
      { label: 'Composición', value: 'Hidrógeno (89%), Helio (10%), restos pesados' }
    ],
    color: '#ec4899',
    position: [-110, 35, 75],
    size: 45,
    viewCategory: 'galaxy',
    tag: 'Nebulosa'
  },
  {
    id: 'ring-nebula',
    name: 'Nebulosa del Anillo (M57)',
    subtitle: 'Remanente planetario estelar',
    category: 'Estructura Profunda',
    type: 'nebula',
    description: 'La Nebulosa del Anillo es una nebulosa planetaria en la constelación de Lyra. Representa el destino futuro del Sol: capas expulsadas de gas ionizado rodeando una enana blanca moribunda.',
    details: [
      { label: 'Distancia', value: '2,570 años luz' },
      { label: 'Radio', value: '1.3 años luz' },
      { label: 'Estrella central', value: 'Enana blanca (~120,000 K de temperatura)' },
      { label: 'Edad aproximada', value: '~4,000 años' }
    ],
    color: '#06b6d4',
    position: [120, -25, -90],
    size: 35,
    viewCategory: 'galaxy',
    tag: 'Nebulosa Planetaria'
  },
  {
    id: 'hercules-cluster',
    name: 'Gran Cúmulo de Hércules (M13)',
    subtitle: 'Cúmulo globular estelar denso',
    category: 'Estructura Profunda',
    type: 'cluster',
    description: 'Un enjambre esférico de aproximadamente 300,000 estrellas viejas compactadas en un espacio de 145 años luz de diámetro. Es uno de los cúmulos estelares más antiguos conocidos.',
    details: [
      { label: 'Distancia', value: '22,200 años luz' },
      { label: 'Población estelar', value: '~300,000 estrellas' },
      { label: 'Edad', value: '11.65 mil millones de años' },
      { label: 'Mensaje de Arecibo', value: 'Enviado hacia M13 en 1974 como señal SETI' }
    ],
    color: '#3b82f6',
    position: [80, 70, 110],
    size: 40,
    viewCategory: 'galaxy',
    tag: 'Cúmulo Globular'
  },
  {
    id: 'cinturon-asteroides',
    name: 'Cinturón Principal de Asteroides',
    subtitle: 'Frontera entre planetas rocosos y gigantes',
    category: 'Estructura Profunda',
    type: 'asteroid_belt',
    description: 'Región del Sistema Solar situada entre las órbitas de Marte y Júpiter. Alberga millones de fragmentos rocosos y el planeta enano Ceres, restos no ensamblados de la formación planetaria primigenia.',
    details: [
      { label: 'Ubicación', value: '2.2 a 3.2 Unidades Astronómicas (UA) del Sol' },
      { label: 'Masa total', value: '~4% de la masa de la Luna' },
      { label: 'Objeto más grande', value: 'Ceres (940 km de diámetro)' },
      { label: 'Número de asteroides', value: '> 1.1 millones conocidos' }
    ],
    color: '#a1a1aa',
    position: [0, 0, 0],
    size: 85,
    viewCategory: 'solar',
    tag: 'Cinturón'
  },

  // --- SISTEMA SOLAR ---
  {
    id: 'sol',
    name: 'El Sol',
    subtitle: 'Estrella central de nuestro sistema',
    category: 'Estrella',
    type: 'star',
    description: 'Nuestra estrella madre, una enana amarilla de tipo espectral G2V. Su fusión termonuclear convierte 600 millones de toneladas de hidrógeno en helio cada segundo, alimentando la vida en la Tierra.',
    details: [
      { label: 'Tipo espectral', value: 'G2V (Enana amarilla)' },
      { label: 'Diámetro ecuatorial', value: '1.39 millones de km (109 veces la Tierra)' },
      { label: 'Temperatura superficial', value: '5,500 °C (Centro: 15 millones °C)' },
      { label: 'Masa', value: '333,000 veces la masa de la Tierra (99.86% del sistema)' },
      { label: 'Edad', value: '4.6 mil millones de años' }
    ],
    color: '#facc15',
    position: [0, 0, 0],
    size: 24,
    viewCategory: 'solar',
    tag: 'Estrella Madre'
  },
  {
    id: 'mercurio',
    name: 'Mercurio',
    subtitle: 'El planeta más pequeño y abrasado',
    category: 'Planeta',
    type: 'planet',
    description: 'El planeta más cercano al Sol. Carece de atmósfera densa, lo que provoca fluctuaciones extremas de temperatura de hasta 600 °C entre el día y la noche.',
    details: [
      { label: 'Distancia al Sol', value: '57.9 millones de km (0.39 UA)' },
      { label: 'Período orbital (Año)', value: '88 días terrestres' },
      { label: 'Diámetro', value: '4,879 km' },
      { label: 'Temperatura', value: '-180 °C a 430 °C' },
      { label: 'Satélites', value: '0' }
    ],
    color: '#94a3b8',
    position: [35, 0, 0],
    size: 4,
    orbitRadius: 35,
    orbitSpeed: 0.03,
    viewCategory: 'solar',
    tag: 'Planeta Rocoso'
  },
  {
    id: 'venus',
    name: 'Venus',
    subtitle: 'Gemelo abrasador de la Tierra',
    category: 'Planeta',
    type: 'planet',
    description: 'Planeta rocoso cubierto por nubes permanentes de ácido sulfúrico. Su denso efecto invernadero descontrolado genera temperaturas de 465 °C, convirtiéndolo en el más caliente del sistema.',
    details: [
      { label: 'Distancia al Sol', value: '108.2 millones de km (0.72 UA)' },
      { label: 'Período orbital', value: '225 días terrestres' },
      { label: 'Presión atmosférica', value: '92 veces la de la Tierra (similar a 900m bajo el agua)' },
      { label: 'Rotación', value: 'Retrograda (-243 días, su día es más largo que su año)' },
      { label: 'Satélites', value: '0' }
    ],
    color: '#fb923c',
    position: [52, 0, 0],
    size: 7.5,
    orbitRadius: 52,
    orbitSpeed: 0.022,
    viewCategory: 'solar',
    tag: 'Planeta Rocoso'
  },
  {
    id: 'tierra',
    name: 'La Tierra',
    subtitle: 'NUESTRO HOGAR AZUL',
    category: 'Planeta',
    type: 'planet',
    description: 'El único mundo conocido con agua líquida superficial y vida próspera. Su campo magnético protector y atmósfera rica en nitrógeno y oxígeno sostienen una inmensa biodiversidad.',
    details: [
      { label: 'Distancia al Sol', value: '149.6 millones de km (1 UA)' },
      { label: 'Período orbital', value: '365.25 días' },
      { label: 'Diámetro ecuatorial', value: '12,742 km' },
      { label: 'Satélite natural', value: 'La Luna (384,400 km de distancia)' },
      { label: 'Superficie de agua', value: '70.8%' }
    ],
    color: '#38bdf8',
    position: [70, 0, 0],
    size: 8,
    orbitRadius: 70,
    orbitSpeed: 0.016,
    viewCategory: 'solar',
    tag: 'Mundo Habitable'
  },
  {
    id: 'marte',
    name: 'Marte',
    subtitle: 'El Planeta Rojo',
    category: 'Planeta',
    type: 'planet',
    description: 'Mundo desértico de óxido de hierro con antiguos deltas secos de ríos. Alberga el Monte Olimpo, el volcán apagado más grande del Sistema Solar (21.9 km de altura).',
    details: [
      { label: 'Distancia al Sol', value: '227.9 millones de km (1.52 UA)' },
      { label: 'Período orbital', value: '687 días terrestres' },
      { label: 'Diámetro', value: '6,779 km' },
      { label: 'Satélites', value: '2 (Fobos y Deimos)' },
      { label: 'Atmósfera', value: '95% Dióxido de carbono (muy tenue)' }
    ],
    color: '#ef4444',
    position: [90, 0, 0],
    size: 5.5,
    orbitRadius: 90,
    orbitSpeed: 0.012,
    viewCategory: 'solar',
    tag: 'Planeta Rocoso'
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    subtitle: 'El gigante gaseoso colosal',
    category: 'Planeta',
    type: 'planet',
    description: 'El planeta más masivo del sistema. Su Gran Mancha Roja es una tempestad anticiclónica más grande que la Tierra que ha persistido por más de 350 años.',
    details: [
      { label: 'Distancia al Sol', value: '778.5 millones de km (5.2 UA)' },
      { label: 'Período orbital', value: '11.86 años terrestres' },
      { label: 'Masa', value: '318 veces la de la Tierra' },
      { label: 'Satélites conocidos', value: '95 (Ío, Europa, Ganimedes, Calisto)' },
      { label: 'Composición', value: 'Principalmente Hidrógeno (90%) y Helio (10%)' }
    ],
    color: '#eab308',
    position: [125, 0, 0],
    size: 16,
    orbitRadius: 125,
    orbitSpeed: 0.007,
    viewCategory: 'solar',
    tag: 'Gigante Gaseoso'
  },
  {
    id: 'saturno',
    name: 'Saturno',
    subtitle: 'El Señor de los Anillos',
    category: 'Planeta',
    type: 'planet',
    description: 'Famoso por su majestuoso sistema de anillos compuesto por miles de millones de partículas de hielo de agua y rocas puras orbitando en perfecto equilibrio dinámico.',
    details: [
      { label: 'Distancia al Sol', value: '1,434 millones de km (9.58 UA)' },
      { label: 'Período orbital', value: '29.45 años terrestres' },
      { label: 'Extensión de anillos', value: 'Hasta 282,000 km de ancho' },
      { label: 'Satélites conocidos', value: '146 (Titán con atmósfera densa, Encélado con géiseres)' },
      { label: 'Densidad', value: '0.69 g/cm³ (Flotaría en un océano masivo de agua)' }
    ],
    color: '#fde047',
    position: [160, 0, 0],
    size: 13,
    orbitRadius: 160,
    orbitSpeed: 0.005,
    ringColor: '#ca8a04',
    viewCategory: 'solar',
    tag: 'Gigante Anillado'
  },
  {
    id: 'urano',
    name: 'Urano',
    subtitle: 'El gigante de hielo inclinado',
    category: 'Planeta',
    type: 'planet',
    description: 'Gigante helado caracterizado por su extrema inclinación axial de 97.8°, lo que hace que sus polos apunten casi directamente hacia el Sol durante sus estaciones.',
    details: [
      { label: 'Distancia al Sol', value: '2,871 millones de km (19.2 UA)' },
      { label: 'Período orbital', value: '84 años terrestres' },
      { label: 'Temperatura atmosférica', value: '-224 °C (la más fría en el sistema)' },
      { label: 'Satélites conocidos', value: '28 (Miranda, Titania, Oberón)' },
      { label: 'Inclinación axial', value: '97.77° (Gira prácticamente acostado)' }
    ],
    color: '#2dd4bf',
    position: [195, 0, 0],
    size: 10,
    orbitRadius: 195,
    orbitSpeed: 0.003,
    viewCategory: 'solar',
    tag: 'Gigante Helado'
  },
  {
    id: 'neptuno',
    name: 'Neptuno',
    subtitle: 'El guardián de vientos supersónicos',
    category: 'Planeta',
    type: 'planet',
    description: 'El planeta más distante del sistema solar. Sus intensas tormentas alcanzan los vientos más veloces medidos en cualquier planeta, superando los 2,100 km/h.',
    details: [
      { label: 'Distancia al Sol', value: '4,495 millones de km (30.1 UA)' },
      { label: 'Período orbital', value: '164.8 años terrestres' },
      { label: 'Velocidad del viento', value: 'Hasta 2,100 km/h' },
      { label: 'Satélites conocidos', value: '16 (Tritón, con géiseres de nitrógeno retrógrados)' },
      { label: 'Descubrimiento', value: '1846 (Primera predicción por cálculo matemático)' }
    ],
    color: '#2563eb',
    position: [230, 0, 0],
    size: 9.5,
    orbitRadius: 230,
    orbitSpeed: 0.002,
    viewCategory: 'solar',
    tag: 'Gigante Helado'
  }
];
