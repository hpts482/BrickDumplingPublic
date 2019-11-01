cc.Class({
    extends: cc.Component,

    properties: {
        brickSprite:cc.spriteFrame,
        strength:0,
        spriteType:0, //砖块形状
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
        console.log('砖块删除！')
        //1~10随机
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
        let self = this;
        let url = String('dyTexture/brick/brick_' + this.spriteType + this.strength);

        //console.log('Wall url :'+url);

        //加载资源
        cc.loader.loadRes(url,function(err,obj){
            if(err || !self.node.isValid ){
                console.log(err);
                return;
            }
            else{
                self.updataStrSpr(obj);
            }
        });
    },

    updataStrSpr(obj){
        this.brickSprite = new cc.SpriteFrame(obj);
        switch(this.spriteType){
            case 1:
                this.node.getChildByName('brick1').getComponent(cc.Sprite).spriteFrame = this.brickSprite;
                break;
            case 2:
                this.node.getChildByName('brick2').getComponent(cc.Sprite).spriteFrame = this.brickSprite;
                break;
            case 3:
                this.node.getChildByName('brick3').getComponent(cc.Sprite).spriteFrame = this.brickSprite;
                break;
            case 4:
                this.node.getChildByName('brick4').getComponent(cc.Sprite).spriteFrame = this.brickSprite;
                break;
            case 5:
                this.node.getChildByName('brick5').getComponent(cc.Sprite).spriteFrame = this.brickSprite;
                break;
            case 6:
                this.node.getChildByName('brick6').getComponent(cc.Sprite).spriteFrame = this.brickSprite;
                break;
        }
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




});