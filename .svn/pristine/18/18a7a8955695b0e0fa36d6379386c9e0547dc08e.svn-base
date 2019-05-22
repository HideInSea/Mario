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
        big:cc.Prefab,
        small:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:
    init(){
        this.currFireBall=null;
        switch(arguments[1]){
            case ENUM.FIRE_BALL_TYPE.BIG:
            this.currFireBall=cc.instantiate(this.big);
            break;
            case ENUM.FIRE_BALL_TYPE.SMALL:
            this.currFireBall=cc.instantiate(this.small);
            break;
        }
        this.node.addChild(this.currFireBall);
        this.ballAnimation=this.currFireBall.getComponent(cc.Animation);
    },
    interactive(actor){
        if(actor.isDie)return;
        let sizeOne=actor.getSize();
        let globalPos=actor.node.parent.convertToWorldSpace(cc.v2(sizeOne.x-sizeOne.width/2,sizeOne.y));
        let playerBox=cc.rect(globalPos.x,globalPos.y,sizeOne.width,sizeOne.height);
        let children=this.currFireBall.children;
        for(let i=0;i<children.length;i++){
            let fireBox=children[i].getBoundingBoxToWorld();
            if(cc.Intersection.rectRect(playerBox,fireBox)){
            //闪烁状态碰到怪物
            if(!actor.isFlashing&&!actor.isInvincible){
                if(actor.getFormState()!==FORM_STATE.SMALL){
                    actor.fsm.switchStateWithStack("to_small");
                }else{
                    actor.fsm.switchState("die");
                }
            }
            return;
            }
        }
    },
    getSize(){
        return cc.rect(0,0,0,0);
    },
    update (dt) {
        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    pause(){
        this.ballAnimation.pause();
    },
    resume(){
        this.ballAnimation.resume();
    }
});
