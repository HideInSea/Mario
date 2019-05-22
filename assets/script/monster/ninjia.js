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
var JumpDir={
    DOWN:0,
    UP:1
}
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
        black:cc.Node,
        white:cc.Node
    },
    init(){
        this.animation=this.node.getComponent(cc.Animation);       
        this.dir=DIR.DIR_LEFT;
        this.color=arguments[1];
        this.isOnLand=true;
        this.isJumpUp=false;
        this.isJumpDown=false;
        this.jumpOrignPos=null;
        
        let moveLeft=cc.moveBy(1,cc.v2(-40,0));
        let moveRight=cc.moveBy(1,cc.v2(40,0));
        this.node.runAction(cc.repeatForever(cc.sequence(moveLeft,moveRight)));

        this.scheduleFire();
        this.schedule(this.scheduleFire,8);
        this.animation.play("ninjia_walk");
        this.schedule(this.jump,6);
    },
    jump(){
        if(!this.isOnLand)return;
        let jumpDir=null;
        if(this.node.y>=10*40){
            jumpDir=JumpDir.DOWN;
        }else if(this.node.y>=6*40){
            jumpDir=Math.floor(Math.random()*2);
        }else{
            jumpDir=JumpDir.UP;
        }

        if(jumpDir===JumpDir.UP){
            this.jumpUp();
        }else{
            this.jumpDown();
        }
    },
    turnLeft(){
        this.dir=DIR.DIR_LEFT;
        this.node.scaleX=1;
    },
    turnRight(){
        this.dir=DIR.DIR_RIGHT;
        this.node.scaleX=-1;
    },
    scheduleFire(){
        this.schedule(this.fire,1,5);
    },
    fire(){
        this.animation.play("ninjia_fire");
    },
    getSize(){
        let size=this.node.getContentSize();
        return cc.rect(this.node.x,this.node.y,size.width,size.height);
    },  
    fireStart(){
        this.color===ENUM.MON_COLOR.BLACK?
        this.black.active=true:
        this.white.active=true;
    },
    fireEnd(){
        let dir=this.dir===DIR.DIR_LEFT?"left":"right";
        let color="";
        if(this.color===ENUM.MON_COLOR.BLACK){
            this.black.active=false;
            color="black";
        }else{
            this.white.active=false;
            color="white";
        } 
        EM.emit(EM.type.CREATE_MONSTER,this.getFirePos(),"aex_"+color+"_"+dir);
        this.animation.play("ninjia_walk");
    },
    getFirePos(){
        return cc.v2(this.black.x+this.node.x,this.black.y+this.node.y);
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    update (dt) {
        if(this.isPause)return;

        this.backPos();

        this.move(dt);

        if(this.enableCollsi){    
            //脚底的碰撞检测
            let tile=this.getDownCollsiTile();
            if(tile.type){
                //cc.log(tile.type);
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
                }
            }
    
            //右侧的碰撞检测
            tile=this.getRightCollsiTile();
            if(tile.type){
                cc.log(tile.type);
                switch(tile.type){
                    case TILE_TYPE.LAND:
                    case TILE_TYPE.PIPE_V_ENTRY:
                    case TILE_TYPE.WALL:
                    case TILE_TYPE.QUESTION:    
                    case TILE_TYPE.PIPE_H_ENTRY:
                    this.collsiRight(tile.tile);
                    break;

                }
            }
    
            //左侧的碰撞检测
            tile=this.getLeftCollsiTile();
            if(tile.type){
                cc.log(tile.type);
                switch(tile.type){
                    case TILE_TYPE.LAND:
                    case TILE_TYPE.PIPE_V_ENTRY:
                    case TILE_TYPE.WALL:
                    case TILE_TYPE.QUESTION:     
                    case TILE_TYPE.PIPE_H_ENTRY:
                    this.collsiLeft(tile.tile);
                    break;
    
                }
            }
        }


        if(this.isJumpDown){
            if(this.jumpOrignPos.y>this.node.y+120){
                this.enableCollsi=true;
            }
        }else if(this.isJumpUp){
            if(this.vCurrSpeed<0){
                this.enableCollsi=true;
            }
        }

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    collsiLeft(tile){
        if(this.dir===DIR.DIR_LEFT)this.hCurrSpeed=0;
        this.node.x=this.getSize().width/2+tile.node.x+40+1;
    },
    collsiRight(tile){
        if(this.dir===DIR.DIR_RIGHT)this.hCurrSpeed=0;
        this.node.x=tile.node.x-this.getSize().width/2-1; 
    },
    collsiDown(tile){
        let size=this.getSize();
        if(!this.isOnLand){
            if((this.oldPos.y>=tile.node.y)
            &&((this.oldPos.x-size.width/2>=tile.node.x&&this.oldPos.x-size.width/2<=tile.node.x+40)
            ||(this.oldPos.x+size.width/2>=tile.node.x&&this.oldPos.x+size.width/2<=tile.node.x+40))){
                this.isOnLand=true;
                this.isJumpDown=false;
                this.isJumpUp=false;
                this.node.y=tile.node.y+40;
                this.vCurrSpeed=0;
                this.vCurrAcceleration=0;
            }
        }
    },
    pause(){
        this.isPause=true;
        this.animation.pause();
        this.unschedule(this.fire);
    },
    resume(){
        this.isPause=false;
        this.animation.resume();
        this.schedule(this.fire,2);
    },
    onCollsiWithPBullet(bullet){
        bullet.die();
        this.die();
    },
    die(){
        this.isDie=true;
        this.node.scaleY=-1;
        this.node.y+=80;
        this.vCurrSpeed=300;
        this.vCurrAcceleration=-1400;
        this.hCurrSpeed=0;
        this.hCurrAcceleration=0;
        this.enableCollsi=false;
        this.animation.play("ninjia_die");
        this.unschedule(this.scheduleFire);
        this.unschedule(this.jump);
        this.node.stopAllActions(); 
    },
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
                //踩到怪物
                if(sizeOne.y>=sizeTwo.y+sizeTwo.height/2&&!actor.isUpOrDown()){
                    actor.littleJump();
                    actor.node.y=sizeTwo.y+sizeTwo.height+1;
                    this.die();
                }
            }
            //普通状态碰到蘑菇
            else{
                //踩到蘑菇
                if(sizeOne.y>=sizeTwo.y+sizeTwo.height/2){
                    actor.littleJump();
                    actor.node.y=sizeTwo.y+sizeTwo.height+1;
                    this.die();
                }else if(actor.getFormState()!==FORM_STATE.SMALL){
                    actor.fsm.switchStateWithStack("to_small");
                }else{
                    actor.fsm.switchState("die");
                }
            }
        }else{
            if(actor.node.x>this.node.x&&this.dir===DIR.DIR_LEFT){
                this.turnRight();
            }else if(actor.node.x<this.node.x&&this.dir===DIR.DIR_RIGHT){
                this.turnLeft();
            }
        }
    },
    jumpUp(){
        this.vCurrAcceleration=-1350;                   //最小加速度
        this.vCurrSpeed=700;                     //加速时的初始速度
        this.isJumpUp=true;
        this.enableCollsi=false;
    },
    jumpDown(){

        this.vCurrAcceleration=-1350;                   //最小加速度
        this.vCurrSpeed=300;                     //加速时的初始速度
        this.isJumpDown=true;
        this.enableCollsi=false;
        this.jumpOrignPos=this.node.position;
    },
    onCollsiPushWall(wallBox){
        this.die();
    }
});
