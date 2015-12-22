!function () {
  var check = ["facebook.com", "twitter.com"].find(function (e) {
    return new RegExp(e).test(location.hostname);
  });

  if (!check) return;

  var time, t, clock, stopMe, sync;
  chrome.storage.sync.get(function (data) {
    (data || (data = {}));
    (data[check] || (data[check] = {}));

    t = today();
    time = data[check][t] || (data.settings && data.settings.allowedTime)|| 1800;
    clock = document.createElement("span");
    clock.className = "socialimiterSpan";
    document.body.appendChild(clock);


    stopMe = setInterval(everyLittleSecond, 1000);
    sync = setInterval(syncData, 2100);
  });

  function everyLittleSecond () {
    if (isNaN(time)) {
      return location.reload();
    }

    if(document.hidden) return;

    if (--time <= 0) {
      createNopeScreen();
      clearInterval(stopMe);
      return clearInterval(sync);
    }

    clock.style.display = "block";
    clock.innerText = intToTime(time) + chrome.i18n.getMessage("left");
  }

  function syncData () {
    if(document.hidden) return;

    chrome.storage.sync.get(function (data) {
      (data || (data = {}));
      (data[check] || (data[check] = {}));

      data[check][t] = time;
      if (!isNaN(time)) {
        chrome.storage.sync.set(data);
      }
    });
  }

  function createNopeScreen () {
    document.body.innerHTML = "";
    var span = document.createElement("span");
    var imagespan = document.createElement("span");
    imagespan.className = "socialimiterNope";
    span.className = "socialimiterText";
    span.innerHTML = chrome.i18n.getMessage("nomore").replace("%%", check.replace(/\.com|www\.|\.net|\.org/, ""));
    document.body.style.backgroundColor = "#e9eaed";
    document.body.appendChild(imagespan);
    document.body.appendChild(span);
  }


  function intToTime (time) {
    if (time <= 0) return "";
    if (time < 60)  return (time | 0) + chrome.i18n.getMessage("seconds");
    if (time < 3600) return (time / 60 | 0) + chrome.i18n.getMessage("minutes") + intToTime(time % 60);
    if (time < 86400) return (time / 3600 | 0) + chrome.i18n.getMessage("hours") + intToTime(time % 3600);
    if (time < 2592000) return (time / 86400 | 0) + chrome.i18n.getMessage("days") + intToTime(time % 86400);
    return (time / 2592000 | 0) + chrome.i18n.getMessage("months") + intToTime(time % 86400);
  }

  function today (x) {
    return (x || Date.now()) / (1000 * 60 * 60 * 24) | 0
  }
}();

