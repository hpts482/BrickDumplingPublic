cc.Class({
    extends: cc.Component,

    properties: {
        score:0,
        bricksNumber:0,
        
        currentStage:0, //当前积分

    },

    init(){
        this.score = 0;
        this.bricksNumber = 50;
        this.currentStage = 1;

        //console.log(self.jsonTest);
        //this.stageLevel = this.readstageLevel(self);
        //console.log(this.stageLevel);
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

    readJson(gameCtrl){
        let self = this;
        this.gameCtrl = gameCtrl;
        let url = ['test','stageLevel'];
        
        cc.loader.loadResArray(url,function(err,obj){
            if(err){
                console.log(err);
                return;
            }
            console.log("111");
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
                            console.log(self.jsonAll[y].json.contents[x].guardLayout);
                            console.log(self.jsonAll[y].json.contents[x].guardType);
                            console.log(self.jsonAll[y].json.contents[x].guardStrengthMin);
                            console.log(self.jsonAll[y].json.contents[x].guardStrengthMax);
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
