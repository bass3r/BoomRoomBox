var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Game = function () {};

BoomRoomBox.Game.prototype = {

    init: function () {
        this.GRAVITY = 800;
        this.PLAYER_VELOCITY_X = 240;
        this.PLAYER_VELOCITY_Y = 480;
        this.enemies = [];
    },

    preload: function () {

    },

    create: function () {
        this.game.stage.backgroundColor = "#43ABCD"
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.createLevel();
        this.addPlayer();

        // add enemies
        this.enemies.enableBody = true;
        this.enemies.push(new Enemy(0, this.game, 100, 2, this.GRAVITY, 'enemy1'));

        this.cursor = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.game.physics.arcade.collide(this.player, this.walls);

        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].alive) {
                this.game.physics.arcade.collide(this.enemies[i].enemy, this.walls);
                this.enemies[i].update();
            }
        }

        this.handleInput();
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

    addPlayer: function () {
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = this.GRAVITY;
        this.player.body.collideWorldBounds = true;
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
