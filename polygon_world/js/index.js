import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import gsap from "gsap";

// 옵션박스
const $controller = document.querySelector(".controllerBox");

if ($controller) {
 let checkbox

 // 체크 박스 설정 
 const toggleBtns = $controller.querySelectorAll(".controll_toggle");
 toggleBtns.forEach(function (btn) {
  btn.addEventListener("change", function () {
   checkbox = this.querySelector("input");
   if (checkbox.checked) {
    console.log("ON");
   } else {
    console.log("OFF");
   }
  });
 });
}
