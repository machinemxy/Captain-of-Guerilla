/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var MyLayer = cc.Layer.extend({
	_isRunning:false,
	_btnStart:null,
	_bg:null,
	_hero:null,
	_blade:null,
	_enemies:[],
	_bodies:[],
    init:function () {
        this._super();
        var size = cc.Director.getInstance().getWinSize();
		
		//init background
		this._bg=new Background();
		this.addChild(this._bg,g_Background);
		
        
		
		//init start button
		var start1 = cc.Sprite.create(s_start_button);
        var start2 = cc.Sprite.create(s_start_button);
		this._btnStart=cc.MenuItemSprite.create(start1, start2, this.startGame, this);
		var infoMenu = cc.Menu.create(this._btnStart);
		this.addChild(infoMenu, g_Menu);
		
		//enable key press
		this.setKeyboardEnabled(true);
		
		//test use
		this.setTouchEnabled(true);
		
		//start running
		this.schedule(this.update,0);
    },
	//test use
	onTouchesEnded:function (pTouch,pEvent){
        //alert(this._bg.isBlock(pTouch[0].getLocation()));
    },
	onKeyDown:function(e){
		if(this._hero._alive){
			this._hero.keyDown(e);
		}
    },
	onKeyUp:function(e){
		if(this._hero._alive){
			this._hero.keyUp(e);
		}
	},
	//start game
	startGame:function(){
		//init enemies
		if(this._enemies.length!=0){
			for(x in this._enemies){
				this.removeChild(this._enemies[x]);
			}
			this._enemies=[];
		}
		
		//init bodies
		if(this._bodies.length!=0){
			for(x in this._bodies){
				this.removeChild(this._bodies[x]);
			}
			this._bodies=[];
		}
	
		//init hero
		if(this._hero!=null){
			this.removeChild(this._hero);
		}
		this._hero=new Hero(this._bg);
		this.addChild(this._hero,g_Hero);
		this._hero.setPosition(cc.p(2*32,11*32));

		//init blade
		this.addChild(this._hero._blade,g_Blade);
		this._hero._blade.setPosition(cc.p(3*32,12*32));
		
		//remove button
		this._isRunning=true;
		this._btnStart.setVisible(false);
	},
	//RUNNING!
	update:function(dt){
		//only run when _isRunning is true
		if(!this._isRunning){
			return;
		}
		
		//generate new enemy
		if(this._enemies.length<10){
			//enemy on the ground
			if(Math.random()<0.01){
				var enemy=new Enemy();
				this.addChild(enemy,g_Enemy);
				this._enemies.push(enemy);
			}
		}

		//enemies' movement
		for(x in this._enemies){
			this._enemies[x].update();
		}
	
		//hero's movement
		if (this._hero._alive){
			this._hero.update();
		}else{
			this._hero.fall();
		}
		
		//check are enemies killed
		if(this._hero._blade._angle==84){
			for(x in this._enemies){
				if(this._enemies[x].isKilled(this._hero._blade)){
					//add body
					var face=this._enemies[x]._face;
					var body1=new Body(face,0);
					this.addChild(body1,g_Body);
					body1.setPosition(this._enemies[x].getPosition());
					this._bodies.push(body1);
					var body2=new Body(face,1);
					this.addChild(body2,g_Body);
					this._bodies.push(body2);
					body2.setPosition(cc.pAdd(this._enemies[x].getPosition(),cc.p(32,0)));

					//remove enemy
					this.removeChild(this._enemies[x]);
					this._enemies.splice(x,1);
				}
			}
		}
		
		//bodies' falling
		for(x in this._bodies){
			var body=this._bodies[x];
			body.update();
			//if falled on the ground, remove the body
			if(body._angle>90){
				this.removeChild(body);
				this._bodies.splice(x,1);
			}
		}
		
		//check is hero killed
		if(this._hero._alive&&this._hero.isKilled(this._enemies)){
			this._hero._alive=false;
			//remove blade
			this.removeChild(this._hero._blade);
			//reset anchor point
			if(this._hero._face==0){
				this._hero.setAnchorPoint(cc.p(1,0));
			}
		}
		
		//check is gameover
		if(this._hero._fallingAngle>=90){
			this._isRunning=false;
			this._btnStart.setVisible(true);
		}
	}
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
