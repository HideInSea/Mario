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
var {MoveCmd}=require("aiCtrl");
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
    getSize(){
        let size=this.node.getContentSize();
        return cc.rect(this.node.x,this.node.y,size.width,size.height);
    },
    init(){
        this.isCollsi=false;
    },
    interactive(actor){
        if(this.isCollsi)return;
        if(this.node.x<actor.node.x){
            this.isCollsi=true;
            EM.emit(EM.type.STOP_READTIME);
            if(gm.monsterMgr.isBossDie){
                gm.playerScript.enableInput=false;
                gm.playerScript.releaseAllKey();          
                gm.playerScript.aiCtrl.addCmd(new MoveCmd(gm.playerScript,cc.macro.KEY.d,"keydown"));      
                gm.posMgr.removeCurrMapFixed();
                gm.enableMapMove=true; 
                gm.fixOffset(gm.playerScript.node.position);
            }else{
                gm.playerScript.pause();
                gm.playerScript.enableInput=false;
                gm.playerScript.releaseAllKey(); 
                //播放拆桥动画
                this.playDropAni();
                gm.monsterMgr.currBoss.fsm.switchState("die");
                setTimeout(() => {
                    gm.playerScript.resume();
                    gm.playerScript.aiCtrl.addCmd(new MoveCmd(gm.playerScript,cc.macro.KEY.d,"keydown")); 
                    gm.posMgr.removeCurrMapFixed();
                    gm.enableMapMove=true; 
                    gm.fixOffset(gm.playerScript.node.position);
                },3000);
            }
            let boss=gm.monsterMgr.currBoss;
            boss.node.removeFromParent();
            gm.monsterMgr.node.removeAllChildren(); 
            gm.monsterMgr.node.addChild(boss.node);
        }
    },
    playDropAni(){
        this.rosePos=gm.mapMgr.toTiledPos(cc.v2(this.node.x-40,this.node.y-40));
        this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            gm.mapMgr.sceneLayer.setTileGIDAt(0,this.rosePos);
            this.rosePos.y++;
            this.schedule(function(){
                gm.mapMgr.setObstacleGidAt(cc.v2(this.rosePos.x--,this.rosePos.y,0));
            }.bind(this),0.1,15);
        },this)));
    },

    // onLoad () {},

    update (dt) {
        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    }
});
