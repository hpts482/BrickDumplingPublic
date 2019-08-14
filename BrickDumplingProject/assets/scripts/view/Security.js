cc.Class({
    extends: cc.Component,

    properties: {
        times:0,//本场关卡获取道具次数
    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        this.node.active = false;

        //初始化显示
        this.times = 0;
        this.unschedule(this.isShowAgain);
    },

    initNextStage(){
        this.node.active = false;

        //初始化显示
        this.times = 0;
        this.unschedule(this.isShowAgain);
    },

    show(securityTime){
        //如果没显示次数的话，首次显示
        this.securityTime = securityTime;
        if(!this.times){
            this.times++;
            console.log('-----------------开启保护！！剩余次数'+this.times);
            this.node.active = true;

            this.schedule(this.isShowAgain,securityTime)
        }
        //如果在显示的话，只增加显示次数
        else{
            this.times++;
            console.log('-----------------增加保护次数！！剩余次数'+this.times);
        }
    },

    isShowAgain(){
        //如果没显示次数的话，关闭
        if(this.times <= 1){
            this.node.active = false;
            this.unschedule(this.isShowAgain);
            this.times = 0;
            console.log('-----------------关闭保护！！剩余次数'+this.times);
        }
        //如果还有次数，继续播放计时器
        else{
            this.times--;
            console.log('-----------------继续显示保护！！剩余次数'+this.times);
        }
    },
});
