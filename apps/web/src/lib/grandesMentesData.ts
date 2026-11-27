type Areas_implicito =
  | "astronomía" // astronomía y radioastronomía
  | "aeroespacial" // ing. aeroespacial y astronáutica
  | "astronautas" // astronautas
  | "tecnología"; // ciencias de la computación

type Areas =
  | "astronomía"
  | "astronáutica"
  | "ingeniería aeroespacial"
  | "radioastronomía"
  | "ciencias de la computación"
  | "astronautas";

type Siglo = "XV" | "XVI" | "XVII" | "XVIII" | "XIX" | "XX" | "XXI";

type Extension = "jpg" | "jpeg" | "png" | "webp";

export interface Mente {
  name: string;
  subtitle: string;
  bio: string;
  area: Areas_implicito;
  area_real: Areas;
  siglo: Siglo;
  extension: Extension;
}

// grandes mentes, nombres y biografías hasta que información pida más detalle o haya cambios

export const MENTES_DATA: Mente[] = [
  // --------------------------------------------
  // --------- AREA: ASTRONOMÍA -----------------
  // --------------------------------------------

  {
    name: "NICOLÁS COPÉRNICO",
    subtitle:
      "(Frombork, 19 de febrero de 1473 - Frombork, 24 de mayo de 1543).",
    bio: "Fue un astrónomo, matemático, jurista, médico y clérigo polaco, reconocido universalmente por formular la teoría heliocéntrica del sistema solar, el modelo astronómico que sitúa al Sol en el centro del sistema, con la Tierra y los demás planetas orbitando a su alrededor. \nRenacentista polifacético, dedicó gran parte de su vida al estudio de los cielos y a la administración eclesiástica. Su obra cumbre, De revolutionibus orbium coelestium (Sobre las revoluciones de las orbes celestes, 1543), revolucionó la historia de la ciencia al postular este nuevo paradigma, desplazando al modelo geocéntrico tradicional —la antigua creencia de que la Tierra era el centro inmóvil del universo, con todos los astros girando a su alrededor—. Su contribución es considerada el punto de partida de la astronomía moderna y un pilar fundamental de la revolución científica que dio inicio en 1543.",
    area: "astronomía",
    area_real: "astronomía",
    siglo: "XV",
    extension: "jpg",
  },
  {
    name: "GALILEO GALILEI",
    subtitle:
      "(Pisa, 15 de febrero de 1564 - Arcetri, Italia, 8 de enero de 1642).",
    bio: "Fue un astrónomo, ingeniero, matemático, filósofo y físico italiano estrechamente relacionado con la revolución científica. Eminente hombre del Renacimiento, mostró interés por diversas ciencias y artes como la música, la literatura y la pintura. Sus logros incluyen la mejora del telescopio como instrumento de observación, trascendentales observaciones astronómicas —como los cráteres de la Luna, las lunas de Júpiter y las fases de Venus—, la formulación de la primera ley del movimiento —el principio de inercia, por el cual los objetos tienden a mantener su estado de reposo o movimiento a menos que una fuerza actúe sobre ellos— y un apoyo determinante a la «Revolución de Copérnico», la cual se apoyaba en la teoría heliocéntrica que demostró que la Tierra y los planetas giran alrededor del Sol y no al revés. Además, ha sido considerado como el «padre de la astronomía moderna, de la física moderna y de la ciencia moderna».",
    area: "astronomía",
    area_real: "astronomía",
    siglo: "XVI",
    extension: "jpg",
  },

  {
    name: "JOHANNES KEPLER",
    subtitle:
      "(Weil der Stadt, 27 de diciembre de 1571 - Regensburg, 15 de noviembre de 1630).",
    bio: "Fue un astrónomo, matemático y astrólogo alemán, reconocido fundamentalmente por sus leyes sobre el movimiento de los planetas en sus órbitas alrededor del Sol. Figura clave de la revolución científica, combinó el misticismo astronómico —la creencia de que el universo guardaba un orden geométrico y espiritual de origen divino— con un rigor matemático excepcional. Sus rigurosos cálculos matemáticos sobre las observaciones de Tycho Brahe —un célebre astrónomo danés del cual Kepler fue ayudante, que recopiló los datos de posición de los astros más exactos— permitieron formular sus famosas tres leyes planetarias: la primera sobre órbitas elípticas, la segunda que plantea la igualdad de áreas barridas en tiempos iguales y la tercera que expone la relación matemática entre distancias y periodos orbitales. Esto demolió el dogma de las órbitas circulares perfectas y estableció los cimientos sobre los que posteriormente Isaac Newton construiría su teoría de la gravitación universal.",
    area: "astronomía",
    area_real: "astronomía",
    siglo: "XVI",
    extension: "jpg",
  },

  {
    name: "EDWIN HUBBLE",
    subtitle:
      "(Marshfield, 20 de noviembre de 1889 - San Marino, 28 de septiembre de 1953).",
    bio: "Fue un astrónomo estadounidense considerado uno de los científicos más importantes del siglo XX y padre de la cosmología observacional. Formado inicialmente en derecho antes de dedicarse por completo a la astronomía, trabajó en el Observatorio Mount Wilson, ubicado en el condado de Los Ángeles, California. Sus revolucionarias observaciones demostraron que las nebulosas espirales eran galaxias independientes ubicadas más allá de la Vía Láctea, y descubrió que el universo se está expandiendo de manera proporcional a la distancia, formulando una ley conocida como Ley de Hubble. Su legado transformó radicalmente la comprensión humana del cosmos y dio nombre al Telescopio Espacial Hubble (HST), un observatorio desarrollado conjuntamente por la NASA y la Agencia Espacial Europea (ESA) que se encuentra operativo desde el 24 de abril de 1990.",
    area: "astronomía",
    area_real: "astronomía",
    siglo: "XIX",
    extension: "jpg",
  },

  // AGREGADOS 31/10/2026
  {
    name: "NANCY ROMAN",
    subtitle:
      "(Nashville, 16 de mayo de 1925 - Darnestown, 25 de diciembre de 2018).",
    bio: "Fue una destacada astrónoma estadounidense, ampliamente reconocida como la «Madre del Telescopio Espacial Hubble» por su rol fundamental en la planificación y desarrollo de observatorios espaciales. Con un doctorado en astronomía, se convirtió en la primera mujer en ocupar un cargo directivo en la NASA, al asumir la jefatura de astronomía en la División de Astronomía en la sede central de la agencia. Desde esa posición estratégica, diseñó y lideró el programa científico que transformó la idea teórica de observar el cosmos desde fuera de la atmósfera terrestre en una realidad, y unió los esfuerzos de la comunidad de ingenieros y astrónomos para hacer posible el lanzamiento del Telescopio Espacial Hubble que sentó las bases de la astrofísica espacial moderna en 1990.",
    area: "astronomía",
    area_real: "astronomía",
    siglo: "XX",
    extension: "jpg",
  },

  // --------------------------------------------
  // ----------- AREA REAL: RADIOASTRONOMÍA  ---------
  // --------------------------------------------

  {
    name: "JILL TARTER",
    subtitle: "(Nueva York, 16 de enero de 1944 - presente).",
    bio: "Es una destacada astrónoma y astrofísica estadounidense, reconocida internacionalmente como una de las pioneras y principales impulsoras de la radioastronomía moderna aplicada a la búsqueda de señales y tecnofirmas —indicadores tecnológicos de vida inteligente, como emisiones de radio artificiales— en el espacio profundo. Con una sólida formación en física y astronomía, ha dedicado su carrera científica a analizar el firmamento en busca de emisiones de radio procedentes del cosmos utilizando los más grandes radiotelescopios del mundo. Como directora del Centro de Investigación SETI y cofundadora del SETI Institute, lideró el proyecto Phoenix —el programa más exhaustivo y sensible de búsqueda sistemática de señales de radio extraterrestres— y transformó la exploración radioastronómica sistemática en una disciplina rigurosa de la ciencia espacial moderna, consolidando su contribución fundamental para el estudio del universo y la búsqueda de vida más allá de la Tierra.",
    area: "astronomía",
    area_real: "radioastronomía",
    siglo: "XX",
    extension: "jpg",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "JOCELYN BELL BURNELL",
    subtitle: "(Belfast, 15 de julio de 1943 - presente).",
    bio: "Es una astrofísica norirlandesa que descubrió la primera señal de radio de un púlsar —un remanente estelar ultradenso que emite pulsos regulares de radiación electromagnética— mientras era estudiante de posgrado. Construyendo minuciosamente un radiotelescopio —una antena parabólica gigante diseñada para captar ondas de radio procedentes del espacio— durante dos años junto a su director de tesis Anthony Hewish, detectó en 1967 unas anomalías en los registros que resultaron ser estrellas de neutrones altamente magnetizadas y de rápida rotación. Aunque el Premio Nobel de Física por este monumental hallazgo fue otorgado exclusivamente a Hewish y Martin Ryle, su descubrimiento revolucionó la astrofísica moderna, y hoy es una respetada líder científica y académica internacional.",
    area: "astronomía",
    area_real: "radioastronomía",
    siglo: "XX",
    extension: "jpeg",
  },

  // --------------------------------------------
  // --------- AREA: ASTRONÁUTICA ---------------
  // --------------------------------------------

  {
    name: "KONSTANTIN TSIOLKOVSKY",
    subtitle:
      "(Ryazan, 17 de septiembre de 1857 - Kaluga, 20 de septiembre de 1935).",
    bio: "Fue un científico y maestro ruso, considerado el padre teórico de la astronáutica y los vuelos espaciales tripulados. Perdió la audición en su juventud debido a la escarlatina —una infección bacteriana severa—, lo que le llevó a educarse de forma autodidacta en ciencias y matemáticas. Sus investigaciones visionarias sentaron las bases de la cohetería moderna al formular la ecuación del cohete que lleva su nombre, proponer el uso de propulsores de combustible líquido y diseñar estaciones espaciales habitables y esclusas para caminatas extravehiculares. Es recordado universalmente como el gran pionero conceptual que abrió las puertas de la humanidad hacia el cosmos.",
    area: "aeroespacial",
    area_real: "astronáutica",
    siglo: "XIX",
    extension: "jpeg",
  },
  {
    name: "ROBERT H. GODDARD",
    subtitle:
      "(Worcester, 5 de octubre de 1882 - Baltimore, 10 de agosto de 1945).",
    bio: "Fue un ingeniero, profesor y físico estadounidense, reconocido pionero de la cohetería moderna y del desarrollo de la propulsión espacial. Fascinado desde su juventud por la ciencia ficción y la física, dedicó su vida académica al diseño y la experimentación con motores de cohetes. El 16 de marzo de 1926 logró lanzar con éxito el primer cohete del mundo propulsado por combustible líquido, un hito histórico comparable a los inicios de la aviación. Aunque en su época fue frecuentemente ridiculizado por la prensa, hoy es recordado universalmente como uno de los padres fundadores de la era espacial, y el visionario que demostró que los cohetes podían volar en el vacío del espacio.",
    area: "aeroespacial",
    area_real: "astronáutica",
    siglo: "XIX",
    extension: "jpg",
  },
  {
    name: "HERMANN OBERTH",
    subtitle:
      "(Sibiu, 25 de junio de 1894 - Núremberg, 28 de diciembre de 1989).",
    bio: "Fue un físico e ingeniero austrohúngaro, considerado uno de los padres fundadores de la astronáutica y la cohetería moderna junto con Tsiolkovsky y Goddard. Inspirado profundamente por las obras de Julio Verne —novelas visionarias de viajes espaciales y aventuras tecnológicas—, desarrolló de forma independiente las matemáticas de los vuelos espaciales y la teoría de los cohetes multietapa en su obra seminal Die Rakete zu den Planetenräumen (El cohete hacia el espacio interplanetario, 1923). Sus investigaciones no solo sentaron las bases teóricas para el diseño de cohetes, sino que también sirvieron de mentor y guía para toda una generación de ingenieros aeroespaciales en el siglo XX, abriendo el camino definitivo hacia la exploración del sistema solar.",
    area: "aeroespacial",
    area_real: "astronáutica",
    siglo: "XIX",
    extension: "jpg",
  },
  {
    name: "SERGUÉI KOROLIOV",
    subtitle: "(Zhytomyr, 12 de enero de 1907 - Moscú, 14 de enero de 1966).",
    bio: "Fue un ingeniero ucraniano y soviético, reconocido como diseñador de cohetes y arquitecto principal del programa espacial soviético durante la carrera espacial en el siglo XX. A pesar de las duras penurias sufridas en el Gulag —la red soviética de campos de trabajo forzado bajo la brutal represión política de Iósif Stalin—, supo dirigir de forma estratégica los mayores hitos de la astronáutica mundial: el lanzamiento del primer satélite artificial de la historia (el Sputnik 1) y la misión que llevó al primer ser humano al espacio (Yuri Gagarin). Mantenido en el anonimato bajo el título oficial de «Diseñor Jefe» hasta su fallecimiento, su legado cimentó de forma decisiva la era de la exploración espacial tripulada.",
    area: "aeroespacial",
    area_real: "astronáutica",
    siglo: "XX",
    extension: "jpg",
  },

  // --------------------------------------------
  // --------- AREA: INGENIERÍA AEROESPACIAL ----
  // --------------------------------------------

  {
    name: "WERNHER VON BRAUN",
    subtitle:
      "(Wyrzysk, 23 de marzo de 1912 - Washington, 16 de junio de 1977).",
    bio: "(Wyrzysk, 23 de marzo de 1912 - Washington, 16 de junio de 1977). Fue un ingeniero aeroespacial y arquitecto de cohetes germano-estadounidenses, es considerado una de las figuras dominantes en la tecnología de cohetes y la exploración espacial del siglo XX. Apasionado desde joven por la astronáutica, en primera instancia, lideró el desarrollo del misil V-2 en Alemania durante la Segunda Guerra Mundial y, posteriormente, emigró a Estados Unidos, donde se convirtió en el director del Centro de Vuelo Espacial Marshall de la NASA. Su genialidad técnica culminó en el diseño y construcción del imponente cohete Saturno V, el vehículo que hizo posible el programa Apolo y llevó a la humanidad a pisar la Luna.",
    area: "aeroespacial",
    area_real: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "VALENTIN GLUSHKÓ",
    subtitle: "(Odesa, 2 de septiembre de 1908 - Moscú, 10 de enero de 1989).",
    bio: "Fue un ingeniero soviético y uno de los principales diseñadores de motores cohete del programa espacial de la URSS. Pionero en el desarrollo de la tecnología de propergoles líquidos —combustibles y oxidantes líquidos de alta energía—, fundó la oficina de diseño OKB-456 donde creó algunos de los motores más potentes y confiables de la historia aeroespacial, como el RD-107 y el colosal RD-170. Su trabajo científico y su rivalidad técnica con Serguéi Koroliov impulsaron el desarrollo de los vectores balísticos y espaciales soviéticos que marcaron la historia de la cohetería mundial.",
    area: "aeroespacial",
    area_real: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "MAXIME FAGET",
    subtitle:
      "(Dangstgr, 26 de agosto de 1921 - Houston, 9 de octubre de 2004).",
    bio: "Fue un ingeniero aeroespacial estadounidense y diseñador principal de naves espaciales tripuladas en los inicios de la NASA. Veterano de la Marina de los Estados Unidos y graduado en ingeniería mecánica, luego de incorporarse al NACA fue una de las mentes fundadoras del Grupo Task Force del proyecto Mercury. Faget concibió el diseño aerodinámico en forma de cápsula con escudo térmico ablativo —diseñado para desgastarse de forma controlada disipando el calor extremo— que permitió la supervivencia de los astronautas durante la reentrada atmosférica, además de desempeñar un papel fundamental en el diseño del transbordador espacial y los trajes presurizados iniciales.",
    area: "aeroespacial",
    area_real: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpeg",
  },

  {
    name: "HERMANN NOORDUNG (POTOČNIK)",
    subtitle: "(Pula, 22 de diciembre de 1892 - Viena, 27 de agosto de 1929).",
    bio: "Fue un ingeniero especialista en cohetes e inventor austrohúngaro y esloveno, considerado uno de los pioneros de la arquitectura de estaciones espaciales orbitales. Oficial del ejército e ingeniero técnico especializado en construcciones, dedicó sus últimos años a idear la vida y la tecnología en el espacio exterior. Su obra seminal Das Problem der Befahrung des Weltraums (El problema del viaje espacial, 1928) incluyó el diseño pionero de una estación espacial habitable con forma de rueda giratoria para generar gravedad artificial, sentando las bases conceptuales de la habitabilidad orbital a largo plazo.",
    area: "aeroespacial",
    area_real: "ingeniería aeroespacial",
    siglo: "XIX",
    extension: "jpeg",
  },

  {
    name: "TOM MUELLER",
    subtitle: "(St. Maries, Idaho, 7 de julio de 1961 - presente).",
    bio: "Es un ingeniero de cohetes estadounidense y experto en sistemas de propulsión, reconocido mundialmente por ser uno de los cofundadores de la empresa espacial privada estadounidense SpaceX. Con una sólida formación en ingeniería mecánica en el diseño de motores de alta eficiencia, desarrolló propulsores de combustible líquido de manera independiente antes de unirse a la compañía de Elon Musk en 2002. Como vicepresidente de propulsión en SpaceX, lideró el diseño conceptual y la ingeniería de los motores Merlin, Kestrel, Draco y SuperDraco: artefactos fundamentales que propulsaron los cohetes Falcon 1, Falcon 9, Falcon Heavy y las naves Dragon hacia una nueva era de la exploración espacial comercial.",
    area: "aeroespacial",
    area_real: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "MARY JACKSON",
    subtitle: "(Hampton, 9 de abril de 1921 - Hampton, 11 de febrero de 2005).",
    bio: "Fue una matemática e ingeniera aeroespacial estadounidense que rompió barreras estructurales al convertirse en la primera mujer de color en alcanzar el rango de ingeniera en la NASA. Graduada en matemáticas y ciencias físicas. Comenzó su trayectoria en el grupo de cálculo computacional de la NACA antes de especializarse en Ingeniería Aeronáutica. Su trabajo técnico analizando datos experimentales en túneles de viento supersónicos permitió comprender con precisión la aerodinámica de los aviones y vehículos espaciales de prueba. Así, contribuyó a optimizar el diseño estructural de la aviación avanzada y abrió camino a la integración técnica de las mujeres en las ramas más exigentes de la ingeniería aeroespacial.",
    area: "aeroespacial",
    area_real: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "YVONNE BRILL",
    subtitle:
      "(Winnipeg, 30 de diciembre de 1924 - Princeton, 27 de marzo de 2013).",
    bio: "Fue una destacada ingeniera aeroespacial e ingeniera química canadiense-estadounidense, líder e inventora de tecnologías fundamentales para la propulsión de cohetes espaciales y satélites en órbita. Con una formación rigurosa en química y matemáticas, desarrolló gran parte de su carrera técnica en la industria aeroespacial avanzada. Su mayor hito técnico fue la invención del propulsor de hidrazina por electrotérmica (resistojet) —un revolucionario sistema de propulsión espacial que permite mantener a los satélites de observación y telecomunicaciones orientados con precisión durante décadas, ahorrando grandes cantidades de combustible—, consolidando así una contribución fundamental al campo de la ingeniería de vehículos espaciales.",
    area: "aeroespacial",
    area_real: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  // --------------------------------------------
  // ----- AREA: TECNOLOGÍA -----
  // --------------------------------------------

  // --------------------------------------------
  // ----- AREA REAL: CIENCIAS DE LA COMPUTACIÓN -----
  // --------------------------------------------

  {
    name: "ADA LOVELACE",
    subtitle:
      "(Londres, 10 de diciembre de 1815 - Londres, 27 de noviembre de 1852).",
    bio: "Fue una matemática y escritora británica, célebre principalmente por su trabajo en la máquina analítica de Charles Babbage: una pionera computadora mecánica de engranajes y piezas metálicas. Hija del poeta Lord Byron, recibió una rigurosa educación matemática impulsada por su madre. Al traducir y anotar las memorias del matemático Luigi Menabrea sobre el invento de Babbage, Lovelace añadió un conjunto de notas que incluían lo que se reconoce hoy como el primer algoritmo diseñado para ser procesado por una máquina, anticipando con visión pionera el potencial de la informática más allá del simple cálculo numérico.",
    area: "tecnología",
    area_real: "ciencias de la computación",
    siglo: "XIX",
    extension: "jpg",
  },

  {
    name: "MARGARET HAMILTON",
    subtitle:
      "(Paoli, Indiana, 17 de agosto de 1936 - Cambridge, Massachusetts, Estados Unidos, 30 de septiembre de 2026).",
    bio: "Fue una científica informática, matemática e ingeniera de sistemas estadounidense, célebre por liderar el desarrollo del software de vuelo para el programa espacial Apolo de la NASA. Licenciada en matemáticas, se incorporó al MIT Instrumentation Laboratory donde acuñó el término «ingeniería de software» para legitimar una disciplina emergente en una época en la que apenas existía formación académica al respecto. Su dirección y diseño riguroso del código informático instalado a bordo de las naves Apolo —famoso por su capacidad de recuperación ante sobrecargas de datos durante el histórico alunizaje del Apolo 11— sentaron las bases metodológicas de la computación moderna y los sistemas tolerantes a fallos.",
    area: "tecnología",
    area_real: "ciencias de la computación",
    siglo: "XX",
    extension: "png",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "KATHERINE JOHNSON",
    subtitle:
      "(White Sulphur Springs, Virginia Occidental, 26 de agosto de 1918 - Newport News, Virginia, 24 de febrero de 2020).",
    bio: "Fue una matemática, física e informática teórica estadounidense cuyos cálculos de mecánica orbital —las trayectorias, velocidades y fuerzas gravitacionales en el espacio— fueron fundamentales para el éxito de los primeros vuelos espaciales tripulados de la NASA. Poseía un talento prodigioso para las matemáticas desde su juventud. Se incorporó a la NACA (predecesora de la NASA) como parte del grupo de matemáticas conocidas como las «computadoras humanas». Su rigor técnico y precisión absoluta permitieron calcular y verificar las trayectorias de los vuelos del programa Mercury —incluyendo la histórica órbita terrestre de John Glenn— y la sincronización orbital de las misiones del programa Apolo hacia la Luna. Así, su trabajo constituyó un aporte esencial para la ingeniería de trayectorias espaciales.",
    area: "tecnología",
    area_real: "ciencias de la computación",
    siglo: "XX",
    extension: "jpeg",
  },

  // --------------------------------------------
  // ----------- AREA: ASTRONAUTAS --------------
  // --------------------------------------------

  {
    name: "YURI GAGARIN",
    subtitle:
      "(Klushino, 9 de marzo de 1934 - Novosyolovo, 27 de marzo de 1968).",
    bio: "Fue un cosmonauta y piloto soviético, que se convirtió en el primer ser humano en viajar al espacio exterior y orbitar la Tierra. Hijo de carpintero y formado como piloto de la Fuerza Aérea Soviética, fue seleccionado entre cientos de candidatos de élite debido a su excepcional condición física, estabilidad emocional y dominio del vuelo. A bordo de la nave Vostok 1, el 12 de abril de 1961 completó una órbita alrededor de nuestro planeta en un vuelo histórico de 108 minutos que inauguró la era de los vuelos espaciales tripulados y lo catapultó a la categoría de leyenda universal.",
    area: "astronautas",
    area_real: "astronautas",
    siglo: "XX",
    extension: "jpeg",
  },

  {
    name: "NEIL ARMSTRONG",
    subtitle:
      "(Wapakoneta, 5 de agosto de 1930 - Cincinnati, 25 de agosto de 2012).",
    bio: "Fue un astronauta, piloto de pruebas e ingeniero aeronáutico estadounidense, célebre por ser el primer ser humano en pisar la superficie de la Luna. Veterano de la Guerra de Corea y piloto civil de pruebas en el avión cohete X-15, se unió a la NASA como parte del segundo grupo de astronautas. El 20 de julio de 1969, al mando de la misión Apolo 11, descendió del módulo lunar Eagle y pronunció una de las frases más icónicas de la historia de la humanidad, coronando el esfuerzo tecnológico y científico de toda una generación y abriendo simbólicamente las puertas del universo para la exploración humana: «Es un pequeño paso para el hombre, un gran salto para la humanidad».",
    area: "astronautas",
    area_real: "astronautas",
    siglo: "XX",
    extension: "jpeg",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "VALENTINA TERESHKOVA",
    subtitle: "(Maslennikovo, 1 de marzo de 1937 - presente).",
    bio: "Es una cosmonauta, ingeniera y política soviética, célebre por convertirse en la primera mujer en viajar al espacio exterior. Apasionada paracaidista aficionada de origen humilde, trabajó en una fábrica textil y fue seleccionada entre cientos de candidatas para integrar el cuerpo de cosmonautas soviético debido a su destreza en el paracaidismo. A bordo de la nave Vostok 6, el 16 de junio de 1963 completó 48 órbitas alrededor de la Tierra en un vuelo histórico de casi tres días. Su vuelo demostró la viabilidad de los viajes espaciales prolongados para las mujeres y, desde entonces, constituye un hito fundamental en la historia de la exploración espacial tripulada.",
    area: "astronautas",
    area_real: "astronautas",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "SALLY RIDE",
    subtitle:
      "(Los Ángeles, 26 de mayo de 1951 - La Jolla, 23 de julio de 2012)",
    bio: "Fue una física e ingeniera estadounidense, célebre por convertirse en la primera mujer estadounidense en viajar al espacio exterior. Obtuvo su doctorado en física por la Universidad de Stanford. Se incorporó a la NASA como miembro del cuerpo de astronautas y participó en las misiones espaciales como especialista de misión. El 18 de junio de 1983, despegó a bordo del transbordador espacial Challenger en la misión STS-7, operando el brazo robótico y desplegando satélites de comunicaciones. Tras su carrera de vuelo, dedicó su vida a la promoción de las disciplinas STEM (Ciencia, Tecnología, Ingeniería y Matemáticas) y a la divulgación científica espacial, inspirando a generaciones enteras en el estudio de las ciencias exactas.",
    area: "astronautas",
    area_real: "astronautas",
    siglo: "XX",
    extension: "jpg",
  },
];

// const mentes: Mente[] = [nicolas, galileo, johannes, edwin, konstantin, robert, hermann, serguei, wernher, valentin, maxime, hermann_noordung, aleksandr, tom, karl, jocelyn, ada, margaret, yuri, neil];
