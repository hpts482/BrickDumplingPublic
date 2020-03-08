cc.Class({
    extends: cc.Component,

    properties: {
        score:0,
        gold:0,
        bricksNumber:0,//当前关卡砖块数量

        currentMission:[],//当前关卡完成任务：[当前关卡任务type,当前关卡任务value,当前value]
        currentStage:0, //当前关卡

        currentTime:0.0,//当前剩余时间
        showTime:0.0,//显示剩余时间

        power:0.0,//能量
        itemLevel:[],//对应各个道具的等级

        combNum:0,//连打次数

        timeCountDown:0,//倒计时状态需要时间

        brickStrColor:[cc.Color],    //砖块强度颜色
        brickBossStrColor:[cc.Color],//BOSS砖块强度颜色

    },

    init(){
        this.score = 0;
        this.gold = 0;
        this.bricksNumber = 0;
        this.currentStage = 1;

        this.currentTime = 60.0;
        this.showTime = 60.0;

        this.power = 0.0;
        this.combNum = 0;

        this.timeCountDown = 10;
        
        //初始化各个道具的等级
        for(let i=0; i < Number(this.jsonAll[2].json.total); i++){
            this.itemLevel[i] = 0;
        }

        //初始化普通砖块强度的颜色
        this.brickStrColor = [new cc.Color(188,239,188),new cc.Color(188,239,239),new cc.Color(188,188,239),new cc.Color(239,188,239),new cc.Color(239,188,188),new cc.Color(239,239,188)];
        this.brickBossStrColor = [new cc.Color(201,242,201),new cc.Color(200,241,241),new cc.Color(201,201,242),new cc.Color(240,199,240),new cc.Color(242,201,201),new cc.Color(242,242,201)];

    },

    initBrickNum(brickNum){
        this.bricksNumber = brickNum;
    },

    initMission(){
        let type = Number(this.jsonAll[1].json.contents[this.currentStage-1].missionType)
        let value = Number(this.jsonAll[1].json.contents[this.currentStage-1].missionValue);
        let current = 0;

        //打倒%砖块
        if(type == 1){
            value = Math.floor(value * this.bricksNumber / 100)
        }
        //打倒boss
        else if(type == 2){
            //每个砖块价值value金币数量
            value = value / this.bricksNumber;
        }
        this.currentMission = [type,value,current];
    },

    missionCurVal(n){
        this.currentMission[2] += n;
    },

    addScore(score){
        this.score += score;
    },

    addGold(gold){
        this.gold += gold;
    },

    minusGold(gold){
        this.gold -= gold;
    },

    minusBrick(n){
        this.bricksNumber -= n;
    },

    addStage(n){
        this.currentStage += n;
    },

    addItemLevel(id,n){
        this.itemLevel[id] += n;
    },

    addTime(n){
        this.currentTime += n;
    },

    minusTime(n){
        this.currentTime -= n;
    },

    updateTime(dt){
        if(this.currentTime >= 0 ){

            this.currentTime -= dt;
            if(this.currentTime <=0){
                this.gameCtrl.stopGame('dead');
            }
            this.showTime = this.currentTime.toFixed(1);
        }  
        else{
            this.gameCtrl.stopGame('dead');
        }
    },

    addPower(n){
        this.power = (this.power + n/100) > 1.0 ? 1.0 : (this.power + n/100);

        if(this.power >= 1.0 && !this.gameCtrl.powerOnBool){
            this.gameCtrl.powerOnBool = true;
            this.gameCtrl.powerOn();
        }
    },

    minusPower(n){
        //powerSlow记录能量递减的速度
        let powerSlow = 0;
        switch(this.itemLevel[3]){
            case 0:
                powerSlow = Number(this.jsonAll[2].json.contents[3].levelInit);
                break;
            case 1:
                powerSlow = Number(this.jsonAll[2].json.contents[3].level1);
                break;
            case 2:
                powerSlow = Number(this.jsonAll[2].json.contents[3].level2);
                break;
            case 3:
                powerSlow = Number(this.jsonAll[2].json.contents[3].level3);
                break;
        }

        //5是能量递减的默认速度阻碍值
        this.power = (this.power - (n/5)*(1 - powerSlow/100)) < 0.0 ? 0.0 : (this.power - (n/5)*(1 - powerSlow/100));

        if(this.power <= 0.0 && this.gameCtrl.powerOnBool){
            this.gameCtrl.powerOnBool = false;
            this.gameCtrl.powerOn();
        }
    },

    addCombNum(n){
        this.combNum += n;
    },

    zeroCombNum(){
        this.combNum = 0;
    },

    readJson(gameCtrl){
        let self = this;
        this.gameCtrl = gameCtrl;
        let url = ['test','stageLevel','item'];
        
        cc.loader.loadResArray(url,function(err,obj){
            if(err){
                console.log(err);
                return;
            }
            self.jsonAll = obj;
            
            //检查json读取
            /*for (let y=0; y < self.jsonAll.length; y++){
                for (let x=0; x < self.jsonAll[y].json.total; x++) {
                    switch(y){
                        case 0:
                            console.log(self.jsonAll[y].json.contents[x].key);
                            console.log(self.jsonAll[y].json.contents[x].string);
                            console.log(self.jsonAll[y].json.contents[x].int);
                            console.log(self.jsonAll[y].json.contents[x].intlong);
                            console.log(self.jsonAll[y].json.contents[x].float);
                            break;
                        case 1:
                            console.log(self.jsonAll[y].json.contents[x].key);
                            console.log(self.jsonAll[y].json.contents[x].boss);
                            console.log(self.jsonAll[y].json.contents[x].bossLayout);
                            console.log(self.jsonAll[y].json.contents[x].bossStrengthMin);
                            console.log(self.jsonAll[y].json.contents[x].bossStrengthMax);
                            console.log(self.jsonAll[y].json.contents[x].bossSkillNum);
                            console.log(self.jsonAll[y].json.contents[x].bossSkillStrength);
                            console.log(self.jsonAll[y].json.contents[x].missionType);
                            console.log(self.jsonAll[y].json.contents[x].missionValue);
                            console.log(self.jsonAll[y].json.contents[x].vanguardLayout);
                            console.log(self.jsonAll[y].json.contents[x].vanguardType);
                            console.log(self.jsonAll[y].json.contents[x].vanguardStrengthMin);
                            console.log(self.jsonAll[y].json.contents[x].vanguardStrengthMax);
                            console.log(self.jsonAll[y].json.contents[x].vanguardNumMin);
                            console.log(self.jsonAll[y].json.contents[x].vanguardNumMax);
                            console.log(self.jsonAll[y].json.contents[x].guardLayout);
                            console.log(self.jsonAll[y].json.contents[x].guardType);
                            console.log(self.jsonAll[y].json.contents[x].guardStrengthMin);
                            console.log(self.jsonAll[y].json.contents[x].guardStrengthMax);
                            console.log(self.jsonAll[y].json.contents[x].guardNumMin);
                            console.log(self.jsonAll[y].json.contents[x].guardNumMax);
                            console.log(self.jsonAll[y].json.contents[x].score);
                            console.log(self.jsonAll[y].json.contents[x].addTime);
                        case 2:
                            console.log(self.jsonAll[y].json.contents[x].key);
                            console.log(self.jsonAll[y].json.contents[x].type);
                            console.log(self.jsonAll[y].json.contents[x].name);
                            console.log(self.jsonAll[y].json.contents[x].tips);
                            console.log(self.jsonAll[y].json.contents[x].levelInit);
                            console.log(self.jsonAll[y].json.contents[x].level1);
                            console.log(self.jsonAll[y].json.contents[x].level2);
                            console.log(self.jsonAll[y].json.contents[x].level3);
                            console.log(self.jsonAll[y].json.contents[x].levelInitExtra);
                            console.log(self.jsonAll[y].json.contents[x].levelExtra1);
                            console.log(self.jsonAll[y].json.contents[x].levelExtra2);
                            console.log(self.jsonAll[y].json.contents[x].levelExtra3);
                            console.log(self.jsonAll[y].json.contents[x].levelPrice1);
                            console.log(self.jsonAll[y].json.contents[x].levelPrice2);
                            console.log(self.jsonAll[y].json.contents[x].levelPrice3);
                            console.log(self.jsonAll[y].json.contents[x].ratio);
                            break;
                    }
                }
            }*/

            self.gameCtrl.initLoadDyTexture();
        });
    },

    readDyTextureBrick(){
        //预加载相关资源
        let self = this;
        let url = ['dyTexture/brick/brick_10','dyTexture/brick/brick_20','dyTexture/brick/brick_30','dyTexture/brick/brick_40','dyTexture/brick/brick_50','dyTexture/brick/brick_60','dyTexture/brick/brickBoss_0'];
        
        //读取黑白图
        cc.loader.loadResArray(url,cc.SpriteFrame,function(err,obj){
            if(err){
                console.log(err);
                return;
            }

            self.spriteBrickArray = new Array();

            for(let i=0;i<obj.length;i++){
                self.spriteBrickArray[i] = obj[i];
            }

            console.log(self.spriteBrickArray);
            self.readDyTextureBrickBoss();
        });

        /*读取整个文件夹（原来不用叠色的处理方式）
            cc.loader.loadResDir(url,cc.SpriteFrame,function(err,obj){
            if(err){
                console.log(err);
                return;
            }
            //注意：打包之后的obj数据顺序是有问题的！！！需要进行排序才能正确使用！！
            //二维数组声明：1
            self.spriteBrickArray = new Array();

            for(let i=0;i<obj.length;i++){
                //二维数组声明：2
                if((i%6) == 0){
                    self.spriteBrickArray[Math.floor(i/6)] = new Array();
                }
                self.spriteBrickArray[Math.floor(i/6)][i%6] = obj[i];
            }

            console.log(self.spriteBrickArray);
            self.readDyTextureBrickBoss();
        });*/
    },

    readDyTextureBrickBoss(){
        //预加载相关资源
        let self = this;
        let url = ['dyTexture/brickBossEmoji/brickEmoji_1','dyTexture/brickBossEmoji/brickEmoji_2','dyTexture/brickBossEmoji/brickEmoji_3','dyTexture/brickBossEmoji/brickEmoji_4','dyTexture/brickBossEmoji/brickEmoji_5'];
        
        cc.loader.loadResArray(url,cc.SpriteFrame,function(err,obj){
            if(err){
                console.log(err);
                return;
            }
            //数组声明
            self.spriteBrickBossArray = new Array();

            for(let i=0;i<obj.length;i++){
                self.spriteBrickBossArray[i] = obj[i];
            }

            console.log(self.spriteBrickBossArray);
            self.gameCtrl.initSubpackage();
        });
    },


    /*readJsonStageLevel(){
        let self = this;

        cc.loader.loadRes('stageLevel',function(err,obj){
            if(err){
                console.log(err);
                return;
            }
            console.log("222");
            self.stageLevel = obj;

            for (let x=0; x < obj.json.total; x++) {
                console.log(self.stageLevel.json.contents[x].key);
                console.log(self.stageLevel.json.contents[x].boss);
                console.log(self.stageLevel.json.contents[x].vanguardLayout);
                console.log(self.stageLevel.json.contents[x].vanguardType);
                console.log(self.stageLevel.json.contents[x].vanguardStrengthMin);
                console.log(self.stageLevel.json.contents[x].vanguardStrengthMax);
                console.log(self.stageLevel.json.contents[x].guardLayout);
                console.log(self.stageLevel.json.contents[x].guardType);
                console.log(self.stageLevel.json.contents[x].guardStrengthMin);
                console.log(self.stageLevel.json.contents[x].guardStrengthMax);
            }
        });
    },*/


});
