cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },

    init(gameCtl){
        this.gameCtl = gameCtl;
        this.node.active = false;
    },

    initNextStage(){
        this.node.active = false;
    },

    show(){
        this.node.active = true;
    },

    onBtnResume(){
        this.node.active = false;
        this.gameCtl.pauseGame();
    },

});
