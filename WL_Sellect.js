function SellectState(e){
	this.flagSettingButton = false;
	this.imgSetting = resourcePreLoader.GetImage("img/settingbutton.png");
	this.imgSettingDown = resourcePreLoader.GetImage("img/settingbutton_down.png");
	this.flagBackButton = false;
	this.imgBack = resourcePreLoader.GetImage("img/backbutton.png");
	this.imgBackDown = resourcePreLoader.GetImage("img/backbutton_down.png");
	this.imgSellect = resourcePreLoader.GetImage("img/sellect.png");
	this.sellectMode = 0; //0:아무것도 선택안됨 / 1: 게임모드 / 2:데이터모드
	this.flagBackground = false; //스크롤이 열린 상태에서 배경을 눌렀는지 여부
	this.flagGameButton = false; // 버튼 눌렸는지 여부!
	this.imgGameButtonOn = resourcePreLoader.GetImage("img/sellect_gamebutton_on.png");
    this.imgGameButtonOff = resourcePreLoader.GetImage("img/sellect_gamebutton_off.png");
    this.flagDataButton = false; // 버튼 눌렸는지 여부!
    this.imgDataButtonOn = resourcePreLoader.GetImage("img/sellect_databutton_on.png");
    this.imgDataButtonOff = resourcePreLoader.GetImage("img/sellect_databutton_off.png");
    //게임 스크롤
    this.gameScrollY = -650;
    this.isGameScrollOpened = false; // 펼쳐져있는지여부
    this.imgGameScroll = resourcePreLoader.GetImage("img/sellect_gamescroll.png");
    this.imgGameScrollMask = resourcePreLoader.GetImage("img/sellect_gamescroll_mask.png");
    this.flagGameStartButton = false; // 게임 스타트 버튼 눌렸는지 여부
    this.imgGameStart = resourcePreLoader.GetImage("img/sellect_gamescroll_startbutton.png");
    this.imgGameStartDown = resourcePreLoader.GetImage("img/sellect_gamescroll_startbutton_down.png");
    //데이터 스크롤
    this.dataScrollY = -260;
    this.isDataScrollOpened = false; // 펼쳐져있는지여부
    this.imgDataScroll = resourcePreLoader.GetImage("img/sellect_datascroll.png");
    this.imgDataScrollMask = resourcePreLoader.GetImage("img/sellect_datascroll_mask.png");
    this.DataMode = 0; // 0은 전송, 1은 수령모드
    this.flagDataSendButton = false; //전송모드가 켜진상태에서 전송버턴을 눌렀는지
    this.flagDataReceiveButton = false; //수령 모드가 켜진 상태에서 전송버튼을 눌렀는지
    this.imgDataSendOn = resourcePreLoader.GetImage("img/sellect_datascroll_sendbutton_on.png");
    this.imgDataSendOnDown = resourcePreLoader.GetImage("img/sellect_datascroll_sendbutton_on_down.png");
    this.imgDataSendOff = resourcePreLoader.GetImage("img/sellect_datascroll_sendbutton_off.png");
    this.imgDataSendOffDown = resourcePreLoader.GetImage("img/sellect_datascroll_sendbutton_off_down.png");
	this.imgDataReceiveOn = resourcePreLoader.GetImage("img/sellect_datascroll_receivebutton_on.png");
    this.imgDataReceiveOnDown = resourcePreLoader.GetImage("img/sellect_datascroll_receivebutton_on_down.png");
    this.imgDataReceiveOff = resourcePreLoader.GetImage("img/sellect_datascroll_receivebutton_off.png");
    this.imgDataReceiveOffDown = resourcePreLoader.GetImage("img/sellect_datascroll_receivebutton_off_down.png");
    
    //게임 모드에서 바뀔때 음악 다시 재생!
    this.previousState = e;
    
    this.transition = 1; // 1은 들어올때, 2는 맵으로 다시 나갈때, 3은 게임으로 나갈때
	this.alpha = 0;
	this.transitionX = 960;
}

SellectState.prototype.Init = function(){
	if(this.previousState=="game"){
		soundSystem.PlayBackgroundMusic("sound/bgm_ready.mp3");
		this.sellectMode=1;
		this.gameScrollY = 16;
		this.isGameScrollOpened=true;
	}
};

SellectState.prototype.Render= function(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	
	//배경
	Context.globalAlpha = this.alpha / 255;
	Context.drawImage(this.imgSellect, 0, 0);
	//세팅 버튼
	if(this.flagSettingButton)
		Context.drawImage(this.imgSettingDown, 1, 1);
	else
		Context.drawImage(this.imgSetting, 1, 1);
	//뒤로가기 버튼
	if(this.flagBackButton)	
		Context.drawImage(this.imgBackDown, 5, 89);
	else
		Context.drawImage(this.imgBack, 5, 89);
		
	//데이터 스크롤
	Context.drawImage(this.imgDataScroll, 423, this.dataScrollY); // -260 ~ 251
	if( this.DataMode==0){ //전송모드
		if(this.flagDataSendButton)
			Context.drawImage(this.imgDataSendOnDown, 456, this.dataScrollY+71);
		else
			Context.drawImage(this.imgDataSendOn, 456, this.dataScrollY+71);
		if(this.flagDataReceiveButton)
			Context.drawImage(this.imgDataReceiveOffDown, 456, this.dataScrollY+219);
		else
			Context.drawImage(this.imgDataReceiveOff, 456, this.dataScrollY+219);
	} else if( this.DataMode==1) { //수령모드
		if(this.flagDataReceiveButton)
			Context.drawImage(this.imgDataReceiveOnDown, 456, this.dataScrollY+219);
		else
			Context.drawImage(this.imgDataReceiveOn, 456, this.dataScrollY+219);
		if(this.flagDataSendButton)
			Context.drawImage(this.imgDataSendOffDown, 456, this.dataScrollY+71);
		else
			Context.drawImage(this.imgDataSendOff, 456, this.dataScrollY+71);
	}
	//데이터 스크롤 마스킹
	Context.drawImage(this.imgDataScrollMask, 400, 0);
	
	//데이터 스크롤 버튼
	if(this.sellectMode==0){
		if(this.flagDataButton)
			Context.drawImage(this.imgDataButtonOff, 371, 157);
		else
			Context.drawImage(this.imgDataButtonOn, 371, 157);
	} else if (this.sellectMode==1){
		Context.drawImage(this.imgDataButtonOff, 371, 157);
	} else if (this.sellectMode==2){
		Context.drawImage(this.imgDataButtonOn, 371, 157);
	}
	
	
	//게임 스크롤
	Context.drawImage(this.imgGameScroll, 423, this.gameScrollY);
	if(this.flagGameStartButton)
		Context.drawImage(this.imgGameStartDown, 458, this.gameScrollY+360);
	else
		Context.drawImage(this.imgGameStart, 458, this.gameScrollY+360);
	//게임 스크롤 마스킹
	Context.drawImage(this.imgGameScrollMask, 400, 0);
	
	//게임 스크롤 버튼
	if(this.sellectMode==0){
		if(this.flagGameButton)
			Context.drawImage(this.imgGameButtonOff, 371, 26);
		else
			Context.drawImage(this.imgGameButtonOn, 371, 26);
	} else if (this.sellectMode==1){
		Context.drawImage(this.imgGameButtonOn, 371, 26);
	} else if (this.sellectMode==2){
		Context.drawImage(this.imgGameButtonOff, 371, 26);
	}
	
	if(this.transition ==3){
		Context.globalAlpha = 1;
		Context.fillStyle = "#000000";
		Context.fillRect(this.transitionX, 0, 960, 640);
	}
};

SellectState.prototype.UpdateUI = function(){
	if( (this.sellectMode==0) && (this.isGameScrollOpened==false) && (this.isDataScrollOpened==false) ){ // 아무 모드도 아니면서 스크롤이 전부 닫혀있을때
		if(inputSystem.touchX>371 && inputSystem.touchY>26 && inputSystem.touchX<371+563 && inputSystem.touchY<26+105){
			if(inputSystem.isTouch){
				if(this.flagGameButton==false){
					this.flagGameButton=true;
				}
			} else {
				if(this.flagGameButton){ // 버튼 클릭후 반응 부분
					soundSystem.PlaySound("sound/menuclick.mp3");
					this.sellectMode=1;
				}
			}
		} else {
			this.flagGameButton=false;
		}
		if(inputSystem.touchX>371 && inputSystem.touchY>157 && inputSystem.touchX<371+563 && inputSystem.touchY<157+105){
			if(inputSystem.isTouch){
				if(this.flagDataButton==false){
					this.flagDataButton=true;
				}
			} else {
				if(this.flagDataButton){ // 버튼 클릭 후 반응 부분
					soundSystem.PlaySound("sound/menuclick.mp3");
					this.sellectMode=2;
				}
			} 
		} else {
			this.flagDataButton=false;
		}
		//뒤로가기 버튼은 아무것도 선택 안된 모드일때만 실행
		if(inputSystem.touchX>5 && inputSystem.touchY>89 && inputSystem.touchX<5+70 && inputSystem.touchY<89+63){
			if(inputSystem.isTouch){
				if(this.flagBackButton==false){
					this.flagBackButton=true;
				}
			} else {
				if(this.flagBackButton){
					soundSystem.PlaySound("sound/menuclick.mp3");
					this.transition = 2;
					this.flagBackButton=false;
				}
			}
		} else {
			this.flagBackButton=false;
		}
	}
	// 게임모드로 바뀌고 게임 스크롤이 펴졌을때
	if( (this.sellectMode==1) && this.isGameScrollOpened ){
		//게임 스타트 버튼 제어 
		if(inputSystem.touchX>458 && inputSystem.touchY>this.gameScrollY+360 && inputSystem.touchX<458+383 && inputSystem.touchY<this.gameScrollY+360+222){
			if(inputSystem.isTouch){
				if(this.flagGameStartButton==false){
					this.flagGameStartButton=true;
				}
			} else {
				if(this.flagGameStartButton){
					soundSystem.PlaySound("sound/menuclick.mp3");
					this.transition =3;
					this.flagGameStartButton=false;
				}
			}
		} else {
			this.flagGameStartButton=false;
		}
		//배경 클릭 제어
		if(inputSystem.touchX>0 && inputSystem.touchY>0 && inputSystem.touchX<430 && inputSystem.touchY<640){
			if(inputSystem.isTouch){
				if (this.flagBackground==false){
					this.flagBackground = true;
				}
			} else {
				if(this.flagBackground){
					soundSystem.PlaySound("sound/menuclick.mp3");
					this.sellectMode = 0;
					this.flagGameButton = false;
					this.flagDataButton = true;
					this.flagBackground = false;
				}
			}
		} else {
			this.flagBackground = false;
		}
	}
	
	// 데이터모드로 바뀌고 데이터 스크롤이 펴졌을때
	if( (this.sellectMode==2) && this.isDataScrollOpened ){
		//데이터 전송 버튼 제어
		if(this.DataMode ==0){ //전송 모드
			if(inputSystem.touchX>456 && inputSystem.touchY>this.dataScrollY+71 && inputSystem.touchX<456+386 && inputSystem.touchY<this.dataScrollY+71+97 ){
				if(inputSystem.isTouch){
					if (this.flagDataSendButton==false){
						this.flagDataSendButton = true;
						console.log(this.flagDataSendButton);
					}
				} else {
					if (this.flagDataSendButton){
						soundSystem.PlaySound("sound/menuclick.mp3");
						this.flagDataSendButton = false;
						//정보 전송 시스템 넣기!!/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						
					}
				}
			} else {
				this.flagDataSendButton = false;
			}
			if(inputSystem.touchX>456 && inputSystem.touchY>this.dataScrollY+219 && inputSystem.touchX<456+386 && inputSystem.touchY<this.dataScrollY+219+97 ){
				if(inputSystem.isTouch){
					if (this.flagDataReceiveButton==false){
						this.flagDataReceiveButton = true;
					}
				} else {
					if (this.flagDataReceiveButton){
						soundSystem.PlaySound("sound/menuclick.mp3");
						this.DataMode=1;
						this.flagDataReceiveButton = false;
					}
				}
			} else {
				this.flagDataReceiveButton = false;
			}				
		} else if (this.DataMode ==1){ //수령 모드
			if(inputSystem.touchX>456 && inputSystem.touchY>this.dataScrollY+71 && inputSystem.touchX<456+386 && inputSystem.touchY<this.dataScrollY+71+97 ){
				if(inputSystem.isTouch){
					if (this.flagDataSendButton==false){
						this.flagDataSendButton = true;
					}
				} else {
					if (this.flagDataSendButton){
						soundSystem.PlaySound("sound/menuclick.mp3");
						this.DataMode=0;
						this.flagDataSendButton = false;
					}
				}
			} else {
				this.flagDataSendButton = false;
			}
			if(inputSystem.touchX>456 && inputSystem.touchY>this.dataScrollY+219 && inputSystem.touchX<456+386 && inputSystem.touchY<this.dataScrollY+219+97 ){
				if(inputSystem.isTouch){
					if (this.flagDataReceiveButton==false){
						this.flagDataReceiveButton = true;
					}
				} else {
					if (this.flagDataReceiveButton){
						soundSystem.PlaySound("sound/menuclick.mp3");
						this.flagDataReceiveButton = false;
						//준비중입니다 메시지 넣기!!/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
						
					}
				}
			} else {
				this.flagDataReceiveButton = false;
			}
		}
		//배경 클릭 제어
		if(inputSystem.touchX>0 && inputSystem.touchY>0 && inputSystem.touchX<430 && inputSystem.touchY<640){
			if(inputSystem.isTouch){
				if (this.flagBackground==false){
					this.flagBackground = true;
				}
			} else {
				if(this.flagBackground){
					soundSystem.PlaySound("sound/menuclick.mp3");
					this.DataMode = 0;
					this.sellectMode = 0;
					this.flagDataButton = false;
					this.flagGameButton = true;
					this.flagBackground = false;
				}
			}
		} else {
			this.flagBackground = false;
		}
	}
};

SellectState.prototype.ScrollMove = function(){
	//게임 스크롤
	if(this.sellectMode==1){
		if(this.isGameScrollOpened == false){
			this.gameScrollY +=30;
			if(this.gameScrollY>16) {
				this.gameScrollY = 16;
				this.isGameScrollOpened = true;
			}
		}
	}
	//데이터스크롤
	if(this.sellectMode==2){
		if(this.isDataScrollOpened == false){
			this.dataScrollY +=30;
			if(this.dataScrollY>251) {
				this.dataScrollY = 251;
				this.isDataScrollOpened = true;
			}
		}
	}
	if(this.sellectMode==0){
		if(this.isGameScrollOpened){
			this.gameScrollY -=30;
			if(this.gameScrollY<-650) {
				this.gameScrollY = -650;
				this.isGameScrollOpened = false;
				this.flagDataButton = false;
			}
		}
		if(this.isDataScrollOpened){
			this.dataScrollY -=30;
			if(this.dataScrollY<-260) {
				this.dataScrollY = -260;
				this.isDataScrollOpened = false;
				this.flagGameButton = false;
			}
		}
	}
};

SellectState.prototype.Update = function(){
	this.UpdateUI();
	this.ScrollMove();
	if(this.transition ==1){
		this.alpha += 20;
		if(this.alpha >255)
			this.alpha = 255;
	} else if(this.transition ==2){
		this.alpha -= 20;
		if(this.alpha < 0){
			this.alpha = 0;
			ChangeGameState( new MapState("sellect") );
		}
	} else if(this.transition ==3){
		this.transitionX -= 40;
		if(this.transitionX < 0){
			this.transitionX = 0;
			ChangeGameState( new LoadGameState("sellect") );
		}
	}
};

