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
        this.type=arguments[1];
        if(this.type===ENUM.STORY_TYPE.SKY){
            let desObj=gm.posMgr.posLayer.getObject("skyEnd_"+arguments[2]);
            let mapPos=gm.posMgr.objectPosToMapPos(cc.v2(desObj.x,desObj.y));
            //let screenPos=gm.mapMgr.mapPosToScreenPos(mapPos);
            this.desPos=cc.v2(mapPos.x+20,mapPos.y-80);
            this.desMapPos=cc.v2(-mapPos.x+40*parseInt(arguments[3])-320,gm.node.y);
        }
    },
    getSize(){
        return cc.rect(0,0,0,0);
    },  
    interactive(actor){
        if(actor.node.y>this.node.y)return;
        switch(this.type){
            case ENUM.STORY_TYPE["2_3_4"]:
            case ENUM.STORY_TYPE["6_7_8"]:
            case ENUM.STORY_TYPE["5"]:
                EM.emit(EM.type.SHOW_SELECT_ZOOM,this.type);
                EM.emit(EM.type.REMOVE_ALL_MON);
                this.node.removeFromParent();
            break;
            case ENUM.STORY_TYPE.SKY:
                gm.posMgr.airCallBack(null,{desMapPos:this.desMapPos,desPos:this.desPos});
                this.node.removeFromParent();
            break;
        }
    },
    //onLoad () {}
    update (dt) {
        if(this.isOutScreen()){
            this.removeFromParent();
        }
    }
});