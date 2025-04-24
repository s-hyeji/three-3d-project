import Polygon from '../mesh/polygon.js';
import gsap from 'gsap';

export function gsapAni({ selectedBtn, selectBtns, resetBtn, controller }) {
 const otherBtns = [...selectBtns].filter(btn => btn !== selectedBtn);

 const tl = gsap.timeline();
 tl.to(".selectText", {
  x: -1200,
  opacity: 0,
  scale: 0.7,
  duration: 0.5,
 }, 0).to(selectedBtn, {
  left: 560,
  top: 14,
  scale: 0.7,
  duration: 0.5,
 }, 0).to(otherBtns, {
  y: 380,
  scale: 0.7,
  opacity: 0,
  duration: 0.5,
 }, 0).to(resetBtn, {
  left: 32,
  duration: 0.5,
 }, 0.5).to(controller, {
  left: 30,
  duration: 0.5,
 }, 0.5);

 return tl;
}

export function meshAni(mesh) {
 // mesh.visible = true;
 // mesh.position.set(0, -2, 0); // 시작 위치 아래쪽

 // gsap.to(mesh.position, {
 //  y: 0, // 화면 정중앙으로
 //  duration: 0.6,
 //  ease: 'back.out(1.7)'
 // });

}