// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//ai控制玩家的移动
var AiCtrl=cc.Class({
    ctor(){
        this._cmdList=[];
        setInterval(() => {
            if(this._cmdList.length>0){
                this._cmdList.shift().excute();
            }
        },200);
    },
    addCmd(cmd){
        this._cmdList.push(cmd);
    },
    clear(){
        this._cmdList=[];
    },
    update(dt){

    }
});


//指令基类
var Command=cc.Class({
    ctor(target,key,type){
        this._target=target;
        this._type=type;
        this._key=key;
    },
    excute(){

    }
});

//玩家移动指令
var MoveCmd=cc.Class({
    extends:Command,
    excute(){
        //this._target.fsm.handleInput({keyCode:cc.macro.KEY.d,type:"keyup"});
        this._target.fsm.handleInput({keyCode:this._key,type:this._type});
    }
});

module.exports={AiCtrl,MoveCmd};