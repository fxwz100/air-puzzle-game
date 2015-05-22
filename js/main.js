/*globals StageManager, MazePuzzle, PuzzleGame, createjs */
/*jslint vars: true, plusplus: true */
(function () {
  "use strict";

  function createSpriteSheetFromSeq(res) {
    if (!res.postfix) {
      res.postfix = '.jpg';
    }
    
    var images = Object.keys(res.images).map(function (name) {
      var r = res.images[name], l = [], i;
      for (i = r[0]; i <= r[1]; i++) {
        l.push(res.prefix + name + '/' + i + res.postfix);
      }
      return l;
    }).reduce(function (c, it) {
      return c.concat(it);
    });

    var animations = Object.keys(res.images).reduce(function (result, name) {
      result.anim[name + '_start'] = result.count;
      result.anim[name + '_play'] = [result.count, result.count + res.images[name][1] - 1];
      if (!res.loop) {
        result.anim[name + '_play'].push(name + '_end');
      }
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
//        window.history.pushState({
//          stageId: manager.stageId,
//          stage: true
//        }, "stage#" + manager.stageId, null);
        manager.nextStage();
//        manager.gotoStage(10);
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
//        window.history.pushState({
//          stageId: manager.stageId,
//          stage: true
//        }, "stage#" + manager.stageId, null);
        manager.gotoStage(2);
      });
      game.on('back', function () {
        stage.game.reset();
      });
      game.tick();

      stage.game = game;
    });

    stageManager.on('goto-1', function (evt) {
      var stage = evt.stage;
      stage.game.reset();
      stage.game.tick();
    });
    
    stageManager.on('goto-1-done', function (evt) {
      var stage = evt.stage;
      stage.game.untick();
    });
    
    // start screen
    stageManager.setup(2, function (stage_element, manager) {
      var stage = new createjs.Stage('start-canvas');
      stage.enableMouseOver(20);
  
      var bitmap = new createjs.Bitmap('res/start/main.jpg');
      stage.addChild(bitmap);
  
      var leafBtn = new createjs.Bitmap('res/start/leaf.png');
      leafBtn.x = 70;
      leafBtn.y = 227;
      leafBtn.alpha = 0.8;
      var leafAnim = createjs.Tween.get(leafBtn, { loop: true })
        .to({ scaleX: 1.2, scaleY: 1.2}, 600, createjs.Ease.cubicIn)
        .to({ scaleX: 1, scaleY: 1}, 600, createjs.Ease.cubicIn);
      leafAnim.setPaused(true);
      leafBtn.on('rollover', function () {
        leafBtn.alpha = 1;
        leafAnim.setPaused(false);
      });
      leafBtn.on('rollout', function () {
        leafBtn.alpha = 0.8;
        leafAnim.setPaused(true);
      });
      leafBtn.on('click', function () {
        manager.nextStage();
      });
  
      var trainBtn = new createjs.Sprite(createSpriteSheetFromSeq({
        images: {train: [1, 26]},
        frames: {width: 201, height: 143},
        prefix: 'res/start/main/',
        postfix: '.png',
        loop: true
      }), 'train_start');
      trainBtn.x = 350;
      trainBtn.y = 300;
      trainBtn.alpha = 0.8;
      trainBtn.on('rollover', function () {
        trainBtn.alpha = 1;
        trainBtn.gotoAndPlay('train_play');
      });
      trainBtn.on('rollout', function () {
        trainBtn.alpha = 0.8;
        trainBtn.gotoAndStop('train_start');
      });
      trainBtn.on('click', function () {
        manager.gotoStage(5);
      });
  
      var factoryBtn = new createjs.Sprite(createSpriteSheetFromSeq({
        images: {factory: [1, 26]},
        frames: {width: 800, height: 527},
        prefix: 'res/start/main/',
        postfix: '.png',
        loop: true
      }), 'factory_start');
      factoryBtn.x = 30;
      factoryBtn.y = 40;
      factoryBtn.alpha = 0.8;
      factoryBtn.on('rollover', function () {
        factoryBtn.alpha = 1;
        factoryBtn.gotoAndPlay('factory_play');
      });
      factoryBtn.on('rollout', function () {
        factoryBtn.alpha = 0.8;
        factoryBtn.gotoAndStop('factory_start');
      });
      factoryBtn.on('click', function () {
        manager.gotoStage(7);
      });
      
//      createjs.Tween.get(trainBtn, { loop: true })
//        .to({ scaleX: 1.1, scaleY: 1.1}, 1000, createjs.Ease.cubicIn)
//        .to({ scaleX: 1, scaleY: 1}, 1000, createjs.Ease.cubicIn);
      
      var humanBtn = new createjs.Sprite(createSpriteSheetFromSeq({
        images: {human: [1, 19]},
        frames: {width: 800, height: 527},
        prefix: 'res/start/main/',
        postfix: '.png',
        loop: true
      }), 'human_start');
      humanBtn.y = 70;
      humanBtn.alpha = 0.8;
      humanBtn.on('rollover', function () {
        humanBtn.alpha = 1;
        humanBtn.gotoAndPlay('human_play');
      });
      humanBtn.on('rollout', function () {
        humanBtn.alpha = 0.8;
        humanBtn.gotoAndStop('human_play');
      });
      humanBtn.on('click', function () {
        manager.gotoStage(9);
      });
      
      stage.addChild(leafBtn, trainBtn, factoryBtn, humanBtn);
      
      stage_element.stage = stage;
      
      Array.prototype.forEach.call(document.querySelectorAll('.back.btn'), function (btn) {
        btn.addEventListener('click', function () {
          manager.gotoStage(2);
        });
      });
    });

    // the transition screen and start.
    stageManager.on('goto-2', function (evt) {
      var stage = evt.stage.stage;
      createjs.Ticker.on("tick", stage);
    });

    stageManager.on('goto-2-done', function (evt) {
      var stage = evt.stage.stage;
      createjs.Ticker.off("tick", stage);
    });

    // the leaf start screen.
    stageManager.on('goto-3', function (evt) {
      var manager = evt.target;
      var video = document.getElementById('leaf-video');
      video.play();
      video.addEventListener('ended', function () {
        manager.nextStage();
      });
    });

    // the leaf puzzle.
    stageManager.on('goto-4', function (evt) {
      var manager = evt.target;
      var stage = new createjs.Stage('leaf-canvas');
      var bitmap = new createjs.Bitmap('res/leaf-puzzle/preview.jpg');
      bitmap.on('click', function () {
        manager.gotoStage(2);
      });
      stage.addChild(bitmap);
      createjs.Ticker.on("tick", stage);
    });

    // the train start screen.
    stageManager.on('goto-5', function (evt) {
      var manager = evt.target;
      var video = document.getElementById('train-video');
      video.play();
      video.addEventListener('ended', function () {
        manager.nextStage();
      });
    });
    
    // the train puzzle.
    stageManager.setup(6, function (stage, manager) {
      var state = {
        '1-1': {
          '4-2': {
            animation: '4-1_play',
            condition: function (game) {
              return game.index === 2;
            }
          },
          '6-1': {
            animation: '6-2_play'
          }
        },
        '3': {
          '4-2': {
            animation: '4-1_play',
            condition: function (game) {
              return game.index === 2;
            }
          },
          '6-1': {
            animation: '6-2_play'
          }
        },
        '4-2': {
          '5-1': {
            animation: '5-2_play'
          },
          '6-1': {
            animation: '6-2_play'
          }
        },
        '5-1': {
          '4-2': {
            animation: '4-1_play',
            condition: function (game) {
              return game.index === 2;
            }
          },
          '6-1': {
            animation: '6-2_play',
            condition: function (game) {
              return game.index === 4;
            }
          }
        }
      };
      var tileSpriteSheet = createSpriteSheetFromSeq({
        images: {
          start: [1, 101],
          '2-1': [1, 90],
          '2-2': [1, 90],
          '3':   [1, 110],
          '4-1': [1, 70],
          '4-2': [1, 70],
          '5-1': [1, 90],
          '5-2': [1, 90],
          '6-1': [1, 70],
          '6-2': [1, 75]
        },
        frames: {
          width: 190,
          height: 190
        },
        prefix: 'res/train-puzzle/'
      });
      var specialTileSpriteSheet = createSpriteSheetFromSeq({
        images: {
          end: [1, 100]
        },
        frames: {
          width: 150,
          height: 190
        },
        prefix: 'res/train-puzzle/'
      });
      
      var bitmap = new createjs.Bitmap('res/train-puzzle/background.jpg');
      bitmap.mouseEnabled = false;
      
      var game = new MazePuzzle('train-canvas', state, bitmap);
      
      game.init({
        start: [32, 190, 190, 190, tileSpriteSheet],
        tiles: [
          [232, 190, 190, 190, '2-1', tileSpriteSheet],
          [432, 190, 190, 190, '4-2', tileSpriteSheet, true],
          [ 32, 390, 190, 190, '5-1', tileSpriteSheet],
          [232, 390, 190, 190, '3', tileSpriteSheet],
          [432, 390, 190, 190, '6-1', tileSpriteSheet, true]
        ],
        end: [642, 222, 150, 190, specialTileSpriteSheet]
      });
      
      game.on('gameover', function () {
//        window.history.pushState({
//          stageId: manager.stageId,
//          stage: true
//        }, "stage#" + manager.stageId, null);
        manager.gotoStage(2);
      });
      
      game.on('back', function () {
        stage.game.reset();
      });
      
      game.tick();

      stage.game = game;
    });
    
    // the train puzzle started.
    stageManager.on('goto-6', function (evt) {
      var stage = evt.stage.stage;
      createjs.Ticker.on("tick", stage);
    });
    
    // the train puzzle ended.
    stageManager.on('goto-6-done', function (evt) {
      var stage = evt.stage.stage;
      createjs.Ticker.off("tick", stage);
    });
    
    // the factory start screen.
    stageManager.on('goto-7', function (evt) {
      var manager = evt.target;
      var video = document.getElementById('factory-video');
      video.play();
      video.addEventListener('ended', function () {
        manager.nextStage();
      });
    });
    
    // the factory puzzle.
    stageManager.setup(8, function (stage, manager) {
      var state = {
        '3': {
          '2-1': {
            animation: '2-2_play',
            condition: function (game) {
              return false;
            }
          },
          '4': {
            animation: '4-2_play',
            condition: function (game) {
              return false;
            }
          }
        },
        '4': {
          '5': {
            animation: '5_play',
            condition: function (game) {
              return game.index === 3;
            }
          }
        }
      };
      var tileSpriteSheet = createSpriteSheetFromSeq({
        images: {
          '2-1': [1, 99],
          '2-2': [1, 99],
          '3':   [1, 81],
//          '4-1': [1, 70],
          '4': [1, 102],
          '5': [1, 99]
//          '5-2': [1, 90]
        },
        frames: {
          width: 190,
          height: 190
        },
        prefix: 'res/factory-puzzle/'
      });
      var specialTileSpriteSheet = createSpriteSheetFromSeq({
        images: {
          start: [1, 64],
          end: [1, 64]
        },
        frames: {
          width: 150,
          height: 450
        },
        prefix: 'res/factory-puzzle/'
      });

      var game = new MazePuzzle('factory-canvas', state);

      game.init({
        start: [50, 90, 150, 450, specialTileSpriteSheet],
        tiles: [
          [210, 90, 190, 190, '3', tileSpriteSheet],
          [410, 90, 190, 190, '2-1', tileSpriteSheet],
          [210, 350, 190, 190, '4', tileSpriteSheet],
          [410, 350, 190, 190, '5', tileSpriteSheet, true]
        ],
        end: [610, 90, 150, 450, specialTileSpriteSheet]
      });

      game.on('gameover', function () {
//        window.history.pushState({
//          stageId: manager.stageId,
//          stage: true
//        }, "stage#" + manager.stageId, null);
        manager.gotoStage(2);
      });

      game.on('back', function () {
        stage.game.reset();
      });

      game.tick();

      stage.game = game;
    });

    // the factory puzzle started.
    stageManager.on('goto-8', function (evt) {
      var stage = evt.stage.stage;
      createjs.Ticker.on("tick", stage);
    });

    // the factory puzzle ended.
    stageManager.on('goto-8-done', function (evt) {
      var stage = evt.stage.stage;
      createjs.Ticker.off("tick", stage);
    });
    
    // the human start screen.
    stageManager.on('goto-9', function (evt) {
      var manager = evt.target;
      var video = document.getElementById('human-video');
      video.play();
      video.addEventListener('ended', function () {
        manager.nextStage();
      });
    });
    
    // the human puzzle.
    stageManager.on('goto-10', function (evt) {
      var manager = evt.target;
      var stage = new createjs.Stage('human-canvas');
      var bitmap = new createjs.Bitmap('res/human-puzzle/preview.jpg');
      bitmap.on('click', function () {
        manager.gotoStage(2);
      });
      stage.addChild(bitmap);
      createjs.Ticker.on("tick", stage);
    });

//    // the human puzzle.
//    stageManager.setup(10, function (stage, manager) {
//      var state = {
//        '3': {
//          '2-1': {
//            animation: '2-2_play',
//            condition: function (game) {
//              return false;
//            }
//          },
//          '4': {
//            animation: '4-2_play',
//            condition: function (game) {
//              return false;
//            }
//          }
//        },
//        '4': {
//          '5': {
//            animation: '5_play',
//            condition: function (game) {
//              return game.index === 3;
//            }
//          }
//        }
//      };
//      var tileSpriteSheet = createSpriteSheetFromSeq({
//        images: {
//          '2-1': [1, 99],
//          '2-2': [1, 99],
//          '3':   [1, 81],
////          '4-1': [1, 70],
//          '4': [1, 102],
//          '5': [1, 99]
////          '5-2': [1, 90]
//        },
//        frames: {
//          width: 190,
//          height: 190
//        },
//        prefix: 'res/factory-puzzle/'
//      });
//      var specialTileSpriteSheet = createSpriteSheetFromSeq({
//        images: {
//          start: [1, 64],
//          end: [1, 64]
//        },
//        frames: {
//          width: 150,
//          height: 450
//        },
//        prefix: 'res/human-puzzle/'
//      });
//
//      var game = new MazePuzzle('human-canvas', state);
//
//      game.init({
//        start: [50, 90, 150, 450, specialTileSpriteSheet],
//        tiles: [
//          [210, 90, 190, 190, '3', tileSpriteSheet],
//          [410, 90, 190, 190, '2-1', tileSpriteSheet],
//          [210, 350, 190, 190, '4', tileSpriteSheet],
//          [410, 350, 190, 190, '5', tileSpriteSheet, true]
//        ],
//        end: [610, 90, 150, 450, specialTileSpriteSheet]
//      });
//
//      game.on('gameover', function () {
////        window.history.pushState({
////          stageId: manager.stageId,
////          stage: true
////        }, "stage#" + manager.stageId, null);
//        manager.gotoStage(2);
//      });
//
//      game.on('back', function () {
//        stage.game.reset();
//      });
//
//      game.tick();
//
//      stage.game = game;
//    });
//
//    // the human puzzle started.
//    stageManager.on('goto-10', function (evt) {
//      var stage = evt.stage.stage;
//      createjs.Ticker.on("tick", stage);
//    });
//
//    // the human puzzle ended.
//    stageManager.on('goto-10-done', function (evt) {
//      var stage = evt.stage.stage;
//      createjs.Ticker.off("tick", stage);
//    });

//    window.addEventListener('popstate', function (event) {
//      if (event.state && event.state.stage) {
//        stageManager.gotoStage(event.state.stageId);
//      }
//    });
  });

}());
