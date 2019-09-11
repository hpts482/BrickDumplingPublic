cc.Class({
    extends: require('Brick'),

    properties: {
        bossType:0, //需要默认配置 1代表小boss，2代表大boss
        particleSkillPrepare:cc.ParticleSystem,
        particleSkillStart:cc.ParticleSystem,
    },

    init(gameCtl,bossSkillNum,bossSkillStrength){
        this.gameCtl = gameCtl;
        this.bossSkillNum = bossSkillNum;
        this.bossSkillStrength = bossSkillStrength;

        //关闭粒子
        this.particleSkillPrepare.node.active = false;
        this.particleSkillStart.node.active = false;
    },

    updateStr(){
        let self = this;

        //获取砖块颜色、获取表情    6代表颜色砖块最大强度
        let brickEmojiNum = Math.floor((this.Strength - 1) / 6) + 1;
        let brickSprNum = ((this.Strength - 1) % 6) + 1;

        //显示砖块
        let urlSpr = String('dyTexture/brick/brickBoss_'+brickSprNum);
        //加载资源
        cc.loader.loadRes(urlSpr,function(err,obj){
            if(err){
                console.log(err);
                return;
            }

            self.updataStrSpr(obj);
        });

        //显示表情，表情非0执行
        if(brickEmojiNum){
            this.node.getChildByName('spr_emoji').active = true;
            let urlEmoji = String('dyTexture/brick/brickEmoji_'+brickEmojiNum);
            //加载资源
            cc.loader.loadRes(urlEmoji,function(err,obj){
                if(err){
                    console.log(err);
                    return;
                }
                self.updataEmojiSpr(obj);
            });
        }
    },

    updataStrSpr(obj){
        this.brickSprite = new cc.SpriteFrame(obj);
        this.node.getComponent(cc.Sprite).spriteFrame = this.brickSprite;
    },

    updataEmojiSpr(obj){
        this.brickSprite = new cc.SpriteFrame(obj);
        this.node.getChildByName('spr_emoji').getComponent(cc.Sprite).spriteFrame = this.brickSprite;
    },

    //开始技能
    onSkill(){
        //确定技能
        this.skillNum = Math.floor(Math.random(this.bossSkillNum) + 1);

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
        }, Math.floor(6-this.bossSkillStrength/3));
    },

    skillPrepare(){
        
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
    },

    skillStart(){
        console.log('**********开始skillStart*************显示特效');
        //打开释放粒子
        this.particleSkillStart.node.active = true;
        this.particleSkillStart.resetSystem();

        //释放技能
        this.loopNum++;
        this.gameCtl.brickBossSkill(this,this.skillNum,this.skillStrength);
    },

    onDestroy(){
        console.log('boss关闭技能');
    },

});
