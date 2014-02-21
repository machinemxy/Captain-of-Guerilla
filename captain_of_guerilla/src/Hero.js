var Hero=cc.Sprite.extend({
	_bg:null,//the background of the game. In order to check collision
	_blade:null,
	_frame:0,
	_face:1,//0:left 1:right
	_left:false,//pressing left
	_right:false,//pressing right
	_jump:false,//pressing jump
	_attack:false,//pressing attack
	_animation:g_Right1,
	_jumpPower:0,
	_alive:true,
	_fallingAngle:0,
	ctor:function(bg){
		this._super();
		this.changePic(s_hero_right_1);
		this._bg=bg;
		this._blade=new Blade(this);
	},
	keyDown:function(e){
		//move
		if(e==cc.KEY.left||e==cc.KEY.a){
			if(!this._left){
				this._left=true;
			}

			//change face direction
			if(this._face==1){
				this._face=0;
			}
		}else if(e == cc.KEY.right||e==cc.KEY.d){
			if(!this._right){
				this._right=true;
			}

			//change face direction
			if(this._face==0){
				this._face=1;
			}
		}
		
		//jump
		if(e==cc.KEY.k){
			if(!this._jump){
				this._jump=true;
			}
		}

		//attack
		if(e==cc.KEY.j){
			if(!this._attack){
				this._attack=true;
			}
		}
	},
	keyUp:function(e){
		//stop moving
		if(e==cc.KEY.left||e==cc.KEY.a){
			//stop move to left
			if(this._left){
				this._left=false;
			}
		}else if(e == cc.KEY.right||e==cc.KEY.d){
			//stop move to right
			if(this._right){
				this._right=false;
			}
		}
		
		//stop jumping
		if(e==cc.KEY.k){
			if(this._jump){
				this._jump=false;
			}
		}

		//stop attacking
		if(e==cc.KEY.j){
			if(this._attack){
				this._attack=false;
			}
		}
	},
	isKilled:function(enemies,bullets){
		var pos=this.getPosition();
		var heroRect=cc.rect(pos.x,pos.y,32,64);
		for(x in enemies){
			var hitPoint=null;
			if(enemies[x]._face==0){
				hitPoint=cc.pAdd(enemies[x].getPosition(),cc.p(16,48));
			}else{
				hitPoint=cc.pAdd(enemies[x].getPosition(),cc.p(48,48));
			}
			if(cc.rectContainsPoint(heroRect,hitPoint)){
				return true;
			}
		}
		for(x in bullets){
			if(cc.rectContainsPoint(heroRect,bullets[x].getPosition())){
				return true;
			}
		}
		return false;
	},
	fall:function(){
		var pos=this.getPosition();
		var size=this.getContentSize();
		
		//check is on ground
		var onGround=!(this._bg.moveable(pos,size.width,size.height,g_GoDown));
	
		//handling dropping
		if(!onGround){
			this.setPosition(pos.x,pos.y-g_HeroSpeed);
		}
			
		//handling falling
		this._fallingAngle+=3;
		var fallingAngle=this._fallingAngle;
		if(this._face==1){
			fallingAngle=-fallingAngle;
		}
		this.setRotation(fallingAngle);
	},
	//RUNNING!
	update:function(){
		var pos=this.getPosition();
		var size=this.getContentSize();
		
		//check is on ground
		var onGround=!(this._bg.moveable(pos,size.width,size.height,g_GoDown));

		//handle up and down movement
		if(this._jumpPower!=0){
			//when jumping, up if possible
			if(this._bg.moveable(pos,size.width,size.height,g_GoUp)){
				this.setPosition(pos.x,pos.y+g_HeroSpeed);
			}
			this._jumpPower-=1;
		}else{
			//when not jumping
			if(!onGround){
				//if not on ground, drop
				this.setPosition(pos.x,pos.y-g_HeroSpeed);
			}else{
				//if on ground, jump if the button is pressed
				if (this._jump){
					this._jumpPower=20;
				}
			}
		}
	
		//handle left and right movement
		if(this._left){
			if(this._bg.moveable(pos,size.width,size.height,g_GoLeft)){
				this.setPosition(pos.x-g_HeroSpeed,pos.y);
			}
		}else if(this._right){
			if(this._bg.moveable(pos,size.width,size.height,g_GoRight)){
				this.setPosition(pos.x+g_HeroSpeed,pos.y);
			}
		}
		//change pic
		this._frame++;
		if(this._frame>=30){
			this._frame-=30;
		}
		if(this._left){
			if(!onGround){
				if(this._animation!=g_Left1){
					this.changePic(s_hero_left_1);
					this._animation=g_Left1;
				}
			}else{
				if(this._frame<15){
					if(this._animation!=g_Left1){
						this.changePic(s_hero_left_1);
						this._animation=g_Left1;
					}
				}else{
					if(this._animation!=g_Left2){
						this.changePic(s_hero_left_2);
						this._animation=g_Left2;
					}
				}
			}
		}else if(this._right){
			if(!onGround){
				if(this._animation!=g_Right1){
					this.changePic(s_hero_right_1);
					this._animation=g_Right1;
				}
			}else{
				if(this._frame<15){
					if(this._animation!=g_Right1){
						this.changePic(s_hero_right_1);
						this._animation=g_Right1;
					}
				}else{
					if(this._animation!=g_Right2){
						this.changePic(s_hero_right_2);
						this._animation=g_Right2;
					}
				}
			}
		}

		//update blade positing
		this._blade.update(this._attack);
	},
	//a quick function to change picture of the sprite
	changePic:function(pic){
		this.initWithFile(pic);
		this.setAnchorPoint(cc.p(0,0));
	}
});