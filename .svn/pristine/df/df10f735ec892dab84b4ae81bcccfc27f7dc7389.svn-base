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
var FSM=require("FSM");
var {Sleep,TopTurn,Slide,Walk}=require("helmetState");
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
    init(){
        this.actorType=arguments[0];
        this.color=arguments[1];  
        this.hDefSpe=90;
        this.vDefSpe=-380;
        this.defSlideSpe=500;
        this.dir=DIR.DIR_LEFT;
        this.state=ENUM.HELMET_STATE.WALK;
        this.isOnLand=true;
        this.isDie=false;
        this.animation=this.node.getComponent(cc.Animation);
        this.enableCollsi=true;
        this.enableMove=true;
        

        this.fsm=new FSM();
        this.fsm.addState(new Slide(this,"slide"));
        this.fsm.addState(new Walk(this,"walk"));
        this.fsm.addState(new Sleep(this,"sleep"));
        this.fsm.addState(new TopTurn(this,"topturn"));

        this.fsm.setDefaultState("walk");

    },
    getHSpeed(){
        if(this.state===ENUM.HELMET_STATE.SLIDE){
            return this.dir===DIR.DIR_LEFT?-this.defSlideSpe:this.defSlideSpe;
        }else{
            return this.dir===DIR.DIR_LEFT?-this.hDefSpe:this.hDefSpe;
        }
    },
    getVSpeed(){
        return this.vDefSpe;
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
                    this.flat(sizeOne);
                }else if(this.state===ENUM.HELMET_STATE.SLEEP){
                    sizeOne.x>this.node.x?this.dir=DIR.DIR_LEFT:this.dir=DIR.DIR_RIGHT;
                    this.fsm.switchState("slide");
                    EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
                }
            }
            //普通状态碰到蘑菇
            else{
                //踩到蘑菇
                if(sizeOne.y>=sizeTwo.y+sizeTwo.height/2){
                    actor.littleJump();
                    actor.node.y=sizeTwo.y+sizeTwo.height+1;
                    this.flat(sizeOne);
                }else if(this.state===ENUM.DUCK_STATE.SLEEP){
                    sizeOne.x>this.node.x?this.dir=DIR.DIR_LEFT:this.dir=DIR.DIR_RIGHT;
                    this.fsm.switchState("slide");
                    EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
                }else if(actor.getFormState()!==FORM_STATE.SMALL){
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
    turnRight(){
        this.node.scaleX=-1;
        this.dir=DIR.DIR_RIGHT;
    },
    turnLeft(){
        this.node.scaleX=1;
        this.dir=DIR.DIR_LEFT;
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
        this.hCurrSpeed=this.getHSpeed();
    },
    die(){
        this.fsm.switchState("topturn");
        EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
    },
    flat(sizeOne){
        switch(this.state){
            case ENUM.DUCK_STATE.SLIDE:
            case ENUM.DUCK_STATE.WALK:
            this.fsm.switchState("sleep");
            break;
            case ENUM.DUCK_STATE.SLEEP:
            sizeOne.x>this.node.x?this.dir=DIR.DIR_LEFT:this.dir=DIR.DIR_RIGHT;
            this.fsm.switchState("slide");
            break;
        }
        EM.emit(EM.type.SCORE_EFFECT,cc.v2(this.node.x,this.node.y+80),200);
    },
    onCollsiWithPBullet(bullet){
        bullet.die();
    },
    update (dt) {
        if(this.isPause)return;

        if(this.enableMove){
            this.backPos();

            this.move(dt);
    
            if(this.isOutScreen()){
                this.node.removeFromParent();
            }
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
                if(this.isOnLand){
                    this.isOnLand=false;
                    this.vCurrSpeed=this.getVSpeed();
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
    
            this.fsm.update(dt);

        }

    },
    collsiLeft(tile){
        this.changeDir();
        this.node.x=this.getSize().width/2+tile.node.x+40+1;
    },
    collsiRight(tile){
        this.changeDir();
        this.node.x=tile.node.x-this.getSize().width/2-1;
    },
    collsiDown(tile){
        if(this.isOnLand)return;
        let size=this.getSize();
        if((this.oldPos.y>=tile.node.y)
        &&((this.oldPos.x-size.width/2>=tile.node.x&&this.oldPos.x-size.width/2<=tile.node.x+40)
        ||(this.oldPos.x+size.width/2>=tile.node.x&&this.oldPos.x+size.width/2<=tile.node.x+40))){
            this.node.y=tile.node.y+40;
            this.isOnLand=true;
            this.vCurrSpeed=0;
            this.vCurrAcceleration=0;
        }
    },
    //与怪物的碰撞检测
    collsiWithMon(actor){
        if(this.isDie)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            if(actor.getActorType()===ENUM.MON_TYPE.ROCKET){
                return;
            }
            if(actor.getActorType()===ENUM.MON_TYPE.DUCK){
                if(this.state===ENUM.HELMET_STATE.SLIDE){
                    if(actor.state===ENUM.DUCK_STATE.SLIDE){
                        this.die();
                        actor.die();
                    }else{
                        if(!actor.isDie)actor.die();
                    }
                }else if(this.state===ENUM.HELMET_STATE.SLEEP){
                    if(actor.state===ENUM.DUCK_STATE.SLIDE){
                        this.die();
                    }else{
                        if(!actor.isDie)actor.changeDir();
                        this.node.x<actor.node.x?
                        actor.node.x=sizeTwo.x+sizeTwo.width/2+sizeOne.width/2+1:
                        actor.node.x=sizeTwo.x-sizeTwo.width/2-sizeOne.width/2-1;
                    }
                }else{
                    if(actor.state===ENUM.DUCK_STATE.SLIDE){
                        this.die();
                    }else{
                        if(!actor.isDie)actor.changeDir();
                        this.changeDir();
                        this.node.x>actor.node.x?
                        this.node.x=sizeOne.x+sizeOne.width/2+sizeTwo.width/2+1:
                        this.node.x=sizeOne.x-sizeOne.width/2-sizeTwo.width/2-1;
                    }
                }
            }
            else if(actor.getActorType()===ENUM.MON_TYPE.HELMET){
                if(this.state===ENUM.HELMET_STATE.SLIDE){
                    if(actor.state===ENUM.HELMET_STATE.SLIDE){
                        this.die();
                        actor.die();
                    }else{
                        if(!actor.isDie)actor.die();
                    }
                }else if(this.state===ENUM.HELMET_STATE.SLEEP){
                    if(actor.state===ENUM.HELMET_STATE.SLIDE){
                        this.die();
                    }else{
                        if(!actor.isDie)actor.changeDir();
                        this.node.x<actor.node.x?
                        actor.node.x=sizeTwo.x+sizeTwo.width/2+sizeOne.width/2+1:
                        actor.node.x=sizeTwo.x-sizeTwo.width/2-sizeOne.width/2-1;
                    }
                }else{
                    if(actor.state===ENUM.HELMET_STATE.SLIDE){
                        this.die();
                    }else{
                        if(!actor.isDie)actor.changeDir();
                        this.changeDir();
                        this.node.x>actor.node.x?
                        this.node.x=sizeOne.x+sizeOne.width/2+sizeTwo.width/2+1:
                        this.node.x=sizeOne.x-sizeOne.width/2-sizeTwo.width/2-1;
                    }
                }
            }
            else{
                if(this.state===ENUM.HELMET_STATE.SLIDE){
                    if(!actor.isDie)actor.die();
                }else if(this.state===ENUM.DUCK_STATE.SLEEP){
                    if(!actor.isDie)actor.changeDir();
                    this.node.x<actor.node.x?
                    actor.node.x=sizeTwo.x+sizeTwo.width/2+sizeOne.width/2+1:
                    actor.node.x=sizeTwo.x-sizeTwo.width/2-sizeOne.width/2-1;
                }else{
                    if(!actor.isDie)actor.changeDir();
                    this.changeDir();
                    this.node.x>actor.node.x?
                    this.node.x=sizeOne.x+sizeOne.width/2+sizeTwo.width/2+1:
                    this.node.x=sizeOne.x-sizeOne.width/2-sizeTwo.width/2-1;
                }
            }
        }
    }
});
