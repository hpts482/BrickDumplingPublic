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

    show(shopItemShow,shopItemSprite,shopItem){
        //shopItemShow【id\type\当前等级\升级价格】
        this.node.active = true;

        this.shopItemShow = shopItemShow;
        this.shopItemSprite = shopItemSprite;
        this.shopItem = shopItem;

        //显示价格
        this.labGold.string = shopItemShow[2] > 2 ? 'Max' : ('x'+shopItemShow[3]);

        //显示item图片和名字
        this.sprItem.spriteFrame = shopItemSprite;
        this.labItem.string = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].name;
        
        //已买
        if(shopItem.isBuy){
            //是否显示tag
            this.btnBuy.node.active = false;
            this.sprSoldOut.node.active = true;

            //显示tips的等级
            if(shopItemShow[2]+1 <= 2){
                this.labLv.string = String('Lv.'+ (shopItemShow[2]+1));
            }
            else if(shopItemShow[2] > 2){
                this.labLv.string = 'Lv.Max';
            }

            //显示tips + tips内参数值
            let labTipsEx = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].tips;
            let labTipsExValue = 0;
            switch(shopItemShow[2]+1){
                case 0:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level1;
                    break;
                case 1:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level2;
                    break;
                case 2:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level3;
                    break;
                case 3:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level3;
                    break;
            }
    
            this.labTips.string = labTipsEx.replace(/x/,labTipsExValue);
        }

        //未买
        else{
            //是否显示tag
            this.btnBuy.node.active = true;
            this.sprSoldOut.node.active = false;
            
            //显示tips的等级
            if(shopItemShow[2] <= 2){
                this.labLv.string = String('Lv.'+ shopItemShow[2] +' → Lv.' + (shopItemShow[2]+1));
            }
            else if(shopItemShow[2] > 2){
                this.labLv.string = 'Lv.Max';
            }

            //显示tips + tips内参数值
            let labTipsEx = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].tips;
            let labTipsExValue = 0;
            switch(shopItemShow[2]){
                case 0:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level1;
                    break;
                case 1:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level2;
                    break;
                case 2:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level3;
                    break;
                case 3:
                    labTipsExValue = this.gameCtl.gameModel.jsonAll[2].json.contents[shopItemShow[0]-1].level3;
                    break;
            }
    
            this.labTips.string = labTipsEx.replace(/x/,labTipsExValue);
        }

        //显示按钮是否置灰
        if(this.gameCtl.gameModel.gold < shopItemShow[3] || shopItemShow[2] > 2){
            this.btnBuy.interactable = false;
        }
        else {
            this.btnBuy.interactable = true;
        }

    },

    close(){
        this.node.active = false;
    },

    onBtnBuyReal(){
        //扣钱
        this.gameCtl.gameModel.minusGold(this.shopItemShow[3]);
        //增加一级
        this.gameCtl.gameModel.addItemLevel(this.shopItemShow[0]-1,1);
        //告诉shopItem使用卖完啦的tag
        this.shopItem.isBuy = true;
        
        //关闭界面
        this.node.active = false;
        this.shopPanel.updateShopItemSoldOut(this.shopItem);
        this.shopPanel.updateRefreshBtn();
    },
});
