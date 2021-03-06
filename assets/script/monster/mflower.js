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
    init(){
        this.orignPos=this.node.position;
        this.actorType=arguments[0];
        this.color=arguments[1];
        this.isMoving=false;
        this.animation=this.node.getComponent(cc.Animation);
        this.animation.play(this.color);
        this.isPlayerAround=false;
        let delay=cc.delayTime(1);
        let moveDown=cc.moveBy(2,cc.v2(0,-80));
        let moveUp=cc.moveBy(2,cc.v2(0,80));
        this.node.runAction(cc.repeatForever(cc.sequence(delay,cc.callFunc(()=>{
            this.isMoving=true;
        }),moveUp,delay.clone(),moveDown,cc.callFunc(()=>{
            this.isMoving=false;
        }),delay.clone())));
    },
    // onLoad () {},
    getSize() {
        let width=34;
        let heigth=34;
        return cc.rect(this.node.x,this.node.y,width,heigth);
    },
    interactive(actor){
        if(actor.isDie)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)&&this.node.y>this.orignPos.y+20){
            //闪烁状态碰到怪物
            if(actor.isFlashing){
                this.die();
            }
            //无敌状态碰到怪物
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
        }else if(sizeOne.x<this.orignPos.x+80&&sizeOne.x>this.orignPos.x-80&&sizeOne.y<this.orignPos.y+120){
            if(!this.isMoving&&!this.isPlayerAround){
                this.isPlayerAround=true;
                this.pause();
            }
        }else if(this.isPlayerAround){
            this.isPlayerAround=false;
            this.resume();
        }
    },
    update (dt) {
        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    pause(){
        this.node.pauseAllActions();
        this.animation.pause();
    },
    resume(){
        this.node.resumeAllActions();
        this.animation.resume();
    },
    die(){
        this.node.removeFromParent();
        EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
    },
    onCollsiWithPBullet(bullet){
        bullet.die();
        this.die();
    }
});
