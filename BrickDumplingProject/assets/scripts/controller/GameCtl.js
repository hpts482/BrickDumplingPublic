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
        itemPrefab:cc.Prefab,
        cannonPrefab:cc.Prefab,
        powerOnBool:false, // 能量开启的开关
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
                this.gameModel.addGold(1);
            }

        });
        this.physicsManager = cc.director.getPhysicsManager();
        this.gameModel = new GameModel();
        this.audioMgr = new AudioManager();
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
        this.physicsManager.enabled = true;
        this.gameModel.readJson(this);
    },

    initAfter(){
        //初始化能量
        this.powerOnBool = false; 
        //初始化boss是否在持续释放技能
        this.bossSkillOnNum = 0;

        this.powerOn();

        this.gameModel.init();
        this.gameView.init(this,this.gameModel);
        this.ball.init(this);
        this.paddle.init();
        this.brickLayout.init(this.gameModel,this.gameModel.jsonAll,this.gameModel.currentStage,this);

        //其他界面
        this.overPanel.init(this);
        this.shopPanel.init(this);
        this.security.init(this);
        this.pausePanel.init(this);

        //生成炮台
        this.instCannon();
        //发球
        this.startCannon(1);
    },

    //是否显示商店
    isShop(){
        if(Number(this.gameModel.jsonAll[1].json.contents[this.gameModel.currentStage - 1].boss) > 0){
            this.shopPanel.show(this.gameModel);
            this.audioMgr.PlaySoundClip(this.AudioParam.BallServe);
        }
        else{
            this.initNextStage();
        }   
    },

    //下个关卡初始化
    initNextStage(){ 
        //加分并显示
        this.gameModel.addScore(500);
        this.gameView.updateScore(this.gameModel.score);
        
        //关卡+1,时间+5
        this.gameModel.addStage(1);
        this.gameModel.addTime(10);
        this.gameView.updateStage(this.gameModel.currentStage);

        //清空comb
        this.gameView.combPanel.fin();
        this.gameModel.zeroCombNum();

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


    },

    //生成炮台
    instCannon(){
        this.cannonNode = cc.instantiate(this.cannonPrefab);
        this.cannonNode.parent = cc.find("PhysicsLayer/paddle_area/cannonPosition");
        this.cannonNode.getComponent(cc.Component).init(this);
    },

    //发球或发辅助球，参数1代表主球，参数2代表辅球
    startCannon(type){
        this.cannonNode.getComponent(cc.Component).serveBall(type);
        this.audioMgr.PlaySoundClip(this.AudioParam.BallServe);
    },

    startGame() {
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
        }
    },

    stopGame(type) {
        this.physicsManager.enabled = false;

        //停止发球计时器
        this.unschedule(this.restartBallScheduleOnce);

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
            this.overPanel.show(this.gameModel.score, true);
            this.audioMgr.PlaySoundClip(this.AudioParam.PanelWin);
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
            
            //执行关卡胜利判断
            this.isMissionCompleted(brickNode);
        }
        else{
            brickNode.getComponent(cc.Component).updateStr();
        }

        //增加能量
        this.gameModel.addPower(50);
        this.gameView.updatePower(this.gameModel.power);

        //增加comb
        this.onComb(true);

        this.audioMgr.PlaySoundClip(this.AudioParam.BallHitBrick);
    },

    onBallContactGround(ballNode, groundNode) {
        //隐藏小球
        this.ball.isActive(false);

        //扣除时间
        this.gameModel.minusTime(3);

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
    
                //能量递减阻碍不可拾取
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
            }
        }
        this.audioMgr.PlaySoundClip(this.AudioParam.SkillGet);
    },

    instItem(position){
        let itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.parent = cc.find("PhysicsLayer/brick_layout");
        itemPrefab.position = position;
        itemPrefab.getComponent('Item').init(this);
    },

    powerOn(){
        this.ball.powerBallBig(this.powerOnBool);
        switch(this.powerOnBool){
            case true:
                this.gameView.colPower(new cc.Color(255,168,168));
                break;
            case false:
                this.gameView.colPower(cc.Color.WHITE);
                break;
        }
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
        switch(skillNum){
            //1、暂时加速。2、强化前锋。3、减能量。4、砖块雨。5、生成底排屏障。6、反向反弹。7、增加所有砖块护甲
            case 1:
                //开启持续技能开关
                this.bossSkillOnNum = 1;
                //赋值加速速度倍率和持续时间
                let VelocityNum = 1 + skillStrength * 0.1;
                let VelocityTime = Math.floor (3 + skillStrength * 0.5);
                console.log('**********开始brickBossSkill(ctrl)*************开关：'+this.bossSkillOnNum + '速度：'+ VelocityNum + '持续时间' + VelocityTime);
                //执行加速
                this.ball.bossSkillBallQuick(true,VelocityNum);
                //持续时间后自动恢复
                this.funBossSkillBallQuick = function(){
                    this.ball.bossSkillBallQuick(false);
                }
                this.scheduleOnce(this.funBossSkillBallQuick,VelocityTime);
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
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
    
    onDestroy() {
        this.physicsManager.enabled = false;
    },
    
});
