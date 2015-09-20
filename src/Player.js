var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Player = function (game, x, y, sprite) {
    Phaser.Sprite.call(this, game, x, y, sprite);

    game.add.existing(this);

    this.weapons = [
        {
            index: 0,
            name: 'Pistol',
            sprite: 'pistol',
            power: 4,
            automatic: false,
            cooldownTime: 20,
            spread: 10,
            bullet: {
                sprite: 'bullet',
                speed: 700,
                splashRadius: 0,
                lifespan: 3000
            }
        },
        {
            index: 1,
            name: 'Machine gun',
            sprite: 'machinegun',
            power: 1,
            automatic: true,
            cooldownTime: 80,
            spread: 20,
            bullet: {
                sprite: 'bullet',
                speed: 700,
                splashRadius: 0,
                lifespan: 3000
            }
        },
    ];

    this.gun = this.game.add.sprite(8, 4, 'pistol');
    this.gun.properties = this.weapons[0];
    this.addChild(this.gun);
    this.gun.anchor.setTo(0.5);
    this.gun.nextFire = 0;

    this.equipWeapon(1);

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

BoomRoomBox.Player.prototype.onFireKeyDown = function (key, subsequent) {
    if(!this.gun.properties.automatic && !subsequent || this.gun.properties.automatic) {
        this.fire();
    }
};

BoomRoomBox.Player.prototype.fire = function (subsequent) {
    if (this.game.time.now > this.gun.nextFire && this.bullets.countDead() > 0) {
        this.gun.nextFire = this.game.time.now + this.gun.properties.cooldownTime;
        var bullet = this.bullets.getFirstExists(false);
        bullet.reset(this.x, this.y, this.gun.properties.power);
        bullet.body.velocity.x = this.gun.properties.bullet.speed * this.getDirectionSign();
        var spreadY = this.game.rnd.integerInRange(-this.gun.properties.spread, this.gun.properties.spread);
        bullet.body.velocity.y = spreadY;
        bullet.lifespan = this.gun.properties.bulletLifespan;

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
        this.body.x -= 2 * this.getDirectionSign();
    }
};

BoomRoomBox.Player.prototype.getDirectionSign = function () {
    var scaleX = this.scale.x;
    return scaleX && scaleX / Math.abs(scaleX);
};

BoomRoomBox.Player.prototype.takeDamage = function (damageAmount) {
    if (this.game.time.now > this.invulnerableUntil) {
        this.damage(damageAmount);
        this.makeInvulnerable(2000);
    }
};

BoomRoomBox.Player.prototype.makeInvulnerable = function (duration) {
    this.invulnerableUntil = this.game.time.now + duration;
    this.game.add.tween(this).to({alpha: 0}, 200, Phaser.Easing.Cubic.InOut, true, 0, 5, true);
};

BoomRoomBox.Player.prototype.equipWeapon = function (weaponIndex) {
    if (this.gun.properties.index != weaponIndex) {
        this.gun.properties = this.weapons[weaponIndex];
        this.gun.loadTexture(this.gun.properties.sprite, 0, true);
    }
};


