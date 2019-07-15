cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab:cc.Prefab,
        Strength:0,
    },

    onDestroy(){
        let itemPrefab = cc.instantiate(this.itemPrefab);
        itemPrefab.parent = cc.find("PhysicsLayer");
        itemPrefab.position = cc.v2(375,667);
    }

});