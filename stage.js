/*globals initGame */
/*jslint browser: true, vars: true */
(function () {
  "use strict";

  window.addEventListener('load', function () {
    var stage = document.getElementById("stage");
    var startBtn = document.getElementById("start-btn");
    var preview = document.getElementById("preview");

    preview.addEventListener("ended", function () {
      startBtn.classList.remove('hidden');
    });

    startBtn.addEventListener("click", function () {
      stage.className = "state-1";
      initGame(function () {
        console.log('a');
      	stage.className = 'state-2';
      });
    });
  });

}());
