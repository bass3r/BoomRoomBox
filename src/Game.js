var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Game = function () {
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.state;     //  the state manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BoomRoomBox.Game.prototype = {

    init: function () {
        this.GRAVITY = 1000;
        this.PLAYER_VELOCITY_X = 240;
        this.PLAYER_VELOCITY_Y = 480;
        this.enemies = [];
        this.nextEnemyAt = 0;
    },

    preload: function () {

    },

    create: function () {
        this.game.stage.backgroundColor = "#8BC4D6"
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 600, 420);
        //this.game.physics.arcade.gravity.y = this.GRAVITY;
        this.createLevel();
        this.addPlayer();

        // add enemies
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        for (var i = 0; i < 15; i++) {
            this.enemies.add(new BoomRoomBox.Enemy(i, this.game, 100, 'enemy1'));
        }
        this.enemies.setAll('body.gravity.y', this.GRAVITY);
        this.enemies.setAll('outOfBoundsKill', false);
        this.enemies.setAll('checkOutOfBounds', false);

        // add explosions
        this.explosions = this.game.add.group();
        for (var i = 0; i < 10; i++) {
            var explosionAnimation = this.explosions.create(0, 0, 'explosion', [0], false);
            explosionAnimation.anchor.setTo(0.5, 0.5);
            explosionAnimation.animations.add('explosion');
        }

        this.cursor = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {
        this.game.physics.arcade.collide(this.player, this.walls);
        this.game.physics.arcade.collide(this.enemies, this.walls, this.onEnemyHitWall, null, this);
        this.game.physics.arcade.overlap(this.player.bullets, this.walls, this.onBulletHitWall, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, null, this.onPlayerHitEnemy, this);
        this.game.physics.arcade.overlap(this.enemies, this.player.bullets, null, this.onBulletHitEnemy, this);

        this.spawnEnemy();
        this.checkPlayerOutOfBounds();
        this.handleInput();
        this.shakeScreen();
    },

    render: function () {
        //this.game.debug.body(this.player);
        //this.game.debug.body(this.player.gun);
        //BoomRoomBox.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, BoomRoomBox.pixel.width, BoomRoomBox.pixel.height);

        this.game.debug.spriteInfo(this.player, 32, 32);
    },

    spawnEnemy: function () {
        if (this.game.time.now > this.nextEnemyAt && this.enemies.countDead() > 0) {
            this.nextEnemyAt = this.game.time.now + 3000;
            var enemy = this.enemies.getFirstExists(false);
            enemy && enemy.restart(this.game.world.centerX, 0, 3);
        }
    },

    handleInput: function () {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -this.PLAYER_VELOCITY_X;
            this.player.turnLeft();
        } else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = this.PLAYER_VELOCITY_X;
            this.player.turnRight();
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.PLAYER_VELOCITY_Y;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT) || this.game.input.pointer1.isDown) {
            this.player.fire();
        }
    },

    addPlayer: function () {

        this.player = new BoomRoomBox.Player(this.game, this.game.world.centerX, this.game.world.centerY, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);

        //this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = this.GRAVITY;

        this.player.outOfBoundsKill = false;
        this.player.checkOutOfBounds = false;
        this.player.health = 10;
    },

    createLevel: function () {
        this.walls = this.game.add.group();

        this.walls.enableBody = true;

        // Create the 10 walls
        this.game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        this.game.add.sprite(360, 0, 'wallH', 0, this.walls); // Top right
        this.game.add.sprite(0, 396, 'wallH', 0, this.walls); // Bottom left
        this.game.add.sprite(360, 396, 'wallH', 0, this.walls); // Bottom right

        this.game.add.sprite(-120, 192, 'wallH', 0, this.walls); // Middle left
        this.game.add.sprite(480, 192, 'wallH', 0, this.walls); // Middle right

        this.game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
        this.game.add.sprite(576, 0, 'wallV', 0, this.walls); // Right

        var middleTop = this.game.add.sprite(120, 96, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = this.game.add.sprite(120, 288, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
        this.walls.setAll('body.allowGravity', false);
    },

    onPlayerHitEnemy: function (player, enemy) {
        player.takeDamage(enemy.health);
        return false;
    },

    onBulletHitEnemy: function (enemy, bullet) {

        bullet.kill();
        enemy.damage(bullet.health);
        if (!enemy.alive) {
            this.enemies.remove(enemy);
            this.shakeWorld = 5;
        }
        this.playExplosion(bullet.x, bullet.y);

        return false;
    },

    onBulletHitWall: function (bullet, wall) {
        if(!bullet.hit) {
            bullet.hit = true;
            return;
        }
        bullet.kill();
        bullet.hit = false;
        this.playExplosion(bullet.x, bullet.y);

    },

    onEnemyHitWall: function (enemy, wall) {
        if (wall.key == "wallV") {
            enemy.turnBack();
        }
    },

    shakeScreen: function () {
        if (this.shakeWorld > 0) {
            var rand1 = this.game.rnd.integerInRange(-3, 3);
            var rand2 = this.game.rnd.integerInRange(-3, 3);
            this.game.world.setBounds(rand1, rand2, this.game.width + rand1, this.game.height + rand2);
            this.shakeWorld--;
            if (this.shakeWorld == 0) {
                this.game.world.setBounds(0, 0, this.game.width, this.game.height); // normalize after shake?
            }
        }
    },

    playExplosion: function (posX, posY) {
        var explosionAnimation = this.explosions.getFirstExists(false);
        explosionAnimation.reset(posX, posY);
        explosionAnimation.play('explosion', 30, false, true);
    },

    checkPlayerOutOfBounds: function() {
        if(this.player.y > this.game.width && this.player.alive) {
            this.player.kill();
        }
    }
};
