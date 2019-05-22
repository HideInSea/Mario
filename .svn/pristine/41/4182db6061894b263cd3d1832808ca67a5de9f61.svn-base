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

var Walk=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.MUSHROOM_STATE.WALK;
        this.target.hCurrSpeed=-this.target.hDefSpe;
        this.playWalkAni();
    },
    playWalkAni(){
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
                this.target.animation.play("walk_red");
            break;
            case ENUM.MON_COLOR.BLUE:
                this.target.animation.play("walk_blue");
            break;
            case ENUM.MON_COLOR.GRAY:
                this.target.animation.play("walk_gray");
            break;
        }
    }
});


//踩扁
var Flat=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.MUSHROOM_STATE.FLAT;
        this.playFlatAni();
        this.target.isDie=true;
        this.target.isPause=true;
        //2秒后移除
        setTimeout(()=>{
            this.target.node.removeFromParent();
        },1000);
    },
    playFlatAni(){
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
                this.target.animation.play("die_red");
            break;
            case ENUM.MON_COLOR.BLUE:
                this.target.animation.play("die_blue");
            break;
            case ENUM.MON_COLOR.GRAY:
                this.target.animation.play("die_gray");
            break;
        }
    }
});


//被顶翻
var TopTurn=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.MUSHROOM_STATE.TOP_TURN;
        this.playTopTurnAni();
        this.target.node.scaleY=-1;
        this.target.node.y+=40;
        this.target.enableCollsi=false;
        this.target.isDie=true;
        this.target.vCurrSpeed=300;
        this.target.vCurrAcceleration=-1400;
        this.target.hCurrSpeed=0;
        this.target.hCurrAcceleration=0;
    },
    playTopTurnAni(){
        switch(this.target.type){
            case ENUM.MON_COLOR.RED:
                this.target.animation.play("topturn_red");
            break;
            case ENUM.MON_COLOR.BLUE:
                this.target.animation.play("topturn_blue");
            break;
            case ENUM.MON_COLOR.GRAY:
                this.target.animation.play("topturn_gray");
            break;
        }
    }
});

module.exports={Walk,Flat,TopTurn}