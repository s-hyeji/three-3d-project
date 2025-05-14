import { gsapAni } from './gsapAni.js';
import { playResetPolygonBox } from '../mesh/aniPolygon.js';
import { playPolygon } from '../mesh/playPolygon.js';

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
  this.orbitToggle = document.querySelector('.controll_toggle.camera input');
  this.transparentToggle = document.querySelector('.controll_toggle.trans input');
  this.lightToggle = document.querySelector('.controll_toggle.light input');

  this.selectedBtn = null;
  this.selectedType = null;
  this.selectedColor = null;
  this.timeline = null;
  this.polygonColor = null;
  this.polygonControl = null;

  this.bindEvents();
  this.initColorOptions();
 }

 bindEvents() {
  this.selectBtns.forEach(btn => {
   btn.addEventListener('click', () => {
    this.selectedBtn = btn;
    this.selectedType = btn.dataset.select;
    this.contentArea.setAttribute("data-type", this.selectedType);
    this.startBtn.classList.add('selected');
    this.start();
   });
  });
  // 컬러 팝업
  this.colorBtn.addEventListener("click", () => {
   this.colorPopup.classList.toggle("on");
  });
  // 리셋
  this.resetBtn.addEventListener("click", () => this.reset());
  // 
  // 컨트롤러
  if (this.orbitToggle) {
   this.orbitToggle.addEventListener('change', () => {
    const useControls = this.orbitToggle.checked;
    if (this.polygonControl) {
     this.polygonControl.setControlsEnabled(useControls);
    }
   });
  }
  // 투시
  if (this.transparentToggle) {
   this.transparentToggle.addEventListener('change', () => {
    const transparent = this.transparentToggle.checked;
    if (this.polygonControl && this.polygonControl.applyTransparency) {
     this.polygonControl.applyTransparency(transparent);
    }

    if (transparent) {
     this.lightToggle.parentElement.classList.add("off")
     this.colorBtn.parentElement.classList.add("off")
    } else {
     this.lightToggle.parentElement.classList.remove("off")
     this.colorBtn.parentElement.classList.remove("off")
    }
   });
  }
  // 빛
  if (this.lightToggle) {
   this.lightToggle.addEventListener('change', () => {
    const enableLight = this.lightToggle.checked;
    if (this.polygonControl && this.polygonControl.toggleLight) {
     this.polygonControl.toggleLight(enableLight);
    }
   });
  }
 }

 initColorOptions() {
  const colors = [
   "#FF6B6B", // Red
   "#FFA552", // Orange
   "#FFD93D", // Yellow
   "#C5E384", // Light Green
   "#6BCB77", // Green
   "#00FFAB", // Spring Green
   "#00C49A", // Teal
   "#87CEFA", // Sky Blue
   "#4D96FF", // Blue
   "#A88BEB", // Purple
   "#FF66C4", // Magenta
   "#FF7694",  // Rose
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

    if (this.polygonColor) {
     this.polygonColor.setColor(this.selectedColor);
    }
   });
  });
 }

 start() {
  const isTransparent = false;
  const useControls = true;

  this.timeline = gsapAni({
   selectedBtn: this.selectedBtn,
   selectBtns: this.selectBtns,
   resetBtn: this.resetBtn,
   controller: this.controller,
   selectedType: this.selectedType
  });

  // 토글 
  const { polygon, setControlsEnabled, applyTransparency, toggleLight } = playPolygon(this.selectedType, isTransparent);
  this.polygonColor = polygon;
  this.polygonControl = { setControlsEnabled, applyTransparency, toggleLight };
  if (this.orbitToggle) this.orbitToggle.checked = true;
  if (this.transparentToggle) this.transparentToggle.checked = false;
  if (this.lightToggle) {
   this.lightToggle.checked = false;
   if (this.polygonControl && this.polygonControl.toggleLight) {
    this.polygonControl.toggleLight(false);
   }
  }
  this.polygonControl.setControlsEnabled(useControls);
  this.polygonControl.applyTransparency(isTransparent);
 }

 reset() {
  playResetPolygonBox();
  setTimeout(() => {
   this.timeline.reverse();
  }, 550);

  this.selectBtns.forEach(btn => btn.classList.remove('on'));
  this.startBtn.classList.remove('selected');

  setTimeout(() => {
   this.contentArea.setAttribute("data-type", "");
   this.colorBtn.style.backgroundColor = "#FF7694";
   this.colorPopup.classList.remove("on");

   this.lightToggle.parentElement.classList.remove("off")
   this.colorBtn.parentElement.classList.remove("off")
  }, 500);
 }
}