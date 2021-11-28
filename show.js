var obj = JSON.parse(data);
var scanned = true;
const geturl = new URLSearchParams(window.location.search);
const scannedid = geturl.get('k');
const id = (parseInt(scannedid))/randomnumber;
console.log(scannedid);

function ScanPage()
{
    document.close();
    window.location.replace("index.html?scanned="+scanned);
}

console.log(Math.floor(Math.random()*10));

document.getElementById("id").innerHTML = id;
document.getElementById("showname").innerHTML = obj.id["id" + id].name + "<br>";
document.getElementById("showage").innerHTML = obj.id["id" + id].ort + "<br>";

