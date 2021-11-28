      const html5QrCode = new Html5Qrcode("reader"); //create a scan-element 
      const config = { fps: 10, aspectRatio: 1.0, qrbox: 200};  //configuration of the camera, 10 frames per second and 1:1 ratio
      
      var resulte;

      const geturl = new URLSearchParams(window.location.search);
      const scanned = geturl.get('scanned');
     
      

      if (scanned){
        StartFilming();
      }

      function GetRandomNumber()
      {
        Math.floor(Math.random()*100)
      }

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
        window.location.replace("showdata.html?k="+(resulte*GetRandomNumber()));
        randomnumber = (resulte*GetRandomNumber());
        console.log(randomnumber);
      }
      
      

      
 