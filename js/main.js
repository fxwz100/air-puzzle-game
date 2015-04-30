/*globals StageManager, PuzzleGame, createjs */
/*jslint vars: true, plusplus: true */
(function () {
  "use strict";

  function createSpriteSheetFromSeq(res, prefix) {
    var images = Object.keys(res.images).map(function (name) {
      var r = res.images[name], l = [], i;
      for (i = r[0]; i <= r[1]; i++) {
        l.push(res.prefix + name + '/' + i + '.jpg');
      }
      return l;
    }).reduce(function (c, it) {
      return c.concat(it);
    });

    var animations = Object.keys(res.images).reduce(function (result, name) {
      result.anim[name + '_start'] = result.count;
      result.anim[name + '_play'] = [result.count, result.count + res.images[name][1] - 1, name + '_end'];
      result.anim[name + '_end'] = result.count + res.images[name][1] - 1;
      result.count += res.images[name][1];
      return result;
    }, { count: 0, anim: {} }).anim;

    return new createjs.SpriteSheet({
      images: images,
      frames: {
        regX: res.frames.regX || 0,
        regY: res.frames.regY || 0,
        count: images.length,
        height: res.frames.height,
        width: res.frames.width
      },
      animations: animations,
      framerate: 24
    });
  }

  window.addEventListener('load', function () {
    var stageManager = new StageManager('stage');

    // the first animation.
    stageManager.setup(0, function (stage, manager) {
      var startBtn = document.getElementById("start-btn");
      var preview = document.getElementById("welcome-video");

      preview.addEventListener('ended', function () {
        startBtn.classList.remove('hidden');
      });

      startBtn.addEventListener('click', function () {
        window.history.pushState({
          stageId: manager.stageId,
          stage: true
        }, "stage#" + manager.stageId, null);
        manager.nextStage();
        //        manager.gotoStage(3);
      });
    });

    // the puzzle game.
    stageManager.setup(1, function (stage, manager) {
      var state = {
        cloud: {
          animal: 'rabbit_play'
        },
        animal: {
          water: 'water_sheep_play'
        },
        tree: {
          water: 'water_tree_play'
        },
        grass: {
          animal: 'animal_grass_play'
        }
      };
      var tileSpriteSheet = createSpriteSheetFromSeq({
        images: {
          animal: [1, 196],
          animal_grass: [1, 130],
          cloud: [1, 170],
          grass: [1, 150],
          mountain: [1, 115],
          rabbit: [1, 200],
          tree: [1, 200],
          water: [1, 190],
          water_sheep: [1, 200],
          water_tree: [1, 66]
        },
        frames: {
          width: 190,
          height: 190
        },
        prefix: 'res/puzzle-1/'
      });
      var specialTileSpriteSheet = createSpriteSheetFromSeq({
        images: {
          start: [1, 150],
          end: [1, 201]
        },
        frames: {
          width: 590,
          height: 190
        },
        prefix: 'res/puzzle-1/'
      });
      var game = new PuzzleGame('puzzle-1-canvas', state);
      game.init({
        start: [5, 5, 590, 190, specialTileSpriteSheet],
        tiles: [
          [605, 5, 190, 190, 'cloud', tileSpriteSheet],
          [5, 205, 190, 190, 'mountain', tileSpriteSheet],
          [205, 205, 190, 190, 'water', tileSpriteSheet],
          [405, 205, 190, 190, 'grass', tileSpriteSheet],
          [605, 205, 190, 190, 'tree', tileSpriteSheet],
          [5, 405, 190, 190, 'animal', tileSpriteSheet]
        ],
        end: [205, 405, 590, 190, specialTileSpriteSheet]
      });
      game.on('gameover', function () {
        window.history.pushState({
          stageId: manager.stageId,
          stage: true
        }, "stage#" + manager.stageId, null);
        manager.nextStage();
      });
      game.on('back', function () {
        stage.game.reset();
      });
      game.tick();

      stage.game = game;
    });

    stageManager.setup(1, function (stage, manager) {
      stage.game.reset();
    }, true);

    // the transition screen and start.
    stageManager.setup(2, function (stage_element, manager) {
      var stage = new createjs.Stage('start-canvas');
      var bitmap = new createjs.Bitmap('res/start/1.jpg');
      stage.addChild(bitmap);
      var leafBtn = new createjs.Bitmap('res/start/leaf-btn.png');
      leafBtn.x = 300;
      leafBtn.y = 200;
      createjs.Tween.get(leafBtn, { loop: true })
        .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4))
        .to({ alpha: 0.4 }, 1000, createjs.Ease.getPowInOut(3))
        .to({ alpha: 1 }, 500, createjs.Ease.getPowInOut(4));
      stage.addChild(leafBtn);
      leafBtn.on('click', function () {
        manager.nextStage();
      });
      createjs.Ticker.on("tick", stage);
    }, true);
    
    // start screen.
    stageManager.setup(3, function (stage, manager) {
      var video = document.getElementById('leaf-video');
      video.play();
      video.addEventListener('ended', function () {
        manager.nextStage();
      });
    }, true);

    // the leaf puzzle.
    stageManager.setup(4, function (stage_element, manager) {
      var stage = new createjs.Stage('leaf-canvas');
      var bitmap = new createjs.Bitmap('res/leaf-puzzle/preview.jpg');
      bitmap.on('click', function () {
        manager.nextStage();
      });
      stage.addChild(bitmap);
      createjs.Ticker.on("tick", stage);
    }, true);
    
    // the car start screen.
    stageManager.setup(5, function (stage, manager) {
      var video = document.getElementById('car-video');
      video.play();
      video.addEventListener('ended', function () {
        manager.nextStage();
      });
    }, true);

    window.addEventListener('popstate', function (event) {
      if (event.state && event.state.stage) {
        stageManager.gotoStage(event.state.stageId);
      }
    });
  });

} ());
