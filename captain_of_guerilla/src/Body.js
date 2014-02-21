var Body=cc.Sprite.extend({
	_angle:0,
	_face:0,//0:left;1:right
	_fallDirection:0,//0:left;1:right
	ctor:function(face,fallDirection){
		this._super();
		this._face=face;
		this._fallDirection=fallDirection;
		if(this._face==0){
			if(this._fallDirection==0){
				this.initWithFile(s_body_left_1);
			}else{
				this.initWithFile(s_body_left_2);
			}
		}else{
			if(this._fallDirection==0){
				this.initWithFile(s_body_right_1);
			}else{
				this.initWithFile(s_body_right_2);
			}
		}
		this.setAnchorPoint(cc.p(0.5,0));
	},
	update:function(bg){
		//falling
		if(this._angle<90){
			this._angle+=3;
			var angle=this._angle;
			if(this._fallDirection==0){
				angle=-angle;
			}
			this.setRotation(angle);
		}
		
		//dropping
		var pos=this.getPosition();
		var lowerPos=cc.pAdd(pos,cc.p(0,-2));
		if(bg.moveable(pos,1,1,g_GoDown)){
			if(bg.moveable(lowerPos,1,1,g_GoDown)){
				this.setPosition(pos.x,pos.y-g_EnemySpeed);
			}else{
				this.setPosition(pos.x,pos.y-g_EnemySpeed/2);
			}
		}
	}
});