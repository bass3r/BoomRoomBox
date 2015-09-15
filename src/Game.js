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
        this.game.physics.arcade.gravity.y = this.GRAVITY;
        this.createLevel();
        this.addPlayer();

        // add enemies
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.add(new BoomRoomBox.Enemy(0, this.game, 100, 3, 'enemy1'));

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
        this.game.physics.arcade.collide(this.bullets, this.walls, this.onBulletHitWall, null, this);
        this.game.physics.arcade.collide(this.enemies, this.walls);
        this.game.physics.arcade.collide(this.enemies, this.bullets, this.onBulletHitEnemy, null, this);


        this.handleInput();
        this.shakeScreen();
    },

    render: function () {
        this.game.debug.body(this.player);
    },

    handleInput: function () {
        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -this.PLAYER_VELOCITY_X;
            this.turnPlayerLeft();
        } else if (this.cursor.right.isDown) {
            this.player.body.velocity.x = this.PLAYER_VELOCITY_X;
            this.turnPlayerRight();
        } else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -this.PLAYER_VELOCITY_Y;
        }

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            this.fire();
        }
    },

    addPlayer: function () {

        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;

        this.player.gun = this.game.add.sprite(8, 4, 'gun');
        this.player.gun.anchor.setTo(0.5);
        this.player.addChild(this.player.gun);

        // add bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet', 0, false);
        this.bullets.callAll('anchor.setTo', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('body.allowGravity', false);

        this.player.gun.fireRate = 150;
        this.player.gun.nextFire = 0;
    },

    turnPlayerLeft: function () {
        this.player.scale.x = -(Math.abs(this.player.scale.x));

    },

    turnPlayerRight: function () {
        this.player.scale.x = Math.abs(this.player.scale.x);
    },

    fire: function () {
        if (this.game.time.now > this.player.gun.nextFire && this.bullets.countDead() > 0) {
            this.player.gun.nextFire = this.game.time.now + this.player.gun.fireRate;
            var bullet = this.bullets.getFirstExists(false);
            bullet.reset(this.player.x, this.player.y, 2);
            bullet.body.velocity.x = 500;
            var spreadY = this.game.rnd.integerInRange(-10, 10);
            bullet.body.velocity.y = spreadY;
            bullet.lifespan = 1500;

            this.gunRecoil();
        }

    },

    gunRecoil: function () {
        if (!this.player.gun.isMoving) {
            var tween = this.game.add.tween(this.player.gun).to({ x: this.player.gun.x - 2}, 20, Phaser.Easing.InOut, true, 0, 1, true);
            this.player.gun.isMoving = true;
            tween.onComplete.add(function () {
                this.player.gun.isMoving = false;
            }, this);
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
        this.walls.setAll('body.allowGravity', false);
    },

    onBulletHitEnemy: function (enemy, bullet) {
        enemy.damage(bullet.health);
        bullet.kill();
        this.shakeWorld = 5;
        this.playExplosion(bullet.x, bullet.y);
    },

    onBulletHitWall: function (bullet, wall) {
        bullet.kill();

        this.playExplosion(bullet.x, bullet.y);
    },

    shakeScreen: function () {
        if (this.shakeWorld > 0) {
            var rand1 = this.game.rnd.integerInRange(-1, 1);
            var rand2 = this.game.rnd.integerInRange(-1, 1);
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
        explosionAnimation.play('explosion', 300, false, true);
    }
};
