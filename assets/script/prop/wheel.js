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
        left:cc.Node,
        right:cc.Node,
        white:cc.SpriteFrame,
        red:cc.SpriteFrame,
        ladder:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(){
        this.actorType=arguments[0];
        this.color=arguments[1]
        this.type=arguments[2];
        this.isPause=false;
        this.leftOldPos=null;
        this.rightOldPos=null;
        this.isDroping=false;

        let rightObj=gm.posMgr.posLayer.getObject("wheelEnd_"+arguments[3]);
        let mapPos=gm.posMgr.objectPosToMapPos(cc.v2(rightObj.x,rightObj.y));

        this.leftHeight=parseInt(arguments[4])*40;
        this.rightHeight=parseInt(arguments[5])*40;
        this.totalHeight=this.leftHeight+this.rightHeight;
        this.leftPos=this.node.position;
        this.rightPos=cc.v2(mapPos.x+20,mapPos.y);
        this.right.x=this.rightPos.x-this.node.x;

        let args=["ladder",this.type,"stop"];

        this.leftLadder=cc.instantiate(this.ladder);
        gm.propMgr.node.addChild(this.leftLadder);
        this.leftLadder.setPosition(cc.v2(this.leftPos.x,this.leftPos.y-this.leftHeight));
        this.leftScript=this.leftLadder.getComponent(this.leftLadder.name);
        this.leftScript.init.apply(this.leftScript,args);

        this.rightLadder=cc.instantiate(this.ladder);
        gm.propMgr.node.addChild(this.rightLadder);
        this.rightLadder.setPosition(cc.v2(this.rightPos.x,this.rightPos.y-this.rightHeight));
        this.rightScript=this.rightLadder.getComponent(this.rightLadder.name);
        this.rightScript.init.apply(this.rightScript,args);

        if(this.color===ENUM.PROP_COLOR.WHITE){
            this.left.getComponent(cc.Sprite).spriteFrame=this.white;
            this.right.getComponent(cc.Sprite).spriteFrame=this.white;
        }else{
            this.left.getComponent(cc.Sprite).spriteFrame=this.red;
            this.right.getComponent(cc.Sprite).spriteFrame=this.red;
        }

        this.backLadderPos();
        this.fixRole();
    },
    fixRole(){
        this.left.scaleY=(this.node.y-this.leftLadder.y)/40;
        this.right.scaleY=(this.node.y-this.rightLadder.y)/40;
    },
    fixHeight(){
        let leftOffset=this.leftLadder.y-this.leftOldPos.y;
        let rightOffset=this.rightLadder.y-this.rightOldPos.y;
        if(leftOffset!=0){
            this.rightLadder.y-=leftOffset;
        }else if(rightOffset!=0){
            this.leftLadder.y-=rightOffset;
        }
    },
    getSize(){
        return cc.rect(0,0,0,0);
    },  
    dropLadder(){

    },
    backLadderPos(){
        this.leftOldPos=this.leftLadder.position;
        this.rightOldPos=this.rightLadder.position;
    },
    update (dt) {
        if(this.isPause)return;
      
        if(this.isDropLadder()&&!this.isDroping){
            this.dropLadder();
            this.isDroping=true;
        }

        if(this.isDroping){
            this.leftScript.vCurrAcceleration=-1300;
            this.rightScript.vCurrAcceleration=-1300;

        }else{
            this.fixHeight();

            this.fixRole();
    
            this.backLadderPos();
        }

        if(this.isOutScreen()){
            this.node.removeFromParent();
        }
    },
    pause(){

    },
    resume(){

    },
    interactive(actor){
        if(actor.isDie)return;

    },
    isOutScreen(){
        let pos=this.node.convertToWorldSpace(cc.v2(0,0));
        if(pos.x>global.winSize.width+80||pos.x<-40*10||pos.y<-120||pos.y>global.winSize.height+80){
            return true;
        }
        return false;
    },
    isDropLadder(){
        //检测梯子是否落下
        let leftSize=this.leftScript.getSize();
        let rightSize=this.leftScript.getSize();
        if(this.leftLadder.y+leftSize.height>this.node.y){
            this.leftLadder.y=this.node.y-leftSize.height;
            return true;
        }else if(this.rightLadder.y+rightSize.height>this.node.y){
            this.rightLadder.y=this.node.y-rightSize.height;
            return true;
        }
        return false;
    }
});
