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
        redSkin:cc.SpriteFrame,
        blueSkin:cc.SpriteFrame,
        lvUpSkin:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad ()
    init(){
        this.hDefaultSpe=180;
        this.type=arguments[1];
        this.isPause=true;           //禁止碰撞检测
        this.hCurrSpeed=this.hDefaultSpe;
        this.dir=DIR.DIR_RIGHT;
        this.isOnLand=true; 
        let currSkin=null;
        switch(this.type){
            case ENUM.PROP_COLOR.RED:
                currSkin=this.redSkin;
            break;
            case ENUM.PROP_COLOR.BLUE:
                currSkin=this.blueSkin;
            break;
            case ENUM.PROP_TYPE.LIFE:
                currSkin=this.lvUpSkin;
            break;
        } 
        this.node.getComponent(cc.Sprite).spriteFrame=currSkin;  
        this.playBorthAni();                           
    },
    //出场动画
    playBorthAni(){
        let moveUp=cc.moveBy(0.6,cc.v2(0,42));
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
            switch(this.type){
                case ENUM.PROP_COLOR.RED:
                case ENUM.PROP_COLOR.BLUE:
                    actor.fsm.switchStateWithStack("to_big");
                    this.node.removeFromParent();
                break;
                case ENUM.PROP_TYPE.LIFE:
                    this.node.removeFromParent();
                    EM.emit(EM.type.ADD_LIFE,1);
                    EM.emit(EM.type.LIFE_EFFECT,cc.v2(this.node.x,this.node.y+80));
                break;
            } 
        }
    },
    getSize(){
        let size=this.node.getContentSize();
        let height=size.height-4;
        let width=size.width-14;
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
        }else{
            if(this.isOnLand){
                this.isOnLand=false;
                this.vCurrSpeed=-380;
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
                    this.collsiRight(tile.tile);
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
        if(this.isOnLand)return;
        let size=this.getSize();
        if((this.oldPos.y>=tile.node.y)
        &&((this.oldPos.x-size.width/2>=tile.node.x&&this.oldPos.x-size.width/2<=tile.node.x+40)
        ||(this.oldPos.x+size.width/2>=tile.node.x&&this.oldPos.x+size.width/2<=tile.node.x+40))){
            this.isOnLand=true;
            this.node.y=tile.node.y+40;
            this.vCurrSpeed=0;
            this.vCurrAcceleration=0;
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
    pause(){
        this.isPause=true;
    },
    resume(){
        this.isPause=false;
    },
    onCollsiPushWall(wallBox){
        this.node.y=wallBox.y+20;
        this.node.x>wallBox.x?this.turnRight():this.turnLeft();
    }
});