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
        this.animation=this.node.getComponent(cc.Animation);
        switch(arguments[1]){
            case ENUM.PROP_COLOR.RED:
            this.animation.play("flower_red");
            break;
            case ENUM.PROP_COLOR.BLUE:
            this.animation.play("flower_blue");
            break;
        } 
        this.playBorthAni();                           
    },
    getSize(){
        let size=this.node.getContentSize();
        return cc.rect(this.node.x,this.node.y,size.width,size.height);
    },
    // onLoad () {},
    interactive(actor){
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        let rectOne=cc.rect(sizeOne.x-sizeOne.width/2,sizeOne.y,sizeOne.width,sizeOne.height);
        let rectTwo=cc.rect(sizeTwo.x-sizeTwo.width/2,sizeTwo.y,sizeTwo.width,sizeTwo.height);
        if(cc.Intersection.rectRect(rectOne,rectTwo)){
            switch(actor.formState){
                case FORM_STATE.SMALL:
                    actor.fsm.switchStateWithStack("to_big");
                break;
                case FORM_STATE.BIG:    
                    actor.fsm.switchStateWithStack("flash_catch_flower");
                break;
                case FORM_STATE.FIRE:
                    EM.emit(EM.type.SCORE_EFFECT, cc.v2(this.node.x, this.node.y + 80),1000);
                break;
            } 
            this.node.removeFromParent();
        }
    },
    //出场动画
    playBorthAni(){
        let moveUp=cc.moveBy(0.6,cc.v2(0,40));
        this.node.runAction(moveUp);
    },
    update (dt) {
        if(this.isPause)return;

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
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
    }
});
