var obj = JSON.parse(data);
var init;
var group;
var realdata = [];
var scanneddata = [];
var comparedata = [];
var notrightdata = [];


const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
const config = { fps: 10, aspectRatio: 1.0, qrbox: 200};  //configuration of the camera, 10 frames per second and 1:1 ratio

var resulte;
function StartScanner(){

  html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess); //start filming, looking for Scansuccess and config 
} 

function StopFilming(){
  html5QrCode.stop().then((ignore) => { //stops the camera
  }).catch((err) => {
    // Stop failed, handle it.
  });
  html5QrCode.clear(); //clears the scanning area of the box

}

function onScanSuccess(decodedText, decodedresult) {
  if (decodedText != null)
  {
    resulte = decodedText;
  }
ShowResult();
}
 
function ShowResult()
{
  document.close();
  window.location.replace("showdata.html?k="+resulte);
}

function StartInventory(){

  html5QrCode.start({ facingMode: "environment" }, config, onSuccess); //start filming, looking for Scansuccess and config 
  init = "true";
} 

function onSuccess(decodedText, decodedresult) {
    
  if (init === "true"){
      
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
          realdata.forEach(element => {
            comparedata.push(element);
          });
  }
  else
  {
      if ((decodedText != null && decodedText != NaN) && !(scanneddata.includes("id"+decodedText)))
      {
          scanneddata.push("id" + decodedText);
      }
      Inventory();
  }
}

function Inventory(){
  let list = document.getElementById("myList");
  list.innerHTML = "";
  scanneddata.forEach(item => {
    if (comparedata.includes(item)){
      comparedata.splice(comparedata.indexOf(item), 1)
    }
    else if (!(realdata.includes(item)) && !(notrightdata.includes(item))){

      notrightdata.push(item);
    }
  });
  notrightdata.forEach(item => {
    let li = document.createElement("li");
    li.classList.add("notinventory");
    li.innerText = ("Nummer: " + item + "\n" + "Name: " + obj.id[item].name);
    list.appendChild(li);
  });
  comparedata.forEach(element=> {
    let li = document.createElement("li");
    li.classList.add("inventory");
    li.innerText = ("Nummer: " + element + "\n" + "Name: " + obj.id[element].name);
    list.appendChild(li);
  });
}