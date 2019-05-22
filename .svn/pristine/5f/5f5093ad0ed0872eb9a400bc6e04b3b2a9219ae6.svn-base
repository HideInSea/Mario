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

    init(){
        this.type=arguments[1];
        this.offset=arguments[2];
        this.dir=arguments[3];
        this.animation=this.node.getComponent(cc.Animation);
        this.enableMove=true;
        switch(this.type){
            case ENUM.FIRE_TYPE.UP_DOWN:
                this.node.y-=40;
                this.animation.play("big");
                let moveUp=cc.moveBy(1.5,cc.v2(0,400)).easing(cc.easeCubicActionInOut());
                let moveDown=cc.moveBy(1.5,cc.v2(0,-400)).easing(cc.easeCubicActionInOut());
                let delay=cc.delayTime(2);
                this.node.runAction(cc.repeatForever(cc.sequence(moveUp,cc.callFunc(this.turnDown,this),moveDown,delay,cc.callFunc(this.turnUp,this))));
            break;
            case ENUM.FIRE_TYPE.LEFT:
                this.animation.play("small");
                this.hCurrSpeed=-200;
                this.node.anchorY=0;
                if(this.offset){
                    let y=parseInt(this.offset);
                    this.node.runAction(cc.moveBy(1,cc.v2(0,this.offset-this.node.y)));
                    parseInt(this.dir)===DIR.DIR_LEFT?(this.hCurrSpeed=-200,this.node.scaleX=1):(this.hCurrSpeed=200,this.node.scaleX=-1);
                }
            break;
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    turnDown(){
        this.node.scaleY=-1;
    },
    turnUp(){
        this.node.scaleY=1;
    },
    isOutScreen(){
        let pos=this.node.convertToWorldSpace(cc.v2(0,0));
        return (pos.x>global.winSize.width+320||pos.x<-80||pos.y<-80||pos.y>global.winSize.height+80)?true:false;
    },
    getSize(){
        let size=this.node.getContentSize();
        let width=size.width-10;
        let height=size.height-8;
        let x=this.node.x;
        let y=this.node.y;
        if(this.type===ENUM.FIRE_TYPE.UP_DOWN){
            y-=height/2;
        }
        return cc.rect(x,y,width,height); 
    },
    interactive(actor){
        if(actor.isDie)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            //闪烁状态碰到怪物
            if(!actor.isFlashing&&!actor.isInvincible){
                if(actor.getFormState()!==FORM_STATE.SMALL){
                    actor.fsm.switchStateWithStack("to_small");
                }else{
                    actor.fsm.switchState("die");
                }
            }
        }
    },
    update (dt) {
        if(!this.enableMove)return;

        this.move(dt);

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }

    },
    pause(){
        this.animation.pause();
        this.enableMove=false;
        this.node.pauseAllActions();
    },
    resume(){
        this.animation.resume();
        this.enableMove=true;
        this.node.resumeAllActions();
    }
});
