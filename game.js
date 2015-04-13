/*global createjs */
/*jslint browser: true, vars: true */
(function () {
  "use strict";

  // Tile Class
  var Tile = (function () {
    function Tile(x, y, width, height, selectable) {
      this.Container_constructor();

      this.x = this.originX = x;
      this.y = this.originY = y;
      this.width = width;
      this.height = height;
      this.color = Math.random() > 0.5 ? "#ccc" : "#0cf";

      this.setup();
    }

    var TileClass = createjs.extend(Tile, createjs.Container);

    TileClass.setup = function () {
      var background = new createjs.Shape();
      background.graphics.beginFill(this.color).drawRoundRect(0, 0, this.width, this.height, 10);
      this.addChild(background);

      var label = new createjs.Text(this.id, "bold 14px Arial", "#FFFFFF");
      label.textAlign = "center";
      label.x = this.width / 2;
      label.y = this.height / 2;
      this.addChild(label);

      var spriteSheet = new createjs.SpriteSheet({
        images: ["spritesheet_grant.png"],
        frames: {"regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
        animations: {
          still: 0,
          play: [0, 12, 'still'],
          jump: [48, 56, 'still']
        },
        // framerate: 5
      });
      var sprite = this.sprite = new createjs.Sprite(spriteSheet);
      sprite.x = this.width / 2;
      sprite.y = 0;
      sprite.visible = false;
      sprite.scaleX = 0.5;
      sprite.scaleY = 0.5;
      // sprite.gotoAndPlay(0);
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
      this.sprite.visible = true;
      if (tile && tile.id == 8 && this.id == 16) {
        this.sprite.gotoAndPlay('play');
      } else {
        this.sprite.gotoAndPlay('jump');
      }
      this.sprite.on('animationend', function () {
        this.sprite.visible = false;
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
      
      this.setup();
    }
    
    var StartTileClass = createjs.extend(StartTile, createjs.Container);
    
    StartTileClass.setup = function () {
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
        self.dispatchEvent('start');
      });
      
      this.addChild(circle);
    };
    
    StartTileClass.play = function (tile, callback) {
      this.btn.visible = false;
      setTimeout(callback, 10);
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

    var tiles = [
      stage.addChild(new StartTile(0, 0, 530, 196)),
      stage.addChild(new Tile(535, 0, 265, 196, true)),

      stage.addChild(new Tile(0, 201, 263, 196, true)),
      stage.addChild(new Tile(268, 201, 262, 196, true)),
      stage.addChild(new Tile(536, 201, 263, 196, true)),

      stage.addChild(new Tile(0, 402, 265, 196, true)),
      stage.addChild(new EndTile(270, 402, 530, 196))
    ];

    tiles[0].on('start', function () {
      var index = 0;
      function play(tile) {
        if (++index < tiles.length) {
          tiles[index].play(tile, play);
        }
      }
      tiles.sort(function (a, b) {
        if (a.y < b.y) {
          return -1;
        }  else if (a.y == b.y) {
          return a.x - b.x;
        } else {
          return 1;
        }
      });
      tiles[index].play(null, play);
    });

    tiles[6].on('end', callback);

    createjs.Ticker.on("tick", stage);
  };

}());
