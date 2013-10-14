var game;

function PlayGameState(){
	this.UI = new PGUI();
	this.player = new PGPlayer();
	this.npc = new PGNPC();
	this.ward = new PGWard();
	this.playTime = 0;
	this.onGoingTo = "stop"; // 배경화면이 움직이고 있는지 여부
	this.speed = 5; // 플레이어와 동일한 스피드로, 배경이 움직일때만 적용되는 스피드.
	this.score = 0;
	this.kill = 0;
	this.coinGain = 0;
	this.isOver = false;
	this.transition = 1; // 1은 들어올때, 2는 나갈때
	this.transAlpha = 0;
	
	
	this.msgCoin = resourcePreLoader.GetImage("img/message_coin.png");
	this.msgExp = resourcePreLoader.GetImage("img/message_exp.png");
	this.msgLevelUp = resourcePreLoader.GetImage("img/message_level_up.png");
	this.msgScore = resourcePreLoader.GetImage("img/message_score.png");
	this.arrMessage = new Array();
	
	//배경
	this.imgBackground00 = resourcePreLoader.GetImage("img/game_background_00.png");
	this.imgBackground01 = resourcePreLoader.GetImage("img/game_background_01.png");
	this.imgBackground02 = resourcePreLoader.GetImage("img/game_background_02.png");
	this.imgBackground03 = resourcePreLoader.GetImage("img/game_background_03.png");
	this.BG00x=-845;
	this.BG01x=-845;
	this.BG02x=-845;
	this.BG03x=-845;
	
	//게임 결과 확인 창 관련
	this.imgOver = resourcePreLoader.GetImage("img/game_over.png");
	this.imgScrollUpper = resourcePreLoader.GetImage("img/game_over_scroll_upper.png");
	this.imgScrollLower = resourcePreLoader.GetImage("img/game_over_scroll_lower.png");
	this.imgScrollButton = resourcePreLoader.GetImage("img/game_over_scroll_button.png");
	this.imgScrollButtonDown = resourcePreLoader.GetImage("img/game_over_scroll_button_down.png");
	this.scrollY = 240;
	this.isScrollOpened = false; // 스크롤이 펼쳐졌는지 여부
	this.flagScrollButton = false; //확인 버튼 눌렀는지 여부
	this.scoreRender =0;
	this.coinGainRender =0;
			
	soundSystem.PlayBackgroundMusic("sound/bgm_ready.mp3");
	game = this;
}

//게임 시작할때 1회 실행
PlayGameState.prototype.Init = function(){
	this.playTime = 0;
	this.player.HP=fullHP;
	this.npc.AddObject( "spadeLeft", 1000, 393 ); // 맨 첨에 적 한마리 추가
	soundSystem.PlayBackgroundMusic("sound/bgm_play.mp3");
	soundSystem.SetVolume(1);
};
//게임 화면 출력
PlayGameState.prototype.Render= function(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	
	Context.globalAlpha = this.transAlpha/255;
	Context.drawImage(this.imgBackground00, this.BG00x, 0);
	Context.drawImage(this.imgBackground01, this.BG01x, 0);
	Context.drawImage(this.imgBackground02, this.BG02x, 0);
	Context.drawImage(this.imgBackground03, this.BG03x, 0);
	
	this.ward.Render();
	this.npc.Render();
	this.player.Render();
	for(var i=0; i<this.arrMessage.length; i++){
		this.arrMessage[i].Render(Context);
	}
	
	this.UI.Render();
	
	if(this.isOver){
		Context.drawImage(this.imgOver, 0, 0);
		Context.drawImage(this.imgScrollUpper, 0, 0, 592, 560-this.scrollY*2, 184, this.scrollY, 592, 560-this.scrollY*2);
		Context.drawImage(this.imgScrollLower, 184, 560-this.scrollY );
		if(this.isScrollOpened){
			Context.fillStyle    = "#ffffff";
    		Context.font         = '56px "AgendaBold"'; 
    		Context.textBaseline = "bottom";
    		Context.textAlign	 = "right";
    		Context.fillText( this.scoreRender, 690, 172 );
    		Context.fillText( this.coinGainRender, 690, 276 );
		}
		
		if(this.flagScrollButton)
			Context.drawImage(this.imgScrollButtonDown, 0, 0, 240, 108-this.scrollY*2, 360, 463-this.scrollY, 240, 108-this.scrollY*2);
		else
			Context.drawImage(this.imgScrollButton, 0, 0, 240, 108-this.scrollY*2, 360, 463-this.scrollY, 240, 108-this.scrollY*2);
	}
	
	/* //변수 테스트
	Context.fillStyle    = "red";
    Context.font         = '20px Arial'; 
    Context.textBaseline = "top";
    Context.fillText( "플레이어 x : " + this.player.x, 600, 10 );
    Context.fillText( "플레이어 무적임? : " + this.player.isUnbeatable, 600, 35 );
    */
};
//게임 작동 로직
PlayGameState.prototype.Update = function(){
	//게임 오버되면 결과창을 띄우고, 게임 작동은 멈춤
	if(this.isOver){
		this.Result();
		return;
	}
	if(this.transition ==1){
		this.transAlpha += 40;
		if(this.transAlpha >255)
			this.transAlpha = 255;
	}
	//디펜스로써, 시간이 지나면 게임 끝!
	this.playTime += (1000/GAME_FPS);
	//플레이어 가는 방향에 따라 배경 움직임 , 한계점에 다다르면 배경 움직임 멈춤
	if(this.player.playerOnGoingTo == "right"){
		this.onGoingTo="right";
		if(this.BG00x<-1039) this.BG00x = -1039;
		this.BG00x -=1;
		if(this.BG01x<-1233) this.BG01x = -1233;
		this.BG01x -=2;
		if(this.BG02x<-1621) this.BG02x = -1621;
		this.BG02x -=4;
		if(this.BG03x<-1815) {
			this.BG03x = -1815;
			this.onGoingTo = "stop";
		}
		this.BG03x -=this.speed;
	} else if (this.player.playerOnGoingTo == "left"){
		this.onGoingTo="left";
		if(this.BG00x> -678) this.BG00x = -678;
		this.BG00x +=1;
		if(this.BG01x> -511) this.BG01x = -511;
		this.BG01x +=2;
		if(this.BG02x> -177) this.BG02x = -177;
		this.BG02x +=4;
		if(this.BG03x> -10) {
			this.BG03x = -10;
			this.onGoingTo = "stop";
		}
		this.BG03x +=this.speed;
	} else {
		this.onGoingTo = "stop";
	}
	
	this.UI.Update();
	this.ward.Update();
	this.npc.Update();
	this.player.Update();
	for(var i=0; i<this.arrMessage.length; i++){
		this.arrMessage[i].spliceFrame += (1000/GAME_FPS);
		this.arrMessage[i].y -= 2;
		if(game.onGoingTo=="right") this.arrMessage[i].x -= this.speed;
		if(game.onGoingTo=="left") this.arrMessage[i].x += this.speed;
		//this.arrMessage[i].Update();
		if(this.arrMessage[i].spliceFrame>700) this.arrMessage.splice(i, 1);
	}
	
	//npc(적, 아이템)과 플레이어간의 충돌 제어
	this.npc.CheckCollision( this.player );
	for(var i=0; i<this.npc.arrNPC.length; i++){
		if( ((this.npc.arrNPC[i].type == "spadeRight") || (this.npc.arrNPC[i].type == "spadeLeft")) && this.npc.arrNPC[i].HP>0 ){
			if(this.npc.arrNPC[i].isBeating){
				if( this.player.isUnbeatable == false ){
					soundSystem.PlaySound("sound/attacked.mp3");
					this.player.unbeatableTimer.Reset();
					this.player.HP-=this.npc.arrNPC[i].power;
					if(this.player.HP<=0){
						this.isOver = true;
					}
				}
			}
		}
	}
	//npc(적)과 와드 간의 충돌 제어
	this.npc.CheckCollision( this.ward );
	for(var i=0; i<this.npc.arrNPC.length; i++){
		if( ((this.npc.arrNPC[i].type == "spadeRight") || (this.npc.arrNPC[i].type == "spadeLeft")) && this.npc.arrNPC[i].HP>0 ){
			if(this.npc.arrNPC[i].isBeating){
				if( this.ward.isUnbeatable == false ){
					soundSystem.PlaySound("sound/attacked.mp3");
					this.ward.unbeatableTimer.Reset();
					this.ward.HP-=this.npc.arrNPC[i].power;
					if(this.ward.HP<=0){
						this.isOver = true;
					}
				}
			}
		}
	}
	//적이 스킬과 스플레시 데미지에 맞는지 여부 체크
	this.npc.CheckBeated();
	this.npc.CheckSplash();
};

PlayGameState.prototype.Message = function( type, _x, _y){
	var obj;
	if( type == "score"){
		obj = new GraphicObject( resourcePreLoader.GetImage("img/message_score.png"));
	} else if ( type == "exp"){
		obj = new GraphicObject( resourcePreLoader.GetImage("img/message_exp.png"));
	} else if ( type == "coin"){
		obj = new GraphicObject( resourcePreLoader.GetImage("img/message_coin.png"));
	} else if ( type == "level"){
		obj = new GraphicObject( resourcePreLoader.GetImage("img/message_level_up.png"));
	}
	obj.spliceFrame = 0;
	obj.SetPosition( _x, _y);
	this.arrMessage.push(obj);
};

//게임 결과 확인
PlayGameState.prototype.Result = function(){
	if(this.transition ==2){
		this.transAlpha -= 40;
		if(this.transAlpha < 0){
			this.transAlpha = 0;
			ChangeGameState( new SellectState("game") );
		}
	}
	this.scrollY -=20;
	if(this.scrollY < 9) {
		this.scrollY = 9;
		this.isScrollOpened = true;
	} else {
		this.isScrollOpened = false;
	}
	if(this.isScrollOpened){
		this.scoreRender +=100;
		if(this.scoreRender > this.score) this.scoreRender = this.score;
		this.coinGainRender +=100;
		if(this.coinGainRender > this.coinGain) this.coinGainRender = this.coinGain;
		
		if( (this.scoreRender==this.score)&&(this.coinGainRender==this.coinGain) ){
			if( (inputSystem.touchX>360) && (inputSystem.touchX<360+240) && (inputSystem.touchY>454) && (inputSystem.touchY<454+90) ){
				if(inputSystem.isTouch){
					if(this.flagScrollButton==false){
						this.flagScrollButton=true;
					}
				} else {
					if(this.flagScrollButton){
					soundSystem.PlaySound("sound/menuclick.mp3");
					this.transition =2;
					}
				}
			}
		}
	}
};