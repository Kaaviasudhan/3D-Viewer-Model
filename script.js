import * as THREE from "./three.js-master/build/three.module.js";
import { GLTFLoader } from "./three.js-master/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "./three.js-master/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from './three.js-master/examples/jsm/loaders/DRACOLoader.js';

// Input Field Files
const form = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");

// Progress Bar
const progressBar = document.getElementById('progressBar');

// const gltfLoader = new GLTFLoader();
    
// Canvas Section
const canvas = document.querySelector('.webgl');

// Create a Scene
const scene = new THREE.Scene();

const clock = new THREE.Clock();
const mixer = new THREE.AnimationMixer(scene);

// Load .glb file
fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  const extension = file.name.split('.').pop().toLowerCase();
  
  let Loader;

  if (extension === 'glb') {
    Loader = new GLTFLoader();
    console.log(extension);
  } else if (extension === 'gltf') {
    Loader = new GLTFLoader();
    Loader.setDRACOLoader(new DRACOLoader());
    console.log(extension);
  } else {
    console.log('Unsupported file format');
    return;
  }

  Loader.load(URL.createObjectURL(file), function(gltf) {
    const root = gltf.scene;
    scene.add(new THREE.GridHelper(20,50, 0x888888, 0x444444));
    scene.add(root);

    // Loader.setExtensions({ KHR_materials_pbrSpecularGlossiness: true });

    const clip = gltf.animations.find((clip) => clip.name === 'animation_0');
    if (clip) {
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopRepeat);
      action.clampWhenFinished = true;
      action.play();
    } else {
      console.log('Animation clip not found');
    }

    // Set the material of the mesh in the loaded GLB file
    root.traverse(function (child) {
    if (child.isMesh) {
      child.material = material;
    }});
    
  }, function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + ' % loaded');
    const progress = xhr.loaded / xhr.total * 100;
    progressBar.style.width = progress + '%';
  }, function(error) {
    console.log('An error occurred');
    alert(error);
  });
});

// Light Directions
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(-2, -2, -5);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(1, 0, 0);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(0, 0, 1);
scene.add(light4);

// Window Sizing
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera View Fields
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
camera.setRotationFromAxisAngle.y = 45 / 180 * Math.PI;
camera.position.set(0, 1, 5);
scene.add(camera);

const renderer = new THREE.WebGL1Renderer({
  canvas: canvas,
});

// Orbital Control
const controls = new OrbitControls(camera, canvas, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 5));
renderer.shadowMap.enabled = true;
renderer.gammaOuput = true;
renderer.render(scene, camera);

// SCENE:
const textureLoader = new THREE.TextureLoader();
const grassNormalMap = textureLoader.load(".asset/grass_normal_map.png");

// Floor:
const plane = new THREE.Mesh(new THREE.PlaneGeometry(40, 40, 1), new THREE.MeshPhongMaterial({ color: 0x0a7d15, normalMap: grassNormalMap }));
plane.rotation.x = - Math.PI / 2
plane.material.normalMap.wrapS = plane.material.normalMap.wrapT = THREE.RepeatWrapping
plane.material.normalMap.repeat.x = plane.material.normalMap.repeat.y = 5
scene.add(plane);

// Create a Shape:
const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
cube.position.x -= 2
cube.receiveShadow = true;
cube.castShadow = true;
scene.add(cube)

const cone = new THREE.Mesh(new THREE.ConeGeometry(), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
cone.position.x -= 2
cone.position.y += 1
scene.add(cone)

function animate() {
  requestAnimationFrame(animate);
  const deltaTime = clock.getDelta();
  mixer.update(deltaTime)
  
  renderer.render(scene, camera);
}

animate();