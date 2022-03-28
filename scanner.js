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

const conf = { fps: 10, aspectRatio: 1.0, qrbox: 200 }; //Konfiguration für den Scanner

const zeilenabstand = 7;

const now = new Date();

var obj;
var init = true;
var room;

var realdata = [];
var scanneddata = [];
var comparedata = [];
var notrightdata = [];

var resulte;

var date = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();

invreadybutton.style.visibility = "hidden";
saveinventory.style.visibility = "hidden";
getinventory.style.visibility = "hidden";
readydiv.style.height = "0px";
loaddiv.style.height = "0px";

//---------------Initialize-Classes-----------------------//

const html5QrCode = new Html5Qrcode("reader");

const cam = new Camera(html5QrCode, conf);

const DataBase = new Link("database");
DataBase.checklink();

const pdf = new PDF(20, zeilenabstand, "FF Hohenkogl");

//---------------------Manual-Init-of-Database-----------------------//

function initlink() {
    let text = searchbar.value;
    DataBase.setdata(text, 180);
    DataBase.loadlink();
    try {
        cam.stopfilm();
    } catch {}
    gobutton.onclick = function () {
        ManualID();
    };
    searchbar.placeholder = "ID-Eingeben..";
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
        try{
            var resultel = obj.filter((obj) => obj.invInvNummer === item);
            if (comparedata.includes(resultel[0].invInvNummer)) {
            comparedata.splice(comparedata.indexOf(resultel[0].invInvNummer), 1);
            } else if (!realdata.includes(resultel[0].invInvNummer) && !notrightdata.includes(resultel[0].invInvNummer)) {
            notrightdata.push(resultel[0].invInvNummer);
        }
        }
        catch(err)
        {
            alert("Gegenstand nicht in der Datenbank enthalten!");
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
