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
        this.vCurrSpeed=100;
    },
    // onLoad () {},
    getSize(){
        let size=this.node.getContentSize();
        return cc.rect(this.node.x,this.node.y,size.width,size.height);
    },
    isOutScreen(){
        let pos=this.node.convertToWorldSpace(cc.v2(0,0));
        if(pos.x>globalMgr.winSize.width+80||pos.x<-80||pos.y<-120||pos.y>globalMgr.winSize.height-120){
            return true;
        }
        return false;
    },
    update (dt) {
        this.move(dt);

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    }
});
