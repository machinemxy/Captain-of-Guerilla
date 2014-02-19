var Background=cc.Sprite.extend({
	_blocks:[],
	ctor:function(){
		this._super();
		this.initWithFile(s_lugouBridge);
		this.setAnchorPoint(cc.p(0,0));
		this.setPosition(cc.p(0,0));
		//init blocks
		this._blocks.push(cc.rect(20*32,0,12*32,11*32-1));
		this._blocks.push(cc.rect(25*32,14*32,7*32,32-1));
		this._blocks.push(cc.rect(25*32,18*32,7*32,32-1));
		this._blocks.push(cc.rect(19*32,7*32,32,32-1));
		this._blocks.push(cc.rect(18*32,8*32,2*32,32-1));
		this._blocks.push(cc.rect(16*32,9*32,4*32,32-1));
		this._blocks.push(cc.rect(0,10*32,32*32,32-1));
	},
	isBlock:function(touchPoint){
		//if out of screen, return true
		if(touchPoint.x<0||touchPoint.x>=1024||touchPoint.y<0||touchPoint.y>=(768)){
			return true;
		}
		
		var returnValue=false;
		for(var i=0;i<this._blocks.length;i++){
			if(cc.rectContainsPoint(this._blocks[i],touchPoint)){
				returnValue=true;
				break;
			}
		}
		return returnValue;
	},
	moveable:function(position,width,height,direction){
		//point left down
		var pld=position;
		//point right down
		var prd=cc.pAdd(position,cc.p((width-1),0));
		//point left up
		var plu=cc.pAdd(position,cc.p(0,(height-1)));
		//point right up
		var pru=cc.pAdd(position,cc.p((width-1),(height-1)));

		if(direction==g_GoLeft){
			return !(this.isBlock(cc.pAdd(pld,cc.p(-1,0)))||this.isBlock(cc.pAdd(plu,cc.p(-1,0))));
		}else if(direction==g_GoRight){
			return !(this.isBlock(cc.pAdd(prd,cc.p(1,0)))||this.isBlock(cc.pAdd(pru,cc.p(1,0))));
		}else if(direction==g_GoUp){
			return !(this.isBlock(cc.pAdd(plu,cc.p(0,1)))||this.isBlock(cc.pAdd(pru,cc.p(0,1))));
		}else{
			return !(this.isBlock(cc.pAdd(pld,cc.p(0,-1)))||this.isBlock(cc.pAdd(prd,cc.p(0,-1))));
		}
	}
});