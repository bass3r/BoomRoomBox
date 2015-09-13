var BoomRoomBox = BoomRoomBox || {};

BoomRoomBox.MainMenu = function () {};

BoomRoomBox.MainMenu.prototype = {

    preload: function () {

    },

    create: function () {

    },

    update: function () {

        this.game.state.start('Game');
    }
};
