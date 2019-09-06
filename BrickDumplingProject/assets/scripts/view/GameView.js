cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel:cc.Label,
        timeLabel:cc.Label,
        stageLabel:cc.Label,
        goldLabel:cc.Label,
        missionLabel:cc.Label,
        powerProgress:cc.ProgressBar,
        restartBallLabel:cc.Label,
        initBool:false,
    },

    init(gameCtl,gameModel){
        this.gameCtl = gameCtl;
        this.gameModel = gameModel;
        this.scoreLabel.string = '0';
        this.timeLabel.string = '0.0';
        this.stageLabel.string = '1';
        this.goldLabel.string = '0';
        this.restartBallLabel.node.active = false;

        this.initBool = true; //确认初始化完成

        this.updatePower(this.gameModel.power);
        this.updateMission(); //刷新任务
    },

    update(dt){
        if(this.initBool){
            if(this.gameCtl.physicsManager.enabled === true){
                //更新时间
                this.gameModel.updateTime(dt);
                this.timeLabel.string = (this.gameModel.currentTime <= 0.0)?('0.0'):(this.gameModel.showTime);

                //powerOn时更新能量条
                if(this.gameCtl.powerOnBool){
                    this.gameModel.minusPower(dt);
                    this.updatePower(this.gameModel.power);
                }
            }
        }
    },

    updateScore(score){
        this.scoreLabel.string = score;
    },

    updatePower(power){
        this.powerProgress.progress = power;
    },

    updateStage(stage){
        this.stageLabel.string = stage;
    },

    updateGold(gold){
        this.goldLabel.string = gold;
    },

    updateMission(){
        if(this.gameModel.currentMission[0] == 1){
            let str = '消灭 x 敌人'
            str = str.replace(/x/,String(this.gameModel.currentMission[2] + '/' + this.gameModel.currentMission[1]))
            this.missionLabel.string = str;
        }
        else if(this.gameModel.currentMission[0] == 2){
            let str ='消灭 Boss'
            this.missionLabel.string = str;   
        }
    },

    colPower(color){
        this.powerProgress.node.getChildByName('bar').color = color;
    },

    showRestartBallLabel(bool){
        this.restartBallLabel.node.active = bool;
    },
});
