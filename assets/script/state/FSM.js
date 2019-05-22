/*
 * @Description: FSM(finite state machine)有限状态机，管理各个状态的切换
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-02 10:18:38
 * @LastEditTime: 2019-03-16 15:49:49
 */

var FSM=cc.Class({
    _stateList:null,            //状态列表
    currState:null,            //当前状态
    _stateStack:null,           //状态栈
    subState:null,              //子状态，不会影响currState
    ctor(){
        this._stateList={};
        this._stateStack=[];
    },
    //设置默认转态
    setDefaultState(name){
        this.currState=this.getState(name);
        if(this.currState){
            this.currState.onEnter();
        }
    },
    getState(name){
        return this._stateList[name]||null;
    },
    handleInput(input){
        if(this.currState)this.currState.handleInput(input);
        if(this.subState)this.subState.handleInput(input);
    },
    update(dt){
        if(this.currState)this.currState.update(dt);
        if(this.subState)this.subState.update(dt);
    },
    /**
     * 添加状态
     */
    addState(state){
        this._stateList[state.name]=state;
        state.setFsm(this);
    },
    //切换状态
    switchState(name){
        let args=[].slice.call(arguments,1);
        this.currState.onExit();
        this.currState=this.getState(name);
        this.currState.onEnter.apply(this.currState,args);
    },
    //切换上一个状态
    switchPreState(){
        this.currState.onExit();
        this.currState=this._stateStack.pop();
        this.currState.resume();
    },
    //切换状态并保存上一个状态
    switchStateWithStack(name){
        this.currState.pause();
        this._stateStack.push(this.currState);
        this.currState=this.getState(name);
        this.currState.onEnter();
    },
    //切换子状态
    switchSubState(name){
        if(this.subState){
            this.subState.onExit();
        }   
        this.subState=this.getState(name);
        this.subState.onEnter();
    },
    
    clearSubState(){
        if(this.subState){
            this.subState.onExit();
        }
        this.subState=null;
    },
    //暂停子状态
    pauseSubState(){
        if(this.subState)this.subState.pause();
    },
    resumeSubState(){
        if(this.subState)this.subState.resume();
    }
});

module.exports=FSM;