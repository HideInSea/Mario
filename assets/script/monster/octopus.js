// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var Actor=require("actor");

var SWIM_DIR={
    SWIM_DOWN:0,
    SWIM_LEFT:1,
    SWIM_RIGHT:2,
    SWIM_UP:3
}

cc.Class({
    extends:Actor,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(){
        this.isAllowSwim=true;
        this.animation=this.node.getComponent(cc.Animation);
        this.isDie=false;
    },
    swimLeft(){
        let moveLeft=cc.moveBy(0.3,cc.v2(-80,80));
        let moveDown=cc.moveBy(1,cc.v2(0,-80));
        this.node.runAction(cc.sequence(moveLeft,cc.callFunc(function(){
            this.playSwimAni();
        },this),moveDown,cc.callFunc(()=>{
            this.isAllowSwim=true;
        })));
    },
    swimRight(){
        let moveRight=cc.moveBy(0.3,cc.v2(80,80));
        let moveDown=cc.moveBy(1,cc.v2(0,-80));
        this.node.runAction(cc.sequence(moveRight,cc.callFunc(function(){
            this.playSwimAni();
        },this),moveDown,cc.callFunc(()=>{
            this.isAllowSwim=true;
        })));
    },
    swimDown(){
        let moveDown=cc.moveBy(1,cc.v2(0,-80));
        this.playFloatAni();
        this.node.runAction(cc.sequence(moveDown,cc.callFunc(()=>{
            this.isAllowSwim=true;
        })));
    },
    swimUp(){
        let moveUp=cc.moveBy(1,cc.v2(0,80));
        this.playFloatAni();
        this.node.runAction(cc.sequence(moveUp,cc.callFunc(()=>{
            this.isAllowSwim=true;
        })));
    },
    getSwimDir(){
        let dir=0;
        //如果章鱼离人很远朝着人的方向移动
        if(this.node.x>gm.currPlayer.x+80){
            dir=SWIM_DIR.SWIM_LEFT;
        }else if(this.node.x<gm.currPlayer.x-80){
            dir=SWIM_DIR.SWIM_RIGHT;
        }else if(this.node.y>40*8){//碰到水面
            dir=Math.floor(Math.random()*3);
        }else if(this.node.y<40*4){
            dir=Math.floor(Math.random()*3)+1;
        }else{
            dir=Math.floor(Math.random()*4);
        }
        return dir;
    },
    getSize(){
        let size=this.node.getContentSize();
        return cc.rect(this.node.x,this.node.y,size.width,size.height);
    },
    update (dt) {
        if(this.isPause)return;

        this.move(dt);

        if(this.isAllowSwim&&!this.isDie){
            let dir=this.getSwimDir();
            switch(dir){
                case  SWIM_DIR.SWIM_DOWN:
                    this.swimDown();
                break;
                case  SWIM_DIR.SWIM_UP:
                    this.swimUp();    
                break;
                case  SWIM_DIR.SWIM_LEFT:
                    this.swimLeft();
                break;
                case  SWIM_DIR.SWIM_RIGHT:
                    this.swimRight();
                break;
            }
            this.isAllowSwim=false;
        }

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    playSwimAni(){
        this.animation.play("swim");
    },
    playFloatAni(){
        this.animation.play("float");
    },
    die(){
        this.animation.stop();
        this.isDie=true;
        this.node.scaleY=-1;
        this.node.y+=40;
        this.vCurrSpeed=300;
        this.vCurrAcceleration=-1400;
        this.hCurrSpeed=0;
        this.hCurrAcceleration=0;
    },
    pause(){
        this.node.pauseAllActions();
        this.animation.pause();
        this.isPuase=true;
    },
    resume(){
        this.node.resumeAllActions();
        this.animation.resume();
        this.isPuase=false;
    },
    interactive(actor){
        if(this.isDie||actor.isDie)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
                //闪烁状态碰到怪物
                if(actor.isFlashing){
                    this.die();
                }            //无敌状态碰到怪物
                else if(actor.isInvincible){

                }
                //普通状态碰到蘑菇
                else{
                    if(actor.getFormState()!==FORM_STATE.SMALL){
                        actor.fsm.switchStateWithStack("to_small");
                    }else{
                        actor.fsm.switchState("die");
                    }
                }
            }
        },
    onCollsiWithPBullet(bullet){
        bullet.die();
        this.die();
    }
});
