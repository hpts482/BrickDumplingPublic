cc.Class({
    extends: cc.Component,

    properties: {
        padding: 0,
        spacing: 0,
        cols: 0,
        brickPrefab: cc.Prefab,
        bricksNumber:0,
    },

    init(gameModel,jsonAll,currentStage) {
        this.node.removeAllChildren();
        
        //确定砖块数量
        this.vanNumMax = Number(jsonAll[1].json.contents[currentStage-1].vanguardNumMax);
        this.vanNumMin = Number(jsonAll[1].json.contents[currentStage-1].vanguardNumMin);
        this.guaNumMax = Number(jsonAll[1].json.contents[currentStage-1].guardNumMax);
        this.guaNumMin = Number(jsonAll[1].json.contents[currentStage-1].guardNumMin);
        this.brickRandomNumVan = Math.floor(Math.random()*(this.vanNumMax-this.vanNumMin)+this.vanNumMin);
        this.brickRandomNumGua = Math.floor(Math.random()*(this.guaNumMax-this.guaNumMin)+this.guaNumMin);

        //确定砖块强度
        this.vanStrMax = Number(jsonAll[1].json.contents[currentStage-1].vanguardStrengthMax);
        this.vanStrMin = Number(jsonAll[1].json.contents[currentStage-1].vanguardStrengthMin);
        this.guaStrMax = Number(jsonAll[1].json.contents[currentStage-1].guardStrengthMax);
        this.guaStrMin = Number(jsonAll[1].json.contents[currentStage-1].guardStrengthMin);
        
        //赋值Model里的砖块数量
        gameModel.initBrickNum(this.brickRandomNumVan + this.brickRandomNumGua);

        //this.vanguardLayout(99);//测试代码
        this.vanguardLayout(Number(jsonAll[1].json.contents[currentStage-1].vanguardLayout),this.brickRandomNumVan);
        this.guardLayout(Number(jsonAll[1].json.contents[currentStage-1].guardLayout),this.brickRandomNumGua);

        /*  console.log(self.jsonAll[y].json.contents[x].key);
            console.log(self.jsonAll[y].json.contents[x].boss);
            console.log(self.jsonAll[y].json.contents[x].vanguardLayout);
            console.log(self.jsonAll[y].json.contents[x].vanguardType);
            console.log(self.jsonAll[y].json.contents[x].vanguardStrengthMin);
            console.log(self.jsonAll[y].json.contents[x].vanguardStrengthMax);
            console.log(self.jsonAll[y].json.contents[x].vanguardNumMin);
            console.log(self.jsonAll[y].json.contents[x].vanguardNumMax);
            console.log(self.jsonAll[y].json.contents[x].guardLayout);
            console.log(self.jsonAll[y].json.contents[x].guardType);
            console.log(self.jsonAll[y].json.contents[x].guardStrengthMin);
            console.log(self.jsonAll[y].json.contents[x].guardStrengthMax);
            console.log(self.jsonAll[y].json.contents[x].guardNumMin);
            console.log(self.jsonAll[y].json.contents[x].guardNumMax);*/
    },

    //前排布局
    vanguardLayout(layout,brickNum){
        switch(layout){
            case 1:
                for (let i = 0; i < brickNum; i++) {
                    let brickNode = cc.instantiate(this.brickPrefab);
                    brickNode.parent = this.node;
                    brickNode.x = this.padding + (i % this.cols) * (brickNode.width + this.spacing) + brickNode.width / 2;
                    //间距 + 0*（宽度+间距） + 宽度/2
                    //间距 + 1*（宽度+间距） + 宽度/2
                    brickNode.y = -this.padding - Math.floor((i+this.cols*5) / this.cols) * (brickNode.height + this.spacing) - brickNode.height / 2;
                    //-间距 - 下取整（0/10）* （高度 + 间距） - 高度/2 -10 - 0 * （28 + 10）-28/2
                    //-间距 - 下取整（1/10）* （高度 + 间距） - 高度/2 -10 - 0 * （28 + 10）-28/2
                }
                break;
            default:
                let brickNode = cc.instantiate(this.brickPrefab);
                brickNode.parent = this.node;
                brickNode.position = cc.v2(375,667);
                break;
        }
    },

    //后排布局
    guardLayout(layout,brickNum){
        switch(layout){
            case 1:
                for (let i = 0; i < brickNum; i++) {
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
                
                //brickNode.position = cc.v2(300,-300);
                brickNode.position = cc.v2((this.node.x + this.node.width/2),-(this.node.y - this.node.height/2)+200);
                console.log(brickNode.position);
                break;
        }
    },

});