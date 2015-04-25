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
      this.removeAllChildren();

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

      this.alpha = 0.6;
      this.on("rollover", function () {
        this.alpha = 1;
      });
      this.on("rollout", function () {
        this.alpha = 0.6;
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
      this.alpha = 1;
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

      this.game.on('gameover', function () {
        this.pauseBtn.visible = false;
      });
    }

    var StartTileClass = createjs.extend(StartTile, createjs.Container);

    StartTileClass.setup = function () {
      var self = this;
      this.removeAllChildren();

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

      var startBtn = this.startBtn = new createjs.Shape();
      startBtn.graphics.beginFill('#aaa').drawCircle(this.width / 2, this.height / 2, this.height / 4).endFill();
      startBtn.graphics.beginFill('#df1').drawPolyStar(this.width / 2, this.height / 2, this.height / 6, 3, 0, 0).endFill();

      startBtn.on('rollover', function () {
        this.alpha = 0.4;
      });
      startBtn.on('rollout', function () {
        this.alpha = 1;
      });

      startBtn.on('click', function () {
        this.visible = false;
        self.pauseBtn.visible = true;
        self.dispatchEvent('start');
      });

      this.addChild(startBtn);

      var pauseBtn = this.pauseBtn = new createjs.Shape();
      pauseBtn.graphics.beginFill('#aaa').drawCircle(this.width / 2, this.height / 2, this.height / 4).endFill();
      pauseBtn.graphics.beginFill('#df1').drawRoundRect(this.width / 2 - 18, this.height / 2 - 18, 36, 36, 10, 10).endFill();

      pauseBtn.on('rollover', function () {
        this.alpha = 0.4;
      });
      pauseBtn.on('rollout', function () {
        this.alpha = 1;
      });

      pauseBtn.on('click', function () {
        this.visible = false;
        self.startBtn.visible = true;
        self.dispatchEvent('pause');
      });

      this.addChild(pauseBtn);

      this.startBtn.visible = true;
      this.pauseBtn.visible = false;

      this.game.on('animation-end', function () {
        self.pauseBtn.visible = false;
      });
    };

    StartTileClass.play = function (tile, callback) {
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
      var self = this;
      this.removeAllChildren();

      var background = new createjs.Shape();
      background.graphics.beginFill('#efefef').drawRoundRect(0, 0, this.width, this.height, 10).endFill();
      this.addChild(background);

      var continueBtn = this.continueBtn = new createjs.Shape();
      continueBtn.graphics.beginFill('#aaa').drawCircle(this.width / 3 * 2, this.height / 2, this.height / 6).endFill();
      continueBtn.graphics.beginFill('#efefef').drawPolyStar(this.width / 3 * 2, this.height / 2, this.height / 8, 3, 0, 0).endFill();

      continueBtn.on('rollover', function () {
        this.alpha = 0.4;
      });
      continueBtn.on('rollout', function () {
        this.alpha = 1;
      });

      continueBtn.on('click', function () {
        self.dispatchEvent('end');
      });

      continueBtn.visible = false;

      this.addChild(continueBtn);

      var backBtn = this.backBtn = new createjs.Shape();
      backBtn.graphics.beginFill('#aaa').drawCircle(this.width / 3, this.height / 2, this.height / 6).endFill();

      backBtn.on('rollover', function () {
        this.alpha = 0.4;
      });
      backBtn.on('rollout', function () {
        this.alpha = 1;
      });

      backBtn.on('click', function () {
        self.dispatchEvent('back');
      });

      backBtn.visible = false;

      this.addChild(backBtn);
    };

    EndTileClass.play = function (tile, callback) {
      this.continueBtn.visible = true;
      this.continueBtn.alpha = 0;
      createjs.Tween.get(this.continueBtn).to({ alpha: 1}, 1000, createjs.Ease.getPowInOut(4));

      this.backBtn.visible = true;
      this.backBtn.alpha = 0;
      createjs.Tween.get(this.backBtn).to({ alpha: 1}, 1000, createjs.Ease.getPowInOut(4));
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
        animations: res.animations,
        framerate: 24
      });
      this.state = state;
    }

    createjs.EventDispatcher.initialize(PuzzleGame.prototype);

    PuzzleGame.prototype.addStartTile = function (x, y, w, h) {
      var startTile = this.startTile = this.stage.addChild(new StartTile(x, y, w, h, this));
      var game = this;
      var index = -1;
      function play(tile) {
        if (++index < game.tiles.length) {
          var event = new createjs.Event();
          event.target = game;
          event.currentTarget = game.tiles[index];

          event.type = 'tile-to-play';
          game.dispatchEvent(event);

          game.tiles[index].play(tile, play);

          event.type = 'tile-played';
          game.dispatchEvent(event);
        } else if (index === game.tiles.length) {
          game.dispatchEvent('animation-end');
          game.endTile.play(tile, play);
        }
      }
      startTile.on('start', function () {
        index = -1;
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
        startTile.play(null, play);
      });
      startTile.on('pause', function () {
        index = game.tiles.length + 1;
        game.tiles.forEach(function (tile) {
          tile.mouseEnabled = true;
          tile.setup();
        });
      });
      return this;
    };

    PuzzleGame.prototype.addTile = function (x, y, w, h, name) {
      this.tiles.push(this.stage.addChild(new Tile(x, y, w, h, name, this)));
      return this;
    };

    PuzzleGame.prototype.setupTiles = function (tiles) {
      var game = this;
      this.tiles = [];
      tiles.forEach(function (def) {
        game.addTile(def[0], def[1], def[2], def[3], def[4], def[5]);
      });
    };

    PuzzleGame.prototype.addEndTile = function (x, y, w, h) {
      var game = this;
      this.endTile = this.stage.addChild(new EndTile(x, y, w, h, this));
      this.endTile.on('end', function () {
        game.dispatchEvent('gameover');
      });
      this.endTile.on('back', function () {
        game.dispatchEvent('back');
      });
      return this;
    };

    function setup(puzzle, initDef) {
      puzzle.stage.removeAllChildren();
      if (initDef.start) {
        puzzle.addStartTile.apply(puzzle, initDef.start);
      }
      if (initDef.tiles && initDef.tiles.length) {
        puzzle.setupTiles(initDef.tiles);
      }
      if (initDef.end) {
        puzzle.addEndTile.apply(puzzle, initDef.end);
      }
    }

    PuzzleGame.prototype.init = function (initDef) {
      this.initDef = initDef;
      setup(this, this.initDef);
    };

    PuzzleGame.prototype.reset = function () {
      if (this.initDef) {
        setup(this, this.initDef);
        if (this.startTile) {
          this.startTile.setup();
        }
        if (this.tiles) {
          this.tiles.forEach(function (tile) {
            tile.setup();
          });
        }
        if (this.endTile) {
          this.endTile.setup();
        }
      }
    };

    PuzzleGame.prototype.tick = function () {
      createjs.Ticker.setFPS(60);
      createjs.Ticker.on("tick", this.stage);
    };

    return PuzzleGame;
  }());

  exports.PuzzleGame = PuzzleGame;

}(window));
