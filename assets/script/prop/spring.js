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
        red:cc.SpriteFrame,
        gray:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:
    init(){
        this.color=arguments[1];
        let sprite=this.node.getComponent(cc.Sprite);
        switch(this.color){
            case ENUM.PROP_COLOR.RED:
                sprite.spriteFrame=this.red;
            break;
            case ENUM.PROP_COLOR.GRAY:
                sprite.spriteFrame=this.gray;
            break;
        }
        this.animation=this.node.getComponent(cc.Animation);
        this.isOnSpring=false;
    },
    spring(){
        this.isOnSpring=false;

        let size=this.getSize();
        gm.currPlayer.y=size.y+size.height;

        if(gm.playerScript.isKPressed){
            gm.playerScript.vCurrAcceleration=gm.playerScript.vMaxAcceleration;
            gm.playerScript.vCurrSpeed=1800;
        }else{
            gm.playerScript.vCurrAcceleration=gm.playerScript.vMaxAcceleration;
            gm.playerScript.vCurrSpeed=1000;
        }
    },
    getSize(){
        let size=this.node.getContentSize();
        return cc.rect(this.node.x,this.node.y,size.width,size.height);
    },
    interactive(actor){
        if(actor.isDie||this.isOnSpring)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            //向下碰撞
            if((actor.oldPos.y>this.node.y+sizeTwo.height)
            &&((actor.oldPos.x-sizeOne.width/2>this.node.x-sizeTwo.width/2&&actor.oldPos.x-sizeOne.width/2<this.node.x+sizeTwo.width/2)
            ||(actor.oldPos.x+sizeOne.width/2>this.node.x-sizeTwo.width/2&&actor.oldPos.x+sizeOne.width/2<this.node.x+sizeTwo.width/2))){
                if(actor.playerState!==PLAYER_STATE.FALL){    
                    actor.fsm.switchState("fall");
                }
                this.isOnSpring=true;
                actor.vCurrSpeed=0;
                actor.vCurrAcceleration=0;
                this.playSpringAni();
                gm.currPlayer.y=sizeTwo.y+sizeTwo.height;
                return;
            }

            //向左
            if(this.node.x>actor.node.x&&actor.node.y<this.node.y+sizeTwo.height&&actor.node.y>=this.node.y){
                actor.hCurrSpeed=0;
                actor.node.x=this.node.x-sizeTwo.width/2-sizeOne.width/2;
            }   
            //向右
            else if(this.node.x<actor.node.x&&actor.node.y<this.node.y+sizeTwo.height&&actor.node.y>=this.node.y){
                actor.node.x=this.node.x+sizeTwo.width/2+sizeOne.width/2;
                actor.hCurrSpeed=0;
            }           
        }
    },
    collsiWithMon(actor){
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            if(actor.getActorType()===ENUM.MON_TYPE.ROCKET)return;
            actor.changeDir();
            if(sizeOne.x>this.node.x){
                actor.node.x=this.node.x+sizeTwo.width/2+sizeOne.width/2;
            }else{
                actor.node.x=this.node.x-sizeTwo.width/2-sizeOne.width/2;
            }
        }
    },
    onCollsiWithPBullet(bullet){
        bullet.die();
    },
    // onLoad () {},    

    update (dt) {
        if(this.isOutScreen()){
            this.node.removeFromParent();
        }

        if(this.isOnSpring){
            let size=this.getSize();
            gm.currPlayer.y=size.y+size.height;
        }
    },
    playSpringAni(){
        switch(this.color){
            case ENUM.PROP_COLOR.GRAY:
            this.animation.play("spring_gray");
            break;
            case ENUM.PROP_COLOR.RED:
            this.animation.play("spring_red");
            break;
        }
    }
});
