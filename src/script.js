import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { Timer } from 'three/addons/misc/Timer.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Axes helper
const axesHelper = new THREE.AxesHelper(4);
axesHelper.visible = false;
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('/floor/alpha.webp');
// const floorArmTexture = textureLoader.load('/floor/aerial_rocks_02_1k/arm.webp');
const floorArmTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/arm.webp');
const floorColorTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/diff.webp');
const floorDispTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/disp.webp');
const floorNormGlTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/nor_gl.webp');

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorArmTexture.repeat.set(8, 8);
floorColorTexture.repeat.set(8, 8);
floorDispTexture.repeat.set(8, 8);
floorNormGlTexture.repeat.set(8, 8);

floorArmTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorDispTexture.wrapS = THREE.RepeatWrapping;
floorNormGlTexture.wrapS = THREE.RepeatWrapping;

floorArmTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorDispTexture.wrapT = THREE.RepeatWrapping;
floorNormGlTexture.wrapT = THREE.RepeatWrapping;

// Wall
const wallArmTexture = textureLoader.load('/wall/castle_brick_broken_06_1k/arm.webp');
const wallColorTexture = textureLoader.load('/wall/castle_brick_broken_06_1k/diff.webp');
const wallNormGlTexture = textureLoader.load('/wall/castle_brick_broken_06_1k/nor_gl.webp');

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

// Roof
const roofArmTexture = textureLoader.load('/roof/roof_slates_02_1k/arm.webp');
const roofColorTexture = textureLoader.load('/roof/roof_slates_02_1k/diff.webp');
const roofNormGlTexture = textureLoader.load('/roof/roof_slates_02_1k/nor_gl.webp');

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofArmTexture.repeat.set(3, 1);
roofColorTexture.repeat.set(3, 1);
roofNormGlTexture.repeat.set(3, 1);

roofArmTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofNormGlTexture.wrapS = THREE.RepeatWrapping;

// Bushes
const bushArmTexture = textureLoader.load('/bush/leaves_forest_ground_1k/arm.webp');
const bushColorTexture = textureLoader.load('/bush/leaves_forest_ground_1k/diff.webp');
const bushNormGlTexture = textureLoader.load('/bush/leaves_forest_ground_1k/nor_gl.webp');

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushArmTexture.repeat.set(2, 1);
bushColorTexture.repeat.set(2, 1);
bushNormGlTexture.repeat.set(2, 1);

bushArmTexture.wrapS = THREE.RepeatWrapping;
bushColorTexture.wrapS = THREE.RepeatWrapping;
bushNormGlTexture.wrapS = THREE.RepeatWrapping;

// Graves
const graveArmTexture = textureLoader.load('/grave/plastered_stone_wall_1k/arm.webp');
const graveColorTexture = textureLoader.load('/grave/plastered_stone_wall_1k/diff.webp');
const graveNormGlTexture = textureLoader.load('/grave/plastered_stone_wall_1k/nor_gl.webp');

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveArmTexture.repeat.set(0.3, 0.4);
graveColorTexture.repeat.set(0.3, 0.4);
graveNormGlTexture.repeat.set(0.3, 0.4);

// Door
const doorAlphaTexture = textureLoader.load('/door/alpha.webp');
const doorAOTexture = textureLoader.load('/door/ambientOcclusion.webp');
const doorColorTexture = textureLoader.load('/door/color.webp');
const doorHeightTexture = textureLoader.load('/door/height.webp');
const doorMetalnessTexture = textureLoader.load('/door/metalness.webp');
const doorNormalTexture = textureLoader.load('/door/normal.webp');
const doorRoughnessTexture = textureLoader.load('/door/roughness.webp');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    displacementMap: floorDispTexture,
    displacementBias: -0.15,
    displacementScale: 0.3,
    aoMap: floorArmTexture,
    roughnessMap: floorArmTexture,
    metalnessMap: floorArmTexture,
    normalMap: floorNormGlTexture,
    alphaMap: floorAlphaTexture,
    transparent: true,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('displacementScale');
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('displacementBias');

// House Group
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallArmTexture,
    roughnessMap: wallArmTexture,
    metalnessMap: wallArmTexture,
    normalMap: wallNormGlTexture,
  })
);
walls.position.y += 2.5 * 0.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofArmTexture,
    roughnessMap: roofArmTexture,
    metalnessMap: roofArmTexture,
    normalMap: roofNormGlTexture,
  })
);
roof.position.y += 2.5 + 0.75;
roof.rotation.y += Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAOTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
    alphaMap: doorAlphaTexture,
    transparent: true,
  })
);
door.position.z = 2 + 0.01;
door.position.y = 1;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccffcc',
  map: bushColorTexture,
  aoMap: bushArmTexture,
  roughnessMap: bushArmTexture,
  metalnessMap: bushArmTexture,
  normalMap: bushNormGlTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveArmTexture,
  roughnessMap: graveArmTexture,
  metalnessMap: graveArmTexture,
  normalMap: graveNormGlTexture,
});

// Grave Group
const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 4;

  grave.position.y = Math.random() * 0.4;
  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;

  const rotation = (Math.random() - 0.5) * 0.4;
  grave.rotation.x = rotation;
  grave.rotation.y = rotation;
  grave.rotation.z = rotation;

  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);
scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cast and receive
directionalLight.castShadow = true;

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;

roof.castShadow = true;

floor.receiveShadow = true;

graves.children.forEach((g) => {
  g.castShadow = true;
  g.receiveShadow = true;
});

// Mapping
directionalLight.shadow.mapSize.set(256, 256);
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.set(256, 256);
ghost1.shadow.camera.far = 10;
ghost2.shadow.mapSize.set(256, 256);
ghost2.shadow.camera.far = 10;
ghost3.shadow.mapSize.set(256, 256);
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

scene.add(sky);

/**
 * Fog
 */
scene.fog = new THREE.FogExp2('#02343f', 0.1);

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Ghost Animation
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.sin(ghost1Angle) * 4;
  ghost1.position.z = Math.cos(ghost1Angle) * 4;
  ghost1.position.y =
    Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45);
  const ghost2Angle = -elapsedTime * 0.38;
  ghost2.position.x = Math.sin(ghost2Angle) * 5;
  ghost2.position.z = Math.cos(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45);
  const ghost3Angle = elapsedTime * 0.75;
  ghost3.position.x = Math.sin(ghost3Angle) * 6;
  ghost3.position.z = Math.cos(ghost3Angle) * 5;
  ghost3.position.y =
    Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
