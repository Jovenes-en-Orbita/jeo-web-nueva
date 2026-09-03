import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌌 Seeding JEO database...');

  // ── Initial Admin User ──
  await prisma.user.deleteMany();
  const passwordHash = await bcrypt.hash('admin1234', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@jovenesenorbita.com',
      passwordHash,
      name: 'Director JEO',
      role: 'SUPERADMIN',
    },
  });
  console.log(`👤 Admin user seeded: ${adminUser.email} / admin1234`);

  // ── Stats ──

  await prisma.stat.deleteMany();
  await prisma.stat.createMany({
    data: [
      { value: '93 %', label: 'del universo aún no se comprende del todo', order: 1 },
      { value: '8', label: 'planetas en el sistema solar', order: 2 },
      { value: '88', label: 'constelaciones reconocidas oficialmente', order: 3 },
      { value: '+400', label: 'fotografías en Fragmentos de Memoria', order: 4 },
    ],
  });

  // ── Universe Tabs ──
  await prisma.universeTab.deleteMany();
  await prisma.universeTab.createMany({
    data: [
      { label: 'Origen', slug: 'origen', description: 'Origen del universo, inflación cósmica y el Big Bang.', order: 1 },
      { label: 'Composición', slug: 'composicion', description: 'Energía oscura (68%), materia oscura (27%) y materia bariónica (5%).', order: 2 },
      { label: 'Estructuras', slug: 'estructuras', description: 'Filamentos cósmicos, cúmulos galácticos y superestructuras como Laniakea.', order: 3 },
      { label: 'La luz', slug: 'la-luz', description: 'El espectro electromagnético desde las ondas de radio hasta los rayos gamma.', order: 4 },
      { label: 'Ondas gravitacionales', slug: 'ondas-gravitacionales', description: 'Ondulaciones en el tejido del espacio-tiempo detectadas por interferómetros láser.', order: 5 },
    ],
  });

  // ── Planets ──
  await prisma.moon.deleteMany();
  await prisma.planet.deleteMany();

  const mercurio = await prisma.planet.create({
    data: {
      name: 'Mercurio',
      slug: 'mercurio',
      order: 1,
      description: 'El planeta más pequeño del Sistema Solar y el más cercano al Sol. Carece de atmósfera sustancial y su superficie craterizada experimenta cambios térmicos extremos entre -180 °C y 430 °C.',
    },
  });

  const venus = await prisma.planet.create({
    data: {
      name: 'Venus',
      slug: 'venus',
      order: 2,
      description: 'Hermano gemelo de la Tierra en tamaño y masa, pero con un efecto invernadero desbocado que eleva su temperatura a más de 465 °C bajo densas nubes de ácido sulfúrico.',
    },
  });

  const tierra = await prisma.planet.create({
    data: {
      name: 'Tierra',
      slug: 'tierra',
      order: 3,
      description: 'Nuestro hogar en el cosmos. El único mundo conocido con agua líquida superficial, atmósfera rica en oxígeno y nitrógeno, y una biosfera rica y diversa.',
    },
  });

  const marte = await prisma.planet.create({
    data: {
      name: 'Marte',
      slug: 'marte',
      order: 4,
      description: 'El Planeta Rojo. Desierto helado de óxido de hierro que alberga el Monte Olimpo (el volcán más alto del sistema) y antiguos valles tallados por agua líquida en su juventud.',
    },
  });

  const jupiter = await prisma.planet.create({
    data: {
      name: 'Júpiter',
      slug: 'jupiter',
      order: 5,
      description: 'El coloso del Sistema Solar. Con más del doble de masa que todos los demás planetas juntos, este gigante gaseoso destaca por su Gran Mancha Roja y su corte de más de 90 lunas.',
    },
  });

  const saturno = await prisma.planet.create({
    data: {
      name: 'Saturno',
      slug: 'saturno',
      order: 6,
      description: 'Famoso por su majestuoso sistema de anillos formado por billones de partículas de hielo y roca. Posee una densidad tan baja que flotaría en una piscina colosal de agua.',
    },
  });

  const urano = await prisma.planet.create({
    data: {
      name: 'Urano',
      slug: 'urano',
      order: 7,
      description: 'Gigante helado caracterizado por su tono azul verdoso y su rotación casi completamente acostada (inclinación de 97.8°), lo que genera estaciones extremas de décadas de duración.',
    },
  });

  const neptuno = await prisma.planet.create({
    data: {
      name: 'Neptuno',
      slug: 'neptuno',
      order: 8,
      description: 'El guardián más exterior del Sistema Solar. Azotado por los vientos más violentos del vecindario cósmico (más de 2,100 km/h) y con una activa atmósfera azul profundo.',
    },
  });

  // ── Moons (5 largest) ──
  await prisma.moon.createMany({
    data: [
      {
        name: 'Ganímedes',
        slug: 'ganimedes',
        planetId: jupiter.id,
        order: 1,
        description: 'La luna más grande del Sistema Solar (más grande incluso que Mercurio) y la única con campo magnético propio.',
      },
      {
        name: 'Titán',
        slug: 'titan',
        planetId: saturno.id,
        order: 2,
        description: 'Mundo fascinante con atmósfera densa rica en nitrógeno y mares de metano y etano líquido sobre su corteza de hielo.',
      },
      {
        name: 'Calisto',
        slug: 'calisto',
        planetId: jupiter.id,
        order: 3,
        description: 'El objeto más densamente craterizado del Sistema Solar, con una superficie inalterada por miles de millones de años.',
      },
      {
        name: 'Ío',
        slug: 'io',
        planetId: jupiter.id,
        order: 4,
        description: 'El cuerpo geológicamente más activo del sistema, con más de 400 volcanes activos impulsados por la gravedad de Júpiter.',
      },
      {
        name: 'Europa',
        slug: 'europa',
        planetId: jupiter.id,
        order: 5,
        description: 'Corteza lisa de hielo bajo la cual se oculta un océano global de agua líquida con el doble de volumen que todos los océanos terrestres.',
      },
    ],
  });

  // ── Constellations ──
  await prisma.constellation.deleteMany();
  await prisma.constellation.createMany({
    data: [
      {
        name: 'Orión',
        latinName: 'Orion (El Cazador)',
        season: 'Invierno',
        hemisphere: 'Ambos',
        brightestStar: 'Rigel (Beta Orionis)',
        funFact: 'Betelgeuse es tan colosal que si reemplazara al Sol, engulliría a Mercurio, Venus, la Tierra y la órbita de Marte.',
        starsCount: 7,
        bestMonth: 'Enero',
        slug: 'orion',
        description: 'Una de las constelaciones más emblemáticas y reconocibles del cielo nocturno. Famosa por el Cinturón de Orión ("Las Tres Marías"), la supergigante roja Betelgeuse y la brillante Rigel.',
      },
      {
        name: 'Cruz del Sur',
        latinName: 'Crux',
        season: 'Primavera',
        hemisphere: 'Sur',
        brightestStar: 'Acrux (Alfa Crucis)',
        funFact: 'Es la más pequeña de las 88 constelaciones oficiales, pero ha sido la brújula celestial de navegantes del hemisferio sur durante siglos.',
        starsCount: 4,
        bestMonth: 'Mayo',
        slug: 'cruz-del-sur',
        description: 'Ícono del hemisferio sur y símbolo presente en varias banderas nacionales. Permite ubicar el Polo Sur Celeste extendiendo 4.5 veces su brazo mayor.',
      },
      {
        name: 'Osa Mayor',
        latinName: 'Ursa Major',
        season: 'Primavera',
        hemisphere: 'Norte',
        brightestStar: 'Alioth (Epsilon Ursae Majoris)',
        funFact: 'Las estrellas Merak y Dubhe sirven como "punteros" para localizar la Estrella Polar (Polaris).',
        starsCount: 7,
        bestMonth: 'Abril',
        slug: 'osa-mayor',
        description: 'Famosa por el asterismo de "El Gran Cazo" o "El Carro", es una de las constelaciones más antiguas de la historia humana, documentada por múltiples culturas antiguas.',
      },
      {
        name: 'Escorpio',
        latinName: 'Scorpius',
        season: 'Verano',
        hemisphere: 'Ambos',
        brightestStar: 'Antares (Alfa Scorpii)',
        funFact: 'Antares significa "rival de Marte" (Anti-Ares) por su intenso brillo y color rojizo similar al planeta vecino.',
        starsCount: 18,
        bestMonth: 'Julio',
        slug: 'escorpio',
        description: 'Espectacular constelación del zodíaco que dibuja con gran fidelidad la silueta de un escorpión con su aguijón (Shaula) y su corazón palpitante rojo (Antares).',
      },
      {
        name: 'Casiopea',
        latinName: 'Cassiopeia',
        season: 'Otoño',
        hemisphere: 'Norte',
        brightestStar: 'Schedar (Alfa Cassiopeiae)',
        funFact: 'En la mitología griega representaba a la vanidosa reina Casiopea, condenada a girar eternamente boca abajo alrededor del polo celeste.',
        starsCount: 5,
        bestMonth: 'Noviembre',
        slug: 'casiopea',
        description: 'Reconocible de inmediato por su silueta en forma de "W" o "M" en el cielo boreal, opuesta a la Osa Mayor respecto a la Estrella Polar.',
      },
      {
        name: 'Tauro',
        latinName: 'Taurus',
        season: 'Invierno',
        hemisphere: 'Ambos',
        brightestStar: 'Aldebarán (Alfa Tauri)',
        funFact: 'Alberga el legendario cúmulo abierto de Las Pléyades (las Siete Hermanas) y los restos de la supernova del año 1054: la Nebulosa del Cangrejo.',
        starsCount: 19,
        bestMonth: 'Diciembre',
        slug: 'tauro',
        description: 'Constelación zodiacal milenaria que representa al toro celestial, atravesada por el brillante ojo anaranjado de Aldebarán.',
      },
      {
        name: 'Andrómeda',
        latinName: 'Andromeda',
        season: 'Otoño',
        hemisphere: 'Norte',
        brightestStar: 'Alpheratz (Alfa Andromedae)',
        funFact: 'Contiene la Galaxia de Andrómeda (M31), el objeto más distante visible a simple vista por el ojo humano (a 2.5 millones de años luz).',
        starsCount: 16,
        bestMonth: 'Octubre',
        slug: 'andromeda',
        description: 'Constelación boreal mitológica ligada al mito de Perseo. Es el hogar de la galaxia espiral gigante vecina que colisionará con la Vía Láctea en 4 mil millones de años.',
      },
      {
        name: 'Centauro',
        latinName: 'Centaurus',
        season: 'Primavera',
        hemisphere: 'Sur',
        brightestStar: 'Alfa Centauri (Rigil Kentaurus)',
        funFact: 'Próxima Centauri, estrella de este sistema estelar triple, es la estrella más cercana a nuestro Sol (a 4.24 años luz).',
        starsCount: 11,
        bestMonth: 'Mayo',
        slug: 'centauro',
        description: 'Enorme y brillante constelación del hemisferio sur que alberga tanto a nuestro vecino estelar más próximo como al cúmulo globular más masivo: Omega Centauri.',
      },
    ],
  });

  // ── News Articles ──
  await prisma.newsArticle.deleteMany();
  await prisma.newsArticle.createMany({
    data: [
      {
        title: 'Artemis III: El regreso a la Luna se acerca',
        summary: 'La NASA y sus aliados internacionales confirman avances clave en la misión que llevará a la primera mujer y al próximo hombre a la superficie lunar en el Polo Sur.',
        date: new Date('2024-03-05'),
        readTimeMinutes: 6,
        slug: 'artemis-iii',
        author: 'Redacción JEO',
        tags: ['Misiones Espaciales', 'Luna', 'NASA', 'Artemis'],
        coverImageCaption: 'Concepto artístico del módulo de alunizaje de la misión Artemis III en el Polo Sur lunar.',
        content: `
# Artemis III: La nueva era de la exploración lunar sostenible

El programa **Artemis** de la NASA marca el comienzo del retorno de la humanidad a nuestro satélite natural tras más de medio siglo desde la última misión Apolo en 1972. Sin embargo, a diferencia de las misiones del siglo XX, el objetivo de Artemis no es simplemente plantar una bandera y regresar, sino establecer una **presencia humana permanente y sostenible** en la Luna.

## Hitos científicos en el Polo Sur Lunar
El destino seleccionado para Artemis III es el **Polo Sur lunar**, una región de extremo interés científico debido a la presencia de cráteres en sombra permanente (*Permanently Shadowed Regions* o PSR). En estas depresiones, donde la luz solar no ha penetrado en miles de millones de años, los instrumentos orbitales han detectado firmas inequívocas de **hielo de agua**.

> "El hielo lunar no es solo agua para consumo de los astronautas: mediante electrólisis podemos separarlo en hidrógeno y oxígeno, creando el combustible para los cohetes que viajarán a Marte."

## Tecnología de vanguardia: SLS, Orion y Starship HLS
El perfil de la misión Artemis III combina múltiples proezas de ingeniería aeroespacial:
- **SLS (Space Launch System):** El cohete de carga pesada más potente construido hasta la fecha.
- **Cápsula Orion:** Vehículo tripulado diseñado para llevar a cuatro astronautas más allá de la órbita terrestre baja.
- **Starship Human Landing System (HLS):** Desarrollado por SpaceX, actuará como el módulo de descenso y ascenso desde la órbita lunar hacia la superficie.

La misión sentará las bases científicas y tecnológicas para el siguiente gran salto de nuestra especie: **el viaje tripulado al planeta Marte**.
        `.trim(),
      },
      {
        title: 'Descubren exoplaneta con posible atmósfera habitable',
        summary: 'El telescopio espacial James Webb detectó firmas moleculares de vapor de agua y compuestos de carbono en la atmósfera de un exoplaneta en la zona de habitabilidad.',
        date: new Date('2024-02-02'),
        readTimeMinutes: 4,
        slug: 'exoplaneta-habitable',
        author: 'Divulgación Científica JEO',
        tags: ['Astrobiología', 'James Webb', 'Exoplanetas', 'Cosmos'],
        coverImageCaption: 'Recreación artística de la atmósfera de un exoplaneta rocoso tipo supertierra.',
        content: `
# Señales de habitabilidad: El telescopio James Webb revela la atmósfera de un mundo distante

La búsqueda de biomarcadores y atmósferas habitables fuera del Sistema Solar ha dado un paso de gigante. Utilizando sus espectrógrafos infrarrojos de ultra alta precisión (NIRSpec y MIRI), el **Telescopio Espacial James Webb (JWST)** ha obtenido mediciones detalladas de la atmósfera de una supertierra ubicada en la zona de habitabilidad de su estrella enana roja.

## La técnica del tránsito espectroscópico
Cuando el planeta cruza por delante del disco de su estrella anfitriona, una fracción minúscula de la luz estelar atraviesa las capas superiores de su atmósfera. Los distintos gases absorben longitudes de onda específicas, dejando una "huella dactilar" química en el espectro recibido por el telescopio.

### Componentes detectados:
1. **Vapor de agua (H₂O):** Presencia de humedad en capas medias y altas.
2. **Dióxido de carbono (CO₂) y Metano (CH₄):** Indicios de un ciclo biogeoquímico activo.
3. **Ausencia de atmósferas primordiales asfixiantes:** Lo que sugiere una superficie rocosa consolidada.

Este descubrimiento no garantiza la existencia de vida, pero demuestra la capacidad sin precedentes de la astronomía moderna para caracterizar mundos potencialmente habitables a decenas de años luz de distancia.
        `.trim(),
      },
      {
        title: 'SpaceX logra captura de Starship con la torre de lanzamiento',
        summary: 'Un hito en la historia de la ingeniería aeroespacial: la primera etapa Super Heavy regresó y fue capturada en el aire por los brazos mecánicos "Mechazilla".',
        date: new Date('2024-01-18'),
        readTimeMinutes: 3,
        slug: 'spacex-starship',
        author: 'Equipo Editorial JEO',
        tags: ['Ingeniería', 'SpaceX', 'Starship', 'Cohetería'],
        coverImageCaption: 'Brazos mecánicos atrapando el propulsor Super Heavy en Starbase, Texas.',
        content: `
# Hito de ingeniería: El propulsor Super Heavy es capturado en pleno vuelo

En una maniobra que parecía de ciencia ficción, la empresa aeroespacial SpaceX logró la **recuperación directa en plataforma** del propulsor Super Heavy de 71 metros de altura, atrapado en el aire por los brazos mecánicos apodados "palillos" (*chopsticks*) de la torre de lanzamiento en Starbase, Texas.

## ¿Por qué este hito cambia las reglas del juego?
Tradicionalmente, los cohetes utilizaban patas de aterrizaje pesadas sobre barcazas en el océano, lo que requería días de transporte y reacondicionamiento. Al eliminar las patas del cohete y atraparlo directamente en la torre de lanzamiento:
- Se reduce drásticamente el peso estructural del cohete, aumentando la carga útil.
- Se habilita la posibilidad de **reabastecimiento y relanzamiento en cuestión de horas**, reduciendo el costo de acceso al espacio en más de un 90%.

Este avance consolida el camino hacia lanzamientos rutinarios de cientos de toneladas hacia la órbita terrestre, la Luna y Marte.
        `.trim(),
      },
    ],
  });

  // ── Gallery Collections & Images ──
  await prisma.galleryImage.deleteMany();
  await prisma.galleryCollection.deleteMany();

  const artemisCollection = await prisma.galleryCollection.create({
    data: {
      id: 'artemis-ii-collection',
      title: 'Sobrevuelo lunar de Artemis II',
      description: 'Colección de fotografías en alta resolución capturadas durante los ensayos ópticos y trayectorias del programa lunar.',
      rotationFrequency: 'semanal',
    },
  });

  await prisma.galleryImage.createMany({
    data: [
      {
        alt: 'Salida de la Tierra sobre el horizonte lunar',
        caption: 'La Tierra vista como una canica azul sobre el desolado limbo de la Luna.',
        featured: true,
        order: 1,
        collectionId: artemisCollection.id,
      },
      {
        alt: 'Cráteres del hemisferio oculto de la Luna',
        caption: 'Topografía rugosa del lado no visible desde la Tierra capturada con luz rasante.',
        featured: false,
        order: 2,
        collectionId: artemisCollection.id,
      },
      {
        alt: 'Cápsula Orion frente a las estrellas',
        caption: 'Vista exterior de los paneles solares y el módulo de servicio de la nave espacial.',
        featured: false,
        order: 3,
        collectionId: artemisCollection.id,
      },
      {
        alt: 'Desierto de basalto en Mare Tranquillitatis',
        caption: 'Llanuras volcánicas oscuras donde alunizó el Apolo 11 en 1969.',
        featured: false,
        order: 4,
        collectionId: artemisCollection.id,
      },
      {
        alt: 'Polo Sur lunar y sombras eternas',
        caption: 'Cráteres de impacto con depósitos de hielo atrapados en oscuridad perpetua.',
        featured: false,
        order: 5,
        collectionId: artemisCollection.id,
      },
      {
        alt: 'Reingreso atmosférico a alta velocidad',
        caption: 'Plasma brillante generado por la fricción del escudo térmico en la alta atmósfera.',
        featured: false,
        order: 6,
        collectionId: artemisCollection.id,
      },
    ],
  });

  console.log('✅ Seed completed successfully with full rich data!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
