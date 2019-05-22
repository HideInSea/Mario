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
        this.target.state=ENUM.HELMET_STATE.WALK;
        this.target.hCurrSpeed=this.target.getHSpeed();
        this.target.vCurrAcceleration=0;
        this.target.vCurrSpeed=0;
        this.target.isOnLand=true;
        this.playWalkAni();
    },
    playWalkAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.color){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("red_walk");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("blue_walk");
            break;
            case ENUM.MON_COLOR.GRAY:
            this.target.animation.play("gray_walk");
            break;
        }
    }
}); 


var Slide=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.HELMET_STATE.SLIDE;
        this.target.hCurrSpeed=this.target.getHSpeed();
        this.playSlideAni();
    },
    playSlideAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.color){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("red_sleep");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("blue_sleep");
            break;
            case ENUM.MON_COLOR.GRAY:
            this.target.animation.play("gray_sleep");
            break;
        }
    }
});



var TopTurn=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.HELMET_STATE.TOP_TURN;
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
        switch(this.target.color){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("red_sleep");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("blue_sleep");
            break;
            case ENUM.MON_COLOR.GRAY:
            this.target.animation.play("gray_sleep");
            break;
        }
    }
});

var Sleep=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.HELMET_STATE.SLEEP;
        this.playSleepAni();
        this.target.vCurrSpeed=0;
        this.target.vCurrAcceleration=0;
        this.target.hCurrSpeed=0;
        this.target.hCurrAcceleration=0;

        this.id=setTimeout(function(){
            this._fsm.switchState("walk");
        }.bind(this),3000);
    },
    playSleepAni(){
        
        switch(this.target.color){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("red_sleep");
            break;
            case ENUM.MON_COLOR.BLUE:
            this.target.animation.play("blue_sleep");
            break;
            case ENUM.MON_COLOR.GRAY:
            this.target.animation.play("gray_sleep");
            break;
        }
    },
    onExit(){
        clearTimeout(this.id);
    }
});


module.exports={Sleep,TopTurn,Slide,Walk};