cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.node.position = cc.v2(360,270);//初始化位置
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(400,400);//初始化速度
    },

    //下一关初始化
    initNextStage() {
        
        this.node.position = cc.v2(360,270);//初始化位置
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(400,400);//初始化速度
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                this.gameCtl.onBallContactBrick(self.node, other.node);
                break;
            case 2://球碰到地面
                this.gameCtl.onBallContactGround(self.node, other.node);
                break;
            case 3://球碰到托盘
                this.gameCtl.onBallContactPaddle(self.node, other.node);
                break;
            case 4://球碰到墙
                this.gameCtl.onBallContactWall(self.node, other.node);
                break;
        }
    },

    ballVelocityDown(){
        this.getComponent(cc.RigidBody).applyLinearImpulse(this.getComponent(cc.RigidBody).linearVelocity.mul(-0.5),this.node.position);
    },
    ballVelocityUp(){
        this.getComponent(cc.RigidBody).applyLinearImpulse(this.getComponent(cc.RigidBody).linearVelocity.mul(0.5),this.node.position);
    }
});