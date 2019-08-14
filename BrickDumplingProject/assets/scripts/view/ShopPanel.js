cc.Class({
    extends: cc.Component,

    properties: {
        goldLabel:cc.Label,
        shopItemPrefab:cc.Prefab,
        itemPanel:require('ItemPanel'),
    },

    // use this for initialization
    onLoad: function () {

    },

    init(gameCtl){
        this.gameCtl = gameCtl;

        this.node.active = false;
        this.itemPanel.init(gameCtl,this);
    },

    initNextStage(){
        this.node.active = false;
    },

    show(gameModel){
        this.node.active = true;
        this.goldLabel.string = gameModel.gold;
        
        //初始化商品
        this.initShopItem(gameModel);
    },

    initShopItem(gameModel){
        this.node.getChildByName('lay_item').removeAllChildren();
        //记录需要显示的道具，二维数组【顺序】【id\当前等级\升级价格】
        let shopItemContents = [];

        for(let i=0,j=0;i<Number(gameModel.itemLevel.length);i++){
            //如果是类型2、3的可升级道具，并且未到3级，记录到数组中
            if((Number(gameModel.jsonAll[2].json.contents[i].type) == 2 || Number(gameModel.jsonAll[2].json.contents[i].type) == 3) && (gameModel.itemLevel[i] != 3)){
                shopItemContents[j] = [Number(gameModel.jsonAll[2].json.contents[i].key),gameModel.itemLevel[i],0];
                //根据当前等级计算升级需要的价格
                switch(gameModel.itemLevel[i]){
                    case 0:
                        shopItemContents[j][2] = Number(gameModel.jsonAll[2].json.contents[i].levelPrice1);
                        break;
                    case 1:
                        shopItemContents[j][2] = Number(gameModel.jsonAll[2].json.contents[i].levelPrice2);
                        break;
                    case 2:
                        shopItemContents[j][2] = Number(gameModel.jsonAll[2].json.contents[i].levelPrice3);
                        break;
                }

                j++;
            }
        }

        for(let i=0;i<shopItemContents.length;i++){
            let shopItemNode = cc.instantiate(this.shopItemPrefab);
            shopItemNode.parent = this.node.getChildByName('lay_item');
            shopItemNode.getComponent(cc.Component).init(this.gameCtl,shopItemContents[i],this);
        }
    },
    
    onBtnLeave(){
        this.gameCtl.initNextStage();
    },

    showItemPanel(shopItemContents,shopItemSprite,shopItem){
        this.itemPanel.show(shopItemContents,shopItemSprite,shopItem);
    },

    updateShopItemSoldOut(shopItem){
        shopItem.soldOut();
        //更新钱数
        this.goldLabel.string = this.gameCtl.gameModel.gold;
    },
});
