// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

class PlayeData{
    constructor(){
        this.id=0;
        this.round=0;//26
        this.score=0;
        this.coin=0;
        this.life=3;
        this.formState=FORM_STATE.SMALL;
    }
}

window.globalMgr={
    time:300,
    isGameOver:false,
    aniSynTime:Date.now(),
    winSize:null,
    players:[],
    currPlayer:null,
    init:function(players){
        for(let i=0;i<players;i++){
            let player=new PlayeData();
            player.id=i;
            this.players.push(player);
        }
        this.currPlayer=this.players[0];
        this.winSize=cc.size(640,640);

        EM.on(EM.type.ADD_SCORE,this.addScore,this);
        EM.on(EM.type.ADD_COIN,this.addCoin,this);
        EM.on(EM.type.ADD_LIFE,this.addLife,this);
        EM.on(EM.type.ADD_TIME,this.addTime,this);
        EM.on(EM.type.CHANGE_STATE,this.changeFormState,this);
    },
    isOneOrTwo(){
        return this.players.length===1?true:false;
    },
    getPlayerId(){
        return this.currPlayer.id;
    },
    getTime(){
        return this.time;
    },

    addTime(time){
        this.time+=time;
        EM.emit(EM.type.UPDATE_TIME,this.time);
    },

    nextRound(){
        this.currPlayer.round+=1;
    },
    setRound(round){
        this.currPlayer.round=round;
    },
    getRound(){
        return this.currPlayer.round;
    },
    getLife(){
        return this.currPlayer.life;
    },
    getCoin(){
        return this.currPlayer.coin;
    },
    getScore(){
        return this.currPlayer.score;
    },
    getRoundString(){
        let main=1+Math.floor(this.currPlayer.round/4);
        let sub=1+this.currPlayer.round%4;
        return main+"-"+sub;
    },

    nextPlayer(){
        this.currPlayer=this.players[(this.currPlayer.id+1)%this.players.length];
    },

    addScore(score){
        this.currPlayer.score+=score;
        EM.emit(EM.type.UPDATE_SCORE,this.currPlayer.score);
    },
    addCoin(coin){
        this.currPlayer.coin+=coin;
        if(this.currPlayer.coin>=100){
            this.currPlayer.coin%=100;
            this.currPlayer.life++;
        }
        EM.emit(EM.type.UPDATE_COIN,this.currPlayer.coin);
    },
    addLife(life){
        this.currPlayer.life+=life;
    },
    changeFormState(state){
        this.currPlayer.formState=state;
    },
    getPlayerState(){
        return this.currPlayer.formState;
    },
    resetTime(){
        this.time=300;
    },
    restart(){
        this.time=300,
        this.isGameOver=false;
        this.players=[];
        this.currPlayer=null;
        EM.off(EM.type.ADD_SCORE);
        EM.off(EM.type.ADD_COIN);
        EM.off(EM.type.ADD_LIFE);
        EM.off(EM.type.ADD_TIME);
        EM.off(EM.type.CHANGE_STATE);
    }
}
