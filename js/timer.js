/** Trickster Timer.
 * config: configuration, or TricksterDefaultConfig to get the defaults
 * functions: override helper functions
 */
var TricksterTimer = function(config,functions) {
  var start = (new Date()).getTime();
  var pauseTime = null;
  var running = false;
  var paused  = false;

  function pad(num) {
    if (num < 10) {
      return "0" + num;
    }
    else {
      return num;
    }
  }

  function tick() {
    if (!paused) {
      var now      = (new Date()).getTime();
      var diff     = (now - start) / 1000;
      var diffMins = diff / 60;
      var hour     = Math.floor(diff / (60 * 60));
      var minute   = pad((Math.floor(diff / 60) % 60));
      var second   = pad(Math.floor(diff % 60));

      $("#hour").text(hour);
      $("#minute").text(minute);
      $("#second").text(second);

      $("#timer").removeClass("time-ok");
      $("#timer").removeClass("time-over");
      $("#timer").removeClass("time-alert");
      $("#timer").removeClass("time-warn");
      if (diffMins >= config.lengthMinutes) {
        $("#timer").addClass("time-over");
      }
      else if (diffMins >= config.lengthAlertAt) {
        $("#timer").addClass("time-alert");
      }
      else if (diffMins >= config.lengthWarnAt) {
        $("#timer").addClass("time-warn");
      }
      else {
        $("#timer").addClass("time-ok");
      }
    }

    if (running) {
      window.setTimeout(tick,1000);
    }
    else {
      $("#hour").text("0");
      $("#minute").text("00");
      $("#second").text("00");
    }
  }

  function stop() {
    running = false;
    paused = false;
    $("#pause").hide();
    $("#play").show();
  }

  function pause() {
    paused = true;
    pauseTime = (new Date()).getTime();
    $("#play").show();
    $("#pause").hide();
  }

  function play() {
    if (paused) {
      var timePaused = (new Date()).getTime() - pauseTime;
      start += timePaused;
    }
    paused = false
    $("#play").hide();
    $("#pause").show();
    if (!running) {
      start = (new Date()).getTime();
      running = true;
      tick();
    }
  }

  return {
    setup: function() { 
      $("#stop").show();
      $("#play").show();
      $("#pause").hide();
    },
    play: play,
    pause: pause,
    stop: stop
  };
};
