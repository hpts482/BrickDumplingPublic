cc.Class({
    extends: cc.Component,

    properties: {
        itemLengthTimes:0,     //本场关卡获取道具次数 --加长道具
        itemUmbrellaTimes:0,   //本场关卡获取道具次数 --炮伞道具
        umbrellaBallPrefab:cc.Prefab,
        umbrellaBallMuzzle:cc.Node,
    },

    onLoad: function () {
      //this.node.parent.on("touchmove", (event) => {   作者用的typescript引用
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            //将世界坐标转化为本地坐标
            let touchPoint = this.node.parent.convertToNodeSpace(event.getLocation());

            //根据位置翻转
            this.node.scaleX = touchPoint.x > this.node.x ? Math.abs(this.node.scaleX) : -Math.abs(this.node.scaleX);
            this.node.x = touchPoint.x;

            //同步板子的位置
            this.updatePaddlePosition();
           

            //超出区域则用区域范围
            //this.node.y = (touchPoint.y>this.node.parent.height)?(this.node.parent.height):(touchPoint.y);
            //this.node.x = (touchPoint.x<0 || touchPoint.x>this.node.parent.width)?(touchPoint.x<0?(this.node.width/2):(this.node.parent.width-this.node.width/2)):(touchPoint.x);

            //this.node.parent.height //区域高
            //this.node.parent.width  //区域宽
            //this.node.width         //板子宽

        });
        
    },

    init(gameCtl){
        this.gameCtl = gameCtl;

        this.itemLengthTimes = 0;
        this.itemUmbrellaTimes = 0;
        this.node.x = 360;
        this.updatePaddlePosition();
        this.unschedule(this.lengthenPaddleOnAgain);
        this.unschedule(this.UmbrellaFight);
        this.unschedule(this.UmbrellaAgain);

        //隐藏炮伞
        this.node.getChildByName('paddleUmbrella').active = false;                  //隐藏炮筒
        this.node.getChildByName('spr_Umbrella').active = false;                    //隐藏炮伞
        this.node.getChildByName('paddle').getComponent(cc.Sprite).active = true;   //显示原图

        //停止所有动画
        this.getComponent(cc.Animation).stop();
    },
    
    initNextStage(){
        this.itemLengthTimes = 0;
        this.itemUmbrellaTimes = 0;
        this.node.x = 360;
        this.updatePaddlePosition();
        this.unschedule(this.UmbrellaFight);
        this.unschedule(this.UmbrellaAgain);

        //隐藏炮伞
        this.node.getChildByName('paddleUmbrella').active = false;                  //隐藏炮筒
        this.node.getChildByName('spr_Umbrella').active = false;                    //隐藏炮伞
        this.node.getChildByName('paddle').getComponent(cc.Sprite).active = true;   //显示原图

        //恢复板子大小
        this.node.getChildByName('paddle').scaleX = (this.node.scaleX > 0 ? 1:-1);
        this.node.getChildByName('spr_Umbrella').scaleX = (this.node.scaleX > 0 ? 1:-1);
        this.unschedule(this.lengthenPaddleOnAgain);

        //停止所有动画
        this.getComponent(cc.Animation).stop();
    },

    updatePaddlePosition(){
        this.node.getChildByName('paddle').getComponent(cc.RigidBody).syncPosition(true);
    },
 
    lengthenPaddleOn(length,lengthenTime){
        //如果没显示次数的话，首次显示
        this.length = length;
        this.lengthenTime = lengthenTime;

        if(!this.itemLengthTimes){
            this.itemLengthTimes++;

            this.node.getChildByName('paddle').scaleX *= length;            //加长
            this.node.getChildByName('spr_Umbrella').scaleX *= length;      //加长
            this.schedule(this.lengthenPaddleOnAgain,lengthenTime);         //持续时间
        }
        //如果在显示的话，只增加显示次数
        else{
            this.itemLengthTimes++;
        }
    },

    lengthenPaddleOnAgain(){
        //如果没显示次数的话，关闭
        if(this.itemLengthTimes <= 1){
            //恢复大小
            this.node.getChildByName('paddle').scaleX = (this.node.scaleX > 0 ? 1:-1) ;
            this.node.getChildByName('spr_Umbrella').scaleX = (this.node.scaleX > 0 ? 1:-1) ;
            this.unschedule(this.lengthenPaddleOnAgain);
            this.itemLengthTimes = 0;
        }
        //如果还有次数，继续播放计时器
        else{
            this.itemLengthTimes--;
        }
    },

    UmbrellaOn(UmbrellaLevel,UmbrellaTime){
        this.UmbrellaLevel = UmbrellaLevel;
        this.UmbrellaTime = UmbrellaTime;

        //如果没显示次数的话，首次显示
        if(!this.itemUmbrellaTimes){
            this.itemUmbrellaTimes++;

            this.node.getChildByName('paddleUmbrella').active = true;                  //显示炮筒
            this.node.getChildByName('spr_Umbrella').active = true;                    //显示炮伞
            this.node.getChildByName('paddle').getComponent(cc.Sprite).active = false; //隐藏原图

            //开始放炮,每隔1秒放一次
            if(UmbrellaTime>1){
                this.schedule(this.UmbrellaFight,1); 
            }
            //持续时间
            this.schedule(this.UmbrellaAgain,UmbrellaTime);  
        }
        //如果在显示的话，只增加显示次数
        else{
            this.itemUmbrellaTimes++;
        }
    },

    UmbrellaAgain(){
        //如果没显示次数的话，关闭
        if(this.itemUmbrellaTimes <= 1){
            //隐藏炮伞
            this.node.getChildByName('paddleUmbrella').active = false;                  //隐藏炮筒
            this.node.getChildByName('spr_Umbrella').active = false;                    //隐藏炮伞
            this.node.getChildByName('paddle').getComponent(cc.Sprite).active = true;   //显示原图

            //停止放炮
            this.unschedule(this.UmbrellaFight);
            //停止自循环
            this.unschedule(this.UmbrellaAgain);
            this.itemUmbrellaTimes = 0;
        }
        //如果还有次数，继续播放计时器
        else{
            this.itemUmbrellaTimes--;
        }
    },

    //炮伞子弹类型
    UmbrellaFight(){
        switch(this.UmbrellaLevel){
            //三子弹，单发，大小0.7
            case 0:
                this.startUmbrellaBall(0.7,this.umbrellaBallMuzzle.parent.rotation);
                this.startUmbrellaBall(0.7,this.umbrellaBallMuzzle.parent.rotation-15);
                this.startUmbrellaBall(0.7,this.umbrellaBallMuzzle.parent.rotation+15);
                break;
            //四子弹，大小0.8
            case 1:
                this.startUmbrellaBall(0.8,this.umbrellaBallMuzzle.parent.rotation-5);
                this.startUmbrellaBall(0.8,this.umbrellaBallMuzzle.parent.rotation-15);
                this.startUmbrellaBall(0.8,this.umbrellaBallMuzzle.parent.rotation+5);
                this.startUmbrellaBall(0.8,this.umbrellaBallMuzzle.parent.rotation+15);
                break;
            //五子弹，单层弹幕（动画），大小0.9
            case 2:
                this.getComponent(cc.Animation).play('umbrellaMuzzle1');
                break;
            //六子弹，单层弹幕（动画），大小0.9大小1
            case 3:
                this.getComponent(cc.Animation).play('umbrellaMuzzle2');
                break;
        }
    },

    //生成子弹
    startUmbrellaBall(scale,rotation){
        let ballNode = cc.instantiate(this.umbrellaBallPrefab);
        ballNode.parent = cc.find("PhysicsLayer/pos_umbrellaBall");
        ballNode.position = this.umbrellaBallMuzzle.convertToWorldSpace(cc.v2(0,0))
        ballNode.getComponent(cc.Component).init(this.gameCtl,scale,rotation);
    },

    ainmUmbrellaMuzzle1(){
        if(this.node.scaleX>0){
            this.startUmbrellaBall(0.9,-this.umbrellaBallMuzzle.parent.rotation);
        }
        else{
            this.startUmbrellaBall(0.9,this.umbrellaBallMuzzle.parent.rotation);
        }
    },

    ainmUmbrellaMuzzle2(){
        if(this.node.scaleX>0){
            this.startUmbrellaBall(1,-this.umbrellaBallMuzzle.parent.rotation);
        }
        else{
            this.startUmbrellaBall(1,this.umbrellaBallMuzzle.parent.rotation);
        }
    },


});