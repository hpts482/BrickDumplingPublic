cc.Class({
    extends: cc.Component,

    properties: {
        type:0, //1加时间 4加金币
    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        let ranNum = Math.floor(Math.random()*100+1);
        //1加时间
        if(ranNum<=50){
            this.type = 1;
        }
        //4加金币
        else if(ranNum>50){
            this.type = 99;
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