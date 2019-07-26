cc.Class({
    extends: cc.Component,

    properties: {
        score:0,
        bricksNumber:0,//当前关卡砖块数量
        currentStage:0, //当前关卡

        currentTime:0.0,//当前剩余时间
        showTime:0.0,//显示剩余时间

        power:0.0,//能量
    },



    init(){
        this.score = 0;
        this.bricksNumber = 0;
        this.currentStage = 1;

        this.currentTime = 60.0;
        this.showTime = 60.0;

        this.power = 0.0;
    },

    initBrickNum(brickNum){
        this.bricksNumber = brickNum;
    },


    addScore(score){
        this.score += score;
    },

    minusBrick(n){
        this.bricksNumber -= n;
    },

    addStage(n){
        this.currentStage += n;
    },

    addTime(n){
        this.currentTime += n;
    },

    updateTime(dt){
        if(this.currentTime >= 0 ){

            this.currentTime -= dt;
            if(this.currentTime <=0){
                this.gameCtrl.stopGame('dead');
            }
            this.showTime = this.currentTime.toFixed(1);
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
        this.power = (this.power - n/10) < 0.0 ? 0.0 : (this.power - n/10);

        if(this.power <= 0.0 && this.gameCtrl.powerOnBool){
            this.gameCtrl.powerOnBool = false;
            this.gameCtrl.powerOn();
        }
    },

    readJson(gameCtrl){
        let self = this;
        this.gameCtrl = gameCtrl;
        let url = ['test','stageLevel'];
        
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
                            break;
                    }
                }
            }*/

            self.gameCtrl.initAfter();
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
