var databaselink = getCookie("database");
loadData(databaselink);
var obj = "";

const geturl = new URLSearchParams(window.location.search);
const scannedid = geturl.get("k");

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function loadData(datalink) {
    var script = document.createElement("script");
    script.onload = function () {
        obj = JSON.parse(data);
        output(obj);
    };
    script.src = datalink;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function ScanPage() {
    document.close();
    window.location.replace("index.html?scanned=true");
}

function output(object) {
    document.getElementById("id").innerHTML = scannedid;
    document.getElementById("showname").innerHTML = object.id[scannedid].name + "<br>";
    document.getElementById("showlocation").innerHTML = object.id[scannedid].ort + "<br>";
}
