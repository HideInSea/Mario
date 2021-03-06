// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

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
        mushroom:cc.Prefab,
        flower:cc.Prefab,
        star:cc.Prefab,
        cirrus:cc.Prefab,
        ladder:cc.Prefab,
        story:cc.Prefab,
        aex:cc.Prefab,
        baby:cc.Prefab,
        spring:cc.Prefab,
        bubble:cc.Prefab,
        wheel:cc.Prefab,
        transition:cc.Prefab,
        roadCheck:cc.Prefab,
        princess:cc.Prefab,
        conditionTran:cc.Prefab,
        roadClear:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:
    init(){
        this.propObjs=utils.deepClone(gm.mapMgr.propLayer.getObjects());
    },
    resetObjects(){
        this.propObjs=utils.deepClone(gm.mapMgr.propLayer.getObjects());
    },
    onLoad () {
        EM.on(EM.type.CREATE_PROP,this.createProp,this);

        EM.on(EM.type.PAUSE_ACTOR,this.pauseActor,this);
        EM.on(EM.type.RESUME_ACTOR,this.resumeActor,this);
    },
    pauseActor(){
        let children=this.node.children;
        for(let i=0;i<children.length;i++){
            children[i].getComponent(children[i].name).pause();            
        }
    },
    resumeActor(){
        let children=this.node.children;
        for(let i=0;i<children.length;i++){
            children[i].getComponent(children[i].name).resume();            
        }
    },
    createProp(pos,propName){
        let args=propName.split("_");
        let prop=null;
        let script=null;
        switch(args[0]){
            case ENUM.PROP_TYPE.COIN:return;
            case ENUM.PROP_TYPE.MUSHROOM:
                if(globalMgr.getPlayerState()===FORM_STATE.SMALL||args[1]===ENUM.PROP_TYPE.LIFE){
                    prop=cc.instantiate(this.mushroom);
                    script=prop.getComponent("mush");
                }else{
                    prop=cc.instantiate(this.flower);
                    script=prop.getComponent("flower");
                }
            break;
            case ENUM.PROP_TYPE.STAR:
                prop=cc.instantiate(this.star);
                script=prop.getComponent("star");
            break;
            case ENUM.PROP_TYPE.CIRRUS:
                prop=cc.instantiate(this.cirrus);
                script=prop.getComponent("cirrus");
            break;
            case ENUM.PROP_TYPE.LADDER:
                prop=cc.instantiate(this.ladder);
                script=prop.getComponent("ladder");
            break;
            case ENUM.PROP_TYPE.STORY:
                prop=cc.instantiate(this.story);
                script=prop.getComponent("story");
            break;
            case ENUM.PROP_TYPE.AEX:
            prop=cc.instantiate(this.aex);
            script=prop.getComponent("aex");
            break;
            case ENUM.PROP_TYPE.BABY:
            prop=cc.instantiate(this.baby);
            script=prop.getComponent("baby");
            break;
            case ENUM.PROP_TYPE.SPRING:
            prop=cc.instantiate(this.spring);
            script=prop.getComponent("spring");
            break;
            case ENUM.PROP_TYPE.BUBBLE:
            prop=cc.instantiate(this.bubble);
            script=prop.getComponent("bubble");
            break;
            case ENUM.PROP_TYPE.WHEEL:
            prop=cc.instantiate(this.wheel);
            script=prop.getComponent("wheel");
            break;
            case ENUM.PROP_TYPE.TRANSITION:
            prop=cc.instantiate(this.transition);
            script=prop.getComponent("transition");
            break;
            case ENUM.PROP_TYPE.ROADCHECK:
            prop=cc.instantiate(this.roadCheck);
            script=prop.getComponent("roadCheck");
            break;
            case ENUM.PROP_TYPE.PRINCESS:
            prop=cc.instantiate(this.princess);
            script=prop.getComponent("princess");
            break;
            case ENUM.PROP_TYPE.CONDITIONTRAN:
            prop=cc.instantiate(this.conditionTran);
            script=prop.getComponent("conditionTran");
            break;
            case ENUM.PROP_TYPE.ROADCLEAR:
            prop=cc.instantiate(this.roadClear);
            script=prop.getComponent("roadClear");
            break;
        }
        this.node.addChild(prop);
        prop.setPosition(pos);
        script.init.apply(script,args);
    },

    collsition(){
        let children=this.node.children;
        for(let i=0;i<children.length;i++){
            children[i].getComponent(children[i].name).interactive(gm.playerScript);            
        }
    },
    collsiWithPushWall(wallBox){
        let children=this.node.children;
        for(let i=0;i<children.length;i++){
            children[i].getComponent(children[i].name).collsiWithPushWall(wallBox);            
        }
    },
    //遍历怪物对象组，找出出现在当前屏幕中的对象
    iteratorPropObjects(){
        for(let i=0;i<this.propObjs.length;i++){
            if(gm.mapMgr.isObjectInScreen(this.propObjs[i])){
                let obj=this.propObjs.splice(i,1);
                i--;
                let tPos=gm.mapMgr.toTiledPos(cc.v2(obj[0].x,obj[0].y));
                let pos=gm.mapMgr.tilePosToPos(tPos);
                this.createProp(cc.v2(pos.x+20,pos.y),obj[0].name);
            }
        }
    },
    collsitionWithBullet(){
        let children=this.node.children;
        for(let i=0;i<children.length;i++){
            let mon=children[i].getComponent(children[i].name);
            let pBullets=gm.bulletMgr.getPBullet();
            for(let j=0;j<pBullets.length;j++){
                mon.collsiWithPlayerBullet(pBullets[j].getComponent(pBullets[j].name));
            }
        }
    },
    collsitionWithMonster(){
        let children=this.node.children;
        let monster=gm.monsterMgr.getMonsters();
        for(let i=0;i<children.length;i++){
            let one=children[i].getComponent(children[i].name);
            for(let j=0;j<monster.length;j++){
                one.collsiWithMon(monster[j].getComponent(monster[j].name));
            }      
        }
    },
    update (dt) {

        //道具与玩家的碰撞检测
        this.collsition();

        //遍历道具对象组
        this.iteratorPropObjects();
        
        //与玩家子弹的碰撞检测
        this.collsitionWithBullet();

        //与怪物的碰撞检测
        this.collsitionWithMonster();
    },  
    onDestroy(){
        EM.off(EM.type.CREATE_PROP);

        EM.off(EM.type.PAUSE_ACTOR);
        EM.off(EM.type.RESUME_ACTOR);
    }
});
