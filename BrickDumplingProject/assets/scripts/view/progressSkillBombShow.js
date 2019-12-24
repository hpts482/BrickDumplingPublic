
cc.Class({
    extends: cc.Component,

    properties: {
        sprBombLevel1:cc.SpriteFrame,
        sprBombLevel2:cc.SpriteFrame,
        sprBomb:cc.Sprite,
        colliderLevel1:cc.Node,
        colliderLevel2:cc.Node,
    },

    onLoad () {
    　　/*var manager=cc.director.getCollisionManager();  // 获取碰撞检测类
    　　manager.enabled=true   //开启碰撞检测
    　　manager.enabledDebugDraw=true //显示碰撞检测区域*/
    },

    init(gameCtl,pos,bombCdRatio,bombExtent){
        this.gameCtl = gameCtl;
        this.pos = pos;
        this.bombCdRatio = bombCdRatio;
        this.bombExtent = bombExtent;

        //确定位置
        this.node.position = pos;

        //显示碰撞体
        this.showCollider();
        //显示图片
        this.showSprite();

    },

    showCollider(){
        switch (this.bombExtent) {
            case 1:
                this.colliderLevel1.active = true;
                this.colliderLevel1.getComponent(cc.Component).init(this.gameCtl);
                break;
            case 2:
                this.colliderLevel2.active = true;
                this.colliderLevel2.getComponent(cc.Component).init(this.gameCtl);
                break;
        }
    },
    
    showSprite(){
        //缩小防止图片加载优先完成
        this.sprBomb.node.scale = cc.v2(0,0);

        switch (this.bombExtent) {
            case 1:
                this.sprBomb.getComponent(cc.Sprite).spriteFrame = this.sprBombLevel1;
                break;
            case 2:
                this.sprBomb.getComponent(cc.Sprite).spriteFrame = this.sprBombLevel2;
                break;
        }

        //播放动画
        this.showAnim();
    },
    
    showAnim(){
        this.getComponent(cc.Animation).play('progressSkillBomb');

        this.animFinished = function(){
            this.node.destroy();
        }
        this.getComponent(cc.Animation).on('finished',   this.animFinished,  this);
    },
});
