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
        progressSkillBombLayout:cc.Node,
    },

    init(gameModel,jsonAll,currentStage,gameCtl) {
        //删除子节点的所有砖块
        this.vanguardLayoutNode.removeAllChildren();
        this.guardLayoutNode.removeAllChildren();
        this.bossLayoutNode.removeAllChildren();
        this.otherLayoutNode.removeAllChildren();
        this.itemLayoutNode.removeAllChildren();
        this.progressSkillThunderLayout.removeAllChildren();
        this.progressSkillBombLayout.removeAllChildren();


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
        //是否是随机布局，boss和非boss通用数量，暂定10
        if(layout == 99){
            layout = Math.floor(Math.random()*10+1);
        }
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
            switch(layout){
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
                //漏墙
                case 2:
                    this.isNotBossNum = this.cols*2+8;
                    for (let i = 0; i < (this.cols*2+8); i++) {
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

                        //第二、三行-左右两侧
                        else if(i<this.cols*2+4 && i>=this.cols*2){
                            brickNode.x = this.padding + ((i-this.cols*2) % 2) *(this.cols-3)* (brickNode.width + this.spacing) + brickNode.width / 2 + (brickNode.width + this.spacing);
                            brickNode.y = -this.padding - Math.floor((i-this.cols*2) /2 +7)*(brickNode.height + this.spacing) - brickNode.height / 2;
                        }

                        //第二、三行-中间
                        else if(i<this.cols*2+8 && i>=this.cols*2+4){
                            brickNode.x = this.padding + ((i-this.cols*2-4) % 2) *(this.cols-7)* (brickNode.width + this.spacing) + brickNode.width / 2 + (brickNode.width + this.spacing)*3;
                            brickNode.y = -this.padding - Math.floor((i-this.cols*2-4) /2 +7)*(brickNode.height + this.spacing) - brickNode.height / 2;
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //蝴蝶
                case 3:
                    this.isNotBossNum = this.cols*2;
                    for (let i = 0; i <this.cols*2; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一组-左侧四角
                        if(i<this.cols/2){
                            this.BrickLayoutPos(Math.floor(i/2)*3+7,(i%2)*3+1,brickNode);
                        }
                        //第二组-右侧四角
                        else if(i<this.cols && i>=this.cols/2){
                            /*this.BrickLayoutPos(7,5,brickNode);
                            this.BrickLayoutPos(7,8,brickNode);
                            this.BrickLayoutPos(10,5,brickNode);
                            this.BrickLayoutPos(10,8,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-this.cols/2)/2)*3+7,((i-this.cols/2)%2)*3+5,brickNode);
                        }

                        //第三组-左侧内角四
                        else if(i<this.cols*1.5 && i>=this.cols){
                            /*this.BrickLayoutPos(8,2,brickNode);
                            this.BrickLayoutPos(8,3,brickNode);
                            this.BrickLayoutPos(9,2,brickNode);
                            this.BrickLayoutPos(9,3,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-this.cols)/2)+8,((i-this.cols)%2)+2,brickNode);
                        }

                        //第四组-右侧内角四
                        else if(i<this.cols*2 && i>=this.cols*1.5){
                            /*this.BrickLayoutPos(8,6,brickNode);
                            this.BrickLayoutPos(8,7,brickNode);
                            this.BrickLayoutPos(9,6,brickNode);
                            this.BrickLayoutPos(9,7,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-this.cols*1.5)/2)+8,((i-this.cols*1.5)%2)+6,brickNode);
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //门双
                case 4:
                    this.isNotBossNum = 16;
                    for (let i = 0; i <16; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一组-左侧门
                        if(i<8){
                            /*this.BrickLayoutPos(7,2,brickNode);
                            this.BrickLayoutPos(7,3,brickNode);
                            this.BrickLayoutPos(8,2,brickNode);
                            this.BrickLayoutPos(8,3,brickNode);*/
                            this.BrickLayoutPos(Math.floor(i/2)+7,(i%2)+2,brickNode);
                        }
                        //第二组-右侧门
                        else if(i>=8){
                            /*this.BrickLayoutPos(7,6,brickNode);
                            this.BrickLayoutPos(7,7,brickNode);
                            this.BrickLayoutPos(8,6,brickNode);
                            this.BrickLayoutPos(8,7,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-8)/2)+7,((i-8)%2)+6,brickNode);
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //飞机
                case 5:
                    this.isNotBossNum = 16;
                    for (let i = 0; i <16; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一组-左侧
                        if(i<6){
                            /*this.BrickLayoutPos(7,1,brickNode);
                            this.BrickLayoutPos(7,2,brickNode);
                            this.BrickLayoutPos(7,3,brickNode);
                            this.BrickLayoutPos(10,1,brickNode);
                            this.BrickLayoutPos(10,2,brickNode);
                            this.BrickLayoutPos(10,3,brickNode);*/
                            this.BrickLayoutPos(Math.floor(i/3)*3+7,i%3+1,brickNode);
                        }
                        //第二组-右侧门
                        else if(i<12 && i>=6){
                            /*this.BrickLayoutPos(7,6,brickNode);
                            this.BrickLayoutPos(7,7,brickNode);
                            this.BrickLayoutPos(7,8,brickNode);
                            this.BrickLayoutPos(10,6,brickNode);
                            this.BrickLayoutPos(10,7,brickNode);
                            this.BrickLayoutPos(10,8,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-6)/3)*3+7,(i-6)%3+6,brickNode);
                        }
                        //第三组-中四
                        else if(i>=12){
                            /*this.BrickLayoutPos(8,4,brickNode);
                            this.BrickLayoutPos(8,5,brickNode);
                            this.BrickLayoutPos(9,4,brickNode);
                            this.BrickLayoutPos(9,5,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-12)/2)+8,(i-12)%2+4,brickNode);
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //魔角
                case 6:
                    this.isNotBossNum = 22;
                    for (let i = 0; i <this.isNotBossNum; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一组-一行
                        if(i<8){
                            this.BrickLayoutPos(7,i+1,brickNode);
                        }
                        //第二组-中六
                        else if(i<14 && i>=8){
                            /*this.BrickLayoutPos(8,4,brickNode);
                            this.BrickLayoutPos(8,5,brickNode);
                            this.BrickLayoutPos(9,4,brickNode);
                            this.BrickLayoutPos(9,5,brickNode);
                            this.BrickLayoutPos(10,4,brickNode);
                            this.BrickLayoutPos(10,5,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-8)/2)+8,(i-8)%2+4,brickNode);
                        }
                        //第三组-边六
                        else if(i<20 && i>=14){
                            /*this.BrickLayoutPos(8,1,brickNode);
                            this.BrickLayoutPos(8,8,brickNode);
                            this.BrickLayoutPos(9,1,brickNode);
                            this.BrickLayoutPos(9,8,brickNode);
                            this.BrickLayoutPos(10,1,brickNode);
                            this.BrickLayoutPos(10,8,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-14)/2)+8,((i-14)%2)*7+1,brickNode);
                        }
                        //第四组-二点
                        else if(i>=20){
                            /*this.BrickLayoutPos(8,2,brickNode);
                            this.BrickLayoutPos(8,7,brickNode);*/
                            this.BrickLayoutPos(8,((i-20)%2)*5+2,brickNode);
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //二杠
                case 7:
                    this.isNotBossNum = 16;
                    for (let i = 0; i <this.isNotBossNum; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);
                        
                        //全组
                        this.BrickLayoutPos(Math.floor(i/8)+8,i%8+1,brickNode);

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //双道
                case 8:
                    this.isNotBossNum = 16;
                    for (let i = 0; i <this.isNotBossNum; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一组-中八
                        if(i<8){
                            /*this.BrickLayoutPos(7,4,brickNode);
                            this.BrickLayoutPos(7,5,brickNode);
                            this.BrickLayoutPos(8,4,brickNode);
                            this.BrickLayoutPos(8,5,brickNode);
                            this.BrickLayoutPos(9,4,brickNode);
                            this.BrickLayoutPos(9,5,brickNode);*/
                            this.BrickLayoutPos(Math.floor(i/2)+7,i%2+4,brickNode);
                        }
                        //第二组-边八
                        else if(i>=8){
                            /*this.BrickLayoutPos(7,1,brickNode);
                            this.BrickLayoutPos(7,8,brickNode);
                            this.BrickLayoutPos(8,1,brickNode);
                            this.BrickLayoutPos(8,8,brickNode);
                            this.BrickLayoutPos(9,1,brickNode);
                            this.BrickLayoutPos(9,8,brickNode);*/
                            this.BrickLayoutPos(Math.floor((i-8)/2)+7,((i-8)%2)*7+1,brickNode);
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //空墙
                case 9:
                    this.isNotBossNum = 24;
                    for (let i = 0; i <this.isNotBossNum; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一组-边横六
                        if(i<6){
                            /*this.BrickLayoutPos(7,1,brickNode);
                            this.BrickLayoutPos(7,2,brickNode);
                            this.BrickLayoutPos(7,3,brickNode);
                            this.BrickLayoutPos(7,6,brickNode);
                            this.BrickLayoutPos(7,7,brickNode);
                            this.BrickLayoutPos(7,8,brickNode);*/
                            this.BrickLayoutPos(7,i+Math.floor(i/3)*2+1,brickNode);
                        }
                        //第二组-边横二
                        else if(i<10 && i>=6){
                            /*this.BrickLayoutPos(8,1,brickNode);
                            this.BrickLayoutPos(8,2,brickNode);
                            this.BrickLayoutPos(8,7,brickNode);
                            this.BrickLayoutPos(8,8,brickNode);*/
                            this.BrickLayoutPos(8,(i-6)+Math.floor((i-6)/2)*4+1,brickNode);
                        }
                        //第三组-边横一
                        else if(i<12 && i>=10){
                            /*this.BrickLayoutPos(9,1,brickNode);
                            this.BrickLayoutPos(9,8,brickNode);*/
                            this.BrickLayoutPos(9,(i-10)*7+1,brickNode);
                        }
                        //第四组-中横一
                        else if(i<14 && i>=12){
                            /*this.BrickLayoutPos(8,4,brickNode);
                            this.BrickLayoutPos(8,5,brickNode);*/
                            this.BrickLayoutPos(8,(i-12)+4,brickNode);
                        }
                        //第五组-中横二
                        else if(i<18 && i>=14){
                            /*this.BrickLayoutPos(9,3,brickNode);
                            this.BrickLayoutPos(9,4,brickNode);
                            this.BrickLayoutPos(9,5,brickNode);
                            this.BrickLayoutPos(9,6,brickNode);*/
                            this.BrickLayoutPos(9,(i-14)+3,brickNode);
                        }
                        //第六组-中横三
                        else if(i<24 && i>=18){
                            /*this.BrickLayoutPos(10,2,brickNode);
                            this.BrickLayoutPos(10,3,brickNode);
                            this.BrickLayoutPos(10,4,brickNode);
                            this.BrickLayoutPos(10,5,brickNode);*/
                            this.BrickLayoutPos(10,(i-18)+2,brickNode);
                        }

                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
                //凹槽
                case 10:
                    this.isNotBossNum = 20;
                    for (let i = 0; i <this.isNotBossNum; i++) {
                        let brickNode = cc.instantiate(this.brickPrefab);
                        brickNode.parent = this.bossLayoutNode;
                        brickNode.getComponent(cc.Component).init(this.gameCtl,3);

                        //第一组-一行
                        if(i<8){
                            this.BrickLayoutPos(7,i+1,brickNode);
                        }
                        //第二组-横六
                        else if(i<14 && i>=8){
                            /*this.BrickLayoutPos(8,1,brickNode);
                            this.BrickLayoutPos(8,2,brickNode);
                            this.BrickLayoutPos(8,3,brickNode);
                            this.BrickLayoutPos(8,6,brickNode);*/
                            this.BrickLayoutPos(8,(i-8)+Math.floor((i-8)/3)*2+1,brickNode);
                        }
                        //第三组-横四
                        else if(i<18 && i>=14){
                            /*this.BrickLayoutPos(9,1,brickNode);
                            this.BrickLayoutPos(9,2,brickNode);
                            this.BrickLayoutPos(9,7,brickNode);*/
                            this.BrickLayoutPos(9,(i-14)+Math.floor((i-14)/2)*4+1,brickNode);
                        }
                        //第四组-横二
                        else if(i>=18){
                            /*this.BrickLayoutPos(10,1,brickNode);
                            this.BrickLayoutPos(10,8,brickNode);*/
                            this.BrickLayoutPos(10,(i-18)*7+1,brickNode);
                        }
                        
                        brickNode.getComponent(cc.Component).updataRigidPositon();
                        this.brickStrBoss(brickNode,0);
                    }
                    break;
            }  
        }
    },

    //布局神器
    BrickLayoutPos(row,col,brickNode){
        brickNode.position = cc.v2(this.padding+(col-1)*(brickNode.width + this.spacing)+brickNode.width/2,-this.padding-(row-1)*(brickNode.height + this.spacing) - brickNode.height / 2);
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
            brickNode.getComponent(cc.Component).setStr(Math.floor(Math.random()*2+this.guaStrMin));
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

    //生成可移动前排砖块
    bossSkillInstMoveBrick(skillStrength,moveSpeed){
        let brickNode = cc.instantiate(this.brickPrefab);
        brickNode.parent = this.otherLayoutNode;
        brickNode.getComponent(cc.Component).init(this.gameCtl,99);

        let yRan = Math.floor(Math.random()*3);       //随机行数，暂定为3
        brickNode.x = this.padding + brickNode.width / 2;
        brickNode.y = -this.padding - Math.floor((this.cols*(13+yRan)) / this.cols) * (brickNode.height + this.spacing) - brickNode.height / 2;

        //设置强度
        brickNode.getComponent(cc.Component).setStr(skillStrength);

        //同步刚体的位置
        brickNode.getComponent(cc.Component).updataRigidPositon();

        //让节点左右来回移动并一直重复
        let seq = cc.repeatForever(
            cc.sequence(
                cc.moveTo(moveSpeed,cc.v2((750-(this.padding + brickNode.width / 2)),brickNode.y)).easing(cc.easeSineInOut(3)),
                cc.moveTo(moveSpeed,cc.v2(this.padding + brickNode.width / 2,brickNode.y)).easing(cc.easeSineInOut(3)),
            ));
        let seqRigid = cc.repeatForever(
                cc.sequence(
                    cc.moveTo(moveSpeed,cc.v2(1,0)).easing(cc.easeSineInOut(3)),
                    cc.moveTo(moveSpeed,cc.v2(0,0)).easing(cc.easeSineInOut(3)),
                ));
        brickNode.runAction(seq);
        switch(brickNode.getComponent(cc.Component).spriteType){
            case 1:
                brickNode.getChildByName('brick1').runAction(seqRigid);
                break;
            case 2:
                brickNode.getChildByName('brick2').runAction(seqRigid);
                break;
            case 3:
                brickNode.getChildByName('brick3').runAction(seqRigid);
                break;
            case 4:
                brickNode.getChildByName('brick4').runAction(seqRigid);
                break;
            case 5:
                brickNode.getChildByName('brick5').runAction(seqRigid);
                break;
            case 6:
                brickNode.getChildByName('brick6').runAction(seqRigid);
                break;
            default:
                brickNode.getChildByName('brick1').runAction(seqRigid);
                break;
        }

        //播放动画
        brickNode.getComponent(cc.Component).animBossSkill();
    },

    //生成砖块雨
    bossSkillInstBrickRain(skillStrength,num){
        //生成循环
        for(let i=0;i<num;i++){
            //生成
            let brickNode = cc.instantiate(this.brickPrefab);
            brickNode.parent = this.otherLayoutNode;
            brickNode.getComponent(cc.Component).init(this.gameCtl,99);

            //找位置
            let xPos =  Math.floor(Math.random()*(750-(this.padding + brickNode.width / 2)) + (this.padding + brickNode.width / 2));
            let yPos = Math.floor(200+Math.random()*200);
            brickNode.x = xPos;
            brickNode.y = yPos;

            //设置强度
            brickNode.getComponent(cc.Component).setStr(skillStrength);

            //同步刚体的位置
            brickNode.getComponent(cc.Component).updataRigidPositon();

            //让节点开始向下移动
            let timeRan =  Math.random()*2;
            let seqFinished = cc.callFunc(function() {
                brickNode.parent = null;
                brickNode.destroy();
            }, this);
            let seq = cc.sequence(
                cc.delayTime(timeRan),
                cc.moveBy(10,cc.v2(0,-1800)).easing(cc.easeOut(2)),
                seqFinished,
            );
            let seqRigid = cc.sequence(
                cc.delayTime(timeRan),
                cc.moveBy(10,cc.v2(0,1)).easing(cc.easeOut(2)),
            );
            //执行动作
            brickNode.runAction(seq);
            switch(brickNode.getComponent(cc.Component).spriteType){
                case 1:
                    brickNode.getChildByName('brick1').runAction(seqRigid);
                    break;
                case 2:
                    brickNode.getChildByName('brick2').runAction(seqRigid);
                    break;
                case 3:
                    brickNode.getChildByName('brick3').runAction(seqRigid);
                    break;
                case 4:
                    brickNode.getChildByName('brick4').runAction(seqRigid);
                    break;
                case 5:
                    brickNode.getChildByName('brick5').runAction(seqRigid);
                    break;
                case 6:
                    brickNode.getChildByName('brick6').runAction(seqRigid);
                    break;
                default:
                    brickNode.getChildByName('brick1').runAction(seqRigid);
                    break;
            }
        }
    },



});