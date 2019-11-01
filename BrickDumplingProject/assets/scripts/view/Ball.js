cc.Class({
    extends: cc.Component,

    properties: {
        rMinAngle:0,
        initVelocityX:0,
        initVelocityY:0,
        ballSprite:cc.Sprite,
        progressSkillThunderShow:cc.Prefab,
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.isActive(false);
        this.ranProgressSkillNum();
        this.thunderOn = false; //闪电效果
        this.bombOn = false;    //爆炸效果
        //this.node.position = cc.v2(375,380);//初始化位置
        //this.getComponent(cc.RigidBody).linearVelocity = cc.v2(500,500);//初始化速度
    },

    //下一关初始化
    initNextStage() {
        this.isActive(false);
        this.thunderOn = false; //闪电效果
        this.bombOn = false;    //爆炸效果
        //this.node.position = cc.v2(375,380);//初始化位置
        //this.getComponent(cc.RigidBody).linearVelocity = cc.v2(500,500);//初始化速度
    },

    //通过cannon初始化速度
    initVelocity(initType,x,y){
        //initType 1赋值初始速度 2根据xy方向恢复初始速度 3变速
        switch(initType){
            case 1:
                this.initVelocityX = x;
                this.initVelocityY = y;
                this.initVelocityLength = Math.sqrt(Math.pow(this.initVelocityX,2) + Math.pow(this.initVelocityY,2))
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(x,y);
                break;
            case 2:
                this.getComponent(cc.RigidBody).linearVelocity = this.getComponent(cc.RigidBody).linearVelocity.mul(this.initVelocityLength / Math.sqrt(Math.pow(x,2) + Math.pow(y,2)));
                break;
            case 3:
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(x,y);
                break;  
        }
        
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                this.gameCtl.onBallContactBrick(self.node, other.node.parent);
                //判断是否有球的技能效果
                if(this.thunderOn){
                    this.gameCtl.progressSkillThunder(self.node, other.node.parent);
                }
                else if(this.bombOn){
                    
                }
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
                //判断是否有球的技能效果
                if(this.thunderOn){
                    this.gameCtl.progressSkillThunder(self.node, other.node);
                }
                else if(this.bombOn){
                    
                }
                break;
            case 8://球碰到降落伞
                this.gameCtl.onBallContactParachute(self.node, other.node);
                break;
            case 10://球碰到钟摆
                this.gameCtl.onBallContactCountDown(self.node, other.node);
                break;

            //7是额外小球，9是大球
        }
    },

    onPostSolve(contact, self, other){
        //碰撞后触发
        console.log('当前线速度为：' + this.getComponent(cc.RigidBody).linearVelocity);

        let x = this.getComponent(cc.RigidBody).linearVelocity.x;
        let y = this.getComponent(cc.RigidBody).linearVelocity.y;
        let newX = 0;
        let newY = 0;

        let r = this.getComponent(cc.RigidBody).linearVelocity.signAngle(cc.v2(1,0));
        let rMin = Math.abs(this.rMinAngle) / 180 * Math.PI;
        let rChange = 0;
        
        //出现减速bug时(碰撞穿插导致)，判为输
        if(Math.sqrt(Math.pow(x,2) + Math.pow(y,2)) < 0.9 * this.initVelocityLength){
            this.gameCtl.onBallContactGround(this.node);
            console.log('---------------------速度过慢，重新发球！' + this.getComponent(cc.RigidBody).linearVelocity);
        }

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

    //强力球
    powerBallBig(powerOnBool){
        if(powerOnBool){
            this.node.setScale(1.4);
        }
        else{
            this.node.setScale(1);
            this.ranProgressSkillNum();
        }
    },

    //闪电球
    powerBallThunder(powerOnBool){
        if(powerOnBool){
            this.thunderOn = true;
        }
        else{
            this.thunderOn = false;
            this.ranProgressSkillNum();
        }
    },

    //爆炸球
    powerBallBomb(powerOnBool){
        if(powerOnBool){
            this.bombOn = true;
        }
        else{
            this.bombOn = false;
            this.ranProgressSkillNum();
        }
    },



    bossSkillBallQuick(bool,VelocityNum){
        if(bool){
            //加速
            this.ballQuickBool = true;
            this.VelocityNum = VelocityNum;
            this.initVelocity(3,this.getComponent(cc.RigidBody).linearVelocity.mul(VelocityNum).x,this.getComponent(cc.RigidBody).linearVelocity.mul(VelocityNum).y)
            this.setColor(new cc.Color(255,0,0));
            console.log('***************加速啦！！***************当前速度' +  this.getComponent(cc.RigidBody).linearVelocity);
        }
        else{
            //恢复速度
            this.ballQuickBool = false;
            //根据方向恢复到原来的速度
            this.initVelocity(2,this.getComponent(cc.RigidBody).linearVelocity.x,this.getComponent(cc.RigidBody).linearVelocity.y);
            this.setColor(new cc.Color(255,255,255));
            console.log('********************减速啦！！********************当前速度' +  this.getComponent(cc.RigidBody).linearVelocity);

            this.gameCtl.brickBossSkillFin();
        }
    },

    setColor(color){
        this.ballSprite.node.color = color;
    },

    isActive(bool){
        this.node.active = bool;
    },

    ranProgressSkillNum(){
        this.progressSkillNum = 2;
        //this.progressSkillNum = Math.floor(Math.random()*3 + 1);
    },

});