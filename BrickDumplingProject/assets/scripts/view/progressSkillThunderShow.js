
cc.Class({
    extends: cc.Component,

    properties: {
        curDetail:0,
        displace:0,
        thunderSprite:cc.SpriteFrame,
    },

    onLoad () {
        this.onBool = false; 
    },

    init(gameCtl,startNode,endNode){
        this.gameCtl = gameCtl;
        this.startNode = startNode;
        this.endNode = endNode;
        this.onBool = true;

        this.scheduleOnce(function(){
            this.stop();
        },2)
    },

    start () {

    },

    update (dt) {
        if(this.onBool){
            this.node.removeAllChildren();
            this.drawLightning(this.startNode.x,this.startNode.y,this.endNode.x,this.endNode.y,this.displace);
        }
    },

    drawLightning(x1,y1,x2,y2,displace){
        if(displace< this.curDetail){
            let ThunderNode = new cc.Node('Sprite');
            let sp = ThunderNode.addComponent(cc.Sprite);
        
            sp.spriteFrame = this.thunderSprite;
            ThunderNode.parent = this.node;

            //调整节点方向
            let vec1 = cc.v2(x1,y1);
            let vec2 = cc.v2(x2,y2);
            let vecNew = vec2.sub(vec1);

            let angle = vecNew.signAngle(cc.v2(1,0)) * 180 / Math.PI ;
            ThunderNode.rotation = angle;

            //调整节点宽幅
            ThunderNode.scaleX = vecNew.mag() / ThunderNode.width;

            //调整节点高度
            ThunderNode.scaleY = 1-(1-Math.abs(ThunderNode.scaleX))/2;

            //设置节点锚点
            ThunderNode.anchorX = 0;

            //设置节点位置
            ThunderNode.setPosition(x1,y1);
        }
        else{
            let mid_x = (x1+x2)/2;
            let mid_y = (y1+y2)/2;
            mid_x += (Math.random()-.5)*displace;
            mid_y += (Math.random()-.5)*displace;
            this.drawLightning(x1,y1,mid_x,mid_y,displace/2);
            this.drawLightning(mid_x,mid_y,x2,y2,displace/2);
        }

    },

    stop(){
        this.onBool = false;
        this.node.removeAllChildren();
    },

    /*function drawLightning(x1,y1,x2,y2,displace)
{
  if (displace < curDetail) {
    graf.moveTo(x1,y1);
    graf.lineTo(x2,y2);
  }
  else {
    var mid_x = (x2+x1)/2;
    var mid_y = (y2+y1)/2;
    mid_x += (Math.random()-.5)*displace;
    mid_y += (Math.random()-.5)*displace;
    drawLightning(x1,y1,mid_x,mid_y,displace/2);
    drawLightning(x2,y2,mid_x,mid_y,displace/2);
  }
}*/

    
});
