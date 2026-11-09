import {
  WorldId,
  WorldInfo,
  Dreamie,
  GardenPlot,
  FurnitureItem,
  OutfitConfig,
  Quest,
  NPC,
  DiaryEntry,
  SeedType,
  RoomCustomization,
  JobInfo,
  JobType,
  Achievement,
  MusicTrack,
  Letter,
  DiaryPhoto,
  MinigameId,
} from '../types/game';
import { soundEngine } from './audio';

const STORAGE_KEY = 'dreamyland_save_v1';

export const INITIAL_WORLDS: WorldInfo[] = [
  {
    id: 'strawberry_village',
    name: 'Strawberry Village',
    emoji: '🍓',
    subtitle: 'El valle de las fresas dulces',
    description: 'Colinas ondulantes de color pastel, fresas gigantes, un molino mágico y tu casita acogedora.',
    skyColor: '#ffe4e6',
    fogColor: '#fecdd3',
    unlocked: true,
  },
  {
    id: 'cloudy_kingdom',
    name: 'Cloudy Kingdom',
    emoji: '☁️',
    subtitle: 'El reino de las nubes flotantes',
    description: 'Islas esponjosas suspendidas en el cielo, arcoíris pastel, trampolines estelares y cometas durmientes.',
    skyColor: '#e0f2fe',
    fogColor: '#bae6fd',
    unlocked: false,
    unlockRequirement: 'Alcanza 60 Esencia de Sueño',
  },
  {
    id: 'sakura_forest',
    name: 'Pink Sakura Forest',
    emoji: '🌸',
    subtitle: 'El bosque sagrado de cerezos',
    description: 'Lluvia constante de pétalos rosados, faroles de papel flotantes, puentes bermellón y espíritus amables.',
    skyColor: '#fce7f3',
    fogColor: '#fbcfe8',
    unlocked: false,
    unlockRequirement: 'Alcanza 130 Esencia de Sueño',
  },
  {
    id: 'candy_ocean',
    name: 'Candy Ocean',
    emoji: '🍬',
    subtitle: 'La costa de malvaviscos',
    description: 'Olas de leche de fresa, rocas de caramelo masticable, conchas de azúcar nacaradas y paletas gigantes.',
    skyColor: '#fef08a',
    fogColor: '#fed7aa',
    unlocked: false,
    unlockRequirement: 'Alcanza 220 Esencia de Sueño',
  },
  {
    id: 'forgotten_dreamland',
    name: 'Forgotten Dreamland',
    emoji: '🗝️',
    subtitle: 'Las ruinas del crepúsculo pastel',
    description: 'Torres antiguas en tonos vintage, relojes de arena flotantes y la entrada secreta a The Forgotten Room.',
    skyColor: '#e9d5ff',
    fogColor: '#d8b4fe',
    unlocked: false,
    unlockRequirement: 'Alcanza 320 Esencia de Sueño',
  },
  {
    id: 'cottage_interior',
    name: 'Tu Casita Acogedora',
    emoji: '🌸',
    subtitle: 'Tu propio rincón de ensueño',
    description: 'Personaliza los muebles, alfombras, lámparas y peluches a tu gusto. ¡Invita a tus Dreamies a descansar!',
    skyColor: '#fff1f2',
    fogColor: '#ffe4e6',
    unlocked: true,
  },
  {
    id: 'the_forgotten_room',
    name: 'The Forgotten Room',
    emoji: '🗝️',
    subtitle: 'El cuarto secreto de la nostalgia',
    description: 'Un lugar suspendido en el tiempo con colores pastel apagados, muñecos antiguos y una melodiosa cajita musical.',
    skyColor: '#f5ebe0',
    fogColor: '#e3d5ca',
    unlocked: false,
    unlockRequirement: 'Requiere la Llave Antigua de Latón encontrada en Forgotten Dreamland.',
    isSecret: true,
  },
];

export const INITIAL_DREAMIES: Dreamie[] = [
  {
    id: 'mochi_bun',
    species: 'mochi_bun',
    name: 'Mochi',
    title: 'Conejito de Fresa',
    emoji: '🐰',
    homeWorld: 'strawberry_village',
    favoriteFood: 'Fresas de ensueño',
    personality: 'Tímido pero cariñoso, le encanta dar saltitos entre los arbustos de fresas.',
    colorScheme: { primary: '#fff0f5', secondary: '#ffb7c5', accent: '#ff69b4' },
    unlocked: true,
    adopted: true,
    isFollowing: true,
    happiness: 85,
    hunger: 75,
    cleanliness: 90,
    friendshipLevel: 2,
    timesPetted: 4,
    accessory: 'Lazo de Fresa',
    learnedTricks: ['Dar la patita', 'Salto voltereta'],
  },
  {
    id: 'starry_bear',
    species: 'starry_bear',
    name: 'Kuma',
    title: 'Osito de Polvo Estelar',
    emoji: '🧸',
    homeWorld: 'cloudy_kingdom',
    favoriteFood: 'Lirios Estelares',
    personality: 'Adormilado y suave como un malvavisco tibio. Brilla cuando se emociona.',
    colorScheme: { primary: '#e0f2fe', secondary: '#93c5fd', accent: '#3b82f6' },
    unlocked: false,
    adopted: false,
    isFollowing: false,
    happiness: 70,
    hunger: 80,
    cleanliness: 85,
    friendshipLevel: 1,
    timesPetted: 0,
    learnedTricks: ['Brillo estelar'],
  },
  {
    id: 'cloud_kitten',
    species: 'cloud_kitten',
    name: 'Mimi',
    title: 'Gatito de Algodón',
    emoji: '🐱',
    homeWorld: 'cloudy_kingdom',
    favoriteFood: 'Flor de Malvavisco',
    personality: 'Ronronea como una cajita de música y flota cuando salta.',
    colorScheme: { primary: '#f5f3ff', secondary: '#c4b5fd', accent: '#8b5cf6' },
    unlocked: false,
    adopted: false,
    isFollowing: false,
    happiness: 65,
    hunger: 70,
    cleanliness: 95,
    friendshipLevel: 1,
    timesPetted: 0,
    learnedTricks: ['Dar la patita'],
  },
  {
    id: 'ribbon_deer',
    species: 'ribbon_deer',
    name: 'Hanako',
    title: 'Ciervita de Sakura',
    emoji: '🌸',
    homeWorld: 'sakura_forest',
    favoriteFood: 'Pétalos de Sakura',
    personality: 'Sus pequeñas astas florecen con flores de cerezo en primavera.',
    colorScheme: { primary: '#fdf2f8', secondary: '#f472b6', accent: '#db2777' },
    unlocked: false,
    adopted: false,
    isFollowing: false,
    happiness: 80,
    hunger: 85,
    cleanliness: 90,
    friendshipLevel: 1,
    timesPetted: 0,
    learnedTricks: ['Danza de corazones'],
  },
  {
    id: 'candy_pup',
    species: 'candy_pup',
    name: 'Caramel',
    title: 'Perrito de Azúcar',
    emoji: '🐶',
    homeWorld: 'candy_ocean',
    favoriteFood: 'Conchas de Azúcar',
    personality: 'Su cola de algodón de azúcar se agita sin parar al verte.',
    colorScheme: { primary: '#fef3c7', secondary: '#fde047', accent: '#f59e0b' },
    unlocked: false,
    adopted: false,
    isFollowing: false,
    happiness: 75,
    hunger: 65,
    cleanliness: 80,
    friendshipLevel: 1,
    timesPetted: 0,
    learnedTricks: ['Dar la patita'],
  },
  {
    id: 'antique_doll',
    species: 'antique_doll',
    name: 'Noelle',
    title: 'Muñeca de Porcelana Olvidada',
    emoji: '🎀',
    homeWorld: 'the_forgotten_room',
    favoriteFood: 'Recuerdos Cálidos',
    personality: 'Una pequeña coneja vintage de felpa y encaje antiguo. Guarda el corazón de los sueños que temían desaparecer.',
    colorScheme: { primary: '#f5ebe0', secondary: '#d5bdaf', accent: '#b08968' },
    unlocked: false,
    adopted: false,
    isFollowing: false,
    happiness: 50,
    hunger: 60,
    cleanliness: 70,
    friendshipLevel: 1,
    timesPetted: 0,
    learnedTricks: ['Dar la patita'],
    isLegendary: true,
  },
  {
    id: 'cloud_unicorn',
    species: 'cloud_unicorn',
    name: 'Aura',
    title: 'Unicornio de Nácar',
    emoji: '🦄',
    homeWorld: 'cloudy_kingdom',
    favoriteFood: 'Caramelo de Arcoíris',
    personality: 'Una criatura celestial mítica con un cuerno de cristal que emite destellos prismáticos.',
    colorScheme: { primary: '#fdf4ff', secondary: '#f0abfc', accent: '#e879f9' },
    unlocked: false,
    adopted: false,
    isFollowing: false,
    happiness: 90,
    hunger: 50,
    cleanliness: 95,
    friendshipLevel: 1,
    timesPetted: 0,
    learnedTricks: ['Brillo estelar', 'Salto voltereta'],
    isLegendary: true,
  },
  {
    id: 'sakura_fox',
    species: 'sakura_fox',
    name: 'Kitsune',
    title: 'Zorrito de los Cerezos',
    emoji: '🦊',
    homeWorld: 'sakura_forest',
    favoriteFood: 'Pétalos Mágicos',
    personality: 'Un espíritu sabio y juguetón con dos colitas de flor de cerezo y cascabeles dorados.',
    colorScheme: { primary: '#fff1f2', secondary: '#fb7185', accent: '#e11d48' },
    unlocked: false,
    adopted: false,
    isFollowing: false,
    happiness: 85,
    hunger: 40,
    cleanliness: 80,
    friendshipLevel: 1,
    timesPetted: 0,
    learnedTricks: ['Danza de corazones'],
    isLegendary: true,
  },
];

export const INITIAL_ROOM_CUSTOMIZATION: RoomCustomization = {
  wallpaper: 'strawberry_gingham',
  flooring: 'pastel_wood',
  theme: 'strawberry',
  lightingTone: 'pastel_pink',
};

export const INITIAL_JOBS: JobInfo[] = [
  {
    id: 'cafe',
    title: 'Cafetería de Ensueño',
    emoji: '☕',
    description: 'Prepara lattes de nube esponjosa, té de burbujas de fresa y batidos pastel.',
    level: 1,
    xp: 0,
    rewardsClaimed: 0,
    shiftsDone: 0,
  },
  {
    id: 'bakery',
    title: 'Pastelería Mágica',
    emoji: '🧁',
    description: 'Hornea cupcakes de vainilla, macarons de cerezo y tartas de fresa con Pompon.',
    level: 1,
    xp: 0,
    rewardsClaimed: 0,
    shiftsDone: 0,
  },
  {
    id: 'florist',
    title: 'Floristería del Bosque',
    emoji: '💐',
    description: 'Diseña arreglos florales y coronas de flores con los pétalos de tu jardín.',
    level: 1,
    xp: 0,
    rewardsClaimed: 0,
    shiftsDone: 0,
  },
  {
    id: 'plushie_shop',
    title: 'Taller de Peluches',
    emoji: '🧸',
    description: 'Cose conejitos y ositos de felpa con lazos de satén para los visitantes.',
    level: 1,
    xp: 0,
    rewardsClaimed: 0,
    shiftsDone: 0,
  },
  {
    id: 'vet',
    title: 'Veterinaria de Dreamies',
    emoji: '🩺',
    description: 'Baña con burbujas perfumadas, cura y consiente a las criaturas mágicas.',
    level: 1,
    xp: 0,
    rewardsClaimed: 0,
    shiftsDone: 0,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_first_harvest', title: 'Primera Cosecha', emoji: '🍓', description: 'Cosecha tu primera fresa de ensueño.', unlocked: true, category: 'farming' },
  { id: 'ach_pet_lover', title: 'Amigo de Peluche', emoji: '💖', description: 'Acaricia a tus mascotas 10 veces.', unlocked: false, category: 'pets' },
  { id: 'ach_fashion_star', title: 'Estrella de Pasarela', emoji: '✨', description: 'Participa en tu primer Desfile de Moda.', unlocked: false, category: 'fashion' },
  { id: 'ach_master_chef', title: 'Maestro Pastelero', emoji: '🧁', description: 'Completa un turno en la pastelería o cafetería.', unlocked: false, category: 'jobs' },
  { id: 'ach_stargazer', title: 'Pescador de Estrellas', emoji: '⭐', description: 'Atrapa 5 estrellas fugaces en el minijuego.', unlocked: false, category: 'farming' },
  { id: 'ach_cottage_palace', title: 'Casita de Revista', emoji: '🏡', description: 'Coloca al menos 4 muebles en tu casita.', unlocked: false, category: 'decor' },
  { id: 'ach_forgotten_key', title: 'La Llave del Pasado', emoji: '🗝️', description: 'Encuentra la Llave Antigua y abre The Forgotten Room.', unlocked: false, category: 'secret' },
  { id: 'ach_music_box', title: 'Ecos de Nostalgia', emoji: '🎶', description: 'Dale cuerda a la cajita musical dorada.', unlocked: false, category: 'secret' },
  { id: 'ach_rainbow_unlocked', title: 'El Gran Regreso del Color', emoji: '🌈', description: 'Restaura el 100% de la magia de colores de Dreamyland.', unlocked: false, category: 'secret' },
];

export const INITIAL_MUSIC_TRACKS: MusicTrack[] = [
  { id: 'track_dreamy', title: 'Amanecer de Fresa', artist: 'Dreamy Harp', duration: '2:15', theme: 'dreamy', unlocked: true },
  { id: 'track_music_box', title: 'Melodía de la Cajita Antigua', artist: 'Marion & the Music Box', duration: '3:04', theme: 'music_box', unlocked: true },
  { id: 'track_bossa', title: 'Bossa de las Nubes', artist: 'Celeste Wind Ensemble', duration: '2:40', theme: 'bossa', unlocked: true },
  { id: 'track_waltz', title: 'Vals de los Pétalos', artist: 'Sakura Strings', duration: '2:55', theme: 'waltz', unlocked: true },
];

export const INITIAL_LETTERS: Letter[] = [
  {
    id: 'let_welcome',
    sender: 'Pompon 🐰',
    avatarEmoji: '🍓',
    subject: '¡Bienvenido a Dreamyland!',
    body: '¡Querido soñador! Estamos muy felices de tenerte aquí. El jardín ha estado un poco apagado últimamente, pero sé que juntos le devolveremos todo su brillo. ¡Te dejé unas semillas de regalo!',
    attachedItem: { name: 'Semillas de Fresa', emoji: '🍓', count: 3 },
    read: false,
  },
  {
    id: 'let_celeste',
    sender: 'Celeste 🐑',
    avatarEmoji: '☁️',
    subject: 'Las Nubes te saludan',
    body: 'Hola soñador... Cuando mires al cielo, recuerda que cada nube guarda un suspiro de paz. Ven a visitarme cuando quieras volar.',
    read: false,
  },
  {
    id: 'let_secret',
    sender: 'Un Soñador Olvidado 🗝️',
    avatarEmoji: '🎀',
    subject: 'Una melodía en el viento...',
    body: 'Si alguna vez sientes nostalgia, busca una puerta con forma de corazón en las ruinas lavanda. La cajita de música siempre te esperará.',
    read: false,
  },
];

export const INITIAL_FURNITURE: FurnitureItem[] = [
  {
    id: 'canopy_bed',
    name: 'Cama con Dosel Pastel',
    category: 'bed',
    emoji: '🛏️',
    description: 'Sábanas de seda rosada y cortinas translúcidas con lazos.',
    placed: true,
    position: [-2.2, 0, -2.2],
    rotationY: 0,
    unlocked: true,
    costEssence: 0,
  },
  {
    id: 'strawberry_rug',
    name: 'Alfombra de Fresa',
    category: 'rug',
    emoji: '🍓',
    description: 'Una suave alfombra tejida con forma de fresa jugosa.',
    placed: true,
    position: [0, 0.02, 0],
    rotationY: 0,
    unlocked: true,
    costEssence: 0,
  },
  {
    id: 'cloud_sofa',
    name: 'Sillón de Nube Esponjosa',
    category: 'seating',
    emoji: '☁️',
    description: 'Parece flotar sobre el suelo. Se siente como sentarse en algodón de azúcar.',
    placed: true,
    position: [2.2, 0, -1.8],
    rotationY: -Math.PI / 4,
    unlocked: true,
    costEssence: 0,
  },
  {
    id: 'antique_music_box',
    name: 'Cajita Musical Dorada',
    category: 'decor',
    emoji: '🎶',
    description: 'Una joya vintage que toca una melodía nostálgica al darle cuerda.',
    placed: true,
    position: [1.8, 0.7, 1.8],
    rotationY: 0,
    unlocked: true,
    costEssence: 30,
  },
  {
    id: 'tea_table',
    name: 'Mesa de Té Victoriana',
    category: 'table',
    emoji: '🫖',
    description: 'Madera blanca tallada con motivos de flores y patitas torneadas.',
    placed: true,
    position: [1.8, 0, 1.8],
    rotationY: 0,
    unlocked: true,
    costEssence: 20,
  },
  {
    id: 'plushie_shelf',
    name: 'Estantería de Peluches',
    category: 'decor',
    emoji: '🧸',
    description: 'Llena de pequeños amigos de felpa, lazos y libros de cuentos.',
    placed: false,
    position: [-2.4, 0, 1.5],
    rotationY: Math.PI / 2,
    unlocked: false,
    costEssence: 45,
  },
  {
    id: 'starry_lamp',
    name: 'Lámpara de Estrella Fugaz',
    category: 'lighting',
    emoji: '⭐',
    description: 'Proyecta constelaciones doradas en las paredes de tu casita.',
    placed: false,
    position: [-1.5, 0, 2.3],
    rotationY: 0,
    unlocked: false,
    costEssence: 35,
  },
  {
    id: 'vintage_wardrobe',
    name: 'Armario Pastel con Espejo',
    category: 'decor',
    emoji: '🚪',
    description: 'Un ropero tallado para guardar todos tus hermosos vestidos y accesorios.',
    placed: false,
    position: [-2.5, 0, 0],
    rotationY: Math.PI / 2,
    unlocked: false,
    costEssence: 60,
  },
];

export const INITIAL_NPCS: NPC[] = [
  {
    id: 'pompon',
    name: 'Pompon',
    role: 'Repostero de Fresas',
    worldId: 'strawberry_village',
    emoji: '🐰',
    dialogueIntro: [
      '¡Hola, soñador! ¡Bienvenido a Strawberry Village! 🍓',
      'Algo extraño ha pasado últimamente... los colores de nuestros campos se están desvaneciendo.',
      'Si cultivas fresas mágicas y cuidas a los Dreamies, ¡el brillo pastel regresará!',
    ],
    dialogueChat: [
      '¿Sabías que las fresas de Dreamyland saben a pastel de vainilla tibio?',
      'Tu conejito Mochi te adora. ¡Asegúrate de acariciarlo a menudo!',
      'Si subes a la colina, podrás ver el portal hacia el Cloudy Kingdom.',
    ],
    dialogueQuestDone: [
      '¡Increíble trabajo! ¡Mira cómo vuelven a brillar los colores del jardín! 💖',
    ],
    avatarColors: { fur: '#ffffff', clothes: '#f43f5e' },
  },
  {
    id: 'celeste',
    name: 'Celeste',
    role: 'Astrónoma de las Nubes',
    worldId: 'cloudy_kingdom',
    emoji: '🐑',
    dialogueIntro: [
      'Baa... bienvenido al Cloudy Kingdom, pequeño soñador. ☁️⭐',
      'Aquí las nubes son tan mullidas que puedes saltar sobre ellas sin caer.',
    ],
    dialogueChat: [
      'Los sueños más brillantes nacen de personas que miran las estrellas antes de dormir.',
      'Kuma y Mimi siempre duermen cerca del arcoíris. ¡Son muy mimosos!',
    ],
    dialogueQuestDone: [
      '¡Las estrellas están danzando de alegría gracias a ti! ✨',
    ],
    avatarColors: { fur: '#f0f9ff', clothes: '#60a5fa' },
  },
  {
    id: 'hana',
    name: 'Hana',
    role: 'Guardiana de los Cerezos',
    worldId: 'sakura_forest',
    emoji: '🦊',
    dialogueIntro: [
      'Bienvenido al Pink Sakura Forest. Cada pétalo que cae lleva un deseo susurrado. 🌸',
    ],
    dialogueChat: [
      'La ciervita Hanako protege los árboles milenarios. Si le ofreces pétalos, será tu amiga.',
      'Dicen que más allá del Candy Ocean existe una puerta sellada con un candado de corazón...',
    ],
    dialogueQuestDone: [
      '¡Los cerezos vuelven a florecer con fuerza! Gracias por tu corazón puro.',
    ],
    avatarColors: { fur: '#ffe4e6', clothes: '#ec4899' },
  },
  {
    id: 'pip',
    name: 'Pip',
    role: 'Recolector de Golosinas',
    worldId: 'candy_ocean',
    emoji: '🦦',
    dialogueIntro: [
      '¡Splash! ¡Hola! ¡Las aguas del Candy Ocean están deliciosamente tibias hoy! 🍬🌊',
    ],
    dialogueChat: [
      '¡Cuidado con las rocas de malvavisco, son tan suaves que rebotarás!',
      'Encontré una llave extraña enterrada en la arena de Forgotten Dreamland... ¿será para alguna puerta secreta?',
    ],
    dialogueQuestDone: [
      '¡Wiiii! ¡Las olas de fresa vuelven a cantar su canción dulce!',
    ],
    avatarColors: { fur: '#fed7aa', clothes: '#f97316' },
  },
  {
    id: 'marion',
    name: 'Marion',
    role: 'Guardiana de la Nostalgia',
    worldId: 'the_forgotten_room',
    emoji: '🎀',
    dialogueIntro: [
      '...Entraste. Hacía tanto tiempo que nadie abría esta puerta...',
      'Esta es The Forgotten Room. Aquí reposan los sueños que la gente creyó haber olvidado al crecer.',
      'No es un lugar triste... es un lugar para recordar con ternura.',
    ],
    dialogueChat: [
      'Dale cuerda a la cajita de música. Su melodía despierta los colores más profundos del alma.',
      'Noelle fue cosida a mano hace muchas lunas. Trátala con mucho cariño.',
      'Gracias por no olvidarnos.',
    ],
    dialogueQuestDone: [
      'La magia nunca desaparece mientras haya alguien dispuesto a soñar. El jardín de los sueños ha renacido por completo. 💖',
    ],
    avatarColors: { fur: '#f5ebe0', clothes: '#a78bfa' },
  },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_harvest_strawberries',
    npcId: 'pompon',
    title: '🍓 El Primer Cosecha',
    description: 'Riega y cosecha 2 Fresas de ensueño en tu huerto de Strawberry Village.',
    requirementType: 'harvest',
    targetCount: 2,
    currentCount: 0,
    rewardEssence: 40,
    rewardColorMagic: 15,
    completed: false,
    claimed: false,
  },
  {
    id: 'quest_pet_dreamies',
    npcId: 'pompon',
    title: '🧸 Amor de Ensueño',
    description: 'Acaricia a tu Dreamie compañero 3 veces para fortalecer vuestra amistad.',
    requirementType: 'pet',
    targetCount: 3,
    currentCount: 0,
    rewardEssence: 35,
    rewardColorMagic: 15,
    completed: false,
    claimed: false,
  },
  {
    id: 'quest_decorate_cottage',
    npcId: 'pompon',
    title: '🌸 Casita de Ensueño',
    description: 'Coloca o acomoda 3 muebles en tu casita acogedora para hacerla más linda.',
    requirementType: 'decorate',
    targetCount: 3,
    currentCount: 0,
    rewardEssence: 50,
    rewardColorMagic: 15,
    completed: false,
    claimed: false,
  },
  {
    id: 'quest_explore_clouds',
    npcId: 'celeste',
    title: '☁️ Saltando entre Nubes',
    description: 'Desbloquea y viaja a Cloudy Kingdom para saludar a Celeste.',
    requirementType: 'explore',
    targetCount: 1,
    currentCount: 0,
    rewardEssence: 60,
    rewardColorMagic: 20,
    completed: false,
    claimed: false,
  },
  {
    id: 'quest_the_forgotten_room',
    npcId: 'marion',
    title: '🗝️ The Forgotten Room',
    description: 'Descubre el mundo secreto, encuentra la cajita musical y dale cuerda.',
    requirementType: 'secret',
    targetCount: 1,
    currentCount: 0,
    rewardEssence: 120,
    rewardColorMagic: 35,
    completed: false,
    claimed: false,
  },
];

export const INITIAL_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 1,
    title: 'Página I: El Primer Susurro',
    date: 'Época de Cerezo Antiguo',
    excerpt: 'Cuando los niños sueñan por primera vez, una flor nace en este jardín...',
    content: 'Cuando los niños sueñan por primera vez, una flor de pétalos iridiscentes brota en este jardín. Decidí construir casitas y caminos de fresa para que ningún sueño se sintiera perdido. Nombré a este lugar Dreamyland, donde todo es tan suave como una nube.',
    discovered: true,
  },
  {
    id: 2,
    title: 'Página II: El Hilo Invisible',
    date: 'Noche de Cometas Dulces',
    excerpt: '¿Qué ocurre cuando crecemos? ¿Adónde van los peluches y las meriendas de fantasía?...',
    content: 'A veces las personas crecen y sus ojos olvidan cómo ver los arcoíris en un charco de lluvia. Pero los sueños no mueren; se transforman en pequeñas criaturas, los Dreamies. Ellos esperan pacientemente a que alguien vuelva a tenderles la mano.',
    discovered: false,
  },
  {
    id: 3,
    title: 'Página III: La Habitación Sellada',
    date: 'Hora de la Melancolía Pastel',
    excerpt: 'Para los sueños que dolía demasiado recordar, preparé un refugio de encaje...',
    content: 'Sentí miedo de que el ruido del mundo borrara los recuerdos más frágiles. Por eso creé The Forgotten Room. Le di colores apagados como té con leche, una alfombra de terciopelo y una cajita de música cuya tonada detiene las lágrimas. Cerré la puerta con una llave dorada con forma de corazón.',
    discovered: false,
  },
  {
    id: 4,
    title: 'Página IV: La Promesa de los Colores',
    date: 'Alborada Eterna',
    excerpt: 'Si alguna vez los colores se apagan, solo un alma bondadosa podrá reavivarlos...',
    content: 'Si estás leyendo esto, significa que el mundo ha vuelto a necesitar tu magia. Riega las flores, abraza a tus amigos y no tengas miedo de la nostalgia. Los sueños viven para siempre.',
    discovered: false,
  },
];

export interface GameState {
  currentWorld: WorldId;
  previousWorld: WorldId;
  worldColorLevel: number; // 0 - 100 (%)
  dreamEssence: number;
  worlds: WorldInfo[];
  dreamies: Dreamie[];
  gardenPlots: GardenPlot[];
  seeds: Record<SeedType, number>;
  inventory: Record<string, number>;
  hasAntiqueKey: boolean;
  musicBoxPlaying: boolean;
  furniture: FurnitureItem[];
  outfit: OutfitConfig;
  roomCustomization: RoomCustomization;
  jobs: JobInfo[];
  achievements: Achievement[];
  musicTracks: MusicTrack[];
  currentTrackId: string;
  letters: Letter[];
  photos: DiaryPhoto[];
  highScores: Record<string, number>;
  quests: Quest[];
  npcs: NPC[];
  diaryEntries: DiaryEntry[];
  totalStrawberriesHarvested: number;
  totalTimesPetted: number;
  activeCompanionId: string;
}

class GameStateManager {
  private state: GameState;
  private listeners: Set<(state: GameState) => void> = new Set();
  private gardenTimer: number | null = null;

  constructor() {
    this.state = this.loadState();
    this.startGardenTicker();
  }

  private loadState(): GameState {
    const defaultState: GameState = {
      currentWorld: 'strawberry_village',
      previousWorld: 'strawberry_village',
      worldColorLevel: 25, // Starts desaturated/faded as in story
      dreamEssence: 75,
      worlds: INITIAL_WORLDS,
      dreamies: INITIAL_DREAMIES,
      gardenPlots: [
        { id: 0, plantedSeed: 'strawberry', plantedAt: Date.now() - 35000, watered: true, growthProgress: 0.9, isReady: false },
        { id: 1, plantedSeed: 'strawberry', plantedAt: Date.now() - 50000, watered: true, growthProgress: 1.0, isReady: true },
        { id: 2, plantedSeed: null, plantedAt: null, watered: false, growthProgress: 0, isReady: false },
        { id: 3, plantedSeed: null, plantedAt: null, watered: false, growthProgress: 0, isReady: false },
        { id: 4, plantedSeed: null, plantedAt: null, watered: false, growthProgress: 0, isReady: false },
        { id: 5, plantedSeed: null, plantedAt: null, watered: false, growthProgress: 0, isReady: false },
      ],
      seeds: {
        strawberry: 6,
        sakura_blossom: 3,
        star_lily: 2,
        marshmallow_bloom: 2,
      },
      inventory: {
        strawberry: 3,
        sakura_blossom: 0,
        star_lily: 0,
        marshmallow_bloom: 0,
        star_shards: 4,
        sugar_shells: 2,
        rainbow_candy: 1,
      },
      hasAntiqueKey: false,
      musicBoxPlaying: false,
      furniture: INITIAL_FURNITURE,
      outfit: {
        hairStyle: 'twintails',
        hairColor: '#f9a8d4',
        headwear: 'bunny_ears',
        dress: 'strawberry_lolita',
        dressColor: '#f472b6',
        wings: 'angel_wings',
        makeup: 'heart_blush',
        paletteTheme: 'sakura',
      },
      roomCustomization: INITIAL_ROOM_CUSTOMIZATION,
      jobs: INITIAL_JOBS,
      achievements: INITIAL_ACHIEVEMENTS,
      musicTracks: INITIAL_MUSIC_TRACKS,
      currentTrackId: 'track_dreamy',
      letters: INITIAL_LETTERS,
      photos: [
        {
          id: 'photo_init_1',
          timestamp: Date.now() - 100000,
          title: 'Bienvenida a Strawberry Village',
          location: 'Strawberry Village',
          filter: 'pastel',
          caption: '¡El primer día que conocí a Mochi entre las fresas gigantes! 🍓🐰',
          stickers: ['🍓', '✨', '💖'],
        },
      ],
      highScores: {
        star_fishing: 120,
        dessert_cooking: 340,
        bunny_race: 450,
        pastel_puzzle: 280,
        rhythm_dance: 520,
      },
      quests: INITIAL_QUESTS,
      npcs: INITIAL_NPCS,
      diaryEntries: INITIAL_DIARY_ENTRIES,
      totalStrawberriesHarvested: 1,
      totalTimesPetted: 4,
      activeCompanionId: 'mochi_bun',
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch {
      // ignore
    }

    return defaultState;
  }

  public save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
  }

  public getState(): GameState {
    return this.state;
  }

  public subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.save();
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  // --- World Management ---

  public setWorld(worldId: WorldId) {
    if (this.state.currentWorld === worldId) return;
    const targetWorld = this.state.worlds.find((w) => w.id === worldId);
    if (targetWorld && !targetWorld.unlocked) return;

    this.state.previousWorld = this.state.currentWorld;
    this.state.currentWorld = worldId;

    // Check audio theme
    if (worldId === 'the_forgotten_room') {
      soundEngine.startBgm('music_box');
      // Discover Diary Page 3
      this.discoverDiary(3);
    } else {
      soundEngine.startBgm('dreamy');
    }

    // Quest check
    if (worldId === 'cloudy_kingdom') {
      this.updateQuestProgress('quest_explore_clouds', 1);
    }

    this.notify();
  }

  public unlockWorld(worldId: WorldId) {
    const world = this.state.worlds.find((w) => w.id === worldId);
    if (!world || world.unlocked) return;

    world.unlocked = true;
    soundEngine.playFanfare();
    this.addColorMagic(10);
    this.notify();
  }

  // --- Color Magic & Essence ---

  public addColorMagic(amount: number) {
    const prev = this.state.worldColorLevel;
    this.state.worldColorLevel = Math.min(100, this.state.worldColorLevel + amount);
    if (prev < 100 && this.state.worldColorLevel >= 100) {
      soundEngine.playFanfare();
    }
    this.notify();
  }

  public addDreamEssence(amount: number) {
    this.state.dreamEssence += amount;
    this.checkWorldUnlocks();
    this.notify();
  }

  public spendDreamEssence(amount: number): boolean {
    if (this.state.dreamEssence < amount) return false;
    this.state.dreamEssence -= amount;
    this.notify();
    return true;
  }

  private checkWorldUnlocks() {
    const essence = this.state.dreamEssence;
    if (essence >= 60) this.unlockWorld('cloudy_kingdom');
    if (essence >= 130) this.unlockWorld('sakura_forest');
    if (essence >= 220) this.unlockWorld('candy_ocean');
    if (essence >= 320) this.unlockWorld('forgotten_dreamland');
  }

  // --- Gardening ---

  private startGardenTicker() {
    if (this.gardenTimer) clearInterval(this.gardenTimer);
    this.gardenTimer = window.setInterval(() => {
      let changed = false;
      const now = Date.now();
      this.state.gardenPlots = this.state.gardenPlots.map((plot) => {
        if (!plot.plantedSeed || plot.isReady) return plot;
        // takes ~25 seconds if watered, ~50s if unwatered
        const speed = plot.watered ? 0.05 : 0.02;
        const newProgress = Math.min(1, plot.growthProgress + speed);
        if (newProgress !== plot.growthProgress) {
          changed = true;
          return {
            ...plot,
            growthProgress: newProgress,
            isReady: newProgress >= 1,
          };
        }
        return plot;
      });
      if (changed) {
        this.notify();
      }
    }, 1500);
  }

  public plantSeed(plotId: number, seedType: SeedType): boolean {
    if ((this.state.seeds[seedType] || 0) <= 0) return false;
    const plot = this.state.gardenPlots.find((p) => p.id === plotId);
    if (!plot || plot.plantedSeed) return false;

    this.state.seeds[seedType]--;
    plot.plantedSeed = seedType;
    plot.plantedAt = Date.now();
    plot.growthProgress = 0.05;
    plot.isReady = false;
    plot.watered = true; // Comes pre-watered for convenience

    soundEngine.playWater();
    this.notify();
    return true;
  }

  public waterPlot(plotId: number) {
    const plot = this.state.gardenPlots.find((p) => p.id === plotId);
    if (!plot || !plot.plantedSeed || plot.watered) return;

    plot.watered = true;
    soundEngine.playWater();
    this.notify();
  }

  public harvestPlot(plotId: number): boolean {
    const plot = this.state.gardenPlots.find((p) => p.id === plotId);
    if (!plot || !plot.plantedSeed || !plot.isReady) return false;

    const seedType = plot.plantedSeed;
    this.state.inventory[seedType] = (this.state.inventory[seedType] || 0) + 1;
    // Give extra seeds with 50% chance
    if (Math.random() > 0.4) {
      this.state.seeds[seedType] = (this.state.seeds[seedType] || 0) + 1;
    }

    // Essence and color rewards
    this.addDreamEssence(15);
    this.addColorMagic(2);
    soundEngine.playHarvest();

    if (seedType === 'strawberry') {
      this.state.totalStrawberriesHarvested++;
      this.updateQuestProgress('quest_harvest_strawberries', 1);
    }

    // Reset plot
    plot.plantedSeed = null;
    plot.plantedAt = null;
    plot.growthProgress = 0;
    plot.isReady = false;
    plot.watered = false;

    this.notify();
    return true;
  }

  // --- Dreamies & Petting ---

  public petDreamie(dreamieId: string) {
    const dreamie = this.state.dreamies.find((d) => d.id === dreamieId);
    if (!dreamie) return;

    dreamie.timesPetted++;
    dreamie.happiness = Math.min(100, dreamie.happiness + 10);
    this.state.totalTimesPetted++;

    soundEngine.playPet();
    this.addDreamEssence(5);
    this.addColorMagic(1);
    this.updateQuestProgress('quest_pet_dreamies', 1);
    this.notify();
  }

  public adoptDreamie(dreamieId: string) {
    const dreamie = this.state.dreamies.find((d) => d.id === dreamieId);
    if (!dreamie || dreamie.adopted) return;

    dreamie.adopted = true;
    dreamie.unlocked = true;
    soundEngine.playFanfare();
    this.addDreamEssence(20);
    this.addColorMagic(5);
    this.notify();
  }

  public setCompanion(dreamieId: string) {
    this.state.dreamies.forEach((d) => {
      d.isFollowing = d.id === dreamieId;
    });
    this.state.activeCompanionId = dreamieId;
    soundEngine.playUiPop();
    this.notify();
  }

  public feedDreamie(dreamieId: string, foodItem: string): boolean {
    const count = this.state.inventory[foodItem] || 0;
    if (count <= 0) return false;

    const dreamie = this.state.dreamies.find((d) => d.id === dreamieId);
    if (!dreamie) return false;

    this.state.inventory[foodItem]--;
    dreamie.happiness = 100;
    dreamie.friendshipLevel = Math.min(5, dreamie.friendshipLevel + 1);

    soundEngine.playHarvest();
    this.addDreamEssence(15);
    this.addColorMagic(3);
    this.notify();
    return true;
  }

  // --- Cottage Decoration ---

  public placeFurniture(furnitureId: string, position: [number, number, number], rotationY: number = 0) {
    const item = this.state.furniture.find((f) => f.id === furnitureId);
    if (!item) return;

    item.placed = true;
    item.position = position;
    item.rotationY = rotationY;
    soundEngine.playUiPop();

    const placedCount = this.state.furniture.filter((f) => f.placed).length;
    this.updateQuestProgress('quest_decorate_cottage', placedCount, true);
    this.notify();
  }

  public removeFurniture(furnitureId: string) {
    const item = this.state.furniture.find((f) => f.id === furnitureId);
    if (!item) return;

    item.placed = false;
    soundEngine.playUiPop();
    this.notify();
  }

  public unlockFurniture(furnitureId: string): boolean {
    const item = this.state.furniture.find((f) => f.id === furnitureId);
    if (!item || item.unlocked) return false;

    if (!this.spendDreamEssence(item.costEssence)) return false;

    item.unlocked = true;
    soundEngine.playFanfare();
    this.addColorMagic(2);
    this.notify();
    return true;
  }

  // --- Music Box & The Forgotten Room ---

  public windMusicBox() {
    soundEngine.playRatchet();
    setTimeout(() => {
      soundEngine.playMusicBoxNote(523.25, 2.0);
      soundEngine.playMusicBoxNote(659.25, 2.2);
    }, 150);

    this.state.musicBoxPlaying = true;
    this.updateQuestProgress('quest_the_forgotten_room', 1);
    this.discoverDiary(4);
    this.addColorMagic(10);
    this.notify();
  }

  public unlockForgottenRoomKey() {
    this.state.hasAntiqueKey = true;
    const room = this.state.worlds.find((w) => w.id === 'the_forgotten_room');
    if (room) room.unlocked = true;

    // unlock Antique Doll
    const doll = this.state.dreamies.find((d) => d.id === 'antique_doll');
    if (doll) doll.unlocked = true;

    soundEngine.playFanfare();
    this.discoverDiary(2);
    this.addColorMagic(15);
    this.notify();
  }

  // --- Outfit Customizer ---

  public updateOutfit(config: Partial<OutfitConfig>) {
    this.state.outfit = { ...this.state.outfit, ...config };
    soundEngine.playUiPop();
    this.notify();
  }

  // --- Room & House Customization ---

  public setRoomCustomization(custom: Partial<RoomCustomization>) {
    this.state.roomCustomization = { ...this.state.roomCustomization, ...custom };
    soundEngine.playUiPop();
    this.notify();
  }

  // --- Pets: Bathing, Naming, Tricks, Legendaries ---

  public batheDreamie(dreamieId: string) {
    const dreamie = this.state.dreamies.find((d) => d.id === dreamieId);
    if (!dreamie) return;

    dreamie.cleanliness = 100;
    dreamie.happiness = Math.min(100, dreamie.happiness + 20);
    soundEngine.playWater();
    this.addDreamEssence(10);
    this.addColorMagic(2);
    this.unlockAchievement('ach_pet_lover');
    this.notify();
  }

  public renameDreamie(dreamieId: string, newName: string) {
    const dreamie = this.state.dreamies.find((d) => d.id === dreamieId);
    if (!dreamie || !newName.trim()) return;

    dreamie.customName = newName.trim();
    soundEngine.playUiPop();
    this.notify();
  }

  public teachDreamieTrick(dreamieId: string, trick: string) {
    const dreamie = this.state.dreamies.find((d) => d.id === dreamieId);
    if (!dreamie) return;

    if (!dreamie.learnedTricks.includes(trick)) {
      dreamie.learnedTricks.push(trick);
      dreamie.happiness = 100;
      dreamie.friendshipLevel = Math.min(5, dreamie.friendshipLevel + 1);
      soundEngine.playFanfare();
      this.addDreamEssence(25);
      this.addColorMagic(5);
      this.notify();
    }
  }

  // --- Jobs (Cafetería, Pastelería, Floristería, Taller Peluches, Veterinaria) ---

  public completeJobShift(jobId: JobType, earningsEssence: number = 40) {
    const job = this.state.jobs.find((j) => j.id === jobId);
    if (!job) return;

    job.shiftsDone++;
    job.xp += 50;
    if (job.xp >= job.level * 100) {
      job.level++;
      job.xp = 0;
      soundEngine.playFanfare();
    } else {
      soundEngine.playHarvest();
    }

    this.addDreamEssence(earningsEssence);
    this.addColorMagic(4);
    this.unlockAchievement('ach_master_chef');
    this.notify();
  }

  // --- Minigames ---

  public recordMinigameResult(minigameId: MinigameId, score: number, rewardEssence: number = 30) {
    const currentHigh = this.state.highScores[minigameId] || 0;
    if (score > currentHigh) {
      this.state.highScores[minigameId] = score;
    }

    if (minigameId === 'star_fishing') {
      this.unlockAchievement('ach_stargazer');
    }

    this.addDreamEssence(rewardEssence);
    this.addColorMagic(3);
    soundEngine.playFanfare();
    this.notify();
  }

  // --- Camera & Photography ---

  public savePhoto(photo: Omit<DiaryPhoto, 'id' | 'timestamp'>) {
    const newPhoto: DiaryPhoto = {
      ...photo,
      id: `photo_${Date.now()}`,
      timestamp: Date.now(),
    };
    this.state.photos.unshift(newPhoto);
    soundEngine.playUiPop();
    this.addColorMagic(2);
    this.notify();
  }

  // --- Letters & Mailbox ---

  public readLetter(letterId: string) {
    const letter = this.state.letters.find((l) => l.id === letterId);
    if (letter && !letter.read) {
      letter.read = true;
      if (letter.attachedItem) {
        if (letter.attachedItem.name.includes('Semilla')) {
          this.state.seeds.strawberry += letter.attachedItem.count;
        } else {
          this.addDreamEssence(20);
        }
      }
      soundEngine.playUiPop();
      this.notify();
    }
  }

  // --- Jukebox Playlist ---

  public playTrack(trackId: string) {
    const track = this.state.musicTracks.find((t) => t.id === trackId);
    if (!track) return;

    this.state.currentTrackId = trackId;
    soundEngine.startBgm(track.theme === 'music_box' ? 'music_box' : 'dreamy');
    this.notify();
  }

  // --- Achievements ---

  public unlockAchievement(achId: string) {
    const ach = this.state.achievements.find((a) => a.id === achId);
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      soundEngine.playFanfare();
      this.addDreamEssence(50);
      this.addColorMagic(5);
      this.notify();
    }
  }

  // --- Quests & Diary ---

  public updateQuestProgress(questId: string, deltaOrExact: number, isExact: boolean = false) {
    const quest = this.state.quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    if (isExact) {
      quest.currentCount = Math.min(quest.targetCount, deltaOrExact);
    } else {
      quest.currentCount = Math.min(quest.targetCount, quest.currentCount + deltaOrExact);
    }

    if (quest.currentCount >= quest.targetCount && !quest.completed) {
      quest.completed = true;
      soundEngine.playFanfare();
    }
    this.notify();
  }

  public claimQuestReward(questId: string): boolean {
    const quest = this.state.quests.find((q) => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return false;

    quest.claimed = true;
    this.addDreamEssence(quest.rewardEssence);
    this.addColorMagic(quest.rewardColorMagic);
    soundEngine.playFanfare();
    this.notify();
    return true;
  }

  public discoverDiary(id: number) {
    const entry = this.state.diaryEntries.find((d) => d.id === id);
    if (entry && !entry.discovered) {
      entry.discovered = true;
      this.addColorMagic(5);
      this.notify();
    }
  }

  public resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.notify();
  }
}

export const gameState = new GameStateManager();
