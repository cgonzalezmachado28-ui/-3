import * as THREE from 'three';
import { OutfitConfig, DreamieSpecies, FurnitureItem, NPC } from '../types/game';

// Procedural texture cache to avoid memory leaks
const textureCache = new Map<string, THREE.Texture>();

export function getFaceCanvasTexture(type: 'happy' | 'sleepy' | 'antique' | 'wink'): THREE.CanvasTexture {
  const key = `face_${type}`;
  if (textureCache.has(key)) {
    return textureCache.get(key) as THREE.CanvasTexture;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 256, 256);

  if (type === 'antique') {
    // Mismatched button eyes & vintage sewn mouth for Marion / Antique Doll
    // Left eye: porcelain button with 4 thread holes
    ctx.fillStyle = '#f5ebe0';
    ctx.beginPath();
    ctx.arc(80, 110, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#b08968';
    ctx.stroke();

    // Button holes
    ctx.fillStyle = '#6b4f35';
    [[-8, -8], [8, -8], [-8, 8], [8, 8]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(80 + dx, 110 + dy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Right eye: shiny dark button with sparkle
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(176, 110, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(170, 104, 6, 0, Math.PI * 2);
    ctx.fill();

    // Vintage stitched mouth
    ctx.strokeStyle = '#7f5539';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(128, 140, 22, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Stitches
    [112, 128, 144].forEach((sx) => {
      ctx.beginPath();
      ctx.moveTo(sx, 150);
      ctx.lineTo(sx, 162);
      ctx.stroke();
    });

    // Dusty rose blush
    ctx.fillStyle = 'rgba(219, 146, 161, 0.35)';
    ctx.beginPath();
    ctx.ellipse(65, 140, 20, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(191, 140, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Standard Kawaii Anime Face
    // Big dark sparkling eyes
    ctx.fillStyle = '#2d1b2d';
    ctx.beginPath();
    ctx.ellipse(82, 110, 18, 24, 0, 0, Math.PI * 2);
    ctx.ellipse(174, 110, 18, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye sparkles (starbursts)
    ctx.fillStyle = '#ffffff';
    // Big upper highlights
    ctx.beginPath();
    ctx.arc(77, 100, 7, 0, Math.PI * 2);
    ctx.arc(169, 100, 7, 0, Math.PI * 2);
    ctx.fill();
    // Small lower highlights
    ctx.beginPath();
    ctx.arc(88, 122, 4, 0, Math.PI * 2);
    ctx.arc(180, 122, 4, 0, Math.PI * 2);
    ctx.fill();

    // Kawaii blushing cheeks with little heart accents
    ctx.fillStyle = 'rgba(255, 130, 170, 0.6)';
    ctx.beginPath();
    ctx.ellipse(65, 138, 22, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(191, 138, 22, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiny sweet smile
    ctx.strokeStyle = '#6b2d42';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(128, 126, 14, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}

export function createContactShadow(): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(30, 10, 30, 0.45)');
  gradient.addColorStop(0.5, 'rgba(30, 10, 30, 0.2)');
  gradient.addColorStop(1, 'rgba(30, 10, 30, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(1.4, 1.4);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.02;
  return mesh;
}

// --- Player Chibi Character ---

export function createPlayerCharacter(outfit: OutfitConfig): THREE.Group {
  const root = new THREE.Group();
  root.name = 'player';

  // Shadow
  root.add(createContactShadow());

  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'player_body_group';

  // 1. Head (Primary)
  const headGeo = new THREE.SphereGeometry(0.48, 24, 20);
  headGeo.scale(1.05, 1, 0.95);
  const skinMat = new THREE.MeshStandardMaterial({
    color: '#ffe5db',
    roughness: 0.6,
    metalness: 0.05,
  });
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.position.y = 1.05;
  headMesh.castShadow = true;
  bodyGroup.add(headMesh);

  // Face overlay (decal on front)
  const faceGeo = new THREE.PlaneGeometry(0.55, 0.55);
  const faceMat = new THREE.MeshBasicMaterial({
    map: getFaceCanvasTexture('happy'),
    transparent: true,
    depthWrite: false,
  });
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.position.set(0, 1.05, 0.46);
  bodyGroup.add(faceMesh);

  // 2. Hair (Twintails / Bob / Fluffy)
  const hairMat = new THREE.MeshStandardMaterial({
    color: outfit.hairColor,
    roughness: 0.45,
    metalness: 0.1,
  });

  const hairCapGeo = new THREE.SphereGeometry(0.52, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.y = 1.08;
  bodyGroup.add(hairCap);

  // Bangs
  const bangsGeo = new THREE.CapsuleGeometry(0.12, 0.28, 8, 8);
  const bangs = new THREE.Mesh(bangsGeo, hairMat);
  bangs.rotation.z = Math.PI / 2;
  bangs.position.set(0, 1.34, 0.38);
  bodyGroup.add(bangs);

  if (outfit.hairStyle === 'twintails') {
    [-0.52, 0.52].forEach((x) => {
      const pigtail = new THREE.Group();
      pigtail.position.set(x, 1.15, -0.05);

      const tieGeo = new THREE.TorusGeometry(0.08, 0.03, 8, 16);
      const tieMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', roughness: 0.3 });
      const tie = new THREE.Mesh(tieGeo, tieMat);
      tie.rotation.y = Math.PI / 2;
      pigtail.add(tie);

      const tailGeo = new THREE.ConeGeometry(0.16, 0.65, 12);
      tailGeo.rotateX(Math.PI);
      const tail = new THREE.Mesh(tailGeo, hairMat);
      tail.position.y = -0.32;
      tail.rotation.z = x > 0 ? -0.2 : 0.2;
      pigtail.add(tail);

      bodyGroup.add(pigtail);
    });
  } else if (outfit.hairStyle === 'bob') {
    [-0.48, 0.48].forEach((x) => {
      const bobCurl = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), hairMat);
      bobCurl.position.set(x, 0.95, -0.05);
      bobCurl.scale.set(0.8, 1.4, 0.8);
      bodyGroup.add(bobCurl);
    });
  }

  // 3. Headwear
  if (outfit.headwear === 'bunny_ears') {
    [-0.22, 0.22].forEach((x) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(x, 1.52, 0.05);
      earGroup.rotation.z = x > 0 ? -0.15 : 0.15;

      const outerGeo = new THREE.ConeGeometry(0.13, 0.5, 12);
      const outerMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 });
      const outer = new THREE.Mesh(outerGeo, outerMat);
      earGroup.add(outer);

      const innerGeo = new THREE.ConeGeometry(0.08, 0.42, 10);
      const innerMat = new THREE.MeshStandardMaterial({ color: '#ffb7c5', roughness: 0.3 });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      inner.position.z = 0.04;
      earGroup.add(inner);

      bodyGroup.add(earGroup);
    });
  } else if (outfit.headwear === 'strawberry_beret') {
    const beretGeo = new THREE.CylinderGeometry(0.42, 0.32, 0.16, 16);
    const beretMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', roughness: 0.3 });
    const beret = new THREE.Mesh(beretGeo, beretMat);
    beret.position.set(0.1, 1.55, 0.02);
    beret.rotation.z = -0.2;

    const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.14, 6);
    const stemMat = new THREE.MeshStandardMaterial({ color: '#22c55e' });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0.1, 1.68, 0.02);
    bodyGroup.add(beret);
    bodyGroup.add(stem);
  } else if (outfit.headwear === 'sakura_bow') {
    const bowGeo = new THREE.TorusGeometry(0.14, 0.05, 8, 16);
    const bowMat = new THREE.MeshStandardMaterial({ color: '#f472b6', roughness: 0.25 });
    const bow = new THREE.Mesh(bowGeo, bowMat);
    bow.position.set(0, 1.55, 0.15);
    bow.rotation.x = Math.PI / 4;
    bodyGroup.add(bow);
  } else if (outfit.headwear === 'star_halo') {
    const haloGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 24);
    const haloMat = new THREE.MeshStandardMaterial({
      color: '#facc15',
      roughness: 0.2,
      metalness: 0.8,
      emissive: '#eab308',
      emissiveIntensity: 0.4,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 1.72, 0);
    halo.rotation.x = Math.PI / 2;
    bodyGroup.add(halo);
  }

  // 4. Dress / Torso
  const dressMat = new THREE.MeshStandardMaterial({
    color: outfit.dressColor,
    roughness: 0.5,
    metalness: 0.05,
  });

  // Frilly skirt
  const skirtGeo = new THREE.ConeGeometry(0.45, 0.42, 16, 1, true);
  const skirt = new THREE.Mesh(skirtGeo, dressMat);
  skirt.position.y = 0.44;
  bodyGroup.add(skirt);

  // Torso upper
  const upperGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.35, 12);
  const upper = new THREE.Mesh(upperGeo, dressMat);
  upper.position.y = 0.72;
  bodyGroup.add(upper);

  // White lace trim at bottom
  const laceGeo = new THREE.TorusGeometry(0.45, 0.03, 6, 20);
  const laceMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 });
  const lace = new THREE.Mesh(laceGeo, laceMat);
  lace.rotation.x = Math.PI / 2;
  lace.position.y = 0.24;
  bodyGroup.add(lace);

  // 5. Arms & Paws
  [-0.32, 0.32].forEach((x) => {
    const armGeo = new THREE.CapsuleGeometry(0.08, 0.24, 6, 6);
    const arm = new THREE.Mesh(armGeo, dressMat);
    arm.position.set(x, 0.65, 0.05);
    arm.rotation.z = x > 0 ? -0.2 : 0.2;
    bodyGroup.add(arm);
  });

  // 6. Feet / Shoes
  [-0.15, 0.15].forEach((x) => {
    const shoeGeo = new THREE.SphereGeometry(0.12, 10, 10);
    shoeGeo.scale(0.9, 0.8, 1.3);
    const shoeMat = new THREE.MeshStandardMaterial({ color: '#be185d', roughness: 0.3 });
    const shoe = new THREE.Mesh(shoeGeo, shoeMat);
    shoe.position.set(x, 0.1, 0.06);
    bodyGroup.add(shoe);
  });

  // 7. Wings / Back accessory
  if (outfit.wings === 'angel_wings' || outfit.wings === 'fairy_wings') {
    [-0.22, 0.22].forEach((x) => {
      const wingGeo = new THREE.ConeGeometry(0.18, 0.46, 8);
      wingGeo.rotateZ(x > 0 ? Math.PI / 3 : -Math.PI / 3);
      const wingMat = new THREE.MeshStandardMaterial({
        color: outfit.wings === 'fairy_wings' ? '#bae6fd' : '#ffffff',
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
      });
      const wing = new THREE.Mesh(wingGeo, wingMat);
      wing.position.set(x, 0.74, -0.25);
      bodyGroup.add(wing);
    });
  } else if (outfit.wings === 'backpack') {
    const packGeo = new THREE.BoxGeometry(0.28, 0.28, 0.16);
    const packMat = new THREE.MeshStandardMaterial({ color: '#f43f5e', roughness: 0.4 });
    const pack = new THREE.Mesh(packGeo, packMat);
    pack.position.set(0, 0.7, -0.25);
    bodyGroup.add(pack);
  }

  root.add(bodyGroup);
  return root;
}

// --- Kawaii Dreamies ---

export function createDreamieMesh(species: DreamieSpecies, colors: { primary: string; secondary: string; accent: string }): THREE.Group {
  const root = new THREE.Group();
  root.name = `dreamie_${species}`;

  // Ground shadow
  root.add(createContactShadow());

  const model = new THREE.Group();
  model.name = 'dreamie_model';

  const bodyMat = new THREE.MeshStandardMaterial({
    color: colors.primary,
    roughness: 0.5,
    metalness: 0.05,
  });

  const secMat = new THREE.MeshStandardMaterial({
    color: colors.secondary,
    roughness: 0.4,
    metalness: 0.05,
  });

  const accMat = new THREE.MeshStandardMaterial({
    color: colors.accent,
    roughness: 0.3,
    metalness: 0.1,
  });

  if (species === 'mochi_bun') {
    // Fluffy Bunny
    const bodyGeo = new THREE.SphereGeometry(0.38, 16, 16);
    bodyGeo.scale(1.1, 0.95, 1.0);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.36;
    body.castShadow = true;
    model.add(body);

    // Bunny Ears
    [-0.14, 0.14].forEach((x) => {
      const earGeo = new THREE.CapsuleGeometry(0.08, 0.34, 8, 8);
      const ear = new THREE.Mesh(earGeo, bodyMat);
      ear.position.set(x, 0.76, -0.05);
      ear.rotation.z = x > 0 ? -0.15 : 0.15;

      const innerEarGeo = new THREE.CapsuleGeometry(0.05, 0.28, 6, 6);
      const innerEar = new THREE.Mesh(innerEarGeo, secMat);
      innerEar.position.set(0, 0, 0.04);
      ear.add(innerEar);

      model.add(ear);
    });

    // Strawberry Hairpin
    const berryGeo = new THREE.ConeGeometry(0.07, 0.12, 8);
    berryGeo.rotateX(Math.PI);
    const berry = new THREE.Mesh(berryGeo, accMat);
    berry.position.set(0.24, 0.62, 0.18);
    model.add(berry);

    // Cute Tail
    const tailGeo = new THREE.SphereGeometry(0.1, 10, 10);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.set(0, 0.3, -0.4);
    model.add(tail);

    // Face Decal
    const faceDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.42),
      new THREE.MeshBasicMaterial({ map: getFaceCanvasTexture('happy'), transparent: true, depthWrite: false })
    );
    faceDecal.position.set(0, 0.38, 0.38);
    model.add(faceDecal);
  } else if (species === 'antique_doll') {
    // The Forgotten Room's secret vintage doll bunny
    const dollMat = new THREE.MeshStandardMaterial({
      color: '#f5ebe0',
      roughness: 0.85, // soft antique cloth
      metalness: 0.05,
    });
    const laceMat = new THREE.MeshStandardMaterial({
      color: '#e6ccb2',
      roughness: 0.6,
    });

    // Body
    const bodyGeo = new THREE.SphereGeometry(0.36, 16, 14);
    const body = new THREE.Mesh(bodyGeo, dollMat);
    body.position.y = 0.38;
    body.castShadow = true;
    model.add(body);

    // Antique floppy bunny ears (bent wistfully)
    [-0.14, 0.14].forEach((x) => {
      const earGeo = new THREE.CapsuleGeometry(0.07, 0.38, 8, 8);
      const ear = new THREE.Mesh(earGeo, dollMat);
      ear.position.set(x, 0.72, -0.05);
      ear.rotation.z = x > 0 ? 0.4 : -0.4; // floppy
      ear.rotation.x = 0.2;
      model.add(ear);
    });

    // Vintage lace collar frill
    const collarGeo = new THREE.TorusGeometry(0.22, 0.06, 6, 16);
    const collar = new THREE.Mesh(collarGeo, laceMat);
    collar.position.y = 0.24;
    collar.rotation.x = Math.PI / 2;
    model.add(collar);

    // Vintage sewn face with button eyes
    const faceDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.42),
      new THREE.MeshBasicMaterial({ map: getFaceCanvasTexture('antique'), transparent: true, depthWrite: false })
    );
    faceDecal.position.set(0, 0.38, 0.36);
    model.add(faceDecal);

    // Miniature heart key charm
    const keyGeo = new THREE.TorusGeometry(0.04, 0.015, 6, 10);
    const keyMat = new THREE.MeshStandardMaterial({ color: '#b08968', metalness: 0.7, roughness: 0.3 });
    const keyMesh = new THREE.Mesh(keyGeo, keyMat);
    keyMesh.position.set(0, 0.18, 0.25);
    model.add(keyMesh);
  } else if (species === 'starry_bear') {
    // Starry Bear
    const bodyGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.4;
    body.castShadow = true;
    model.add(body);

    // Round Bear Ears
    [-0.24, 0.24].forEach((x) => {
      const earGeo = new THREE.SphereGeometry(0.14, 12, 12);
      const ear = new THREE.Mesh(earGeo, secMat);
      ear.position.set(x, 0.74, 0);
      model.add(ear);
    });

    // Star Emblem
    const starGeo = new THREE.OctahedronGeometry(0.12, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: '#fde047',
      emissive: '#facc15',
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.6,
    });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.set(0, 0.35, 0.38);
    model.add(star);

    // Face Decal
    const faceDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.4),
      new THREE.MeshBasicMaterial({ map: getFaceCanvasTexture('sleepy'), transparent: true, depthWrite: false })
    );
    faceDecal.position.set(0, 0.45, 0.38);
    model.add(faceDecal);
  } else {
    // Cloud Kitten, Ribbon Deer, Candy Pup
    const bodyGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.38;
    body.castShadow = true;
    model.add(body);

    // Pointed ears / Antlers
    [-0.18, 0.18].forEach((x) => {
      const earGeo = new THREE.ConeGeometry(0.1, 0.22, 8);
      const ear = new THREE.Mesh(earGeo, secMat);
      ear.position.set(x, 0.72, 0);
      model.add(ear);
    });

    // Fluffy tail
    const tailGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const tail = new THREE.Mesh(tailGeo, secMat);
    tail.position.set(0, 0.34, -0.42);
    model.add(tail);

    // Face Decal
    const faceDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.42),
      new THREE.MeshBasicMaterial({ map: getFaceCanvasTexture('happy'), transparent: true, depthWrite: false })
    );
    faceDecal.position.set(0, 0.4, 0.37);
    model.add(faceDecal);
  }

  root.add(model);
  return root;
}

// --- NPC 3D Characters ---

export function createNpcMesh(npc: NPC): THREE.Group {
  const root = new THREE.Group();
  root.name = `npc_${npc.id}`;
  root.add(createContactShadow());

  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'npc_body';

  const furMat = new THREE.MeshStandardMaterial({
    color: npc.avatarColors.fur,
    roughness: 0.5,
  });
  const clothesMat = new THREE.MeshStandardMaterial({
    color: npc.avatarColors.clothes,
    roughness: 0.4,
  });

  // Head
  const headGeo = new THREE.SphereGeometry(0.45, 18, 18);
  const head = new THREE.Mesh(headGeo, furMat);
  head.position.y = 1.05;
  head.castShadow = true;
  bodyGroup.add(head);

  // Face
  const faceTexture = npc.id === 'marion' ? getFaceCanvasTexture('antique') : getFaceCanvasTexture('happy');
  const faceDecal = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.5),
    new THREE.MeshBasicMaterial({ map: faceTexture, transparent: true, depthWrite: false })
  );
  faceDecal.position.set(0, 1.05, 0.44);
  bodyGroup.add(faceDecal);

  // Body / Outfit
  const torsoGeo = new THREE.ConeGeometry(0.4, 0.65, 14);
  const torso = new THREE.Mesh(torsoGeo, clothesMat);
  torso.position.y = 0.5;
  torso.castShadow = true;
  bodyGroup.add(torso);

  // Ears / Hat per NPC
  if (npc.id === 'pompon') {
    // Bunny Ears + Chef Hat
    [-0.15, 0.15].forEach((x) => {
      const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.42, 6, 6), furMat);
      ear.position.set(x, 1.5, 0);
      ear.rotation.z = x > 0 ? -0.15 : 0.15;
      bodyGroup.add(ear);
    });

    const hatGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.28, 12);
    const hat = new THREE.Mesh(hatGeo, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 }));
    hat.position.set(0, 1.55, 0);
    bodyGroup.add(hat);
  } else if (npc.id === 'celeste') {
    // Sheep horns
    [-0.32, 0.32].forEach((x) => {
      const hornGeo = new THREE.TorusGeometry(0.12, 0.04, 6, 12, Math.PI * 1.5);
      const hornMat = new THREE.MeshStandardMaterial({ color: '#fde047', roughness: 0.3 });
      const horn = new THREE.Mesh(hornGeo, hornMat);
      horn.position.set(x, 1.25, 0);
      horn.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
      bodyGroup.add(horn);
    });
  } else if (npc.id === 'hana') {
    // Fox ears & cherry blossom flower
    [-0.2, 0.2].forEach((x) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), furMat);
      ear.position.set(x, 1.48, 0);
      bodyGroup.add(ear);
    });
  } else if (npc.id === 'marion') {
    // Victorian antique lace bonnet
    const bonnetGeo = new THREE.SphereGeometry(0.48, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const bonnetMat = new THREE.MeshStandardMaterial({ color: '#e9d5ff', roughness: 0.6 });
    const bonnet = new THREE.Mesh(bonnetGeo, bonnetMat);
    bonnet.position.set(0, 1.1, -0.05);
    bodyGroup.add(bonnet);
  }

  // Floating quest indicator exclamation / heart above head
  const markerGroup = new THREE.Group();
  markerGroup.name = 'npc_marker';
  markerGroup.position.set(0, 1.95, 0);

  const heartGeo = new THREE.OctahedronGeometry(0.16, 0);
  const heartMat = new THREE.MeshStandardMaterial({
    color: '#ff4d6d',
    emissive: '#ff758f',
    emissiveIntensity: 0.6,
    roughness: 0.2,
  });
  const heart = new THREE.Mesh(heartGeo, heartMat);
  markerGroup.add(heart);
  bodyGroup.add(markerGroup);

  root.add(bodyGroup);
  return root;
}

// --- Environment & Props ---

export function createGiantStrawberry(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'prop_giant_strawberry';

  // Strawberry body
  const bodyGeo = new THREE.ConeGeometry(0.8, 1.4, 16);
  bodyGeo.rotateX(Math.PI);
  const berryMat = new THREE.MeshStandardMaterial({
    color: '#f43f5e',
    roughness: 0.3,
    metalness: 0.05,
  });
  const body = new THREE.Mesh(bodyGeo, berryMat);
  body.position.y = 0.7;
  body.castShadow = true;
  group.add(body);

  // Calyx Leaves
  for (let i = 0; i < 5; i++) {
    const leafGeo = new THREE.ConeGeometry(0.18, 0.45, 6);
    leafGeo.rotateX(Math.PI / 2.5);
    const leafMat = new THREE.MeshStandardMaterial({ color: '#4ade80', roughness: 0.4 });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.rotation.y = (i * Math.PI * 2) / 5;
    leaf.position.y = 1.35;
    group.add(leaf);
  }

  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8);
  const stem = new THREE.Mesh(stemGeo, new THREE.MeshStandardMaterial({ color: '#22c55e' }));
  stem.position.y = 1.5;
  group.add(stem);

  group.add(createContactShadow());
  return group;
}

export function createSakuraTree(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'prop_sakura_tree';

  // Twisted Trunk (3 segments)
  const trunkMat = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.8 });
  const trunkLower = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 1.6, 8), trunkMat);
  trunkLower.position.y = 0.8;
  trunkLower.castShadow = true;
  group.add(trunkLower);

  const trunkUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.4, 8), trunkMat);
  trunkUpper.position.set(0.15, 1.9, 0);
  trunkUpper.rotation.z = -0.15;
  trunkUpper.castShadow = true;
  group.add(trunkUpper);

  // 3-Part Fluffy Blossom Clusters
  const blossomMat = new THREE.MeshStandardMaterial({
    color: '#fbcfe8',
    roughness: 0.6,
  });

  const clusters = [
    { x: 0, y: 2.8, z: 0, s: 1.3 },
    { x: -0.6, y: 2.4, z: 0.4, s: 0.95 },
    { x: 0.7, y: 2.3, z: -0.3, s: 1.0 },
  ];

  clusters.forEach(({ x, y, z, s }) => {
    const foliageGeo = new THREE.DodecahedronGeometry(s, 1);
    const foliage = new THREE.Mesh(foliageGeo, blossomMat);
    foliage.position.set(x, y, z);
    foliage.castShadow = true;
    group.add(foliage);
  });

  group.add(createContactShadow());
  return group;
}

export function createCottageHouse(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'prop_cottage_exterior';

  // 1. Base Wall (Pastel cream / strawberry)
  const wallGeo = new THREE.CylinderGeometry(2.4, 2.6, 2.2, 16);
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#fff1f2',
    roughness: 0.65,
  });
  const walls = new THREE.Mesh(wallGeo, wallMat);
  walls.position.y = 1.1;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);

  // 2. Strawberry Thatched Roof (Cone with cute scalloped trim)
  const roofGeo = new THREE.ConeGeometry(3.1, 2.2, 16);
  const roofMat = new THREE.MeshStandardMaterial({
    color: '#fb7185',
    roughness: 0.5,
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 3.1;
  roof.castShadow = true;
  group.add(roof);

  // Roof Green Stem topper
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: '#4ade80' })
  );
  stem.position.y = 4.3;
  group.add(stem);

  // 3. Wooden Door (Arched)
  const doorGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.3, 12, 1, false, 0, Math.PI);
  const doorMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.6 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 0.65, 2.38);
  door.rotation.y = -Math.PI / 2;
  group.add(door);

  // Cute heart door handle
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.7, roughness: 0.2 })
  );
  handle.position.set(0.35, 0.7, 2.45);
  group.add(handle);

  // 4. Windows with flower boxes
  [-1.6, 1.6].forEach((x) => {
    const windowFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.05, 8, 16),
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 })
    );
    windowFrame.position.set(x, 1.3, 1.6);
    windowFrame.rotation.y = x > 0 ? -Math.PI / 4 : Math.PI / 4;
    group.add(windowFrame);
  });

  return group;
}

export function createGardenBed(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'garden_bed';

  // Wooden fence frame
  const frameGeo = new THREE.BoxGeometry(4.2, 0.25, 2.6);
  const frameMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.7 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.y = 0.12;
  frame.receiveShadow = true;
  group.add(frame);

  // Soil ground
  const soilGeo = new THREE.BoxGeometry(3.9, 0.22, 2.3);
  const soilMat = new THREE.MeshStandardMaterial({ color: '#573318', roughness: 0.9 });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = 0.15;
  soil.receiveShadow = true;
  group.add(soil);

  return group;
}

export function createGardenPlotSprout(progress: number, seedType: string): THREE.Group {
  const group = new THREE.Group();

  if (progress < 0.3) {
    // Tiny green sprout
    const sprout = new THREE.Mesh(
      new THREE.ConeGeometry(0.06, 0.18, 6),
      new THREE.MeshStandardMaterial({ color: '#86efac' })
    );
    sprout.position.y = 0.09;
    group.add(sprout);
  } else if (progress < 0.75) {
    // Growing stem with two leaves
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.32, 6),
      new THREE.MeshStandardMaterial({ color: '#22c55e' })
    );
    stem.position.y = 0.16;
    group.add(stem);

    [-0.1, 0.1].forEach((x) => {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 6, 6),
        new THREE.MeshStandardMaterial({ color: '#4ade80' })
      );
      leaf.scale.set(1.5, 0.3, 0.8);
      leaf.position.set(x, 0.25, 0);
      group.add(leaf);
    });
  } else {
    // Fully mature & harvestable!
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.45, 6),
      new THREE.MeshStandardMaterial({ color: '#16a34a' })
    );
    stem.position.y = 0.22;
    group.add(stem);

    // Fruit / Flower
    let fruitColor = '#f43f5e';
    if (seedType === 'sakura_blossom') fruitColor = '#f472b6';
    if (seedType === 'star_lily') fruitColor = '#facc15';
    if (seedType === 'marshmallow_bloom') fruitColor = '#c084fc';

    const fruit = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.18, 0),
      new THREE.MeshStandardMaterial({ color: fruitColor, roughness: 0.3, emissive: fruitColor, emissiveIntensity: 0.2 })
    );
    fruit.position.y = 0.52;
    group.add(fruit);
  }

  return group;
}

// --- Furniture 3D Models for Cottage ---

export function createFurnitureMesh(item: FurnitureItem): THREE.Group {
  const group = new THREE.Group();
  group.name = `furniture_${item.id}`;

  if (item.category === 'bed') {
    // Canopy Bed
    const frameMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
    const quiltMat = new THREE.MeshStandardMaterial({ color: '#fbcfe8', roughness: 0.6 });

    // Bed base
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 2.2), frameMat);
    base.position.y = 0.18;
    group.add(base);

    // Mattress & quilt
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.25, 2.05), quiltMat);
    mattress.position.y = 0.38;
    group.add(mattress);

    // Pillows
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.15, 0.45),
      new THREE.MeshStandardMaterial({ color: '#ffffff' })
    );
    pillow.position.set(0, 0.52, -0.7);
    group.add(pillow);

    // 4 Corner Posts + Canopy Frame
    [-0.75, 0.75].forEach((x) => {
      [-1.05, 1.05].forEach((z) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8), frameMat);
        post.position.set(x, 0.9, z);
        group.add(post);
      });
    });

    // Silk Drape Canopy
    const drape = new THREE.Mesh(
      new THREE.PlaneGeometry(1.55, 2.15),
      new THREE.MeshStandardMaterial({ color: '#ffe4e6', transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    drape.rotation.x = Math.PI / 2;
    drape.position.y = 1.8;
    group.add(drape);
  } else if (item.category === 'rug') {
    // Strawberry Rug
    const rugCanvas = document.createElement('canvas');
    rugCanvas.width = 128;
    rugCanvas.height = 128;
    const rCtx = rugCanvas.getContext('2d')!;
    rCtx.fillStyle = '#ff6b8b';
    rCtx.beginPath();
    rCtx.arc(64, 64, 58, 0, Math.PI * 2);
    rCtx.fill();
    // Yellow seed dots
    rCtx.fillStyle = '#fef08a';
    for (let r = 0; r < 14; r++) {
      const rx = 30 + Math.random() * 68;
      const ry = 30 + Math.random() * 68;
      rCtx.beginPath();
      rCtx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      rCtx.fill();
    }
    const rugTex = new THREE.CanvasTexture(rugCanvas);
    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.4),
      new THREE.MeshBasicMaterial({ map: rugTex, transparent: true, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.y = 0.02;
    group.add(rug);
  } else if (item.category === 'seating') {
    // Cloud Sofa
    const sofaMat = new THREE.MeshStandardMaterial({ color: '#e0f2fe', roughness: 0.5 });
    // Cloud cushions
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.35, 16), sofaMat);
    seat.scale.set(1.4, 1, 0.9);
    seat.position.y = 0.22;
    group.add(seat);

    // Backrest
    const back = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), sofaMat);
    back.scale.set(1.6, 0.7, 0.5);
    back.position.set(0, 0.55, -0.4);
    group.add(back);
  } else if (item.id === 'antique_music_box') {
    // Ornate Victorian Music Box
    const boxMat = new THREE.MeshStandardMaterial({
      color: '#d4af37', // antique brass gold
      roughness: 0.25,
      metalness: 0.85,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: '#4a2810', // dark mahogany
      roughness: 0.4,
    });

    // Mahogany base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.38), woodMat);
    base.position.y = 0.1;
    group.add(base);

    // Brass filigree top
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.34), boxMat);
    top.position.y = 0.22;
    group.add(top);

    // Open Lid
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.34), woodMat);
    lid.position.set(0, 0.36, -0.15);
    lid.rotation.x = -Math.PI / 3;
    group.add(lid);

    // Miniature Dancing Star/Ballerina
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.06, 0),
      new THREE.MeshStandardMaterial({ color: '#fef08a', emissive: '#facc15', emissiveIntensity: 0.6 })
    );
    star.position.set(0, 0.32, 0);
    group.add(star);

    // Wind-up Key
    const key = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.015, 6, 12), boxMat);
    key.position.set(0.28, 0.12, 0);
    key.rotation.y = Math.PI / 2;
    group.add(key);
  } else {
    // Generic cute table/shelf/lamp
    const tableMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 16), tableMat);
    top.position.y = 0.6;
    group.add(top);

    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.58, 8), tableMat);
    leg.position.y = 0.29;
    group.add(leg);
  }

  return group;
}

// --- The Forgotten Room Special Props ---

export function createForgottenRoomDecor(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'forgotten_room_decor';

  // Antique Grandfather Clock
  const clockGroup = new THREE.Group();
  clockGroup.position.set(-2.8, 0, -2.8);
  const woodMat = new THREE.MeshStandardMaterial({ color: '#3e2723', roughness: 0.6 });
  const clockBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.4, 0.5), woodMat);
  clockBody.position.y = 1.2;
  clockGroup.add(clockBody);

  // Clock face
  const faceMat = new THREE.MeshStandardMaterial({ color: '#f5ebe0', roughness: 0.3 });
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16), faceMat);
  face.rotation.x = Math.PI / 2;
  face.position.set(0, 1.85, 0.26);
  clockGroup.add(face);

  group.add(clockGroup);

  // Antique Vanity with Mirror
  const vanityGroup = new THREE.Group();
  vanityGroup.position.set(2.6, 0, -2.6);
  vanityGroup.rotation.y = -Math.PI / 4;

  const table = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.5), woodMat);
  table.position.y = 0.35;
  vanityGroup.add(table);

  // Oval Mirror with silver reflection
  const mirrorFrame = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.06, 8, 16),
    new THREE.MeshStandardMaterial({ color: '#b08968', metalness: 0.7, roughness: 0.3 })
  );
  mirrorFrame.position.set(0, 1.2, 0);
  vanityGroup.add(mirrorFrame);

  const mirrorGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 16),
    new THREE.MeshStandardMaterial({ color: '#f8fafc', metalness: 0.95, roughness: 0.05 })
  );
  mirrorGlass.position.set(0, 1.2, 0.01);
  vanityGroup.add(mirrorGlass);

  group.add(vanityGroup);

  return group;
}
