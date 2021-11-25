var obj = JSON.parse(data);

const geturl = new URLSearchParams(window.location.search);
const scannedid = geturl.get('k');
const id = parseInt(scannedid);

function ScanPage()
{
    document.close();
    window.location.replace("index.html");
    StartFilming();
}

document.getElementById("id").innerHTML = id;
document.getElementById("showname").innerHTML = obj.id["id" + id].name + "<br>";
document.getElementById("showage").innerHTML = obj.id["id" + id].ort + "<br>";

