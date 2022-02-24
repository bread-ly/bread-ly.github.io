var inputtext;
var resulte;
//const gobutton = document.getElementById("go");


function ShowResult() {
    //Funktion um einen Link weiterzugeben welcher die ID enthält
    document.close(); //Aktuelles HTML-Dokument schließen
    window.location.replace("showdata.html?k=" + resulte); //Auf schowdata HTML-Dokument weiterleiten mit gescannter ID im Link
}

function ManualID() {
    //Funktion um die ID nach Knopfdruck in einer Variable zu speichern
    decodedText = document.getElementById("search").value; //Aus dem Element search wird die ID genommen und wenn sie nicht null ist in die Variable resulte gespeichert
    if (decodedText != null) {

        if(decodedText.charAt(0) == "/")
        {
            window.location.replace("index.html?k=" + decodedText);
        }
        else{

            let idfirst = decodedText.charAt(0) + decodedText.charAt(1);
            group = parseInt(idfirst);

            let idlast = decodedText.charAt(2) + decodedText.charAt(3) + decodedText.charAt(4) + decodedText.charAt(5);
            number = parseInt(idlast);

            resulte = group + "/" + number;
            ShowResult();
        }
    }
    
}

function home() {
    document.getElementById("go").onclick = function() {ManualID()};
    document.close();
    window.location.replace("index.html");
}
