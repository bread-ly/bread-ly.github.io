const html5QrCode = new Html5Qrcode("reader");
const conf = { fps: 10, aspectRatio: 1.0, qrbox: 200 }; //configuration of the camera, 10 frames per second and 1:1 ratio

const showtext = document.getElementById("showtext");
const showdiv = document.getElementById("showdiv");
const readydiv = document.getElementById("readydiv");
const loaddiv = document.getElementById("loaddiv");
const invreadybutton = document.getElementById("inventoryready");
const scanbutton = document.getElementById("scannbutton");
const invbutton = document.getElementById("inventorybutton");
const savebutton = document.getElementById("saveinventory");
const getbutton = document.getElementById("getinventory");
const searchbar = document.getElementsByName("search")[0];
const gobutton = document.getElementById("go");

let obj;
let idold;
let init = true;
let room;
var realdata = [];
var scanneddata = [];
var comparedata = [];
var notrightdata = [];
var zeilenabstand = 7;
var resulte;
let y = zeilenabstand;

const now = new Date();
let date = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();

invreadybutton.style.visibility = "hidden";
saveinventory.style.visibility = "hidden";
getinventory.style.visibility = "hidden";
readydiv.style.height = "0px";
loaddiv.style.height = "0px";

//-------------------Class-for-Camera-----------------------//

class Camera {
    constructor(scanner, config) {
        this.scanner = scanner;
        this.config = config;
        this.ready = false;
    }
    film(succ) {
        this.scanner.start({ facingMode: "environment" }, this.config, succ); //start filming, looking for Scansuccess and config
    }
    stopfilm() {
        this.scanner
            .stop()
            .then((ignore) => {
                //stops the camera
            })
            .catch((err) => {
                // Stop failed, handle it.
            });
        this.scanner.clear(); //clears the scanning area of the box
    }
    dectxt(decodedText) {
        this.text = decodedText;

        let idfirst = decodedText.charAt(0) + decodedText.charAt(1);
        this.group = parseInt(idfirst);

        let idlast = decodedText.charAt(2) + decodedText.charAt(3) + decodedText.charAt(4) + decodedText.charAt(5);
        this.number = parseInt(idlast);
    }
    getid() {
        return this.group + "/" + this.number;
    }
}

//---------------------Class-for-Cookie-Managment---------------------//

class Cookies {
    constructor(name) {
        this.cookiename = name;
    }
    setcookie(value, days) {
        this.cookievalue = value;
        this.cookiedays = days;

        const d = new Date();
        d.setTime(d.getTime() + this.cookiedays * 24 * 60 * 60 * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = this.cookiename + "=" + this.cookievalue + ";" + expires + ";path=/";
    }
    getcookie() {
        let mycookiename = this.cookiename + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(mycookiename) == 0) {
                return c.substring(mycookiename.length, c.length);
            }
        }
        return null;
    }
    checkcookie() {
        let cookiedata = this.getcookie();
        let geturl = new URLSearchParams(window.location.search);
        let link = geturl.get("k");
        if (link == "/init") {
            this.initlinkcookie();
        } else {
            if (cookiedata != null && cookiedata.charAt(0) == "h" && cookiedata.charAt(1) == "t") {
                showdiv.style.height = 0;
                this.loadcookie();
            } else {
                this.initlinkcookie();
            }
        }
    }
    loadcookie() {
        let cookiedata = this.getcookie();
        if (cookiedata != null && cookiedata.charAt(0) == "h" && cookiedata.charAt(1) == "t") {
            var script = document.createElement("script");
            script.onload = function () {
                obj = JSON.parse(data);
            };
            script.src = cookiedata;
            document.getElementsByTagName("head")[0].appendChild(script);
            showdiv.style.height = "fit-content";
            showtext.innerHTML = "Datenbank geladen!";
            console.log(this.getcookie());
        }
    }
    initlinkcookie() {
        showtext.innerHTML = "Bitte Initialisierung durchführen!";
        searchbar.placeholder = "Bitte Link einfügen!";
        document.getElementById("go").onclick = function () {
            initlink();
        };
        const onsuccess = (decodedText, decodedResult) => {
            this.setcookie(decodedText, 1);
            cam.stopfilm();
            this.loadcookie();
        };
        cam.film(onsuccess);
    }
}

class PDF {
    constructor(x, columnspace, organisation) {
        this.pdf = new jsPDF("p", "mm", "a4"); //Portrait und Maßeinheit Millimeter
        this.pdf.setFont("Arial");
        this.pdf.setFontSize(12);
        this.pageheight = this.pdf.internal.pageSize.height;
        this.pagewidth = this.pdf.internal.pageSize.width;
        this.space = columnspace;
        this.xc = x;
        this.pdfnum = 1;
        this.headerspace = 21;
        this.yc = columnspace + this.headerspace;
        this.org = organisation;
        this.date = date;
        this.Header();
    }
    Header() {
        this.pdf.text(this.org, 10, this.headerspace / 2 + 5);
        this.pdf.text("Inventur", this.pagewidth / 2 - 10, this.headerspace / 2 + 5);
        this.pdf.text(this.date, this.pagewidth - this.date.length * 3, this.headerspace / 2 + 5);
    }
    checkforheight() {
        if (this.pageheight - 14 < this.yc) {
            this.pdf.addPage();
            this.Header();
            this.yc = 14 + this.headerspace;
        }
    }
    Write(text) {
        this.checkforheight();
        this.pdf.text(text, this.xc, this.yc);
        this.yc = this.yc + this.space;
    }
    Line() {
        this.pdf.line(5, this.yc - 2, 200, this.yc - 2, "F");
        this.yc = this.yc + this.space;
    }
    Save(name) {
        this.pdf.save(name + this.pdfnum + ".pdf");
        this.pdfnum += 1;
    }
}

//---------------Initialize-Classes-----------------------//

const cam = new Camera(html5QrCode, conf);

const DataBase = new Cookies("database");
DataBase.checkcookie();

const InvScanned = new Cookies("scanneddata");
const InvComp = new Cookies("comparedata");
const InvReal = new Cookies("realdata");

const pdf = new PDF(20, 7, "FF Hohenkogl");

//---------------------Manual-Init-of-Database-----------------------//

function initlink() {
    console.log();
    let text = searchbar.value;
    DataBase.setcookie(text, 1);
    DataBase.loadcookie();
    gobutton.onclick = function () {
        ManualID();
    };
    try {
        cam.stopfilm();
    } catch {}
}

//------------------------Scan-Button-------------------------//

function Scan() {
    try {
        cam.stopfilm();
    } catch {}
    showdiv.style.height = "fit-content";
    showtext.innerHTML = "Bitte einen Barcode Scannen";
    const onsuccess = (decodedText, decodedResult) => {
        cam.dectxt(decodedText);
        resulte = cam.getid();
        cam.stopfilm();
        document.close();
        window.location.replace("showdata.html?k=" + resulte);
    };
    cam.film(onsuccess);
}

//-----------------------Inventory--------------------------//

function Inv() {
    gobutton.onclick = function () {
        manualinv();
    };
    try {
        cam.stopfilm();
    } catch {}
    showinv();
    showdiv.style.height = "fit-content";

    const onsuccess = (decodedText, decodedResult) => {
        cam.dectxt(decodedText);
        id();
    };
    cam.film(onsuccess);
    if (init == true) {
        showtext.innerHTML = "Bitte mit einem Barcode Initialisieren!";
    }
}

function id() {
    if (init == true) {
        init = false;
        scanneddata.push(cam.getid());
        var dat = obj.filter((obj) => obj.invInvNummer === cam.getid());
        room = dat[0].raumName;

        realdata = obj.filter((obj) => obj.raumName === room);

        realdata.forEach((element) => {
            realdata[realdata.indexOf(element)] = element.invInvNummer;
        });

        realdata.forEach((element) => {
            comparedata.push(element);
        });
        showtext.innerHTML = "Raum: " + room;
    } else if (init == false) {
        if (!scanneddata.includes(cam.getid())) {
            scanneddata.push(cam.getid());
            console.log(cam.getid())
            console.log(scanneddata)
        }
        
    }
    Inventoryresult();
}

function manualinv() {
    cam.dectxt(searchbar.value);
    id();
}

//----------------------Change-look-of-site---------------------------//

function showinv() {
    scanbutton.style.visibility = "hidden";
    invreadybutton.style.visibility = "visible";
    saveinventory.style.visibility = "visible";
    getinventory.style.visibility = "visible";
    readydiv.style.height = "fit-content";
    loaddiv.style.height = "fit-content";
    invbutton.style.visibility = "hidden";
}

//----------------------Print-PDF---------------------------//

function InventoryReady() {
    pdf.Write("Inventur in Raum: " + room);
    pdf.Line();

    if (notrightdata.length != 0) {
        pdf.Write("Dinge die hier nicht sein sollten:");
        notrightdata.forEach((element) => {
            var comp = obj.filter((obj) => obj.invInvNummer === element);
            pdf.Write("Nummer: " + comp[0].invInvNummer + " Name: " + comp[0].invName);
        });
        pdf.Line();
    }
    if (comparedata.length != 0) {
        pdf.Write("Nicht eingescannt:");
        comparedata.forEach((element) => {
            var comp = obj.filter((obj) => obj.invInvNummer === element);
            pdf.Write("Nummer: " + comp[0].invInvNummer + " Name: " + comp[0].invName);
        });
    }
    pdf.Save("Inventur-" + room);
}

//---------------------Save-Inventory-Data-in-localStorage----------------------------//

function SaveInventory() {
    showtext.innerHTML = "Daten gespeichert!";

    localStorage.setItem("scanned", scanneddata);
    localStorage.setItem("compare", comparedata);
    localStorage.setItem("real", realdata);
}

//---------------------Get-Inventory-Data----------------------------//

function GetInventory() {
    scanneddata = localStorage.getItem("scanned").split(",");
    comparedata = localStorage.getItem("compare").split(",");
    realdata = localStorage.getItem("real").split(",");

    var dat = obj.filter((obj) => obj.invInvNummer === scanneddata[0]);
    room = dat[0].raumName;

    showtext.innerHTML = "Daten geladen! \n" + room;

    init = false;
    Inventoryresult();
    Inv();
}

//---------------------Show-Inventory-Live-Update----------------------------//

function Inventoryresult() {
    let list = document.getElementById("myList");
    list.innerHTML = "";

    scanneddata.forEach((item) => {
        var resultel = obj.filter((obj) => obj.invInvNummer === item);
        if (comparedata.includes(resultel[0].invInvNummer)) {
            console.log(comparedata)
            comparedata.splice(comparedata.indexOf(resultel[0].invInvNummer), 1);
            console.log(comparedata)
        } else if (!realdata.includes(resultel[0].invInvNummer) && !notrightdata.includes(resultel[0].invInvNummer)) {
            notrightdata.push(resultel[0].invInvNummer);
        }
    });
    notrightdata.forEach((item) => {
        var resultel = obj.filter((obj) => obj.invInvNummer === item);
        let li = document.createElement("li");
        li.classList.add("notinventory");
        li.innerText = "Nummer: " + resultel[0].invInvNummer + "\n" + "Name: " + resultel[0].invName;
        list.appendChild(li);
    });
    comparedata.forEach((element) => {
        var resultel = obj.filter((obj) => obj.invInvNummer === element);
        let li = document.createElement("li");
        li.classList.add("inventory");
        li.innerText = "Nummer: " + resultel[0].invInvNummer + "\n" + "Name: " + resultel[0].invName;
        list.appendChild(li);
    });
}
