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
    init(){
        this.animation=this.node.getComponent(cc.Animation);
        this.borth();
        this.isOnLand=false;
        this.hDefSpe=80;
    },
    borth(){
        this.isBorthing=true;
        this.vCurrAcceleration=-1000;
        this.vCurrSpeed=300;
        this.animation.play("borth");
    },  
    // onLoad () {},
    interactive(actor){
        if(this.isDie||actor.isDie)return;

        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            //闪烁状态碰到怪物
            if(actor.isFlashing){
                this.die();
            }
            //无敌状态碰到怪物
            else if(actor.isInvincible){

            }
            //普通状态碰到蘑菇
            else{
                //踩到蘑菇
                if(actor.getFormState()!==FORM_STATE.SMALL){
                    actor.fsm.switchStateWithStack("to_small");
                }else{
                    actor.fsm.switchState("die");
                }
            }
        }
    },
    getSize(){
        let size=this.node.getContentSize();
        let height=size.height-4;
        let width=size.width-4;
        return cc.rect(this.node.x,this.node.y,width,height);
    },
    update (dt) {
        if(this.isPause)return;

        if(this.enableMove){
            this.backPos();

            this.move(dt);
    

        }

        if(this.enableCollsi){
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
                if(this.isOnLand&&!this.isBorthing){
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
        }

        if(this.isOutScreen()){
            EM.emit(EM.type.HEDGEHOG_DIE);
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
            if(this.isBorthing){
                this.isBorthing=false;
                this.animation.play("walk");
                this.dir=this.getDir();
                this.dir===DIR.DIR_LEFT?this.turnLeft():this.turnLeft();
            }
            this.isOnLand=true;
            this.node.y=tile.node.y+40;
            this.vCurrSpeed=0;
            this.vCurrAcceleration=0;
        }
    },
    getDir(){
        if(this.node.x>gm.currPlayer.x){
            return DIR.DIR_LEFT;
        }else{
            return DIR.DIR_RIGHT;
        }
    },

    turnRight(){
        this.dir=DIR.DIR_RIGHT;
        this.node.scaleX=-1;
        this.hCurrSpeed=this.hDefSpe;
    },
    turnLeft(){
        this.dir=DIR.DIR_LEFT;
        this.node.scaleX=1;
        this.hCurrSpeed=-this.hDefSpe;
    },
    pause(){
        this.isPause=true;
        this.animation.pause();
    },
    resume(){
        this.isPause=false;
        this.animation.resume();
    },
    changeDir(){
        this.dir===DIR.DIR_LEFT?this.turnRight():this.turnLeft();
    },
    die(){
        this.isDie=true;
        this.node.scaleY=-1;
        this.node.y+=40;
        this.vCurrSpeed=300;
        this.vCurrAcceleration=-1400;
        this.hCurrSpeed=0;
        this.hCurrAcceleration=0;
        this.enableCollsi=false;
        this.animation.play("die");
        EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
    },
    //与怪物的碰撞检测
    collsiWithMon(actor){
        if(this.isDie||this.isBorthing)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            if(actor.getActorType()===ENUM.MON_TYPE.ROCKET){
                return;
            }
            if(actor.getActorType()===ENUM.MON_TYPE.DUCK||actor.getActorType()===ENUM.MON_TYPE.HELMET){return;}
            else{
                if(!actor.isDie)actor.changeDir();
                this.changeDir();
                this.node.x>actor.node.x?
                this.node.x=sizeOne.x+sizeOne.width/2+sizeTwo.width/2+1:
                this.node.x=sizeOne.x-sizeOne.width/2-sizeTwo.width/2-1;
            }
        }
    },
    onCollsiPushWall(wallBox){
        this.node.y=wallBox.y+wallBox.height;
    },
    onCollsiWithPBullet(bullet){
        bullet.die();
        this.die();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // update (dt) {},
});
