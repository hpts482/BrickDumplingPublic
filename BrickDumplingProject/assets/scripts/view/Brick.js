cc.Class({
    extends: cc.Component,

    properties: {
        brickSprite:cc.spriteFrame,
        strength:0,
        spriteType:0, //砖块形状

        boolDestroy:false, //确定是否进入删除状态
    },

    init(gameCtl,type){
        this.gameCtl = gameCtl;

        //隐藏所有类型砖块
        this.node.getChildByName('brick1').active = false;
        this.node.getChildByName('brick2').active = false;
        this.node.getChildByName('brick3').active = false;
        this.node.getChildByName('brick4').active = false;
        this.node.getChildByName('brick5').active = false;
        this.node.getChildByName('brick6').active = false;

        //根据位置判断砖块类型
        switch(type){
            //type：1前锋2后卫3boss陪衬
            case 1:
                this.spriteType = Number(this.gameCtl.gameModel.jsonAll[1].json.contents[this.gameCtl.gameModel.currentStage - 1].vanguardType);
                break;
            case 2:
                this.spriteType = Number(this.gameCtl.gameModel.jsonAll[1].json.contents[this.gameCtl.gameModel.currentStage - 1].guardType);
                break;
            case 3:
                this.spriteType = 1;
                break;
            default:
                this.spriteType = 99;
                break;
        }

        //单个随机
        if(this.spriteType == 99){
            this.spriteType = Math.floor(Math.random()*6 + 1);
        }

        //根据类型确定激活哪个节点
        switch(this.spriteType){
            case 1:
                this.node.getChildByName('brick1').active = true;
                break;
            case 2:
                this.node.getChildByName('brick2').active = true;
                break;
            case 3:
                this.node.getChildByName('brick3').active = true;
                break;
            case 4:
                this.node.getChildByName('brick4').active = true;
                break;
            case 5:
                this.node.getChildByName('brick5').active = true;
                break;
            case 6:
                this.node.getChildByName('brick6').active = true;
                break;
            default:
                this.node.getChildByName('brick1').active = true;
                break;
        }
    },

    onDestroy(){
        //随机掉落道具：1~10随机
        let ranNum = Math.floor(Math.random()*10+1);

        //80%概率获得道具
        if(ranNum <= 7){
            this.gameCtl.instItem(this.node.position);
        }
        else{
            console.log('未获得道具，随机数为：' + ranNum);
        }
    },

    setStr(n){
        this.strength = n;
        this.updateStr();    
    },

    minusStr(n){
        this.strength -= n;
        return this.strength;
    },

    addStr(n){
        this.strength = (this.strength+n) < 7 ? (this.strength + n): 6;
        this.updateStr();
    },

    updateStr(){
        //资源已经在model加载完毕
        let obj = this.gameCtl.gameModel.spriteBrickArray[this.spriteType-1];
        let objColor = this.gameCtl.gameModel.brickStrColor[this.strength-1];
        this.updataStrSpr(obj,objColor);

    },

    updataStrSpr(obj,objColor){
        this.brickSprite = obj;

        //找到对应的砖块并赋值图片+颜色
        this.brickTypeString = String('brick' + this.spriteType);
        this.node.getChildByName(this.brickTypeString).getComponent(cc.Sprite).spriteFrame = this.brickSprite;
        this.node.getChildByName(this.brickTypeString).color = objColor;

    },

    updataRigidPositon(){
        this.node.getChildByName('brick1').getComponent(cc.RigidBody).syncPosition(true);
        this.node.getChildByName('brick2').getComponent(cc.RigidBody).syncPosition(true);
        this.node.getChildByName('brick3').getComponent(cc.RigidBody).syncPosition(true);
        this.node.getChildByName('brick4').getComponent(cc.RigidBody).syncPosition(true);
        this.node.getChildByName('brick5').getComponent(cc.RigidBody).syncPosition(true);
        this.node.getChildByName('brick6').getComponent(cc.RigidBody).syncPosition(true);
    },

    animBossSkill(){
        this.node.getChildByName('ani_skill').active = true;
        this.node.getChildByName('ani_skill').getComponent(cc.Animation).play('bossSkillStart');
    },

    //受击变白
    flashWhite(){
        //显示触碰的白化效果
        let act = cc.sequence(
            cc.fadeTo(0.05,150),
            cc.fadeOut(0.1),
        )
        this.node.getChildByName(this.brickTypeString).getChildByName('white').runAction(act);
    },

    actDisappear(){
        this.boolDestroy = true; //确认已开始删除

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
        this.node.getChildByName(this.brickTypeString).runAction(act);
    },

    //删除节点准备
    destroyPre(){
        this.node.parent = null;
        this.node.destroy();
    },
});