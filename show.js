var obj = JSON.parse(data);
const geturl = new URLSearchParams(window.location.search);
const scannedid = geturl.get('k');
const id = parseInt(scannedid);
var random = localStorage.getItem("random");
const readyid = id/random;

function ScanPage()
{
    document.close();
    window.location.replace("index.html?scanned=true");
}

document.getElementById("id").innerHTML = readyid;
document.getElementById("showname").innerHTML = obj.id["id" + readyid].name + "<br>";
document.getElementById("showage").innerHTML = obj.id["id" + readyid].ort + "<br>";

