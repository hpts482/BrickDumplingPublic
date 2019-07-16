cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab:cc.Prefab,
        brickSprite:cc.spriteFrame,
        Strength:0,
    },

    onDestroy(){
        /*let itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.parent = cc.find("PhysicsLayer");
        itemPrefab.position = cc.v2(375,667);*/
    },

    setStr(n){
        this.Strength = n;
        this.updateStr();    
    },

    updateStr(){
        let self = this;
        let url = String('dyTexture/brick/brick_'+this.Strength);

        console.log('Wall url :'+url);

        //加载资源
        cc.loader.loadRes(url,function(err,obj){
            if(err){
                console.log(err);
                return;
            }

            self.UpdataStrSpr(obj);
        });

    },

    UpdataStrSpr(obj){
        //this.node.getComponent(cc.Sprite).spriteFrame.setTexture(obj);
        this.brickSprite = new cc.SpriteFrame(obj);
        this.node.getComponent(cc.Sprite).spriteFrame = this.brickSprite;

        //this.node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(obj);
        //console.log(this.node.getComponent(cc.Sprite).spriteFrame);
        //console.log(obj);

        //let sf = this.node.getComponent(cc.Sprite).spriteFrame;
        //console.log('Brick Texture: '+ sf.getTexture);
    },

});