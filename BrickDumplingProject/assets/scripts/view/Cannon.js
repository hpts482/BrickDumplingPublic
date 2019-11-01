cc.Class({
    extends: cc.Component,

    properties: {
        //主球
        ballPositionX:0,
        ballPositionY:0,
        ballLinearVelocityX:0,
        ballLinearVelocityY:0,

        //辅球
        ballExtraPrefab:cc.Prefab,
        ballExtraPositionX:0,
        ballExtraPositionY:0,
        ballExtraLinearVelocityX:0,
        ballExtraLinearVelocityY:0,
        ballExtraTimes:0,  //计次
    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        this.node.active = false;
    },

    initNextStage(){
        this.ballExtraTimes = 0;
    },

    serveBall(type){
        this.type = type;
        this.node.active = true;
        if(type == 1){
            this.getComponent(cc.Animation).play('cannon');
        }
        else if(type == 2){
            if(this.ballExtraTimes > 0){
                this.ballExtraTimes ++;
            }
            else{
                this.ballExtraTimes ++;
                this.ainmStateExtra = this.getComponent(cc.Animation).play('cannonExtra');
                this.ainmStateExtra.on('finished',this.animLoopExtra,this);
            }
        }
    },

    animStartFinish(){
        if(this.type == 1){
            //调整主球位置并显示
            this.gameCtl.ball.node.position = cc.v2(this.ballPositionX,this.ballPositionY);
            this.gameCtl.ball.initVelocity(1,this.ballLinearVelocityX,this.ballLinearVelocityY);
            this.gameCtl.ball.isActive(true);
        }
    },

    animStartFinishExtra(){
        if(this.type == 2){
            this.ballExtraNode = cc.instantiate(this.ballExtraPrefab);
            this.ballExtraNode.parent = cc.find("PhysicsLayer/ballExtra");
            this.ballExtraNode.getComponent(cc.Component).init(this.gameCtl);

            //设置小球位置和速度
            this.ballExtraNode.position = cc.v2(this.ballExtraPositionX,this.ballExtraPositionY);
            this.ballExtraNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.ballExtraLinearVelocityX,this.ballExtraLinearVelocityY);
        }

    },

    animLoopExtra(){
        if(this.ballExtraTimes > 1){
            this.ballExtraTimes--;
            this.getComponent(cc.Animation).play('cannonExtra');
        }
        else{
            this.ballExtraTimes--;
            this.node.active = false;
        }
    },

});