cc.Class({
    extends: cc.Component,

    properties: {
        resultLabel:cc.Label,
        scoreLabel:cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        this.node.active = false;
    },

    initNextStage(){
        this.node.active = false;
    },

    show(score,isWin){
        //获取并初始化按钮
        let startNode = this.node.getChildByName('btn_start');
        let nextNode = this.node.getChildByName('btn_next');
        startNode.active = true;
        nextNode.active = true;

        this.node.active = true;
        if(isWin){
            this.resultLabel.string = 'YOU WIN!';
            startNode.active = false;

        }else{
            this.resultLabel.string = 'YOU LOSE!';
            nextNode.active = false;
        }

        this.scoreLabel.string = score+'';
    },

    onBtnRestart(){
        this.gameCtl.startGame();
    },
    
    onBtnNextStage(){
        this.gameCtl.initNextStage();
    },
});
