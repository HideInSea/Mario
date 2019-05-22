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
        pieces:cc.Prefab,
        coin:cc.Prefab,
        score:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        EM.on(EM.type.PIECES_EFFECT,this.piecesEffect,this);
        EM.on(EM.type.COIN_EFFECT,this.coinEffect,this);
        EM.on(EM.type.SCORE_EFFECT,this.scoreEffect,this);
        EM.on(EM.type.LIFE_EFFECT,this.lifeEffect,this);
    },

    start () {

    },

    piecesEffect(pos,gid){
        let pieces=cc.instantiate(this.pieces);
        this.node.addChild(pieces);
        pieces.x=pos.x;
        pieces.y=pos.y;
        let script=pieces.getComponent("wall_effect");
        script.init(gid);
    },
    coinEffect(pos,score){
        EM.emit(EM.type.ADD_COIN,1);

        let coin=cc.instantiate(this.coin);
        this.node.addChild(coin);
        coin.x=pos.x;
        coin.y=pos.y;

        let moveUp=cc.moveBy(0.25,cc.v2(0,80)).easing(cc.easeCubicActionOut());
        let moveDown=cc.moveBy(0.25,cc.v2(0,-80)).easing(cc.easeCubicActionIn());
        coin.runAction(cc.sequence(moveUp,moveDown,cc.callFunc(function(target,data){
            this.scoreEffect(data.pos,data.score);
        }.bind(this),this,{pos:pos,score:score}),cc.removeSelf()));
    },
    scoreEffect(pos,score){
        EM.emit(EM.type.ADD_SCORE,score);
        let scor=cc.instantiate(this.score);
        this.node.addChild(scor);
        let label=scor.getComponent(cc.Label);
        scor.x=pos.x;
        scor.y=pos.y;
        label.string=score;
        
        let moveUp=cc.moveBy(0.5,cc.v2(0,60));
        let fadeOut=cc.fadeOut(0.5);
        scor.runAction(cc.sequence(moveUp,fadeOut,cc.removeSelf()));
    },
    lifeEffect(pos){
        let scor=cc.instantiate(this.score);
        this.node.addChild(scor);
        let label=scor.getComponent(cc.Label);
        scor.x=pos.x;
        scor.y=pos.y;
        label.string="1 UP";
        
        let moveUp=cc.moveBy(0.5,cc.v2(0,60));
        let fadeOut=cc.fadeOut(0.5);
        scor.runAction(cc.sequence(moveUp,fadeOut,cc.removeSelf()));
    },
    onDestroy(){
        EM.off(EM.type.PIECES_EFFECT);
        EM.off(EM.type.COIN_EFFECT);
        EM.off(EM.type.SCORE_EFFECT);
        EM.off(EM.type.LIFE_EFFECT);
    }
    //update (dt) {},

});
