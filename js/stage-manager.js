/*globals PuzzleGame */
/*jslint browser: true, vars: true, plusplus: true */
(function (exports) {
  "use strict";

  /**
   * Stage Manager - a stage manager to use with CSS 3 animation to switch.
   */

  var StageManager = (function () {
    function StageManager(id) {
      if (typeof id === 'string') {
        this.container = document.getElementById(id);
      } else {
        // try to setup the element.
        this.container = id;
      }
      this.container.dataset.state = this.stageId = 0;
      this.stages = this.container.getElementsByClassName('stage');
      this.stageListeners = {};
    }

    StageManager.prototype.nextStage = function () {
      var stageId = this.stageId + 1;
      this.gotoStage(stageId);
    };

    StageManager.prototype.prevStage = function () {
      var stageId = this.stageId - 1;
      this.gotoStage(stageId);
    };

    StageManager.prototype.gotoStage = function (i) {
      this.stageId = i;
      this.container.dataset.state = this.stageId;
      if (this.stageListeners[i]) {
        var manager = this;
        this.stageListeners[i].forEach(function (listener) {
          listener(manager.stages[i], manager);
        });
      }
    };

    StageManager.prototype.setup = function (i, func, lazy) {
      if (lazy) {
        if (this.stageListeners[i]) {
          this.stageListeners[i].push(func);
        } else {
          this.stageListeners[i] = [func];
        }
      } else {
        func(this.stages[i], this);
      }
    };

    return StageManager;
  }());

  exports.StageManager = StageManager;

}(window));
