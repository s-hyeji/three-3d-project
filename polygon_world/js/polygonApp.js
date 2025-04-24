import * as THREE from 'three';
import Polygon from '../mesh/polygon.js';
import { gsapAni } from './gsapAni.js';
import { meshAni } from './gsapAni.js';

let polygon;


// 
export default class PolygonApp {
 constructor(scene) {
  this.scene = scene;
  this.startBtn = document.querySelector('.start');
  this.resetBtn = document.querySelector('.reset');
  this.selectBtns = document.querySelectorAll('.polygonSelectButtons [data-select]');
  this.controller = document.querySelector('.controllerBox');
  this.colorBtn = document.querySelector('.controllerBox .select_color');
  this.colorPopup = document.querySelector('.controllerBox .sub_colorSelectBox');
  this.contentArea = document.querySelector('.contentArea');

  this.selectedBtn = null;
  this.selectedType = null;
  this.selectedColor = null;
  this.timeline = null;

  this.initColorOptions();
  this.bindEvents();
 }

 bindEvents() {
  this.selectBtns.forEach(btn => {
   btn.addEventListener('click', () => {
    this.selectedBtn = btn;
    this.selectedType = btn.dataset.select;
    this.selectBtns.forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    this.contentArea.setAttribute("data-type", this.selectedType);
    this.startBtn.classList.add('selected');
    this.start();
   });
  });

  this.colorBtn.addEventListener("click", () => {
   this.colorPopup.classList.toggle("on");
  });

  this.resetBtn.addEventListener("click", () => this.reset());
 }

 initColorOptions() {
  const colors = [
   "#FF5733", "#FF8D33", "#FFC300", "#DAF7A6",
   "#33FF57", "#33FFF0", "#3385FF", "#5733FF",
   "#C700FF", "#FF33A8", "#A6A6A6", "#000000"
  ];

  colors.forEach(color => {
   const div = document.createElement("div");
   div.classList.add("color");
   div.style.backgroundColor = color;
   this.colorPopup.appendChild(div);
   div.addEventListener("click", () => {
    this.selectedColor = color;
    this.colorPopup.classList.remove("on");
    this.colorBtn.style.backgroundColor = this.selectedColor;
   });
  });
 }

 start() {
  this.timeline = gsapAni({
   selectedBtn: this.selectedBtn,
   selectBtns: this.selectBtns,
   resetBtn: this.resetBtn,
   controller: this.controller,
  });

  this.timeline.play();

  if (this.selectedType) {
   polygon = new Polygon(this.selectedType);
   polygon.setColor(this.selectedColor);
   this.scene.add(polygon.mesh);
   polygon.mesh.visible = true;
   meshAni(polygon.mesh);
  }
 }

 reset() {
  if (this.timeline) {
   this.timeline.reverse();
  }

  this.selectBtns.forEach(btn => btn.classList.remove('on'));
  this.startBtn.classList.remove('selected');

  if (polygon && polygon.mesh) {
   this.scene.remove(polygon.mesh);
  }

  setTimeout(() => {
   this.contentArea.setAttribute("data-type", "");
   this.colorBtn.style.backgroundColor = "#A6A6A6";
   this.colorPopup.classList.remove("on");
  }, 500);
 }
}