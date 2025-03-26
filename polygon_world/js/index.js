import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import gsap from "gsap";

gsap.to("#box", {
 x: 300,
 duration: 2,
 ease: "bounce.out" // 바운스 효과 적용
});
