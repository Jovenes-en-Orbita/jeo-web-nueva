import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌌 Seeding admin user...");

  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("JeoArgentina*2026", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@jovenesenorbita.com",
      passwordHash,
      name: "Director JEO",
      role: "SUPERADMIN",
    },
  });

  console.log(`👤 Main admin user seeded: ${adminUser.email}`);

  console.log("🛰️ Seeding news articles...");

  const guowangContent = `La red de conectividad china alcanzó este mes un nuevo hito mientras avanza hacia una constelación prevista de miles de satélites.

El 17 de septiembre de 2026, un cohete Long March 12 despegó desde el Puerto de Lanzamiento Espacial Comercial de Hainan, en Wenchang, transportando a la órbita terrestre baja nueve satélites de conectividad destinados a ampliar la constelación Guowang. Con este lanzamiento, el sistema superó los 200 satélites, alcanzando 204 unidades según el recuento de China in Space. El 23 de septiembre, seis días después, volvieron a enviarse nueve satélites a órbita, esta vez a bordo de un cohete Long March 8A, en el vigésimo sexto despliegue de la constelación.

La constelación Guowang, diseñada principalmente para ofrecer servicios de internet, es operada por China Satellite Network Group, una empresa estatal respaldada por el Gobierno chino. Aunque por ahora los servicios centrados en China constituyen la prioridad inmediata, la compañía planea ofrecer conectividad a nivel mundial, lo que convertiría a Guowang en uno de los principales proyectos destinados a competir con redes como Starlink, de SpaceX. Además, las declaraciones chinas sobre la constelación sugieren capacidades adicionales, como detección de radiofrecuencia, captura de imágenes de alta resolución, servicios de teledetección y conectividad de alto rendimiento y baja latencia.

Aunque la información disponible sobre las capacidades exactas de estos satélites es limitada, fuentes chinas han revelado que el programa Guowang puede transportar una variedad de cargas útiles, entre ellas sistemas de comunicación de banda ancha, comunicación láser, radar de apertura sintética y teledetección óptica. Estas configuraciones permitirían adaptar los satélites a diferentes usuarios y escenarios y ampliar sus aplicaciones más allá de la conectividad. En este contexto, la constelación podría ofrecer soporte técnico para numerosos campos, como operaciones marítimas y de aviación, seguridad de la información, navegación y posicionamiento e investigación meteorológica.

La constelación soberana china responde a varios objetivos de manera simultánea. Por un lado, busca proporcionar conectividad de banda ancha a regiones del territorio chino donde la infraestructura terrestre presenta mayores dificultades, como zonas montañosas, desérticas o marítimas. A su vez, una infraestructura de este tipo puede ofrecer capacidades de doble uso, es decir, aplicaciones tanto civiles como militares, al proporcionar una capa adicional de comunicaciones y detección. El desarrollo de Guowang también reduce la dependencia china de redes extranjeras de conectividad satelital y se integra en los objetivos de China de fortalecer su infraestructura espacial y su presencia internacional.

China planea continuar expandiendo rápidamente la constelación. Los objetivos de despliegue contemplan 900 nuevos satélites en 2027 y 3.600 por año a partir de 2028, con una meta cercana a los 13.000 satélites operativos durante la década de 2030. La presentación registrada ante la Unión Internacional de Telecomunicaciones (UIT) contempla dos grandes segmentos orbitales: 6.080 satélites entre 500 y 600 kilómetros de altura, y otros 6.912 a aproximadamente 1.145 kilómetros. De concretarse estos planes, Guowang pasaría de los poco más de 200 satélites actuales a una red de miles de unidades distribuidas en diferentes órbitas, transformando progresivamente la escala de la infraestructura espacial de conectividad de China.

## Bibliografía

- C., J. (23 de Septiembre de 2026). GuoWang Expands Again via Latest Wenchang Launch Mission [Long March 8A Y11]. Obtenido de China in Space: https://www.china-in-space.com/p/guowang-expands-again-via-latest
- C., J. (17 de Septiembre de 2026). GuoWang Surpasses 200 Satellites Following Long March 12 Mission [Long March 12 Y9]. Obtenido de China in Space: https://www.china-in-space.com/p/guowang-surpasses-200-satellites
- Chauhan, A. S. (16 de Julio de 2026). Guowang vs Qianfan: Inside China's Megaconstellation Answer to Starlink. Obtenido de SpaceOdysseyHub: https://spaceodysseyhub.com/articles/china-megaconstellations-guowang-qianfan
- Gillinger, G. (16 de Junio de 2025). Developing and testing China’s Guowang constellation. Obtenido de The Space Review: https://www.thespacereview.com/article/5004/1`;

  const sampleArticles = [
    {
      title:
        "La constelación satelital china Guowang supera los 200 satélites desplegados",
      slug: "la-constelacion-satelital-china-guowang-supera-los-200-satelites-desplegados",
      summary:
        "La red de conectividad china alcanzó un nuevo hito mientras avanza hacia una megaconstelación prevista de miles de satélites en órbita baja.",
      content: guowangContent,
      imageUrl: "/assets/guowang.webp",
      author: "Álvaro de Pedro",
      date: new Date("2026-09-23T12:00:00Z"),
      readTimeMinutes: 5,
      tags: ["Satélites", "Telecomunicaciones", "China", "Espacio"],
      coverImageCaption: "Despliegue orbital de la constelación Guowang",
    },
    {
      title:
        "Misión Artemis III: La humanidad prepara su regreso a la superficie lunar",
      slug: "mision-artemis-iii-regreso-a-la-luna",
      summary:
        "La NASA y sus aliados internacionales ultiman los preparativos para alunizar cerca del polo sur lunar con la primera tripulación de la nueva era.",
      content:
        "El programa Artemis representa la nueva era de exploración tripulada hacia la Luna y sienta las bases para las futuras misiones a Marte. Con nuevos trajes espaciales y sistemas de aterrizaje comerciales, Artemis III marcará un antes y un después en la historia espacial moderna.\n\nLa misión no solo explorará depósitos de hielo de agua en cráteres en sombra permanente, sino que probará tecnologías esenciales de soporte vital prolongado.",
      imageUrl: "/assets/artemis.svg",
      author: "Equipo JEO",
      date: new Date("2026-09-10T10:00:00Z"),
      readTimeMinutes: 4,
      tags: ["Artemis", "Luna", "NASA"],
      coverImageCaption:
        "Módulo de descenso y astronautas en el polo sur lunar",
    },
    {
      title:
        "Telescopio James Webb detecta biofirmas potenciales en un exoplaneta cercano",
      slug: "james-webb-detecta-biofirmas-potenciales-exoplaneta",
      summary:
        "Nuevos análisis espectroscópicos revelan compuestos atmosféricos prometedores en la zona habitable de un sistema estelar a 40 años luz.",
      content:
        "Mediante espectroscopía de transmisión en el infrarrojo, los astrónomos identificaron firmas compatibles con vapor de agua y compuestos de carbono en la atmósfera de un exoplaneta rocoso.\n\nAunque los resultados requieren confirmación adicional, abren una ventana sin precedentes al estudio de atmósferas habitables fuera del Sistema Solar.",
      imageUrl: "/assets/hero-cosmos.svg",
      author: "Divulgación JEO",
      date: new Date("2026-08-28T14:30:00Z"),
      readTimeMinutes: 6,
      tags: ["James Webb", "Astrobiología", "Exoplanetas"],
      coverImageCaption: "Impresión artística de la atmósfera del exoplaneta",
    },
  ];

  for (const art of sampleArticles) {
    await prisma.newsArticle.upsert({
      where: { slug: art.slug },
      update: art,
      create: art,
    });
  }

  console.log(`📰 Seeded ${sampleArticles.length} news articles successfully.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
