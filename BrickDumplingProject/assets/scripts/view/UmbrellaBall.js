cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(gameCtl,scale,startRotation) {
        this.gameCtl = gameCtl;
        this.node.scale = scale;
        let direction = cc.v2(0,1).rotateSelf(startRotation/180 * Math.PI);
        this.getComponent(cc.RigidBody).applyLinearImpulse(direction.mulSelf(240),this.node.position);
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                this.gameCtl.onBallContactBrick(self.node, other.node.parent);
                this.node.destroy();
                break;
            case 4://球碰到墙
                this.node.destroy();
                break;
            case 6://球碰到boss砖块
                this.gameCtl.onBallContactBrick(self.node, other.node);
                this.node.destroy();
                break;
            case 8://球碰到降落伞
                this.gameCtl.onBallContactParachute(self.node, other.node);
                this.node.destroy();
                break;
        }
    },

    onDestroy(){

    },
});