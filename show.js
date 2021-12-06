var obj = JSON.parse(data);
const geturl = new URLSearchParams(window.location.search);
const scannedid = geturl.get('k');

function ScanPage()
{
    document.close();
    window.location.replace("index.html?scanned=true");
}
document.getElementById("id").innerHTML = scannedid;
document.getElementById("showname").innerHTML = obj.id["id" + scannedid].name + "<br>";
document.getElementById("showlocation").innerHTML = obj.id["id" + scannedid].ort + "<br>";

