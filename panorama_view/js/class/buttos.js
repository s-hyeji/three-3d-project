import * as THREE from 'three';


export default class Buttons {
  constructor(root, imgLength) {
    this.container = document.querySelector(root);
    this.btn = this.container.querySelectorAll('button');
    this.imgLength = imgLength;
    this.shprearNum = 1;
    this.squareNum = 1;
  }

  clickEvent(event) {
    this.button = event;
    if (this.button.target.id === 'prev') {
      // console.log('# Prev button!');
      switch (this.container.classList.value) {
        case 'shpear': this.shprearNum--; break;
        case 'square': this.squareNum--; break;
      }
      if (this.shprearNum === 0) this.shprearNum = this.imgLength;
      if (this.squareNum === 0) this.squareNum = this.imgLength;
    }

    if (this.button.target.id === 'next') {
      // console.log('# Next button!');
      switch (this.container.classList.value) {
        case 'shpear': this.shprearNum++; break;
        case 'square': this.squareNum++; break;
      }
      if (this.shprearNum === this.imgLength + 1) this.shprearNum = 1;
      if (this.squareNum === this.imgLength + 1) this.squareNum = 1;
    }
    // console.log(`# 구 이미지 ${this.shprearNum}번 ||`, `정사각형 이미지 ${this.squareNum}번`);
  }
}


