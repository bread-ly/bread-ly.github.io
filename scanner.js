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

        let idlast = decodedText.charAt(3) + decodedText.charAt(4) + decodedText.charAt(5) + decodedText.charAt(6);
        this.number = parseInt(idlast);
    }
    getid() {
        return this.group + "/" + this.number;
    }
    gettext() {
        return this.text;
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
        if(link == "/init")
        {this.initlinkcookie()}
        else{
            if (cookiedata != null && cookiedata.charAt(0) == "h" && cookiedata.charAt(1) == "t") {
                showdiv.style.height = 0;
                this.loadcookie();
            } else {
                this.initlinkcookie()
            }
        }
    }
    loadcookie() {
        let cookiedata = this.getcookie();
        if (cookiedata != null && cookiedata.charAt(0) == "h" && cookiedata.charAt(1) == "t") {
            var script = document.createElement("script");
            script.onload = function () {
                obj = JSON.parse(datasas);
            };
            script.src = cookiedata;
            document.getElementsByTagName("head")[0].appendChild(script);
            showdiv.style.height = "fit-content";
            showtext.innerHTML = "Datenbank geladen!";
        }
    }
    initlinkcookie(){
        showtext.innerHTML = "Bitte Initialisierung durchführen!";
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

//------------------------Scan-Button-------------------------//

function Scan() {
    try {
        cam.stopfilm();
    } catch {}
    showdiv.style.height = "fit-content";
    showtext.innerHTML = "Bitte einen Barcode Scannen";
    const onsuccess = (decodedText, decodedResult) => {
        if (cam.gettext() != (null || NaN)) {
            cam.dectxt(decodedText);
            resulte = cam.getid();
            cam.stopfilm();
            document.close();
            window.location.replace("showdata.html?k=" + resulte);
        }
    };
    cam.film(onsuccess);
}

//-----------------------Inventory--------------------------//

function Inv() {
    try {
        cam.stopfilm();
    } catch {}
    showinv();
    showdiv.style.height = "fit-content";

    const onsuccess = (decodedText, decodedResult) => {
        cam.dectxt(decodedText);
        if (init == true) {
            init = false;
            scanneddata.push(cam.getid());

            room = "Garage";

            realdata = obj.filter(obj=> obj.raumName === 'Garage')

            realdata.forEach((element) => {
                comparedata.push(element);
            });

            /*for (gr = 1; gr < 16; gr++) {
                for (numb = 1; numb < 10000; numb++) {
                    try {
                        if (obj.id[getID(gr, numb)].raumName == room) {
                            if (!realdata.includes(getID(gr, numb))) {
                                realdata.push(getID(gr, numb));
                            }
                        }
                    } catch (error) {}
                }
            }
            realdata.forEach((element) => {
                comparedata.push(element);
            });
            if (cam.gettext() != null && cam.gettext() != NaN && !scanneddata.includes(cam.getid())) {
                scanneddata.push(cam.getid());
            }*/
            showtext.innerHTML = "Raum: " + room ;
            Inventoryresult();
        } else if (init == false) {
            if (cam.gettext() != null && cam.gettext() != NaN && !scanneddata.includes(cam.getid())) {
                scanneddata.push(cam.getid());
            }
            Inventoryresult();
        }
    };
    cam.film(onsuccess);
    if (init == true) {
        showtext.innerHTML = "Bitte mit einem Barcode Initialisieren!";
    }
}

//-------------------------------------------------//

function getID(grp, numb) {
    return grp + "/" + numb;
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
            pdf.Write("Nummer: " + element + " Name: " + obj.id[element].invName);
        });
        pdf.Line();
    }
    if (comparedata.length != 0) {
        pdf.Write("Nicht eingescannt:");
        pdf.Line();
        comparedata.forEach((element) => {
            pdf.Write("Nummer: " + element + " Name: " + obj.id[element].invName);
        });
    }
    pdf.Save("Inventur-" + room);
}

//---------------------Save-Inventory-Data-in-Cookie----------------------------//

function SaveInventory() {
    showtext.innerHTML = "Daten für 90 Tage gespeichert!";
    InvScanned.setcookie(scanneddata, 90);
    InvComp.setcookie(comparedata, 90);
    InvReal.setcookie(realdata, 90);
}

//---------------------Get-Inventory-Data----------------------------//

function GetInventory() {
    showtext.innerHTML = "Daten geladen! \n" + room;
    scanneddata = InvScanned.getcookie().split(",");
    comparedata = InvComp.getcookie().split(",");
    realdata = InvReal.getcookie().split(",");
    init = false;
    Inventoryresult();
    Inv();
}

//---------------------Show-Inventory-Live-Update----------------------------//

function Inventoryresult() {
    let list = document.getElementById("myList");
    list.innerHTML = "";

    scanneddata.forEach((item) => {
        var resultel = obj.filter(obj=> obj.id === item)
        if (comparedata.includes(resultel[0])) {
            comparedata.splice(comparedata.indexOf(resultel[0]), 1);
        } else if (!realdata.includes(resultel[0]) && !notrightdata.includes(resultel[0])) {
            notrightdata.push(resultel[0]);
            console.log(notrightdata)
        }
        
    });
    notrightdata.forEach((item) => {
        let li = document.createElement("li");
        li.classList.add("notinventory");
        li.innerText = "Nummer: " + item.id + "\n" + "Name: " + item.invName;
        list.appendChild(li);
    });
    comparedata.forEach((element) => {
        let li = document.createElement("li");
        li.classList.add("inventory");
        li.innerText = "Nummer: " + element.id + "\n" + "Name: " + element.invName;
        list.appendChild(li);
    });
}
