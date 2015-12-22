function domLoaded () {
  var objects = document.getElementsByTagName('html');
  for (var j = 0; j < objects.length; j++) {
    var obj = objects[j];

    var valStrH = obj.innerHTML.toString();
    var valNewH = valStrH.replace(/__MSG_(\w+)__/g, function (match, v1) {
      return v1 ? chrome.i18n.getMessage(v1) : "";
    });

    if (valNewH != valStrH) {
      obj.innerHTML = valNewH;
    }
  }

  chrome.storage.sync.get(function (e) {
    (e || (e = {}));
    (e.settings || (e.settings = {}));

    var sub = document.getElementById("allowedTimeSub");
    var allowedTime = document.getElementById("allowedTime");
    allowedTime.value = e.settings.allowedTime || 1800;
    allowedTime.onchange = allowedTime.onkeyup = function () {
      sub.innerText = intToTime(+allowedTime.value);
      if (+allowedTime.value > 86400) {
        sub.innerText = chrome.i18n.getMessage("tooBig");
      }

      if (+allowedTime.value < 60) {
        sub.innerText = chrome.i18n.getMessage("tooSmall");
      }
    };

    allowedTime.onkeyup();

    var save = document.getElementById("save");
    save.onclick = function (e) {
      e.preventDefault();

      if (+allowedTime.value > 86400) {
        return save.style.backgroundColor = "orange";
      }

      if (+allowedTime.value < 60) {
        return save.style.backgroundColor = "orange";
      }

      chrome.storage.sync.get(function (e) {
        (e || (e = {}));
        (e.settings || (e.settings = {}));

        e.settings.allowedTime = +allowedTime.value;
        chrome.storage.sync.set(e);
        save.style.backgroundColor = "green";
        setTimeout(function() {
          save.style.backgroundColor = "";
        }, 1000);
      });
    };

    var resetSites = document.getElementById("resetSites");
    resetSites.onclick = function (e) {
      e.preventDefault();

      chrome.storage.sync.clear();
      save.onclick(e);
      resetSites.style.backgroundColor = "green";
      setTimeout(function() {
        resetSites.style.backgroundColor = "";
      }, 1000);
    };


  });
}
document.addEventListener('DOMContentLoaded', domLoaded);

function intToTime (time) {
  if (time <= 0) return "";
  if (time < 60)  return (time | 0) + chrome.i18n.getMessage("seconds");
  if (time < 3600) return (time / 60 | 0) + chrome.i18n.getMessage("minutes") + intToTime(time % 60);
  if (time < 86400) return (time / 3600 | 0) + chrome.i18n.getMessage("hours") + intToTime(time % 3600);
  if (time < 2592000) return (time / 86400 | 0) + chrome.i18n.getMessage("days") + intToTime(time % 86400);
  return (time / 2592000 | 0) + chrome.i18n.getMessage("months") + intToTime(time % 86400);
}
