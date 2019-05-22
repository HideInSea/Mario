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
var FSM=require("FSM");
var {Fly,Swim,Die}=require("fishState");
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
    init(){
        this.actorType=arguments[0];
        this.color=arguments[1];
        this.state=arguments[2];
        this.moveDir=arguments[3];
        this.dir=DIR.DIR_LEFT;
        this.animation=this.node.getComponent(cc.Animation);
        this.hDefSpe=50;
        this.vDefSpe=-380;
        this.defFlySpe=320;
        this.vDefAcce=-500;
        this.vOrignSpe=200;

        this.fsm=new FSM();
        this.fsm.addState(new Fly(this,"fly"));
        this.fsm.addState(new Die(this,"die"));
        this.fsm.addState(new Swim(this,"swim"));

        switch(this.state){
            case ENUM.FISH_STATE.FLY:
            this.fsm.setDefaultState("fly");
            break;
            case ENUM.FISH_STATE.SWIM:
            this.fsm.setDefaultState("swim");
            break;
        }
        
    },
    turnRight(){
        this.node.scaleX=-1;
        this.dir=DIR.DIR_RIGHT;
    },
    turnLeft(){
        this.node.scaleX=1;
        this.dir=DIR.DIR_LEFT;
    },
    interactive(actor){
        if(this.isDie||actor.isDie)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            if(this.state===ENUM.FISH_STATE.FLY){
                //闪烁状态碰到怪物
                if(actor.isFlashing){
                    this.die();
                }            //无敌状态碰到怪物
                else if(actor.isInvincible){
                    //踩到怪物
                    if(sizeOne.y>=sizeTwo.y+sizeTwo.height/2&&!actor.isUpOrDown()){
                        actor.littleJump();
                        actor.node.y=sizeTwo.y+sizeTwo.height+1;
                        this.die();
                    }
                }
                //普通状态碰到蘑菇
                else{
                    //踩到蘑菇
                    if(sizeOne.y>=sizeTwo.y+sizeTwo.height/2&&!actor.isUpOrDown()){
                        actor.littleJump();
                        actor.node.y=sizeTwo.y+sizeTwo.height+1;
                        this.die();
                    }else if(actor.getFormState()!==FORM_STATE.SMALL){
                        actor.fsm.switchStateWithStack("to_small");
                    }else{
                        actor.fsm.switchState("die");
                    }
                }
            }else if(this.state===ENUM.FISH_STATE.SWIM){
                
                //闪烁状态碰到怪物
                if(actor.isFlashing){
                    this.die();
                }
                else if(actor.isInvincible){

                }
                else {
                    if(actor.getFormState()!==FORM_STATE.SMALL){
                        actor.fsm.switchStateWithStack("to_small");
                    }else{
                        actor.fsm.switchState("die");
                    }
                }
            }
        }
    },
    getSize(){
        let size=this.node.getContentSize();
        let height=size.height-4;
        let width=size.width-4;
        return cc.rect(this.node.x,this.node.y,width,height);
    },
    die(){
        this.fsm.switchState("die");
        EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
    },
    pause(){
        this.isPause=true;
        this.animation.pause();
        this.node.pauseAllActions();
    },
    resume(){
        this.isPause=false;
        this.animation.resume();
        this.node.resumeAllActions();
    },
    onCollsiWithPBullet(bullet){
        bullet.die();
        this.die();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    update (dt) {
        if(this.isPause)return;

        this.move(dt);

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    }
});
