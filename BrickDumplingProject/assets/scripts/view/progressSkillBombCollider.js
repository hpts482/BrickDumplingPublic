
cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    init(gameCtl){
        this.gameCtl = gameCtl;
        this.bombArray = new Array();
    },

    onBeginContact(contact, self, other) {
        this.node.active = false;
        switch (other.tag) {
            case 1://碰到砖块
                this.bombContact(contact, self.node, other.node.parent);
                break;
            case 6://碰到boss砖块
                this.bombContact(contact, self.node, other.node);
                break;
            case 8://碰到降落伞
                this.gameCtl.onBallContactParachute(self.node, other.node);
                break;
            case 10://碰到钟摆
                this.gameCtl.onBallContactCountDown(self.node, other.node);
                break;  
        }
    },

    bombContact(contact, self, other){
        //判断并进入数组-数组为空时
        let repeatBool = false;
        if(this.bombArray.length>0){
            for(let i=0;i<this.bombArray.length;i++){
                if(this.bombArray[i].position.equals(other.position)){
                    repeatBool = true;
                }
            }

            if(!repeatBool){
                //不相等代表是不同的砖块
                this.bombArray.push(other);
                this.gameCtl.onBallContactBrick(self, other);
            }
        }
        else{
            this.bombArray.push(other);
            this.gameCtl.onBallContactBrick(self, other);
        }
    },

});
