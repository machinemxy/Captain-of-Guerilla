var Bullet=cc.Sprite.extend({
	_speed:0,
	ctor:function(pos,speed){
		this._super();
		this.initWithFile(s_bullet);
		this.setAnchorPoint(cc.p(0.5,0.5));
		this.setPosition(pos);
		this._speed=speed;
	},
	update:function(){
		this.setPosition(cc.pAdd(this.getPosition(),this._speed));
	}
});