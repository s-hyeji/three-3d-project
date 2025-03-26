
document.body.style.overflow = 'hidden';

// function enforceMinSize() {
//     if (window.innerWidth < minWidth) {
//         window.resizeTo(minWidth, window.innerWidth);
//     }
// }

function fetchData(url, callback) {
 fetch(url)
  .then(response => response.json())
  .then(data => callback(data))
  .catch(error => console.error('Error:', error));
}

window.$callBack = function (data) {
 console.log('Received data:', data);
};
// 초기 로드 시 최소 크기 확인
// 
function size() {
 //전체화면 크기를 불러온다
 let wholeWidth = document.documentElement.clientWidth || document.body.clientWidth;
 let wholeHeight = document.documentElement.clientHeight || document.body.clientHeight;
 //줄어들어야되는 요소 크기를 불러온다
 let wrapWidth = document.querySelector("#wrap").clientWidth;
 let wrapHeight = document.querySelector("#wrap").clientHeight;
 //두개를 나눠서 비율을 뽑는다 -> transform scale
 let widthZoom = wholeWidth / wrapWidth;
 let heightZoom = wholeHeight / wrapHeight;
 //비율 크기 비교해서 작은값
 //높이 비율과 넓이비율중 작은값을 써야 화면에 맞춰서 줄어든다
 //줄어들어야 되는 요소에 인라인으로 부여한다(언제?) resize window.addEventListener('resize', this.reSet.bind(this, this.element));
 let zoomRate;
 if (widthZoom > heightZoom) {
  document.querySelector("#wrap").style.transform = `scale(${heightZoom})`
  zoomRate = heightZoom;
 } else {
  document.querySelector("#wrap").style.transform = `scale(${widthZoom})`
  zoomRate = widthZoom;
 }
 document.querySelector("#wrap").style.transformOrigin = '0% 0%';
 document.querySelector("#wrap").style.MsTransformOrigin = '0% 0%';
 document.querySelector("#wrap").style.MozTransformOrigin = '0% 0%';
 document.querySelector("#wrap").style.WebkitTransformOrigin = '0% 0%';
 let scaledWidth = wrapWidth * zoomRate;
 let leftOffset = (wholeWidth - scaledWidth) / 2;
 document.querySelector("#wrap").style.position = 'absolute';
 document.querySelector("#wrap").style.left = `${leftOffset}px`;
 if (window.$callBack && window.$callBack.sizez) window.$callBack.sizez();
}

window.onload = function () { size(); }
window.addEventListener('resize', function () { size(); });




