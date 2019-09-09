cc.Class({
    extends: require('Brick'),

    properties: {
        bossType:0, //需要默认配置 1代表小boss，2代表大boss
    },

    init(gameCtl,bossSkillNum,bossSkillStrength){
        this.gameCtl = gameCtl;
        this.bossSkillNum = bossSkillNum;
        this.bossSkillStrength = bossSkillStrength;
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

    onSkill(){
        //确定技能
        let skillNum = Math.floor(Math.random(this.bossSkillNum) + 1);

        //确定技能强度
        //进入CD
        //开始吟唱
        //释放技能
    },

    onDestroy(){
        console.log('boss关闭技能');
    },

});
