cc.Class({
    extends: cc.Component,

    properties: {
        padding: 0, //距离边缘
        spacing: 0, //间隔
        cols: 0,    //一行几个
        brickPrefab: cc.Prefab,
        brickBossSmallPrefab:cc.Prefab,
        brickBossBigPrefab:cc.Prefab,
        bricksNumber:0,

        //不同位置的砖块节点
        vanguardLayoutNode:cc.Node,
        guardLayoutNode:cc.Node,
        bossLayoutNode:cc.Node,
        otherLayoutNode:cc.Node,
        itemLayoutNode:cc.Node,
        progressSkillThunderLayout:cc.Node,
    },

    init(gameModel,jsonAll,currentStage,gameCtl) {
        //删除子节点的所有砖块
        this.vanguardLayoutNode.removeAllChildren();
        this.guardLayoutNode.removeAllChildren();
        this.bossLayoutNode.removeAllChildren();
        this.otherLayoutNode.removeAllChildren();
        this.itemLayoutNode.removeAllChildren();
        this.progressSkillThunderLayout.removeAllChildren();

        this.gameCtl = gameCtl;
        this.jsonAll = jsonAll;
        this.currentStage = currentStage;
        
        //确定砖块数量
        this.vanNumMax = Number(jsonAll[1].json.contents[currentStage-1].vanguardNumMax);
        this.vanNumMin = Number(jsonAll[1].json.contents[currentStage-1].vanguardNumMin);
        this.guaNumMax = Number(jsonAll[1].json.contents[currentStage-1].guardNumMax);
        this.guaNumMin = Number(jsonAll[1].json.contents[currentStage-1].guardNumMin);
        this.brickRandomNumVan = Math.floor(Math.random()*(this.vanNumMax-this.vanNumMin+1)+this.vanNumMin);
        this.brickRandomNumGua = Math.floor(Math.random()*(this.guaNumMax-this.guaNumMin+1)+this.guaNumMin);
        this.isNotBossNum = 0;

        //确定砖块强度范围
        this.vanStrMax = Number(jsonAll[1].json.contents[currentStage-1].vanguardStrengthMax);
        this.vanStrMin = Number(jsonAll[1].json.contents[currentStage-1].vanguardStrengthMin);
        this.guaStrMax = Number(jsonAll[1].json.contents[currentStage-1].guardStrengthMax);
        this.guaStrMin = Number(jsonAll[1].json.contents[currentStage-1].guardStrengthMin);
        this.bossStrMax = Number(jsonAll[1].json.contents[currentStage-1].bossStrengthMax);
        this.bossStrMin = Number(jsonAll[1].json.contents[currentStage-1].bossStrengthMin);

        //执行砖块布局
        this.vanguardLayout(Number(jsonAll[1].json.contents[currentStage-1].vanguardLayout),this.brickRandomNumVan);
        this.bossLayout(Number(jsonAll[1].json.contents[currentStage-1].boss),Number(jsonAll[1].json.contents[currentStage-1].bossLayout),Number(jsonAll[1].json.contents[currentStage-1].bossSkillNum),Number(jsonAll[1].json.contents[currentStage-1].bossSkillStrength));
        this.guardLayout(Number(jsonAll[1].json.contents[currentStage-1].guardLayout),this.brickRandomNumGua);

        //赋值Model里的砖块数量（包括前锋、后卫、非boss陪衬）
        gameModel.initBrickNum(this.brickRandomNumVan + this.brickRandomNumGua + this.isNotBossNum);
    },

    //boss布局
    bossLayout(boss,layout,bossSkillNum,bossSkillStrength){
        //布置小boss
        if(boss===1){
            let brickNode = cc.instantiate(this.brickBossSmallPrefab);
            brickNode.parent = this.bossLayoutNode;
            brickNode.getComponent(cc.Component).init(this.gameCtl,bossSkillNum,bossSkillStrength);

            brickNode.x = this.padding + 3 * (brickNode.width/2 + this.spacing) + brickNode.width / 2;
            brickNode.y = -this.padding - 7 * (brickNode.height/2 + this.spacing) - brickNode.height / 2;

            this.brickStrBoss(brickNode,boss);

            //开始技能
            this.gameCtl.onBrickBossSkill(brickNode);

            //布置小boss陪衬
            switch(layout){
                //方形阵
                case 1:
                    this.isNotBossNum = this.cols*2+4;
                    for (let i = 0; i < (this.cols*2+4); i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一行
                        if(i<this.cols){
                            brickNode.x = this.padding + i * (brickNode.width + this.spacing) + brickNode.width / 2;
                            brickNode.y = -this.padding - 6 * (brickNode.height + this.spacing) - brickNode.height / 2;
                        }

                        //第四行
                        else if(i<this.cols*2 && i>=this.cols){
                            brickNode.x = this.padding + (i % this.cols) * (brickNode.width + this.spacing) + brickNode.width / 2;
                            brickNode.y = -this.padding - 9 * (brickNode.height + this.spacing) - brickNode.height / 2;
                        }

                        //第二、三行
                        else if(i>=this.cols*2){
                            brickNode.x = this.padding + ((i-this.cols*2) % 2) *(this.cols-1)* (brickNode.width + this.spacing) + brickNode.width / 2;
                            brickNode.y = -this.padding - Math.floor((i-this.cols*2) /2 +7)*(brickNode.height + this.spacing) - brickNode.height / 2;
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                        }
                    break;
            }
        }

        //布置大boss
        else if(boss===2){
            let brickNode = cc.instantiate(this.brickBossBigPrefab);
            brickNode.parent = this.bossLayoutNode;
            brickNode.getComponent(cc.Component).init(this.gameCtl,bossSkillNum,bossSkillStrength);

            brickNode.x = this.padding + 3 * (brickNode.width/2 + this.spacing) + brickNode.width / 2;
            brickNode.y = -this.padding - 7 * (brickNode.height/2 + this.spacing) - brickNode.height / 2;

            this.brickStrBoss(brickNode,boss);

            //开始技能
            this.gameCtl.onBrickBossSkill(brickNode);

            //布置大boss陪衬
            switch(layout){
                //菱形阵
                case 1:
                    this.isNotBossNum =(this.cols/2*2+4);
                    for (let i = 0; i < (this.cols/2*2+4); i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一行
                        if(i<this.cols/2){
                            brickNode.x = this.padding + (i+2) * (brickNode.width + this.spacing) + brickNode.width / 2;
                            brickNode.y = -this.padding - 6 * (brickNode.height + this.spacing) - brickNode.height / 2;
                        }

                        //第四行
                        else if(i<this.cols && i>=this.cols/2){
                            brickNode.x = this.padding + ((i % (this.cols/2))+2) * (brickNode.width + this.spacing) + brickNode.width / 2;
                            brickNode.y = -this.padding - 9 * (brickNode.height + this.spacing) - brickNode.height / 2;
                        }

                        //第二、三行
                        else if(i>=this.cols){
                            brickNode.x = this.padding + (((i-this.cols) % 2) *(this.cols-3)+1)* (brickNode.width + this.spacing) + brickNode.width / 2;
                            brickNode.y = -this.padding - Math.floor((i-this.cols) /2 +7)*(brickNode.height + this.spacing) - brickNode.height / 2;
                        }
                        
                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                        }
                    break;
            }

            
        }

        //非boss
        else{
            //随机类型
            let ranNum = Math.floor(Math.random()+1);
            switch(ranNum){
                //双点阵
                case 1:
                    this.isNotBossNum = 4;
                    for (let i = 0; i < this.isNotBossNum; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);
        
                        brickNode.x = this.padding + ((i % 2) * (this.cols-3)+1)* (brickNode.width + this.spacing) + brickNode.width / 2;
                        brickNode.y = -this.padding - Math.floor( i /2 +7)*(brickNode.height + this.spacing) - brickNode.height / 2;

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
            }  
        }
    },

    //前排布局
    vanguardLayout(layout,brickNum){
        switch(layout){
            case 1:
                for (let i = 0; i < brickNum; i++) {
                    let brickNode = cc.instantiate(this.brickPrefab);
                    brickNode.parent = this.vanguardLayoutNode;
                    brickNode.getComponent(cc.Component).init(this.gameCtl,1);

                    brickNode.x = this.padding + (i % this.cols) * (brickNode.width + this.spacing) + brickNode.width / 2;
                    //间距 + 0*（宽度+间距） + 宽度/2    10+0*(90+2)+90/2 = 55 147 
                    //间距 + 1*（宽度+间距） + 宽度/2
                    brickNode.y = -this.padding - Math.floor((i+this.cols*10) / this.cols) * (brickNode.height + this.spacing) - brickNode.height / 2;
                    //-间距 - 下取整（0/10）* （高度 + 间距） - 高度/2 -10 - 0 * （28 + 10）-28/2
                    //-间距 - 下取整（1/10）* （高度 + 间距） - 高度/2 -10 - 0 * （28 + 10）-28/2
                    brickNode.getComponent(cc.Component).updataRigidPositon();
                    this.brickStrVan(brickNode);
                }            
                break;
            default:
                let brickNode = cc.instantiate(this.brickPrefab);
                brickNode.parent = this.vanguardLayoutNode;
                brickNode.getComponent(cc.Component).init(this.gameCtl,1);

                brickNode.position = cc.v2(375,-667);
                brickNode.getComponent(cc.Component).updataRigidPositon();
                break;
        }
        
    },

    //后排布局
    guardLayout(layout,brickNum){
        switch(layout){
            case 1:
                for (let i = 0; i < brickNum; i++) {
                    let brickNode = cc.instantiate(this.brickPrefab);
                    brickNode.parent = this.guardLayoutNode;
                    brickNode.getComponent(cc.Component).init(this.gameCtl,2);

                    brickNode.x = this.padding + (i % this.cols) * (brickNode.width + this.spacing) + brickNode.width / 2;
                    //间距 + 0*（宽度+间距） + 宽度/2   10+ 0 * (56+10) + 28/2
                    //间距 + 1*（宽度+间距） + 宽度/2   10+ 1 * (56+10) + 28/2
                    brickNode.y = -this.padding - Math.floor(i / this.cols) * (brickNode.height + this.spacing) - brickNode.height / 2;
                    //-间距 - 下取整（0/10）* （高度 + 间距） - 高度/2
                    //-间距 - 下取整（1/10）* （高度 + 间距） - 高度/2
                    brickNode.getComponent(cc.Component).updataRigidPositon();
                    this.brickStrGua(brickNode);

                }
                break;
            default:
                let brickNode = cc.instantiate(this.brickPrefab);
                brickNode.parent = this.guardLayoutNode;
                brickNode.getComponent(cc.Component).init(this.gameCtl,2);
                
                //brickNode.position = cc.v2(300,-300);
                brickNode.position = cc.v2((this.node.x + this.node.width/2),-(this.node.y - this.node.height/2)+200);
                brickNode.getComponent(cc.Component).updataRigidPositon();
                console.log(brickNode.position);
                break;
        }
    },

    //确定boss区域砖块强度
    brickStrBoss(brickNode,boss){
        //小boss
        if(boss === 1){
            brickNode.getComponent(cc.Component).setStr(Math.floor(Math.random()*(this.bossStrMax-this.bossStrMin+1)+this.bossStrMin));
        }
        //大boss
        else if(boss === 2){
            brickNode.getComponent(cc.Component).setStr(Math.floor(Math.random()*(this.bossStrMax-this.bossStrMin+1)+this.bossStrMin));
        }
        //非boss
        else{
            brickNode.getComponent(cc.Component).setStr(this.guaStrMax);
        }
    },

    //确定前排区域砖块强度
    brickStrVan(brickNode){
        //随机强度
        this.brickRandomStrVan = Math.floor(Math.random()*(this.vanStrMax-this.vanStrMin+1)+this.vanStrMin);
        //console.log('随机强度 van' + this.brickRandomStrVan);
        //赋值强度
        brickNode.getComponent(cc.Component).setStr(this.brickRandomStrVan);
    },

    //确定后排区域砖块强度
    brickStrGua(brickNode){
        //随机强度
        this.brickRandomStrGua = Math.floor(Math.random()*(this.guaStrMax-this.guaStrMin+1)+this.guaStrMin);
        //console.log('随机强度 gua' + this.brickRandomStrGua);
        //赋值强度
        brickNode.getComponent(cc.Component).setStr(this.brickRandomStrGua);
    },

    //生成随机砖块
    bossSkillInstRanBrick(skillStrength){
        let brickNode = cc.instantiate(this.brickPrefab);
        brickNode.parent = this.otherLayoutNode;
        brickNode.getComponent(cc.Component).init(this.gameCtl,99);

        brickNode.x = Math.floor(Math.random()*(750-(2*this.padding + brickNode.width))) + this.padding + brickNode.width / 2; 
        brickNode.y = -Math.floor(Math.random()*(brickNode.height+this.spacing)*14 + this.padding + brickNode.height / 2 );

        brickNode.getComponent(cc.Component).updataRigidPositon();
        
        //设置强度
        brickNode.getComponent(cc.Component).setStr(skillStrength);

        //播放动画
        brickNode.getComponent(cc.Component).animBossSkill();

    },

});