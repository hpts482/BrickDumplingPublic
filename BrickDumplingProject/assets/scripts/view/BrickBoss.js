cc.Class({
    extends: require('Brick'),

    properties: {
        bossType:0, //需要默认配置 1代表小boss，2代表大boss
        particleSkillPrepare:cc.ParticleSystem,
        particleSkillStart:cc.ParticleSystem,
        aniSkill:cc.Animation,
    },

    init(gameCtl,bossSkillNum,bossSkillStrength){
        this.gameCtl = gameCtl;
        this.bossSkillNum = bossSkillNum;
        this.bossSkillStrength = bossSkillStrength;

        //关闭粒子
        this.particleSkillPrepare.node.active = false;
        this.particleSkillStart.node.active = false;
        this.aniSkill.node.active = false;
    },

    updateStr(){
        let self = this;

        //获取砖块颜色、获取表情    6代表颜色砖块最大强度
        let brickEmojiNum = Math.floor((this.strength - 1) / 6) + 1;
        let brickSprNum = ((this.strength - 1) % 6) + 1;

        //显示砖块，资源已经在model加载完毕
        let obj = this.gameCtl.gameModel.spriteBrickArray[this.gameCtl.gameModel.spriteBrickArray.length-1];
        let objColor = this.gameCtl.gameModel.brickBossStrColor[brickSprNum-1];
        this.updataStrSpr(obj,objColor);

        //显示表情，表情非0执行,资源已经在model加载完毕
        if(brickEmojiNum){
            let objBoss = this.gameCtl.gameModel.spriteBrickBossArray[brickEmojiNum-1];
            this.updataEmojiSpr(objBoss);
        }
    },

    updataStrSpr(obj,objColor){
        this.node.getComponent(cc.Sprite).spriteFrame = obj;
        this.node.color = objColor;
    },

    updataEmojiSpr(objBoss){
        this.node.getChildByName('spr_emoji').getComponent(cc.Sprite).spriteFrame = objBoss;
    },

    //开始技能
    onSkill(){
        //确定技能
        this.skillNum = Math.floor(Math.random()*this.bossSkillNum + 1);
        //this.skillNum = Math.floor(Math.random()*3 + 1);
        //this.skillNum = 3;

        //确定技能强度
        this.skillStrength = this.bossSkillStrength;

        //开始循环
        this.loopNum = 1;
        console.log('**********开始onSkill*************' + '技能num:' + this.skillNum + '技能Strength:' + this.skillStrength);
        this.skillLoop();
    },

    //关闭技能
    offSkill(){
        this.unscheduleAllCallbacks();
    },

    //技能行为
    skillLoop(){
        switch(this.loopNum){
            //CD
            case 1:
                this.skillCD();
                break;

            //准备释放
            case 2:
                this.skillPrepare();
                break;

            //释放
            case 3:
                this.skillStart();
                break;
        }
    },

    skillCD(){
        console.log('**********开始skillCD*************' + '倒计时:' +  Math.floor(6-this.bossSkillStrength/3) );
        this.scheduleOnce(function() {
            this.loopNum++;
            this.skillLoop();
        }, Math.floor(3-this.bossSkillStrength/3));
    },

    skillPrepare(){
        //打开动画
        this.aniSkill.node.active = true;
        this.aniSkill.play('bossSkill');
        console.log('**********开始skillPrepare*************已显示第一个特效，倒计时：' + Math.floor(4-this.skillStrength/3));

        //依次显示3次动画
        this.scheduleOnce(function() {
            //第二次显示动画
            console.log('**********已显示第二个特效*************，倒计时：' + Math.floor(3-this.skillStrength/3));
            this.aniSkill.play('bossSkill');
            this.scheduleOnce(function() {
                //第三次显示粒子
                console.log('**********显示第三个特效*************');
                this.aniSkill.play('bossSkill');
                this.scheduleOnce(function() {
                    //准备释放技能
                    this.loopNum++;
                    this.skillLoop();
                }, Math.floor(1));
            }, Math.floor(3-this.skillStrength/3));
        }, Math.floor(3-this.skillStrength/3));

        /*
        //打开准备粒子
        this.particleSkillPrepare.node.active = true;
        this.particleSkillPrepare.resetSystem();
        console.log('**********开始skillPrepare*************已显示第一个特效，倒计时：' + Math.floor(4-this.skillStrength/3));

        //依次显示3次准备粒子
        this.scheduleOnce(function() {
            //第二次显示粒子
            console.log('**********已显示第二个特效*************，倒计时：' + Math.floor(3-this.skillStrength/3));
            this.particleSkillPrepare.resetSystem();
            this.scheduleOnce(function() {
                //第三次显示粒子
                console.log('**********显示第三个特效*************');
                this.particleSkillPrepare.resetSystem();
                this.scheduleOnce(function() {
                    //准备释放技能
                    this.loopNum++;
                    this.skillLoop();
                }, Math.floor(1));
            }, Math.floor(3-this.skillStrength/3));
        }, Math.floor(4-this.skillStrength/3));
        */
    },

    skillStart(){
        console.log('**********开始skillStart*************显示特效');

        //播放动画
        this.aniSkill.play('bossSkillStart');
        /*
        //打开释放粒子
        this.particleSkillStart.node.active = true;
        this.particleSkillStart.resetSystem();
        */

        //释放技能
        this.loopNum++;
        this.gameCtl.brickBossSkill(this,this.skillNum,this.skillStrength);
    },

    //受击变白
    flashWhite(){
        //显示触碰的白化效果
        let act = cc.sequence(
            cc.fadeTo(0.05,150),
            cc.fadeOut(0.1),
        )
        this.node.getChildByName('white').runAction(act);
    },

    actDisappear(){
        //确认结束回调
        let seqFinished = cc.callFunc(function() {
            //删除砖块
            this.destroyPre();
        }, this);

        //确认特效回调
        let seqParticle = cc.callFunc(function() {
            //生成砖块消失特效
            this.gameCtl.instBrickParticleDisappear(this.node.position);
        }, this);

        //变大、变小、播放特效
        let act = cc.sequence(
            seqParticle,
            cc.scaleTo(0.1,1.1,1.1).easing(cc.easeElasticOut(3)),
            cc.scaleTo(0.2,0,0).easing(cc.easeElasticOut(3)),
            seqFinished,
        )
        this.node.runAction(act);
    },

    //删除节点准备
    destroyPre(){
        this.node.parent = null;
        this.node.destroy();
    },

    onDestroy(){
        console.log('boss关闭技能');
    },

});
