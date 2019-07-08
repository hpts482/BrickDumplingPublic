cc.Class({
    extends: cc.Component,

    properties: {
        padding: 0,
        spacing: 0,
        cols: 0,
        brickPrefab: cc.Prefab,
        bricksNumber: 0,
    },

    init(bricksNumber) {
        this.node.removeAllChildren();
        this.bricksNumber = bricksNumber;
        for (let i = 0; i < this.bricksNumber; i++) {
            let brickNode = cc.instantiate(this.brickPrefab);
            brickNode.parent = this.node;
            brickNode.x = this.padding + (i % this.cols) * (brickNode.width + this.spacing) + brickNode.width / 2;
            //间距 + 0*（宽度+间距） + 宽度/2
            //间距 + 1*（宽度+间距） + 宽度/2
            brickNode.y = -this.padding - Math.floor(i / this.cols) * (brickNode.height + this.spacing) - brickNode.height / 2;
            //-间距 - 下取整（0/10）* （高度 + 间距） - 高度/2
            //-间距 - 下取整（1/10）* （高度 + 间距） - 高度/2
        }
    }
});