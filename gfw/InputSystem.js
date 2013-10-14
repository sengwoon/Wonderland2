window.addEventListener("touchstart", onTouchStart, false);
window.addEventListener("touchmove", onTouchMove, false);
window.addEventListener("touchend", onTouchEnd, false);

function InputSystem()
{
  this.touchX = 0;
  this.touchY = 0;
  this.isTouch = false;
  return this;
}

function onTouchMove(e){
  var theCanvas = document.getElementById("GameCanvas");
  inputSystem.touchX = e.touches[0].clientX - theCanvas.offsetLeft;
  inputSystem.touchY = e.touches[0].clientY - theCanvas.offsetTop;
  e.preventDefault();
}

function onTouchStart(e){
  var theCanvas = document.getElementById("GameCanvas");
  inputSystem.touchX = e.touches[0].clientX - theCanvas.offsetLeft;
  inputSystem.touchY = e.touches[0].clientY - theCanvas.offsetTop;
  inputSystem.isTouch = true;
}

function onTouchEnd(e){
  inputSystem.isTouch = false;
  e.preventDefault();
}

var inputSystem = new InputSystem();
