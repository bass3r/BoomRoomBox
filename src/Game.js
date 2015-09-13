var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Game = function () {};

BoomRoomBox.Game.prototype = {

    init: function () {
        this.GRAVITY = 800;
        this.PLAYER_VELOCITY_X = 240;
        this.PLAYER_VELOCITY_Y = 480;
    },

    preload: function () {

    },

    create: function () {
        this.game.stage.backgroundColor = "#43ABCD"
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.createLevel();
        this.addPlayer();

        // add enemies
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        var enemy = this.game.add.sprite(this.game.world.centerX, 0, 'enemy1', 0, this.enemies);
        enemy.anchor.setTo(0.5, 1);
        this.game.physics.arcade.enable(enemy);

        this.enemies.setAll('body.gravity.y', this.GRAVITY);

        this.cursor = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.game.physics.arcade.collide(this.player, this.walls);
        this.game.physics.arcade.collide(this.enemies, this.walls);

        this.enemies.getFirstAlive().body.velocity.x = 100;

        this.handleInput();
    },

    addPlayer: function () {
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = this.GRAVITY;

    },

    handleInput: function () {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -this.PLAYER_VELOCITY_X;
        } else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = this.PLAYER_VELOCITY_X;
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.PLAYER_VELOCITY_Y;
        }
    },

    createLevel: function () {
        this.walls = this.game.add.group();

        this.walls.enableBody = true;

        // Create the 10 walls
        this.game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
        this.game.add.sprite(576, 0, 'wallV', 0, this.walls); // Right

        this.game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        this.game.add.sprite(360, 0, 'wallH', 0, this.walls); // Top right
        this.game.add.sprite(0, 396, 'wallH', 0, this.walls); // Bottom left
        this.game.add.sprite(360, 396, 'wallH', 0, this.walls); // Bottom right

        this.game.add.sprite(-120, 192, 'wallH', 0, this.walls); // Middle left
        this.game.add.sprite(480, 192, 'wallH', 0, this.walls); // Middle right

        var middleTop = this.game.add.sprite(120, 96, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = this.game.add.sprite(120, 288, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    }
};
