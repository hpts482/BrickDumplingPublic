cc.Class({
    extends: cc.Component,

    properties: {
        goldLabel:cc.Label,
        refreshGoldLabel:cc.Label,
        refreshBtn:cc.Button,
        shopItemPrefab:cc.Prefab,
        itemPanel:require('ItemPanel'),
        soldOutPanel1:cc.Sprite,
        soldOutPanel2:cc.Sprite,
        soldOutPanel3:cc.Sprite,
        discount:cc.Label,   //商店折扣
        discountRatio:0.6,    //折扣比例
    },

    // use this for initialization
    onLoad: function () {

    },

    init(gameCtl){
        this.gameCtl = gameCtl;

        this.node.active = false;
        this.itemPanel.init(gameCtl,this);
        this.refreshGold = 2;
    },

    initNextStage(){
        this.node.active = false;
    },

    show(gameModel){
        this.node.scale = 0;
        this.node.active = true;
        this.updateGold();

        //刷新金额 
        this.updateRefreshGold();
        this.updateRefreshBtn();
        
        //初始化商品
        this.initShopItem();
    },

    initShopItem(){
        let gameModel = this.gameCtl.gameModel;
        this.node.getChildByName('lay_item').removeAllChildren();
        this.soldOutPanel1.node.active = false;
        this.soldOutPanel2.node.active = false;
        this.soldOutPanel3.node.active = false;

        //记录需要显示的道具，二维数组【顺序】【id\type\当前等级\升级价格】
        let shopItemContents = [];

        //如果是类型2、3的可升级道具，记录到数组中
        for(let i=0,j=0;i<Number(gameModel.itemLevel.length);i++){
            if((Number(gameModel.jsonAll[2].json.contents[i].type) == 2 || Number(gameModel.jsonAll[2].json.contents[i].type) == 3)){
                shopItemContents[j] = [Number(gameModel.jsonAll[2].json.contents[i].key),Number(gameModel.jsonAll[2].json.contents[i].type),gameModel.itemLevel[i],0];
                //根据当前等级计算升级需要的价格
                switch(gameModel.itemLevel[i]){
                    case 0:
                        shopItemContents[j][3] = Number(gameModel.jsonAll[2].json.contents[i].levelPrice1);
                        break;
                    case 1:
                        shopItemContents[j][3] = Number(gameModel.jsonAll[2].json.contents[i].levelPrice2);
                        break;
                    case 2:
                        shopItemContents[j][3] = Number(gameModel.jsonAll[2].json.contents[i].levelPrice3);
                        break;
                }

                j++;
            }
        }

        //将数组进行筛选，留下顺序：基础（包括不可升级）→ 特价（只可升级）→ 掉落（包括不可升级）
        let shopItemShow = new Array();
        shopItemShow[0] = new Array(4);      //最终显示
        let shopItemContents1 = new Array();
        shopItemContents1[0] = new Array(4); //基础池
        let shopItemContents2 = new Array();
        shopItemContents2[0] = new Array(4); //特价池
        let shopItemContents3 = new Array();
        shopItemContents3[0] = new Array(4); //掉落池

        //筛选特价池----------------------------------------
        for(let i2=0,j2=0;i2<shopItemContents.length;i2++){
            if(shopItemContents[i2][2] < 3){
                shopItemContents2[j2] = shopItemContents[i2].concat();
                j2++;
            }
        }
        //没有特价的话，随机选一个
        if(!shopItemContents2[0][0]){
            let itemRanNum2Null = Math.floor(Math.random() * shopItemContents.length);
            shopItemShow[1] = shopItemContents[itemRanNum2Null].concat();
        }
        //有特价的话，随机特价道具
        else{
            let itemRanNum2 = Math.floor(Math.random() * shopItemContents2.length);
            shopItemShow[1] = shopItemContents2[itemRanNum2].concat();
        }
        //去掉原池里该id道具
        for(let i22=0;i22<shopItemContents.length;i22++){
            if(shopItemContents[i22][0] == shopItemShow[1][0]){
                shopItemContents.splice(i22,1);
                break;
            }
        }

        //筛选基础池-----------------------------------------
        for(let i1=0,j1=0;i1<shopItemContents.length;i1++){
            if(shopItemContents[i1][1] == 2){
                shopItemContents1[j1] = shopItemContents[i1].concat();
                j1++;
            }
        }
        //随机基础道具
        let itemRanNum1 = Math.floor(Math.random() * shopItemContents1.length);
        shopItemShow[0] = shopItemContents1[itemRanNum1].concat();


        //筛选掉落池-----------------------------------------
        for(let i3=0,j3=0;i3<shopItemContents.length;i3++){
            if(shopItemContents[i3][1] == 3){
                shopItemContents3[j3] = shopItemContents[i3].concat();
                j3++;
            }
        }
        //随机掉落道具
        let itemRanNum3 = Math.floor(Math.random() * shopItemContents3.length);
        shopItemShow[2] = shopItemContents3[itemRanNum3].concat();

        //生成对应的道具prefab
        for(let ii=0;ii<shopItemShow.length;ii++){
            if(shopItemShow[ii][0]){
                //刷新特价--只有特价位置 && 有升级价格（相当于不为最高级）
                if(ii == 1){
                    if(shopItemShow[ii][3]){
                        shopItemShow[ii][3] = this.updateDiscount(true,shopItemShow[ii][3]);
                    }
                    else{
                        this.updateDiscount(false);
                    }
                } 

                //刷新soldOutPanel
                this.updateSoldOutPanel(ii, shopItemShow[ii][2] == 3);

                let shopItemNode = cc.instantiate(this.shopItemPrefab);
                shopItemNode.parent = this.node.getChildByName('lay_item');
                shopItemNode.getComponent(cc.Component).init(this.gameCtl,shopItemShow[ii],this,ii);
            }
        }

    },
    
    onBtnLeave(){
        this.gameCtl.initNextStage();
    },

    onBtnRefresh(){
        //刷新列表
        this.initShopItem();

        //扣钱
        this.gameCtl.gameModel.minusGold(this.refreshGold);

        //更新新的消耗
        this.refreshGold += 2;
        this.updateRefreshGold();

        //更新按钮状态
        this.updateRefreshBtn();

        //更新持有金币
        this.updateGold();
    },

    showItemPanel(shopItemShow,shopItemSprite,shopItem){
        this.itemPanel.show(shopItemShow,shopItemSprite,shopItem);
    },

    updateShopItemSoldOut(shopItem){
        shopItem.soldOut();

        //更新钱数
        this.updateGold();

        //更新卖完啦的显示
        this.updateSoldOutPanel(shopItem.pos, true);
    },

    updateSoldOutPanel(pos,bool){
        switch (pos) {
            case 0:
                this.soldOutPanel1.node.active = bool;
                break;
            case 1:
                this.soldOutPanel2.node.active = bool;
                break;
            case 2:
                this.soldOutPanel3.node.active = bool;
                break;
        }
    },

    updateRefreshGold(){
        this.refreshGoldLabel.string = 'x' + this.refreshGold;
    },

    updateRefreshBtn(){
        //显示按钮是否置灰
        if(this.gameCtl.gameModel.gold < this.refreshGold){
            this.refreshBtn.interactable = false;
        }
        else {
            this.refreshBtn.interactable = true;
        }
    },

    updateGold(){
        this.goldLabel.string = 'x' + this.gameCtl.gameModel.gold;
    },

    updateDiscount(bool,gold){
        this.discount.node.active = bool;

        if(bool){
            if(gold){
                let goldAfter = Math.floor(gold * this.discountRatio);
                this.discount.node.getChildByName('lab_specialValue').getComponent(cc.Label).string =String( '折扣 ' + Math.floor((goldAfter/gold)*100) +'%');

                return goldAfter;
            }
        }
    },
});
