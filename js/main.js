var ipv4 = document.getElementById("ipv4");
var ipv6 = document.getElementById("ipv6");

var ipv4copy = document.getElementById("ipv4copy");
var ipv6copy = document.getElementById("ipv6copy");

var logTable = document.getElementById("logTable");

const ipv4url = "https://ip4.ctw.re/";
const ipv6url = "https://ip6.ctw.re/";

function copyToClipboard(elem, v) {
  elem.setAttribute("data-tooltip", "Copied");
  setTimeout(function() {
    elem.setAttribute("data-tooltip", "Copy to clipboard");
  }, 1000);

  if (v == "v4") {
    navigator.clipboard.writeText(ipv4.innerHTML);
  } else {
    navigator.clipboard.writeText(ipv6.innerHTML);
  }
}

function clearLogTable(event) {
  localStorage.removeItem("log");
  toggleModal(event);
  loadLogTable();
}

function updateLogTable() {
  if (ipv4.innerHTML != "" && ipv6.innerHTML != "" && !(ipv4.innerHTML == "Unavailable" && ipv6.innerHTML == "Unavailable")) {
    var logJson = localStorage.getItem("log");
    var timestamp = Date.now();
    var newEntry = {
      "timestamp": timestamp,
      "ipv4": ipv4.innerHTML,
      "ipv6": ipv6.innerHTML
    };
    if (logJson == null) {
      var newArray = [newEntry];
      var newArrayJson = JSON.stringify(newArray);
      localStorage.setItem("log", newArrayJson);
    } else {
      var log = JSON.parse(logJson);
      var lastEntry = log[0];
      if (lastEntry.ipv4 != ipv4.innerHTML || lastEntry.ipv6 != ipv6.innerHTML) {
        log.unshift(newEntry);
      } else {
        log[0] = newEntry;
      }
      var newLogJson = JSON.stringify(log);
      localStorage.setItem("log", newLogJson);
    }
    loadLogTable();
  }
}

function loadLogTable() {
  var logJson = localStorage.getItem("log");
  logTable.innerHTML = "";
  if (logJson != null) {
    var log = JSON.parse(logJson);
    for (var i = 0; i < log.length; i++) {
      var entry = log[i];
      var date = new Date(entry.timestamp);

      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      h = (h < 10) ? "0" + h : h;
      m = (m < 10) ? "0" + m : m;
      s = (s < 10) ? "0" + s : s;
      day = (day < 10) ? "0" + day : day;
      month = (month < 10) ? "0" + month : month;

      var time = h + ":" + m + ":" + s;
      var datee = day + "." + month + "." + year;

      var row = logTable.insertRow();
      var cell = row.insertCell();
      cell.innerHTML = datee + " " + time;

      var cell = row.insertCell();
      cell.innerHTML = entry.ipv4;

      var cell = row.insertCell();
      cell.innerHTML = entry.ipv6;
    }
  }
}

function refresh() {
  ipv4.innerHTML = "";
  ipv6.innerHTML = "";
  ipv4.setAttribute("aria-busy", "true");
  ipv6.setAttribute("aria-busy", "true");
  getIP("v4");
  getIP("v6");
}

function getIP(v) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4) {
      if (v == "v4") {
        ipv4.setAttribute("aria-busy", "false");
      } else {
        ipv6.setAttribute("aria-busy", "false");
      }

      if (xmlHttp.status == 200) {
        if (v == "v4") {
          ipv4.innerHTML = xmlHttp.responseText;
          ipv4copy.style.display = "inline";
        } else {
          ipv6.innerHTML = xmlHttp.responseText;
          ipv6copy.style.display = "inline";
        }
        updateLogTable();
      } else {
        if (v == "v4") {
          ipv4.innerHTML = "Unavailable";
        } else {
          ipv6.innerHTML = "Unavailable";
        }
      }
    }
  }
  if (v == "v4") {
    xmlHttp.open("GET", ipv4url, true);
  } else {
    xmlHttp.open("GET", ipv6url, true);
  }
  xmlHttp.send(null);
}

function periodicUpdate() {
  getIP("v4");
  getIP("v6");
  setTimeout(periodicUpdate, 5000);
}

loadLogTable();
periodicUpdate();
