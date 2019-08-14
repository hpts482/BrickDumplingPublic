cc.Class({
    extends: cc.Component,

    properties: {
        labGold:cc.Label,

        sprItem:cc.Sprite,
        labItem:cc.Label,

        labLv:cc.Label,
        labTips:cc.Label,

        btnBuy:cc.Button,
        sprSoldOut:cc.Sprite,
    },

    init(gameCtl,shopPanel){
        this.gameCtl = gameCtl;
        this.shopPanel = shopPanel;
        this.node.active = false;
    },

    show(shopItemContents,shopItemSprite,shopItem){
        this.node.active = true;

        this.shopItemContents = shopItemContents;
        this.shopItemSprite = shopItemSprite;
        this.shopItem = shopItem;

        //显示价格
        this.labGold.string = shopItemContents[2] > 0 ? shopItemContents[2] : 'Max';

        //显示item图片和名字
        this.sprItem.spriteFrame = shopItemSprite;
        this.labItem.string = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemContents[0]-1].name;

        //显示tips的等级
        if(shopItemContents[1] <= 2){
            this.labLv.string = String('Lv.'+ shopItemContents[1] +' → Lv.' + (shopItemContents[1]+1));
        }
        else if(shopItemContents[1] > 2){
            this.labLv.string = 'Lv.Max';
        }

        //显示tips + tips内参数值
        let labTipsEx = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemContents[0]-1].tips;
        let labTipsExValue = 0;
        switch(shopItemContents[1]){
            case 0:
                labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemContents[0]-1].level1;
                break;
            case 1:
                labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemContents[0]-1].level2;
                break;
            case 2:
                labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemContents[0]-1].level3;
                break;
            case 3:
                labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemContents[0]-1].level3;
                break;
        }

        this.labTips.string = labTipsEx.replace(/x/,labTipsExValue);

        //显示按钮是否置灰
        if(this.gameCtl.gameModel.gold < shopItemContents[2] || shopItemContents[1] > 2){
            this.btnBuy.interactable = false;
        }
        else {
            this.btnBuy.interactable = true;
        }

        //是否显示tag
        if(shopItem.isBuy){
            this.btnBuy.node.active = false;
            this.sprSoldOut.node.active = true;
        }
        else{
            this.btnBuy.node.active = true;
            this.sprSoldOut.node.active = false;
        }
    },

    close(){
        this.node.active = false;
    },

    onBtnBuyReal(){
        //扣钱
        this.gameCtl.gameModel.minusGold(this.shopItemContents[2]);
        //增加一级
        this.gameCtl.gameModel.addItemLevel(this.shopItemContents[0]-1,1);
        //告诉shopItem使用卖完啦的tag
        this.shopItem.isBuy = true;
        
        this.node.active = false;
        this.shopPanel.updateShopItemSoldOut(this.shopItem);
    },
});
