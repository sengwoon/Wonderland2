window.addEventListener("touchstart", onTouchStart, false);
window.addEventListener("touchmove", onTouchMove, false);
window.addEventListener("touchend", onTouchEnd, false);
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("mousedown", onMouseDown, false);
window.addEventListener("mouseup", onMouseUp, false);

function InputSystem()
{
  this.touchX = 0;
  this.touchY = 0;
  this.isTouch = false;
  this.mouseX = 0;
  this.mouseY = 0;
  this.isMousePressed = false;
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
////////////////////////////////////////////////////////////////////////
InputSystem.prototype.getMousePositionX = function(){
  return this.mouseX;
};
InputSystem.prototype.getMousePositionY = function(){
  return this.mouseY;
};
function onMouseMove (e) {
  inputSystem.mouseX = e.clientX - theCanvas.offsetLeft;
  inputSystem.mouseY = e.clientY - theCanvas.offsetTop;
}
function onMouseDown (e) {
  inputSystem.isMousePressed = true;
}
function onMouseUp (e) {
  inputSystem.isMousePressed = false;
}