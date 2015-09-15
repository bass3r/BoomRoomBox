var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Enemy = function (index, game, velocity, health, sprite) {

    Phaser.Sprite.call(this, game, game.world.centerX, 0, sprite);

    this.anchor.setTo(0.5, 1);

    this.name = index.toString();
    this.maxVelocity = velocity;
    this.currentVelocity = velocity;
    this.health = health;

    game.add.existing(this);
};

BoomRoomBox.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
BoomRoomBox.Enemy.prototype.constructor = BoomRoomBox.Enemy;

BoomRoomBox.Enemy.prototype.update = function () {

    if (this.body.touching.right) {
        this.currentVelocity = -this.maxVelocity;
    } else if (this.body.touching.left) {
        this.currentVelocity = this.maxVelocity;
    }

    this.body.velocity.x = this.currentVelocity;
};

