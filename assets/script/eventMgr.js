//事件管理EM(eventMgr)

window.EM={ 
    _eventList:{},
    _keyList:{},
    //事件类型
    type:{},
    on:function(type,callback,target,key){
        if(key){
            this._keyList[type]=this._keyList[type]||[];
            if(this.exitKey(this._keyList[type],key)!=-1){
                cc.error(key+":is already exit!");
                return;
            }
            this._keyList[type].push({key:key,callback:callback,target:target||null});
        }else{
            this._eventList[type]=this._eventList[type]||[];
            this._eventList[type].push({callback:callback,target:target||null});
        }
    },
    off:function(type,key){
        if(key){
            let list=this._keyList[type];
            let index=this.exitKey(list,key);
            if(index==-1){
                cc.error(key+":is not exit!");
                return;
            }
            list.splice(index,1);
        }else{
            delete this._eventList[type];
        }
    },
    emit:function(type){
        let args=[].slice.call(arguments,1);
        let eList=this._eventList[type];
        let kList=this._keyList[type];
        if(!kList&&!eList){
            cc.error(type+":is not exit!");return;
        }
        if(kList){
            for(let value of kList){
                value.callback.apply(value.target,args);
            }
        }
        if(eList){
            for(let value of eList){
                value.callback.apply(value.target,args);
            }
        }
    },
    clear(){
        this._keyList={};
        this._eventLis={};
    },
    //arr是否存在key
    exitKey(arr,key){
        for(let i=0;i<arr.length;i++){
            if(arr[i].key===key){
                return i;
            }
        }
        return -1;
    }
}

EM.type.PAUSE_ACTOR="pause_actor";
EM.type.RESUME_ACTOR="resume_actor";

EM.type.UPDATE_SCORE="update_score";
EM.type.UPDATE_COIN="update_coin";
EM.type.UPDATE_TIME="update_time";

EM.type.ADD_SCORE="add_score";
EM.type.ADD_COIN="add_coin";
EM.type.ADD_LIFE="add_life";
EM.type.ADD_TIME="add_time";
EM.type.CHANGE_STATE="change_state";


//propMgr注册事件
EM.type.CREATE_MUSHROOM="create_mushroom";              //创建道具
EM.type.CREATE_MONSTER="create_monster";                //创建怪物

//effectMgr注册事件
EM.type.PIECES_EFFECT="pieces_effect";
EM.type.COIN_EFFECT="coin_effect";
EM.type.SCORE_EFFECT="score_effect";
EM.type.LIFE_EFFECT="life_effect";


//bulletMgr
EM.type.CREATE_P_BULLET="create_p_bullet";


EM.type.COLLSI_FLAG="collsi_flag";              //玩家碰到旗杆
EM.type.FLAG_TOUCH_LAND="flag_touch_land";      //旗帜碰到地面
EM.type.PLAYER_TO_END="player_to_end";          //玩家走到终点
EM.type.RISE_WRITE_FLAG="rise_write_flag";      //升起城堡白旗
EM.type.GAME_OVER="game_over";                  //游戏结束
EM.type.GAME_PASS="game_pass";                  //过关
EM.type.STOP_READTIME="stop_readtime";          //停止读秒
EM.type.PAUSE_READTIME="stop_readtime";         //停止读秒
EM.type.RESUME_READTIME="resume_readtime";      //恢复读秒

EM.type.SHOW_SELECT_ZOOM="show_select_zoom";    //显示隐藏关卡
EM.type.SHOW_PASS="show_pass";
EM.type.REMOVE_ALL_MON="remove_all_mon";        //移除所有怪物

EM.type.SHOW_THANK="show_thank";
EM.type.SHOW_TIP="show_tip";


//刺猬死亡
EM.type.HEDGEHOG_DIE="hedgehog_die";