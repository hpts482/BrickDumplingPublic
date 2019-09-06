cc.Class({
    extends: cc.Component,

    properties: {
        brickSprite:cc.spriteFrame,
        Strength:0,
    },

    init(gameCtl){
        this.gameCtl = gameCtl;
    },

    onDestroy(){
        console.log('砖块删除！')
        //1~10随机
        let ranNum = Math.floor(Math.random()*10+1);

        //80%概率获得道具
        if(ranNum <= 8){
            this.gameCtl.instItem(this.node.position);
        }
        else{
            console.log('未获得道具，随机数为：' + ranNum);
        }
    },

    setStr(n){
        this.Strength = n;
        this.updateStr();    
    },

    minusStr(n){
        this.Strength -= n;
        return this.Strength;
    },

    updateStr(){
        let self = this;
        let url = String('dyTexture/brick/brick_'+this.Strength);

        //console.log('Wall url :'+url);

        //加载资源
        cc.loader.loadRes(url,function(err,obj){
            if(err){
                console.log(err);
                return;
            }

            self.updataStrSpr(obj);
        });

    },

    updataStrSpr(obj){
        this.brickSprite = new cc.SpriteFrame(obj);
        this.node.getComponent(cc.Sprite).spriteFrame = this.brickSprite;
    },

});