import gsap from 'gsap';
import { aniPolygon } from '../mesh/aniPolygon.js';


export function gsapAni({ selectedBtn, selectBtns, resetBtn, controller, selectedType }) {
 const otherBtns = [...selectBtns].filter(btn => btn !== selectedBtn);

 const tl = gsap.timeline();

 tl.to(".selectText", {
  x: -1200,
  opacity: 0,
  scale: 0.7,
  duration: 0.5
 }, 0)
  .to(selectedBtn, {
   left: 560,
   top: 14,
   scale: 0.7,
   duration: 0.5
  }, 0)
  .to(otherBtns, {
   y: 380,
   scale: 0.7,
   opacity: 0,
   duration: 0.5,
   onComplete: () => { aniPolygon(selectedType, resetBtn, controller); },
  }, 0)

 return tl
}


