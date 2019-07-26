const GameModel = require('GameModel');
cc.Class({
    extends: cc.Component,

    properties: {
        gameView: require('GameView'),
        ball: require('Ball'),
        paddle: require('Paddle'),
        brickLayout: require('BrickLayout'),
        overPanel: require('OverPanel'),
        itemPrefab:cc.Prefab,
        powerOnBool:false, // 能量开启的开关
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
        //初始化能量
        this.powerOnBool = false; 
        this.powerOn();

        this.gameModel.init();
        this.gameView.init(this,this.gameModel);
        this.ball.init(this);
        this.paddle.init();
        this.brickLayout.init(this.gameModel,this.gameModel.jsonAll,this.gameModel.currentStage,this);
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
        this.gameView.updateStage(this.gameModel.currentStage);

        //初始化球和板子
        this.ball.initNextStage();
        this.paddle.initNextStage();

        //关卡布局
        this.brickLayout.init(this.gameModel,this.gameModel.jsonAll,this.gameModel.currentStage,this);
        
        //隐藏over界面
        this.overPanel.initNextStage();

        //初始化能量
        this.powerOnBool = false;
        this.powerOn();

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
        let brickStr = brickNode.getComponent(cc.Component).minusStr(1);

        //砖块减强度&加分
        if(brickStr<=0){
            brickNode.parent = null;
            brickNode.destroy();
            this.gameModel.addScore(1);
            this.gameModel.minusBrick(1);
            this.gameView.updateScore(this.gameModel.score);
            if (this.gameModel.bricksNumber <= 0) {
                this.stopGame();
            }
        }
        else{
            brickNode.getComponent(cc.Component).updateStr();
        }

        //增加能量
        this.gameModel.addPower(50);
        this.gameView.updatePower(this.gameModel.power);
    },

    onBallContactGround(ballNode, groundNode) {
        this.stopGame('dead');
    },

    onBallContactPaddle(ballNode, paddleNode) {

    },

    onBallContactWall(ballNode, brickNode) {

    },

    /*onItemContactBall(itemNode, ball) {
        itemNode.parent = null;
        itemNode.destroy();
        this.gameModel.addTime(10);
    },*/

    onItemContactPaddle(itemNode, paddle) {
        itemNode.parent = null;
        itemNode.destroy();
        this.gameModel.addTime(10);
    },

    instItem(position,type){
        let itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.parent = cc.find("PhysicsLayer/brick_layout");
        itemPrefab.position = position;
        itemPrefab.getComponent('Item').init(this,type);
    },

    powerOn(){
        switch(this.powerOnBool){
            case true:
                this.ball.powerBallBig(this.powerOnBool);
                this.gameView.colPower(cc.Color.RED);
                break;
            case false:
                this.ball.powerBallBig(this.powerOnBool);
                this.gameView.colPower(cc.Color.WHITE);
                break;
        }
    },

    onDestroy() {
        this.physicsManager.enabled = false;
    },




});