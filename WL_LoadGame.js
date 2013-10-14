function LoadGameState(e){
	this.gameLoadingTimer = new Timer();
	this.sprGameLoading = new SpriteAnimation( resourcePreLoader.GetImage("img/game_loading.png"), 160, 25, 4, 8);
	this.sprGameLoading.SetPosition(48, 580);
}

//게임 시작할때 1회 실행
LoadGameState.prototype.Init = function(){
	soundSystem.SetVolume(0);
};

LoadGameState.prototype.Render= function(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	Context.globalAlpha = 1;
	Context.fillStyle = "#000000";
	Context.fillRect(0, 0, 960, 640);
	this.sprGameLoading.Render( Context );
};

LoadGameState.prototype.Update = function(){
	if(this.gameLoadingTimer.nowFrame > 2000){
		ChangeGameState( new PlayGameState("loadgame") );
	}
	this.sprGameLoading.Update();
};