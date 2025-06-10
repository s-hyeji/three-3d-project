import * as THREE from 'three';
import { OrbitControls } from "OrbitControls";


const wrap = document.querySelector('#wrap');
const { clientWidth, clientHeight } = wrap;

const distance = 400;

let scene, camera, renderer, controls;
let galleryGroup = new THREE.Group();
let pageNum = 0;
let targetNum = 0;
let moveX = 0;
const imageList = [
  'images/2015.jpg',
  'images/2016-1.jpg',
  'images/2016-2.jpg',
  'images/2018.jpg',
  'images/2019.jpg',
  'images/2024.jpg',
  'images/2025.jpg',
  // 'images/unit-5.png',
  // 'images/unit-5.png',
  // 'images/unit-5.png',
  // 'images/unit-5.png',
  // 'images/unit-5.png',
];

const init = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#000000"); //배경 컬러
  camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 150);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(clientWidth, clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; //PCFShadowMap
  //그림자 활성화

  wrap.appendChild(renderer.domElement);

  // const axes = new THREE.AxesHelper(150);
  // scene.add(axes);

  // const gridHelper = new THREE.GridHelper(240, 20);
  // scene.add(gridHelper);

  //조명 넣기
  var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.2);
  light.position.set(0, 50, 50);
  scene.add(light);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.minDistance = 10;
  controls.maxDistance = 150;
  {
    //가벽 만들기
    const loader = new THREE.TextureLoader();

    const baseColor = loader.load('mesh/Marble021_1K-PNG_Color.png');
    const roughness = loader.load('mesh/Marble021_1K-PNG_Roughness.png');
    const normalMap = loader.load('mesh/Marble021_1K-PNG_NormalGL.png');
    const displacement = loader.load('mesh/Marble021_1K-PNG_Displacement.png');


    [baseColor, roughness, normalMap, displacement].forEach(tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(30, 4);
      tex.colorSpace = THREE.SRGBColorSpace;
    });

    const wallWidth = distance * imageList.length + distance;
    const geometry = new THREE.BoxGeometry(wallWidth, 300, 2);
    const material = new THREE.MeshStandardMaterial({
      map: baseColor,
      normalMap: normalMap,
      roughnessMap: roughness,
      roughness: 0.1,
      metalness: 0.1,
      reflectivity: 0.5,
      clearcoat: 0.7,
      clearcoatRoughness: 0.05,
    });

    const wallMesh = new THREE.Mesh(geometry, material);
    wallMesh.position.set(wallWidth / 2 - distance, 0, -1.5);
    wallMesh.receiveShadow = true;
    galleryGroup.add(wallMesh);
    scene.add(galleryGroup);

    const wallLight = new THREE.DirectionalLight(0xffffff, 1.0);
    wallLight.position.set(0, 60, 50);
    wallLight.castShadow = false;
    scene.add(wallLight);
  }
  for (let i = 0; i < imageList.length; i++) {
    addBox(i);
  }
};

//액자 추가
const addBox = (i) => {
  const texture = new THREE.TextureLoader().load(
    imageList[i],
    (loadedTexture) => {
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
    }
  );

  const baseWidth = 200;
  const aspectRatio = 16 / 9;
  const baseHeight = baseWidth / aspectRatio;

  const geometry = new THREE.BoxGeometry(baseWidth, baseHeight, 2);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
  });
  const boxMesh = new THREE.Mesh(geometry, material);
  boxMesh.castShadow = true;
  boxMesh.receiveShadow = true;
  const x = i * distance;
  const y = 0;
  const z = 0;
  boxMesh.position.set(x, y, 0.2);
  galleryGroup.add(boxMesh);

  const frameThickness = 5;
  const frameGeometry = new THREE.BoxGeometry(
    baseWidth + frameThickness,
    baseHeight + frameThickness,
    2.2
  );
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.6,
    metalness: 0.2,
  });
  const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
  frameMesh.position.set(x, y, z - 0.05);
  frameMesh.castShadow = true;
  frameMesh.receiveShadow = true;
  galleryGroup.add(frameMesh);


  const spotLight = new THREE.SpotLight(0xffffff, 180);
  spotLight.position.set(x, 110, 200);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.1;
  spotLight.decay = 1;
  spotLight.distance = 500;
  spotLight.target = boxMesh;
  spotLight.castShadow = true;

  galleryGroup.add(spotLight);
  galleryGroup.add(spotLight.target);

  // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);
};

const animate = () => {
  // controls.update();

  moveX += (targetNum - moveX) * 0.05;
  galleryGroup.position.x = moveX;
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};


const clickFunc = (event) => {
  // console.log(event.pageX);
  if (event.pageX < clientWidth / 2) {
    // console.log("좌");
    if (pageNum > 0) {
      pageNum -= 1;
    }
  } else {
    // console.log("우");
    if (pageNum < imageList.length - 1) {
      pageNum += 1;
    }
  }
  // console.log("pageNum :" + pageNum);
  targetNum = -(pageNum * distance);
};


init();
animate();
document.addEventListener("click", clickFunc);
