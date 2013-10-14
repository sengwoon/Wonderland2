//게임을 맨 처음 실행할때 정해지고 그 이후로는 변동!
var pgPlayer;
var level = 1;
var exp = 0;
var fullExp = 100;
var fullHP = 100;
var inventoryCoin = 0;

function PGPlayer(){
	this.sprPlayerRight = new SpriteAnimation( resourcePreLoader.GetImage("img/game_player_right.png"), 50, 82, 8, 15);
	this.sprPlayerLeft = new SpriteAnimation( resourcePreLoader.GetImage("img/game_player_left.png"), 50, 82, 8, 15);
	this.shadow = resourcePreLoader.GetImage("img/shadow.png");
	this.x = 294;
	this.y = 403;
	this.HP;
	this.speed = 5;
	this.skillPower;
	this.skillRate;
	this.skillKnockback;
	this.playerDirection="right"; //캐릭터 방향, 스프라이트 출력과 이동을 제어
	this.playerOnGoingTo= "stop"; //화면 너머로 더 가는지 여부, 게임에 값을 넘겨서 화면 이동을 제어
	this.unbeatableTimer = new Timer();
	this.isUnbeatable = true; // 초기 시작시 무적!
	this.collisionBox = {left:this.x+10, top:this.y, right:this.x+40, bottom:this.y+82};
	this.Invalid();
	this.LevelUpTimer = new Timer();
	
	this.imgFireRight = resourcePreLoader.GetImage("img/game_fireball_right.png");
	this.imgFireLeft = resourcePreLoader.GetImage("img/game_fireball_left.png");
	this.arrSkill = new Array();
	
	this.sprSpellRight = new SpriteAnimation( resourcePreLoader.GetImage("img/skillspelling_right.png"), 20, 60, 76, 30);
	this.sprSpellLeft = new SpriteAnimation( resourcePreLoader.GetImage("img/skillspelling_left.png"), 20, 60, 76, 30);
	this.arrSpell = new Array();
	this.flagSpell = false;
	this.skillTimer = new Timer();
	
	this.imgExploRight = resourcePreLoader.GetImage("img/game_flame_right.png");
	this.imgExploLeft = resourcePreLoader.GetImage("img/game_flame_left.png");
	this.arrExplo = new Array();
	
	pgPlayer = this;
}

PGPlayer.prototype.Render = function(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	
	if(this.playerDirection=="right"){
		Context.drawImage(this.shadow, this.x+2, this.y+72);
		this.sprPlayerRight.Render(Context);
		this.sprSpellRight.Render(Context);
	} else if (this.playerDirection=="left"){
		Context.drawImage(this.shadow, this.x+3, this.y+72);
		this.sprPlayerLeft.Render(Context);
		this.sprSpellLeft.Render(Context);
	}
	
	for(var i=0; i<this.arrSkill.length; i++){
		this.arrSkill[i].Render( Context );
	}
	
	for(var j=0; j<this.arrExplo.length; j++){
		this.arrExplo[j].Render ( Context );
	}
};
PGPlayer.prototype.Update = function(){
	// 스프라이트 최신화!	
	this.LevelSetting();
	this.sprPlayerRight.Update();
	this.sprPlayerLeft.Update();
	this.sprSpellRight.SpellUpdate(this.skillRate, this.flagSpell);
	this.sprSpellLeft.SpellUpdate(this.skillRate, this.flagSpell);
	this.sprSpellRight.SetPosition( this.x+50, this.y+10);
	this.sprSpellLeft.SetPosition( this.x-20, this.y+10);
	//폭발 이펙트 렌더링 및 수치 없데이트 및 제거
	for(var j=0; j<this.arrExplo.length; j++){
		this.arrExplo[j].ExploUpdate();
		if(game.onGoingTo=="right") {
			this.arrExplo[j].Translate(-game.speed);
			this.arrExplo[j].collisionBox.left -= game.speed;
			this.arrExplo[j].collisionBox.right -= game.speed;
		} else if(game.onGoingTo=="left") {
			this.arrExplo[j].Translate(+game.speed);
			this.arrExplo[j].collisionBox.left += game.speed;
			this.arrExplo[j].collisionBox.right += game.speed;
		}
		this.arrExplo[j].spliceFrame += (1000/GAME_FPS);
		if(this.arrExplo[j].spliceFrame == (1000/GAME_FPS)){
			this.arrExplo[j].splash = false;
		}
		if(this.arrExplo[j].spliceFrame >1500) this.arrExplo.splice(j, 1);
	}
	
	// UI의 방향조절값을 받아와서 케릭터 방향에 적용!
	this.playerDirection = pgUI.UIdirection;
	//플레이어 이동 로직
	if(this.playerDirection == "right"){
		this.x += this.speed;
		if(this.x>660){
			this.x = 660;
			this.playerOnGoingTo = "right";
		} else {
			this.playerOnGoingTo = "stop";
			//game.direction = "stop";
		}
		this.Invalid();
	} else if(this.playerDirection == "left"){
		this.x -= this.speed;
		if(this.x<300){
			this.x = 300;
			this.playerOnGoingTo = "left";
		} else {
			this.playerOnGoingTo = "stop";
		}
		this.Invalid();
	}
	//무적 시간
	if(this.unbeatableTimer.nowFrame <1500){
		this.isUnbeatable = true;
	} else {
		this.isUnbeatable = false;
	}
	
	//파이어볼 추가, 이동 및 제거 로직
	this.PushSkill(this.skillPower);
	for(var i=0; i<this.arrSkill.length; i++){
		if(game.onGoingTo=="stop") this.arrSkill[i].x += this.arrSkill[i].speed;
		if(game.onGoingTo=="right") this.arrSkill[i].x += (this.arrSkill[i].speed-game.speed);
		if(game.onGoingTo=="left") this.arrSkill[i].x += (this.arrSkill[i].speed+game.speed);
		this.arrSkill[i].Update();
		if(this.arrSkill[i].x > (game.BG03x+2785+100)){
			this.arrSkill.splice(i, 1);
			continue;
		}
		if(this.arrSkill[i].x < (game.BG03x-100)){
		 	this.arrSkill.splice(i, 1);
		 	continue;
		}
	}
};

// 플레이어 방향에 따라 파이어볼 삽입
PGPlayer.prototype.PushSkill = function( _power){
	var obj;
	if(this.playerDirection == "right"){
		obj = new SpriteAnimation( resourcePreLoader.GetImage("img/game_fireball_right.png"), 46, 27, 28, 30);
		obj.type = "heartright";
		obj.speed = 7;
		obj.power = _power;
		if(Math.round(Math.random()*(4/this.skillKnockback)) == 1)
			obj.knockback = true;
		else
			obj.knockback = false;
		obj.SetPosition( this.x + 50, this.y+41-13 ); // 오른쪽이므로 플레이어 가로만큼 앞에, 높이는 플레이어 절반만큼 낮고 파이어볼 절반만큼 높게
	} else if(this.playerDirection == "left"){
		obj = new SpriteAnimation( resourcePreLoader.GetImage("img/game_fireball_left.png"), 46, 27, 28, 30);
		obj.type = "heartleft";
		obj.speed = -7;
		obj.power = _power;
		if(Math.round(Math.random()*(4/this.skillKnockback)) == 1)
			obj.knockback = true;
		else
			obj.knockback = false;
		obj.SetPosition( this.x-46, this.y+41-13 );
	}
	if(this.skillTimer.nowFrame > 2500 / this.skillRate){
		soundSystem.PlaySound("sound/attack.mp3");
		this.arrSkill.push( obj );
		this.skillTimer.Reset();
		this.flagSpell = true;
	} else {
		this.flagSpell = false;
	}
};
//파이어볼 방향에 따라 폭발 삽입
PGPlayer.prototype.Explosion = function(type, _x, _y, power){
	var explo;
	if(type == "heartright"){
		explo = new SpriteAnimation( resourcePreLoader.GetImage("img/game_flame_right.png"), 60, 60, 19, 30);
		explo.SetPosition(_x-20, _y+20);
		explo.collisionBox = {left:_x-40, top:_y+20, right:_x-20+60, bottom:_y+20+60};
	} else if(type == "heartleft"){
		explo = new SpriteAnimation( resourcePreLoader.GetImage("img/game_flame_left.png"), 60, 60, 19, 30);
		explo.SetPosition(_x+14, _y+20);
		explo.collisionBox = {left:_x+14, top:_y+20, right:_x+14+60, bottom:_y+20+60};
	}
	explo.power = power/4;
	if(level<3)
		explo.splash = false;
	else
		explo.splash = true;
	explo.spliceFrame = 0;
	this.arrExplo.push( explo );
};


// 플레이어 좌표를 스프라이트의 좌표와 동기화
PGPlayer.prototype.Invalid = function(){
	this.sprPlayerRight.SetPosition( this.x, this.y);
	this.sprPlayerLeft.SetPosition( this.x, this.y);
	this.collisionBox = {left:this.x+10, top:this.y, right:this.x+40, bottom:this.y+82};
};
PGPlayer.prototype.LevelSetting = function(){
	if(exp>=fullExp){
		level++;
		game.Message("level", this.x-50, this.y);
		exp=0;
		this.LevelUpTimer.Reset();
	} 
	if(level==1){
		fullHP=100;
		this.skillPower = 50;
		this.skillRate = 1;
	}else if(level==2){
		fullExp = 200;
		fullHP=200;
		this.skillPower = 75;
		this.skillRate = 2;
		if(this.LevelUpTimer.nowFrame<(1000/30)) this.HP = fullHP;
	} else if(level==3){
		fullExp = 400;
		fullHP=300;
		if(this.LevelUpTimer.nowFrame<(1000/30)) this.HP = fullHP;
	} else if(level==4){
		fullExp = 800;
		fullHP=400;
		this.skillPower = 90;
		this.skillKnockback =2;
		if(this.LevelUpTimer.nowFrame<(1000/30)) this.HP = fullHP;
	} else if(level==4){
		fullExp = 1600;
		fullHP=500;
		this.skillPower = 100;
		if(this.LevelUpTimer.nowFrame<(1000/30)) this.HP = fullHP;
	} else if(level==5){
		exp=0;
		fullHP=600;
		this.skillRate = 3;
		this.skillKnockback = 4;
		if(this.LevelUpTimer.nowFrame<(1000/30)) this.HP = fullHP;
	}
};
