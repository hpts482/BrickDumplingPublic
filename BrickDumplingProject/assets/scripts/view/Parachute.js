cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel:cc.Label,
        dumplingSprite:cc.Sprite,
        dumplingPrefab:cc.Prefab,
    },

    init(gameCtl,num) {
        this.gameCtl = gameCtl;
        this.num = num;
        this.itemBool = true;

        //显示字
        switch (this.num) {
            case 0:
                this.tipLabel.string = '关';
                break;
            case 1:
                this.tipLabel.string = '卡';
                break;
            case 2:
                this.tipLabel.string = this.gameCtl.gameModel.currentStage;
                this.dumplingSprite.node.active = true;
                break;
        }

        //随机初始速度
        this.setStartVelocity();

        //打开动画
        this.scheduleOnce(function() {
            this.ainmStateStart = this.getComponent(cc.Animation).play('parachuteStart');
            this.ainmStateStart.on('finished',this.animLoop,this);
        }, Math.floor( 1 + Math.random()*2));
        
    },

    setStartVelocity(){
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -300 - Math.floor(Math.random()*100));
    },

    setFinVelocity(){
        this.getComponent(cc.RigidBody).linearVelocity = this.getComponent(cc.RigidBody).linearVelocity.divSelf(3);
    },

    animLoop(){
        //循环动画
        this.getComponent(cc.Animation).play('parachuteLoop');
        this.setFinVelocity();
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 2://碰到地面
                self.node.destroy();
                break;
        }
    },

    isDumpling(posParachuteWorld){
        if(this.num == 2){
            //生成团子
            this.dumplingNode = cc.instantiate(this.dumplingPrefab);
            this.dumplingNode.parent = cc.find('PhysicsLayer/ballExtra');
            this.dumplingNode.getComponent(cc.Component).init(this.gameCtl);
            this.dumplingNode.position = posParachuteWorld;
        }
    },

    onDestroy(){

    },
});