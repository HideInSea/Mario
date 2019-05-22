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
    init(){
        this.count=0;
        this.isPause=false;
        this.animation=this.node.getComponent(cc.Animation);
        this.isEnd=false;
        this.dir=DIR.DIR_LEFT;
        let moveLeft=cc.moveBy(2,cc.v2(-40,0));
        this.node.runAction(cc.repeatForever(moveLeft));
        let rightObj=gm.posMgr.posLayer.getObject("shootEnd");
        this.endPos=gm.posMgr.objectPosToMapPos(cc.v2(rightObj.x,rightObj.y));

        this.schedule(this.shootMon,3);

        EM.on(EM.type.HEDGEHOG_DIE,function(){
            if(this.count===3){
                this.schedule(this.shootMon,3);
            }
            this.count--;
        },this);
    },
    shootMon(){
        if(this.count>=3){
            this.unschedule(this.shootMon);
            return;
        }
        this.animation.play("shoot");
    },
    shoot(){
        this.count++;
        EM.emit(EM.type.CREATE_MONSTER,this.getShootPos(),"hedgehog");
    },
    getSize(){
        let size=this.node.getContentSize();
        let height=size.height-4;
        let width=size.width-4;
        return cc.rect(this.node.x,this.node.y,width,height);
    },
    getShootPos(){
        let size=this.node.getContentSize();
        return cc.v2(this.node.x,this.node.y+size.height);
    },
    turnRight(){
        this.dir=DIR.DIR_RIGHT;
        this.node.scaleY=-1;
    },
    turnLeft(){
        this.dir=DIR.DIR_LEFT;
        this.node.scaleY=1;
    },
    update (dt) {
        if(this.isPause||this.isEnd)return;

        if(this.isOutScreen()){
            this.node.removeFromParent();
            return;
        }

        //是否到达终点
        if(this.node.x>this.endPos.x){
            this.unschedule(this.shootMon);
            this.hCurrSpeed=0;
            this.isEnd=true;
            return;
        }

        //改变方向
        if(this.node.x>gm.currPlayer.x&&this.dir===DIR.DIR_RIGHT){
            this.turnLeft();
        }else if(this.node.x<gm.currPlayer.x&&this.dir===DIR.DIR_LEFT){
            this.turnRight();
        }

        if(gm.playerScript.isLeftOrRight()){
            this.hCurrSpeed=0;
        }else{
            this.hCurrSpeed=350;
        }


        this.move(dt);


        //与左边界的碰撞检测  //与右边界的碰撞检测
        let worldPos=this.node.parent.convertToWorldSpace(this.node.position);
        let localPos=this.node.parent.convertToNodeSpace(cc.v2(0,0));
        if(worldPos.x<40){
            this.node.x=localPos.x+40;
        }else if(worldPos.x>600){
            this.node.x=localPos.x+600;
        }
      

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
                //踩到蘑菇
                if(sizeOne.y>=sizeTwo.y+sizeTwo.height/2&&!actor.isUpOrDown()){
                    actor.littleJump();
                    this.die();
                }
            }
            //普通状态碰到蘑菇
            else{
                //踩到蘑菇
                if(sizeOne.y>=sizeTwo.y+sizeTwo.height/2){
                    actor.littleJump();
                    this.die();
                }else if(actor.getFormState()!==FORM_STATE.SMALL){
                    actor.fsm.switchStateWithStack("to_small");
                }else{
                    actor.fsm.switchState("die");
                }
            }
        }
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
    onCollsiWithPBullet(bullet){
        bullet.die();
        this.die();
    },
    pause(){
        this.isPause=true;
        this.animation.pause();
    },
    resume(){
        this.isPause=false;
        this.animation.resume();
    },
    onDestroy(){
        EM.off(EM.type.HEDGEHOG_DIE);
    }
});
