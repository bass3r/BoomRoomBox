Enemy = function (index, game, velocity, health, gravity, sprite) {
    this.name = index.toString();
    this.game = game;
    this.maxVelocity = velocity;
    this.currentVelocity = velocity;
    this.health = health;
    this.alive = true;

    this.enemy = this.game.add.sprite(this.game.world.centerX, 0, sprite);
    this.enemy.anchor.setTo(0.5, 1);
    this.game.physics.arcade.enable(this.enemy);
    this.enemy.body.gravity.y = gravity;

    console.log('enemy created');
};

Enemy.prototype.update = function () {

    if (this.enemy.body.touching.right) {
        this.currentVelocity = -this.maxVelocity;
    } else if (this.enemy.body.touching.left) {
        this.currentVelocity = this.maxVelocity;
    }

    this.enemy.body.velocity.x = this.currentVelocity;
};

