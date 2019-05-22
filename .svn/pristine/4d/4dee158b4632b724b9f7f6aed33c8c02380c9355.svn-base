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

    init(dir){ 
         this.dir=dir;   
         this.hDefSpe=600;
         this.vDefAcce=-6000;
         this.vDefSpe=600;
         this.vMaxSpeed=600;
         this.animation=this.node.getComponent(cc.Animation);
         this.animation.play("bullet_roll");
         this.vCurrSpeed=-600;
         this.vCurrAcceleration=this.vDefAcce;
         this.isPause=false;
         this.hCurrSpeed=this.getHSpeed();
         this.isDie=false;
    },
    getSize(){
        let size=this.node.getContentSize();
        let height=size.height;
        let width=size.width;
        return cc.rect(this.node.x,this.node.y,width,height);
    },
    dieCallBack(){
        this.node.removeFromParent();
    },
    update (dt) {
        if(this.isPause)return;
        this.backPos();

        this.move(dt);

        //限制垂直方向下的速度
        if(this.vCurrSpeed<-this.vMaxSpeed){
            this.vCurrSpeed=-this.vMaxSpeed;
        }

        let tile=null;
        //脚底的碰撞检测
        tile=this.getDownCollsiTile();
        if(tile.type){
            switch(tile.type){
                case TILE_TYPE.LAND:
                case TILE_TYPE.PIPE_H_ENTRY:
                case TILE_TYPE.WALL:
                case TILE_TYPE.PIPE_V_ENTRY:  
                case TILE_TYPE.QUESTION:
                    this.collsiDown(tile.tile);
                    this.jump();
                break;                    
            }
        }

        tile=this.getRightCollsiTile();
        if(tile.type){
            switch(tile.type){
                case TILE_TYPE.LAND:
                case TILE_TYPE.PIPE_H_ENTRY:
                case TILE_TYPE.WALL:
                case TILE_TYPE.PIPE_V_ENTRY:  
                case TILE_TYPE.QUESTION:
                    this.die();
                break;
                case TILE_TYPE.FLAG:
                    this.node.x=tile.tile.node.x+15;
                    this.die();
                break;                    
            } 
        }


        tile=this.getLeftCollsiTile();
        if(tile.type){
            switch(tile.type){
                case TILE_TYPE.LAND:
                case TILE_TYPE.PIPE_H_ENTRY:
                case TILE_TYPE.WALL:
                case TILE_TYPE.PIPE_V_ENTRY:  
                case TILE_TYPE.QUESTION:
                    this.die();
                break;   
                case TILE_TYPE.FLAG:
                    this.node.x=tile.tile.node.x+15;
                    this.die();
                break;                  
            }
        }

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }

    },
    collsiDown(tile){
        let size=this.getSize();
        if((this.oldPos.y>=tile.node.y)
        &&((this.oldPos.x-size.width/2>=tile.node.x&&this.oldPos.x-size.width/2<=tile.node.x+40)
        ||(this.oldPos.x+size.width/2>=tile.node.x&&this.oldPos.x+size.width/2<=tile.node.x+40))){
            this.node.y=tile.node.y+40;
            this.jump();
        }
    },
    die(){
        this.isPause=true;
        this.isDie=true;
        this.animation.play("bullet");
    },
    getHSpeed(){
        return this.dir===DIR.DIR_LEFT?-this.hDefSpe:this.hDefSpe;
    },
    jump(){
        this.vCurrSpeed=this.vDefSpe;
        this.vCurrAcceleration=this.vDefAcce;
    },
    pause(){
        this.isPause=true;
        this.animation.pause();
    },
    resume(){   
        this.isPause=false;
        this.animation.resuem();
    }
});
