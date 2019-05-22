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

    // onLoad () {},
    init(){
        this.color=arguments[1];
        this.actorType=arguments[0];    
        this.fireDir=ENUM.MON_DIR.LEFT;

        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(3),cc.callFunc(this.fire,this))));
        
        this.isPlayerAround=false;
    },
    fire(){
        EM.emit(EM.type.CREATE_MONSTER,this.node.position,"rocket_"+this.color+"_"+this.getFireDir());
    },
    getFireDir(){
        return this.node.x>gm.currPlayer.x?ENUM.MON_DIR.LEFT:ENUM.MON_DIR.RIGHT;
    },
    getSize(){
        return cc.rect(0,0,0,0);
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

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    interactive(actor){
        if(actor.isDie)return;

        if(actor.node.x<this.node.x+60&&actor.node.x>this.node.x-60&&!this.isPlayerAround){
            this.isPlayerAround=true;
            this.node.pauseAllActions();
        }else if((actor.node.x>this.node.x+60||actor.node.x<this.node.x-60)&&this.isPlayerAround){
            this.isPlayerAround=false;
            this.node.resumeAllActions();
        }
    }
});
