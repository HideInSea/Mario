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
        black:cc.SpriteFrame,
        white:cc.SpriteFrame,
        box:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:
    init(){
        this.color=arguments[1];
        this.dir=arguments[2]===ENUM.MON_DIR.LEFT?DIR.DIR_LEFT:DIR.DIR_RIGHT;

        switch(this.color){
            case ENUM.AEX_COLOR.WHITE:
            this.node.getComponent(cc.Sprite).spriteFrame=this.white;
            break;
            case ENUM.AEX_COLOR.BLACK:
            this.node.getComponent(cc.Sprite).spriteFrame=this.black;
            break;
        }
        this.playRollAni();
        this.vCurrSpeed=300;
        this.vCurrAcceleration=-1000;
        this.hCurrSpeed=this.getHSpeed();
    },
    getSize(){
        return cc.rect(0,0,0,0);
    },
    interactive(actor){
        if(actor.isDie)return;
        let sizeOne=actor.getSize();
        let globalPos=actor.node.parent.convertToWorldSpace(cc.v2(sizeOne.x-sizeOne.width/2,sizeOne.y));
        let playerBox=cc.rect(globalPos.x,globalPos.y,sizeOne.width,sizeOne.height);
        let box=this.box.getBoundingBoxToWorld();
        if(cc.Intersection.rectRect(playerBox,box)){
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
    },
    // onLoad () {},
    update (dt) {
        if(this.isPause)return;
        
        this.move(dt);

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }

    },
    turnLeft(){
        this.node.scaleX=1;
        this.dir=DIR.DIR_LEFT;
    },
    turnRight(){
        this.node.scaleX=-1;
        this.dir=DIR.DIR_RIGHT;
    },
    getHSpeed(){
        return this.dir===DIR.DIR_LEFT?-200:200;
    },
    playRollAni(){
        if(this.dir===DIR.DIR_LEFT){
            this.turnLeft();
            let rollLeft=cc.rotateBy(0.5,-360);
            this.node.runAction(cc.repeatForever(rollLeft));    
        }else{
            this.turnRight();
            let rollRight=cc.rotateBy(0.5,360);
            this.node.runAction(cc.repeatForever(rollRight));
        }
    },
    pause(){
        this.isPause=true;
        this.node.pauseAllActions();
    },
    resume(){
        this.isPause=false;
        this.node.resumeAllActions();
    }
});
