
cc.Class({
    extends: cc.Component,

    properties: {
        scoreBrick:0,        //砖块基础分数
        scoreCombParam:0,    //砖块comb加成分系数
        scoreItem:0,         //道具分
        scoreTime:0,         //时间转积分系数
    },

    init(gameCtl){
        this.gameCtl = gameCtl;
    },

    addScoreStage(){
        this.gameCtl.gameModel.addScore(Number(this.gameCtl.gameModel.jsonAll[1].json.contents[this.gameCtl.gameModel.currentStage-1].score));
    },
    addScoreBrick(){
        let score = this.scoreBrick + this.gameCtl.gameModel.combNum * this.scoreCombParam;
        this.gameCtl.gameModel.addScore(score);
    },
    addScoreItem(){
        this.gameCtl.gameModel.addScore(this.scoreItem);
    },
    addScoreTime(){
        //换算需要减的时间
        let time = this.gameCtl.gameModel.currentTime / 2;

        //加分
        this.gameCtl.gameModel.addScore(Math.floor(time * this.scoreTime));

        //减时间
        this.gameCtl.gameModel.minusTime(time);
    },
});
