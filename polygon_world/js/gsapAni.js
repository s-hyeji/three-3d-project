import gsap from 'gsap';

export function createIntroTimeline({ selectedBtn, selectBtns, resetBtn, controller }) {
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
 }, 1).to(controller, {
  left: 30,
  duration: 0.5,
 }, 1);

 return tl;
}