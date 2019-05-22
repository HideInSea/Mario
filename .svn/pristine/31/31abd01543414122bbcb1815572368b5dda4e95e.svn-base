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
        player:cc.Node,
        monster:cc.Node,
        pBullet:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        EM.on(EM.type.CREATE_P_BULLET,this.createPBullet,this);
    },
    enableFire(){
        return this.player.childrenCount<2?true:false;
    },
    createPBullet(pos,dir){
        this.pBulletCount++;
        let bullet=cc.instantiate(this.pBullet);
        this.player.addChild(bullet);
        bullet.setPosition(pos);
        bullet.getComponent(bullet.name).init(dir);
    },
    onDestroy(){
        EM.off(EM.type.CREATE_P_BULLET);
    },
    getPBullet(){
        return this.player.children;
    }
    // update (dt) {},
});
