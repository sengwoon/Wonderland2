var pgUI;

function PGUI(){
	this.imgSetting = resourcePreLoader.GetImage("img/settingbutton.png");
	this.flagLeft = false;
	this.imgUIleftbutton = resourcePreLoader.GetImage("img/game_UI_leftbutton.png");
	this.imgUIleftbuttonDown = resourcePreLoader.GetImage("img/game_UI_leftbutton_down.png");
	this.flagRight = false;
	this.imgUIrightbutton = resourcePreLoader.GetImage("img/game_UI_rightbutton.png");
	this.imgUIrightbuttonDown = resourcePreLoader.GetImage("img/game_UI_rightbutton_down.png");
	this.imgUItotal = resourcePreLoader.GetImage("img/game_UI_total.png");
	this.imgUItotalUpper = resourcePreLoader.GetImage("img/game_UI_totalupper.png");
	this.imgUIplayerHP = resourcePreLoader.GetImage("img/game_UI_player_hp.png");
	this.imgUIwardHP = resourcePreLoader.GetImage("img/game_UI_ward_hp.png");
	this.imgUIexp = resourcePreLoader.GetImage("img/game_UI_exp_gauge.png");
	
	this.UIdirection = "right"; // 케릭터 방향 조절을 위한 변수! 클릭 여부 같은 것.
	pgUI = this;
}
PGUI.prototype.Render = function(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	
	Context.drawImage(this.imgUItotal, 0, 0);
	
	//UI 바뀌는 소스 넣는 장소!
	Context.drawImage(this.imgUIplayerHP, 494, 555, 290*pgPlayer.HP/fullHP, 18);
	Context.drawImage(this.imgUIwardHP, 494, 605, 290*pgWard.HP/pgWard.fullHP, 12);
	Context.drawImage(this.imgUIexp, 0, 52-52*(exp/fullExp), 48, 52*(exp/fullExp), 403, 590-(52*(exp/fullExp)), 48, 52*(exp/fullExp));
	
	Context.fillStyle    = "#ffffff";
	//Context.strokeStyle  = "#000000";
	//Context.lineWidth	 = 2;
    Context.font         = '42px "ShowcardGothic"'; 
    Context.textBaseline = "top";
    Context.textAlign	 = "left";
    Context.fillText( game.score, 15, 103 );   
    //Context.strokeText( game.score, 15, 103 );
    
    Context.fillText( level, 380, 546 );
    
    Context.font         = '28px "ShowcardGothic"'; 
    Context.fillText( 00+":"+Math.floor(game.playTime/1000), 15, 177 );
    
    Context.font         = '60px "ShowcardGothic"'; 
    Context.textBaseline = "bottom";
    Context.textAlign	 = "right";
    Context.fillText( game.kill, 439, 63 );
	//
	
	Context.drawImage(this.imgUItotalUpper, 0, 0);
	/*
	if(this.flagLeft)
		Context.drawImage(this.imgUIleftbuttonDown, 29, 538);
	else
		Context.drawImage(this.imgUIleftbutton, 29, 538);
	if(this.flagRight)
		Context.drawImage(this.imgUIrightbuttonDown, 215, 538);
	else
		Context.drawImage(this.imgUIrightbutton, 215, 538);
	*///사이즈 조정하면서 수치 다시 조정할 것!
	if(this.flagLeft)
		Context.drawImage(this.imgUIleftbuttonDown, 29, 438);
	else
		Context.drawImage(this.imgUIleftbutton, 29, 438);
	if(this.flagRight)
		Context.drawImage(this.imgUIrightbuttonDown, 215, 438);
	else
		Context.drawImage(this.imgUIrightbutton, 215, 438);
	Context.drawImage(this.imgSetting, 1, 1);
};

PGUI.prototype.Update = function(){
	if(inputSystem.touchX>29 && inputSystem.touchY>438 && inputSystem.touchX<29+116 && inputSystem.touchY<438+96){
		if(inputSystem.isTouch){
			if(this.flagLeft==false){
				this.flagLeft=true;
			}
		} else {
			if(this.flagLeft){
				this.flagLeft=false;
				this.UIdirection = "left";
			}
		}
	} else {
		this.flagLeft=false;
	}
	if(inputSystem.touchX>215 && inputSystem.touchY>438 && inputSystem.touchX<215+116 && inputSystem.touchY<438+96){
		if(inputSystem.isTouch){
			if(this.flagRight==false){
				this.flagRight=true;
			}
		} else {
			if(this.flagRight){
				this.flagRight=false;
				this.UIdirection = "right";
			}
		}
	} else {
		this.flagRight=false;
	}
};
