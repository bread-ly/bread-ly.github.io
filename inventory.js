var obj = JSON.parse(data);
var init;
var group;
var realdata = [];
var scanneddata = [];

const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
const config = { fps: 10, aspectRatio: 1.0, qrbox: 200};  //configuration of the camera, 10 frames per second and 1:1 ratio

function StartFilming(){
  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess); //start filming, looking for Scansuccess and config 
  console.log("started");
  init = "true";
} 

function onScanSuccess(decodedText, decodedresult) {
    scanned = parseInt(decodedText)
    console.log(decodedText);
    if (init == "true"){
        init = "false";
        group = decodedText.charAt(1);
        console.log(group);
            for(i = 1; i < 2000; i++)
            {
                try {
                    obj.id["id"+group+"000"+i].name;
                switch (true){
                case (i<10):
                    if (realdata.indexOf("id"+group+"000"+i) < 0){
                    realdata.push("id"+group+"000"+i)}
                    break;
                case (i<100):
                    if (realdata.indexOf("id"+group+"00"+i) < 0){
                    realdata.push("id"+group+"00"+i)}
                    break;
                case (i<1000):
                    if (realdata.indexOf("id"+group+"0"+i) < 0){
                    realdata.push("id"+group+"0"+i)}
                    break;
                case (i<10000):
                    if (realdata.indexOf("id"+group+i) < 0){
                    realdata.push("id"+group+i)}
                    break;
                }
                }
                catch(error){

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
    /*StopFilming()
    console.log("showdata")
    realdata.forEach(element => {
        if (scanneddata.indexOf(element) > -1){
            console.log(element);
            realdata.splice(scanneddata.indexOf(element), 1);
        }     
    });
    console.log(realdata);*/
    let data = ["id10001", "id10002"];
    let list = document.getElementById("myList");
    data.forEach((item) =>{
        let li = document.createElement("li");
        li.innerText = obj.id[item].name;
        list.appendChild(li)
    });
}