function MapState(e){
	this.imgSetting = resourcePreLoader.GetImage("img/settingbutton.png");
	this.imgMap = resourcePreLoader.GetImage("img/map.png");
	this.flagMadhatter = false;
	this.imgMadhatter = resourcePreLoader.GetImage("img/map_madhatterbutton.png");
	this.imgMadhatterDown = resourcePreLoader.GetImage("img/map_madhatterbutton_down.png");
	this.previousState = e;
	this.transition = 1; // 1은 들어올때, 2는 나갈때
	this.alpha = 0;
	//return this;
}

MapState.prototype.Init = function(){
	if(this.previousState=="title")
		soundSystem.PlayBackgroundMusic("sound/bgm_ready.mp3");
};

MapState.prototype.Render= function(){
	
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	
	Context.globalAlpha = this.alpha / 255;
	Context.drawImage(this.imgMap, 0, 0);
	Context.drawImage(this.imgSetting, 1, 1);
	if(this.flagMadhatter)
		Context.drawImage(this.imgMadhatterDown, 15, 220);
	else
		Context.drawImage(this.imgMadhatter, 15, 220);
};

MapState.prototype.UpdateUI = function(){
	if(inputSystem.touchX>16 && inputSystem.touchY>222 && inputSystem.touchX<16+268 && inputSystem.touchY<222+347){
		if(inputSystem.isTouch){
			if(this.flagMadhatter==false){
				this.flagMadhatter=true;
			}
		} else {
			if(this.flagMadhatter){
				soundSystem.PlaySound("sound/menuclick.mp3");
			 	this.transition = 2;
			 	this.flagMadhatter=false;
			}
		}
	} else {
		this.flagMadhatter=false;
	}
};

MapState.prototype.Update = function(){
	this.UpdateUI();
	if(this.transition ==1){
		this.alpha += 20;
		if(this.alpha >255)
			this.alpha = 255;
	} else if(this.transition ==2){
		this.alpha -= 20;
		if(this.alpha < 0){
			this.alpha = 0;
			ChangeGameState( new SellectState("map") ); // 버튼에 마우스가 위치한 상태에서 클릭시 실행!
		}
	}
};
