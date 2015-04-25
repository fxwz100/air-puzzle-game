/*global createjs */
/*jslint browser: true, vars: true, plusplus: true */
(function (exports) {
  "use strict";

  // Tile Class
  var Tile = (function () {
    function Tile(x, y, width, height, name, game) {
      this.Container_constructor();

      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;
      this.color = '#efefef';

      this.name = name;

      this.game = game;

      this.setup();
    }

    var TileClass = createjs.extend(Tile, createjs.Container);

    TileClass.setup = function () {
      var background = new createjs.Shape();
      background.graphics.beginFill(this.color).drawRoundRect(0, 0, this.width, this.height, 10);
      this.addChild(background);

      var label = new createjs.Text(this.name, "bold 14px Arial", "#FFFFFF");
      label.textAlign = "center";
      label.x = this.width / 2;
      label.y = this.height / 2;
      this.addChild(label);

      var sprite = this.sprite = new createjs.Sprite(this.game.spriteSheet);
      sprite.x = 0;
      sprite.y = 0;
      sprite.gotoAndStop(this.name + '_start');
      this.addChild(sprite);

      this.on("rollover", function () {
        this.alpha = 0.4;
      });
      this.on("rollout", function () {
        this.alpha = 1;
      });
      this.on("pressmove", function (evt) {
        this.stage.setChildIndex(this, 0);
        evt.currentTarget.x = evt.stageX - this.width / 2;
        evt.currentTarget.y = evt.stageY - this.height / 2;
      });
      this.on("pressup", function (evt) {
        var obj = this.stage.getObjectUnderPoint(evt.stageX, evt.stageY, 1);
        if (obj) {
          this.x = obj.originX;
          this.y = obj.originY;
          obj.x = obj.originX = this.originX;
          obj.y = obj.originY = this.originY;
          this.originX = this.x;
          this.originY = this.y;
        } else {
          this.x = this.originX;
          this.y = this.originY;
        }
      });

      this.mouseChildren = false;
    };

    TileClass.play = function (tile, callback) {
      var state = this.game.state;
      this.sprite.visible = true;
      if (tile && state[tile.name] && state[tile.name][this.name]) {
        this.sprite.gotoAndPlay(state[tile.name][this.name]);
      } else {
        this.sprite.gotoAndPlay(this.name + '_play');
      }
      this.sprite.on('animationend', function () {
        callback(this);
      }, this, true);
    };

    return createjs.promote(Tile, "Container");
  }());

  var StartTile = (function () {
    function StartTile(x, y, width, height, game) {
      this.Container_constructor();

      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;

      this.name = 'start';

      this.game = game;

      this.setup();
    }

    var StartTileClass = createjs.extend(StartTile, createjs.Container);

    StartTileClass.setup = function () {
      var background = new createjs.Shape();
      background.graphics.beginFill('#efefef').drawRoundRect(0, 0, this.width, this.height, 10).endFill();
      this.addChild(background);

//      var sprite = this.sprite = new createjs.Sprite(spriteSheet);
//      sprite.x = this.width / 2;
//      sprite.y = 0;
////      sprite.visible = false;
////      sprite.scaleX = 0.2;
////      sprite.scaleY = 0.2;
//       sprite.gotoAndStop(this.name + '_start');
//      this.addChild(sprite);

      var circle = this.btn = new createjs.Shape();
      circle.graphics.beginFill('#aaa').drawCircle(this.width / 2, this.height / 2, this.height / 4).endFill();
      circle.graphics.beginFill('#df1').drawPolyStar(this.width / 2, this.height / 2, this.height / 6, 3, 0, 0).endFill();

      circle.on('rollover', function () {
        this.alpha = 0.4;
      });
      circle.on('rollout', function () {
        this.alpha = 1;
      });

      var self = this;
      circle.on('click', function () {
        self.dispatchEvent('start');
      });

      this.addChild(circle);
    };

    StartTileClass.play = function (tile, callback) {
      this.btn.visible = false;
//      this.sprite.visible = true;
//      this.sprite.gotoAndPlay(this.name + '_play');
//      this.sprite.on('animationend', function () {
//        callback(this);
//      }, this, true);
      callback(this);
    };

    return createjs.promote(StartTile, "Container");
  }());

  var EndTile = (function () {
    function EndTile(x, y, width, height, game) {
      this.Container_constructor();

      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;

      this.name = 'end';

      this.game = game;

      this.setup();
    }

    var EndTileClass = createjs.extend(EndTile, createjs.Container);

    EndTileClass.setup = function () {
      var background = new createjs.Shape();
      background.graphics.beginFill('#efefef').drawRoundRect(0, 0, this.width, this.height, 10).endFill();
      this.addChild(background);

      var circle = this.btn = new createjs.Shape();
      circle.graphics.beginFill('#aaa').drawCircle(this.width / 2, this.height / 2, this.height / 4).endFill();
      circle.graphics.beginFill('#df1').drawPolyStar(this.width / 2, this.height / 2, this.height / 6, 3, 0, 0).endFill();

      circle.on('rollover', function () {
        this.alpha = 0.4;
      });
      circle.on('rollout', function () {
        this.alpha = 1;
      });

      var self = this;
      circle.on('click', function () {
        self.dispatchEvent('end');
      });

      circle.visible = false;

      this.addChild(circle);
    };

    EndTileClass.play = function (tile, callback) {
      this.btn.visible = true;
    };

    return createjs.promote(EndTile, "Container");
  }());

  var PuzzleGame = (function () {
    function PuzzleGame(id, res, state) {
      this.stage = new createjs.Stage(id);
      this.stage.enableMouseOver(20);
      this.tiles = [];
      this.spriteSheet = new createjs.SpriteSheet({
        images: res.images.list,
        frames: {
          "regX": 0,
          "regY": 0,
          "count": res.images.list.length,
          "height": res.images.height,
          "width": res.images.width
        },
        animations: res.animations
        // framerate: 5
      });
      this.state = state;
    }

    PuzzleGame.prototype.addStartTile = function (x, y, w, h) {
      var startTile = this.startTile = this.stage.addChild(new StartTile(x, y, w, h, this));
      var game = this;
      startTile.on('start', function () {
        game.tiles.forEach(function (tile) {
          tile.mouseEnabled = false;
        });
        game.tiles.sort(function (a, b) {
          if (a.y < b.y) {
            return -1;
          } else if (a.y === b.y) {
            return a.x - b.x;
          } else {
            return 1;
          }
        });
        var index = -1;
        function play(tile) {
          if (++index < game.tiles.length) {
            game.tiles[index].play(tile, play);
          } else if (index === game.tiles.length) {
            game.endTile.play(tile, play);
          }
        }
        startTile.play(null, play);
      });
      return this;
    };

    PuzzleGame.prototype.addTile = function (x, y, w, h, name) {
      this.tiles.push(this.stage.addChild(new Tile(x, y, w, h, name, this)));
      return this;
    };

    PuzzleGame.prototype.setupTiles = function (tiles) {
      var game = this;
      tiles.forEach(function (def) {
        game.addTile(def[0], def[1], def[2], def[3], def[4], def[5]);
      });
    };

    PuzzleGame.prototype.addEndTile = function (x, y, w, h) {
      this.endTile = this.stage.addChild(new EndTile(x, y, w, h, this));
      return this;
    };

    PuzzleGame.prototype.onGameOver = function (callback) {
      this.endTile.on('end', callback);
      return this;
    };

    PuzzleGame.prototype.onBack = function (callback) {
      this.endTile.on('back', callback);
      return this;
    };

    PuzzleGame.prototype.tick = function () {
      createjs.Ticker.on("tick", this.stage);
    };

    return PuzzleGame;
  }());

  exports.PuzzleGame = PuzzleGame;

}(window));
