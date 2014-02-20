var Blade=cc.Sprite.extend({
	_hero:null,
	_face:1,
	_angle:0,
	ctor:function(hero){
		this._super();
		this._hero=hero;
		this.changePic(s_blade_right);
	},
	update:function(isAttacking){
		//change position
		if(this._hero._face==0){
			this.setPosition(cc.pAdd(this._hero.getPosition(),cc.p(0,32)));
		}else{
			this.setPosition(cc.pAdd(this._hero.getPosition(),cc.p(32,32)));
		}
		
		//change face direction
		if(this._hero._face!=this._face){
			if(this._hero._face==0){
				this._face=0;
				this.changePic(s_blade_left);
			}else{
				this._face=1;
				this.changePic(s_blade_right);
			}
		}

		//change angle
		if(this._angle!=0){
			if(this._angle==180){
				this._angle=0;
			}else{
				this._angle+=12;
			}
		}else{
			if(isAttacking){
				this._angle+=12;
			}
		}
		var angle=this._angle;
		if(this._face==0){
			angle=-angle;
		}
		this.setRotation(angle);
	},
	changePic:function(pic){
		this.initWithFile(pic);
		this.setAnchorPoint(cc.p(0.5,0));
	}
});
