cc.Class({
    extends: cc.Component,

    properties: {
        padding: 0,
        spacing: 0,
        cols: 0,
        brickPrefab: cc.Prefab,
        bricksNumber:0,
    },

    init(bricksNumber,currentStage) {
        this.node.removeAllChildren();
        this.bricksNumber = bricksNumber;
        this.vanguardLayout(1);
        //this.vanguardLayout(stageLevel.json.contents[currentStage].vanguardLayout);
        //this.guardLayout(stageLevel.json.contents[currentStage].guardLayout);

        /*console.log(self.stageLevel.json.contents[x].key); //stageLevel表格内容
        console.log(self.stageLevel.json.contents[x].boss);
        console.log(self.stageLevel.json.contents[x].vanguardLayout);
        console.log(self.stageLevel.json.contents[x].vanguardType);
        console.log(self.stageLevel.json.contents[x].vanguardStrengthMin);
        console.log(self.stageLevel.json.contents[x].vanguardStrengthMax);
        console.log(self.stageLevel.json.contents[x].guardLayout);
        console.log(self.stageLevel.json.contents[x].guardType);
        console.log(self.stageLevel.json.contents[x].guardStrengthMin);
        console.log(self.stageLevel.json.contents[x].guardStrengthMax);*/
    },
    vanguardLayout(n){
        switch(n){
            case 1:
                for (let i = 0; i < (this.bricksNumber/2); i++) {
                    let brickNode = cc.instantiate(this.brickPrefab);
                    brickNode.parent = this.node;
                    brickNode.x = this.padding + (i % this.cols) * (brickNode.width + this.spacing) + brickNode.width / 2;
                    //间距 + 0*（宽度+间距） + 宽度/2   10+ 0 * (56+10) + 28/2
                    //间距 + 1*（宽度+间距） + 宽度/2   10+ 1 * (56+10) + 28/2
                    brickNode.y = -this.padding - Math.floor(i / this.cols) * (brickNode.height + this.spacing) - brickNode.height / 2;
                    //-间距 - 下取整（0/10）* （高度 + 间距） - 高度/2
                    //-间距 - 下取整（1/10）* （高度 + 间距） - 高度/2
                }
                break;
            default:
                let brickNode = cc.instantiate(this.brickPrefab);
                brickNode.parent = this.node;
                brickNode.node.position = cc.v2(375,467);
                break;
        }
    },
    guardLayout(n){
        switch(n){
            case 1:
                for (let i = 0; i < (this.bricksNumber/2); i++) {
                    let brickNode = cc.instantiate(this.brickPrefab);
                    brickNode.parent = this.node;
                    brickNode.x = this.padding + (i % this.cols) * (brickNode.width + this.spacing) + brickNode.width / 2;
                    //间距 + 0*（宽度+间距） + 宽度/2
                    //间距 + 1*（宽度+间距） + 宽度/2
                    brickNode.y = -this.padding - Math.floor(i / this.cols) * (brickNode.height + this.spacing) - brickNode.height / 2;
                    //-间距 - 下取整（0/10）* （高度 + 间距） - 高度/2
                    //-间距 - 下取整（1/10）* （高度 + 间距） - 高度/2
                }
                break;
            default:
                let brickNode = cc.instantiate(this.brickPrefab);
                brickNode.parent = this.node;
                brickNode.node.position = cc.v2(375,467);
                break;
        }
    },
});