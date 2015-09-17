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


};

BoomRoomBox.Enemy.prototype.kill = function () {
    this.alive = false;
    this.body.enable = false;
    this.currentVelocity = 0;
    this.animations.stop();
    this.animations.play('die');
    this.events.onAnimationComplete.addOnce(function () {
        this.exists = true;
        this.visible = true;
        this.inputEnabled = false;
        this.events.destroy();
    }, this);

    if (this.events) {
        this.events.onKilled$dispatch(this);
    }

    return this;
};

BoomRoomBox.Enemy.prototype.restart = function(x, y, health, velocity) {
    this.reset(x, y, health);

    this.body.velocity.x = this.currentVelocity;
};

BoomRoomBox.Enemy.prototype.turnBack = function() {
    this.currentVelocity *= -1;
    this.body.velocity.x = this.currentVelocity;
};
