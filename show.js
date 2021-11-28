var obj = JSON.parse(data);
var scanned = true;
const geturl = new URLSearchParams(window.location.search);
const scannedid = geturl.get('k');
const id = parseInt(scannedid);
console.log(randomnumber);
const readyid = id/randomnumber;
console.log(scannedid);

function ScanPage()
{
    document.close();
    window.location.replace("index.html?scanned="+scanned);
}

document.getElementById("id").innerHTML = id;
document.getElementById("showname").innerHTML = obj.id["id" + id].name + "<br>";
document.getElementById("showage").innerHTML = obj.id["id" + id].ort + "<br>";

