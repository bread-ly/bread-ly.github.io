const pdf = new jsPDF("p", "mm", "a4") //Portrait und Maßeinheit Millimeter
pdf.setFont("Arial");
pdf.setFontSize(12);

var obj = JSON.parse(data);
var init;
var group;
var realdata = [];
var scanneddata = [];
var comparedata = [];
var notrightdata = [];
var zeilenabstand = 7;

const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
const config = { fps: 10, aspectRatio: 1.0, qrbox: 200};  //configuration of the camera, 10 frames per second and 1:1 ratio

var resulte;

document.getElementById("scannbutton").style.visibility = 'visible';
document.getElementById("inventoryready").style.visibility = 'hidden';

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
  document.getElementById("scannbutton").style.visibility = 'hidden';
  document.getElementById("inventoryready").style.visibility = 'visible';
  document.getElementById("inventorybutton").style.visibility = 'hidden';
  html5QrCode.start({ facingMode: "environment" }, config, onSuccess); //start filming, looking for Scansuccess and config 
  init = "true";
} 

function InventoryReady(){
  pdf.text("Dinge die hier nicht hergehören:", 10, zeilenabstand)
  notrightdata.forEach(element => {
    pdf.text("Nummer: " + element + " Name: " + obj.id[element].name, 10, zeilenabstand * (notrightdata.indexOf(element) + 2))
  });
  pdf.text("Dinge die fehlen:", 10, zeilenabstand + ((notrightdata.length + 1) * zeilenabstand) )
  comparedata.forEach(element => {
    pdf.text("Nummer: " + element + " Name: " + obj.id[element].name, 10, zeilenabstand * (comparedata.indexOf(element) + 3) + (notrightdata.length * zeilenabstand))
  });
  pdf.save("inventur.pdf")
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