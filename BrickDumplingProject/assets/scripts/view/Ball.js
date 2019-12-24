cc.Class({
    extends: cc.Component,

    properties: {
        rMinAngle:0,
        initVelocityX:0,
        initVelocityY:0,
        ballSprite:cc.Sprite,
        progressSkillThunderShow:cc.Prefab,
        progressSkillBombShow:cc.Prefab,

        sprBall:cc.Sprite,
        sprBallThunder:cc.SpriteFrame,
        sprBallBig:cc.SpriteFrame,
        sprBallBomb:cc.SpriteFrame,

        animBallBomb:cc.Animation,

        sprProgressSkillStart:cc.Sprite,
        aniProgressSkillStart:cc.Animation,

        parStreak:cc.ParticleSystem,    //拖尾粒子
        streak:cc.MotionStreak,         //拖尾

        sprBallQuick:cc.Sprite,    //boss技能-加速球的倒计时条
        ballQuickBool:false,       //boss技能-加速球的倒计时条开关

        ballStageOver:cc.Sprite,   //关卡过渡的球动画
        ballStageOverBg:cc.Sprite,   //关卡过渡的球背景
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;
        this.isActive(false);
        this.ranProgressSkillNum();
        this.thunderOn = false; //闪电效果
        this.bombOn = false;    //爆炸效果
        this.bigOn = false;     //巨大效果
        this.ballStageOver.node.active = false; //关卡过渡的球动画
        this.ballStageOverBg.node.active = false; //关卡过渡的球动画

        //this.node.position = cc.v2(375,380);//初始化位置
        //this.getComponent(cc.RigidBody).linearVelocity = cc.v2(500,500);//初始化速度

        //获取默认贴图
        this.sprBallDefault = this.sprBall.getComponent(cc.Sprite).spriteFrame;
        this.streakStrokeDefault = this.streak.stroke; //获取拖尾默认宽度
    },

    //下一关初始化
    initNextStage() {

        this.thunderOn = false; //闪电效果
        this.bombOn = false;    //爆炸效果
        this.bigOn = false;     //巨大效果
        this.ballStageOver.node.active = false; //关卡过渡的球动画
        this.ballStageOverBg.node.active = false; //关卡过渡的球动画
        this.isActive(false);
        //this.node.position = cc.v2(375,380);//初始化位置
        //this.getComponent(cc.RigidBody).linearVelocity = cc.v2(500,500);//初始化速度
    },

    update(dt){
        if(this.ballQuickBool){
            this.sprBallQuick.fillRange = this.sprBallQuick.fillRange < 0 ? 0 : this.sprBallQuick.fillRange -= (dt/this.ballQuickTime);
        }
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
                    this.gameCtl.progressSkillBomb(self.node, other.node.parent);
                }
                else if(this.bigOn){
                    this.gameCtl.progressSkillBig(self.node, other.node.parent);
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
                    this.gameCtl.progressSkillBomb(self.node, other.node);
                }
                else if(this.bigOn){
                    this.gameCtl.progressSkillBig(self.node, other.node);
                }
                break;
            case 8://球碰到降落伞
                this.gameCtl.onBallContactParachute(self.node, other.node);
                break;
            case 10://球碰到钟摆
                this.gameCtl.onBallContactCountDown(self.node, other.node);
                break;

            //7是额外小球，9是大球(基础球), 11是爆炸碰撞体,12是道具
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
            this.bigOn = true;

            //获取大球大小和强度
            let bigRatio = 0;
            this.bigStrength = 0;
            switch(this.gameCtl.gameModel.itemLevel[11]){
                case 0:
                    bigRatio = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].levelInit);
                    break;
                case 1:
                    bigRatio = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].level1);
                    break;
                case 2:
                    bigRatio = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].level2);
                    break;
                case 3:
                    bigRatio = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].level3);
                    break;
            }
            switch(this.gameCtl.gameModel.itemLevel[11]){
                case 0:
                    this.bigStrength = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].levelInitExtra);
                    break;
                case 1:
                    this.bigStrength = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].levelExtra1);
                    break;
                case 2:
                    this.bigStrength = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].levelExtra2);
                    break;
                case 3:
                    this.bigStrength = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[11].levelExtra3);
                    break;
            }
            this.sprBall.getComponent(cc.Sprite).spriteFrame = this.sprBallBig;
            //this.node.setScale(1 + bigRatio/100);

            this.bigBallAction = cc.scaleTo(0.5,1 + bigRatio/100, 1 + bigRatio/100);
            this.bigBallAction.easing(cc.easeElasticOut(3));
            this.node.runAction(this.bigBallAction);

            //设置拖尾颜色
            this.setStreakColor(new cc.Color(200,249,225));

            //设置拖尾大小
            this.streak.stroke = Math.floor((1 + bigRatio/100)*this.streakStrokeDefault);
        }
        else{
            this.bigOn = false;
            this.sprBall.getComponent(cc.Sprite).spriteFrame = this.sprBallDefault;
            this.node.setScale(1);
            this.ranProgressSkillNum();

            //恢复拖尾颜色
            this.setStreakColor();

            //恢复拖尾大小
            this.streak.stroke = this.streakStrokeDefault;
        }
    },

    //闪电球
    powerBallThunder(powerOnBool){
        if(powerOnBool){
            this.thunderOn = true;
            this.sprBall.getComponent(cc.Sprite).spriteFrame = this.sprBallThunder;

            //设置拖尾颜色
            this.setStreakColor(new cc.Color(225,200,249));
        }
        else{
            this.thunderOn = false;
            this.sprBall.getComponent(cc.Sprite).spriteFrame = this.sprBallDefault;
            this.ranProgressSkillNum();
            
            //恢复拖尾颜色
            this.setStreakColor();
        }
    },

    //爆炸球
    powerBallBomb(powerOnBool){
        if(powerOnBool){
            this.bombOn = true;
            this.ballBombOnAnim(true);
            this.sprBall.getComponent(cc.Sprite).spriteFrame = this.sprBallBomb;

            //设置拖尾颜色
            this.setStreakColor(new cc.Color(249,200,225));
        }
        else{
            this.bombOn = false;
            this.ballBombOnAnim(false);
            this.sprBall.getComponent(cc.Sprite).spriteFrame = this.sprBallDefault;
            this.ranProgressSkillNum();

            //取消爆炸CD计时器
            this.gameCtl.unschedule(this.gameCtl.bombCd);
            
            //恢复拖尾颜色
            this.setStreakColor();
        }
    },

    //爆炸球环绕效果
    ballBombOnAnim(bool){
        if(bool){
            this.animBallBomb.node.active = true;
        }
        else{
            this.animBallBomb.node.active = false;
        }
    },

    //boss技能：负面效果-变快
    bossSkillBallQuick(bool,VelocityNum,VelocityTime){
        this.ballQuickTime = VelocityTime;
        if(bool){
            //倒计时图片显示
            this.ballQuickBool = true;
            this.sprBallQuick.fillRange = 1;

            //加速
            this.VelocityNum = VelocityNum;
            this.initVelocity(3,this.getComponent(cc.RigidBody).linearVelocity.mul(VelocityNum).x,this.getComponent(cc.RigidBody).linearVelocity.mul(VelocityNum).y)
            console.log('***************加速啦！！***************当前速度' +  this.getComponent(cc.RigidBody).linearVelocity);
        }
        else{
            //倒计时图片显示
            this.ballQuickBool = false;
            this.sprBallQuick.fillRange = 0;

            //根据方向恢复到原来的速度
            this.initVelocity(2,this.getComponent(cc.RigidBody).linearVelocity.x,this.getComponent(cc.RigidBody).linearVelocity.y);
            console.log('********************减速啦！！********************当前速度' +  this.getComponent(cc.RigidBody).linearVelocity);
            
            this.gameCtl.brickBossSkillFin();
        }
    },

    setColor(color){
        this.ballSprite.node.color = color;
    },

    setStreakColor(color){
        if(color){
            this.streak.color = color;
        }
        else{
            this.streak.color = new cc.Color(236,221,206);
        }

    },

    isActive(bool){
        //激活粒子效果
        if(bool){
            this.parStreak.resetSystem();
        }
        this.node.active = bool;
    },

    ranProgressSkillNum(){
        //this.progressSkillNum = 1;
        this.progressSkillNum = Math.floor(Math.random()*3 + 1);
        this.gameCtl.progressSkillBar(this.progressSkillNum);
    },

    //播放技能释放动画
    animProgressSkillStart(){
        switch (this.progressSkillNum) {
            case 1:
                this.sprProgressSkillStart.getComponent(cc.Sprite).spriteFrame = this.gameCtl.gameView.powerSkillSpriteBig;
                break;
            case 2:
                this.sprProgressSkillStart.getComponent(cc.Sprite).spriteFrame = this.gameCtl.gameView.powerSkillSpriteThunder;
                break;
            case 3:
                this.sprProgressSkillStart.getComponent(cc.Sprite).spriteFrame = this.gameCtl.gameView.powerSkillSpriteBomb;
                break;
        }
        //确定位置
        this.aniProgressSkillStart.node.position = this.node.position;
        this.aniProgressSkillStart.play('progressSkillStart');

    },

});