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
var {MoveCmd}=require("aiCtrl");
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
        head:cc.Prefab,
        body:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    
    init(){
        this.isStart=true;
        this.isEnd=false;
        this.isAiCtrl=false;
        this.actorType=arguments[0];

        let desObj=gm.posMgr.posLayer.getObject("cirrusEnd_"+arguments[1]);
        let mapPos=gm.posMgr.objectPosToMapPos(cc.v2(desObj.x,desObj.y));
        //let screenPos=gm.mapMgr.mapPosToScreenPos(mapPos);
        this.desPos=cc.v2(mapPos.x+20,mapPos.y-80);
        this.desMapPos=cc.v2(-mapPos.x+40*parseInt(arguments[2])-320,gm.node.y);


        this.length=6;
        this.head=cc.instantiate(this.head);
        this.head.y=0;
        this.node.addChild(this.head);
        this.bodys=[];
        this.bodys.push(this.head);
        for(let i=0;i<this.length;i++){
            let body=cc.instantiate(this.body);
            this.bodys.push(body);
            this.node.addChild(body);
        }

        let moveUp=cc.moveBy(4,cc.v2(0,this.length*40));
        this.head.runAction(moveUp);
    },
    update (dt) {
        for(let i=1;i<this.bodys.length;i++){
            if(this.bodys[i-1].y>38)this.bodys[i].y=this.bodys[i-1].y-39;
            else break;
        }

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    reBorth(){
        for(let value of this.bodys){
            value.y=0;
        }
        let moveUp=cc.moveBy(3,cc.v2(0,this.length*40));
        this.head.runAction(moveUp);
    },
    getSize(){
        let x=this.node.x;
        let y=this.node.y;
        let width=10;
        let height=this.head.y+40;
        return cc.rect(x,y,width,height);
    },
    interactive(actor){
        if(actor.isDie)return;
        let sizeOne=actor.getSize();
        let sizeTwo=this.getSize();
        if(this.actorCollsition(sizeOne,sizeTwo)){
            if(actor.isOnCirrus){
                if(this.isStart){
                    if(sizeOne.y>sizeTwo.y+this.length*40&&this.isAiCtrl){
                        gm.playerScript.aiCtrl.addCmd(new MoveCmd(gm.playerScript,cc.macro.KEY.w,"keyup")); 
                        gm.playerScript.enableCollsi=false;
                        this.node.stopAllActions();
                        this.isStart=false;

                        let fadeOut=cc.fadeOut(0.05);
                        let fadeIn=cc.fadeIn(0.05);
                        let delay=cc.delayTime(0.2);
                        gm.node.runAction(cc.sequence(fadeOut,cc.callFunc(function(){
                            let offset=this.node.x-gm.playerScript.node.x;
                            gm.posMgr.setMapToPos(this.desMapPos);
                            this.node.setPosition(this.desPos);
                            gm.playerScript.node.setPosition(cc.v2(this.node.x-offset,this.node.y));
                            
                        },this),delay,cc.callFunc(function(){
                            this.reBorth();
                            setTimeout(function(){
                                gm.playerScript.aiCtrl.addCmd(new MoveCmd(gm.playerScript,cc.macro.KEY.w,"keydown")); 
                            },2000);
                            this.isEnd=true;
                        },this),fadeIn));        

                    }else if(sizeOne.y>sizeTwo.y+4*40&&!this.isAiCtrl){
                        this.isAiCtrl=true;
                        gm.playerScript.enableInput=false;
                        gm.playerScript.releaseAllKey();          
                        gm.playerScript.aiCtrl.addCmd(new MoveCmd(gm.playerScript,cc.macro.KEY.w,"keydown"));  
                    }
                }else if(this.isEnd){
                        if(sizeOne.y>sizeTwo.y+5*40&&this.isAiCtrl){
                            this.isAiCtrl=false;
                            gm.playerScript.enableCollsi=true;
                            //gm.playerScript.releaseAllKey();
                            gm.playerScript.aiCtrl.addCmd(new MoveCmd(gm.playerScript,cc.macro.KEY.w,"keyup")); 
                            gm.playerScript.enableInput=true; 
                        }else if(sizeOne.y<sizeTwo.y+4*40&&!this.isAiCtrl){
                            actor.node.y=sizeTwo.y+2*40;
                            actor.isTouchLand=true;
                        }
                }
            }else{
                actor.isOnCirrus=true;
                actor.isLeftOrRight()?
                (actor.turnLeft(),actor.node.x=this.node.x+10):
                (actor.turnRight(),actor.node.x=this.node.x-10);
                actor.fsm.switchState("climb");
            }
        }
    }
});
