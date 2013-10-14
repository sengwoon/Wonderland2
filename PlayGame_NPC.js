var pgNPC;
function PGNPC(){
	this.imgEnemySpadeRight = resourcePreLoader.GetImage("img/game_enemy_spade_right.png");
	this.imgEnemySpadeLeft = resourcePreLoader.GetImage("img/game_enemy_spade_left.png");
	this.imgEnemySpadeRightDead = resourcePreLoader.GetImage("img/game_enemy_spade_right_dead.png");
	this.imgEnemySpadeLeftDead = resourcePreLoader.GetImage("img/game_enemy_spade_left_dead.png");
	this.shadow = resourcePreLoader.GetImage("img/shadow.png");
	this.coin = resourcePreLoader.GetImage("img/game_item_coin.png");
	this.arrNPC = new Array();
	
	this.imgKnockbackRight = resourcePreLoader.GetImage("img/game_knockback_right.png");
	this.imgKnockbackLeft = resourcePreLoader.GetImage("img/game_knockback_left.png");
	this.arrKnockback = new Array();
	
	//적 생성 제어용 타이머
	this.enemyTimer = new Timer();
	pgNPC = this;
}

PGNPC.prototype.Render = function(){
	var theCanvas = document.getElementById("GameCanvas");
	var Context = theCanvas.getContext("2d");
	//NPC타입에 따라 그림자 위치 다르게 출력
	for(var i=0; i<this.arrNPC.length; i++){
		if(this.arrNPC[i].type=="spadeRight") {
			if(this.arrNPC[i].HP>0) {
				Context.drawImage(this.shadow, this.arrNPC[i].x+13, this.arrNPC[i].y+82);
				this.arrNPC[i].Render( Context );
				//체력 게이지
				Context.fillStyle="#696969";
				Context.fillRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
				Context.fillStyle="#f33e44";
				Context.fillRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64*(this.arrNPC[i].HP/this.arrNPC[i].fullHP), 4);
				Context.strokeStyle="#353535";
				Context.strokeRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
			} else {
				Context.drawImage(this.shadow, this.arrNPC[i].x+13, this.arrNPC[i].y+82);
				Context.drawImage(this.imgEnemySpadeRightDead, this.arrNPC[i].x+10, this.arrNPC[i].y);
				//체력 게이지
				Context.fillStyle="#696969";
				Context.fillRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
				Context.strokeStyle="#353535";
				Context.strokeRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
			}
		} else if(this.arrNPC[i].type=="spadeLeft") {
			if(this.arrNPC[i].HP>0){
				Context.drawImage(this.shadow, this.arrNPC[i].x+6, this.arrNPC[i].y+82);
				this.arrNPC[i].Render( Context );
				//체력 게이지
				Context.fillStyle="#696969";
				Context.fillRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
				Context.fillStyle="#f33e44";
				Context.fillRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64*(this.arrNPC[i].HP/this.arrNPC[i].fullHP), 4);
				Context.strokeStyle="#353535";
				Context.strokeRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
			} else {
				Context.drawImage(this.shadow, this.arrNPC[i].x+13, this.arrNPC[i].y+82);
				Context.drawImage(this.imgEnemySpadeLeftDead, this.arrNPC[i].x-5, this.arrNPC[i].y);
				//체력 게이지
				Context.fillStyle="#696969";
				Context.fillRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
				Context.strokeStyle="#353535";
				Context.strokeRect(this.arrNPC[i].x, this.arrNPC[i].y-16, 64, 4);
			}
		} else if(this.arrNPC[i].type=="coin"){
			Context.drawImage(this.shadow, this.arrNPC[i].x-6, 466+12);
			this.arrNPC[i].Render( Context );
		}
	}
	
	for(var j=0; j<this.arrKnockback.length; j++){
		this.arrKnockback[j].Render ( Context );
	}
};

PGNPC.prototype.Update = function(){
	//적 생성 시간 및 객체수 제어
	if( game.playTime < 40000 ){
		if( (this.enemyTimer.nowFrame) >= 5000 ) // 5초마다 적이 추가됨
			this.AddEnemy();
	} else if( (game.playTime>=40000)&&(game.playTime<60000) ){
		if( (this.enemyTimer.nowFrame) >= 4000 ) // 4초마다 적이 추가됨
			this.AddEnemy();
	} else if( game.playTime >=60000 ){
		if( (this.enemyTimer.nowFrame) >= 3000 ){ // 3초마다 적이 렌덤하게 두마리까지
			for(var i=0; i<1+Math.round(Math.random()); i++){
				this.AddEnemy();
			}
		}
	}
	//개체별 프레임 제어
	for(var i=0; i<this.arrNPC.length; i++){
		//적은 체력이 0보다 작아지면 드롭프레임이 증가
		if( (this.arrNPC[i].type == "spadeRight") || (this.arrNPC[i].type == "spadeLeft") ){
			if(this.arrNPC[i].HP<=0){
				this.arrNPC[i].dropFrame += (1000/GAME_FPS);
			}
			//넉백시 1.5초간 넉백 유지
			if(this.arrNPC[i].isKnockback){
				this.arrNPC[i].knockbackFrame += (1000/GAME_FPS);
				if(this.arrNPC[i].knockbackFrame > 1500) this.arrNPC[i].isKnockback=false;
			}
		}
		//코인은 생성직후 바니쉬프레임이 증가
		if(this.arrNPC[i].type == "coin"){
			this.arrNPC[i].vanishFrame += (1000/GAME_FPS);
			//5초전엔 동전이 위로 올라갔다 내려옴
			if(this.arrNPC[i].vanishFrame<3000){ 
				this.arrNPC[i].y += this.arrNPC[i].speedY;
				this.arrNPC[i].speedY += 1.5;
				if(this.arrNPC[i].y > 466) this.arrNPC[i].y=466; // 463이어야 다른 그림자와 같으나, 좀 더 낮게 떨어지도록. 
			}
		}
	}
	//적 이동. 타입에 따라 돈은 와드와 동일한 로직을 적용할 것
	for(var i=0; i<this.arrNPC.length; i++){
		 if ( (this.arrNPC[i].isBeating) || (this.arrNPC[i].HP<=0) || (this.arrNPC[i].isKnockback) || (this.arrNPC[i].type == "coin")){ // 와드를 치고있을때나 죽었을때나 넉백상태거나 코인이면 배경의 속도만 적용
		 	if(game.onGoingTo=="right") this.arrNPC[i].x -= game.speed;
			if(game.onGoingTo=="left") this.arrNPC[i].x += game.speed;
		 } else {
			if(game.onGoingTo=="stop") this.arrNPC[i].x += this.arrNPC[i].speed;
			if(game.onGoingTo=="right") this.arrNPC[i].x += (this.arrNPC[i].speed-game.speed);
			if(game.onGoingTo=="left") this.arrNPC[i].x += (this.arrNPC[i].speed+game.speed);
		} 
		if(this.arrNPC[i].Update) this.arrNPC[i].Update(); // 스프라이트를 위해, 업데이트 시켜줌
	}
	for(var j=0; j<this.arrKnockback.length; j++){
		if(game.onGoingTo=="right") this.arrKnockback[j].x -= game.speed;
		if(game.onGoingTo=="left") this.arrKnockback[j].x += game.speed;
		this.arrKnockback[j].ExploUpdate();
		this.arrKnockback[j].spliceFrame += (1000/GAME_FPS);
		if(this.arrKnockback[j].spliceFrame >1000) this.arrKnockback.splice(j, 1);
	}
	//충돌이 아닌 경우 객체가 사라지는 조건
	for(var i=0; i<this.arrNPC.length; i++){
		//적이 사라지는 로직 (화면밖으로 나가거나 죽거나)
		if( (this.arrNPC[i].type == "spadeRight") || (this.arrNPC[i].type == "spadeLeft") ){
			if(this.arrNPC[i].x > (game.BG03x+2785+100)){ // 적이 사라지는 분기점
				this.arrNPC.splice(i, 1);
				this.AddEnemy();
				continue;
			}
			if(this.arrNPC[i].x < (game.BG03x-100)){ // 적이 사라지는 분기점
				this.arrNPC.splice(i, 1);
				this.AddEnemy();
				continue;
			}
			if(this.arrNPC[i].dropFrame>2000){
				if( Math.round(Math.random()) == 1 ){
					this.AddObject( "coin", this.arrNPC[i].x+16, this.arrNPC[i].y+70 ); // 50% 확률로 아이템 드롭!
					soundSystem.PlaySound("sound/item_drop.mp3");
				}
				this.arrNPC.splice(i,1);
				continue;
			}
		}
		//코인의 바니쉬프레임이 10초가 넘으면 사라짐
		if( this.arrNPC[i].type == "coin"){
			if(this.arrNPC[i].vanishFrame>10000){
				this.arrNPC.splice(i,1);
				continue;
			}
		}
	}
};

//지정한 타입과 좌표에 NPC객체 추가
PGNPC.prototype.AddObject = function( type, _x, _y){
	var obj;
	if( type == "spadeRight"){
		obj = new SpriteAnimation( this.imgEnemySpadeRight, 64, 92, 4, 8);
		obj.type = "spadeRight";
		obj.speed =2;
		obj.HP=100;
		obj.fullHP=100;
		obj.exp=5;
		obj.isBeating = false;
		obj.power=20;
		obj.dropFrame=0;
		obj.isKnockback = false;
		obj.knockbackFrame=0;
	} else if (type =="spadeLeft"){
		obj = new SpriteAnimation( this.imgEnemySpadeLeft, 64, 92, 4, 8);
		obj.type = "spadeLeft";
		obj.speed =-2;
		obj.HP=100;
		obj.fullHP=100;
		obj.exp=5;
		obj.isBeating = false;
		obj.power=20;
		obj.dropFrame=0;
		obj.isKnockback = false;
		obj.knockbackFrame=0;
	} else if (type =="coin"){
		obj = new GraphicObject( this.coin, 64, 92, 4, 8);
		obj.type = "coin";
		obj.vanishFrame=0;
		obj.speedY =-10;
	}
	obj.SetPosition( _x, _y);
	this.arrNPC.push( obj );
};
//게임 저체 시간에 따라 적 추가, 렌덤하게 지정된 타입으로 추가
PGNPC.prototype.AddEnemy = function(){
	if( Math.random() > 0.5 ){
		this.AddObject( "spadeRight", game.BG03x-400+(Math.random()*300), 393);
	} else {
		this.AddObject( "spadeLeft", game.BG03x+2785+400-(Math.random()*300), 393);
	}
	this.enemyTimer.Reset();
};

PGNPC.prototype.Knockback = function(type, _x, _y){
	var knock;
	if( type == "heartright"){
		knock = new SpriteAnimation( resourcePreLoader.GetImage("img/game_knockback_right.png"), 30, 60, 12, 30);
		knock.SetPosition(_x, _y);
	} else if ( type == "heartleft"){
		knock = new SpriteAnimation( resourcePreLoader.GetImage("img/game_knockback_left.png"), 30, 60, 12, 30);
		knock.SetPosition(_x, _y);
	}
	knock.spliceFrame = 0;
	this.arrKnockback.push( knock );
};

//NPC 객체 종유별로 대상과의 충돌 체크. 게임상태에서 불러냄
PGNPC.prototype.CheckCollision = function( target ){
	for(var i=0; i<this.arrNPC.length; i++){
		//타입이 적 이고, 체력이 남아 있으며 캐릭터가 접근 가능한 영역 안으로 들어온 적에 한해서만 충돌을 계산한다
		if( (this.arrNPC[i].type == "spadeRight") && (this.arrNPC[i].HP>0) ){
			var collisionBox = {left:this.arrNPC[i].x+10, top:this.arrNPC[i].y, right:this.arrNPC[i].x+54, bottom:this.arrNPC[i].y+92};
			//플레이어, 와드와의 충돌
			if( (collisionBox.left<target.collisionBox.right) && (collisionBox.bottom>target.collisionBox.top) && (collisionBox.right > target.collisionBox.left) && (collisionBox.top < target.collisionBox.bottom)){
				this.arrNPC[i].isBeating = true;
			} else {
				this.arrNPC[i].isBeating = false;
			}
		}
		if( (this.arrNPC[i].type == "spadeLeft") && (this.arrNPC[i].HP>0)){
			var collisionBox = {left:this.arrNPC[i].x+10, top:this.arrNPC[i].y, right:this.arrNPC[i].x+54, bottom:this.arrNPC[i].y+92};
			//플레이어와, 와드와의 충돌
			if( (collisionBox.left<target.collisionBox.right) && (collisionBox.bottom>target.collisionBox.top) && (collisionBox.right > target.collisionBox.left) && (collisionBox.top < target.collisionBox.bottom)){
				this.arrNPC[i].isBeating = true;
			} else {
				this.arrNPC[i].isBeating = false;
			}
		}
		if(this.arrNPC[i].type == "coin"){
			var collisionBox = {left:this.arrNPC[i].x, top:this.arrNPC[i].y, right:this.arrNPC[i].x+32, bottom:this.arrNPC[i].y+27};
			if( (collisionBox.left<target.collisionBox.right) && (collisionBox.bottom>target.collisionBox.top) && (collisionBox.right > target.collisionBox.left) && (collisionBox.top < target.collisionBox.bottom)){
				game.Message("coin", this.arrNPC[i].x, this.arrNPC[i].y);
				this.arrNPC.splice(i, 1);
				game.coinGain += 100;
				soundSystem.PlaySound("sound/item_gain.mp3");
				break;
			}
		}
	}
};
//스킬과의 충돌 체크. 게임상태 에서 불러냄
PGNPC.prototype.CheckBeated = function(){
	var target = pgPlayer.arrSkill;
	for(var i=0; i<this.arrNPC.length; i++){
		if( (this.arrNPC[i].type == "spadeRight") && (this.arrNPC[i].HP>0) && (this.arrNPC[i].x>game.BG03x+350 ) && (this.arrNPC[i].x<game.BG03x+2785-350 ) ){
			var collisionBox = {left:this.arrNPC[i].x+10, top:this.arrNPC[i].y, right:this.arrNPC[i].x+54, bottom:this.arrNPC[i].y+92};
			for(var j=0; j<target.length; j++){
				var skillBox = {left:target[j].x, top:target[j].y, right:target[j].x+46, bottom:target[j].y+27};
				if( (collisionBox.left<skillBox.right) && (collisionBox.bottom>skillBox.top) && (collisionBox.right > skillBox.left) && (collisionBox.top < skillBox.bottom)){
					this.arrNPC[i].HP-=target[j].power;
					
					console.log(i+"번 적 "+j+"번 스킬에 맞음");
					
					pgPlayer.Explosion(target[j].type, this.arrNPC[i].x, this.arrNPC[i].y, target[j].power);
					if( target[j].knockback && (this.arrNPC[i].isKnockback==false) ){
						this.arrNPC[i].x +=target[j].speed*5;
						this.Knockback(target[j].type, this.arrNPC[i].x-target[j].speed*7, this.arrNPC[i].y+30);
						this.arrNPC[i].isKnockback = true;
					}
					target.splice(j, 1);
					game.score += 50;
					game.Message("score", this.arrNPC[i].x, this.arrNPC[i].y+20);
					soundSystem.PlaySound("sound/flame.mp3");
					if(this.arrNPC[i].HP<=0){
						game.score += 50;
						game.Message("score", this.arrNPC[i].x, this.arrNPC[i].y-20);
						game.kill ++;
						exp += this.arrNPC[i].exp;
						game.Message("exp", this.arrNPC[i].x, this.arrNPC[i].y);
						this.arrNPC[i].dropFrame++;
					}
				}
			}
		}
		if( (this.arrNPC[i].type=="spadeLeft") && (this.arrNPC[i].HP>0) && (this.arrNPC[i].x>game.BG03x+300 ) && (this.arrNPC[i].x<game.BG03x+2785-300 ) ){
			var collisionBox = {left:this.arrNPC[i].x+10, top:this.arrNPC[i].y, right:this.arrNPC[i].x+54, bottom:this.arrNPC[i].y+92};
			for(var j=0; j<target.length; j++){
				var skillBox = {left:target[j].x, top:target[j].y, right:target[j].x+46, bottom:target[j].y+27};
				if( (collisionBox.left<skillBox.right) && (collisionBox.bottom>skillBox.top) && (collisionBox.right > skillBox.left) && (collisionBox.top < skillBox.bottom)){
					this.arrNPC[i].HP-=target[j].power;
					
					console.log(i+"번 적 "+j+"번 스킬에 맞음");
					
					pgPlayer.Explosion(target[j].type, this.arrNPC[i].x, this.arrNPC[i].y, target[j].power);
					if( target[j].knockback && (this.arrNPC[i].isKnockback==false) ){
						this.arrNPC[i].x +=target[j].speed*5;
						this.Knockback(target[j].type, this.arrNPC[i].x-target[j].speed*7, this.arrNPC[i].y+30);
						this.arrNPC[i].isKnockback = true;
					}
					target.splice(j, 1);
					game.score += 50;
					game.Message("score", this.arrNPC[i].x, this.arrNPC[i].y+20);
					soundSystem.PlaySound("sound/flame.mp3");
					if(this.arrNPC[i].HP<=0){
						game.score += 50;
						game.Message("score", this.arrNPC[i].x, this.arrNPC[i].y-20);
						game.kill ++;
						exp += this.arrNPC[i].exp;
						game.Message("exp", this.arrNPC[i].x, this.arrNPC[i].y);
						this.arrNPC[i].dropFrame++;
					}
				}
			}
		} 
	}
};

PGNPC.prototype.CheckSplash = function(){
	var target = pgPlayer.arrExplo;
	for(var i=0; i<this.arrNPC.length; i++){
		if( (this.arrNPC[i].type == "spadeRight") && (this.arrNPC[i].HP>0) && (this.arrNPC[i].x>game.BG03x+350 ) && (this.arrNPC[i].x<game.BG03x+2785-350 ) ){
			var collisionBox = {left:this.arrNPC[i].x+10, top:this.arrNPC[i].y, right:this.arrNPC[i].x+54, bottom:this.arrNPC[i].y+92};
			for(var j=0; j<target.length; j++){
				if( (collisionBox.left<target[j].collisionBox.right) && (collisionBox.bottom>target[j].collisionBox.top) && (collisionBox.right > target[j].collisionBox.left) && (collisionBox.top < target[j].collisionBox.bottom) && (target[j].splash) ){
					this.arrNPC[i].HP-=target[j].power;
					if(this.arrNPC[i].HP<=0){
						game.score += 50;
						game.Message("score", this.arrNPC[i].x, this.arrNPC[i].y-20);
						game.kill ++;
						exp += this.arrNPC[i].exp;
						game.Message("exp", this.arrNPC[i].x, this.arrNPC[i].y);
						this.arrNPC[i].dropFrame++;
					}
				}
			}
		}
		if( (this.arrNPC[i].type=="spadeLeft") && (this.arrNPC[i].HP>0) && (this.arrNPC[i].x>game.BG03x+300 ) && (this.arrNPC[i].x<game.BG03x+2785-300 ) ){
			var collisionBox = {left:this.arrNPC[i].x+10, top:this.arrNPC[i].y, right:this.arrNPC[i].x+54, bottom:this.arrNPC[i].y+92};
			for(var j=0; j<target.length; j++){
				if( (collisionBox.left<target[j].collisionBox.right) && (collisionBox.bottom>target[j].collisionBox.top) && (collisionBox.right > target[j].collisionBox.left) && (collisionBox.top < target[j].collisionBox.bottom) && (target[j].splash)){
					this.arrNPC[i].HP-=target[j].power;
					if(this.arrNPC[i].HP<=0){
						game.score += 50;
						game.Message("score", this.arrNPC[i].x, this.arrNPC[i].y-20);
						game.kill ++;
						exp += this.arrNPC[i].exp;
						game.Message("exp", this.arrNPC[i].x, this.arrNPC[i].y);
						this.arrNPC[i].dropFrame++;
					}
				}
			}
		} 
	}
};