cc.Class({
    extends: cc.Component,
    properties: {
        //game effect
        BallServe:{
            default: null,
            type : cc.AudioClip,
        },
        BallHitWall:{
            default: null,
            type : cc.AudioClip,
        },
        BallHitBrick:{
            default: null,
            type : cc.AudioClip,
        },
        BallHitPaddle:{
            default: null,
            type : cc.AudioClip,
        },
        BallHitSecurity:{
            default: null,
            type : cc.AudioClip,
        },
        BossStorage:{
            default: null,
            type : cc.AudioClip,
        },
        BossSkill:{
            default: null,
            type : cc.AudioClip,
        },
        SkillGet:{
            default: null,
            type : cc.AudioClip,
        },
        SkillFade:{
            default: null,
            type : cc.AudioClip,
        },
        SkillDisappear:{
            default: null,
            type : cc.AudioClip,
        },


        //ShowPanel
        PanelWin:{
            default: null,
            type : cc.AudioClip,
        },
        PanelFail:{
            default: null,
            type : cc.AudioClip,
        },
        PanelPause:{
            default: null,
            type : cc.AudioClip,
        },
        PanelShop:{
            default: null,
            type : cc.AudioClip,
        },
        PanelRetry:{
            default: null,
            type : cc.AudioClip,
        },
        PanelSkillDetail:{
            default: null,
            type : cc.AudioClip,
        },

        //Click
        ClickButton:{
            default: null,
            type : cc.AudioClip,
        },
        ClickBuySkill:{
            default: null,
            type : cc.AudioClip,
        },
    },
});


