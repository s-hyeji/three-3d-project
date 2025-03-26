import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import gsap from "gsap";

// 처음 시작 시 애니매이션 재생 
export function startWorld(selectedType, selectedBtn) {
 const selectBtns = document.querySelectorAll(".polygonSelectButtons [data-select]");
 console.log(selectedType, selectedBtn);

 gsap.to(".selectText", {
  x: -1200,
  opacity: 0,
  scale: 0.7,
  duration: 0.5
 });

 gsap.to(selectedBtn, {
  left: 417,
  top: -216,
  scale: 0.7,
  duration: 0.5
 });


 selectBtns.forEach(btn => {
  if (btn !== selectedBtn) {
   gsap.to(btn, {
    y: 380,
    scale: 0.7,
    duration: 0.5,
   });
  }
 });


 if (selectedType === "square") {

 } else if (selectedType === "triangle") {

 } else if (selectedType === "circle") {

 }
}
