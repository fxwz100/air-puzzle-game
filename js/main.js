/*globals StageManager, PuzzleGame */
/*jslint vars: true, plusplus: true */
(function () {
  "use strict";

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
      });
    });

    // the puzzle game.
    stageManager.setup(1, function (stage, manager) {
      var tips = document.querySelector('.puzzle-1.stage .tips');
      setTimeout(function () {
        tips.style.display = 'none';
      }, 10000);
      tips.addEventListener('click', function () {
        tips.style.display = 'none';
      });

      var res = (function () {
        var res = {
          animal:       [1, 61],
          cloud:        [1, 72],
          grass:        [1, 150],
          grass_animal: [1, 65],
          tree:         [1, 200],
          tree_animal:  [1, 66],
          water_animal: [1, 50],
          mountain:     [1, 128]
        };

        var images = Object.keys(res).map(function (name) {
          var r = res[name], l = [], i;
          for (i = r[0]; i <= r[1]; i++) {
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

        return {
          images: {
            list: images,
            width: 190,
            height: 190
          },
          animations: animations
        };
      }());
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
      var game = new PuzzleGame('puzzle-1-canvas', res, state);
      game.init({
        start: [5, 5, 590, 190],
        tiles: [
          [605,   5, 190, 190, 'cloud'],
          [  5, 205, 190, 190, 'mountain'],
          [205, 205, 190, 190, 'grass'],
          [405, 205, 190, 190, 'grass'],
          [605, 205, 190, 190, 'tree'],
          [  5, 405, 190, 190, 'animal']
        ],
        end: [205, 405, 590, 190]
      });
      game.on('gameover', function () {
        window.history.pushState({
          stageId: manager.stageId,
          stage: true
        }, "stage#" + manager.stageId, null);
        manager.nextStage();
      });
      game.on('back', function () {
        manager.prevStage();
      });
      game.tick();

      stage.game = game;
    });

    stageManager.setup(1, function (stage, manager) {
      stage.game.reset();
    }, true);

    // the transition screen and start.
    stageManager.setup(2, function (stage, manager) {
      var video = document.getElementById('transition-video');
      video.play();
      video.addEventListener('ended', function () {
        video.style.display = 'none';
      });
    }, true);

    // the leaf puzzle.
    stageManager.setup(3, function (stage, manager) {
    }, true);

    // the organ puzzle.
    stageManager.setup(4, function (stage, manager) {
    }, true);

    window.addEventListener('popstate', function (event) {
      if (event.state && event.state.stage) {
        stageManager.gotoStage(event.state.stageId);
      }
    });
  });

}());
