const GameModel = require('GameModel');
var AudioManager = require('AudioManager');
cc.Class({
    extends: cc.Component,

    properties: {
        gameView: require('GameView'),
        ball: require('Ball'),
        paddle: require('Paddle'),
        brickLayout: require('BrickLayout'),
        overPanel: require('OverPanel'),
        shopPanel:require('ShopPanel'),
        security:require('Security'),
        pausePanel:require('PausePanel'),
        AudioParam:require('AudioParam'),
        scoreManager:require('ScoreManager'),
        itemPrefab:cc.Prefab,
        cannonPrefab:cc.Prefab,
        parachutePrefab:cc.Prefab,
        CountDownPrefab:cc.Prefab,
        brickDisappearParticle:cc.Prefab,

        powerOnBool:false, // 能量开启的开关
        countDownBool:false, //倒计时时钟开启的开关
        bossSkillOnNum:0,// boss是否正在释放持续技能
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
             //加钱
            else if (event.keyCode === cc.macro.KEY.up){
                this.gameModel.addGold(1000);
            }
        });

        //加载子包
        /*let self = this;
        cc.loader.downloader.loadSubpackage('subTest', function (err) {
            //self.startGame();
            if (err) {
                return console.error(err);
            }
            console.log('load subpackage successfully.');
        });*/

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
        //gameView未初始化（防止update提前运行）
        this.gameView.isInit(false);

        this.audioMgr.Init(this);
        this.scoreManager.init(this);
        this.physicsManager.enabled = true;

        this.gameModel.readJson(this);
    },

    initLoadDyTexture(){
        this.gameModel.readDyTextureBrick();
    },

    initSubpackage(){
        let self = this;
        self.initAfter();
    },

    initAfter(){
        //初始化能量
        this.powerOnBool = false; 
        //初始化boss是否在持续释放技能
        this.bossSkillOnNum = 0;

        this.powerOn();

        this.gameModel.init();
        this.ball.init(this);
        this.paddle.init(this);
        this.brickLayout.init(this.gameModel,this.gameModel.jsonAll,this.gameModel.currentStage,this);

        //初始化关卡任务
        this.gameModel.initMission();

        //其他界面
        this.gameView.init(this,this.gameModel);
        this.overPanel.init(this);
        this.shopPanel.init(this);
        this.security.init(this);
        this.pausePanel.init(this);

        //生成炮台
        this.instCannon();
        //发球
        this.startCannon(1);

        //生成降落伞
        this.startParachute();

        //恢复倒计时时钟
        this.countDownBool = false;
        //清空时钟
        cc.find("PhysicsLayer/pos_countDown").removeAllChildren();

        //清空子弹
        cc.find("PhysicsLayer/pos_umbrellaBall").removeAllChildren();

        //清空砖块消失特效
        cc.find("PhysicsLayer/brick_disappearParticleLayout").removeAllChildren();
    },

    //是否显示商店
    isShop(){
        if(Number(this.gameModel.jsonAll[1].json.contents[this.gameModel.currentStage - 1].boss) > 0){
            //播放关卡过渡界面到商店界面切换动画
            let animOverPanelState = this.overPanel.getComponent(cc.Animation).play('resultStart');
            animOverPanelState.wrapMode = cc.WrapMode.Reverse;
            this.animOverPanelAniFin = function(){
                //显示商店界面
                this.shopPanel.show(this.gameModel);
                //播放商店出现动画
                this.shopPanel.getComponent(cc.Animation).play('shopPanelStart');
                //关闭监控
                animOverPanelState.off('finished',this.animOverPanelAniFin,this);
            }
            animOverPanelState.on('finished',this.animOverPanelAniFin,this);
        }
        else{
            this.initNextStage();
        }   
    },

    //下个关卡初始化
    initNextStage(){
        //停止所有计时器
        this.unscheduleAllCallbacks(); 

        //显示分数
        this.gameView.updateScore(this.gameModel.score);

        //时间+
        this.gameModel.addTime(Number(this.gameModel.jsonAll[1].json.contents[this.gameModel.currentStage-1].addTime));

        //恢复时间字体颜色
        this.gameView.colTime(new cc.Color(49,38,38));
        //恢复倒计时时钟
        this.countDownBool = false;
        //清空时钟
        cc.find("PhysicsLayer/pos_countDown").removeAllChildren();
        
        //关卡+1
        this.gameModel.addStage(1);
        this.gameView.updateStage(this.gameModel.currentStage);
        this.gameView.updateGold(this.gameModel.gold);

        //清空comb
        this.gameView.combPanel.fin();
        this.gameModel.zeroCombNum();

        //清空额外小球计数并清空小球
        this.cannonExtraNode.getComponent(cc.Component).initNextStage();
        cc.find("PhysicsLayer/ballExtra").removeAllChildren();

        //初始化球和板子
        this.ball.initNextStage();
        this.paddle.initNextStage();

        //关卡布局
        this.brickLayout.init(this.gameModel,this.gameModel.jsonAll,this.gameModel.currentStage,this);
        
        //隐藏其他界面
        this.overPanel.initNextStage();
        this.shopPanel.initNextStage();
        this.security.initNextStage();
        this.pausePanel.initNextStage();
        this.gameView.showRestartBallLabel(false);

        //初始加能量
        this.startPower();
        
        //初始化能量
        this.powerOnBool = false;
        this.powerOn();

        //初始化boss技能释放
        this.bossSkillOnNum = 0;

        //初始化关卡任务
        this.gameModel.initMission();
        this.gameView.updateMission();

        //开启刚体物理
        this.physicsManager.enabled = true;

        //发球
        this.startCannon(1);

        //清空并生成降落伞
        cc.find("PhysicsLayer/pos_parachute").removeAllChildren();
        this.startParachute();

        //清空子弹
        cc.find("PhysicsLayer/pos_umbrellaBall").removeAllChildren();

    },

    //生成炮台
    instCannon(){
        //左侧炮台
        this.cannonNode = cc.instantiate(this.cannonPrefab);
        this.cannonNode.parent = cc.find("PhysicsLayer/paddle_area/cannonPosition");
        this.cannonNode.getComponent(cc.Component).init(this);

        //右侧炮台
        this.cannonExtraNode = cc.instantiate(this.cannonPrefab);
        this.cannonExtraNode.parent = cc.find("PhysicsLayer/paddle_area/cannonExtraPosition");
        this.cannonExtraNode.getComponent(cc.Component).init(this);

        //清空小球
        cc.find("PhysicsLayer/ballExtra").removeAllChildren();
    },

    //发球或发辅助球，参数1代表主球，参数2代表辅球
    startCannon(type){
        if(type == 1){
            this.cannonNode.getComponent(cc.Component).serveBall(type);
        }
        else if(type == 2){
            this.cannonExtraNode.getComponent(cc.Component).serveBall(type);
        }
        this.audioMgr.PlaySoundClip(this.AudioParam.BallServe);
    },
    
    //关卡开始时放降落伞
    startParachute(){
        //位置1 0~200
        //位置2 200~400
        //位置3 400~750
        this.parachuteNode = [];

        for(let i=0;i<=2;i++){
            this.parachuteNode[i] = cc.instantiate(this.parachutePrefab);
            this.parachuteNode[i].parent = cc.find("PhysicsLayer/pos_parachute");
            this.parachuteNode[i].getComponent(cc.Component).init(this,i);

            //布置位置，确定是否有团子
            if(i<2){
                this.parachuteNode[i].position = cc.v2( Math.floor(Math.random()*50) + 75 + i*200, Math.floor(Math.random()*50)-25);
            }
            else{
                this.parachuteNode[i].position = cc.v2( Math.floor(Math.random()*200) + 75 + i*200, Math.floor(Math.random()*50)-25);
            }
        }
    },

    //生成倒计时钟
    startCountDown(){
        if(!this.countDownBool){
            let CountDownPre = cc.instantiate(this.CountDownPrefab);
            CountDownPre.parent = cc.find("PhysicsLayer/pos_countDown");
            this.countDownBool = true;
        }
    },

    //初始加能量
    startPower(){
        //startPowerVal记录能量增加的百分比
        let startPowerVal = 0;
        switch(this.gameModel.itemLevel[5]){
            case 0:
                startPowerVal = Number(this.gameModel.jsonAll[2].json.contents[5].levelInit);
                break;
            case 1:
                startPowerVal = Number(this.gameModel.jsonAll[2].json.contents[5].level1);
                break;
            case 2:
                startPowerVal = Number(this.gameModel.jsonAll[2].json.contents[5].level2);
                break;
            case 3:
                startPowerVal = Number(this.gameModel.jsonAll[2].json.contents[5].level3);
                break;
        }
        this.gameModel.addPower(startPowerVal);
        this.gameView.updatePower(this.gameModel.power);
    },

    startGame() {
        this.physicsManager = cc.director.getPhysicsManager();
        this.gameModel = new GameModel();
        this.audioMgr = new AudioManager();
        this.init();
    },

    pauseGame() {
        if(this.physicsManager.enabled){
            cc.director.pause();
            this.physicsManager.enabled = false;
            this.paddle.node.parent.pauseSystemEvents(true);

            //显示暂停界面
            this.pausePanel.show();
            this.audioMgr.PlaySoundClip(this.AudioParam.PanelPause);
        }
        else{
            cc.director.resume();
            this.physicsManager.enabled = true;
            this.paddle.node.parent.resumeSystemEvents(true);
        }
    },

    //任务判断
    isMissionCompleted(brickNode){
        if(this.gameModel.currentMission[0] == 1){
            this.gameModel.missionCurVal(1);
            this.gameView.updateMission();
            if(this.gameModel.currentMission[2] >= this.gameModel.currentMission[1]){
                this.stopGame();
            }
            else{
            }
        }
        else if(this.gameModel.currentMission[0] == 2){
            console.log('是不是boss？'+typeof(brickNode.getComponent(cc.Component).bossType));
            if(typeof(brickNode.getComponent(cc.Component).bossType) != 'undefined'){
                //停止boss技能循环
                this.offBrickBossSkill(brickNode);

                //停止游戏
                this.stopGame();
            }
            else{
                //击杀砖块记录（用于结算发金币）
                this.gameModel.missionCurVal(1);
            }
        }
    },

    stopGame(type) {
        this.physicsManager.enabled = false;

        //停止发球计时器
        this.unschedule(this.restartBallScheduleOnce);

        //停止球技能-闪电计时器
        this.unschedule(this.progressSkillThunderStart);

        //停止boss持续技能
        if(this.bossSkillOnNum == 1){
            this.unschedule(this.funBossSkillBallQuick);
            this.ball.bossSkillBallQuick(false);
        }

        //最后一关处理
        if(this.gameModel.currentStage >= this.gameModel.jsonAll[1].json.total){
            
            console.log('最后一关啦！');
        }

        //死亡处理
        else if (type === 'dead'){
            console.log('四啦！');
            this.overPanel.show(this.gameModel.score, false);
            this.audioMgr.PlaySoundClip(this.AudioParam.PanelFail);
        }

        //进入下一关处理
        else{
            //播放球到界面的过渡动画---------------------------------------------------------
            this.ball.isActive(false);
            
            //打开图层
            this.ball.ballStageOver.node.active = true;
            this.ball.ballStageOverBg.node.active = true;

            //确认位置并恢复大小
            this.ball.ballStageOver.node.position = this.ball.node.position;
            this.ball.ballStageOver.node.scale = 1;
            this.ball.ballStageOver.node.opacity = 255;
            this.ball.ballStageOver.node.getChildByName('par').getComponent(cc.ParticleSystem).resetSystem();

            //确认回调
            let seqFinished = cc.callFunc(function() {
                //关卡加分
                this.scoreManager.addScoreStage();

                //boss加金币
                if(Number(this.gameModel.jsonAll[1].json.contents[this.gameModel.currentStage-1].boss)){
                    this.gameModel.addGold(Math.floor(this.gameModel.currentMission[1] * this.gameModel.currentMission[2]));
                }

                //关闭背景图
                this.ball.ballStageOverBg.node.active = false;
                
                this.overPanel.show(this.gameModel.score, true);
                this.audioMgr.PlaySoundClip(this.AudioParam.PanelWin);
            }, this);

            //顺序播放动画
            let seq = cc.sequence(
                cc.moveBy(0.8,cc.v2(0,100)).easing(cc.easeElasticOut(3)),
                cc.scaleTo(0.1,1.2,0.9),
                cc.scaleTo(0.1,0.9,1.1),
                cc.scaleTo(0.05,1),
                cc.spawn(
                    cc.rotateBy(0.4,1080).easing(cc.easeElasticIn(3)),
                    cc.sequence(
                        cc.delayTime(0.1),
                        cc.moveBy(0.2,cc.v2(0,10)).easing(cc.easeElasticOut(3)),
                        cc.spawn(
                            cc.moveBy(0.6,cc.v2(0,-100)).easing(cc.easeElasticOut(3)),
                            cc.scaleTo(0.3,0),
                        ),

                    ),
                ),
                seqFinished,
            );

            //播放动画
            this.ball.ballStageOver.node.runAction(seq);
            //播放球到界面的过渡动画逻辑完毕---------------------------------------------------------
        }

    },

    onBallContactBrick(ballNode, brickNode) {
        //受击变白
        brickNode.getComponent(cc.Component).flashWhite();

        //减防
        this.brickMinusStr(brickNode,1);

        //增加能量
        this.gameModel.addPower(20);
        this.gameView.updatePower(this.gameModel.power);

        //增加comb
        this.onComb(true);

        this.audioMgr.PlaySoundClip(this.AudioParam.BallHitBrick);
    },

    //砖块减防通用判断
    brickMinusStr(brickNode,n){
        let brickStr = brickNode.getComponent(cc.Component).minusStr(n);

        //砖块减强度&加分&判胜负
        if(brickStr<=0 && brickNode.parent && !brickNode.getComponent(cc.Component).boolDestroy){
            //砖块消失动画(砖块删除在播放之后)
            brickNode.getComponent(cc.Component).actDisappear();

            this.scoreManager.addScoreBrick();
            this.gameModel.minusBrick(1);
            this.gameView.updateScore(this.gameModel.score);
            
            //执行关卡胜利判断
            this.isMissionCompleted(brickNode);
        }
        else if(brickStr>0){
            brickNode.getComponent(cc.Component).updateStr();
        }
    },

    onBallContactGround(ballNode, groundNode) {
        //判断是大球还是小球
        if(ballNode.getComponent(cc.PhysicsCollider).tag == 9){
            //隐藏球
            this.ball.isActive(false);

            //扣除时间
            this.gameModel.minusTime(5);

            //显示重新发球lab
            this.gameView.showRestartBallLabel(true);

            //重新发球处理
            console.log('重新发球');
            this.restartBallScheduleOnce = function(dt){
                this.gameView.showRestartBallLabel(false);
                this.startCannon(1);
            }
            this.scheduleOnce(this.restartBallScheduleOnce,2);

            //取消comb
            this.onComb(false);
        }
        else if(ballNode.getComponent(cc.PhysicsCollider).tag == 7){
            ballNode.destroy();
        }
    },

    onBallContactPaddle(ballNode, paddleNode) {
        //取消comb
        this.onComb(false);
        this.audioMgr.PlaySoundClip(this.AudioParam.BallHitPaddle);
    },

    onBallContactWall(ballNode, brickNode) {
        this.audioMgr.PlaySoundClip(this.AudioParam.BallHitWall);
    },

    onBallContactSecurity(ballNode, brickNode) {
        //取消comb
        this.onComb(false);
        this.audioMgr.PlaySoundClip(this.AudioParam.BallHitWall);
    },

    onBallContactParachute(ballNode, brickNode) {
        if(brickNode.getComponent(cc.Component).itemBool){
            //防重
            brickNode.getComponent(cc.Component).itemBool = false;
            
            let posParachuteWorld = cc.v2(0,0);
            let posParachuteLocal = cc.v2(0,0);
            //本地转世界
            posParachuteWorld = brickNode.getChildByName('box').convertToWorldSpace(cc.v2(0,0));
            //世界转本地
            posParachuteLocal = this.brickLayout.node.convertToNodeSpaceAR(posParachuteWorld);
            //生成道具
            this.instItem(posParachuteLocal);
            //确认是否有团子
            brickNode.getComponent(cc.Component).isDumpling(posParachuteWorld);
            brickNode.destroy();
            this.audioMgr.PlaySoundClip(this.AudioParam.BallHitWall);
        }
    },

    onBallContactCountDown(ballNode, brickNode) {
        //生成时间道具
        let posCountDown = cc.v2(0,0);
        //世界转本地，本地转世界
        posCountDown = brickNode.convertToWorldSpace(cc.v2(0,0));
        posCountDown = this.brickLayout.node.convertToNodeSpaceAR(posCountDown);
        //生成道具
        this.instItem(posCountDown,1);
        //删除自身
        brickNode.destroy();

        this.audioMgr.PlaySoundClip(this.AudioParam.BallHitWall);
    },

    /*onItemContactBall(itemNode, ball) {
        itemNode.parent = null;
        itemNode.destroy();
        this.gameModel.addTime(10);
    },*/

    onItemContactPaddle(itemNode,paddle,type) {
        if(itemNode.active){
            itemNode.parent = null;
            itemNode.destroy();
            switch(type){
                //拾取加时间道具
                case 1:
                    this.gameModel.addTime(Number(this.gameModel.jsonAll[2].json.contents[type-1].levelInit));
                    //恢复时间字体颜色
                    if(this.gameModel.currentTime > this.gameModel.timeCountDown){
                        this.gameView.colTime(new cc.Color(49,38,38));
                    }
                    break;
    
                //拾取加能量道具
                case 2:
                    this.gameModel.addPower(Number(this.gameModel.jsonAll[2].json.contents[type-1].levelInit));
                    this.gameView.updatePower(this.gameModel.power);
                    break;
    
                //拾取加金币道具
                case 3:
                    this.gameModel.addGold(Number(this.gameModel.jsonAll[2].json.contents[type-1].levelInit));
                    this.gameView.updateGold(this.gameModel.gold);
                    break;
    
                //能量递减阻碍不可拾取，在model的minusPower里找功能
                //case 4:
    
                //获取保底屏障
                case 5:
                    let securityTime = 0;
                    switch(this.gameModel.itemLevel[4]){
                        case 0:
                            securityTime = Number(this.gameModel.jsonAll[2].json.contents[4].levelInit);
                            break;
                        case 1:
                            securityTime = Number(this.gameModel.jsonAll[2].json.contents[4].level1);
                            break;
                        case 2:
                            securityTime = Number(this.gameModel.jsonAll[2].json.contents[4].level2);
                            break;
                        case 3:
                            securityTime = Number(this.gameModel.jsonAll[2].json.contents[4].level3);
                            break;
                    }
                    this.security.show(securityTime);
                    break;
                
                //初始能量不可拾取
                //case 6:
                
                //弹板增长 7增长8延时都是一个道具
                case 7:
                case 8:
                    let length = 0;
                    let lengthenTime = 0;
                    switch(this.gameModel.itemLevel[6]){
                        case 0:
                            length = Number(this.gameModel.jsonAll[2].json.contents[6].levelInit);
                            break;
                        case 1:
                            length = Number(this.gameModel.jsonAll[2].json.contents[6].level1);
                            break;
                        case 2:
                            length = Number(this.gameModel.jsonAll[2].json.contents[6].level2);
                            break;
                        case 3:
                            length = Number(this.gameModel.jsonAll[2].json.contents[6].level3);
                            break;
                    }
                    switch(this.gameModel.itemLevel[7]){
                        case 0:
                            lengthenTime = Number(this.gameModel.jsonAll[2].json.contents[7].levelInit);
                            break;
                        case 1:
                            lengthenTime = Number(this.gameModel.jsonAll[2].json.contents[7].level1);
                            break;
                        case 2:
                            lengthenTime = Number(this.gameModel.jsonAll[2].json.contents[7].level2);
                            break;
                        case 3:
                            lengthenTime = Number(this.gameModel.jsonAll[2].json.contents[7].level3);
                            break;
                    }
                    this.paddle.lengthenPaddleOn((length/100)+1,lengthenTime);
                    break;

                //加额外球
                case 9:
                    //发球
                    this.startCannon(2);
                    break;

                //炮伞 10延时11加强都是一个道具
                case 10:
                case 11:
                    let UmbrellaLevel = 0;
                    let UmbrellaTime = 0;
                    switch(this.gameModel.itemLevel[9]){
                        case 0:
                            UmbrellaTime = Number(this.gameModel.jsonAll[2].json.contents[9].levelInit);
                            break;
                        case 1:
                            UmbrellaTime = Number(this.gameModel.jsonAll[2].json.contents[9].level1);
                            break;
                        case 2:
                            UmbrellaTime = Number(this.gameModel.jsonAll[2].json.contents[9].level2);
                            break;
                        case 3:
                            UmbrellaTime = Number(this.gameModel.jsonAll[2].json.contents[9].level3);
                            break;
                    }
                    switch(this.gameModel.itemLevel[10]){
                        case 0:
                            UmbrellaLevel = Number(this.gameModel.jsonAll[2].json.contents[10].levelInit);
                            break;
                        case 1:
                            UmbrellaLevel = Number(this.gameModel.jsonAll[2].json.contents[10].level1);
                            break;
                        case 2:
                            UmbrellaLevel = Number(this.gameModel.jsonAll[2].json.contents[10].level2);
                            break;
                        case 3:
                            UmbrellaLevel = Number(this.gameModel.jsonAll[2].json.contents[10].level3);
                            break;
                    }
                    this.paddle.UmbrellaOn(UmbrellaLevel,UmbrellaTime);
                    break;
            }
            //加分并更新
            this.scoreManager.addScoreItem();
            this.gameView.updateScore(this.gameModel.score);

            this.audioMgr.PlaySoundClip(this.AudioParam.SkillGet);
        }
    },

    instItem(position,type){
        let itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.parent = cc.find("PhysicsLayer/brick_layout/itemLayout");
        itemPrefab.position = position;
        if(type > 0){
            itemPrefab.getComponent('Item').init(this,type);
        }
        else{
            itemPrefab.getComponent('Item').init(this);
        }
    },

    //技能球开放
    powerOn(){
        //播放技能球激活效果
        if(this.powerOnBool){
            this.ball.animProgressSkillStart();
        }
        //释放技能
        switch (this.ball.progressSkillNum) {
            case 1:
                //强力球
                this.ball.powerBallBig(this.powerOnBool);
                break;
            case 2:
                //闪电球
                this.ball.powerBallThunder(this.powerOnBool);
                break;
            case 3:
                //爆炸球
                this.ball.powerBallBomb(this.powerOnBool);
                break;
        }
        //进度条变色
        switch(this.powerOnBool){
            case true:
                this.gameView.colPower(new cc.Color(255,168,168));
                break;
            case false:
                this.gameView.colPower(cc.Color.WHITE);
                break;
        }
    },

    //闪电技能
    progressSkillThunder(ballNode, brickNode) {
        //关闭闪电开关
        this.ball.thunderOn = false;

        //获取闪电链点数和闪电链强度
        let thunderNum = 0;
        let thunderStrength = 0;
        switch(this.gameModel.itemLevel[12]){
            case 0:
                thunderNum = Number(this.gameModel.jsonAll[2].json.contents[12].levelInit);
                break;
            case 1:
                thunderNum = Number(this.gameModel.jsonAll[2].json.contents[12].level1);
                break;
            case 2:
                thunderNum = Number(this.gameModel.jsonAll[2].json.contents[12].level2);
                break;
            case 3:
                thunderNum = Number(this.gameModel.jsonAll[2].json.contents[12].level3);
                break;
        }
        switch(this.gameModel.itemLevel[12]){
            case 0:
                thunderStrength = Number(this.gameModel.jsonAll[2].json.contents[12].levelInitExtra);
                break;
            case 1:
                thunderStrength = Number(this.gameModel.jsonAll[2].json.contents[12].levelExtra1);
                break;
            case 2:
                thunderStrength = Number(this.gameModel.jsonAll[2].json.contents[12].levelExtra2);
                break;
            case 3:
                thunderStrength = Number(this.gameModel.jsonAll[2].json.contents[12].levelExtra3);
                break;
        }

        //第一个点还存在的话-额外伤害
        if(brickNode.isValid){
            this.brickMinusStr(brickNode,thunderStrength);
        }

        //每次随机一个砖块作为下一个目标，直到完成上限个数
        this.thunderTarge = new Array();
        this.thunderTargeI = 0;
        this.thunderTarge[0] = brickNode;
        let lastPosition = this.thunderTarge[0].position;

        this.progressSkillThunderStart = function(){
            if(this.physicsManager.enabled){
                //找点
                this.progressSkillThunderFoundPoint(this.thunderTarge);
                //证明下一个点已被找到
                if(this.thunderTarge.length>this.thunderTargeI+1){
                    //画线
                    let thunderNode = cc.instantiate(this.ball.progressSkillThunderShow);
                    thunderNode.parent = cc.find('PhysicsLayer/brick_layout/progressSkillThunderLayout');
                    thunderNode.getComponent(cc.Component).init(this,lastPosition,this.thunderTarge[this.thunderTargeI+1].position);
                    //下一个点的位置换为起点
                    lastPosition = this.thunderTarge[this.thunderTargeI+1].position;
                    //对下个点造成伤害
                    this.brickMinusStr(this.thunderTarge[this.thunderTargeI+1],thunderStrength);        
                    //增加comb
                    this.onComb(true);
                }
                if(this.thunderTargeI>=thunderNum-1){
                    //停止循环
                    this.unschedule(this.progressSkillThunderStart);

                    //闪电完毕，打开开关
                    this.scheduleOnce(function() {
                        this.ball.thunderOn = true;
                    }, 1);
                }
                this.thunderTargeI++;
            }
        }
        this.progressSkillThunderStart();
        this.schedule(this.progressSkillThunderStart,1);
    },

    //闪电技能-找点功能
    progressSkillThunderFoundPoint(thunderTarge){
        //获得获取前锋、后卫、boss、其他等节点里的所有砖块
        let thunderTargetPool = this.brickLayout.vanguardLayoutNode.children;
        thunderTargetPool = thunderTargetPool.concat(this.brickLayout.guardLayoutNode.children);
        thunderTargetPool = thunderTargetPool.concat(this.brickLayout.bossLayoutNode.children);
        thunderTargetPool = thunderTargetPool.concat(this.brickLayout.otherLayoutNode.children);

        //排重
        for(let i=0;i<thunderTargetPool.length;i++){
            for(let j=0;j<thunderTarge.length;j++){
                if(thunderTarge[j].isValid){
                    if(thunderTargetPool[i].x == thunderTarge[j].x && thunderTargetPool[i].y == thunderTarge[j].y){
                        thunderTargetPool.splice(i,1);
                        i--;
                        break;
                    }
                }
            }
        }

        //获取随机点
        if(thunderTargetPool.length>0){
            let thunderTargetPoolAddNum = Math.floor(Math.random()*thunderTargetPool.length);
            thunderTarge.push(thunderTargetPool[thunderTargetPoolAddNum]);
        }
    },

    //爆炸技能
    progressSkillBomb(ballNode, brickNode) {
        //关闭爆炸开关
        this.ball.bombOn = false;
        this.ball.ballBombOnAnim(false);

        //获取爆炸间隔和范围
        let bombCdRatio = 0;
        let bombExtent = 0;
        switch(this.gameModel.itemLevel[13]){
            case 0:
                bombCdRatio = Number(this.gameModel.jsonAll[2].json.contents[13].levelInit);
                break;
            case 1:
                bombCdRatio = Number(this.gameModel.jsonAll[2].json.contents[13].level1);
                break;
            case 2:
                bombCdRatio = Number(this.gameModel.jsonAll[2].json.contents[13].level2);
                break;
            case 3:
                bombCdRatio = Number(this.gameModel.jsonAll[2].json.contents[13].level3);
                break;
        }
        switch(this.gameModel.itemLevel[13]){
            case 0:
                bombExtent = Number(this.gameModel.jsonAll[2].json.contents[13].levelInitExtra);
                break;
            case 1:
                bombExtent = Number(this.gameModel.jsonAll[2].json.contents[13].levelExtra1);
                break;
            case 2:
                bombExtent = Number(this.gameModel.jsonAll[2].json.contents[13].levelExtra2);
                break;
            case 3:
                bombExtent = Number(this.gameModel.jsonAll[2].json.contents[13].levelExtra3);
                break;
        }

        //爆炸逻辑
        let bombNode = cc.instantiate(this.ball.progressSkillBombShow);
        bombNode.parent = cc.find('PhysicsLayer/brick_layout/progressSkillBombLayout');
        bombNode.getComponent(cc.Component).init(this,brickNode.position,bombCdRatio,bombExtent);

        //爆炸CD
        this.bombCd = function(){
            if(this.powerOnBool){
                this.ball.bombOn = true;
                this.ball.ballBombOnAnim(true);
            }
        }
        this.scheduleOnce(this.bombCd, Math.floor((100-bombCdRatio) * 0.05));
    },

    //巨大技能
    progressSkillBig(ballNode, brickNode) {
        this.brickMinusStr(brickNode,this.ball.bigStrength);
    },

    //开启boss技能
    onBrickBossSkill(brickNode){
        this.bossBrickNode = brickNode;
        brickNode.getComponent(cc.Component).onSkill();
        this.audioMgr.PlaySoundClip(this.AudioParam.BossSkill);
    },

    //关闭boss技能
    offBrickBossSkill(brickNode){
        brickNode.getComponent(cc.Component).offSkill();
    },

    //boss技能列表
    brickBossSkill(brickNode,skillNum,skillStrength){
        //skillNum = 5; //测试技能
        switch(skillNum){
            //1、暂时加速。2、随机位置生成砖块。3、强化前锋。4、生成可移动前锋。5、砖块雨。6、生成底排屏障。7、反向反弹。8、增加所有砖块护甲。9、隐身球
            case 1:
                //开启持续技能开关
                this.bossSkillOnNum = 1;
                //赋值加速速度倍率和持续时间
                let VelocityNum = 1 + skillStrength * 0.2;
                let VelocityTime = Math.floor (2 + skillStrength * 0.5);
                console.log('**********开始brickBossSkill(ctrl)*************开关：'+this.bossSkillOnNum + '速度：'+ VelocityNum + '持续时间' + VelocityTime);
                //执行加速
                this.ball.bossSkillBallQuick(true,VelocityNum,VelocityTime);
                //持续时间后自动恢复
                this.funBossSkillBallQuick = function(){
                    this.ball.bossSkillBallQuick(false);
                }
                this.scheduleOnce(this.funBossSkillBallQuick,VelocityTime);
                break;
            case 2:
                this.brickLayout.bossSkillInstRanBrick(skillStrength+1);
                this.brickBossSkillFin();
                break;
            case 3:
                //获取前锋所有子节点
                let vanguardChildren = this.brickLayout.vanguardLayoutNode.children;
                for(let i=0;i<vanguardChildren.length;i++){
                    vanguardChildren[i].getComponent(cc.Component).addStr(Math.floor(skillStrength/3 + 1));
                    vanguardChildren[i].getComponent(cc.Component).animBossSkill();
                }
                this.brickBossSkillFin();
                break;
            case 4:
                //强度和速度
                this.brickLayout.bossSkillInstMoveBrick(skillStrength+1,4);
                this.brickBossSkillFin();
                break;
            case 5:
                //强度和数量
                this.brickLayout.bossSkillInstBrickRain(skillStrength,skillStrength+6);
                this.brickBossSkillFin();
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
        }
    },

    //boss技能释放完毕
    brickBossSkillFin(){
        this.bossSkillOnNum = 0;
        if(this.physicsManager.enabled){
            this.bossBrickNode.getComponent(cc.Component).onSkill();
        }
    },

    //comb逻辑
    onComb(type){
        //type：true 代表+1comb，false代表停止comb
        if(type){
            this.gameModel.addCombNum(1);
            if(this.gameModel.combNum == 2){
                this.gameView.combPanel.on();
            }
            else if(this.gameModel.combNum > 2){
                this.gameView.combPanel.again(); 
            }
        }
        else{
            if(this.gameModel.combNum >= 2){
                this.gameView.combPanel.fin();
            }
            this.gameModel.zeroCombNum();
        }
    },

    //能量进度条显示
    progressSkillBar(progressSkillNum){
        this.gameView.updateProgress(progressSkillNum);
    },

    //砖块destroy触发效果
    instBrickParticleDisappear(pos){
        let brickDisPar = cc.instantiate(this.brickDisappearParticle);
        brickDisPar.parent = cc.find('PhysicsLayer/brick_disappearParticleLayout');
        brickDisPar.position = pos;
    },
    
    onDestroy() {
        this.physicsManager.enabled = false;
    },
    
});
