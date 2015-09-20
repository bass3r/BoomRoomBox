var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.Enemy = function (index, game, velocity, sprite) {

    Phaser.Sprite.call(this, game, game.world.centerX, 0, sprite, 0, false);

    this.anchor.setTo(0.5, 1);

    this.name = index.toString();
    this.maxVelocity = velocity;

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
    this.body.velocity.x = this.maxVelocity * this.getDirectionSign() * -1;
    this.scale.x *= -1;
};

BoomRoomBox.Enemy.prototype.beginMovement = function() {
    this.body.velocity.x = this.maxVelocity * this.getDirectionSign();
};

BoomRoomBox.Enemy.prototype.getDirectionSign = function () {
    var scaleX = this.scale.x;
    return scaleX && scaleX / Math.abs(scaleX);
};

