var databaselink = getCookie("database");
loadData(databaselink);
let obj;

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

function output(object) {

    var data = object.filter(object=> object.invInvNummer === scannedid)

    document.getElementById("id").innerHTML = scannedid;
    document.getElementById("showname").innerHTML = data[0].invName + "<br>";
    document.getElementById("showlocation").innerHTML = data[0].raumName + "<br>";
    document.getElementById("memberid").innerHTML = data[0].mitNr + "<br>";
    document.getElementById("memberfirst").innerHTML = data[0].mitVorname + "<br>";
    document.getElementById("membersecond").innerHTML = data[0].mitNachname + "<br>";
    document.getElementById("auditable").innerHTML = data[0].invPrüfPflichtig + "<br>";
    document.getElementById("buildat").innerHTML = data[0].invBaujahr + "<br>";
}
