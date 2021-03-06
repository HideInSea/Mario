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
        white:cc.SpriteFrame,
        black:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:    
    init(){
        this.actorType=arguments[0];
        this.color=arguments[1];
        this.dir=arguments[2]===ENUM.MON_DIR.LEFT?DIR.DIR_LEFT:DIR.DIR_RIGHT;
        this.dir===DIR.DIR_LEFT?this.turnLeft():this.turnRight();
        this.hCurrSpeed=this.getHSpeed();

        this.sprite=this.node.getComponent(cc.Sprite);

        this.color===ENUM.MON_COLOR.BLACK?this.sprite.spriteFrame=this.black:this.sprite.spriteFrame=this.white;
    },
    getHSpeed(){
        return this.dir===DIR.DIR_LEFT?-180:180;
    },
    turnRight(){
        this.node.scaleX=-1;
        this.dir=DIR.DIR_RIGHT;
    },
    turnLeft(){
        this.node.scaleX=1;
        this.dir=DIR.DIR_LEFT;
    },
    getSize(){
        let size=this.node.getContentSize();
        let height=size.height;
        let width=size.width;
        return cc.rect(this.node.x,this.node.y,width,height);
    },
    die(){
        this.isDie=true;
        this.node.scaleY=-1;
        this.node.y+=40;
        this.vCurrSpeed=300;
        this.vCurrAcceleration=-1400;
        this.hCurrSpeed=0;
        this.hCurrAcceleration=0;
        EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
    },
    pause(){
        this.isPause=true;
        this.node.pauseAllActions();
    },
    resume(){
        this.isPause=false;
        this.node.resumeAllActions();
    },
    // onLoad () {},

    update (dt) {
        if(this.isPause)return;

        this.move(dt);

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
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
            }
        
    }
});
