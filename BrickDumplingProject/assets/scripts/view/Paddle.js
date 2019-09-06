cc.Class({
    extends: cc.Component,

    onLoad: function () {
      //this.node.parent.on("touchmove", (event) => {   作者用的typescript引用
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            //将世界坐标转化为本地坐标
            let touchPoint = this.node.parent.convertToNodeSpace(event.getLocation());
            this.node.scaleX = touchPoint.x > this.node.x ? 1 : -1;
            this.node.x = touchPoint.x;

            //超出区域则用区域范围
            //this.node.y = (touchPoint.y>this.node.parent.height)?(this.node.parent.height):(touchPoint.y);
            //this.node.x = (touchPoint.x<0 || touchPoint.x>this.node.parent.width)?(touchPoint.x<0?(this.node.width/2):(this.node.parent.width-this.node.width/2)):(touchPoint.x);

            //this.node.parent.height //区域高
            //this.node.parent.width  //区域宽
            //this.node.width         //板子宽

        });
        
    },

    init(){
        this.node.x = 360;
    },
    
    initNextStage(){
        this.node.x = 360;
    }

});