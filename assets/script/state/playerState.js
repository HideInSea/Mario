/*
 * @Description:马里奥所有状态
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-02 11:27:38
 * @LastEditTime: 2019-03-30 17:46:49
 */
var State=require("state");

//站立状态
var Stand=cc.Class({
    extends:State,
    handleInput(input){
        //按下k键跳跃
        if(input.keyCode===cc.macro.KEY.k){
            if(input.type==="keydown"){
                if(!this.target.isKPressed){
                    this.target.isKPressed=true;
                    if(this.target.isOnWater){
                        this._fsm.switchState("swim");
                    }else{
                        this._fsm.switchState("jump");
                    }
                    return;
                }
            }else{
                this.target.isKPressed=false;
            }
        }

        //按下a向左走
        if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    //this.target.setDir(DIR.DIR_LEFT);
                    this.target.turnLeft();
                    this._fsm.switchState("walk");
                    return;
                }
            }else{
                this.target.isAPressed=false;
            }
        }

        //按下d向右走
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    //this.target.setDir(DIR.DIR_RIGHT);
                    this.target.turnRight();
                    this._fsm.switchState("walk");
                    return;
                }
            }else{
                this.target.isDPressed=false;
            }
        }


        //s下蹲
        if(input.keyCode===cc.macro.KEY.s){
            if(input.type==="keydown"){
                if(!this.target.isSPressed){
                    this.target.isSPressed=true;
                    if(this.target.getFormState()!==FORM_STATE.SMALL){
                        this._fsm.switchState("squat");
                        return;
                    }   
                }
            }else{
                this.target.isSPressed=false;
            }
        }

        //j键加速
        if(input.keyCode===cc.macro.KEY.j){
            if(input.type==="keydown"){
                if(!this.target.isJPressed){
                    this.target.isJPressed=true; 
                    if(this.target.getFormState()===FORM_STATE.FIRE){
                        this.target.fire();
                        return;
                    } 
                }
            }else{
                this.target.isJPressed=false;
            }
        }
    },
    onEnter(){
        this.target.setPlayerState(PLAYER_STATE.STAND);
        this.target.hCurrAcceleration=0;
        this.target.hCurrSpeed=0;
        this.target.vCurrAcceleration=0;
        this.target.vCurrSpeed=0;
        this.playStandAni();
    },
    resume(){
        this.onEnter();
    },
    playStandAni(){
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:this.target.animation.play("small_stand");break;
            case FORM_STATE.BIG:this.target.animation.play("big_stand");break;
            case FORM_STATE.FIRE:this.target.animation.play("fire_stand");break;
            default:break;
        }
    },
    //进入fall
    checkFallTransition(){
        return !this.target.isOnLand;
    },
    update(dt){
        if(this.checkFallTransition()){
            this._fsm.switchState("fall");
            return;
        }
    }
});

//跳跃状态
var Jump=cc.Class({
    extends:State,
    ctor(){
        this.orignDir=null;
    },
    handleInput(input){
        //按下k键
        if(input.keyCode===cc.macro.KEY.k){
            if(input.type==="keyup"){
                this.target.isKPressed=false;
                this.target.vCurrAcceleration=this.target.vMaxAcceleration;
            }else{
                if(!this.target.isKPressed){
                    this.target.isKPressed=true;
                }
            }
        }
        //按下d键
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    this.target.hCurrAcceleration=this.getAcceleration();
                }
            }else if(input.type==="keyup"){
                this.target.isDPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
            } 
        }
        //按下a键
        else if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    this.target.hCurrAcceleration=this.getAcceleration();
                }
            }else if(input.type==="keyup"){
                this.target.isAPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
            }
        }
        //j键加速/发射子弹
        if(input.keyCode===cc.macro.KEY.j){
            if(input.type==="keydown"){
                if(!this.target.isJPressed){
                    this.target.isJPressed=true; 
                    if(this.target.getFormState()===FORM_STATE.FIRE){
                        this.target.fire();
                        return;
                    } 
                }
            }else{
                this.target.isJPressed=false;
            }
        }
    },
    update(dt){
        // if(Math.abs(this.target.vCurrSpeed)>this.target.vMaxSpeed){
        //     this.target.vCurrAcceleration=0;
        //     this.target.vCurrSpeed=this.target.vMaxSpeed*(Math.abs(this.target.vCurrSpeed)/this.target.vCurrSpeed);
        // }

        // if(Math.abs(this.target.hCurrSpeed)>this.target.hCurrMaxSpeed){
        //     this.target.hCurrSpeed=this.target.hCurrMaxSpeed*(this.target.hCurrSpeed/Math.abs(this.target.hCurrSpeed));
        //     this.target.hCurrAcceleration=0;
        // }

        if(this.checkStandTransition()){          
            this._fsm.switchState("stand");
            return;
        }

        if(this.checkSlideTransition()){
            this._fsm.switchState("slide");
            return;
        }

        if(this.checkWalkTransition()){
            this._fsm.switchState("walk");
            return;
        }

        if(this.checkHStop()){
            this.target.hCurrSpeed=0;
            this.target.hCurrAcceleration=0;
        }
    },
    onEnter(isReserveSpeed){
        this.target.setPlayerState(PLAYER_STATE.JUMP);
        this.target.isOnLand=false;
        this.playJumpAni();
        this.target.vCurrAcceleration=this.target.vMinAcceleration;
        if(!isReserveSpeed){
            this.target.vCurrSpeed=Math.abs(this.target.hCurrSpeed)>=this.target.hSpeMaxSpeed?this.target.vSpeOrignSpeed:this.target.vOrignSpeed;
        }
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.hCurrMaxSpeed=this.getMaxSpeed();
    },
    onExit(){
        this.target.vCurrAcceleration=0;
        this.target.vCurrSpeed=0;
        if(this.target.isAPressed){
            this.target.turnLeft();
        }else if(this.target.isDPressed){
            this.target.turnRight();
        }
    },
    playJumpAni(){
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:this.target.animation.play("small_jump");break;
            case FORM_STATE.BIG:this.target.animation.play("big_jump");break;
            case FORM_STATE.FIRE:this.target.animation.play("fire_jump");break;
            default:break;
        }
    },
    getAcceleration(){
        if(this.target.isAPressed){
            return -this.target.hNorAcceleration;
        }else if(this.target.isDPressed){
            return this.target.hNorAcceleration;
        }else if(this.target.hCurrSpeed<0){
            return -this.target.hNorSlowAcceleration;
        }else if(this.target.hCurrSpeed>0){
            return this.target.hNorSlowAcceleration;
        }else{
            return 0;
        }
    },
    getMaxSpeed(){
        return this.target.isJPressed?this.target.hSpeMaxSpeed:this.target.hNorMaxSpeed;
    },
    //检查是否进入站立状态
    checkStandTransition(){
        return this.target.isOnLand&&this.target.hCurrSpeed===0;
    },
    //检查是否进入行走状态
    checkWalkTransition(){
        if(this.target.isOnLand&&this.target.hCurrSpeed!==0){
            return true;
        }
        return false;
    },
    //检查水平方向是否停止运动
    checkHStop(){
        if((!this.target.isAPressed&&!this.target.isDPressed)
        &&(this.target.hCurrSpeed*this.target.hCurrAcceleration>0)){
            return true;
        }
        return false;
    },
    //检查是否进入滑行状态
    checkSlideTransition(){
        if(this.target.isOnLand){
            if((this.target.hCurrSpeed<0&&this.target.isDPressed&&!this.target.isAPressed)
            ||(this.target.hCurrSpeed>0&&!this.target.isDPressed&&this.target.isAPressed)){
                return true;
            }
        }
        return false;
    },
    resume(){
        this.target.setPlayerState(PLAYER_STATE.JUMP);
        this.playJumpAni();
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.hCurrMaxSpeed=this.getMaxSpeed();
    }
});

//行走状态
var Walk=cc.Class({
    extends:State,
    ctor(){
        this.animationState=null;
        this.pauseDir=null;
    },
    handleInput(input){
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    this.target.turnRight();
                    if(this.target.isOnWater){
                        this.target.hCurrSpeed=0;
                    }
                    this.target.hCurrAcceleration=this.getAcceleration();
                    this.target.hCurrMaxSpeed=this.getMaxSpeed();
                }
            }else if(input.type==="keyup"){
                this.target.isDPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
                if(this.target.isAPressed){
                    this.target.turnLeft();
                }
            }
            // if(this.checkSlideTransition()){
            //     this._fsm.switchState("slide");
            //     return;
            // }
        }else if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    this.target.turnLeft();
                    if(this.target.isOnWater){
                        this.target.hCurrSpeed=0;
                    }
                    this.target.hCurrAcceleration=this.getAcceleration();
                    this.target.hCurrMaxSpeed=this.getMaxSpeed();
                }
            }else if(input.type==="keyup"){
                this.target.isAPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
                if(this.target.isDPressed){
                    this.target.turnRight();
                }
            }

        }

        //按下k键跳跃
        if(cc.macro.KEY.k===input.keyCode){
            if(input.type==="keydown"){
                if(!this.target.isKPressed){
                    this.target.isKPressed=true;
                    if(this.target.isOnWater){
                        this._fsm.switchState("swim");
                    }else{
                        this._fsm.switchState("jump");
                    }
                    return;
                }
            }else if(input.type==="keyup"){
                this.target.isKPressed=false;
            }   
        }

        //s下蹲
        if(input.keyCode===cc.macro.KEY.s){
            if(input.type==="keydown"){
                if(!this.target.isSPressed){
                    this.target.isSPressed=true;
                    if(this.target.getFormState()!==FORM_STATE.SMALL){
                        this._fsm.switchState("squat");
                    }   
                }
            }else{
                this.target.isSPressed=false;
            }
        }

        //j键加速
        if(input.keyCode===cc.macro.KEY.j){
            if(input.type==="keydown"){
                if(!this.target.isJPressed){
                    this.target.isJPressed=true; 
                    if(this.target.getFormState()===FORM_STATE.FIRE){
                        this.target.fire();
                        return;
                    } 
                    this.target.hCurrAcceleration=this.getAcceleration();
                    this.target.hCurrMaxSpeed=this.getMaxSpeed();
                    this.updateAniSpeed();
                }
            }else{
                this.target.isJPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
                this.target.hCurrMaxSpeed=this.getMaxSpeed();
                this.updateAniSpeed();
            }
        }
    },
    update(dt){

        // if(Math.abs(this.target.hCurrSpeed)>Math.abs(this.target.hCurrMaxSpeed)){
        //     this.target.hCurrSpeed=this.target.hCurrMaxSpeed*(this.target.hCurrSpeed/Math.abs(this.target.hCurrSpeed));
        //     this.target.hCurrAcceleration=0;
        // }

        if(this.checkSlideTransition()){
            this._fsm.switchState("slide");
            return;
        }

        if(this.checkStandTransition()){
            this._fsm.switchState("stand");
            return;
        }

        if(this.checkFallTransition()){
            this._fsm.switchState("fall");
            return;
        }

    },
    onEnter(){ 
        this.target.isOnLand=true;   
        this.target.setPlayerState(PLAYER_STATE.WALK);
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.hCurrMaxSpeed=this.getMaxSpeed();
        this.animationState=this.playWalkAni();
        this.target.vCurrAcceleration=0;
        this.target.vCurrSpeed=0;
        this.updateAniSpeed();
    },
    playWalkAni(){
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:return this.target.animation.play("small_walk");
            case FORM_STATE.BIG:return this.target.animation.play("big_walk");
            case FORM_STATE.FIRE:return this.target.animation.play("fire_walk");
            default:break;
        }
    },
    getAcceleration(){
        if(this.target.isAPressed){
            if(this.target.isOnWater){
                return -this.target.hWaterAcceleration;
            }
            return this.target.isJPressed?-this.target.hSpeAcceleration:-this.target.hNorAcceleration;
        }else if(this.target.isDPressed){
            if(this.target.isOnWater){
                return this.target.hWaterAcceleration;
            }
            return this.target.isJPressed?this.target.hSpeAcceleration:this.target.hNorAcceleration;
        }else if(this.target.dir===DIR.DIR_LEFT){
            return -this.target.hNorSlowAcceleration;
        }else{
            return this.target.hNorSlowAcceleration;
        }
    },
    getMaxSpeed(){
        if(this.target.isOnWater){
            return this.target.hWaterMaxSpeed;
        }
        return this.target.isJPressed?this.target.hSpeMaxSpeed:this.target.hNorMaxSpeed;
    },
    //检查是否进入滑行状态
    checkSlideTransition(){
        if((this.target.hCurrSpeed<0&&this.target.isDPressed&&!this.target.isAPressed)
            ||(this.target.hCurrSpeed>0&&!this.target.isDPressed&&this.target.isAPressed)){
                if(this.target.isOnWater){
                    return false;
                }
                return true;
        }
        return false;
    },
    //检测是否进入站立状态
    checkStandTransition(){
        if((!this.target.isAPressed&&!this.target.isDPressed)
        &&((this.target.hCurrSpeed>0&&this.target.dir===DIR.DIR_LEFT)||(this.target.hCurrSpeed<0&&this.target.dir===DIR.DIR_RIGHT))){
            return true;
        }
        return false;
    },
    //进入fall
    checkFallTransition(){
        return !this.target.isOnLand;
    },
    updateAniSpeed(){
        if(this.target.isOnWater)return;
        this.target.isJPressed?this.animationState.speed=2:this.animationState.speed=1;
    },
    pause(){
        //this.pauseDir=this.target.getDir();
    },
    resume(){
        //this.target.setDir(this.pauseDir);  
        if(this.target.isAPressed)this.target.turnLeft();
        else if(this.target.isDPressed)this.target.turnRight();
        this.target.setPlayerState(PLAYER_STATE.WALK);
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.hCurrMaxSpeed=this.getMaxSpeed();
        this.animationState=this.playWalkAni();
        this.updateAniSpeed();
    }
});

//滑行状态
var Slide=cc.Class({
    extends:State,
    handleInput(input){
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    this.target.turnRight();
                }
            }else if(input.type==="keyup"){
                this.target.isDPressed=false;
            }
        }else if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    this.target.turnLeft();
                }
            }else if(input.type==="keyup"){
                this.target.isAPressed=false;
            }
        }
        //按下k键跳跃
        if(cc.macro.KEY.k===input.keyCode){
            if(input.type==="keydown"){
                if(!this.target.isKPressed){
                    this.target.isKPressed=true;
                    this._fsm.switchState("jump");
                }
            }else if(input.type==="keyup"){
                this.target.isKPressed=false;
            }   
        }

        //s下蹲
        if(input.keyCode===cc.macro.KEY.s){
            if(input.type==="keydown"){
                if(!this.target.isSPressed){
                    this.target.isSPressed=true;
                    if(this.target.getFormState()!==FORM_STATE.SMALL){
                        this._fsm.switchState("squat");
                    }   
                }
            }else{
                this.target.isSPressed=false;
            }
        }
    },
    onEnter(){  
        this.target.isOnLand=true;
        this.target.setPlayerState(PLAYER_STATE.SLIDE);
        this.target.hCurrAcceleration=this.getAcceleration();
        this.playSlideAni();
    },
    pause(){
        this.target.dir===DIR.DIR_LEFT?this.target.node.scaleX=-1:this.target.node.scaleX=1;
    },
    resume(){
        this.onEnter();
    },
    onExit(){
        this.target.dir===DIR.DIR_LEFT?this.target.node.scaleX=-1:this.target.node.scaleX=1;
    },
    playSlideAni(){
        this.target.dir===DIR.DIR_LEFT?this.target.node.scaleX=1:this.target.node.scaleX=-1;
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:this.target.animation.play("small_slide");break;
            case FORM_STATE.BIG:this.target.animation.play("big_slide");break;
            case FORM_STATE.FIRE:this.target.animation.play("fire_slide");break;
            default:break;
        }
    },
    getAcceleration(){
        return this.target.dir===DIR.DIR_LEFT?this.target.hSpeSlowAcceleration:-this.target.hSpeSlowAcceleration;
    },
    ///检查是否进入行走状态
    checkWalkTransition(){
        if((this.target.hCurrSpeed<0&&this.target.isAPressed)
        ||(this.target.hCurrSpeed>0&&this.target.isDPressed)){
            return true;
        }
        return false;
    },
    //是否进入站立状态
    checkStandTransition(){
        if((!this.target.isAPressed&&!this.target.isDPressed)
        &&((this.target.hCurrSpeed<0&&this.target.dir===DIR.DIR_LEFT)||(this.target.hCurrSpeed>0&&this.target.dir===DIR.DIR_RIGHT))){
            return true;
        }
        return false;
    },
    //进入fall
    checkFallTransition(){
        return !this.target.isOnLand;
    },
    update(dt){
        //是否进入行走状态
        if(this.checkWalkTransition()){
            this._fsm.switchState("walk");
            return;
        }

        //是否进入站立状态
        if(this.checkStandTransition()){
            this._fsm.switchState("stand");
            return;
        }

        if(this.checkFallTransition()){
            this._fsm.switchState("fall");
            return;
        }
    }

});


//下蹲状态

var Squat=cc.Class({
    extends:State,
    ctor(){
        this.isOnSky=false;
        this.orignSpeed=null;
    },
    onEnter(){
        this.isOnSky=false;
        this.orignSpeed=this.target.hCurrSpeed;
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.setPlayerState(PLAYER_STATE.SQUAT);
        this.playSquatAni();
    },
    handleInput(input){

        //按下k键
        if(input.keyCode===cc.macro.KEY.k){
            if(input.type==="keyup"){
                this.target.isKPressed=false;
                this.target.vCurrAcceleration=this.target.vMaxAcceleration;
            }else{
                if(!this.target.isKPressed){
                    this.target.isKPressed=true;
                    if(!this.isOnSky&&!this.target.isOnWater){
                        this.isOnSky=true;
                        this.target.vCurrAcceleration=this.target.vMinAcceleration;
                        this.target.vCurrSpeed=this.target.vOrignSpeed;
                    }
                }
            }
        }


        if(input.keyCode===cc.macro.KEY.s){
            if(input.type==="keydown"){
                if(!this.target.isSPressed){
                    this.target.isSPressed=true;
                }
            }else{
                this.target.isSPressed=false;
                if(this.isOnSky){
                    this._fsm.switchState("jump",true);
                }else{
                    this._fsm.switchState("stand");
                }        
            }
        }

    },
    playSquatAni(){
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:this.target.animation.play("small_stand");break;
            case FORM_STATE.BIG:this.target.animation.play("big_squat");break;
            case FORM_STATE.FIRE:this.target.animation.play("fire_squat");break;
            default:break;
        }
    },
    update(dt){
        if(this.checkVStop()){
            this.target.vCurrAcceleration=0;
            this.target.vCurrSpeed=0;
            this.isOnSky=false;
        }

        if(this.checkHStop()){
            this.target.hCurrSpeed=0;
            this.target.hCurrAcceleration=0;
        }

        if(this.checkFallTransition()){
            this._fsm.switchState("fall");
            return;
        }
    },
    getAcceleration(){
        if(this.target.hCurrSpeed>0){
            return this.target.hNorSlowAcceleration;
        }else if(this.target.hCurrSpeed<0){
            return -this.target.hNorSlowAcceleration;
        }else{
            return 0;
        }
    },
    checkHStop(){
        if(this.target.hCurrSpeed*this.orignSpeed<0){
            return true;
        }
        return false;
    },
    checkVStop(){
        return this.target.isOnLand&&this.isOnSky;
    },
    //进入fall
    checkFallTransition(){
        return !this.target.isOnLand&&!this.isOnSky;
    },
    resume(){
        //cc.log("onenter")
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.setPlayerState(PLAYER_STATE.SQUAT);
        this.playSquatAni();
    }
});

//发射子弹
var Fire=cc.Class({
    extends:State,
    ctor(){
        this.interval=0;
        this.id=null;
    },
    handleInput(input){

    },
    onEnter(){
        this.target.setPlayerState(PLAYER_STATE.FIRE);
        this.playFireAni();
        //100ms后恢复原来的状态
        this.target.behind.runAction(cc.sequence(cc.delayTime(0.08),cc.callFunc(function(){
            this._fsm.switchPreState();
        },this)));
    },
    playFireAni(){
        if(this.target.isOnWater){
            this.target.animation.play("fire_fire_water");
        }else{
            this.target.animation.play("fire_fire");
        }
    },
    pause(){
        this.target.behind.pauseAllActions();
    },
    resume(){
        this.target.behind.resumeAllActions();
    }
});

//下落状态
var Fall=cc.Class({
    extends:State,
    ctor(){
        this.orignDir=null;
    },
    onEnter(){
        this.target.setPlayerState(PLAYER_STATE.FALL);
        this.target.vCurrSpeed=0;
        this.target.vCurrAcceleration=this.target.vMaxAcceleration;
        this.playFallAni();
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.hCurrMaxSpeed=this.getMaxSpeed();
    },
    handleInput(input){

        //按下d键
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    this.target.hCurrAcceleration=this.getAcceleration();
                }
            }else if(input.type==="keyup"){
                this.target.isDPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
            } 
        }
        //按下a键
        else if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    this.target.hCurrAcceleration=this.getAcceleration();
                }
            }else if(input.type==="keyup"){
                this.target.isAPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
            }
        }
        //j键加速/发射子弹
        if(input.keyCode===cc.macro.KEY.j){
            if(input.type==="keydown"){
                if(!this.target.isJPressed){
                    this.target.isJPressed=true; 
                    if(this.target.getFormState()===FORM_STATE.FIRE){
                        this.target.fire();
                        return;
                    } 
                }
            }else{
                this.target.isJPressed=false;
            }
        }
    },
    update(dt){

        if(this.checkStandTransition()){
            this._fsm.switchState("stand");
            return;
        }

        if(this.checkSlideTransition()){
            this._fsm.switchState("slide");
            return;
        }

        if(this.checkWalkTransition()){
            this._fsm.switchState("walk");
            return;
        }

        if(this.target.isOnWater){
            this._fsm.switchState("float");
            this.target.vCurrSpeed=-100;
            return;
        }

        if(this.checkHStop()){
            this.target.hCurrSpeed=0;
            this.target.hCurrAcceleration=0;
        }
    },
    playFallAni(){
        if(this.target.dir===DIR.DIR_RIGHT){
            this.target.turnRight();
        }else{
            this.target.turnLeft();
        }
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:this.target.animation.play("small_fall");break;
            case FORM_STATE.BIG:this.target.animation.play("big_fall");break;
            case FORM_STATE.FIRE:this.target.animation.play("fire_fall");break;
            default:break;
        }
    },
    getAcceleration(){
        if(this.target.isAPressed){
            return -this.target.hNorAcceleration;
        }else if(this.target.isDPressed){
            return this.target.hNorAcceleration;
        }else if(this.target.hCurrSpeed<0){
            return -this.target.hNorSlowAcceleration;
        }else if(this.target.hCurrSpeed>0){
            return this.target.hNorSlowAcceleration;
        }else{
            return 0;
        }
    },
    getMaxSpeed(){
        return this.target.isJPressed?this.target.hSpeMaxSpeed:this.target.hNorMaxSpeed;
    },
    //检查是否进入站立状态
    checkStandTransition(){
        return this.target.isOnLand&&this.target.hCurrSpeed===0;
    },
    //检查是否进入行走状态
    checkWalkTransition(){
        return this.target.isOnLand&&this.target.hCurrSpeed!==0;
    },
    //检查水平方向是否停止运动
    checkHStop(){
        if((!this.target.isAPressed&&!this.target.isDPressed)
        &&(this.target.hCurrSpeed*this.target.hCurrAcceleration>0)){
            return true;
        }
        return false;
    },
    //检查是否进入滑行状态
    checkSlideTransition(){
        if(this.target.isOnLand){
            if((this.target.hCurrSpeed<0&&this.target.isDPressed&&!this.target.isAPressed)
            ||(this.target.hCurrSpeed>0&&!this.target.isDPressed&&this.target.isAPressed)){
                return true;
            }
        }
        return false;
    },
    resume(){
        this.target.setPlayerState(PLAYER_STATE.FALL);
        this.playFallAni();
    },
    onExit(){
        this.target.vCurrAcceleration=0;
        this.target.vCurrSpeed=0;
        if(this.target.isAPressed){
            this.target.turnLeft();
        }else if(this.target.isDPressed){
            this.target.turnRight();
        }
    },
});

//游泳
var Swim=cc.Class({
    extends:State,
    ctor(){
        this.animationState=null;
    },
    update(){
        if(this.checkStandTransition()){
            this._fsm.switchState("stand");
            return;
        }

        //动画播放完成进入float
        if(!this.animationState.isPlaying){
            this._fsm.switchState("float");
            return;
        }

        if(this.checkWalkTransition()){
            this._fsm.switchState("walk");
            return;
        }
        
        if(!this.target.isOnWater){
            this._fsm.switchState("fall");
            return;
        }

        if(this.checkHStop()){
            this.target.hCurrAcceleration=0;
            this.target.hCurrSpeed=0;
        }
    },
    handleInput(input){
        //k
        if(input.keyCode===cc.macro.KEY.k){
            if(input.type==="keydown"){
                if(!this.target.isKPressed){
                    this.target.isKPressed=true; 
                    this.target.vCurrAcceleration=this.target.vWaterMinAcceleration;
                    this.target.vCurrSpeed=this.target.vWaterOrignSpeed;
                    this.animationState=this.playSwinAni();
                }
            }else{
                this.target.isKPressed=false;
            }
        }

        //a/d
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    this.target.setDir(DIR.DIR_RIGHT);
                    this.changeDir();
                    this.target.hCurrAcceleration=this.getAcceleration();
                    this.target.hCurrMaxSpeed=this.getMaxSpeed();
                }
            }else if(input.type==="keyup"){
                this.target.isDPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
                if(this.target.isAPressed){
                    this.target.setDir(DIR.DIR_LEFT);
                    this.changeDir();
                }
            }
        }else if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    this.target.setDir(DIR.DIR_LEFT);
                    this.changeDir();
                    this.target.hCurrAcceleration=this.getAcceleration();
                    this.target.hCurrMaxSpeed=this.getMaxSpeed();
                }
            }else if(input.type==="keyup"){
                this.target.isAPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
                if(this.target.isDPressed){
                    this.target.setDir(DIR.DIR_RIGHT);
                    this.changeDir();
                }
            }
        }


        //j键加速
        if(input.keyCode===cc.macro.KEY.j){
            if(input.type==="keydown"){
                if(!this.target.isJPressed){
                    this.target.isJPressed=true; 
                    if(this.target.getFormState()===FORM_STATE.FIRE){
                        this.target.fire();
                    } 
                }
            }else{
                this.target.isJPressed=false;
            }
        }
    },
    onEnter(){
        this.target.setPlayerState(PLAYER_STATE.FLOAT);
        this.target.vCurrAcceleration=this.target.vWaterMinAcceleration;
        this.target.vCurrSpeed=this.target.vWaterOrignSpeed;
        this.animationState=this.playSwinAni();

    },
    playSwinAni(){
        this.changeDir();
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:return this.target.animation.play("small_swim");
            case FORM_STATE.BIG:return this.target.animation.play("big_swim");
            case FORM_STATE.FIRE:return this.target.animation.play("fire_swim");
            default:break;
        }
    },
    //检查是否进入站立状态
    checkStandTransition(){
        return this.target.isOnLand&&this.target.hCurrSpeed===0;
    },
    changeDir(){
        if(this.target.dir===DIR.DIR_LEFT){
            this.target.turnLeft();
        }else{
            this.target.turnRight();
        }
    },
    getAcceleration(){
        if(this.target.isAPressed){
            return -this.target.hNorAcceleration;
        }else if(this.target.isDPressed){
            return this.target.hNorAcceleration;
        }else if(this.target.dir===DIR.DIR_LEFT){
            return -this.target.hWaterSlowSpeed;
        }else{
            return this.target.hWaterSlowSpeed;
        }
    },
    getMaxSpeed(){
        return this.target.hNorMaxSpeed;
    },
    //检查水平方向是否停止运动
    checkHStop(){
        if((!this.target.isAPressed&&!this.target.isDPressed)
        &&((this.target.hCurrSpeed>0&&this.target.dir===DIR.DIR_LEFT)||(this.target.hCurrSpeed<0&&this.target.dir===DIR.DIR_RIGHT))){
            return true;
        }
        return false;
    },
    //检查是否进入行走状态
    checkWalkTransition(){
        return this.target.isOnLand&&this.target.hCurrSpeed!==0;
    },
    resume(){
        this.target.setPlayerState(PLAYER_STATE.FLOAT);
        this.animationState=this.playSwinAni();
    },
    onExit(){
        
    }
});


//浮水

var Float=cc.Class({
    extends:State,
    update(){
        if(this.checkStandTransition()){
            this._fsm.switchState("stand");
            return;
        }

        if(this.checkWalkTransition()){
            this._fsm.switchState("walk");
            return;
        }

        if(!this.target.isOnWater){
            this._fsm.switchState("fall");
            return;
        }

        if(this.checkHStop()){
            this.target.hCurrAcceleration=0;
            this.target.hCurrSpeed=0;
        }
    },
    handleInput(input){
        //k
        if(input.keyCode===cc.macro.KEY.k){
            if(input.type==="keydown"){
                if(!this.target.isKPressed){
                    this.target.isKPressed=true; 
                    this._fsm.switchState("swim");
                }
            }else{
                this.target.isKPressed=false;
            }
        }
        //a/d
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    this.target.setDir(DIR.DIR_RIGHT);
                    this.playFloatAni();
                    this.target.hCurrAcceleration=this.getAcceleration();
                    this.target.hCurrMaxSpeed=this.getMaxSpeed();
                }
            }else if(input.type==="keyup"){
                this.target.isDPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
                if(this.target.isAPressed){
                    this.target.setDir(DIR.DIR_LEFT);
                    this.playFloatAni();
                }
            }
        }else if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    this.target.setDir(DIR.DIR_LEFT);
                    this.playFloatAni();
                    this.target.hCurrAcceleration=this.getAcceleration();
                    this.target.hCurrMaxSpeed=this.getMaxSpeed();
                }
            }else if(input.type==="keyup"){
                this.target.isAPressed=false;
                this.target.hCurrAcceleration=this.getAcceleration();
                if(this.target.isDPressed){
                    this.target.setDir(DIR.DIR_RIGHT);
                    this.playFloatAni();
                }
            }
        }

        //        //j键加速
        if(input.keyCode===cc.macro.KEY.j){
            if(input.type==="keydown"){
                if(!this.target.isJPressed){
                    this.target.isJPressed=true; 
                    if(this.target.getFormState()===FORM_STATE.FIRE){
                        this.target.fire();
                    } 
                }
            }else{
                this.target.isJPressed=false;
            }
        }

    },
    onEnter(){
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.hCurrMaxSpeed=this.getMaxSpeed();
        this.target.vCurrAcceleration=this.target.vWaterMinAcceleration;
        this.target.setPlayerState(PLAYER_STATE.FLOAT);
        this.playFloatAni();
    },
    playFloatAni(){
        if(this.target.dir===DIR.DIR_RIGHT){
            this.target.turnRight();
        }else{
            this.target.turnLeft();
        }
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:this.target.animation.play("small_float");break;
            case FORM_STATE.BIG:this.target.animation.play("big_float");break;
            case FORM_STATE.FIRE:this.target.animation.play("fire_float");break;
            default:break;
        }
    },
    //检查是否进入站立状态
    checkStandTransition(){
        return this.target.isOnLand&&this.target.hCurrSpeed===0;
    },
    //检查是否进入行走状态
    checkWalkTransition(){
        return this.target.isOnLand&&this.target.hCurrSpeed!==0;
    },
    getAcceleration(){
        if(this.target.isAPressed){
            return -this.target.hNorAcceleration;
        }else if(this.target.isDPressed){
            return this.target.hNorAcceleration;
        }else if(this.target.dir===DIR.DIR_LEFT){
            return -this.target.hWaterSlowSpeed;
        }else{
            return this.target.hWaterSlowSpeed;
        }
    },
    getMaxSpeed(){
        return this.target.hNorMaxSpeed;
    },
    //检查水平方向是否停止运动
    checkHStop(){
        if((!this.target.isAPressed&&!this.target.isDPressed)
        &&((this.target.hCurrSpeed>0&&this.target.dir===DIR.DIR_LEFT)||(this.target.hCurrSpeed<0&&this.target.dir===DIR.DIR_RIGHT))){
            return true;
        }
        return false;
    },
    resume(){
        this.target.hCurrAcceleration=this.getAcceleration();
        this.target.hCurrMaxSpeed=this.getMaxSpeed();
        this.target.vCurrAcceleration=this.target.vWaterMinAcceleration;
        this.target.setPlayerState(PLAYER_STATE.FLOAT);
        this.playFloatAni();
    },
    onExit(){
        
    }
});


//遇到星星之后的闪烁
var FlashCatchStar =cc.Class({
    extends:State,
    ctor(){
        this.flashIndex=null;
        this.count=0;
        this.repeatTimes=160;
        this.frontSprite=null;
        this.behinSprite=null;
    },  
    onEnter(){

        this.flashIndex=0;
        this.count=0;
        this.target.front.active=true;
        this.target.behind.opacity=0;
        this.target.isInvincible=true;
        this.target.isFlashing=true;
        this.frontSprite=this.target.front.getComponent(cc.Sprite);
        this.behindSprite=this.target.behind.getComponent(cc.Sprite);
        

        let delay=cc.delayTime(0.05);
        let seq=cc.sequence(delay,cc.callFunc(this.updateFrame,this));    
        let repeat=cc.repeat(seq,this.repeatTimes);
        this.target.behind.runAction(repeat);

    },
    updateFrame(){
        let frameNum=parseInt(this.behindSprite.spriteFrame.name.split("_")[1]);;
        this.frontSprite.spriteFrame=this.target.flashAtlas[this.flashIndex++].getSpriteFrame("flash_"+frameNum);
        this.flashIndex%=this.target.flashAtlas.length;
        this.count++;
     
        if(this.count>=this.repeatTimes){
            this._fsm.clearSubState();
        }
    },
    pause(){
        this.target.front.active=false;
        this.target.behind.opacity=255;
        this.target.behind.pauseAllActions();
    },
    resume(){
        this.target.front.active=true;
        this.target.behind.opacity=0;
        this.target.behind.resumeAllActions();
    },
    onExit(){
        this.target.isFlashing=false;
        this.target.front.active=false;
        this.target.behind.opacity=255;
        this.target.isInvincible=false;
    }
});


//遇到花朵之后的闪烁
var FlashCatchFlower=cc.Class({
    extends:State,
    ctor(){
        this.flashIndex=null;
        this.frameNum=null;
        this.count=0;
        this.repeatTimes=10;
        this.sprite=null;
    },  
    onEnter(){
        //清除子状态
        this._fsm.pauseSubState();

        this.flashIndex=0;
        this.count=0;
        this.target.front.active=true;
        this.target.behind.active=false;

        this.sprite=this.target.front.getComponent(cc.Sprite);
        let sprite=this.target.behind.getComponent(cc.Sprite);
        this.frameNum=parseInt(sprite.spriteFrame.name.split("_")[1]);
        this.target.setFormState(FORM_STATE.FIRE);
        EM.emit(EM.type.CHANGE_STATE,FORM_STATE.FIRE);

        let delay=cc.delayTime(0.1);
        let seq=cc.sequence(delay,cc.callFunc(this.updateFrame,this));        
        let repeat=cc.repeat(seq,this.repeatTimes);
        this.target.node.runAction(repeat);
        this.target.isPause=true;
        EM.emit(EM.type.PAUSE_ACTOR);
    },
    updateFrame(){
        this.sprite.spriteFrame=this.target.flashAtlas[this.flashIndex++].getSpriteFrame("flash_"+this.frameNum);
        this.flashIndex%=this.target.flashAtlas.length;
        this.count++;     
        if(this.count>=this.repeatTimes){
            this.target.front.active=false;
            this.target.behind.active=true;
            this._fsm.switchPreState();
        }
    },
    onExit(){
        this.target.isPause=false;
        EM.emit(EM.type.RESUME_ACTOR);
        this._fsm.resumeSubState();
    }
});


//遇到怪物之后的闪烁
var FlashCatchMonster=cc.Class({
    extends:State,
    onEnter(){
        let blinkOne=cc.blink(3,40);
        let blinkTwo=cc.blink(2,16);
        let blinkThree=cc.blink(1,6);
        let seq=cc.sequence(blinkOne,blinkTwo,blinkThree,cc.callFunc(this.blinkFinished,this));
        this.target.isInvincible=true;
        this.target.node.runAction(seq);
    },  
    blinkFinished(){
        this.target.isInvincible=false;
        this._fsm.clearSubState();
    },
    pause(){
        this.target.node.pauseAllActions();
        this.target.node.opacity=255;
    },
    resume(){
        this.target.node.resumeAllActions();
    }
});


//变大
var ToBig=cc.Class({
    extends:State,
    onEnter(){
        this._fsm.pauseSubState();

        this.target.animation.play("to_big");    
        this.target.animation.on("finished",this.aniFinished,this);
        this.target.isPause=true;
        EM.emit(EM.type.PAUSE_ACTOR);
        EM.emit(EM.type.CHANGE_STATE,FORM_STATE.BIG);
    },
    aniFinished(){
        this.target.setFormState(FORM_STATE.BIG);
        this._fsm.switchPreState();
    },
    onExit(){
        this.target.animation.off("finished",this.aniFinished,this);
        this.target.isPause=false;
        EM.emit(EM.type.RESUME_ACTOR);
        this._fsm.resumeSubState();
    }
});


//变小
var ToSmall=cc.Class({
    extends:State,
    onEnter(){
        this.target.animation.play("to_small");    
        this.target.animation.on("finished",this.aniFinished,this);
        this.target.isPause=true;
        EM.emit(EM.type.PAUSE_ACTOR);
        this._fsm.switchSubState("flash_catch_monster");
        EM.emit(EM.type.CHANGE_STATE,FORM_STATE.SMALL);
    },
    aniFinished(){
        this.target.setFormState(FORM_STATE.SMALL);
        this._fsm.switchPreState();
    },
    onExit(){
        this.target.animation.off("finished",this.aniFinished,this);
        this.target.isPause=false;
        EM.emit(EM.type.RESUME_ACTOR);
    }
});

//die
var Die=cc.Class({
    extends:State,
    onEnter(){
        this._fsm.clearSubState();
        this.target.behind.stopAllActions();
        this.target.node.stopAllActions();
        this.target.enableInput=false;
        this.target.enableCollsi=false;
        this.target.isDie=true;
        this.target.setPlayerState(PLAYER_STATE.DIE);
        this.target.node.zIndex=100;
        this.playAni();
        this.target.hCurrAcceleration=0;
        this.target.hCurrSpeed=0;
        let delay=cc.delayTime(0.4);
        this.target.node.runAction(cc.sequence(delay,cc.callFunc(this.callback,this)));
        EM.emit(EM.type.STOP_READTIME);
        EM.emit(EM.type.CHANGE_STATE,FORM_STATE.SMALL);
    },
    playAni(){
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:
            case FORM_STATE.BIG:this.target.animation.play("small_die");break;
            case FORM_STATE.FIRE:this.target.animation.play("fire_die");break;
            default:break;
        }
    },
    callback(){
        this.target.vCurrAcceleration=-1400;
        this.target.vCurrSpeed=500;
    }
});


//Climb
var Climb=cc.Class({
    extends:State,
    onEnter(){
        this.target.setPlayerState(PLAYER_STATE.CLIMB);
        this.playAni();
        this.target.hCurrAcceleration=0;
        this.target.hCurrSpeed=0;
        this.target.vCurrAcceleration=0;
        this.target.isOnLand=false;
        this.target.vCurrSpeed=this.getVSpeed();
        
    },
    playAni(){
        let name="";
        switch(this.target.getFormState()){
            case FORM_STATE.SMALL:name="small_climb";break;
            case FORM_STATE.BIG:name="big_climb";break;
            case FORM_STATE.FIRE:name="fire_climb";break;
        } 
        this.target.animation.play(name);
        this.target.animation.setCurrentTime(0.1);
        this.target.animation.pause(name);
    },
    handleInput(input){
        //按下a向左走
        if(input.keyCode===cc.macro.KEY.a){
            if(input.type==="keydown"){
                if(!this.target.isAPressed){
                    this.target.isAPressed=true;
                    //this.target.setDir(DIR.DIR_LEFT);
                    this.keyAPressed();
                    return;
                }
            }else{
                this.target.isAPressed=false;
            }
        }

        //按下d向右走
        if(input.keyCode===cc.macro.KEY.d){
            if(input.type==="keydown"){
                if(!this.target.isDPressed){
                    this.target.isDPressed=true;
                    //this.target.setDir(DIR.DIR_RIGHT);
                    this.keyDPressed();
                    return;
                }
            }else{
                this.target.isDPressed=false;
            }
        }

        //s
        if(input.keyCode===cc.macro.KEY.s){
            if(input.type==="keydown"){
                if(!this.target.isSPressed){
                    this.target.isSPressed=true;  
                    if(!this.target.isTouchLand)this.resumeAni();
                }
            }else{
                this.target.isSPressed=false;
                this.pauseAni();
            }
            this.target.vCurrSpeed=this.getVSpeed();
        }

        //w
        if(input.keyCode===cc.macro.KEY.w){
            if(input.type==="keydown"){
                if(!this.target.isWPressed){
                    this.target.isWPressed=true;
                    if(!this.target.isTouchLand)this.resumeAni();
                }
            }else{
                this.target.isWPressed=false;
                this.pauseAni();
            }
            this.target.vCurrSpeed=this.getVSpeed();
        }
    },
    keyAPressed(){
        let size=this.target.getSize();
        if(!this.target.isDPressed){
            if(this.target.dir===DIR.DIR_LEFT){
                this.target.turnRight();
                this.target.node.x-=20;
            }else{
                this.target.turnLeft();
                this.target.node.x-=20;
                this.target.hCurrSpeed=-50;
                this.target.isOnCirrus=false;
                this.target.isTouchLand?this.target.fsm.switchState("walk"):this.target.fsm.switchState("fall");
            }
        }
    },
    keyDPressed(){
        let size=this.target.getSize();
        if(!this.target.isAPressed){
            if(this.target.dir===DIR.DIR_RIGHT){
                this.target.turnLeft();
                this.target.node.x+=20;
                gm.fixOffset(this.target.node.position);
            }else{
                this.target.turnRight();
                this.target.node.x+=20;
                this.target.hCurrSpeed=50;
                this.target.isOnCirrus=false;
                this.target.isTouchLand?this.target.fsm.switchState("walk"):this.target.fsm.switchState("fall");
            }
        }
    },   
    pauseAni(){
        this.target.animation.pause();
    },
    resumeAni(){
        this.target.animation.resume();
    },
    update(dt){
        //触底停掉动画
        if(this.target.isTouchLand){
            this.target.isTouchLand=false;
            this.pauseAni();
        }
    },
    getVSpeed(){
        if(this.target.isSPressed){
            return this.target.isCollsiFlag?-250:-120;
        }else if(this.target.isWPressed){
            return 120;
        }else{
            return 0;
        }
    }   
});

module.exports={Stand,Jump,Walk,Slide,Squat,Fire,Fall,Swim,Float,FlashCatchStar,FlashCatchFlower,FlashCatchMonster,ToBig,ToSmall,Die,Climb};
