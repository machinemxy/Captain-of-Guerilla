var Enemy=cc.Sprite.extend({
	_mode:0,
	_frame:0,
	_face:0,//0:left 1:right
	_animation:g_Left1,
	_aimTime:0,
	ctor:function(mode){
		this._super();
		this._mode=mode;
		if(this._mode==1){
			this.setPosition(cc.p(31*32,11*32));
			this.changePic(s_enemy_left_1);
		}else if(this._mode==2){
			this.setPosition(cc.p(Math.random()*768,768));
			this.changePic(s_enemy_left_fall);
		}else if(this._mode==3){
			if(Math.random()<0.5){
				this.setPosition(31*32,15*32);
			}else{
				this.setPosition(31*32,19*32);
			}
			this.changePic(s_enemy_left_1);
		}
	},
	changePic:function(pic){
		this.initWithFile(pic);
		this.setAnchorPoint(cc.p(0,0));
	},
	//RUNNING!
	action1:function(){
		var pos=this.getPosition();
		
		//move
		if(this._face==0){
			if(pos.x>0){
				this.setPosition(pos.x-g_EnemySpeed,pos.y);
			}else{
				this._face=1;
			}
		}else{
			if(pos.x<1024-64){
				this.setPosition(pos.x+g_EnemySpeed,pos.y);
			}else{
				this._face=0;
			}
		}
	
		//change pic
		this._frame++;
		if(this._frame>=30){
			this._frame-=30;
		}
		if(this._face==0){
			if(this._frame<15){
				if(this._animation!=g_Left1){
					this.changePic(s_enemy_left_1);
					this._animation=g_Left1;
				}
			}else{
				if(this._animation!=g_Left2){
					this.changePic(s_enemy_left_2);
					this._animation=g_Left2;
				}
			}
		}else{
			if(this._frame<15){
				if(this._animation!=g_Right1){
					this.changePic(s_enemy_right_1);
					this._animation=g_Right1;
				}
			}else{
				if(this._animation!=g_Right2){
					this.changePic(s_enemy_right_2);
					this._animation=g_Right2;
				}
			}
		}
	},
	action2:function(hero,bg){
		var pos=this.getPosition();
		var heroHeartPos=cc.pAdd(hero.getPosition(),cc.p(16,32));
	
		//change face
		if(heroHeartPos.x>=(pos.x+32)){
			if(this._face!=1){
				this._face=1;
				this.changePic(s_enemy_right_fall);
			}
		}else{
			if(this._face!=0){
				this._face=0;
				this.changePic(s_enemy_left_fall);
			}
		}
	
		//dropping
		if(bg.moveable(pos,1,1,g_GoDown)){
			this.setPosition(pos.x,pos.y-g_EnemySpeed/2);
		}else{
			this._mode=1;
		}
	},
	action3:function(){
		var pos=this.getPosition();
	
		//handle frame
		this._frame++;
		if(this._frame>=30){
			this._frame-=30;
		}
	
		if((pos.x==25*32)&&this._aimTime<60){
			this._aimTime++;
		}else{
			//change pic
			if(this._frame<15){
				if(this._animation!=g_Left1){
					this.changePic(s_enemy_left_1);
					this._animation=g_Left1;
				}
			}else{
				if(this._animation!=g_Left2){
					this.changePic(s_enemy_left_2);
					this._animation=g_Left2;
				}
			}
			
			//move
			if(this._aimTime==0){
				//forward
				this.setPosition(pos.x-g_EnemySpeed/2,pos.y);
			}else{
				//back
				this.setPosition(pos.x+g_EnemySpeed/2,pos.y);
			}
		}
	},
	fire:function(hero,bullets){
		var pos=this.getPosition();
		var heroHeartPos=cc.pAdd(hero.getPosition(),cc.p(16,32));
		var gunPos=pos;
		if(this._face==0){
			gunPos=cc.pAdd(pos,cc.p(16,48));
		}else{
			gunPos=cc.pAdd(pos,cc.p(48,48));
		}
		var shootTrail=cc.pSub(heroHeartPos,gunPos);
		var speedLength=g_BulletSpeed/cc.pLength(shootTrail);
		var speed=cc.pMult(shootTrail,speedLength);
		var bullet=new Bullet(gunPos,speed);
		bullets.push(bullet);
	},
	isKilled:function(blade){
		var pos=cc.pAdd(this.getPosition(),cc.p(32,32));
		var bladePos=null;
		if(blade._face==0){
			bladePos=cc.pAdd(blade.getPosition(),cc.p(-24,0));
		}else{
			bladePos=cc.pAdd(blade.getPosition(),cc.p(24,0));
		}
		if(this.avg(pos.x-bladePos.x)<=56){
			if(this.avg(pos.y-bladePos.y)<=72){
				return true;
			}
		}
		return false;
	},
	avg:function(number){
		var returnNumber=number;
		if(number<0){
			returnNumber=0-number;
		}
		return returnNumber;
	}
});