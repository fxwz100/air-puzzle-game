/*global createjs */
/*jslint browser: true, vars: true, plusplus: true */
(function (exports) {
  "use strict";

  // Tile Class
  var Tile = (function () {
    function Tile(x, y, width, height, name, game, spriteSheet) {
      this.Container_constructor();

      this.x = x + width / 2;
      this.y = y + height / 2;

      this.regX = width / 2;
      this.regY = height / 2;

      this.originX = x + width / 2;
      this.originY = y + height / 2;

      this.width = width;
      this.height = height;
      this.color = '#efefef';

      this.alpha = 0;
      createjs.Tween.get(this).wait(Math.random() * 1000).to({ alpha: 0.6 }, 1000, createjs.Ease.cubicIn);

      this.name = name;

      this.game = game;
      this.spriteSheet = spriteSheet;

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

      var sprite = this.sprite = new createjs.Sprite(this.spriteSheet);
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

      this.on("mousedown", function (evt) {
        this.game.tilesPool.removeChild(this);
        this.game.selectingLayer.addChild(this);
      });
      this.on("pressmove", function (evt) {
//        this.stage.setChildIndex(this, 1);
        evt.currentTarget.x = evt.stageX;
        evt.currentTarget.y = evt.stageY;
      });
      this.on("pressup", function (evt) {
        var obj = this.game.tilesPool.getObjectUnderPoint(evt.stageX, evt.stageY, 1);
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
        this.game.selectingLayer.removeChild(this);
        this.game.tilesPool.addChild(this);
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
    function StartTile(x, y, width, height, game, spriteSheet) {
      this.Container_constructor();

      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;

      this.alpha = 0;
      createjs.Tween.get(this).to({ alpha: 1 }, 1000, createjs.Ease.cubicIn);

      this.name = 'start';

      this.game = game;
      this.spriteSheet = spriteSheet;

      this.setup();
    }

    var StartTileClass = createjs.extend(StartTile, createjs.Container);

    StartTileClass.setup = function () {
      var self = this;

      this.removeAllChildren();

      var background = new createjs.Shape();
      background.graphics.beginFill('#efefef').drawRoundRect(0, 0, this.width, this.height, 10).endFill();
      this.addChild(background);

      var sprite = this.sprite = new createjs.Sprite(this.spriteSheet);
      sprite.x = 0;
      sprite.y = 0;
      sprite.gotoAndStop(this.name + '_start');
      this.addChild(sprite);

      var startBtn = this.startBtn = new createjs.Shape();
      startBtn.graphics.beginFill('#aaa').drawCircle(0, 0, this.height / 4).endFill();
      startBtn.graphics.beginFill('#df1').drawPolyStar(0, 0, this.height / 6, 3, 0, 0).endFill();
      startBtn.x = this.width / 2;
      startBtn.y = this.height / 2;
      startBtn.show = function () {
        this.alpha = 0;
        startBtn.visible = true;
        createjs.Tween.get(this).to({
          alpha: 1
        }, 1000, createjs.Ease.getPowInOut(10));
      };
      startBtn.hide = function () {
        createjs.Tween.get(this).to({
          alpha: 0
        }, 1000, createjs.Ease.getPowInOut(10)).call(function () {
          startBtn.visible = false;
        });
      };

      startBtn.on('rollover', function () {
        this.alpha = 0.4;
      });
      startBtn.on('rollout', function () {
        this.alpha = 1;
      });

      startBtn.on('click', function () {
        this.visible = false;
        self.pauseBtn.show();
        self.dispatchEvent('start');
      });

      this.addChild(startBtn);

      var pauseBtn = this.pauseBtn = new createjs.Shape();
      pauseBtn.graphics.beginFill('#aaa').drawCircle(0, 0, this.height / 4).endFill();
      pauseBtn.graphics.beginFill('#df1').drawRoundRect(-18, -18, 36, 36, 10, 10).endFill();
      pauseBtn.x = this.width / 2;
      pauseBtn.y = this.height / 2;
      pauseBtn.show = function () {
        this.alpha = 0;
        this.visible = true;
        createjs.Tween.get(this).to({
          x: self.height / 4,
          y: self.height / 4 * 3,
          scaleX: 0.5,
          scaleY: 0.5,
          alpha: 1
        }, 500, createjs.Ease.getPowInOut(10));
      };
      pauseBtn.hide = function () {
        createjs.Tween.get(this).to({
          x: self.width / 2,
          y: self.height / 2,
          scaleX: 1,
          scaleY: 1,
          alpha: 0
        }, 500, createjs.Ease.getPowInOut(10)).call(function () {
          pauseBtn.visible = false;
        });
      };

      pauseBtn.on('rollover', function () {
        this.alpha = 0.4;
      });
      pauseBtn.on('rollout', function () {
        this.alpha = 1;
      });

      pauseBtn.on('click', function () {
        this.visible = false;
        self.startBtn.show();
        self.dispatchEvent('pause');
      });

      this.addChild(pauseBtn);

      this.startBtn.visible = true;
      this.pauseBtn.visible = false;

      this.game.on('animation-end', function () {
        self.pauseBtn.hide();
      });
    };

    StartTileClass.play = function (tile, callback) {
      this.sprite.visible = true;
      this.sprite.gotoAndPlay(this.name + '_play');
      this.sprite.on('animationend', function () {
        callback(this);
      }, this, true);
    };

    return createjs.promote(StartTile, "Container");
  }());

  var EndTile = (function () {
    function EndTile(x, y, width, height, game, spriteSheet) {
      this.Container_constructor();

      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;

      this.alpha = 0;
      createjs.Tween.get(this).to({ alpha: 1.0 }, 1000, createjs.Ease.cubicIn);

      this.name = 'end';

      this.game = game;
      this.spriteSheet = spriteSheet;

      this.setup();
    }

    var EndTileClass = createjs.extend(EndTile, createjs.Container);

    EndTileClass.setup = function () {
      var self = this;
      this.removeAllChildren();

      var background = new createjs.Shape();
      background.graphics.beginFill('#efefef').drawRoundRect(0, 0, this.width, this.height, 10).endFill();
      this.addChild(background);

      var sprite = this.sprite = new createjs.Sprite(this.spriteSheet);
      sprite.x = 0;
      sprite.y = 0;
      sprite.gotoAndStop(this.name + '_start');
      this.addChild(sprite);

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
      backBtn.graphics.beginFill('#efefef').drawCircle(this.width / 3, this.height / 2, this.height / 8).endFill();
      backBtn.graphics.beginFill('#aaa').drawCircle(this.width / 3, this.height / 2, this.height / 10).endFill();
      backBtn.graphics.beginFill('#efefef').drawPolyStar(this.width / 3, this.height / 2 - this.height / 9, this.height / 12, 3, 0, 0).endFill();

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
      this.sprite.gotoAndPlay(this.name + '_play');
      this.sprite.on('animationend', function () {
        this.continueBtn.visible = true;
        this.continueBtn.alpha = 0;
        createjs.Tween.get(this.continueBtn).to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4));

        this.backBtn.visible = true;
        this.backBtn.alpha = 0;
        createjs.Tween.get(this.backBtn).to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4));

        callback(this);
      }, this, true);
    };

    return createjs.promote(EndTile, "Container");
  }());

  var PuzzleGame = (function () {
    function PuzzleGame(id, state, background) {
      this.stage = new createjs.Stage(id);
      this.stage.enableMouseOver(20);
      this.tiles = [];
      this.tilesPool = new createjs.Container();
      this.tilesPool.x = this.tilesPool.y = 0;
      this.tilesPool.width = 800;
      this.tilesPool.height = 600;
      this.stage.addChild(this.tilesPool);
      this.selectingLayer = new createjs.Container();
      this.stage.addChild(this.selectingPool);
      this.state = state;
      this.background = background;
    }

    createjs.EventDispatcher.initialize(PuzzleGame.prototype);
    
    var PuzzleGameClass = PuzzleGame.prototype;

    PuzzleGameClass.addStartTile = function (x, y, w, h, spriteSheet) {
      var startTile = this.startTile = this.stage.addChild(new StartTile(x, y, w, h, this, spriteSheet));
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

    PuzzleGame.prototype.addTile = function (x, y, w, h, name, spriteSheet) {
      this.tiles.push(this.tilesPool.addChild(new Tile(x, y, w, h, name, this, spriteSheet)));
      return this;
    };

    PuzzleGameClass.setupTiles = function (tiles) {
      var game = this;
      this.tiles = [];
      tiles.forEach(function (def) {
        game.addTile.apply(game, def);
      });
    };

    PuzzleGameClass.addEndTile = function (x, y, w, h, spriteSheet) {
      var game = this;
      this.endTile = this.stage.addChild(new EndTile(x, y, w, h, this, spriteSheet));
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
      puzzle.tilesPool.removeAllChildren();
      puzzle.selectingLayer.removeAllChildren();
      puzzle.stage.addChild(puzzle.tilesPool);
      puzzle.stage.addChild(puzzle.selectingLayer);
      if (puzzle.background) {
        puzzle.stage.addChild(puzzle.background);
      }
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

    PuzzleGameClass.init = function (initDef) {
      this.initDef = initDef;

      setup(this, this.initDef);
    };

    PuzzleGameClass.reset = function () {
      if (this.isNotFirstRun) {
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
      }
      this.isNotFirstRun = true;
    };

    PuzzleGameClass.tick = function () {
      createjs.Ticker.on("tick", this.stage);
    };
    
    PuzzleGameClass.untick = function () {
      createjs.Ticker.off('tick', this.stage);
    };

    return PuzzleGame;
  }());

  exports.PuzzleGame = PuzzleGame;

}(window));
