var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Preload = function () {
    this.background = null;
    this.preloadBar = null;
};

BoomRoomBox.Preload.prototype = {

    preload: function () {
        this.background = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadBackground');
        this.background.anchor.setTo(0.5);
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 100, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('player', 'assets/images/player.png');
        this.load.image('enemy1', 'assets/images/enemy1.png');
        this.load.image('wallV', 'assets/images/wallVertical.png');
        this.load.image('wallH', 'assets/images/wallHorizontal.png');
    },

    create: function () {

        this.game.state.start('MainMenu');
    }
};
