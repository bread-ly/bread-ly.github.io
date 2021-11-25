var obj = JSON.parse(data);

const geturl = new URLSearchParams(window.location.search);
const scannedid = geturl.get('k');

console.log(scannedid);

function ScanPage()
{
    document.close();
    window.location.replace("index.html");
}

document.getElementById("id").innerHTML = scannedid;
document.getElementById("showname").innerHTML = obj.id["id" + scannedid].name + "<br>";
document.getElementById("showage").innerHTML = obj.id["id" + scannedid].age + "<br>";
document.getElementById("showcity").innerHTML = obj.id["id" + scannedid].city + "<br>";

