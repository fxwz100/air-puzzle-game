/*globals createjs */
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
    
    var StageManagerClass = StageManager.prototype;
    
    /** Dispatch a specific type of event. */
    function dispatchEvent(dispatcher, type, stage) {
      var event = dispatchEvent.event;
      event.type = type;
      event.target = dispatcher;
      event.currentTarget = dispatcher;
      event.stage = stage;
      dispatcher.dispatchEvent(event);
    }
    dispatchEvent.event = new Object;
    
    createjs.EventDispatcher.initialize(StageManagerClass);

    StageManagerClass.nextStage = function () {
      var stageId = this.stageId + 1;
      this.gotoStage(stageId);
    };

    StageManagerClass.prevStage = function () {
      var stageId = this.stageId - 1;
      this.gotoStage(stageId);
    };

    StageManagerClass.gotoStage = function (i) {
      dispatchEvent(this, 'goto-' + this.stageId + '-done', this.stages[this.stageId]);
      this.container.dataset.state = this.stageId = i;
      dispatchEvent(this, 'goto-' + i, this.stages[i]);
    };

    StageManagerClass.setup = function (i, func) {
      func(this.stages[i], this);
    };

    return StageManager;
  }());

  exports.StageManager = StageManager;

}(window));
