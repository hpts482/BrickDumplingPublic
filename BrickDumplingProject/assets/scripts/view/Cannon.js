cc.Class({
    extends: cc.Component,

    properties: {
        ballPositionX:0,
        ballPositionY:0,
        ballLinearVelocityX:0,
        ballLinearVelocityY:0,
    },

    onLoad: function () {

    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        this.node.active = false;
    },

    serveBall(type){
        this.type = type;
        this.node.active = true;
        this.getComponent(cc.Animation).play('cannon');
    },

    animStartFinish(){
        if(this.type == 1){
            //调整主球位置并显示
            this.gameCtl.ball.node.position = cc.v2(this.ballPositionX,this.ballPositionY);
            this.gameCtl.ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.ballLinearVelocityX,this.ballLinearVelocityY);
            this.gameCtl.ball.isActive(true);

            //this.node.position = cc.v2(375,380);//初始化位置
            //this.getComponent(cc.RigidBody).linearVelocity = cc.v2(500,500);//初始化速度
        }
        this.scheduleOnce(function() {
            this.node.active = false;
        }, 1);
    },
});