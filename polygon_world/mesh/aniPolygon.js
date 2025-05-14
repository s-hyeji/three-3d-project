import * as THREE from 'three';
import Polygon from './polygon.js';
import gsap from 'gsap';

let tl2Reset = null;

export function aniPolygon(type, resetBtn, controller) {
  const aniBox = document.querySelector('.aniBox');
  const { clientWidth, clientHeight } = aniBox;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setSize(clientWidth, clientHeight);
  aniBox.innerHTML = "";
  aniBox.appendChild(renderer.domElement);

  camera.position.set(0, 0, 5); // 정면
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();

  const light = new THREE.DirectionalLight(0xffffff, 4);
  light.position.set(2, 4, 3);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const polygon = new Polygon(type, 'standard');
  const mesh = polygon.getMesh();
  mesh.position.set(0, 6, 0);
  mesh.visible = true;
  scene.add(mesh);

  gsap.to(mesh.position, {
    y: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
    onComplete: () => {
      scene.remove(mesh);

      const leftMesh = mesh.clone();
      const rightMesh = mesh.clone();

      leftMesh.position.set(0, 0, 0);
      rightMesh.position.set(0, 0, 0);
      scene.add(leftMesh, rightMesh);

      // 좌측 도형
      gsap.to(leftMesh.position, {
        x: -9,
        y: -8,
        duration: 0.8,
        ease: 'power2.in'
      });
      gsap.to(leftMesh.rotation, {
        z: -Math.PI * 2,
        duration: 0.8,
        ease: 'power2.in'
      });
      gsap.to(leftMesh.scale, {
        x: 0.08,
        y: 0.08,
        z: 0.08,
        duration: 0.8,
        ease: 'power2.in'
      });

      // 우측 도형
      gsap.to(rightMesh.position, {
        x: 9,
        y: -8,
        duration: 0.8,
        ease: 'power2.in'
      });
      gsap.to(rightMesh.rotation, {
        z: Math.PI * 2,
        duration: 0.8,
        ease: 'power2.in'
      });
      gsap.to(rightMesh.scale, {
        x: 0.08,
        y: 0.08,
        z: 0.08,
        duration: 0.8,
        ease: 'power2.in',

        onComplete: () => {
          const tl2 = gsap.timeline();

          tl2.to(".polygonBox", {
            right: 100,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
              tl2.fromTo(".polygonBox", {
                boxShadow: "0 0 10px 0px rgba(255, 118, 148, 0)"
              }, {
                boxShadow: "0 0 10px 0px rgba(255, 118, 148, 1)",
                duration: 0.5,
                ease: "power2.out"
              });
            }
          }, 0)
            .to(resetBtn, {
              left: 32,
              duration: 0.5
            }, 1.5)
            .to(controller, {
              left: 30,
              duration: 0.5
            }, "<");

        }
      })

      tl2Reset = gsap.timeline({ paused: true });
      tl2Reset.to(".polygonBox", {
        right: -732,
        duration: 0.5,
        boxShadow: "0 0 30px 0px rgba(255, 118, 148, 0)",
        ease: "power2.out",
      }, 0)
        .to(resetBtn, {
          left: -110,
          duration: 0.5
        }, 0)
        .to(controller, {
          left: -330,
          duration: 0.5
        }, 0);
    }
  });


  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

export function playResetPolygonBox() {
  if (tl2Reset) tl2Reset.restart();
}