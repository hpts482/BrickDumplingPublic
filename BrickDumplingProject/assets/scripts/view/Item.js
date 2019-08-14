cc.Class({
    extends: cc.Component,

    properties: {
        type:0, //1加时间 99加金币
    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        this.jsonItem = gameCtl.gameModel.jsonAll[2].json;

        //比例隔开点
        this.cutRatio = [];
        //概率数据记录到数组中，二维数组（id,ratio）
        this.idAndRatio = [];
        //计算道具概率总和
        this.allRatio = 0;
        //计算道具总数
        this.allCount = 0;

        for(let i=0,j=0; i< Number(gameCtl.gameModel.itemLevel.length); i++){
            //判断是否是类型1或3的道具
            if(Number(this.jsonItem.contents[i].type) == 1 || Number(this.jsonItem.contents[i].type) == 3){
                //数组储存至二维数组
                this.idAndRatio[j] = [Number(this.jsonItem.contents[i].key),Number(this.jsonItem.contents[i].ratio)];
                
                //赋值概率总和
                this.allRatio += Number(this.jsonItem.contents[i].ratio);

                //赋值cutRatio作为概率分割点
                //初始分割点处理
                if(!j){
                    this.cutRatio[j] = Number(this.jsonItem.contents[i].ratio);
                }
                //中间段处理
                else{
                    this.cutRatio[j] = this.cutRatio[j-1]+Number(this.jsonItem.contents[i].ratio);
                }
                j++;
            }
        }

        //创建随机数
        let ranNum = Math.floor(Math.random()*this.allRatio+1);

        for(let i=0 ; i<this.cutRatio.length ; i++){
            //不满足概率找下一个概率点
            if(ranNum > this.cutRatio[i]){
                
            }
            //满足条件获取type
            else{
                this.type = this.idAndRatio[i][0];
                break;
            }
        }
        
        this.updateSpr();
    },

    updateSpr(){
        let self = this;
        let url = String('dyTexture/item/item_'+self.type);

        //console.log('Wall url :'+url);
        //加载资源
        cc.loader.loadRes(url,function(err,obj){
            if(err){
                console.log(err);
                return;
            }

            self.itemSprite = new cc.SpriteFrame(obj);
            self.node.getComponent(cc.Sprite).spriteFrame = self.itemSprite;
        });
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 3://道具碰到托盘
                this.gameCtl.onItemContactPaddle(self.node, other.node,this.type);
                break;
            case 2://道具碰到地面
                self.node.parent = null;
                self.node.destroy();
                break;
                
        }
    },

    onDestroy(){
        console.log('道具删除！！')
    }
});