      const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
      const config = { fps: 10, aspectRatio: 1.0, qrbox: 400};  //configuration of the camera, 10 frames per second and 1:1 ratio
      
      var resulte;

      function StartFilming(){
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanError); //start filming, looking for Scansuccess and config 
      }
      
      function onScanSuccess(decodedText, decodedresult) {
      StopFilming();
      if (decodedText != null)
      {
        resulte = decodedText;
        console.log("result gespeichert");
      }
      ShowResult();
      }

      function onScanError(errorMessage){
        console.log(errorMessage);
      }

      function StopFilming(){
        html5QrCode.stop().then((ignore) => { //stops the camera
        }).catch((err) => {
          // Stop failed, handle it.
        });
        html5QrCode.clear(); //clears the scanning area of the box
      } 

      function ShowResult()
      {
        document.close();
        window.location.replace("showdata.html?k="+resulte);

      }
      
      

      
 