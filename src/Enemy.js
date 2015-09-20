var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Enemy = function (index, game, velocity, sprite) {

    Phaser.Sprite.call(this, game, game.world.centerX, 0, sprite, 0, false);

    this.anchor.setTo(0.5, 1);

    this.name = index.toString();
    this.maxVelocity = velocity;
    this.currentVelocity = 0;

    this.alive = false;
    this.exists = false;
    this.visible = false;

    this.outOfBoundsKill = true;
    this.checkOutOfBounds = true;

    this.animations.add('die');
};

BoomRoomBox.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
BoomRoomBox.Enemy.prototype.constructor = BoomRoomBox.Enemy;

BoomRoomBox.Enemy.prototype.update = function () {

};

BoomRoomBox.Enemy.prototype.kill = function () {
    this.alive = false;
    this.maxVelocity = 0;
    this.currentVelocity = 0;
    this.animations.stop();
    this.animations.play('die', 30);
    this.events.onAnimationComplete.addOnce(function () {
        this.exists = false;
        this.visible = false;
    }, this);

    if (this.events) {
        this.events.onKilled$dispatch(this);
    }

    return this;
};

BoomRoomBox.Enemy.prototype.turnBack = function() {
    this.currentVelocity *= -1;
    this.body.velocity.x = this.currentVelocity;
};

BoomRoomBox.Enemy.prototype.beginMovement = function() {
    this.currentVelocity = this.maxVelocity
    this.body.velocity.x = this.currentVelocity;
};

