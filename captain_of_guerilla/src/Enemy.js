var Enemy=cc.Sprite.extend({
	_frame:0,
	_face:0,//0:left 1:right
	_animation:g_Left1,
	ctor:function(){
		this._super();
		this.setPosition(cc.p(30*32,11*32));
		this.changePic(s_enemy_left_1);
		
	},
	changePic:function(pic){
		this.initWithFile(pic);
		this.setAnchorPoint(cc.p(0,0));
	},
	//RUNNING!
	update:function(){
		var pos=this.getPosition();
		
		//change position
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
	isKilled:function(blade){
		var pos=cc.pAdd(this.getPosition(),cc.p(32,32));
		var bladePos=null;
		if(blade._face==0){
			bladePos=cc.pAdd(blade.getPosition(),cc.p(-24,0));
		}else{
			bladePos=cc.pAdd(blade.getPosition(),cc.p(24,0));
		}
		if(this.avg(pos.x-bladePos.x)<=40){
			if(this.avg(pos.y-bladePos.y)<=56){
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