cc.Class({
    extends: cc.Component,

    properties: {
        shopItemPrice:cc.Label,
        shopItemSprite:cc.Sprite,
        sprGold:cc.Sprite,
        sprSoldOut:cc.Sprite,
        isBuy:false,
        isLevelMax:false,
    },

    init(gameCtl,shopItemContents,shopPanel){
        this.gameCtl = gameCtl;
        //【id\当前等级\升级价格】
        this.shopItemContents = shopItemContents;
        this.shopPanel = shopPanel;

        //显示价格
        this.shopItemPrice.string = shopItemContents[2];
        this.sprSoldOut.node.active = false;

        //显示图片
        this.updateSpr(shopItemContents[0]);
    },

    updateSpr(type){
        let self = this;
        let url = String('dyTexture/shopItem/shopItem_'+type);

        //console.log('Wall url :'+url);
        //加载资源
        cc.loader.loadRes(url,function(err,obj){
            if(err){
                console.log(err);
                return;
            }

            self.shopItemSprite = new cc.SpriteFrame(obj);
            self.node.getComponent(cc.Sprite).spriteFrame = self.shopItemSprite;
        });
    },

    onBtnBuy(){
        this.shopPanel.showItemPanel(this.shopItemContents,this.shopItemSprite,this);
    },

    soldOut(){
        this.sprGold.node.active = false;
        this.sprSoldOut.node.active = true;
    },

});
