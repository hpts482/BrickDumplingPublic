cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel:cc.Label,
        timeLabel:cc.Label,
    },

    init(gameCtl,gameModel){
        this.gameCtl = gameCtl;
        this.gameModel = gameModel;
        this.scoreLabel.string = '0';
        this.timeLabel.string = '0.0';
    },

    update(dt){
        if(this.gameCtl.physicsManager.enabled){
            this.gameModel.updateTime(dt);
        }

        this.timeLabel.string = (this.gameModel.currentTime <= 0.0)?('0.0'):(this.gameModel.showTime);
    },

    updateScore(score){
        this.scoreLabel.string = score;
    },
});
