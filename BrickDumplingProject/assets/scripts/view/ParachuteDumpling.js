cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                this.gameCtl.onBallContactBrick(self.node, other.node.parent);
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
            case 5://球碰到保底
                this.gameCtl.onBallContactSecurity(self.node, other.node);
                break;
            case 6://球碰到boss砖块
                this.gameCtl.onBallContactBrick(self.node, other.node);
                break;
            case 8://球碰到降落伞
                this.gameCtl.onBallContactParachute(self.node, other.node);
                break;
            //7是额外小球，9是大球
        }
    },

    onPostSolve(contact, self, other) {
        switch (other.tag) {
            case 3://球碰到托盘
            case 5://球碰到保底
                this.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(0,100),this.node.position);
                break;
        }

    },

    onDestroy(){

    },


});