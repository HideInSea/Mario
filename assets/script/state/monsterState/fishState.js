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
//swim
var Swim=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.FISH_STATE.SWIM;
        this.target.hCurrSpeed=-this.target.hDefSpe;
        let moveUp=cc.moveBy(5,cc.v2(0,40));
        let moveDown=moveUp.reverse();
        this.target.node.runAction(cc.repeatForever(cc.sequence(moveUp,moveDown)));

        this.playSwimAni();
    },
    playSwimAni(){
        switch(this.target.color){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("fly_red");
            break;
            case ENUM.MON_COLOR.GRAY:
            this.target.animation.play("fly_gray");
            break;
        }
    }
}); 


var Fly=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.FISH_STATE.FLY;

        this.target.vCurrSpeed=560;
        this.target.vCurrAcceleration=-280;
        
        if(this.target.moveDir===ENUM.FISH_DIR.RIGHT){
            this.target.node.x-=40*16;
            this.target.dir=DIR.DIR_RIGHT;
        }else{
            this.target.dir=DIR.DIR_LEFT;
        }
        this.target.hCurrSpeed=this.getHSpeed();
        this.playFlyAni();
    },
    playFlyAni(){
        
        this.target.dir===DIR.DIR_LEFT?this.target.turnLeft():this.target.turnRight();
        switch(this.target.color){
            case ENUM.MON_COLOR.RED:
            this.target.animation.play("fly_red");
            break;
            case ENUM.MON_COLOR.GRAY:
            this.target.animation.play("fly_gray");
            break;
        }
    },
    getHSpeed(){
        return this.target.moveDir===ENUM.FISH_DIR.LEFT?-320:320;
    }
});



var Die=cc.Class({
    extends:State,
    onEnter(){
        this.target.state=ENUM.TOP_TURN;
        this.target.animation.stop();
        this.target.isDie=true;
        this.target.node.scaleY=-1;
        this.target.node.y+=40;
        this.target.vCurrSpeed=300;
        this.target.vCurrAcceleration=-1400;
        this.target.hCurrSpeed=0;
        this.target.hCurrAcceleration=0;
        this.target.enableCollsi=false;
    }
});

module.exports={Fly,Die,Swim};