cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel:cc.Label,
        timeLabel:cc.Label,
        initBool:false,
    },

    init(gameCtl,gameModel){
        this.gameCtl = gameCtl;
        this.gameModel = gameModel;
        this.scoreLabel.string = '0';
        this.timeLabel.string = '0.0';
        this.initBool = true;
    },

    update(dt){
        if(this.initBool){
            if(this.gameCtl.physicsManager.enabled === true){
                this.gameModel.updateTime(dt);
            }
    
            this.timeLabel.string = (this.gameModel.currentTime <= 0.0)?('0.0'):(this.gameModel.showTime);
        }
    },

    updateScore(score){
        this.scoreLabel.string = score;
    },
});
