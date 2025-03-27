import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import gsap from "gsap";

// 처음 시작 시 애니매이션 재생 
export function startWorld($data) {
 gsap.to(".selectText", {
  x: -1200,
  opacity: 0,
  scale: 0.7,
  duration: 0.5
 });

 gsap.to($data.selectedBtn, {
  left: 417,
  top: -216,
  scale: 0.7,
  duration: 0.5
 });


 $data.selectBtns.forEach(btn => {
  if (btn !== $data.selectedBtn) {
   gsap.to(btn, {
    y: 380,
    scale: 0.7,
    opacity: 0,
    duration: 0.5,
   });
  }
 });


 if ($data.type === "square") {

 } else if ($data.type === "triangle") {

 } else if ($data.type === "circle") {

 }
}
