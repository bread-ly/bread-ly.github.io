var obj = JSON.parse(data);
var help;
var group;
var realdata = [];

var scanneddata = [];

const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
const config = { fps: 10, aspectRatio: 1.0, qrbox: 200};  //configuration of the camera, 10 frames per second and 1:1 ratio


function StartFilming(){
  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess); //start filming, looking for Scansuccess and config 
  console.log("started");
  help = "true";
} 

function onScanSuccess(decodedText, decodedresult) {
    scanned = parseInt(decodedText)
    console.log(decodedText);
    if (help == "true"){
        help = "false";
        group = decodedText.charAt(1);2
        console.log(group)
            for(i = 1; i < 2000; i++)
            {
                switch (true){
                case (i<10):
                    realdata.push(obj.id["id"+group+"000"+"i"])
                    break;
                case (i<100):
                    
                    realdata.push(obj.id["id"+group+"00"+"i"])
                    break;
                case (i<1000):
                    
                    realdata.push(obj.id["id"+group+"0"+"i"])
                    break;
                case (i<10000):
                    
                    realdata.push(obj.id["id"+group+"i"])
                    break;
            
                }
            }
        console.log(realdata);
        
    }
    else
    {
        if ((scanned != null && scanned != NaN) && scanneddata.indexOf("id" + scanned) < 0)
        {
            scanneddata.push("id" + scanned);
            console.log(scanneddata);
        }
    }
    
    
}
function StopFilming(){
  html5QrCode.stop().then((ignore) => { //stops the camera
  }).catch((err) => {
    // Stop failed, handle it.
  });
  html5QrCode.clear(); //clears the scanning area of the box
}
function Inventory(){
    console.log("showdata")
    realdata.forEach(element => {
        if (scanneddata.indexOf(element) > -1){
            scanneddata.splice(scanneddata.indexOf(element), 1);
        }     
    });
    let list = document.getElementById("myList");
    scanneddata.forEach(element =>{
        let li = document.createElement("li");
        li.innerText = obj.id[element].name;
        list.appendChild(li)
    });
}