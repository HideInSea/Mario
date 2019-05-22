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
        mapMgr:require("mapMgr"),
        propMgr:require("propMgr"),
        monsterMgr:require("monsterMgr"),
        bulletMgr:require("bulletMgr"),
        posMgr:require("posMgr"),
        effects:cc.Node,
        players:
        {
            type:cc.Prefab,
            default:[]   
        },
        flag:0,                         //人物移动到该点，地图移动，人物停止移动
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.gm=this;
        this.offset=0;
        this.enableMapMove=true;
        this.currPlayer=cc.instantiate(this.players[globalMgr.getPlayerId()]);
        this.playerScript=this.currPlayer.getComponent("player");
        //globalMgr.init(1);
        this.playerScript.init();
        this.mapMgr.init(this.currPlayer);
        this.monsterMgr.init();
        this.propMgr.init();
        this.posMgr.init();
        //this.playerScript=this.currPlayer.getComponent("player");
        //this.node.addChild(this.currPlayer);

        this.schedule(this.readTime,0.5);

        EM.on(EM.type.COLLSI_FLAG,this.collsiFlag,this);
        EM.on(EM.type.PLAYER_TO_END,this.playerToEnd,this);
        EM.on(EM.type.STOP_READTIME,function(){
            this.unschedule(this.readTime);
        },this);

        EM.on(EM.type.GAME_OVER,function(){
            EM.emit(EM.type.CHANGE_STATE,FORM_STATE.SMALL);
            if(globalMgr.isOneOrTwo()){
                if(globalMgr.getLife()<0){
                    globalMgr.restart();
                    cc.director.loadScene("logo");
                }else{
                    cc.director.loadScene("round");
                }
            }else{
                globalMgr.nextPlayer();
                if(globalMgr.getLife()<0){
                    globalMgr.nextPlayer();
                    if(globalMgr.getLife()<0){
                        globalMgr.restart();
                        cc.director.loadScene("logo");
                    }else{
                        cc.director.loadScene("round");
                    }
                }else{
                    cc.director.loadScene("round");
                }
            }
        },this);

        EM.on(EM.type.GAME_PASS,function(){
            cc.director.loadScene("round");
        },this);
    },
    playerToEnd(){
        this.schedule(this.countTime,0.01);
    },
    countTime(){
        if(globalMgr.time==0){
            this.unschedule(this.countTime);
            //next lv
            EM.emit(EM.type.RISE_WRITE_FLAG);
            return;
        }
        EM.emit(EM.type.ADD_SCORE,10);
        EM.emit(EM.type.ADD_TIME,-1);
    },
    //读秒
    readTime(){
        if(globalMgr.time==0){
            this.unschedule(this.readTime);
            //next lv
            //this.playerScript.fsm.switchState("die");
            return;
        }
        EM.emit(EM.type.ADD_TIME,-1);
    },
    collsiFlag(){
        //玩家碰到旗帜，地图禁止移动，取消读秒
        //this.enableMapMove=false;
        this.unschedule(this.readTime);
    },

    update (dt) {
        let playerPos=this.node.convertToWorldSpace(this.currPlayer.position);
        //地图的移动检测
        if(this.enableMapMove){
            if(playerPos.x>this.flag+this.offset&&!this.playerScript.getDie()){
                let interval=playerPos.x-this.flag-this.offset;
                this.node.x-=interval;
                //cc.log(interval.toFixed(2)+":"+dt.toFixed(4));
                this.offset-=2;
                if(this.offset<0)this.offset=0;
            } 
        }
 
        //人物与地图左边界的检测
        let size=this.playerScript.getSize();
        let left=this.node.convertToNodeSpace(cc.v2(size.width/2,size.y));
        let right=this.node.convertToNodeSpace(cc.v2(globalMgr.winSize.width-size.width/2,size.y));
        if(right.x<size.x){
            this.playerScript.hCurrSpeed=0;
            this.playerScript.node.x=right.x;
        }else if(left.x>size.x){
            this.playerScript.hCurrSpeed=0;
            this.playerScript.node.x=left.x;
        }
    },
    fixOffset(pos){
        let worldPos=this.node.convertToWorldSpace(pos);
        if(worldPos.x>this.flag){
            this.offset=worldPos.x-this.flag;
        }
    },
    onDestroy(){
        EM.off(EM.type.COLLSI_FLAG);
        EM.off(EM.type.PLAYER_TO_END);
        EM.off(EM.type.STOP_READTIME);
        EM.off(EM.type.GAME_OVER);
        EM.off(EM.type.GAME_PASS);
    }
});
