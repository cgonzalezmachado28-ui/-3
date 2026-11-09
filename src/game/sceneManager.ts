import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { gameState } from './gameState';
import { soundEngine } from './audio';
import { WorldId } from '../types/game';
import {
  createPlayerCharacter,
  createDreamieMesh,
  createNpcMesh,
  createGiantStrawberry,
  createSakuraTree,
  createCottageHouse,
  createGardenBed,
  createGardenPlotSprout,
  createFurnitureMesh,
  createForgottenRoomDecor,
} from './proceduralModels';

export interface InteractionTarget {
  type: 'npc' | 'garden' | 'cottage_door' | 'music_box' | 'key' | 'portal' | 'dreamie';
  id?: string;
  label: string;
  prompt: string;
  position: THREE.Vector3;
}

export class DreamSceneManager {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private isSoftwareGl: boolean = false;
  private frameId: number = 0;
  private isDestroyed: boolean = false;

  // Actors & Objects
  private playerGroup: THREE.Group | null = null;
  private companionGroup: THREE.Group | null = null;
  private worldGroup: THREE.Group;
  private gardenSproutsGroup: THREE.Group;
  private npcsGroup: THREE.Group;
  private furnitureGroup: THREE.Group;
  private particlesGroup: THREE.Group;

  // Dynamic references
  private windmillBlades: THREE.Mesh | null = null;
  private musicBoxStar: THREE.Mesh | null = null;

  // Player physics
  private playerPos = new THREE.Vector3(0, 0, 3);
  private playerVelocityY = 0;
  private isGrounded = true;
  private playerYaw = 0;
  private walkTime = 0;

  // Input states
  private inputX = 0;
  private inputZ = 0;
  private isJumping = false;
  private lastFootstepTime = 0;

  // Camera targets
  private cameraOffset = new THREE.Vector3(0, 4.2, 6.8);
  private cameraLookTarget = new THREE.Vector3(0, 1.2, 0);

  // Interaction detection callback
  public onNearInteraction?: (target: InteractionTarget | null) => void;
  private currentInteraction: InteractionTarget | null = null;

  // Title screen mode
  public isTitleScreen: boolean = true;

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Software-WebGL Guard
    this.isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(this.renderer.domElement);

    // 3. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    this.camera.position.set(0, 5, 8);
    this.camera.lookAt(0, 1, 0);

    this.clock = new THREE.Clock();

    // 4. Room Environment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // fallback
    }

    // 5. Hierarchy groups
    this.worldGroup = new THREE.Group();
    this.gardenSproutsGroup = new THREE.Group();
    this.npcsGroup = new THREE.Group();
    this.furnitureGroup = new THREE.Group();
    this.particlesGroup = new THREE.Group();

    this.scene.add(this.worldGroup);
    this.scene.add(this.gardenSproutsGroup);
    this.scene.add(this.npcsGroup);
    this.scene.add(this.furnitureGroup);
    this.scene.add(this.particlesGroup);

    // Setup initial world & lighting
    this.setupLighting();
    this.loadWorld(gameState.getState().currentWorld);
    this.rebuildPlayer();
    this.initAmbientParticles();

    // Events
    window.addEventListener('resize', this.handleResize);

    // Start loop
    this.tick = this.tick.bind(this);
    this.tick();
  }

  private handleResize = () => {
    if (this.isDestroyed || !this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private setupLighting() {
    // Balanced 3-point Studio / Outdoor Rig
    const hemiLight = new THREE.HemisphereLight('#fef08a', '#93c5fd', 0.85);
    hemiLight.name = 'hemi_light';
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight('#fff7ed', 1.4);
    dirLight.name = 'dir_light';
    dirLight.position.set(8, 14, 8);
    dirLight.castShadow = !this.isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -12;
    dirLight.shadow.camera.right = 12;
    dirLight.shadow.camera.top = 12;
    dirLight.shadow.camera.bottom = -12;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    this.scene.add(dirLight);

    // Soft pink ambient
    const amb = new THREE.AmbientLight('#ffe4e6', 0.4);
    amb.name = 'amb_light';
    this.scene.add(amb);
  }

  public rebuildPlayer() {
    if (this.playerGroup) {
      this.scene.remove(this.playerGroup);
    }
    const state = gameState.getState();
    this.playerGroup = createPlayerCharacter(state.outfit);
    this.playerGroup.position.copy(this.playerPos);
    this.scene.add(this.playerGroup);

    this.rebuildCompanion();
  }

  public rebuildCompanion() {
    if (this.companionGroup) {
      this.scene.remove(this.companionGroup);
      this.companionGroup = null;
    }

    const state = gameState.getState();
    const companion = state.dreamies.find((d) => d.id === state.activeCompanionId && d.adopted);
    if (companion) {
      this.companionGroup = createDreamieMesh(companion.species, companion.colorScheme);
      this.companionGroup.position.set(
        this.playerPos.x - 0.8,
        0,
        this.playerPos.z + 0.8
      );
      this.scene.add(this.companionGroup);
    }
  }

  public loadWorld(worldId: WorldId) {
    // Clear dynamic world groups
    while (this.worldGroup.children.length > 0) {
      this.worldGroup.remove(this.worldGroup.children[0]);
    }
    while (this.gardenSproutsGroup.children.length > 0) {
      this.gardenSproutsGroup.remove(this.gardenSproutsGroup.children[0]);
    }
    while (this.npcsGroup.children.length > 0) {
      this.npcsGroup.remove(this.npcsGroup.children[0]);
    }
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }

    this.windmillBlades = null;
    this.musicBoxStar = null;

    const state = gameState.getState();
    const worldInfo = state.worlds.find((w) => w.id === worldId) || state.worlds[0];

    // Background & Fog
    this.scene.background = new THREE.Color(worldInfo.skyColor);
    this.scene.fog = new THREE.Fog(worldInfo.fogColor, 14, 38);

    // Reset player position for new world
    this.playerPos.set(0, 0, 3);
    this.playerVelocityY = 0;

    if (worldId === 'cottage_interior') {
      this.buildCottageInterior();
    } else if (worldId === 'the_forgotten_room') {
      this.buildTheForgottenRoom();
    } else if (worldId === 'cloudy_kingdom') {
      this.buildCloudyKingdom();
    } else if (worldId === 'sakura_forest') {
      this.buildSakuraForest();
    } else if (worldId === 'candy_ocean') {
      this.buildCandyOcean();
    } else if (worldId === 'forgotten_dreamland') {
      this.buildForgottenDreamland();
    } else {
      // Default: Strawberry Village
      this.buildStrawberryVillage();
    }

    this.updateGardenPlots();
  }

  // --- World Builders ---

  private buildStrawberryVillage() {
    // 1. Lush rolling pastel island
    const islandGeo = new THREE.CylinderGeometry(14, 11, 3.5, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: '#fbcfe8', // soft strawberry grass
      roughness: 0.8,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -1.75;
    island.receiveShadow = true;
    this.worldGroup.add(island);

    // Stepping stone path to cottage
    for (let i = 0; i < 6; i++) {
      const stoneGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.08, 8);
      const stoneMat = new THREE.MeshStandardMaterial({ color: '#fff1f2', roughness: 0.7 });
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(0, 0.04, 3 - i * 0.9);
      stone.receiveShadow = true;
      this.worldGroup.add(stone);
    }

    // 2. Player's Cottage House
    const cottage = createCottageHouse();
    cottage.position.set(0, 0, -2.5);
    this.worldGroup.add(cottage);

    // 3. Giant Strawberries
    [
      { x: -5, z: -1, s: 1.2 },
      { x: 5.5, z: 1.5, s: 1.4 },
      { x: -4.5, z: 4, s: 0.9 },
    ].forEach(({ x, z, s }) => {
      const berry = createGiantStrawberry();
      berry.position.set(x, 0, z);
      berry.scale.set(s, s, s);
      this.worldGroup.add(berry);
    });

    // 4. Sakura Blossom Trees
    [
      { x: -7, z: -4 },
      { x: 7, z: -3.5 },
      { x: 6, z: 5 },
    ].forEach(({ x, z }) => {
      const tree = createSakuraTree();
      tree.position.set(x, 0, z);
      this.worldGroup.add(tree);
    });

    // 5. Windmill
    const windmillGroup = new THREE.Group();
    windmillGroup.position.set(-6.5, 0, 1.5);
    const towerGeo = new THREE.CylinderGeometry(1.0, 1.4, 4.0, 12);
    const tower = new THREE.Mesh(towerGeo, new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.6 }));
    tower.position.y = 2.0;
    tower.castShadow = true;
    windmillGroup.add(tower);

    // Windmill blades hub
    const bladesHub = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 8, 8),
      new THREE.MeshStandardMaterial({ color: '#f43f5e' })
    );
    bladesHub.position.set(0, 3.4, 1.05);

    // 4 blades
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 1.8, 0.04),
        new THREE.MeshStandardMaterial({ color: '#ffffff' })
      );
      blade.position.y = 0.9;
      blade.rotation.z = (b * Math.PI) / 2;
      bladesHub.add(blade);
    }
    this.windmillBlades = bladesHub;
    windmillGroup.add(bladesHub);
    this.worldGroup.add(windmillGroup);

    // 6. Garden Bed with 6 Plots
    const gardenBed = createGardenBed();
    gardenBed.position.set(4.5, 0, -1.0);
    this.worldGroup.add(gardenBed);

    // 7. World Portal to Cloudy Kingdom
    const portal = this.createPortalArch('cloudy_kingdom', '☁️ Cloudy Kingdom');
    portal.position.set(0, 0, 8.5);
    portal.rotation.y = Math.PI;
    this.worldGroup.add(portal);

    // 8. NPC: Pompon
    const state = gameState.getState();
    const pomponData = state.npcs.find((n) => n.id === 'pompon')!;
    const pompon = createNpcMesh(pomponData);
    pompon.position.set(-2.2, 0, 1.2);
    pompon.rotation.y = Math.PI / 4;
    this.npcsGroup.add(pompon);

    // 9. Free Mochi Bun (if not adopted)
    const mochi = state.dreamies.find((d) => d.id === 'mochi_bun');
    if (mochi && !mochi.adopted) {
      const mochiMesh = createDreamieMesh(mochi.species, mochi.colorScheme);
      mochiMesh.position.set(2.5, 0, 2.5);
      this.worldGroup.add(mochiMesh);
    }
  }

  private buildCloudyKingdom() {
    // Fluffy cloud floating islands
    const mainIsland = new THREE.Group();
    mainIsland.position.y = -0.5;

    for (let i = 0; i < 9; i++) {
      const rad = 2.4 + (i % 3) * 0.8;
      const angle = (i * Math.PI * 2) / 9;
      const dist = 3.5 + (i % 2) * 2;
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(rad, 16, 12),
        new THREE.MeshStandardMaterial({ color: '#f0f9ff', roughness: 0.9 })
      );
      puff.position.set(Math.cos(angle) * dist, -0.6, Math.sin(angle) * dist);
      puff.scale.set(1.4, 0.7, 1.4);
      mainIsland.add(puff);
    }
    this.worldGroup.add(mainIsland);

    // Star bounce pads
    [-3.5, 3.5].forEach((x) => {
      const starPad = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8, 0),
        new THREE.MeshStandardMaterial({
          color: '#fef08a',
          emissive: '#facc15',
          emissiveIntensity: 0.6,
          roughness: 0.2,
        })
      );
      starPad.scale.set(1.2, 0.4, 1.2);
      starPad.position.set(x, 0.2, -2.5);
      this.worldGroup.add(starPad);
    });

    // Rainbow bridge
    const rainbowGeo = new THREE.TorusGeometry(5, 0.3, 8, 24, Math.PI);
    const rainbowMat = new THREE.MeshStandardMaterial({
      color: '#f472b6',
      emissive: '#fb7185',
      emissiveIntensity: 0.3,
    });
    const rainbow = new THREE.Mesh(rainbowGeo, rainbowMat);
    rainbow.rotation.x = Math.PI / 2;
    rainbow.rotation.z = Math.PI / 4;
    rainbow.position.set(0, 1.5, -4);
    this.worldGroup.add(rainbow);

    // Portal back & forward
    const portalBack = this.createPortalArch('strawberry_village', '🍓 Strawberry Village');
    portalBack.position.set(0, 0, 7.5);
    portalBack.rotation.y = Math.PI;
    this.worldGroup.add(portalBack);

    const portalNext = this.createPortalArch('sakura_forest', '🌸 Pink Sakura Forest');
    portalNext.position.set(0, 0, -7.5);
    this.worldGroup.add(portalNext);

    // NPC: Celeste
    const celesteData = gameState.getState().npcs.find((n) => n.id === 'celeste')!;
    const celeste = createNpcMesh(celesteData);
    celeste.position.set(-1.8, 0, 1.5);
    celeste.rotation.y = Math.PI / 4;
    this.npcsGroup.add(celeste);

    // Dreamies to adopt
    const starryBear = gameState.getState().dreamies.find((d) => d.id === 'starry_bear');
    if (starryBear && !starryBear.adopted) {
      const bearMesh = createDreamieMesh(starryBear.species, starryBear.colorScheme);
      bearMesh.position.set(3, 0, -1);
      this.worldGroup.add(bearMesh);
    }
  }

  private buildSakuraForest() {
    // Pink moss ground
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 12, 3, 32),
      new THREE.MeshStandardMaterial({ color: '#fbcfe8', roughness: 0.85 })
    );
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    this.worldGroup.add(ground);

    // Forest of Cherry Blossom Trees
    const treePositions = [
      [-6, -4], [-2, -6], [4, -5], [7, -2],
      [-7, 1], [-5, 5], [6, 4], [3, 6],
    ];
    treePositions.forEach(([x, z]) => {
      const tree = createSakuraTree();
      tree.position.set(x, 0, z);
      tree.scale.set(1.1, 1.1, 1.1);
      this.worldGroup.add(tree);
    });

    // Floating Japanese Torii Gate
    const toriiGroup = new THREE.Group();
    toriiGroup.position.set(0, 0, -4.5);
    const redMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', roughness: 0.4 });
    // Posts
    [-1.6, 1.6].forEach((x) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.2, 8), redMat);
      post.position.set(x, 1.6, 0);
      toriiGroup.add(post);
    });
    // Top crossbeam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 0.35), redMat);
    beam.position.y = 3.1;
    toriiGroup.add(beam);
    this.worldGroup.add(toriiGroup);

    // Portals
    const portalBack = this.createPortalArch('cloudy_kingdom', '☁️ Cloudy Kingdom');
    portalBack.position.set(0, 0, 7.5);
    portalBack.rotation.y = Math.PI;
    this.worldGroup.add(portalBack);

    const portalNext = this.createPortalArch('candy_ocean', '🍬 Candy Ocean');
    portalNext.position.set(0, 0, -7.5);
    this.worldGroup.add(portalNext);

    // NPC: Hana
    const hanaData = gameState.getState().npcs.find((n) => n.id === 'hana')!;
    const hana = createNpcMesh(hanaData);
    hana.position.set(0, 0, -2.5);
    this.npcsGroup.add(hana);

    // Ribbon Deer
    const deer = gameState.getState().dreamies.find((d) => d.id === 'ribbon_deer');
    if (deer && !deer.adopted) {
      const deerMesh = createDreamieMesh(deer.species, deer.colorScheme);
      deerMesh.position.set(-3, 0, 2);
      this.worldGroup.add(deerMesh);
    }
  }

  private buildCandyOcean() {
    // Marshmallow sandy shore
    const shore = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 11, 2.5, 32),
      new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.7 })
    );
    shore.position.y = -1.25;
    this.worldGroup.add(shore);

    // Strawberry milk water plane
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(13.8, 32),
      new THREE.MeshStandardMaterial({
        color: '#ffb7c5',
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.75,
      })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.1, -4);
    this.worldGroup.add(water);

    // Giant Swirled Lollipops
    [-4, 4, -6, 5].forEach((x, i) => {
      const popGroup = new THREE.Group();
      popGroup.position.set(x, 0, (i % 2 === 0 ? -1 : 3));

      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8),
        new THREE.MeshStandardMaterial({ color: '#ffffff' })
      );
      stick.position.y = 1.4;
      popGroup.add(stick);

      const candyDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 0.18, 16),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? '#f43f5e' : '#a855f7',
          roughness: 0.2,
        })
      );
      candyDisc.rotation.x = Math.PI / 2;
      candyDisc.position.y = 2.8;
      popGroup.add(candyDisc);

      this.worldGroup.add(popGroup);
    });

    // Portals
    const portalBack = this.createPortalArch('sakura_forest', '🌸 Pink Sakura Forest');
    portalBack.position.set(0, 0, 7.5);
    portalBack.rotation.y = Math.PI;
    this.worldGroup.add(portalBack);

    const portalNext = this.createPortalArch('forgotten_dreamland', '🗝️ Forgotten Dreamland');
    portalNext.position.set(0, 0, -7.5);
    this.worldGroup.add(portalNext);

    // NPC: Pip
    const pipData = gameState.getState().npcs.find((n) => n.id === 'pip')!;
    const pip = createNpcMesh(pipData);
    pip.position.set(1.5, 0, 1.2);
    this.npcsGroup.add(pip);

    // Candy Pup
    const pup = gameState.getState().dreamies.find((d) => d.id === 'candy_pup');
    if (pup && !pup.adopted) {
      const pupMesh = createDreamieMesh(pup.species, pup.colorScheme);
      pupMesh.position.set(-2, 0, 2);
      this.worldGroup.add(pupMesh);
    }
  }

  private buildForgottenDreamland() {
    // Twilight lavender misty ruins
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(15, 12, 3, 32),
      new THREE.MeshStandardMaterial({ color: '#d8b4fe', roughness: 0.85 })
    );
    ground.position.y = -1.5;
    this.worldGroup.add(ground);

    // Vintage broken classical pillars
    [-5, -2, 2, 5].forEach((x, i) => {
      const height = 2 + (i % 3) * 0.8;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, height, 12),
        new THREE.MeshStandardMaterial({ color: '#f5ebe0', roughness: 0.7 })
      );
      pillar.position.set(x, height / 2, -3 + (i % 2) * 1.5);
      pillar.castShadow = true;
      this.worldGroup.add(pillar);
    });

    // Pedestal holding the Antique Heart Key
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.8, 1.0, 12),
      new THREE.MeshStandardMaterial({ color: '#f5ebe0', roughness: 0.6 })
    );
    pedestal.position.set(0, 0.5, -1);
    this.worldGroup.add(pedestal);

    // Floating Antique Key
    const keyGroup = new THREE.Group();
    keyGroup.name = 'antique_key_prop';
    keyGroup.position.set(0, 1.45, -1);

    const keyHead = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.05, 8, 16),
      new THREE.MeshStandardMaterial({
        color: '#d4af37',
        metalness: 0.9,
        roughness: 0.2,
        emissive: '#eab308',
        emissiveIntensity: 0.4,
      })
    );
    keyGroup.add(keyHead);

    const keyShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8),
      new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 0.9, roughness: 0.2 })
    );
    keyShaft.position.y = -0.25;
    keyGroup.add(keyShaft);
    this.worldGroup.add(keyGroup);

    // Secret Door to The Forgotten Room
    const secretDoorGroup = new THREE.Group();
    secretDoorGroup.name = 'secret_room_door';
    secretDoorGroup.position.set(0, 0, -5.5);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.4, 0.4),
      new THREE.MeshStandardMaterial({ color: '#7f5539', roughness: 0.5 })
    );
    frame.position.y = 1.7;
    secretDoorGroup.add(frame);

    const doorInner = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 2.9),
      new THREE.MeshStandardMaterial({
        color: gameState.getState().hasAntiqueKey ? '#fbcfe8' : '#3e2723',
        emissive: gameState.getState().hasAntiqueKey ? '#f472b6' : '#000000',
        emissiveIntensity: 0.3,
      })
    );
    doorInner.position.set(0, 1.6, 0.21);
    secretDoorGroup.add(doorInner);
    this.worldGroup.add(secretDoorGroup);

    // Portal Back to Strawberry Village
    const portalBack = this.createPortalArch('strawberry_village', '🍓 Strawberry Village');
    portalBack.position.set(0, 0, 7.5);
    portalBack.rotation.y = Math.PI;
    this.worldGroup.add(portalBack);
  }

  private buildCottageInterior() {
    // Cozy room: wooden floor + walls
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 7.5),
      new THREE.MeshStandardMaterial({ color: '#fed7aa', roughness: 0.7 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.worldGroup.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 3.6),
      new THREE.MeshStandardMaterial({ color: '#ffe4e6', roughness: 0.8 })
    );
    backWall.position.set(0, 1.8, -3.75);
    this.worldGroup.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 3.6),
      new THREE.MeshStandardMaterial({ color: '#ffedd5', roughness: 0.8 })
    );
    leftWall.position.set(-3.75, 1.8, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.worldGroup.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(7.5, 3.6),
      new THREE.MeshStandardMaterial({ color: '#ffedd5', roughness: 0.8 })
    );
    rightWall.position.set(3.75, 1.8, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.worldGroup.add(rightWall);

    // Door back to village
    const exitDoor = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.4, 0.1),
      new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.6 })
    );
    exitDoor.position.set(0, 1.2, 3.7);
    this.worldGroup.add(exitDoor);

    // Render placed furniture
    this.updatePlacedFurniture();
  }

  private buildTheForgottenRoom() {
    // Atmospheric muted vintage pastels: faded cream & sepia
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({ color: '#d5bdaf', roughness: 0.85 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.worldGroup.add(floor);

    // Vintage wallpaper with lace border
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 4),
      new THREE.MeshStandardMaterial({ color: '#f5ebe0', roughness: 0.9 })
    );
    backWall.position.set(0, 2, -4);
    this.worldGroup.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 4),
      new THREE.MeshStandardMaterial({ color: '#e3d5ca', roughness: 0.9 })
    );
    leftWall.position.set(-4, 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.worldGroup.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 4),
      new THREE.MeshStandardMaterial({ color: '#e3d5ca', roughness: 0.9 })
    );
    rightWall.position.set(4, 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.worldGroup.add(rightWall);

    // Vintage Grandfather Clock & Vanity
    const roomDecor = createForgottenRoomDecor();
    this.worldGroup.add(roomDecor);

    // Central Ornate Table with the Legendary Music Box
    const centerTable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 0.75, 16),
      new THREE.MeshStandardMaterial({ color: '#4a2810', roughness: 0.5 })
    );
    centerTable.position.set(0, 0.375, -0.6);
    this.worldGroup.add(centerTable);

    // Lace doily
    const doily = new THREE.Mesh(
      new THREE.CircleGeometry(0.7, 16),
      new THREE.MeshStandardMaterial({ color: '#f5ebe0', roughness: 0.4 })
    );
    doily.rotation.x = -Math.PI / 2;
    doily.position.set(0, 0.76, -0.6);
    this.worldGroup.add(doily);

    // The Golden Heart Music Box
    const musicBox = createFurnitureMesh({
      id: 'antique_music_box',
      name: 'Cajita Musical Dorada',
      category: 'decor',
      emoji: '🎶',
      description: '',
      placed: true,
      position: [0, 0.76, -0.6],
      rotationY: 0,
      unlocked: true,
      costEssence: 0,
    });
    musicBox.position.set(0, 0.76, -0.6);
    this.worldGroup.add(musicBox);

    // Floating golden music box ballerina/star
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      new THREE.MeshStandardMaterial({
        color: '#fef08a',
        emissive: '#facc15',
        emissiveIntensity: 0.8,
      })
    );
    star.position.set(0, 1.25, -0.6);
    this.musicBoxStar = star;
    this.worldGroup.add(star);

    // NPC: Marion (The gentle antique doll caretaker)
    const marionData = gameState.getState().npcs.find((n) => n.id === 'marion')!;
    const marion = createNpcMesh(marionData);
    marion.position.set(-1.6, 0, -1.8);
    marion.rotation.y = Math.PI / 3;
    this.npcsGroup.add(marion);

    // Noelle the Antique Doll Dreamie (can be adopted here!)
    const noelle = gameState.getState().dreamies.find((d) => d.id === 'antique_doll');
    if (noelle && !noelle.adopted) {
      const noelleMesh = createDreamieMesh(noelle.species, noelle.colorScheme);
      noelleMesh.position.set(1.6, 0, -1.8);
      noelleMesh.rotation.y = -Math.PI / 3;
      this.worldGroup.add(noelleMesh);
    }

    // Door back to village
    const exitDoor = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.4, 0.1),
      new THREE.MeshStandardMaterial({ color: '#7f5539', roughness: 0.6 })
    );
    exitDoor.position.set(0, 1.2, 3.9);
    this.worldGroup.add(exitDoor);
  }

  private createPortalArch(targetWorld: WorldId, label: string): THREE.Group {
    const group = new THREE.Group();
    group.name = `portal_${targetWorld}`;

    const archMat = new THREE.MeshStandardMaterial({
      color: '#f472b6',
      roughness: 0.3,
      metalness: 0.1,
    });

    // Arch pillars
    [-1.2, 1.2].forEach((x) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.8, 12), archMat);
      pillar.position.set(x, 1.4, 0);
      group.add(pillar);
    });

    // Arch top
    const top = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.18, 8, 16, Math.PI), archMat);
    top.position.y = 2.8;
    group.add(top);

    // Swirling portal vortex
    const vortexGeo = new THREE.CircleGeometry(1.05, 20);
    const vortexMat = new THREE.MeshStandardMaterial({
      color: '#e0e7ff',
      emissive: '#c7d2fe',
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const vortex = new THREE.Mesh(vortexGeo, vortexMat);
    vortex.position.y = 1.8;
    group.add(vortex);

    return group;
  }

  // --- Dynamic Updates ---

  public updateGardenPlots() {
    while (this.gardenSproutsGroup.children.length > 0) {
      this.gardenSproutsGroup.remove(this.gardenSproutsGroup.children[0]);
    }

    if (gameState.getState().currentWorld !== 'strawberry_village') return;

    // Plots arranged in 2 rows of 3 on the garden bed (bed is at x: 4.5, z: -1.0)
    const plots = gameState.getState().gardenPlots;
    const offsets = [
      [-1.1, -0.6], [0, -0.6], [1.1, -0.6],
      [-1.1, 0.6],  [0, 0.6],  [1.1, 0.6],
    ];

    plots.forEach((plot, i) => {
      if (!plot.plantedSeed) return;
      const [ox, oz] = offsets[i];
      const sprout = createGardenPlotSprout(plot.growthProgress, plot.plantedSeed);
      sprout.position.set(4.5 + ox, 0.2, -1.0 + oz);
      this.gardenSproutsGroup.add(sprout);
    });
  }

  public updatePlacedFurniture() {
    while (this.furnitureGroup.children.length > 0) {
      this.furnitureGroup.remove(this.furnitureGroup.children[0]);
    }

    if (gameState.getState().currentWorld !== 'cottage_interior') return;

    const items = gameState.getState().furniture.filter((f) => f.placed);
    items.forEach((item) => {
      const mesh = createFurnitureMesh(item);
      mesh.position.set(...item.position);
      mesh.rotation.y = item.rotationY;
      this.furnitureGroup.add(mesh);
    });
  }

  private initAmbientParticles() {
    // Floating sparkles & sakura petals
    const particleCount = 45;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = 0.5 + Math.random() * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: '#fbcfe8',
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geo, mat);
    particles.name = 'ambient_particles';
    this.particlesGroup.add(particles);
  }

  // --- Input & Physics Simulation ---

  public setMoveInput(x: number, z: number) {
    this.inputX = x;
    this.inputZ = z;
  }

  public triggerJump() {
    if (this.isGrounded) {
      this.playerVelocityY = 6.2;
      this.isGrounded = false;
      soundEngine.playJump();
    }
  }

  private updateSimulation(dt: number) {
    if (this.isTitleScreen) {
      // Atmospheric cinematic orbit on title screen
      const time = this.clock.getElapsedTime() * 0.25;
      this.camera.position.x = Math.sin(time) * 11;
      this.camera.position.z = Math.cos(time) * 11;
      this.camera.position.y = 5.2 + Math.sin(time * 0.7) * 0.8;
      this.camera.lookAt(0, 1.2, 0);
      return;
    }

    // 1. Player horizontal movement
    const moveLen = Math.hypot(this.inputX, this.inputZ);
    const speed = 4.2;

    if (moveLen > 0.05) {
      const normX = this.inputX / moveLen;
      const normZ = this.inputZ / moveLen;

      this.playerPos.x += normX * speed * dt;
      this.playerPos.z += normZ * speed * dt;

      // Rotate player to face movement direction
      const targetYaw = Math.atan2(normX, normZ);
      this.playerYaw = THREE.MathUtils.damp(this.playerYaw, targetYaw, 14, dt);

      // Walk cycle animation
      this.walkTime += dt * 11;

      // Soft footstep sound
      if (this.isGrounded && this.clock.getElapsedTime() - this.lastFootstepTime > 0.28) {
        soundEngine.playFootstep();
        this.lastFootstepTime = this.clock.getElapsedTime();
      }
    } else {
      // Decay walk time to zero
      this.walkTime = THREE.MathUtils.damp(this.walkTime, 0, 10, dt);
    }

    // Boundary constraints per world
    const worldId = gameState.getState().currentWorld;
    if (worldId === 'cottage_interior' || worldId === 'the_forgotten_room') {
      this.playerPos.x = THREE.MathUtils.clamp(this.playerPos.x, -3.2, 3.2);
      this.playerPos.z = THREE.MathUtils.clamp(this.playerPos.z, -3.2, 3.2);
    } else {
      // Circular island bounds
      const dist = Math.hypot(this.playerPos.x, this.playerPos.z);
      if (dist > 9.5) {
        const factor = 9.5 / dist;
        this.playerPos.x *= factor;
        this.playerPos.z *= factor;
      }
    }

    // 2. Vertical Jump / Gravity
    if (!this.isGrounded) {
      this.playerVelocityY -= 17 * dt;
      this.playerPos.y += this.playerVelocityY * dt;
      if (this.playerPos.y <= 0) {
        this.playerPos.y = 0;
        this.playerVelocityY = 0;
        this.isGrounded = true;
      }
    }

    // 3. Update Player Mesh Transform & Bobbing
    if (this.playerGroup) {
      this.playerGroup.position.copy(this.playerPos);
      this.playerGroup.rotation.y = this.playerYaw;

      const body = this.playerGroup.getObjectByName('player_body_group');
      if (body) {
        // Bobbing & squash/stretch
        const bob = Math.sin(this.walkTime) * 0.08;
        body.position.y = bob;
        body.rotation.z = Math.sin(this.walkTime * 0.5) * 0.06;
      }
    }

    // 4. Update Companion Dreamie (Follows player with cute hops)
    if (this.companionGroup) {
      const targetDist = 1.3;
      const dx = this.playerPos.x - this.companionGroup.position.x;
      const dz = this.playerPos.z - this.companionGroup.position.z;
      const currentDist = Math.hypot(dx, dz);

      if (currentDist > targetDist) {
        const compSpeed = 4.8;
        this.companionGroup.position.x += (dx / currentDist) * compSpeed * dt;
        this.companionGroup.position.z += (dz / currentDist) * compSpeed * dt;
        this.companionGroup.rotation.y = Math.atan2(dx, dz);

        // Cute companion bouncing
        const compBody = this.companionGroup.getObjectByName('dreamie_model');
        if (compBody) {
          compBody.position.y = Math.abs(Math.sin(this.clock.getElapsedTime() * 9)) * 0.22;
        }
      } else {
        const compBody = this.companionGroup.getObjectByName('dreamie_model');
        if (compBody) {
          compBody.position.y = THREE.MathUtils.damp(compBody.position.y, 0, 8, dt);
        }
      }
    }

    // 5. Props animation (Windmill, Music Box Star)
    if (this.windmillBlades) {
      this.windmillBlades.rotation.z -= dt * 1.2;
    }
    if (this.musicBoxStar) {
      this.musicBoxStar.rotation.y += dt * 2.2;
      this.musicBoxStar.position.y = 1.25 + Math.sin(this.clock.getElapsedTime() * 3) * 0.08;
    }

    // Rotate Antique Key prop if in Forgotten Dreamland
    const keyProp = this.worldGroup.getObjectByName('antique_key_prop');
    if (keyProp) {
      keyProp.rotation.y += dt * 1.5;
      keyProp.position.y = 1.45 + Math.sin(this.clock.getElapsedTime() * 2.5) * 0.07;
    }

    // Floating particles drift
    const particles = this.particlesGroup.getObjectByName('ambient_particles') as THREE.Points;
    if (particles) {
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < arr.length / 3; i++) {
        arr[i * 3 + 1] -= dt * 0.25;
        arr[i * 3] += Math.sin(this.clock.getElapsedTime() + i) * dt * 0.15;
        if (arr[i * 3 + 1] < 0.2) {
          arr[i * 3 + 1] = 5.5;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 6. Camera Follow with Smooth Exponential Damping
    const idealCamPos = new THREE.Vector3()
      .copy(this.playerPos)
      .add(this.cameraOffset);

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, idealCamPos.x, 6, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, idealCamPos.y, 6, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, idealCamPos.z, 6, dt);

    this.cameraLookTarget.x = THREE.MathUtils.damp(this.cameraLookTarget.x, this.playerPos.x, 8, dt);
    this.cameraLookTarget.y = THREE.MathUtils.damp(this.cameraLookTarget.y, this.playerPos.y + 1.1, 8, dt);
    this.cameraLookTarget.z = THREE.MathUtils.damp(this.cameraLookTarget.z, this.playerPos.z, 8, dt);

    this.camera.lookAt(this.cameraLookTarget);

    // 7. Check Proximity Interactions
    this.checkInteractions();
  }

  private checkInteractions() {
    const worldId = gameState.getState().currentWorld;
    let nearest: InteractionTarget | null = null;
    let minDistance = 2.4;

    const testTarget = (target: InteractionTarget) => {
      const dist = this.playerPos.distanceTo(target.position);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = target;
      }
    };

    if (worldId === 'strawberry_village') {
      // 1. Cottage door
      testTarget({
        type: 'cottage_door',
        label: 'Entrar a tu Casita',
        prompt: 'Presiona E o toca para entrar a tu casita acogedora 🌸',
        position: new THREE.Vector3(0, 0, -0.4),
      });

      // 2. Garden Bed
      testTarget({
        type: 'garden',
        label: 'Huerto de Fresas',
        prompt: 'Presiona E o toca para cuidar y cosechar tu huerto 🍓',
        position: new THREE.Vector3(4.5, 0, -1.0),
      });

      // 3. NPC Pompon
      testTarget({
        type: 'npc',
        id: 'pompon',
        label: 'Hablar con Pompon',
        prompt: 'Presiona E o toca para hablar con Pompon 🐰',
        position: new THREE.Vector3(-2.2, 0, 1.2),
      });

      // 4. Portal to Cloudy Kingdom
      testTarget({
        type: 'portal',
        id: 'cloudy_kingdom',
        label: 'Viajar a Cloudy Kingdom',
        prompt: 'Presiona E o toca para viajar a Cloudy Kingdom ☁️',
        position: new THREE.Vector3(0, 0, 8.0),
      });
    } else if (worldId === 'cottage_interior') {
      // Exit door
      testTarget({
        type: 'cottage_door',
        label: 'Salir al Jardín',
        prompt: 'Presiona E o toca para volver a Strawberry Village 🍓',
        position: new THREE.Vector3(0, 0, 3.2),
      });
    } else if (worldId === 'the_forgotten_room') {
      // Music Box
      testTarget({
        type: 'music_box',
        label: 'Dar Cuerda a la Cajita Musical',
        prompt: 'Presiona E o toca para escuchar la melodía nostálgica 🎶',
        position: new THREE.Vector3(0, 0, -0.6),
      });

      // NPC Marion
      testTarget({
        type: 'npc',
        id: 'marion',
        label: 'Hablar con Marion',
        prompt: 'Presiona E o toca para hablar con Marion 🎀',
        position: new THREE.Vector3(-1.6, 0, -1.8),
      });

      // Exit
      testTarget({
        type: 'portal',
        id: 'strawberry_village',
        label: 'Salir de la Habitación',
        prompt: 'Presiona E o toca para regresar al jardín de ensueño 🌸',
        position: new THREE.Vector3(0, 0, 3.5),
      });
    } else if (worldId === 'forgotten_dreamland') {
      // Antique Key Pedestal
      if (!gameState.getState().hasAntiqueKey) {
        testTarget({
          type: 'key',
          label: 'Recoger Llave Antigua de Latón',
          prompt: 'Presiona E o toca para recoger la Llave del Cuarto Olvidado 🗝️',
          position: new THREE.Vector3(0, 0, -1),
        });
      }

      // Secret Room Door
      testTarget({
        type: 'portal',
        id: 'the_forgotten_room',
        label: 'Abrir The Forgotten Room',
        prompt: gameState.getState().hasAntiqueKey
          ? 'Presiona E para usar la Llave Antigua y entrar 🗝️'
          : 'La puerta está sellada con un candado antiguo de corazón... 🔒',
        position: new THREE.Vector3(0, 0, -5.0),
      });

      // Portal Back
      testTarget({
        type: 'portal',
        id: 'strawberry_village',
        label: 'Regresar a Strawberry Village',
        prompt: 'Presiona E para viajar a Strawberry Village 🍓',
        position: new THREE.Vector3(0, 0, 7.0),
      });
    } else if (worldId === 'cloudy_kingdom') {
      // NPC Celeste
      testTarget({
        type: 'npc',
        id: 'celeste',
        label: 'Hablar con Celeste',
        prompt: 'Presiona E o toca para hablar con Celeste 🐑',
        position: new THREE.Vector3(-1.8, 0, 1.5),
      });

      testTarget({
        type: 'portal',
        id: 'strawberry_village',
        label: 'Regresar a Strawberry Village',
        prompt: 'Presiona E o toca para volver a Strawberry Village 🍓',
        position: new THREE.Vector3(0, 0, 7.0),
      });

      testTarget({
        type: 'portal',
        id: 'sakura_forest',
        label: 'Viajar a Sakura Forest',
        prompt: 'Presiona E o toca para viajar a Sakura Forest 🌸',
        position: new THREE.Vector3(0, 0, -7.0),
      });
    } else if (worldId === 'sakura_forest') {
      // NPC Hana
      testTarget({
        type: 'npc',
        id: 'hana',
        label: 'Hablar con Hana',
        prompt: 'Presiona E o toca para hablar con Hana 🦊',
        position: new THREE.Vector3(0, 0, -2.5),
      });

      testTarget({
        type: 'portal',
        id: 'cloudy_kingdom',
        label: 'Regresar a Cloudy Kingdom',
        prompt: 'Presiona E o toca para volver a Cloudy Kingdom ☁️',
        position: new THREE.Vector3(0, 0, 7.0),
      });

      testTarget({
        type: 'portal',
        id: 'candy_ocean',
        label: 'Viajar a Candy Ocean',
        prompt: 'Presiona E o toca para viajar a Candy Ocean 🍬',
        position: new THREE.Vector3(0, 0, -7.0),
      });
    } else if (worldId === 'candy_ocean') {
      // NPC Pip
      testTarget({
        type: 'npc',
        id: 'pip',
        label: 'Hablar con Pip',
        prompt: 'Presiona E o toca para hablar con Pip 🦦',
        position: new THREE.Vector3(1.5, 0, 1.2),
      });

      testTarget({
        type: 'portal',
        id: 'sakura_forest',
        label: 'Regresar a Sakura Forest',
        prompt: 'Presiona E o toca para volver a Sakura Forest 🌸',
        position: new THREE.Vector3(0, 0, 7.0),
      });

      testTarget({
        type: 'portal',
        id: 'forgotten_dreamland',
        label: 'Viajar a Forgotten Dreamland',
        prompt: 'Presiona E o toca para viajar a Forgotten Dreamland 🗝️',
        position: new THREE.Vector3(0, 0, -7.0),
      });
    }

    // Check adopted companion petting
    if (this.companionGroup) {
      testTarget({
        type: 'dreamie',
        id: gameState.getState().activeCompanionId,
        label: 'Acariciar Compañero',
        prompt: 'Presiona E o toca para acariciar a tu fiel Dreamie 💖',
        position: this.companionGroup.position,
      });
    }

    if (nearest !== this.currentInteraction) {
      this.currentInteraction = nearest;
      if (this.onNearInteraction) {
        this.onNearInteraction(nearest);
      }
    }
  }

  // --- Render Loop ---

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.isDestroyed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private tick() {
    if (this.isDestroyed) return;

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05);

    this.updateSimulation(dt);
    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  }

  public destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.handleResize);

    if (this.isSoftwareGl) {
      clearTimeout(this.frameId);
    } else {
      cancelAnimationFrame(this.frameId);
    }

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
