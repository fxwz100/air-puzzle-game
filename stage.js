/*jslint browser: true, vars: true */
(function () {
  "use strict";

  window.addEventListener('load', function () {
    var stage = document.getElementById("stage");
    var startBtn = document.getElementById("start-btn");

    startBtn.addEventListener("click", function () {
      stage.className = "state-1";
    });
  });

}());
