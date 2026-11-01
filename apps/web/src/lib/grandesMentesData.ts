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
  area: Areas;
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
    bio: "Un astrónomo, matemático, jurista, médico y clérigo polaco, reconocido universalmente por formular la teoría heliocéntrica del sistema solar. Renacentista polifacético, dedicó gran parte de su vida al estudio de los cielos y la administración eclesiástica. Su obra cumbre, De revolutionibus orbium coelestium, revolucionó la historia de la ciencia al postular que la Tierra y los planetas giran alrededor del Sol, desplazando al modelo geocéntrico tradicional. Su contribución es considerada el punto de partida de la astronomía moderna y un pilar fundamental de la revolución científica.",
    area: "astronomía",
    siglo: "XV",
    extension: "jpg",
  },
  {
    name: "GALILEO GALILEI",
    subtitle:
      "(Pisa, 15 de febrero de 1564 - Arcetri, Italia, 8 de enero de 1642).",
    bio: "Un astrónomo, ingeniero, matemático y físico italiano, relacionado estrechamente con la revolución científica. Eminente hombre del Renacimiento, mostró interés por casi todas las ciencias y artes(música, literatura, pintura). Sus logros incluyen la mejora del telescopio, gran variedad de observaciones astronómicas, la primera ley del movimiento y un apoyo determinante a la «Revolución de Copérnico». Ha sido considerado como el «padre de la astronomía moderna», el «padre de la física moderna» y el «padre de la ciencia moderna».",
    area: "astronomía",
    siglo: "XVI",
    extension: "jpg",
  },
  {
    name: "JOHANNES KEPLER",
    subtitle:
      "(Weil der Stadt, 27 de diciembre de 1571 - Regensburg, 15 de noviembre de 1630).",
    bio: "Un astrónomo, matemático y astrólogo alemán, reconocido fundamentalmente por sus leyes sobre el movimiento de los planetas en su órbita alrededor del Sol. Figura clave de la revolución científica, combinó el misticismo astronómico con un rigor matemático excepcional. Sus rigurosos cálculos matemáticos sobre las observaciones de Tycho Brahe permitieron formular las tres leyes keplerianas, demoliendo el dogma de las órbitas circulares perfectas y estableciendo los cimientos sobre los que posteriormente Isaac Newton construiría su teoría de la gravitación universal.",
    area: "astronomía",
    siglo: "XVI",
    extension: "jpg",
  },
  {
    name: "EDWIN HUBBLE",
    subtitle:
      "(Marshfield, 20 de noviembre de 1889 - San Marino, 28 de septiembre de 1953).",
    bio: "Un astrónomo estadounidense, considerado uno de los más importantes del siglo XX y padre de la cosmología observacional. Formado inicialmente en derecho antes de dedicarse por completo a la astronomía, trabajó en el Observatorio Mount Wilson. Sus revolucionarias observaciones demostraron que las nebulosas espirales eran galaxias independientes más allá de la Vía Láctea y descubrió que el universo se está expandiendo de manera proporcional a la distancia (Ley de Hubble). Su legado transformó radicalmente la comprensión humana del cosmos y dio nombre al telescopio espacial más célebre de la historia.",
    area: "astronomía",
    siglo: "XIX",
    extension: "jpg",
  },

  // AGREGADOS 31/10/2026
  {
    name: "NANCY ROMAN",
    subtitle:
      "(Nashville, 16 de mayo de 1925 - Darnestown, 25 de diciembre de 2018).",
    bio: "Fue una destacada astrónoma estadounidense, ampliamente reconocida como la «Madre del Telescopio Espacial Hubble» por su rol fundamental en la planificación y desarrollo de observatorios espaciales. Con un doctorado en astronomía, se convirtió en la primera mujer en ocupar un puesto ejecutivo en la NASA al asumir la jefatura de astronomía en la sede central de la agencia. Desde esa posición estratégica, diseñó y lideró el programa científico que transformó la idea teórica de observar el cosmos desde fuera de la atmósfera terrestre en una realidad operativa, unificando a la comunidad de ingenieros y astrónomos para hacer posible el lanzamiento del telescopio espacial Hubble y sentando las bases de la astrofísica espacial moderna.",
    area: "astronomía",
    siglo: "XX",
    extension: "jpg",
  },

  // --------------------------------------------
  // --------- AREA: ASTRONÁUTICA ---------------
  // --------------------------------------------

  {
    name: "KONSTANTIN TSIOLKOVSKY",
    subtitle:
      "(Ryazan, 17 de septiembre de 1857 - Kaluga, 20 de septiembre de 1935).",
    bio: "Un científico y maestro ruso, considerado el padre teórico de la astronáutica y los vuelos espaciales tripulados. Sordo desde su juventud debido a la escarlatina, se educó de forma autodidacta en ciencias y matemáticas. Sus investigaciones visionarias sentaron las bases de la cohetería moderna al formular la ecuación del cohete que lleva su nombre, proponer el uso de propulsores de combustible líquido y diseñar estaciones espaciales habitables y esclusas para caminatas. Es recordado universalmente como el gran pionero conceptual que abrió las puertas de la humanidad hacia el cosmos.",
    area: "astronáutica",
    siglo: "XIX",
    extension: "jpeg",
  },
  {
    name: "ROBERT H. GODDARD",
    subtitle:
      "(Worcester, 5 de octubre de 1882 - Baltimore, 10 de agosto de 1945).",
    bio: "Un ingeniero, profesor y físico estadounidense, reconocido pionero de la cohetería moderna y del desarrollo de la propulsión espacial. Fascinado desde su juventud por la ciencia ficción y la física, dedicó su vida académica al diseño y experimentación con motores cohete. El 16 de marzo de 1926 logró lanzar con éxito el primer cohete del mundo propulsado por combustible líquido, un hito histórico comparable a los inicios de la aviación. Aunque en su época fue frecuentemente ridiculizado por la prensa, hoy es recordado universalmente como uno de los padres fundadores de la era espacial y el visionario que demostró que los cohetes podían volar en el vacío del espacio.",
    area: "astronáutica",
    siglo: "XIX",
    extension: "jpg",
  },
  {
    name: "HERMANN OBERTH",
    subtitle:
      "(Sibiu, 25 de junio de 1894 - Núremberg, 28 de diciembre de 1989).",
    bio: "Un físico e ingeniero austrohúnguro, considerado uno de los padres fundadores de la astronáutica y la cohetería moderna junto con Tsiolkovsky y Goddard. Inspirado profundamente por las obras de Julio Verne, desarrolló de forma independiente las matemáticas de los vuelos espaciales y la teoría de los cohetes multietapa en su obra seminal Die Rakete zu den Planetenräumen. Sus investigaciones no solo sentaron las bases teóricas para el diseño de cohetes avanzados, sino que también sirvieron de mentor y guía para toda una generación de ingenieros aeroespaciales en el siglo XX, abriendo el camino definitivo hacia la exploración del sistema solar.",
    area: "astronáutica",
    siglo: "XIX",
    extension: "jpg",
  },
  {
    name: "SERGUÉI KOROLIOV",
    subtitle: "(Zhytomyr, 12 de enero de 1907 - Moscú, 14 de enero de 1966).",
    bio: "Un ingeniero ucraniano y soviético, reconocido como el diseñador de cohetes y el arquitecto principal del programa espacial soviético durante la carrera espacial. A pesar de haber sobrevivido a los campos de trabajo del Gulag durante las purgas estalinistas, dirigió con genialidad técnica y estratégica los mayores hitos de la astronáutica mundial: el lanzamiento del primer satélite artificial de la historia (el Sputnik 1) y la misión que llevó al primer ser humano al espacio (Yuri Gagarin). Mantenido en el anonimato bajo el título oficial de «Diseñor Jefe» hasta su fallecimiento, su legado cimentó de forma decisiva la era de la exploración espacial tripulada.",
    area: "astronáutica",
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
    bio: "Un ingeniero aeroespacial y arquitecto de cohetes germano-estadounidense, considerado una de las figuras dominantes en la tecnología de cohetes y la exploración espacial del siglo XX. Apasionado desde joven por la astronáutica, lideró primero el desarrollo del misil V-2 en Alemania durante la Segunda Guerra Mundial y, posteriormente, emigró a Estados Unidos, donde se convirtió en el director del Centro de Vuelo Espacial Marshall de la NASA. Su genialidad técnica culminó en el diseño y construcción del imponente cohete Saturno V, el vehículo que hizo posible el programa Apolo y llevó a la humanidad a pisar la Luna.",
    area: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "VALENTIN GLUSHKÓ",
    subtitle: "(Odesa, 2 de septiembre de 1908 - Moscú, 10 de enero de 1989).",
    bio: "Un ingeniero soviético y uno de los principales diseñadores de motores cohete del programa espacial de la URSS. Pionero en el desarrollo de la tecnología de propergoles líquidos, fundó la oficina de diseño OKB-456 donde creó algunos de los motores más potentes y confiables de la historia aeroespacial, como el RD-107 y el colosal RD-170. Su trabajo científico y su rivalidad técnica con Serguéi Koroliov fueron motores fundamentales en el desarrollo de los vectores balísticos y espaciales soviéticos que marcaron la historia de la cohetería mundial.",
    area: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "MAXIME FAGET",
    subtitle:
      "(Dangstgr, 26 de agosto de 1921 - Houston, 9 de octubre de 2004).",
    bio: "Un ingeniero aeroespacial estadounidense y diseñador principal de naves espaciales tripuladas en los inicios de la NASA. Veterano de la Marina de los Estados Unidos y graduado en ingeniería mecánica, se unió al NACA y posteriormente fue una de las mentes fundadoras del Grupo Task Force del proyecto Mercury. Faget concibió el diseño aerodinámico en forma de cápsula con escudo térmico ablativo que permitió la supervivencia de los astronautas durante la reentrada atmosférica, además de desempeñar un papel fundamental en el diseño del transbordador espacial y los trajes presurizados iniciales.",
    area: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpeg",
  },

  {
    name: "HERMANN NOORDUNG (POTOČNIK)",
    subtitle: "(Pula, 22 de diciembre de 1892 - Viena, 27 de agosto de 1929).",
    bio: "Un ingeniero espacial e inventor austrohúngaro y esloveno, considerado uno de los pioneros de la arquitectura de estaciones espaciales orbitales. Oficial del ejército e ingeniero técnico especializado en construcciones, dedicó sus últimos años a idear la vida y la tecnología en el espacio exterior. Su obra seminal Das Problem der Befahrung des Weltraums (El problema del viaje espacial, 1928) incluyó el diseño pionero de una estación espacial habitable con forma de rueda giratoria para generar gravedad artificial, sentando las bases conceptuales de la habitabilidad orbital a largo plazo.",
    area: "ingeniería aeroespacial",
    siglo: "XIX",
    extension: "jpeg",
  },

  {
    name: "TOM MUELLER",
    subtitle: "(St. Maries, Idaho, 7 de julio de 1961 - presente).",
    bio: "Un ingeniero de cohetes estadounidense y experto en sistemas de propulsión, reconocido mundialmente por ser uno de los cofundadores de SpaceX. Con una sólida formación en ingeniería mecánica e ingenio técnico en el diseño de motores de alta eficiencia, desarrolló propulsores avanzados de combustible líquido de manera independiente antes de unirse a Elon Musk en 2002. Como vicepresidente de propulsión en SpaceX, lideró el diseño conceptual y la ingeniería de los motores Merlin, Kestrel, Draco y SuperDraco, artefactos fundamentales que propulsaron los cohetes Falcon 1, Falcon 9, Falcon Heavy y las naves Dragon hacia una nueva era de la exploración espacial comercial.",
    area: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "MARY JACKSON",
    subtitle: "(Hampton, 9 de abril de 1921 - Hampton, 11 de febrero de 2005).",
    bio: "Fue una matemática e ingeniera aeroespacial estadounidense que rompió barreras estructurales al convertirse en la primera mujer negra en alcanzar el rango de ingeniera en la NASA. Graduada en matemáticas y ciencias físicas., cComenzó su trayectoria en el grupo de cálculo computacional de la NACA antes de especializarse en ingeniería aeronáutica. Su trabajo técnico analizando datos experimentales en los túneles de viento supersónicos permitió comprender con precisión la aerodinámica de los aviones y vehículos espaciales de prueba., Así, contribuyó a optimizar el diseño estructural de la aviación avanzada y abrió camino a la integración profecional de las mujeres en las ramas más exigentes de la ingeniería aeroespacial.",
    area: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "YVONNE BRILL",
    subtitle:
      "(Winnipeg, 30 de diciembre de 1924 - Princeton, 27 de marzo de 2013).",
    bio: "Fue una destacada ingeniera aeroespacial y química coliderradora e inventora de tecnologías fundamentales para la propulsión de cohetes espaciales y satélites en órbita. Con una formación rigurosa en química y matemáticas, desarrolló gran parte de su carrera técnica en la industria aeroespacial avanzada. Su mayor hito técnico fue la invención del propulsor de hidrazina por electrotérmica (resistojet), un revolucionario sistema de propulsión espacial que permite mantener a los satélites de observación y telecomunicaciones orientados con precisión durante décadas ahorrando combustible masivo, consolidando una contribución técnica imborrable a la ingeniería de vehículos espaciales.",
    area: "ingeniería aeroespacial",
    siglo: "XX",
    extension: "jpg",
  },

  // --------------------------------------------
  // ----------- AREA: RADIOASTRONOMÍA  ---------
  // --------------------------------------------

  {
    name: "JILL TARTER",
    subtitle: "(Nueva York, 16 de enero de 1944 - presente).",
    bio: "Es una destacada astrónoma y astrofísica estadounidense, reconocida internacionalmente como una de las pioneras y principales impulsoras de la radioastronomía moderna aplicada a la búsqueda de señales y tecnofirmas en el espacio profundo. Con una sólida formación en física y astronomía, dedicó su carrera científica a analizar el firmamento en busca de emisiones de radio procedentes del cosmos utilizando los mayores radiotelescopios del mundo. Como directora del Centro de Investigación SETI y cofundadora del SETI Institute, lideró el proyecto Phoenix y transformó la exploración radioastronómica sistemática en una rama rigurosa de la ciencia espacial moderna, consolidando un legado fundamental para el estudio del universo y la búsqueda de vida más allá de la Tierra.",
    area: "radioastronomía",
    siglo: "XX",
    extension: "jpg",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "JOCELYN BELL BURNELL",
    subtitle: "(Belfast, 15 de julio de 1943 - presente).",
    bio: "Una astrofísica norirlandesa que descubrió la primera señal de radio de un púlsar mientras era estudiante de posgrado. Construyendo minuciosamente un radiotelescopio durante dos años junto a su director de tesis Anthony Hewish, detectó en 1967 unas anomalías en los registros que resultaron ser estrellas de neutrones altamente magnetizadas y de rápida rotación. Aunque el Premio Nobel de Física por este monumental hallazgo fue otorgado exclusivamente a Hewish y Martin Ryle, su descubrimiento revolucionó la astrofísica moderna, y hoy es una respetada líder científica y académica internacional.",
    area: "radioastronomía",
    siglo: "XX",
    extension: "jpeg",
  },

  // --------------------------------------------
  // ----- AREA: CIENCIAS DE LA COMPUTACIÓN -----
  // --------------------------------------------

  {
    name: "ADA LOVELACE",
    subtitle:
      "(Londres, 10 de diciembre de 1815 - Londres, 27 de noviembre de 1852).",
    bio: "Una matemática y escritora británica, célebre principalmente por su trabajo en la computadora mecánica de uso general de Charles Babbage, la máquina analítica. Hija del poeta Lord Byron, recibió una rigurosa educación matemática impulsada por su madre. Al traducir y anotar las memorias del matemático Luigi Menabrea sobre el invento de Babbage, Lovelace añadió un conjunto de notas que incluían lo que se reconoce hoy como el primer algoritmo diseñado para ser procesado por una máquina, anticipando con visión pionera el potencial de la informática más allá del simple cálculo numérico.",
    area: "ciencias de la computación",
    siglo: "XIX",
    extension: "jpg",
  },

  {
    name: "MARGARET HAMILTON",
    subtitle:
      "(Paoli, Indiana, 17 de agosto de 1936 - Cambridge, Massachusetts, Estados Unidos, 30 de septiembre de 2026).",
    bio: "Una científica informática, matemática e ingeniera de sistemas estadounidense, célebre por liderar el desarrollo del software de vuelo para el programa espacial Apolo. Licenciada en matemáticas, se incorporó al MIT Instrumentation Laboratory, donde acuñó el término «ingeniería de software» para legitimar una disciplina emergente en una época en la que apenas existía formación académica al respecto. Su dirección y diseño riguroso del código informático instalado a bordo de las naves Apolo —famoso por su capacidad de recuperación ante sobrecargas de datos durante el histórico alunizaje del Apolo 11— sentaron las bases metodológicas de la computación moderna y los sistemas tolerantes a fallos.",
    area: "ciencias de la computación",
    siglo: "XX",
    extension: "png",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "KATHERINE JOHNSON",
    subtitle:
      "(White Sulphur Springs, Virginia Occidental, 26 de agosto de 1918 - Newport News, Virginia, 24 de febrero de 2020).",
    bio: "Fue una matemática, física e informática teórica estadounidense cuyos cálculos de mecánica orbital fueron fundamentales para el éxito de los primeros vuelos espaciales tripulados de la NASA. Dotada de un talento prodigioso para las matemáticas desde su juventud, se incorporó a la NACA (predecesora de la NASA) como parte del grupo de matemáticas conocidas como las «computadoras humanas». Su rigor técnico y su precisión absoluta permitieron calcular y verificar las trayectorias de los vuelos del programa Mercury —incluyendo la histórica órbita terrestre de John Glenn— y la sincronización orbital de las misiones Apolo hacia la Luna, convirtiéndose en un pilar indispensable de la ingeniería de trayectorias espaciales.",
    area: "ciencias de la computación",
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
    bio: "Un cosmonauta y piloto soviético, convertido en el primer ser humano en viajar al espacio exterior y orbitar la Tierra. Hijo de carpintero y formado como piloto de la Fuerza Aérea Soviética, fue seleccionado entre cientos de candidatos de élite debido a su excepcional condición física, estabilidad emocional y pericia técnica. A bordo de la nave Vostok 1 el 12 de abril de 1961, completó una órbita alrededor de nuestro planeta en un vuelo histórico de 108 minutos que inauguró la era de los vuelos espaciales tripulados y lo catapultó a la categoría de leyenda universal.",
    area: "astronautas",
    siglo: "XX",
    extension: "jpeg",
  },

  {
    name: "NEIL ARMSTRONG",
    subtitle:
      "(Wapakoneta, 5 de agosto de 1930 - Cincinnati, 25 de agosto de 2012).",
    bio: "Un astronauta, piloto de pruebas e ingeniero aeronáutico estadounidense, célebre por ser el primer ser humano en pisar la superficie de la Luna. Veterano de la Guerra de Corea y piloto civil de pruebas en el avión cohete X-15, se unió a la NASA como parte del segundo grupo de astronautas. El 20 de julio de 1969, al mando de la misión Apolo 11, descendió del módulo lunar Eagle y pronunció una de las frases más icónicas de la historia de la humanidad, coronando el esfuerzo tecnológico y científico de toda una generación y abriendo simbólicamente las puertas del universo para la exploración humana: «Es un pequeño paso para el hombre, un gran salto para la humanidad».",
    area: "astronautas",
    siglo: "XX",
    extension: "jpeg",
  },

  // AGREGADOS EL 31-10-2026
  {
    name: "VALENTINA TERESHKOVA",
    subtitle: "(Maslennikovo, 1 de marzo de 1937 - presente).",
    bio: "Es una cosmonauta, ingeniera y política soviética, célebre por convertirse en la primera mujer en viajar al espacio exterior. Obrera textil de origen humilde y apasionada paracaidista aficionada, fue seleccionada entre cientos de candidatas para integrar el cuerpo de cosmonautas soviético debido a su destreza en el paracaidismo. A bordo de la nave Vostok 6 el 16 de junio de 1963, completó 48 órbitas alrededor de la Tierra en un vuelo histórico de casi tres días, demostrando la viabilidad de los viajes espaciales prolongados para las mujeres y consolidando un hito imborrable en la historia de la exploración tripulada.",
    area: "astronautas",
    siglo: "XX",
    extension: "jpg",
  },

  {
    name: "SALLY RIDE",
    subtitle:
      "(Los Ángeles, 26 de mayo de 1951 - La Jolla, 23 de julio de 2012)",
    bio: "Fue una física e ingeniera estadounidense, célebre por convertirse en la primera mujer norteamericana en viajar al espacio exterior. Con un doctorado en física por la Universidad de Stanford, se incorporó a la NASA y formó parte del equipo de ingenieros de apoyo como especialista de misión. El 18 de junio de 1983, despegó a bordo del transbordador espacial Challenger en la misión STS-7, operando el brazo robótico y desplegando satélites de comunicaciones. Tras su carrera de vuelo, dedicó su vida a la ingeniería educativa y a la divulgación científica espacial, inspirando a generaciones enteras en el estudio de las ciencias exactas.",
    area: "astronautas",
    siglo: "XX",
    extension: "jpg",
  },
];

// const mentes: Mente[] = [nicolas, galileo, johannes, edwin, konstantin, robert, hermann, serguei, wernher, valentin, maxime, hermann_noordung, aleksandr, tom, karl, jocelyn, ada, margaret, yuri, neil];
