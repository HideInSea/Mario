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
    extends: Actor,

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
    init(){
        this.hDefaultSpe=180;
        this.vDefAcce=-1500;
        this.vDefSpe=500;
        this.isPause=true;           //禁止碰撞检测
        this.hCurrSpeed=this.hDefaultSpe;
        this.vCurrAcceleration=this.vDefAcce;
        this.vCurrSpeed=this.vDefSpe;
        this.dir=DIR.DIR_RIGHT;  
        this.playBorthAni(); 
        this.animation=this.node.getComponent(cc.Animation);
    },
    //出场动画
    playBorthAni(){
        let moveUp=cc.moveBy(0.6,cc.v2(0,40));
        this.node.runAction(cc.sequence(moveUp,cc.callFunc(function(){
            this.isPause=false;
        },this)));
    },
    interactive(actor){
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        let rectOne=cc.rect(sizeOne.x-sizeOne.width/2,sizeOne.y,sizeOne.width,sizeOne.height);
        let rectTwo=cc.rect(sizeTwo.x-sizeTwo.width/2,sizeTwo.y,sizeTwo.width,sizeTwo.height);
        if(cc.Intersection.rectRect(rectOne,rectTwo)){
            actor.fsm.switchSubState("flash_catch_star");
            this.node.removeFromParent();
        }
    },
    getSize(){
        let size=this.node.getContentSize();
        let height=size.height;
        let width=size.width;
        return cc.rect(this.node.x,this.node.y,width,height);
    },
    update (dt) {
        if(this.isPause)return;

        this.backPos();

        this.move(dt);

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
                break;                    
            }
        }

        tile=this.getRightCollsiTile();
        if(tile.type){
            switch(tile.type){
                case TILE_TYPE.LAND:
                case TILE_TYPE.PIPE_H_ENTRY:
                case TILE_TYPE.PIPE_V_ENTRY:  
                    this.collsiRight(tile.tile);
                break;                    
            }
        }


        tile=this.getLeftCollsiTile();
        if(tile.type){
            switch(tile.type){
                case TILE_TYPE.LAND:
                case TILE_TYPE.PIPE_H_ENTRY:
                case TILE_TYPE.PIPE_V_ENTRY:  
                    this.collsiLeft(tile.tile);
                break;                    
            }
        }

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }

    },
    collsiLeft(tile){
        this.turnRight();
        this.node.x=this.getSize().width/2+tile.node.x+40+1;
    },
    collsiRight(tile){
        this.turnLeft();
        this.node.x=tile.node.x-this.getSize().width/2-1;
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
    turnRight(){
        this.dir=DIR.DIR_RIGHT;
        this.hCurrSpeed=this.hDefaultSpe;
    },
    turnLeft(){
        this.dir=DIR.DIR_LEFT;
        this.hCurrSpeed=-this.hDefaultSpe;
    },
    jump(){
        this.vCurrAcceleration=this.vDefAcce;
        this.vCurrSpeed=this.vDefSpe;
    },
    pause(){
        this.isPause=true;
        this.animation.pause();
    },
    resume(){   
        this.isPause=false;
        this.animation.resume();
    }
});
