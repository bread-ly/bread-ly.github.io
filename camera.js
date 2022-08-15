class Camera {
    constructor(scanner, config) {
        this.scanner = scanner;
        this.config = config;
        const html5QrCode = new Html5Qrcode("reader");
    }
    film(succ) {
        this.scanner.start({ facingMode: "environment" }, this.config, succ); //start filming, looking for Scansuccess and config
    }
    stopfilm() {
        this.scanner
            .stop()
            .then((ignore) => {
                //stops the camera
            })
            .catch((err) => {
                // Stop failed, handle it.
            });
        this.scanner.clear(); //clears the scanning area of the box
    }
    dectxt(decodedText) {
        this.text = decodedText;
        
        if (decodedText.charAt(0) == " ") {
            let idfirst = decodedText.charAt(1) + decodedText.charAt(2);

            this.group = parseInt(idfirst);


            let idlast = decodedText.charAt(3) + decodedText.charAt(4) + decodedText.charAt(5) + decodedText.charAt(6);
            this.number = parseInt(idlast);
        }
        else
        {
        
            let idfirst = decodedText.charAt(0) + decodedText.charAt(1);

            this.group = parseInt(idfirst);


            let idlast = decodedText.charAt(2) + decodedText.charAt(3) + decodedText.charAt(4) + decodedText.charAt(5);
            this.number = parseInt(idlast);
            
        }
        
    }
    getid() {
        return this.group + "/" + this.number;
    }
}
