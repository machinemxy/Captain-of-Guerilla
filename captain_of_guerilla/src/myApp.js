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
	_bullets:[],
	_score:0,
	_bestScore:0,
	_lblScoreTitle:null,
	_lblScore:null,
	_lblBestTitle:null,
	_lblBest:null,
	_lblTutorial:null,
	_lblTheme:null,
	_lblSubTitle:null,
	_maxEnemy:3,
	_playTime:0,
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
		
		//init score
		this._lblScoreTitle=cc.LabelTTF.create("SCORE:", "Arial", 32);
		this._lblScoreTitle.setAnchorPoint(cc.p(0,1));
		this._lblScoreTitle.setPosition(cc.p(10,768));
		this.addChild(this._lblScoreTitle,g_Label);
		
		this._lblBestTitle=cc.LabelTTF.create("BEST:", "Arial", 32);
		this._lblBestTitle.setAnchorPoint(cc.p(0,1));
		this._lblBestTitle.setPosition(cc.p(10,728));
		this.addChild(this._lblBestTitle,g_Label);
		
		this._lblScore=cc.LabelTTF.create("0", "Arial", 32);
		this._lblScore.setAnchorPoint(cc.p(1,1));
		this._lblScore.setPosition(cc.p(200,768));
		this.addChild(this._lblScore,g_Label);
		
		this._lblBest=cc.LabelTTF.create("0", "Arial", 32);
		this._lblBest.setAnchorPoint(cc.p(1,1));
		this._lblBest.setPosition(cc.p(200,728));
		this.addChild(this._lblBest,g_Label);
		
		//init tutorial label
		this._lblTutorial=cc.LabelTTF.create("A:LEFT D:RIGHT J:ATTACCK K:JUMP","Arial",32);
		this._lblTutorial.setAnchorPoint(0.5,1);
		this._lblTutorial.setPosition(512,300);
		this.addChild(this._lblTutorial,g_Label);
		
		//init theme
		this._lblTheme=cc.LabelTTF.create("CAPTAIN OF GUERILLA","Arial",64);
		this._lblTheme.setAnchorPoint(0.5,1);
		this._lblTheme.setPosition(512,600);
		this.addChild(this._lblTheme,g_Label);
		
		//init sub title
		this._lblSubTitle=cc.LabelTTF.create("Cecil Ma\'s","Arial",32);
		this._lblSubTitle.setAnchorPoint(0,1);
		this._lblSubTitle.setPosition(156,640);
		this.addChild(this._lblSubTitle,g_Label);
		
		//enable key press
		this.setKeyboardEnabled(true);
		
		//test use
		this.setTouchEnabled(true);
		
		//start running
		this.schedule(this.update,0);
    },
	onTouchesBegan:function(pTouch,pEvent){
		if(!this._isRunning){
			return;
		}
		if(!this._hero._alive){
			return;
		}
		for(x in pTouch){
			var pos=pTouch[x].getLocation();
			if(pos.y<=7*32){
				if(pos.x<=7*32){
					this._hero.keyDown(cc.KEY.left);
				}else if(pos.x<=14*32){
					this._hero.keyDown(cc.KEY.right);
				}else if(pos.x>=25*32){
					this._hero.keyDown(cc.KEY.k);
				}else if(pos.x>=18*32){
					this._hero.keyDown(cc.KEY.j);
				}
			}
		}
	},
	onTouchesEnded:function (pTouch,pEvent){
		if(!this._isRunning){
			return;
		}
		if(!this._hero._alive){
			return;
		}
		for(x in pTouch){
			var pos=pTouch[x].getLocation();
			if(pos.y<=7*32){
				if(pos.x<=7*32){
					this._hero.keyUp(cc.KEY.left);
				}else if(pos.x<=14*32){
					this._hero.keyUp(cc.KEY.right);
				}else if(pos.x>=25*32){
					this._hero.keyUp(cc.KEY.k);
				}else if(pos.x>=18*32){
					this._hero.keyUp(cc.KEY.j);
				}
			}
		}
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
		
		//init bullets
		if(this._bullets.length!=0){
			for(x in this._bullets){
				this.removeChild(this._bullets[x]);
			}
			this._bullets=[];
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
		
		//remove tutorial and theme
		this._lblTutorial.setVisible(false);
		this._lblTheme.setVisible(false);
		this._lblSubTitle.setVisible(false);
		
		//init Score
		this._score=0;
		this._lblScore.setString("0");
		
		//init play time and max enemy
		this._playTime=0;
		this._maxEnemy=3;
	},
	//RUNNING!
	update:function(dt){
		//only run when _isRunning is true
		if(!this._isRunning){
			return;
		}
		
		//calculation play time
		if(this._playTime<=12000){
			this._playTime++;
		}
		
		//add the amount of enemy according to the playtime
		if(this._playTime%600==0){
			this._maxEnemy++;
		}
		
		//generate new enemy
		if(this._enemies.length<this._maxEnemy){
			//enemy on the ground
			var rand1=Math.random();
			if(rand1<0.007){
				var enemy=new Enemy(1);
				this.addChild(enemy,g_Enemy);
				this._enemies.push(enemy);
			}else if(rand1<0.014){
				var enemy=new Enemy(2);
				this.addChild(enemy,g_Enemy);
				this._enemies.push(enemy);
			}else if(rand1<0.021){
				var enemy=new Enemy(3);
				this.addChild(enemy,g_Enemy);
				this._enemies.push(enemy);
			}
		}

		//enemies' movement
		for(x in this._enemies){
			if(this._enemies[x]._mode==1){
				this._enemies[x].action1();
			}else if(this._enemies[x]._mode==2){
				this._enemies[x].action2(this._hero,this._bg);
				//fire
				if(this._enemies[x].getPosition().y==22*32){
					this._enemies[x].fire(this._hero,this._bullets);
					this.addChild(this._bullets[this._bullets.length-1],g_Bullet);
				}
			}else{
				this._enemies[x].action3();
				//fire
				if(this._hero.getPosition().x<24*32&&this._enemies[x].getPosition().x==25*32&&this._enemies[x]._aimTime==30){
					this._enemies[x].fire(this._hero,this._bullets);
					this.addChild(this._bullets[this._bullets.length-1],g_Bullet);
				}
				//retreat
				if(this._enemies[x].getPosition().x>31*32){
					this.removeChild(this._enemies[x]);
					this._enemies.splice(x,1);
				}
			}
		}
		
		//bullets' movement
		for(x in this._bullets){
			this._bullets[x].update();
			if(this._bg.isBlock(this._bullets[x].getPosition())){
				this.removeChild(this._bullets[x]);
				this._bullets.splice(x,1);
			}
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
					
					//add score
					this.addScore();
				}
			}
		}
		
		//bodies' falling
		for(x in this._bodies){
			var body=this._bodies[x];
			body.update(this._bg);
		}
		
		//if the bodies on the ground are too many, remove some
		if(this._bodies.length>20){
			this.removeChild(this._bodies[0]);
			this.removeChild(this._bodies[1]);
			this._bodies.splice(0,2);
		}
		
		//check is hero killed
		if(this._hero._alive&&this._hero.isKilled(this._enemies,this._bullets)){
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
			this._lblTutorial.setVisible(true);
			this._lblTheme.setVisible(true);
			this._lblSubTitle.setVisible(true);
		}
	},
	addScore:function(){
		this._score++;
		if(this._score>this._bestScore){
			this._bestScore=this._score;
			this._lblBest.setString(this._bestScore.toString());
		}
		this._lblScore.setString(this._score.toString());
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
