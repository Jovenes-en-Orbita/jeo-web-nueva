export interface UniverseStructure {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  size: string;
  example: string;
  order: number;
}

export const UNIVERSE_STRUCTURES: UniverseStructure[] = [
  {
    id: "supercumulos",
    name: "Supercúmulos",
    slug: "supercumulos",
    image: "/assets/hero-cosmos.svg",
    description:
      "Los supercúmulos son las agrupaciones de galaxias más grandes que conocemos. Reúnen decenas de cúmulos y grupos de galaxias unidos débilmente por la gravedad. La Vía Láctea forma parte del supercúmulo Laniakea.",
    size: "100 a 500 millones de años luz",
    example: "Laniakea, Virgo, Coma",
    order: 1,
  },
  {
    id: "cumulos-galaxias",
    name: "Cúmulos de galaxias",
    slug: "cumulos-galaxias",
    image: "/assets/hero-cosmos.svg",
    description:
      "Estructuras masivas compuestas por cientos o miles de galaxias unidas fuertemente por la atracción gravitatoria, inmersas en gigantescas nubes de gas caliente y materia oscura.",
    size: "10 a 30 millones de años luz",
    example: "Cúmulo de Virgo, Cúmulo de Fornax",
    order: 2,
  },
  {
    id: "galaxias",
    name: "Galaxias",
    slug: "galaxias",
    image: "/assets/hero-cosmos.svg",
    description:
      "Enormes sistemas astronómicos conformados por miles de millones de estrellas, planetas, nubes de gas y polvo cósmico organizados en espirales, formas elípticas o irregulares.",
    size: "10.000 a 100.000 años luz",
    example: "Vía Láctea, Andrómeda, Galaxia del Triángulo",
    order: 3,
  },
  {
    id: "nebulosas",
    name: "Nebulosas",
    slug: "nebulosas",
    image: "/assets/hero-cosmos.svg",
    description:
      "Vastas concentraciones interestelares de gas ionizado y polvo. Funcionan como cunas cósmicas donde nacen nuevas estrellas o remanentes luminosos de explosiones estelares pasadas.",
    size: "1 a cientos de años luz",
    example: "Nebulosa de Orión, Nebulosa del Cangrejo, Carina",
    order: 4,
  },
  {
    id: "cumulos-estelares",
    name: "Cúmulos estelares",
    slug: "cumulos-estelares",
    image: "/assets/hero-cosmos.svg",
    description:
      "Grupos de miles a cientos de miles de estrellas nacidas aproximadamente al mismo tiempo de la misma nube molecular, compartiendo origen evolutivo y enlace gravitacional.",
    size: "10 a 100 años luz",
    example: "Pléyades, Cúmulo Globular M13, Omega Centauri",
    order: 5,
  },
  {
    id: "sistemas-planetarios",
    name: "Sistemas planetarios",
    slug: "sistemas-planetarios",
    image: "/assets/hero-cosmos.svg",
    description:
      "Conjuntos de objetos astronómicos no estelares (planetas, lunas, asteroides y cometas) que orbitan alrededor de una o más estrellas centrales bajo su atracción gravitatoria.",
    size: "Decenas a cientos de Unidades Astronómicas (UA)",
    example: "Sistema Solar, Sistema TRAPPIST-1, Kepler-90",
    order: 6,
  },
  {
    id: "filamentos-cosmicos",
    name: "Filamentos cósmicos",
    slug: "filamentos-cosmicos",
    image: "/assets/hero-cosmos.svg",
    description:
      "Enormes hilos y murallas cósmicas de materia que interconectan cúmulos y supercúmulos de galaxias, constituyendo la red esquelética a mayor escala de todo el universo observable.",
    size: "Hasta cientos de millones de años luz",
    example: "Gran Muralla Sloan, Filamento de Perseo-Pegaso",
    order: 7,
  },
  {
    id: "vacios-cosmicos",
    name: "Vacíos cósmicos",
    slug: "vacios-cosmicos",
    image: "/assets/hero-cosmos.svg",
    description:
      "Inmensos espacios de baja densidad situados entre los filamentos cósmicos de la red cósmica, prácticamente desprovistos de galaxias o estrellas ordinarias.",
    size: "50 a cientos de millones de años luz",
    example: "Vacío de Bootes, Vacío Local",
    order: 8,
  },
];
