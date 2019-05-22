// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var FSM=require("FSM");
var {Stand,Jump,Walk,Slide,Squat,Fire,Fall,Swim,Float,ToBig,ToSmall,FlashCatchMonster,FlashCatchFlower,FlashCatchStar,Die,Climb}=require("playerState");
var Actor=require("actor");
var {AiCtrl,MoveCmd}=require("aiCtrl");
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
        //垂直方向的变量
        vMaxAcceleration:-3800,                   //最大加速度
        vMinAcceleration:-1320,                   //最小加速度
 
        vOrignSpeed:660,                        //跳跃初始速度
        vSpeOrignSpeed:744,                     //加速时的初始速度

        vFallMaxSpeed:-600,
        //水中
        vWaterMinAcceleration:-750,
        vWaterOrignSpeed:300,

        //水平方向的变量

        hCurrMaxSpeed:0,                      //当前速度限制（马里奥按下加速键时，速度上限会提升，当前加速度也会提升）
        hNorAcceleration:250,                   //正常情况下的加速度
        hNorMaxSpeed:220,                       //正常下的速度限制
        hNorSlowAcceleration:-500,               //正常下的减速加速度
        hSpeAcceleration:640,                   //加速下的加速度
        hSpeMaxSpeed:320,                       //加速下的速度限制
        hSpeSlowAcceleration:-850,                //加速下的减速加速度
        hWaterAcceleration:220,
        hWaterMaxSpeed:160,
        hWaterSlowSpeed:-100,

        flashAtlas:{
            type:cc.SpriteAtlas,
            default:[]
        },
        behind:cc.Node,
        front:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    init() {
        this.roadCheck=0;                                   //正确路线的条数
        
        this.dir=DIR.DIR_RIGHT;                              //方向
        this.playerState=PLAYER_STATE.STAND;                //玩家状态
        this.formState=globalMgr.getPlayerState();                    //形态
        this.isOnWater=false;   
        this.isInvincible=false;                            //是否无敌
        this.isFlashing=false;                              //是否闪烁（得到星星
        this.isOnLand=true;
        this.enableInput=true;

        this.isKPressed=false;
        this.isAPressed=false;
        this.isDPressed=false;
        this.isSPressed=false;
        this.isJPressed=false;
        this.isWPressed=false;
        this.oldPos=this.node.position;
        this.isDie=false;
        this.isTouchLand=false;
        this.isOnCirrus=false;                             //是否在藤蔓上
        this.isCollsiFlag=false;                            //是否碰到旗帜
        this.isOnLadder=false;
        this.animation=this.behind.getComponent(cc.Animation);
        this.aiCtrl=new AiCtrl();

        this.fsm=new FSM();
        this.fsm.addState(new Stand(this,"stand"));
        this.fsm.addState(new Jump(this,"jump"));
        this.fsm.addState(new Walk(this,"walk"));
        this.fsm.addState(new Slide(this,"slide"));
        this.fsm.addState(new Squat(this,"squat"));
        this.fsm.addState(new Fire(this,"fire"));
        this.fsm.addState(new Fall(this,"fall"));
        this.fsm.addState(new Swim(this,"swim"));
        this.fsm.addState(new Float(this,"float"));
        this.fsm.addState(new ToBig(this,"to_big"));
        this.fsm.addState(new ToSmall(this,"to_small"));
        this.fsm.addState(new Die(this,"die"));
        this.fsm.addState(new Climb(this,"climb"));
        this.fsm.addState(new FlashCatchMonster(this,"flash_catch_monster"));
        this.fsm.addState(new FlashCatchFlower(this,"flash_catch_flower"));
        this.fsm.addState(new FlashCatchStar(this,"flash_catch_star"));
        this.fsm.setDefaultState("stand");

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

        EM.on(EM.type.FLAG_TOUCH_LAND,this.flagTouchLand,this);
    },
    releaseAllKey(){
        this.isKPressed=false;
        this.isAPressed=false;
        this.isDPressed=false;
        this.isSPressed=false;
        this.isJPressed=false;
        this.isWPressed=false;
    },
    flagTouchLand(){
        //this.enableInput=true;
        this.aiCtrl.addCmd(new MoveCmd(this,cc.macro.KEY.d,"keydown"));
        this.aiCtrl.addCmd(new MoveCmd(this,cc.macro.KEY.d,"keyup"));
        this.aiCtrl.addCmd(new MoveCmd(this,cc.macro.KEY.d,"keydown"));
        this.aiCtrl.addCmd(new MoveCmd(this,cc.macro.KEY.j,"keyup"));
    },
    getFirePos(){
        let x=0;
        let y=this.node.y+50;
        this.dir===DIR.DIR_RIGHT?x=this.node.x+20:x=this.node.x-20;
        return cc.v2(x,y);
    },
    setDir(dir){
        this.dir=dir;
    },
    setPlayerState(state){
        this.playerState=state;
    },
    setFormState(state){
        this.formState=state;
        EM.emit(EM.type.CHANGE_STATE,state);
    },
    getDir(){
        return this.dir;
    },
    getPlayerState(){
        return this.playerState;
    },
    getFormState(){
        return this.formState;
    },
    getSize(){
        let size=this.behind.getContentSize();
        let width=this.hCurrSpeed>=this.hSpeMaxSpeed?size.width:size.width-14;
        return cc.rect(this.node.x,this.node.y,width,size.height-4);
    },
    getDie(){
        return this.isDie;
    },
    onKeyDown(event){
        //cc.log(event);   
        if(!this.enableInput)return;

        this.fsm.handleInput(event);

        if(event.keyCode===cc.macro.KEY.d){
            this.isDPressed=true;
        }else if(event.keyCode===cc.macro.KEY.a){
            this.isAPressed=true;
        }else if(event.keyCode===cc.macro.KEY.k){
            this.isKPressed=true;
        }else if(event.keyCode===cc.macro.KEY.s){
            this.isSPressed=true;
        }else if(event.keyCode===cc.macro.KEY.j){
            this.isJPressed=true;
        }
    },

    onKeyUp(event){
        //cc.log(event);
        if(!this.enableInput)return;
        this.fsm.handleInput(event);

        if(event.keyCode===cc.macro.KEY.d){
            this.isDPressed=false;
        }else if(event.keyCode===cc.macro.KEY.a){
            this.isAPressed=false;
        }else if(event.keyCode===cc.macro.KEY.k){
            this.isKPressed=false;
        }else if(event.keyCode===cc.macro.KEY.s){
            this.isSPressed=false;
        }else if(event.keyCode===cc.macro.KEY.j){
            this.isJPressed=false;
        }
    },

    start () {

    },

    update (dt) {

        if(this.isPlayerOnWater()){
            if(!this.isOnWater){
                this.isOnWater=true;
                this.schedule(this.bubble,1.5);
            }
        }else if(this.isOnWater){
            this.isOnWater=false;
            this.unschedule(this.bubble);
        }

        
        if(this.isPause)return;

        if(this.enableMove){
            this.backPos();
        
            this.move(dt);
    
            //限制垂直方向下的速度
            if(this.vCurrSpeed<this.vFallMaxSpeed){
                this.vCurrSpeed=this.vFallMaxSpeed;
            }
    
            //限制水平方向的速度
            if(Math.abs(this.hCurrSpeed)>this.hCurrMaxSpeed){
                this.hCurrSpeed=this.hCurrMaxSpeed*(this.hCurrSpeed/Math.abs(this.hCurrSpeed));
            }
    
            //检测是否超过屏幕上下边界
            if(this.node.y<-120||this.node.y>760){
                this.isDie=true;
                setTimeout(function(){
                    //游戏结束
                    EM.emit(EM.type.ADD_LIFE,-1);
                    EM.emit(EM.type.GAME_OVER);
                }.bind(this),2000);
                this.node.removeFromParent();
                EM.emit(EM.type.STOP_READTIME);
                return;
            }
        }

        if(this.enableCollsi){
        //与墙体的碰撞检测
        let tile=this.getUpCollsiTile();
        if(tile.type){
            cc.log(tile.type);
            switch(tile.type){
                case TILE_TYPE.LAND:
                case TILE_TYPE.PIPE_H_ENTRY:
                case TILE_TYPE.PIPE_V_ENTRY:
                    this.collsiTop(tile.tile);
                break;

                case TILE_TYPE.WALL:
                    this.collsiTop(tile.tile);
                    gm.mapMgr.pushWall(tile.tile);
                break;

                case TILE_TYPE.QUESTION:
                    this.collsiTop(tile.tile);
                    gm.mapMgr.pushQuestion(tile.tile);
                break;

                case TILE_TYPE.HIDE_QUESTION:
                    if(!this.isUpOrDown())break;
                    this.collsiTop(tile.tile);
                    gm.mapMgr.pushHideQuestion(tile.tile);
                break;

                case TILE_TYPE.COIN:
                    gm.mapMgr.collsiCoin(tile.tile);
                break;
            }
        }

        //脚底的碰撞检测
        tile=this.getDownCollsiTile();
        if(tile.type){
            //cc.log(tile.type);
            switch(tile.type){
                case TILE_TYPE.LAND:
                case TILE_TYPE.PIPE_H_ENTRY:
                case TILE_TYPE.WALL:
                    this.collsiDown(tile.tile);
                break;

                case TILE_TYPE.PIPE_V_ENTRY:
                    this.vPipeEntry(tile.tile);
                break;

                case TILE_TYPE.QUESTION:
                    this.collsiDown(tile.tile);
                break;

                case TILE_TYPE.COIN:
                    gm.mapMgr.collsiCoin(tile.tile);
                break;
 
                case TILE_TYPE.FLAG:
                    this.collsiFlag(tile.tile);
                break;
            }
        }else{
            if(this.isOnLand&&!this.isOnLadder){
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
                    this.collsiRight(tile.tile);
                break;

                case TILE_TYPE.PIPE_H_ENTRY:
                    this.hPipeEntry(tile.tile);
                break;

                case TILE_TYPE.COIN:
                    gm.mapMgr.collsiCoin(tile.tile);
                break;
                case TILE_TYPE.FLAG:
                    this.collsiFlag(tile.tile);
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
                    this.collsiLeft(tile.tile);
                break;

                case TILE_TYPE.PIPE_H_ENTRY:
                    //this.hPipeEntry(tile.tile);
                break;

                case TILE_TYPE.COIN:
                    gm.mapMgr.collsiCoin(tile.tile);
                break;
                case TILE_TYPE.FLAG:
                    this.collsiFlag(tile.tile);
                break;
            }
        }
        this.aiCtrl.update(dt);
        this.fsm.update(dt);
        }
    },
    collsiDown(tile){
        let size=this.getSize();
        if(!this.isOnLand){
            if((this.oldPos.y>=tile.node.y)
            &&((this.oldPos.x-size.width/2>=tile.node.x&&this.oldPos.x-size.width/2<=tile.node.x+40)
            ||(this.oldPos.x+size.width/2>=tile.node.x&&this.oldPos.x+size.width/2<=tile.node.x+40))){
                if(this.playerState!==PLAYER_STATE.CLIMB){    
                    this.isOnLand=true;
                }
                this.isTouchLand=true;
                this.node.y=tile.node.y+40;
                this.vCurrSpeed=0;
                this.vCurrAcceleration=0;
            }
        }
    },
    hPipeEntry(tile){
        let posType=gm.mapMgr.getObjectAt(gm.posMgr.posObjects,cc.v2(tile.x,tile.y));
        if(posType){
            if(this.playerState!==PLAYER_STATE.WALK){
                this.fsm.switchState("walk");
            }
            this.isPause=true;
            this.enableInput=false;
            this.releaseAllKey();
            gm.posMgr.hPipeEntry(posType,cc.v2(tile.node.x+20,tile.node.y));
        }else{
            this.collsiRight(tile);
        }
    },
    vPipeEntry(tile){
        let posType=gm.mapMgr.getObjectAt(gm.posMgr.posObjects,cc.v2(tile.x,tile.y));
        if(posType&&this.node.x>tile.node.x+20&&this.isSPressed){
            this.isPause=true;
            this.enableInput=false;
            this.releaseAllKey();
            gm.posMgr.vPipeEntry(posType,cc.v2(tile.node.x+20,tile.node.y));
        }else{
            this.collsiDown(tile);
        }
    },
    collsiLeft(tile){
        if(this.dir===DIR.DIR_LEFT)this.hCurrSpeed=0;
        this.node.x=this.getSize().width/2+tile.node.x+40+1;
        gm.fixOffset(this.node.position);
    },
    collsiRight(tile){
        if(this.dir===DIR.DIR_RIGHT)this.hCurrSpeed=0;
        this.node.x=tile.node.x-this.getSize().width/2-1; 
    },
    collsiTop(tile){
        this.vCurrSpeed=0;
        this.node.y=tile.node.y-this.getSize().size.height-1;
    },
    collsiFlag(tile){
        if(this.isOnCirrus)return;
        let sizeOne=cc.rect(tile.node.x+20,tile.node.y,10,40);
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            this.isOnCirrus=true;
            this.isCollsiFlag=true;
            this.enableInput=false;
            this.node.x=sizeOne.x-10;
            this.releaseAllKey();
            this.fsm.switchState("climb");            
            this.aiCtrl.addCmd(new MoveCmd(this,cc.macro.KEY.s,"keydown"));      
            EM.emit(EM.type.COLLSI_FLAG);
        }
    },
    isUpOrDown(){
        return this.vCurrSpeed>0?true:false;
    },
    isLeftOrRight(){
        return this.hCurrSpeed>0?false:true;
    },
    //小跳（踩到怪物
    littleJump(){
        this.vCurrSpeed=600;
    },
    fire(){
        if(!gm.bulletMgr.enableFire())return;
        let pos=this.getFirePos();
        EM.emit(EM.type.CREATE_P_BULLET,pos,this.dir);
        this.fsm.switchStateWithStack("fire");
    },
    onDestroy(){
        EM.off(EM.type.FLAG_TOUCH_LAND);
    },
    pause(){
        this.animation.pause();
        this.isPause=true;
    },
    resume(){
        this.isPause=false;
        this.animation.resume();
    },
    getCenterPos(){
        let size=this.behind.getContentSize();
        return cc.v2(this.node.x,this.node.y+size.height/2);
    },
    //检测人物是否在水中
    isPlayerOnWater(){
        if(!gm.mapMgr.waterLayer)return false;
        let tilePos=gm.mapMgr.toTiledPos(this.getCenterPos());
        if(tilePos.x<0||tilePos.x>=gm.mapMgr.mapSize.width||tilePos.y<0||tilePos.y>=gm.mapMgr.mapSize.height)return;
        let gid=gm.mapMgr.waterLayer.getTileGIDAt(tilePos);
        return gid?true:false;
    },
    bubble(){
        let size=this.getSize();
        EM.emit(EM.type.CREATE_PROP,cc.v2(size.x,size.y+size.height),"bubble");
    }
});
