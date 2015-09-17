var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Boot = function () {};

BoomRoomBox.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 1;

        this.scale.pageAlignHorizontally = true;

        if (this.game.device.desktop) {

        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.setMinMax(480, 260, 1024, 768);
            this.game.scale.forceLandscape = true;
            this.game.scale.pageAlignHorizontally = true;
        }
    },

    preload: function () {
        this.load.image('preloadBackground', 'assets/images/preload_background.png');
        this.load.image('preloadBar', 'assets/images/preload_bar.png');
    },

    create: function () {
        this.state.start('Preload');
    }
};
