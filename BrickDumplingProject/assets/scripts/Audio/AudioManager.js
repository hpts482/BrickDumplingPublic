var AudioManager = cc.Class({
    extends: cc.Component,
    properties: {
    },

    Init(GC){
        this.gameCtrl = GC;
    },

    PlaySoundClip(audioClip){
        this.PlaySoundInternal(audioClip, false, 1);
    },

    PlaySoundInternal(audioClip, isLoop, volume){
        if(audioClip != null){
            cc.audioEngine.play(audioClip, isLoop, volume);
        }
    },

});
