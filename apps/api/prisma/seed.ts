import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌌 Seeding JEO database...');

  // ── Stats ──
  await prisma.stat.createMany({
    data: [
      { value: '93 %', label: 'del universo aún no se comprende del todo', order: 1 },
      { value: '8', label: 'planetas en el sistema solar', order: 2 },
      { value: '88', label: 'constelaciones reconocidas oficialmente', order: 3 },
      { value: '+400', label: 'fotografías en Fragmentos de Memoria', order: 4 },
    ],
    skipDuplicates: true,
  });

  // ── Universe Tabs ──
  await prisma.universeTab.createMany({
    data: [
      { label: 'Origen', slug: 'origen', description: 'Origen del universo y el Big Bang', order: 1 },
      { label: 'Composición', slug: 'composicion', description: 'Energía oscura, materia oscura y materia bariónica', order: 2 },
      { label: 'Estructuras', slug: 'estructuras', description: 'Galaxias, cúmulos y supercúmulos', order: 3 },
      { label: 'La luz', slug: 'la-luz', description: 'El espectro electromagnético', order: 4 },
      { label: 'Ondas gravitacionales', slug: 'ondas-gravitacionales', description: 'Ondulaciones en el espacio-tiempo', order: 5 },
    ],
    skipDuplicates: true,
  });

  // ── Planets ──
  const planets = await Promise.all([
    prisma.planet.upsert({ where: { slug: 'mercurio' }, update: {}, create: { name: 'Mercurio', slug: 'mercurio', order: 1 } }),
    prisma.planet.upsert({ where: { slug: 'venus' }, update: {}, create: { name: 'Venus', slug: 'venus', order: 2 } }),
    prisma.planet.upsert({ where: { slug: 'tierra' }, update: {}, create: { name: 'Tierra', slug: 'tierra', order: 3 } }),
    prisma.planet.upsert({ where: { slug: 'marte' }, update: {}, create: { name: 'Marte', slug: 'marte', order: 4 } }),
    prisma.planet.upsert({ where: { slug: 'jupiter' }, update: {}, create: { name: 'Júpiter', slug: 'jupiter', order: 5 } }),
    prisma.planet.upsert({ where: { slug: 'saturno' }, update: {}, create: { name: 'Saturno', slug: 'saturno', order: 6 } }),
    prisma.planet.upsert({ where: { slug: 'urano' }, update: {}, create: { name: 'Urano', slug: 'urano', order: 7 } }),
    prisma.planet.upsert({ where: { slug: 'neptuno' }, update: {}, create: { name: 'Neptuno', slug: 'neptuno', order: 8 } }),
  ]);

  // ── Moons (5 largest) ──
  const jupiter = planets.find(p => p.slug === 'jupiter')!;
  const saturno = planets.find(p => p.slug === 'saturno')!;

  await prisma.moon.createMany({
    data: [
      { name: 'Ganímedes', slug: 'ganimedes', planetId: jupiter.id, order: 1, description: 'La luna más grande del sistema solar' },
      { name: 'Titán', slug: 'titan', planetId: saturno.id, order: 2, description: 'La única luna con atmósfera densa' },
      { name: 'Calisto', slug: 'calisto', planetId: jupiter.id, order: 3, description: 'La luna con más cráteres' },
      { name: 'Ío', slug: 'io', planetId: jupiter.id, order: 4, description: 'El cuerpo con más actividad volcánica' },
      { name: 'Europa', slug: 'europa', planetId: jupiter.id, order: 5, description: 'Posible océano bajo su superficie helada' },
    ],
    skipDuplicates: true,
  });

  // ── News Articles ──
  await prisma.newsArticle.createMany({
    data: [
      {
        title: 'Artemis III: El regreso a la Luna se acerca',
        summary: 'La NASA confirma avances clave en la misión que llevará astronautas a la superficie lunar por primera vez en más de 50 años.',
        date: new Date('2024-03-05'),
        readTimeMinutes: 6,
        slug: 'artemis-iii-regreso-luna',
      },
      {
        title: 'Descubren exoplaneta con posible atmósfera habitable',
        summary: 'El telescopio James Webb detectó señales de vapor de agua en la atmósfera de un exoplaneta en la zona habitable de su estrella.',
        date: new Date('2024-02-02'),
        readTimeMinutes: 4,
        slug: 'exoplaneta-atmosfera-habitable',
      },
      {
        title: 'SpaceX logra captura de Starship con la torre de lanzamiento',
        summary: 'Un hito histórico en la historia de la ingeniería aeroespacial: la Super Heavy fue capturada en su primer intento.',
        date: new Date('2024-01-18'),
        readTimeMinutes: 3,
        slug: 'spacex-captura-starship',
      },
    ],
    skipDuplicates: true,
  });

  // ── Gallery Collection ──
  const collection = await prisma.galleryCollection.upsert({
    where: { id: 'artemis-ii-collection' },
    update: {},
    create: {
      id: 'artemis-ii-collection',
      title: 'Sobrevuelo lunar de Artemis II',
      description: 'Galería de fotos astronómicas',
      rotationFrequency: 'semanal',
    },
  });

  await prisma.galleryImage.createMany({
    data: Array.from({ length: 6 }, (_, i) => ({
      alt: `Foto astronómica ${i + 1}`,
      featured: i === 0,
      order: i + 1,
      collectionId: collection.id,
    })),
    skipDuplicates: true,
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
