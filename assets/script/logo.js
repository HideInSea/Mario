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
    extends: cc.Component,

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
        one:cc.Node,
        two:cc.Node,
        select:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.players=1;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.keyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_Up,this.keyUp,this);
    },

    keyDown(event){
        cc.log("down");
        switch(event.keyCode){
            case cc.macro.KEY.enter:
            this.enter();
            break;
            case cc.macro.KEY.f:
            this.selectNext();
            break;
        }
    },
    keyUp(event){

    },
    selectNext(){
        this.players===1?(this.select.y=this.two.y,this.players=2):(this.select.y=this.one.y,this.players=1);
    },
    enter(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.keyDown,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_Up,this.keyUp,this);
        globalMgr.init(this.players);
        cc.director.loadScene("round");
    }
    // update (dt) {},
});
