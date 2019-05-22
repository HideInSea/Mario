/*
 * @Description: 游戏中使用的全局枚举值
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-02 11:15:06
 * @LastEditTime: 2019-04-05 21:39:39
 */

 window.DIR={
     DIR_LEFT:1,
     DIR_RIGHT:2
 }

//玩家状态
 window.PLAYER_STATE={
     STAND:1,
     JUMP:2,
     FALL:3,
     WALL:4,
     SLIDE:5,
     CLIMB:6,
     SWIM:7,
     FLOAT:8,
     SQUAT:9,
     FIRE:10,
     DIE:11
 }

 //玩家形态
 window.FORM_STATE={
     SMALL:1,
     BIG:2,
     FIRE:3
 }

window.GID={
        //管道横向入口
        PIPE_H_ENTRY:[53,73,57,77,153,173,157,177],
        //管道纵向入口
        PIPE_V_ENTRY:[15,16,19,20,115,116,119,200],
        //绳子
        ROPE:[142],
        QUESTION:[121,122],
        COIN:[104,105,106], 
        SOLID:[62,61,63],
        HIDE_QUESTION:[4,5],
        WALL:[1,2,3,21,22,23],
        FLAG:[234,236,238,274,276,278]
}

 //tileTyep
 window.TILE_TYPE={
     //管道横向入口
     PIPE_H_ENTRY:"pipe_h_entry",
     //管道纵向入口
     PIPE_V_ENTRY:"pipe_v_entry",
     LAND:"land",
     WALL:"wall",
     QUESTION:"question",
     COIN:"coin",
     //绳子
     ROPE:"rope",
     HIDE_QUESTION:"hide_question",
     WALL:"wall",
     FLAG:"flag"
 }

 window.ENUM={

    MON_TYPE:{                  //===============================怪物类型
        MUSHROOM:"mushroom",
        DUCK:"duck",
        FLOWER:"flower",
        FIRE:"fire",
        FIRE_BALL:"fireBall",
        AEX:"aex",
        BOSS:"boss",
        HELMET:"helmet",
        FISH:"fish",
        OCTOPUS:"octopus",
        NINJIA:"ninjia",
        HEDGEHOG:"hedgehog",
        SKYSHOOT:"skyShoot",
        ROCKET:"rocket",
        ROCKETFIRE:"rocketFire"
    },

    MON_DIR:{                   //怪物方向
        LEFT:"left",
        RIGHT:"right"
    },

    MUSHROOM_STATE:{            //蘑菇怪的状态
        WALK:"walk",
        FLAT:"flat",
        TOP_TURN:"top_turn"
    },

    DUCK_STATE:{
        WALK:"walk",
        SLIDE:"slide",
        SLEEP:"sleep",
        JUMP:"jump",
        UP_DOWN:"updown",
        FLY:"fly",
        FLASH:"flash",
        TOP_TURN:"topturn",
        FALL:"fall"
    },

    MON_COLOR:{              //蘑菇怪类型
        RED:"red",
        BLUE:"blue",
        GRAY:"gray",
        GREEN:"green",
        BLACK:"black",
        WHITE:"white"
    },

    FIRE_TYPE:{
        UP_DOWN:"updown",
        LEFT:"left"
    },

    FIRE_BALL_TYPE:{
        BIG:"big",
        SMALL:"small"
    },

    AEX_COLOR:{
        WHITE:"white",
        BLACK:"black"
    },

    BOSS_STATE:{
        WALK:"walk",
        FIRE:"fire",
        UP_DOWN:"updown",
        DIE:"die"
    },

    HELMET_STATE:{
        WALK:"walk",
        SLIDE:"slide",
        TOP_TURN:"top_turn",
        SLEEP:"sleep"
    },

    FISH_STATE:{
        DIE:"die",
        FLY:"fly",
        SWIM:"swim"
    },
    FISH_DIR:{
        LEFT:"left",
        RIGHT:"right"
    },
    PROP_TYPE:{                //==============================道具类型
        MUSHROOM:"mushroom",     //蘑菇
        STAR:"star",             //星星
        COIN:"coin",
        LIFE:"life",             //生命蘑菇
        CIRRUS:"cirrus",         //藤蔓
        LADDER:"ladder",          //梯子,
        STORY:"story",
        AEX:"aex",
        BABY:"baby",
        SPRING:"spring",
        BUBBLE:"bubble",
        WHEEL:"wheel",
        TRANSITION:"transition",
        ROADCHECK:"roadCheck",
        PRINCESS:"princess",
        CONDITIONTRAN:"conditionTran",
        ROADCLEAR:"roadClear"
     },


     PROP_COLOR:{           //蘑菇种类
        RED:"red",             //红色蘑菇（花朵
        BLUE:"blue",            //蓝色蘑菇（花朵
        GRAY:"gray",
        WHITE:"white"
     },




     LADDER_TYPE:{          //云梯类型
         WHITE:"white",
         SMALL:"small",
         BIG:"big",
         MID:"mid"
     },
     LADDER_DIR:{          //云梯运动方向
        UP:"up",
        DOWN:"down"
     },
     LADDER_MOVE_TYPE:{     //云梯运动方式
         MV:"mv",
         MH:"mh",
         RUP:"rup",
         RDOWN:"rdown",
         STOP:"stop"
     },
     STORY_TYPE:{
         "2_3_4":"2-3-4",
         "6_7_8":"6-7-8",
         "5":"5",
         SKY:"sky"
     },
     //========================================position==============
     POSITION_TYPE:{
         MAP_FIXED:"mapFixed",
         PIPE_START:"pipeStart",
         ROUND:"round"
     },
     PIPE_POS_TYPE:{        //管道传送点类型
        LAND:"land",
        AIR:"air"   
     }
     
 }