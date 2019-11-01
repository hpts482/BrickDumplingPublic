cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(gameCtl) {
        this.gameCtl = gameCtl;

        let ballExtraScale = 0;
        switch(this.gameCtl.gameModel.itemLevel[8]){
            case 0:
                ballExtraScale = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[8].levelInit);
                break;
            case 1:
                ballExtraScale = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[8].level1);
                break;
            case 2:
                ballExtraScale = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[8].level2);
                break;
            case 3:
                ballExtraScale = Number(this.gameCtl.gameModel.jsonAll[2].json.contents[8].level3);
                break;
        }
        this.ballExtraScale(ballExtraScale);
    },

    ballExtraScale(n){
        this.node.scale = n/100 + 1; 
    },

    onBeginContact(contact, self, other) {
        switch (other.tag) {
            case 1://球碰到砖块
                this.gameCtl.onBallContactBrick(self.node, other.node.parent);
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
                break;
            case 8://球碰到降落伞
                this.gameCtl.onBallContactParachute(self.node, other.node);
                break;
            //7是额外小球，9是大球
        }
    },

    onDestroy(){

    },


});