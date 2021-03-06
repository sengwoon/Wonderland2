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
var inputSystem = new InputSystem();

function onTouchStart(e){
  inputSystem.touchX = e.touches[0].clientX - theCanvas.offsetLeft;
  inputSystem.touchY = e.touches[0].clientY - theCanvas.offsetTop;
  inputSystem.isTouch = true;
}
function onTouchMove(e){
  inputSystem.touchX = e.touches[0].clientX - theCanvas.offsetLeft;
  inputSystem.touchY = e.touches[0].clientY - theCanvas.offsetTop;
  e.preventDefault();
}
function onTouchEnd(e){
  inputSystem.isTouch = false;
  e.preventDefault();
}