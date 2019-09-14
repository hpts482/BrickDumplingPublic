cc.Class({
    extends: cc.Component,

    properties: {
        aniComb:cc.Animation,
        labComb:cc.Label,
    },

    init(gameCtl){
        this.node.active = false;
        this.gameCtl = gameCtl;
    },

    on(){
        this.node.active = true;
        this.labComb.string =  String('连打x' + this.gameCtl.gameModel.combNum);
        this.aniCombState = this.aniComb.play('combStart');
    },

    again(){
        this.labComb.string =  String('连打x' + this.gameCtl.gameModel.combNum);

        if(!this.aniCombState.isPlaying){
            this.aniComb.play('combAgain');
        }
    },

    fin(){
        this.aniComb.play('combFin');
    },

});
