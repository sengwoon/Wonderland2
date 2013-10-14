function TitleState(){
	this.imgLoading = resourcePreLoader.GetImage("img/loading.png");
	this.flagLogin1 = false;
	this.imgLogin1 = resourcePreLoader.GetImage("img/loading_loginbutton_01.png");
	this.imgLogin1Down = resourcePreLoader.GetImage("img/loading_loginbutton_01_down.png");
	this.imgLogin2 = resourcePreLoader.GetImage("img/loading_loginbutton_02.png");
	this.transition = false;
	this.alpha = 255;
}

TitleState.prototype.Init = function(){
	
};

TitleState.prototype.Render= function(){
	Context.globalAlpha = this.alpha/255;
	Context.drawImage(this.imgLoading, 0, 0);
	if(this.flagLogin1)
		Context.drawImage(this.imgLogin1Down, 10, 480);
	else
		Context.drawImage(this.imgLogin1, 10, 480);
	Context.drawImage(this.imgLogin2, 10, 560);
};

TitleState.prototype.UpdateUI = function(){
	if(inputSystem.touchX>10 && inputSystem.touchY>480 && inputSystem.touchX<10+262 && inputSystem.touchY<480+64){
		if(inputSystem.isTouch){
			if(this.flagLogin1==false){
				this.flagLogin1=true;
			}
		} else {
			if(this.flagLogin1){
				soundSystem.PlaySound("sound/menuclick.mp3");
				this.transition = true;
				this.flagLogin1=false;
			}
		}
	} else {
		this.flagLogin1=false;
	}
};

TitleState.prototype.Update = function(){
	this.UpdateUI();
	if(this.transition){
		this.alpha -= 20;
		if(this.alpha <=0){
			this.alpha = 0;
			ChangeGameState( new MapState("title") ); // 버튼에 마우스가 위치한 상태에서 클릭시 실행!
		}
	}
};