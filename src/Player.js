var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Player = function (game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);

    game.add.existing(this);

    this.gun = this.game.add.sprite(8, 4, 'gun');
    this.gun.anchor.setTo(0.5);
    this.gun.fireRate = 150;
    this.gun.nextFire = 0;
    this.addChild(this.gun);

    // add bullets
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet', 0, false);
    this.bullets.callAll('anchor.setTo', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('body.allowGravity', false);

    this.invulnerableUntil = 0;
};

BoomRoomBox.Player.prototype = Object.create(Phaser.Sprite.prototype);
BoomRoomBox.Player.prototype.constructor = BoomRoomBox.Player;

BoomRoomBox.Player.prototype.turnLeft = function () {
        this.scale.x = -(Math.abs(this.scale.x));

    };

BoomRoomBox.Player.prototype.turnRight = function () {
        this.scale.x = Math.abs(this.scale.x);
    };

BoomRoomBox.Player.prototype.fire = function () {
    if (this.game.time.now > this.gun.nextFire && this.bullets.countDead() > 0) {
        this.gun.nextFire = this.game.time.now + this.gun.fireRate;
        var bullet = this.bullets.getFirstExists(false);
        bullet.reset(this.x, this.y, 2);
        bullet.body.velocity.x = 500 * this.getDirectionSign();
        var spreadY = this.game.rnd.integerInRange(-15, 15);
        bullet.body.velocity.y = spreadY;
        bullet.lifespan = 1500;

        this.gunRecoil();
    }
};

BoomRoomBox.Player.prototype.gunRecoil = function () {
    if (!this.gun.isMoving) {
        var tween = this.game.add.tween(this.gun).to({ x: this.gun.x - 2}, 20, Phaser.Easing.InOut, true, 0, 1, true);
        this.gun.isMoving = true;
        tween.onComplete.add(function () {
            this.gun.isMoving = false;
        }, this);
    }
};

BoomRoomBox.Player.prototype.getDirectionSign = function () {
    var scaleX = this.scale.x;
    return scaleX && scaleX / Math.abs(scaleX);
};

BoomRoomBox.Player.prototype.takeDamage = function (damageAmount) {
    if(this.game.time.now > this.invulnerableUntil) {
        this.damage(damageAmount);
        this.makeInvulnerable(2000);
    }
};

BoomRoomBox.Player.prototype.makeInvulnerable = function (duration) {
    this.invulnerableUntil = this.game.time.now + duration;
    this.game.add.tween(this).to( {alpha: 0}, 200, Phaser.Easing.Cubic.InOut, true, 0, 5, true);
};
