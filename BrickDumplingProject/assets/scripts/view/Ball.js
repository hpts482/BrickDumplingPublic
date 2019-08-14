cc.Class({
    extends: cc.Component,

    properties: {
        rMinAngle:0,
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.node.position = cc.v2(360,370);//初始化位置
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(500,450);//初始化速度
    },

    //下一关初始化
    initNextStage() {
        
        this.node.position = cc.v2(360,370);//初始化位置
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(500,500);//初始化速度
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
            case 5://球碰到保底
                this.gameCtl.onBallContactSecurity(self.node, other.node);
        }
    },

    onPostSolve(contact, self, other){
        console.log('当前线速度为：' + this.getComponent(cc.RigidBody).linearVelocity);

        let x = this.getComponent(cc.RigidBody).linearVelocity.x;
        let y = this.getComponent(cc.RigidBody).linearVelocity.y;
        let newX = 0;
        let newY = 0;

        let r = this.getComponent(cc.RigidBody).linearVelocity.signAngle(cc.v2(1,0));
        let rMin = Math.abs(this.rMinAngle) / 180 * Math.PI;
        let rChange = 0;
        
        //纠正角度过小的问题
        if(Math.abs(r) <= rMin){   
            let rChange = rMin-Math.abs(r);

            if(r<=0){
                rChange = -rChange;
                newX = x * Math.cos(rChange) + y * Math.sin(rChange);
                newY = x * -Math.sin(rChange) + y * Math.cos(rChange);
            }
            else{
                newX = x * Math.cos(rChange) + y * Math.sin(rChange);
                newY = x * -Math.sin(rChange) + y * Math.cos(rChange);
            }
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(newX,newY);
            console.log('纠正后的线速度为：' + this.getComponent(cc.RigidBody).linearVelocity);
        }
        else if(Math.abs(r) >= (Math.PI-rMin)){
            let rChange = Math.abs(r)-(Math.PI-rMin);

            if(r<=0){
                newX = x * Math.cos(rChange) + y * Math.sin(rChange);
                newY = x * -Math.sin(rChange) + y * Math.cos(rChange);
            }
            else{
                rChange = -rChange;
                newX = x * Math.cos(rChange) + y * Math.sin(rChange);
                newY = x * -Math.sin(rChange) + y * Math.cos(rChange);
            }
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(newX,newY);
            console.log('纠正后的线速度为：' + this.getComponent(cc.RigidBody).linearVelocity);
        }

        
        /*   /// <summary>
        /// 旋转向量，使其方向改变，大小不变
        /// </summary>
        /// <param name="v">需要旋转的向量</param>
        /// <param name="angle">旋转的角度</param>
        /// <returns>旋转后的向量</returns>
        private Vector2 RotationMatrix(Vector2 v, float angle)
        {
            var x = v.x;
            var y = v.y;
            var sin = Math.Sin(Math.PI * angle / 180);
            var cos = Math.Cos(Math.PI * angle / 180);
            var newX = x * cos + y * sin;
            var newY = x * -sin + y * cos;
            return new Vector2((float)newX, (float)newY);
        }*/
    },

    ballVelocityDown(){
        this.getComponent(cc.RigidBody).applyLinearImpulse(this.getComponent(cc.RigidBody).linearVelocity.mul(-0.5),this.node.position);
    },
    ballVelocityUp(){
        this.getComponent(cc.RigidBody).applyLinearImpulse(this.getComponent(cc.RigidBody).linearVelocity.mul(0.5),this.node.position);
    },

    powerBallBig(powerOnBool){
        this.node.setScale(powerOnBool==true?1.5:1);
    },
});