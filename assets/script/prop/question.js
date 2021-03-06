// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
    extends:cc.Component,

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
    init(tile){
        tile.node.addChild(this.node);
        let ani=this.node.getComponent(cc.Animation);
        switch(tile.gid){
            case GID.QUESTION[0]:ani.play("question_red");break;
            case GID.QUESTION[1]:ani.play("question_blue");break;
        }
        ani.setCurrentTime((Date.now()-globalMgr.aniSynTime)/1000);
    },
    // onLoad () {},
    start () {

    },

    update (dt) {
        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    isOutScreen(){
        let pos=this.node.convertToWorldSpace(this.node.position);
        if(pos.x<-40){
            return true;
        }
        return false;
    }
});
