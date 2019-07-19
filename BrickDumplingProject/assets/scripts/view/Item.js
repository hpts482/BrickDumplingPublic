cc.Class({
    extends: cc.Component,

    properties: {
        type:0,
    },

    init(gameCtl,type){
        this.gameCtl = gameCtl;
        this.type = type;
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
                this.gameCtl.onItemContactPaddle(self.node, other.node);
                break;
            /*case 5://道具碰到球
                this.gameCtl.onItemContactBall(self.node, other.node);
                break;
                */
        }
    },

    onDestroy(){
        console.log('道具删除！！')
    }
});