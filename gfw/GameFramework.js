var GAME_FPS;
var gameInterval;
var game_state = new LoadingState(); 
var after_loading_state;
var theCanvas;
var Context;

function ChangeGameState( nextGameState )
{
  // 필수 함수가 있는지 확인한다.
  if( nextGameState.Init == undefined )
    return;
  if( nextGameState.Update == undefined )
    return;
  if( nextGameState.Render == undefined )
    return;
  
  // 필수 함수가 있으면 상태 전환
  game_state = nextGameState;
  
  //초기화
  game_state.Init();
}

function Update()
{
  // 타이머 업데이트
  timerSystem.Update();
    
  // 업데이트 
  game_state.Update();

}

function Render()
{
  // 그리기
  theCanvas = document.getElementById("GameCanvas");
  Context  = theCanvas.getContext("2d");
  
  game_state.Render();
  
  /*
  // FPS 표시
  Context.fillStyle    = "#ffffff";   
  Context.font         = '15px Arial'; 
  Context.textBaseline = "top";
  Context.fillText( "fps : " + frameCounter.Lastfps, 10, 10 );
  */
  //터치 좌표 표시
  Context.fillStyle    = "#ffffff";   
  Context.font         = '15px Arial'; 
  Context.textBaseline = "top";
  Context.fillText( "x좌표 : " + inputSystem.touchX, 10, 10 );
  Context.fillText( "y좌표 : " + inputSystem.touchY, 10, 30 );

}

function gameLoop()
{   
  Update();
  Render();
  
  frameCounter.countFrame();
}

