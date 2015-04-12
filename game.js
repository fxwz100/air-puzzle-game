/*global createjs */
/*jslint browser: true, vars: true */
(function () {
  "use strict";

  function Tile(x, y, width, height, selectable) {
    this.Container_constructor();

    this.x = this.originX = x;
    this.y = this.originY = y;
    this.width = width;
    this.height = height;
    this.color = Math.random() > 0.5 ? "#ccc" : "#0cf";

    this.mouseEnabled = selectable;
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
      images: ["sprites.jpg"],
      frames: {width:50, height:50},
      animations: {
        play: [0, 1, 2, 3, 4, 5, 6]
      }
    });
    var sprite = this.sprite = new createjs.Sprite(spriteSheet);
    this.addChild(sprite);

    if (this.mouseEnabled) {
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
    }

    this.mouseChildren = false;
  };

  TileClass.play = function (callback) {
    this.sprite.gotoAndPlay('play');
    this.sprite.on('animationend', callback);
  };

  window.Tile = createjs.promote(Tile, "Container");

  window.addEventListener('load', function() {
    var stage = new createjs.Stage("game");
    stage.enableMouseOver(20);

    var tiles = [
      stage.addChild(new Tile(0, 0, 530, 196)),
      stage.addChild(new Tile(535, 0, 265, 196, true)),

      stage.addChild(new Tile(0, 201, 263, 196, true)),
      stage.addChild(new Tile(268, 201, 262, 196, true)),
      stage.addChild(new Tile(536, 201, 263, 196, true)),

      stage.addChild(new Tile(0, 402, 265, 196, true)),
      stage.addChild(new Tile(270, 402, 530, 196))
    ];

    tiles[0].on('click', function () {
      var index = 0;
      function play() {
        if (index < tiles.length) {
          tiles[index].play(play);
        }
      }
      tiles[index].play(play);
    });

    createjs.Ticker.on("tick", stage);
  });

}());
