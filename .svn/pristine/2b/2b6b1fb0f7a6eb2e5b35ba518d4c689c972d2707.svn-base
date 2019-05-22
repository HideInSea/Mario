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
        let desObj=gm.posMgr.posLayer.getObject("transitionEnd_"+arguments[1]);
        this.desPos=gm.posMgr.objectPosToMapPos(cc.v2(desObj.x,desObj.y));
    },
    getSize(){
        return cc.rect(0,0,0,0);
    },
    // LIFE-CYCLE CALLBACKS:
    interactive(actor){
        if(actor.node.x>this.node.x&&actor.node.x<this.node.x+20&&actor.node.y>=this.node.y&&actor.node.y<=this.node.y+3*40){
            let oldPos=actor.node.position;
            gm.currPlayer.setPosition(cc.v2(this.desPos.x+actor.node.x-this.node.x,gm.currPlayer.y));

            let offset=gm.currPlayer.x-oldPos.x;
            
            gm.posMgr.setMapToPos(cc.v2(gm.node.x-offset,gm.node.y));
            
            gm.posMgr.resetObjects();
            gm.monsterMgr.resetObjects();
            gm.propMgr.resetObjects();
            this.node.removeFromParent();
            actor.roadCheck=0;
        }
        
    },
    update (dt) {
        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    }
});
