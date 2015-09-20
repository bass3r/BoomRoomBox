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
        this.load.spritesheet('enemy1', 'assets/images/enemy1.png', 24, 24);
        this.load.image('wallV', 'assets/images/wallVertical.png');
        this.load.image('wallH', 'assets/images/wallHorizontal.png');
        this.load.image('pistol', 'assets/images/pistol.png');
        this.load.image('machinegun', 'assets/images/machinegun.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.spritesheet('explosion', 'assets/images/explosion.png', 16, 16);
    },

    create: function () {

        this.game.state.start('MainMenu');
    }
};
