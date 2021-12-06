var obj = JSON.parse(data);
var init;
var group;
var realdata = ["id010001","id010002"];
var scanneddata = [];

const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
const config = { fps: 10, aspectRatio: 1.0, qrbox: 200};  //configuration of the camera, 10 frames per second and 1:1 ratio

function StartFilming(){
  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess); //start filming, looking for Scansuccess and config 
  init = "true";
} 

function onScanSuccess(decodedText, decodedresult) {
    
    if (init == "true"){
        init = "false";
        group = decodedText.charAt(0) + decodedText.charAt(1);
            for(i = 1; i < 2000; i++)
            { 
                try {
                switch (true){
                case (i<10):
                    obj.id["id"+group+"000"+i].name;
                    if (!(realdata.includes("id"+group+"000"+i))){
                    realdata.push("id"+group+"000"+i)}
                    break;
                case (i<100):
                    obj.id["id"+group+"00"+i].name;
                    if (!(realdata.includes("id"+group+"00"+i))){
                    realdata.push("id"+group+"00"+i)}
                    break;
                case (i<1000):
                    obj.id["id"+group+"0"+i].name;
                    if (!(realdata.includes("id"+group+"0"+i))){
                    realdata.push("id"+group+"0"+i)}
                    break;
                case (i<10000):
                    obj.id["id"+group+i].name;
                    if (!(realdata.includes("id"+group+i))){
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
        if ((decodedText != null && decodedText != NaN) && !(scanneddata.includes("id"+decodedText)))
        {
            scanneddata.push("id" + decodedText);
            console.log("scanned: " + decodedText)
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
    StopFilming()
    console.log(scanneddata);
    for (var i = realdata.length - 1; i >= 0; i--)
    {
        console.log(realdata[i]);
        if (scanneddata.includes(realdata[i])){
            realdata.splice(realdata.indexOf(realdata[i]), 1);
        }  
    }
    
    console.log(realdata);
    let list = document.getElementById("myList");
    realdata.forEach((item) => {
        let li = document.createElement("li");
        li.innerText = ("Nummer: " + item + "\n" + "Name: " + obj.id[item].name);
        list.appendChild(li)
    });
    help="true";
    scanneddata=[];
    realdata=[];

}