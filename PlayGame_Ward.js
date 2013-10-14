var pgWard;

function PGWard(){
	this.imgWard = resourcePreLoader.GetImage("img/game_ward.png");
	this.shadow = resourcePreLoader.GetImage("img/shadow.png");
	
	this.x = 426;
	this.y = 406;
	this.HP = 200;
	this.fullHP = 200;
	this.speed = 1; // 벌벌 떠는것!
	this.unbeatableTimer = new Timer();
	this.isUnbeatable = true; // 초기 시작시 무적!
	this.collisionBox = {left:this.x+10, top:this.y, right:this.x+37, bottom:this.y+78};
	
	pgWard = this;
}

PGWard.prototype.Render = function(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	
	Context.drawImage(this.shadow, this.x+2, this.y+69);
	Context.drawImage(this.imgWard, this.x, this.y);
};

PGWard.prototype.Update = function(){
	this.speed *= -1; // 계속 떨고 있음을 표현!
	if(game.onGoingTo=="stop") this.x += this.speed;
	if(game.onGoingTo=="right") this.x += this.speed-game.speed;
	if(game.onGoingTo=="left") this.x += this.speed+game.speed;
	this.collisionBox = {left:this.x+10, top:this.y, right:this.x+37, bottom:this.y+78};
	
	//무적 시간
	if(this.unbeatableTimer.nowFrame <4000){ // 적의 공격속도를 추가하게 되면 이곳을 제어할것!
		this.isUnbeatable = true;
	} else {
		this.isUnbeatable = false;
	}
};