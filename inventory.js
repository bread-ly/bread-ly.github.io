var obj = JSON.parse(data);
var help = true;
var group;
var realdata = [];

var scanneddata = [010001, 06171];

const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
const config = { fps: 10, aspectRatio: 1.0, qrbox: 200};  //configuration of the camera, 10 frames per second and 1:1 ratio

function StartFilming(){
  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess); //start filming, looking for Scansuccess and config 
  console.log("started");
} 

function onScanSuccess(decodedText, decodedresult) {
    scanned = parseInt(decodedText)
    console.log("success");
    /*if (help){
        console.log("getting group")
        group = decodedText.charAt(2)+decodedText.charAt(3);
        for(i = 1; i<2000; i++){

            if(obj.id["id"+group+"i"].name != undefined)
            {
                switch (i)
                {
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
            
        }
        console.log(realdata)
        help = false;
    }
    else
    {
        if ((scanned != null && scanned != NaN) && scanneddata.indexOf(scanned) > -1)
        {
            scanneddata.push("id" + scanned);
            console.log("pushed "+ scanned);
        }
    }*/
    
    
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