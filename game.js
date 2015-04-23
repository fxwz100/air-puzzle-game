/*global createjs */
/*jslint browser: true, vars: true */
(function () {
  "use strict";

  var spriteSheet = (function () {

    var res = {
      animal: [1, 61],
      cloud: [1, 72],
      grass: [1, 65],
      grass_animal: [1, 65],
      tree: [1, 66],
      tree_animal: [1, 66],
      water_animal: [1, 50],
      mountain: [1, 128]
    };

    var images = Object.keys(res).map(function (name) {
      var r = res[name], l = [];
      for (var i=r[0]; i<=r[1]; i++) {
        l.push('res/' + name + '/' + i + '.jpg');
      }
      return l;
    }).reduce(function (c, it) {
      return c.concat(it);
    });

    var animations = Object.keys(res).reduce(function (result, name) {
      result.anim[name + '_start'] = result.count;
      result.anim[name + '_play'] = [result.count, result.count + res[name][1] - 1, name + '_end'];
      result.anim[name + '_end'] = result.count + res[name][1] - 1;
      result.count += res[name][1];
      return result;
    }, {count: 0, anim: {}}).anim;

    return new createjs.SpriteSheet({
      images: images,
      frames: {"regX": 0, "regY": 0, "count": images.length, "height": 190, "width": 190},
      animations: animations,
      // framerate: 5
    });
  }());

  // Tile Class
  var Tile = (function () {
    function Tile(x, y, width, height, name) {
      this.Container_constructor();

      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;
      this.color = Math.random() > 0.5 ? "#ccc" : "#0cf";

      this.name = name;

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

      var sprite = this.sprite = new createjs.Sprite(spriteSheet);
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

    var state = {
      water: {
        animal: 'water_animal_play'
      },
      tree: {
        animal: 'tree_animal_play'
      },
      grass: {
        animal: 'grass_animal_play'
      }
    };

    TileClass.play = function (tile, callback) {
      this.sprite.visible = true;
      if (tile && state[tile.name] && state[tile.name][this.name]) {
        this.sprite.gotoAndPlay(state[tile.name][this.name]);
      } else {
        this.sprite.gotoAndPlay(this.name + '_play');
      }
      this.sprite.on('animationend', function () {
        callback(this);
      }, this, true);
      console.log(this.id);
    };
    
    return createjs.promote(Tile, "Container");
  }());
  
  var StartTile = (function () {
    function StartTile(x, y, width, height) {
      this.Container_constructor();
      
      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;
      
      this.name = 'cloud';

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
    function EndTile(x, y, width, height) {
      this.Container_constructor();
      
      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;
      
      this.name = 'grass';

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

  window.initGame = function (callback) {
    var stage = new createjs.Stage("game");
    stage.enableMouseOver(20);

    var startTile = stage.addChild(new StartTile(5, 5, 590, 190));
    var tiles = [
      stage.addChild(new Tile(605, 5, 190, 190, 'cloud')),

      stage.addChild(new Tile(5, 205, 190, 190, 'mountain')),
      stage.addChild(new Tile(205, 205, 190, 190, 'grass')),
      stage.addChild(new Tile(405, 205, 190, 190, 'grass')),
      stage.addChild(new Tile(605, 205, 190, 190, 'tree')),

      stage.addChild(new Tile(5, 405, 190, 190, 'animal'))
    ];
    var endTile = stage.addChild(new EndTile(205, 405, 590, 190));

    startTile.on('start', function () {
      tiles.forEach(function (tile) {
        tile.mouseEnabled = false;
      });
      tiles.sort(function (a, b) {
        if (a.y < b.y) {
          return -1;
        }  else if (a.y == b.y) {
          return a.x - b.x;
        } else {
          return 1;
        }
      });
      var index = -1;
      function play(tile) {
        if (++index < tiles.length) {
          tiles[index].play(tile, play);
        } else if (index == tiles.length) {
          endTile.play(tile, play);
        }
      }
      startTile.play(null, play);
    });

    endTile.on('end', callback);

    createjs.Ticker.on("tick", stage);
  };

}());
