



class Buttons {
  constructor(root, imgLength) {
    this.btn = document.querySelectorAll(root);
    this.imgNum = 1;
    this.imgLength = imgLength;
  }

  clickEvent(e) {
    if (e.target.id === 'prev') {
      console.log('# Prev button!');
      this.imgNum--;
      if (this.imgNum === 0) this.imgNum = 5;
    }

    else if (e.target.id === 'next') {
      console.log('# Next button!');
      this.imgNum++;
      if (this.imgNum === 6) this.imgNum = 1;
    }
  }
}