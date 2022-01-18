const pdf = new jsPDF("p", "mm", "a4"); //Portrait und Maßeinheit Millimeter
pdf.setFont("Arial");
pdf.setFontSize(12);

const html5QrCode = new Html5Qrcode("reader"); //create a scan-element
const config = { fps: 10, aspectRatio: 1.0, qrbox: 200 }; //configuration of the camera, 10 frames per second and 1:1 ratio

const showtext = document.getElementById("showtext");
const showdiv = document.getElementById("showdiv");
const readydiv = document.getElementById("readydiv");
const invreadybutton = document.getElementById("inventoryready");
const scanbutton = document.getElementById("scannbutton");
const invbutton = document.getElementById("inventorybutton");

checkCookie();

var obj = "";
var init;
var realdata = [];
var scanneddata = [];
var comparedata = [];
var notrightdata = [];
var zeilenabstand = 7;

var resulte;

invreadybutton.style.visibility = "hidden";
saveinventory.style.visibility = "hidden";
readydiv.style.height = 0;

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

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

function checkCookie() {
    let link = getCookie("database");
    if (link != null && link.charAt(0) == "h" && link.charAt(1) == "t") {
        loadData(link);
        showdiv.style.height = 0;
    } else {
        showtext.innerHTML = "Bitte Initialisierung durchführen!";
        html5QrCode.start({ facingMode: "environment" }, config, onCokkieSuccess); //start filming, looking for Scansuccess and config
    }
}

function loadData(datalink) {
    var script = document.createElement("script");
    script.onload = function () {
        obj = JSON.parse(data);
    };
    script.src = datalink;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function onCokkieSuccess(decodedText, decodedresult) {
    if (decodedText.charAt(0) == "h" && decodedText.charAt(1) == "t") {
        showtext.innerHTML = "";
        setCookie("database", decodedText, 1);
        StopFilming();
        checkCookie();
    }
}

function StartScanner() {
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess); //start filming, looking for Scansuccess and config
}

function StopFilming() {
    html5QrCode
        .stop()
        .then((ignore) => {
            //stops the camera
        })
        .catch((err) => {
            // Stop failed, handle it.
        });
    html5QrCode.clear(); //clears the scanning area of the box
}

function onScanSuccess(decodedText, decodedresult) {
    if (decodedText != null) {
        var idfirst = decodedText.charAt(0) + decodedText.charAt(1);
        var idlast = decodedText.charAt(2) + decodedText.charAt(3) + decodedText.charAt(4) + decodedText.charAt(5);
        console.log(getid(parseInt(idfirst), parseInt(idlast)));
        resulte = getid(parseInt(idfirst), parseInt(idlast));
    }
    ShowResult();
}

function ShowResult() {
    document.close();
    window.location.replace("showdata.html?k=" + resulte);
}

function StartInventory() {
    scanbutton.style.visibility = "hidden";
    invreadybutton.style.visibility = "visible";
    readydiv.style.height = "fit-content";
    invbutton.style.visibility = "hidden";
    showtext.innerHTML = "Initialisieren:";
    html5QrCode.start({ facingMode: "environment" }, config, onSuccess); //start filming, looking for Scansuccess and config
    init = "true";
}

function InventoryReady() {
    pdf.text("Dinge die hier nicht hergehören:", 10, zeilenabstand);
    notrightdata.forEach((element) => {
        pdf.text("Nummer: " + element + " Name: " + obj.id[element].invName, 10, zeilenabstand * (notrightdata.indexOf(element) + 2));
    });
    pdf.line(5, (notrightdata.length + 2) * zeilenabstand, 200, (notrightdata.length + 2) * zeilenabstand, "F");
    pdf.text("Dinge die fehlen:", 10, (notrightdata.length + 3) * zeilenabstand);
    comparedata.forEach((element) => {
        pdf.text("Nummer: " + element + " Name: " + obj.id[element].invName, 10, (notrightdata.length + 4) * zeilenabstand + zeilenabstand * comparedata.indexOf(element));
    });
    pdf.save("inventur.pdf");
}

function SaveInventory() {
    asdf;
}

function getid(gr, numb) {
    return gr + "/" + numb;
}

function onSuccess(decodedText, decodedresult) {
    if (init === "true") {
        init = "false";

        console.log(decodedText);
        var group = decodedText.charAt(0) + decodedText.charAt(1);
        group = parseInt(group);

        var idlast = decodedText.charAt(2) + decodedText.charAt(3) + decodedText.charAt(4) + decodedText.charAt(5);
        number = parseInt(idlast);

        showdiv.style.height = "fit-content";

        var room = obj.id[getid(group, number)].raumName;

        for (gr = 1; gr < 16; gr++) {
            for (numb = 1; numb < 10000; numb++) {
                try {
                    if ((obj.id[getid(gr, numb)].raumName = room)) {
                        if (!realdata.includes(getid(gr, numb))) {
                            realdata.push(getid(gr, numb));
                        }
                    }
                } catch (error) {}
            }
        }
        realdata.forEach((element) => {
            comparedata.push(element);
        });
        if (decodedText != null && decodedText != NaN && !scanneddata.includes(getid(group, number))) {
            scanneddata.push(getid(group, number));
        }
        Inventoryresult();
    } else {
        showtext.innerHTML = "Scannen:";
        if (decodedText != null && decodedText != NaN && !scanneddata.includes(getid(group, number))) {
            scanneddata.push(getid(group, number));
        }
        Inventoryresult();
    }
}

function Inventoryresult() {
    let list = document.getElementById("myList");
    list.innerHTML = "";
    scanneddata.forEach((item) => {
        if (comparedata.includes(item)) {
            comparedata.splice(comparedata.indexOf(item), 1);
        } else if (!realdata.includes(item) && !notrightdata.includes(item)) {
            notrightdata.push(item);
        }
    });
    notrightdata.forEach((item) => {
        let li = document.createElement("li");
        li.classList.add("notinventory");
        li.innerText = "Nummer: " + item + "\n" + "Name: " + obj.id[item].invName;
        list.appendChild(li);
    });
    comparedata.forEach((element) => {
        let li = document.createElement("li");
        li.classList.add("inventory");
        li.innerText = "Nummer: " + element + "\n" + "Name: " + obj.id[element].invName;
        list.appendChild(li);
    });
}
