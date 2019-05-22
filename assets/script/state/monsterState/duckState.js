// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var State=require("state");
//walk
var Walk=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.WALK;
        this.target.hCurrSpeed=this.target.getHSpeed();
        this.target.vCurrAcceleration=0;
        this.target.vCurrSpeed=0;
        this.target.isOnLand=true;
        this.playWalkAni();
    },
    playWalkAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("walk_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("walk_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("walk_green");
            break;
        }
    }
});


var Jump=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.JUMP;
        this.target.hCurrSpeed=this.target.getHSpeed();
        this.target.vCurrAcceleration=-1240;
        this.target.vCurrSpeed=550;
        this.target.isOnLand=false;
        this.playJumpAni();
    },
    playJumpAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("fly_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("fly_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("fly_green");
            break;
        }
    }
});


var Fly=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.FLY;
        this.target.hCurrSpeed=this.target.getHSpeed();
        this.target.isOnLand=false;
        this.playFlyAni();
        let moveUp=cc.moveBy(0.88,cc.v2(0,40)); 
        let moveDown=moveUp.reverse();
        this.target.node.runAction(cc.repeatForever(cc.sequence(moveUp,moveDown)));
    },
    playFlyAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("fly_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("fly_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("fly_green");
            break;
        }
    }
});


var UpDown=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.UP_DOWN;
        this.target.isOnLand=false;
        this.playUpDownAni();
        let moveUp=cc.moveBy(4,cc.v2(0,320)).easing(cc.easeCubicActionInOut());
        let moveDown=cc.moveBy(4,cc.v2(0,-320)).easing(cc.easeCubicActionInOut());
        this.target.node.runAction(cc.repeatForever(cc.sequence(moveUp,moveDown)));
    },
    playUpDownAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("fly_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("fly_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("fly_green");
            break;
        }
    }
});


var Slide=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.SLIDE;
        this.target.hCurrSpeed=this.target.getHSpeed();
        this.playSlideAni();
    },
    playSlideAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("sleep_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("sleep_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("sleep_green");
            break;
        }
    }
});


var Flash=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.FLASH;
        this.playFlashAni();

        this.id=setTimeout(function(){
            this._fsm.switchState("walk");
        }.bind(this),2000);
    },
    playFlashAni(){
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("flash_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("flash_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("flash_green");
            break;
        }
    },
    onExit(){
        clearTimeout(this.id);
    }
});


var TopTurn=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.TOP_TURN;
        this.playTopTurnAni();
        this.target.isOnLand=false;
        this.target.isDie=true;
        this.target.node.scaleY=-1;
        this.target.node.y+=40;
        this.target.vCurrSpeed=300;
        this.target.vCurrAcceleration=-1400;
        this.target.hCurrSpeed=0;
        this.target.hCurrAcceleration=0;
        this.target.enableCollsi=false;
    },
    playTopTurnAni(){
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
                this.target.animation.play("die_red");
            break;
            case ENUM.MON_COLOR.BLUE:
                this.target.animation.play("die_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
                this.target.animation.play("die_green");
            break;
        }
    }
});

var Sleep=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.DUCK_STATE.SLEEP;
        this.playSleepAni();
        this.target.vCurrSpeed=0;
        this.target.vCurrAcceleration=0;
        this.target.hCurrSpeed=0;
        this.target.hCurrAcceleration=0;

        this.id=setTimeout(function(){
            this._fsm.switchState("flash");
        }.bind(this),3000);
    },
    playSleepAni(){
        
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("sleep_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("sleep_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("sleep_green");
            break;
        }
    },
    onExit(){
        clearTimeout(this.id);
    }
});


//下落
var Fall=cc.Class({
    extends:State,
    onEnter(){
        this.target.node.stopAllActions();
        this.target.state=ENUM.DUCK_STATE.FALL;
        this.target.vCurrSpeed=0;
        this.target.vCurrAcceleration=-1200;
        this.target.isOnLand=false;
        this.playFallAni();
    },
    playFallAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("walk_red");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("walk_blue");
            break;
            case ENUM.MON_COLOR.GREEN:
            this.target.animation.play("walk_green");
            break;
        }
    }
});
module.exports={Sleep,TopTurn,Flash,Slide,UpDown,Fly,Jump,Walk,Fall};