cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel:cc.Label,
        timeLabel:cc.Label,
        stageLabel:cc.Label,
        goldLabel:cc.Label,
        powerProgress:cc.ProgressBar,
        initBool:false,
    },

    init(gameCtl,gameModel){
        this.gameCtl = gameCtl;
        this.gameModel = gameModel;
        this.scoreLabel.string = '0';
        this.timeLabel.string = '0.0';
        this.stageLabel.string = '1';
        this.goldLabel.string = '0';

        
        this.initBool = true; //确认初始化完成

        this.updatePower(this.gameModel.power);
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

    colPower(color){
        this.powerProgress.node.getChildByName('bar').color = color;
    },
});
