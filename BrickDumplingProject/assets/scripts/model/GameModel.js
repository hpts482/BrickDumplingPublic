cc.Class({
    extends: cc.Component,

    properties: {
        score:0,
        bricksNumber:0,
    },

    init(){
        var self = this;

        this.score = 0;
        this.bricksNumber = 50;
        this.readJsonTest(self);
    },

    addScore(score){
        this.score += score;
    },

    minusBrick(n){
        this.bricksNumber -= n;
    },
    
    readJsonTest(self){
        cc.loader.loadRes('test',function(err,obj){
            if(err){
                console.log(err);
                return;
            }
            console.log("111");
            self.jsonTest = obj;

            for (let x=0; x < obj.json.total; x++) {
                console.log(self.jsonTest.json.contents[x].key);
                console.log(self.jsonTest.json.contents[x].string);
                console.log(self.jsonTest.json.contents[x].int);
                console.log(self.jsonTest.json.contents[x].intlong);
                console.log(self.jsonTest.json.contents[x].float);
            }
        });
    }

});
