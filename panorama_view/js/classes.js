import panoramaView from './index.js';




class Typing {
  constructor() {
    this.type = 'typings';
  }

  getType() {
    return this.type;
  }
}

class Buttons {
  constructor(prew, next) {
    this.prew = document.querySelector(prew);
    this.next = document.querySelector(next);
  }

  clickEvent() {
    console.log(this);

    if (this.prew) {
      console.log('Prew button clicked!');
    }
    else if (this.next) {
      console.log('Next button clicked!');
    }
  }
}

export default (Buttons);