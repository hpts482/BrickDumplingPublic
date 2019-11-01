cc.Class({
    extends: cc.Component,

    properties: {
        shopItemPrice:cc.Label,
        itemSpriteNode:cc.Node, //图片节点
        shopItemSprite:cc.Sprite,
        sprGold:cc.Sprite,
        isBuy:false,
        isLevelMax:false,
    },

    init(gameCtl,shopItemShow,shopPanel,pos){
        this.gameCtl = gameCtl;
        //【id\type\当前等级\升级价格】
        this.shopItemShow = shopItemShow;
        this.shopPanel = shopPanel;
        this.pos = pos;

        //显示价格
        this.shopItemPrice.string = shopItemShow[3] > 0 ? 'x'+shopItemShow[3] : 'Max';

        //显示图片
        this.updateSpr(shopItemShow[0]);
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
            self.itemSpriteNode.getComponent(cc.Sprite).spriteFrame = self.shopItemSprite;
        });
    },

    onBtnBuy(){
        this.shopPanel.showItemPanel(this.shopItemShow,this.shopItemSprite,this);
    },

    soldOut(){
        this.sprGold.node.active = false;
    },

});
