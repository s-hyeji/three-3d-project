import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import gsap from "gsap";

let startAni;

export function startWorld($data) {
 startAni = gsap.timeline();
 const otherBtns = [...$data.selectBtns].filter(btn => btn !== $data.selectedBtn);

 startAni.to(".selectText", {
  x: -1200,
  opacity: 0,
  scale: 0.7,
  duration: 0.5,
 }, 0).to($data.selectedBtn, {
  left: 560,
  top: 14,
  scale: 0.7,
  duration: 0.5,
 }, 0).to(otherBtns, {
  y: 380,
  scale: 0.7,
  opacity: 0,
  duration: 0.5,
 }, 0).to($data.reset, {
  left: 32,
  duration: 0.5,
 }, 0);

 if ($data.type === "square") {

 } else if ($data.type === "triangle") {

 } else if ($data.type === "circle") {

 }
}

// 리셋 함수
export function resetAni($data) {
 console.log("클릭 됨");

 if (startAni) {
  startAni.reverse();
 }
}