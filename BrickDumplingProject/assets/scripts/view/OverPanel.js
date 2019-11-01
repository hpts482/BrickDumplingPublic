cc.Class({
    extends: cc.Component,

    properties: {
        resultLabel:cc.Label,

        winPanel:cc.Node,
        fallPanel:cc.Node,
        bossPanel:cc.Node,
        winAnimPanel:cc.Node,
        fallAnimPanel:cc.Node,

        winStage:cc.Label,
        winScoreLabel:cc.Label,
        winScoreAddLabel:cc.Label,
        winTimeLabel:cc.Label,
        winTimeAddLabel:cc.Label,
        winBossGoldLabel:cc.Label,
        
        fallScoreLabel:cc.Label,

        winAnim:cc.Animation,
        fallAnim:cc.Animation,
    },

    // use this for initialization
    onLoad: function () {

    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        this.node.active = false;

        this.winPanel.active = false;
        this.fallPanel.active = false;
        this.bossPanel.active = false;
        this.winAnimPanel.active = false;
        this.fallAnimPanel.active = false;
    },

    initNextStage(){
        this.node.active = false;

        this.winPanel.active = false;
        this.fallPanel.active = false;
        this.bossPanel.active = false;
        this.winAnimPanel.active = false;
        this.fallAnimPanel.active = false;
    },

    show(score,isWin){
        //获取并初始化按钮
        let startNode = this.node.getChildByName('btn_start');
        let nextNode = this.node.getChildByName('btn_next');
        startNode.active = true;
        nextNode.active = true;

        this.node.active = true;

        if(isWin){
            //this.resultLabel.string = 'YOU WIN!';
            startNode.active = false;

            //显示胜利界面
            this.winPanel.active = true;
            this.winStage.string = this.gameCtl.gameModel.currentStage;
            this.winScoreLabel.string = score - Number(this.gameCtl.gameModel.jsonAll[1].json.contents[this.gameCtl.gameModel.currentStage-1].score);
            this.winScoreAddLabel.string = '+' + Number(this.gameCtl.gameModel.jsonAll[1].json.contents[this.gameCtl.gameModel.currentStage-1].score);
            this.winTimeLabel.string = this.gameCtl.gameModel.showTime;
            this.winTimeAddLabel.string = '+' + this.gameCtl.gameModel.jsonAll[1].json.contents[this.gameCtl.gameModel.currentStage-1].addTime;

            //显示胜利动画
            this.winAnimPanel.active = true;
            this.winAnim.play('resultWin');

            //判断是否是boss关
            if(Number(this.gameCtl.gameModel.jsonAll[1].json.contents[this.gameCtl.gameModel.currentStage-1].boss)){
                this.bossPanel.active = true;
                this.winBossGoldLabel.string ='+' + Math.floor(this.gameCtl.gameModel.currentMission[1] * this.gameCtl.gameModel.currentMission[2]);
            }

        }else{
            //this.resultLabel.string = 'YOU LOSE!';
            nextNode.active = false;

            //显示失败界面
            this.fallPanel.active = true;
            this.fallScoreLabel.string = score;

            //显示失败动画
            this.fallAnimPanel.active = true;
            this.fallAnim.play('resultFall');
        }
    },

    onBtnRestart(){
        this.gameCtl.startGame();

        this.winAnim.stop();
        this.fallAnim.stop();
    },
    
    onBtnNextStage(){
        this.gameCtl.isShop();

        this.winAnim.stop();
        this.fallAnim.stop();
    },
});
