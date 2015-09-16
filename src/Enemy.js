var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Enemy = function (index, game, velocity, sprite) {

    Phaser.Sprite.call(this, game, game.world.centerX, 0, sprite, 0, false);

    this.anchor.setTo(0.5, 1);

    this.name = index.toString();
    this.currentVelocity = velocity;

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.outOfBoundsKill = true;
    this.checkOutOfBounds = true;
};

BoomRoomBox.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
BoomRoomBox.Enemy.prototype.constructor = BoomRoomBox.Enemy;

BoomRoomBox.Enemy.prototype.update = function () {

    this.body.velocity.x = this.currentVelocity;
};

