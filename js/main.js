/*globals StageManager, PuzzleGame */
/*jslint vars: true, plusplus: true */
(function () {
  "use strict";

  window.addEventListener('load', function () {
    var stageManager = new StageManager('stage');

    stageManager.setup(0, function (stage, manager) {
      var startBtn = document.getElementById("start-btn");
      var preview = document.getElementById("preview");

      preview.addEventListener('ended', function () {
        startBtn.classList.remove('hidden');
      });

      startBtn.addEventListener('click', function () {
        manager.nextStage();
      });
    });

    stageManager.setup(1, function (stage, manager) {
      var res = (function () {
        var res = {
          animal:       [1, 61],
          cloud:        [1, 72],
          grass:        [1, 65],
          grass_animal: [1, 65],
          tree:         [1, 66],
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
      var game = new PuzzleGame(stage, res, state);
      game.addStartTile(5, 5, 590, 190);
      game.setupTiles([
        [605,   5, 190, 190, 'cloud'],
        [  5, 205, 190, 190, 'mountain'],
        [205, 205, 190, 190, 'grass'],
        [405, 205, 190, 190, 'grass'],
        [605, 205, 190, 190, 'tree'],
        [  5, 405, 190, 190, 'animal']
      ]);
      game.addEndTile(205, 405, 590, 190);
      game.onGameOver(function () {
        manager.nextStage();
      });
      game.tick();
    });
  });

}());
