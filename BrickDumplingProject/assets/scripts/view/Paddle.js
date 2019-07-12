cc.Class({
    extends: cc.Component,

    onLoad: function () {
      //this.node.parent.on("touchmove", (event) => {   作者用的typescript引用
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            //将世界坐标转化为本地坐标
            let touchPoint = this.node.parent.convertToNodeSpace(event.getLocation());
            this.node.x = touchPoint.x;
        });
        
    },

    init(){
        this.node.x = 360;
    },
    
    initNextStage(){
        this.node.x = 360;
    }

});