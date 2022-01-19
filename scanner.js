const pdf = new jsPDF("p", "mm", "a4"); //Portrait und Maßeinheit Millimeter
pdf.setFont("Arial");
pdf.setFontSize(12);

const html5QrCode = new Html5Qrcode("reader");
const conf = { fps: 10, aspectRatio: 1.0, qrbox: 200 }; //configuration of the camera, 10 frames per second and 1:1 ratio

const showtext = document.getElementById("showtext");
const showdiv = document.getElementById("showdiv");
const readydiv = document.getElementById("readydiv");
const invreadybutton = document.getElementById("inventoryready");
const scanbutton = document.getElementById("scannbutton");
const invbutton = document.getElementById("inventorybutton");

let obj;
let idold;
let init = true;
var realdata = [];
var scanneddata = [];
var comparedata = [];
var notrightdata = [];
var zeilenabstand = 7;
var resulte;

invreadybutton.style.visibility = "hidden";
saveinventory.style.visibility = "hidden";
readydiv.style.height = "0px";

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
        if (cookiedata != null && cookiedata.charAt(0) == "h" && cookiedata.charAt(1) == "t") {
            showdiv.style.height = 0;
        } else {
            showtext.innerHTML = "Bitte Initialisierung durchführen!";
            const onsuccess = (decodedText, decodedResult) => {
                this.setcookie(decodedText, 1);
                cam.stopfilm();
                showdiv.style.height = "fit-content";
                showtext.innerHTML = "Data-Base set!";
            };
            cam.film(onsuccess);
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
        }
    }
}

//---------------Initialize-Classes-----------------------//

const cam = new Camera(html5QrCode, conf);

const DataBase = new Cookies("database");
DataBase.checkcookie();
DataBase.loadcookie();

//------------------------Scan-Button-------------------------//

function Scan() {
    const onsuccess = (decodedText, decodedResult) => {
        if (cam.gettext() != (null || NaN)) {
            cam.dectxt(decodedText);
            resulte = cam.getid();
            document.close();
            window.location.replace("showdata.html?k=" + resulte);
        }
    };
    cam.film(onsuccess);
}

//-----------------------Inventory-Button--------------------------//

function Inv() {
    showinv();

    const onsuccess = (decodedText, decodedResult) => {
        cam.dectxt(decodedText);
        if (init == true) {
            init = false;
            var room = obj.id[cam.getid()].raumName;
            for (gr = 1; gr < 16; gr++) {
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
                console.log(scanneddata);
            }
            Inventoryresult();
        }
        console.log(init);
        if (init == false) {
            showtext.innerHTML = "Scannen:";
            if (cam.gettext() != null && cam.gettext() != NaN && !scanneddata.includes(cam.getid())) {
                scanneddata.push(cam.getid());
            }
            Inventoryresult();
        }
    };
    cam.film(onsuccess);
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
    readydiv.style.height = "fit-content";
    invbutton.style.visibility = "hidden";
    showtext.innerHTML = "Initialisieren:";
    showdiv.style.height = "fit-content";
}

//----------------------Print-PDF---------------------------//

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

//---------------------Show-Inventory-Live-Update----------------------------//

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
