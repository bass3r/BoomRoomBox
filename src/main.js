var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.game = new Phaser.Game(576, 384, Phaser.AUTO, 'gameDiv');

BoomRoomBox.game.state.add('Boot', BoomRoomBox.Boot);
BoomRoomBox.game.state.add('Preload', BoomRoomBox.Preload);
BoomRoomBox.game.state.add('MainMenu', BoomRoomBox.MainMenu);
BoomRoomBox.game.state.add('Game', BoomRoomBox.Game);

BoomRoomBox.game.state.start('Boot');
