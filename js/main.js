/*globals StageManager, PuzzleGame, createjs */
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
          animal:       [1, 196],
          animal_grass: [1, 130],
          cloud:        [1, 170],
          grass:        [1, 150],
          mountain:     [1, 115],
          rabbit:       [1, 200],
          tree:         [1, 200],
          water:        [1, 190],
          water_sheep:  [1, 200],
          water_tree:   [1,  66]
        };

        var images = Object.keys(res).map(function (name) {
          var r = res[name], l = [], i;
          for (i = r[0]; i <= r[1]; i++) {
            l.push('res/puzzle-1/' + name + '/' + i + '.jpg');
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
      var tileSpriteSheet = new createjs.SpriteSheet({
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
      var specialTileSpriteSheet = new createjs.SpriteSheet({
        images: ["res/puzzle-1/start/1.jpg","res/puzzle-1/start/2.jpg","res/puzzle-1/start/3.jpg","res/puzzle-1/start/4.jpg","res/puzzle-1/start/5.jpg","res/puzzle-1/start/6.jpg","res/puzzle-1/start/7.jpg","res/puzzle-1/start/8.jpg","res/puzzle-1/start/9.jpg","res/puzzle-1/start/10.jpg","res/puzzle-1/start/11.jpg","res/puzzle-1/start/12.jpg","res/puzzle-1/start/13.jpg","res/puzzle-1/start/14.jpg","res/puzzle-1/start/15.jpg","res/puzzle-1/start/16.jpg","res/puzzle-1/start/17.jpg","res/puzzle-1/start/18.jpg","res/puzzle-1/start/19.jpg","res/puzzle-1/start/20.jpg","res/puzzle-1/start/21.jpg","res/puzzle-1/start/22.jpg","res/puzzle-1/start/23.jpg","res/puzzle-1/start/24.jpg","res/puzzle-1/start/25.jpg","res/puzzle-1/start/26.jpg","res/puzzle-1/start/27.jpg","res/puzzle-1/start/28.jpg","res/puzzle-1/start/29.jpg","res/puzzle-1/start/30.jpg","res/puzzle-1/start/31.jpg","res/puzzle-1/start/32.jpg","res/puzzle-1/start/33.jpg","res/puzzle-1/start/34.jpg","res/puzzle-1/start/35.jpg","res/puzzle-1/start/36.jpg","res/puzzle-1/start/37.jpg","res/puzzle-1/start/38.jpg","res/puzzle-1/start/39.jpg","res/puzzle-1/start/40.jpg","res/puzzle-1/start/41.jpg","res/puzzle-1/start/42.jpg","res/puzzle-1/start/43.jpg","res/puzzle-1/start/44.jpg","res/puzzle-1/start/45.jpg","res/puzzle-1/start/46.jpg","res/puzzle-1/start/47.jpg","res/puzzle-1/start/48.jpg","res/puzzle-1/start/49.jpg","res/puzzle-1/start/50.jpg","res/puzzle-1/start/51.jpg","res/puzzle-1/start/52.jpg","res/puzzle-1/start/53.jpg","res/puzzle-1/start/54.jpg","res/puzzle-1/start/55.jpg","res/puzzle-1/start/56.jpg","res/puzzle-1/start/57.jpg","res/puzzle-1/start/58.jpg","res/puzzle-1/start/59.jpg","res/puzzle-1/start/60.jpg","res/puzzle-1/start/61.jpg","res/puzzle-1/start/62.jpg","res/puzzle-1/start/63.jpg","res/puzzle-1/start/64.jpg","res/puzzle-1/start/65.jpg","res/puzzle-1/start/66.jpg","res/puzzle-1/start/67.jpg","res/puzzle-1/start/68.jpg","res/puzzle-1/start/69.jpg","res/puzzle-1/start/70.jpg","res/puzzle-1/start/71.jpg","res/puzzle-1/start/72.jpg","res/puzzle-1/start/73.jpg","res/puzzle-1/start/74.jpg","res/puzzle-1/start/75.jpg","res/puzzle-1/start/76.jpg","res/puzzle-1/start/77.jpg","res/puzzle-1/start/78.jpg","res/puzzle-1/start/79.jpg","res/puzzle-1/start/80.jpg","res/puzzle-1/start/81.jpg","res/puzzle-1/start/82.jpg","res/puzzle-1/start/83.jpg","res/puzzle-1/start/84.jpg","res/puzzle-1/start/85.jpg","res/puzzle-1/start/86.jpg","res/puzzle-1/start/87.jpg","res/puzzle-1/start/88.jpg","res/puzzle-1/start/89.jpg","res/puzzle-1/start/90.jpg","res/puzzle-1/start/91.jpg","res/puzzle-1/start/92.jpg","res/puzzle-1/start/93.jpg","res/puzzle-1/start/94.jpg","res/puzzle-1/start/95.jpg","res/puzzle-1/start/96.jpg","res/puzzle-1/start/97.jpg","res/puzzle-1/start/98.jpg","res/puzzle-1/start/99.jpg","res/puzzle-1/start/100.jpg","res/puzzle-1/start/101.jpg","res/puzzle-1/start/102.jpg","res/puzzle-1/start/103.jpg","res/puzzle-1/start/104.jpg","res/puzzle-1/start/105.jpg","res/puzzle-1/start/106.jpg","res/puzzle-1/start/107.jpg","res/puzzle-1/start/108.jpg","res/puzzle-1/start/109.jpg","res/puzzle-1/start/110.jpg","res/puzzle-1/start/111.jpg","res/puzzle-1/start/112.jpg","res/puzzle-1/start/113.jpg","res/puzzle-1/start/114.jpg","res/puzzle-1/start/115.jpg","res/puzzle-1/start/116.jpg","res/puzzle-1/start/117.jpg","res/puzzle-1/start/118.jpg","res/puzzle-1/start/119.jpg","res/puzzle-1/start/120.jpg","res/puzzle-1/start/121.jpg","res/puzzle-1/start/122.jpg","res/puzzle-1/start/123.jpg","res/puzzle-1/start/124.jpg","res/puzzle-1/start/125.jpg","res/puzzle-1/start/126.jpg","res/puzzle-1/start/127.jpg","res/puzzle-1/start/128.jpg","res/puzzle-1/start/129.jpg","res/puzzle-1/start/130.jpg","res/puzzle-1/start/131.jpg","res/puzzle-1/start/132.jpg","res/puzzle-1/start/133.jpg","res/puzzle-1/start/134.jpg","res/puzzle-1/start/135.jpg","res/puzzle-1/start/136.jpg","res/puzzle-1/start/137.jpg","res/puzzle-1/start/138.jpg","res/puzzle-1/start/139.jpg","res/puzzle-1/start/140.jpg","res/puzzle-1/start/141.jpg","res/puzzle-1/start/142.jpg","res/puzzle-1/start/143.jpg","res/puzzle-1/start/144.jpg","res/puzzle-1/start/145.jpg","res/puzzle-1/start/146.jpg","res/puzzle-1/start/147.jpg","res/puzzle-1/start/148.jpg","res/puzzle-1/start/149.jpg","res/puzzle-1/start/150.jpg","res/puzzle-1/end/1.jpg","res/puzzle-1/end/2.jpg","res/puzzle-1/end/3.jpg","res/puzzle-1/end/4.jpg","res/puzzle-1/end/5.jpg","res/puzzle-1/end/6.jpg","res/puzzle-1/end/7.jpg","res/puzzle-1/end/8.jpg","res/puzzle-1/end/9.jpg","res/puzzle-1/end/10.jpg","res/puzzle-1/end/11.jpg","res/puzzle-1/end/12.jpg","res/puzzle-1/end/13.jpg","res/puzzle-1/end/14.jpg","res/puzzle-1/end/15.jpg","res/puzzle-1/end/16.jpg","res/puzzle-1/end/17.jpg","res/puzzle-1/end/18.jpg","res/puzzle-1/end/19.jpg","res/puzzle-1/end/20.jpg","res/puzzle-1/end/21.jpg","res/puzzle-1/end/22.jpg","res/puzzle-1/end/23.jpg","res/puzzle-1/end/24.jpg","res/puzzle-1/end/25.jpg","res/puzzle-1/end/26.jpg","res/puzzle-1/end/27.jpg","res/puzzle-1/end/28.jpg","res/puzzle-1/end/29.jpg","res/puzzle-1/end/30.jpg","res/puzzle-1/end/31.jpg","res/puzzle-1/end/32.jpg","res/puzzle-1/end/33.jpg","res/puzzle-1/end/34.jpg","res/puzzle-1/end/35.jpg","res/puzzle-1/end/36.jpg","res/puzzle-1/end/37.jpg","res/puzzle-1/end/38.jpg","res/puzzle-1/end/39.jpg","res/puzzle-1/end/40.jpg","res/puzzle-1/end/41.jpg","res/puzzle-1/end/42.jpg","res/puzzle-1/end/43.jpg","res/puzzle-1/end/44.jpg","res/puzzle-1/end/45.jpg","res/puzzle-1/end/46.jpg","res/puzzle-1/end/47.jpg","res/puzzle-1/end/48.jpg","res/puzzle-1/end/49.jpg","res/puzzle-1/end/50.jpg","res/puzzle-1/end/51.jpg","res/puzzle-1/end/52.jpg","res/puzzle-1/end/53.jpg","res/puzzle-1/end/54.jpg","res/puzzle-1/end/55.jpg","res/puzzle-1/end/56.jpg","res/puzzle-1/end/57.jpg","res/puzzle-1/end/58.jpg","res/puzzle-1/end/59.jpg","res/puzzle-1/end/60.jpg","res/puzzle-1/end/61.jpg","res/puzzle-1/end/62.jpg","res/puzzle-1/end/63.jpg","res/puzzle-1/end/64.jpg","res/puzzle-1/end/65.jpg","res/puzzle-1/end/66.jpg","res/puzzle-1/end/67.jpg","res/puzzle-1/end/68.jpg","res/puzzle-1/end/69.jpg","res/puzzle-1/end/70.jpg","res/puzzle-1/end/71.jpg","res/puzzle-1/end/72.jpg","res/puzzle-1/end/73.jpg","res/puzzle-1/end/74.jpg","res/puzzle-1/end/75.jpg","res/puzzle-1/end/76.jpg","res/puzzle-1/end/77.jpg","res/puzzle-1/end/78.jpg","res/puzzle-1/end/79.jpg","res/puzzle-1/end/80.jpg","res/puzzle-1/end/81.jpg","res/puzzle-1/end/82.jpg","res/puzzle-1/end/83.jpg","res/puzzle-1/end/84.jpg","res/puzzle-1/end/85.jpg","res/puzzle-1/end/86.jpg","res/puzzle-1/end/87.jpg","res/puzzle-1/end/88.jpg","res/puzzle-1/end/89.jpg","res/puzzle-1/end/90.jpg","res/puzzle-1/end/91.jpg","res/puzzle-1/end/92.jpg","res/puzzle-1/end/93.jpg","res/puzzle-1/end/94.jpg","res/puzzle-1/end/95.jpg","res/puzzle-1/end/96.jpg","res/puzzle-1/end/97.jpg","res/puzzle-1/end/98.jpg","res/puzzle-1/end/99.jpg","res/puzzle-1/end/100.jpg","res/puzzle-1/end/101.jpg","res/puzzle-1/end/102.jpg","res/puzzle-1/end/103.jpg","res/puzzle-1/end/104.jpg","res/puzzle-1/end/105.jpg","res/puzzle-1/end/106.jpg","res/puzzle-1/end/107.jpg","res/puzzle-1/end/108.jpg","res/puzzle-1/end/109.jpg","res/puzzle-1/end/110.jpg","res/puzzle-1/end/111.jpg","res/puzzle-1/end/112.jpg","res/puzzle-1/end/113.jpg","res/puzzle-1/end/114.jpg","res/puzzle-1/end/115.jpg","res/puzzle-1/end/116.jpg","res/puzzle-1/end/117.jpg","res/puzzle-1/end/118.jpg","res/puzzle-1/end/119.jpg","res/puzzle-1/end/120.jpg","res/puzzle-1/end/121.jpg","res/puzzle-1/end/122.jpg","res/puzzle-1/end/123.jpg","res/puzzle-1/end/124.jpg","res/puzzle-1/end/125.jpg","res/puzzle-1/end/126.jpg","res/puzzle-1/end/127.jpg","res/puzzle-1/end/128.jpg","res/puzzle-1/end/129.jpg","res/puzzle-1/end/130.jpg","res/puzzle-1/end/131.jpg","res/puzzle-1/end/132.jpg","res/puzzle-1/end/133.jpg","res/puzzle-1/end/134.jpg","res/puzzle-1/end/135.jpg","res/puzzle-1/end/136.jpg","res/puzzle-1/end/137.jpg","res/puzzle-1/end/138.jpg","res/puzzle-1/end/139.jpg","res/puzzle-1/end/140.jpg","res/puzzle-1/end/141.jpg","res/puzzle-1/end/142.jpg","res/puzzle-1/end/143.jpg","res/puzzle-1/end/144.jpg","res/puzzle-1/end/145.jpg","res/puzzle-1/end/146.jpg","res/puzzle-1/end/147.jpg","res/puzzle-1/end/148.jpg","res/puzzle-1/end/149.jpg","res/puzzle-1/end/150.jpg","res/puzzle-1/end/151.jpg","res/puzzle-1/end/152.jpg","res/puzzle-1/end/153.jpg","res/puzzle-1/end/154.jpg","res/puzzle-1/end/155.jpg","res/puzzle-1/end/156.jpg","res/puzzle-1/end/157.jpg","res/puzzle-1/end/158.jpg","res/puzzle-1/end/159.jpg","res/puzzle-1/end/160.jpg","res/puzzle-1/end/161.jpg","res/puzzle-1/end/162.jpg","res/puzzle-1/end/163.jpg","res/puzzle-1/end/164.jpg","res/puzzle-1/end/165.jpg","res/puzzle-1/end/166.jpg","res/puzzle-1/end/167.jpg","res/puzzle-1/end/168.jpg","res/puzzle-1/end/169.jpg","res/puzzle-1/end/170.jpg","res/puzzle-1/end/171.jpg","res/puzzle-1/end/172.jpg","res/puzzle-1/end/173.jpg","res/puzzle-1/end/174.jpg","res/puzzle-1/end/175.jpg","res/puzzle-1/end/176.jpg","res/puzzle-1/end/177.jpg","res/puzzle-1/end/178.jpg","res/puzzle-1/end/179.jpg","res/puzzle-1/end/180.jpg","res/puzzle-1/end/181.jpg","res/puzzle-1/end/182.jpg","res/puzzle-1/end/183.jpg","res/puzzle-1/end/184.jpg","res/puzzle-1/end/185.jpg","res/puzzle-1/end/186.jpg","res/puzzle-1/end/187.jpg","res/puzzle-1/end/188.jpg","res/puzzle-1/end/189.jpg","res/puzzle-1/end/190.jpg","res/puzzle-1/end/191.jpg","res/puzzle-1/end/192.jpg","res/puzzle-1/end/193.jpg","res/puzzle-1/end/194.jpg","res/puzzle-1/end/195.jpg","res/puzzle-1/end/196.jpg","res/puzzle-1/end/197.jpg","res/puzzle-1/end/198.jpg","res/puzzle-1/end/199.jpg","res/puzzle-1/end/200.jpg","res/puzzle-1/end/201.jpg"],
        frames: {
          "regX": 0,
          "regY": 0,
          "count": 351,
          "height": 190,
          "width": 590
        },
        animations: {
          'start_start': 0,
          'start_play': [0, 149, 'start_end'],
          'start_end': 149,
          'end_start': 150,
          'end_play': [150, 350, 'end_end'],
          'end_end': 350
        },
        framerate: 24
      });
      var game = new PuzzleGame('puzzle-1-canvas', state);
      game.init({
        start: [5, 5, 590, 190, specialTileSpriteSheet],
        tiles: [
          [605,   5, 190, 190, 'cloud', tileSpriteSheet],
          [  5, 205, 190, 190, 'mountain', tileSpriteSheet],
          [205, 205, 190, 190, 'water', tileSpriteSheet],
          [405, 205, 190, 190, 'grass', tileSpriteSheet],
          [605, 205, 190, 190, 'tree', tileSpriteSheet],
          [  5, 405, 190, 190, 'animal', tileSpriteSheet]
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
