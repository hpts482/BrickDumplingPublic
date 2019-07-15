const GameModel = require('GameModel');
cc.Class({
    extends: cc.Component,

    properties: {
        gameView: require('GameView'),
        ball: require('Ball'),
        paddle: require('Paddle'),
        brickLayout: require('BrickLayout'),
       // overPanel: require('OverPanel'),
        overPanel:{
            default:null,
            type:cc.require('OverPanel'),
        },
    },

    // use this for initialization
    onLoad: function () {
        //安卓返回键退出
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
            if (event.keyCode === cc.KEY.back) {
                cc.director.end();
            }
            else if (event.keyCode === cc.KEY.b) {
                cc.director.pause();
            }
            else if (event.keyCode === cc.KEY.c) {
                cc.director.resume();
            }
             //加速
            else if (event.keyCode === cc.macro.KEY.q) { 
                this.ball.ballVelocityDown();
            }
             //减速
            else if (event.keyCode === cc.macro.KEY.w) { 
                this.ball.ballVelocityUp();
            }

        });
        this.physicsManager = cc.director.getPhysicsManager();
        this.gameModel = new GameModel();
        this.startGame();

    },

    //this.physicsManager.debugDrawFlags =0;
    // cc.PhysicsManager.DrawBits.e_aabbBit |
    // cc.PhysicsManager.DrawBits.e_pairBit |
    // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    // cc.PhysicsManager.DrawBits.e_jointBit |
    // cc.PhysicsManager.DrawBits.e_shapeBit
    // ; 

    init() {
        this.physicsManager.enabled = true;
        this.gameModel.readJson(this);
    },

    initAfter(){
        this.gameModel.init();
        this.gameView.init(this,this.gameModel);
        this.ball.init(this);
        this.paddle.init();
        this.brickLayout.init(this.gameModel,this.gameModel.jsonAll,this.gameModel.currentStage);
        this.overPanel.init(this);
    },

    //下个关卡初始化
    initNextStage(){ 
        //加分并显示
        this.gameModel.addScore(500);
        this.gameView.updateScore(this.gameModel.score);
        
        //关卡+1,时间+5
        this.gameModel.addStage(1);
        this.gameModel.addTime(5);

        //初始化球和板子
        this.ball.initNextStage();
        this.paddle.initNextStage();

        //关卡布局
        this.brickLayout.init(this.gameModel,this.gameModel.jsonAll,this.gameModel.currentStage);
        
        //隐藏over界面
        this.overPanel.initNextStage();

        //开启刚体物理
        this.physicsManager.enabled = true;
        
    },

    startGame() {
        this.init();
    },

    pauseGame() {

        if(this.physicsManager.enabled){
            this.physicsManager.enabled = false;
            this.paddle.node.parent.pauseSystemEvents(true);
        }
        else{
            this.physicsManager.enabled = true;
            this.paddle.node.parent.resumeSystemEvents(true);
        }

    },

    stopGame(type) {
        this.physicsManager.enabled = false;

        //最后一关处理
        if(this.gameModel.currentStage >= this.gameModel.jsonAll[1].json.total){
            
            console.log('最后一关啦！');
        }

        //死亡处理
        else if (type === 'dead'){
            console.log('四啦！');
            this.overPanel.show(this.gameModel.score, false);
        }

        //进入下一关处理
        else if (this.gameModel.bricksNumber <= 0)
        {
            this.overPanel.show(this.gameModel.score, true);
        }

    },

    onBallContactBrick(ballNode, brickNode) {
        brickNode.parent = null;
        brickNode.destroy();
        this.gameModel.addScore(1);
        this.gameModel.minusBrick(1);
        this.gameView.updateScore(this.gameModel.score);
        if (this.gameModel.bricksNumber <= 0) {
            this.stopGame();
        }
    },

    onBallContactGround(ballNode, groundNode) {
        this.stopGame('dead');
    },

    onBallContactPaddle(ballNode, paddleNode) {

    },

    onBallContactWall(ballNode, brickNode) {

    },

    onDestroy() {
        this.physicsManager.enabled = false;
    },


});