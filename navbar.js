var inputtext;
var resulte;

function ShowResult() {
    //Funktion um einen Link weiterzugeben welcher die ID enthält
    document.close(); //Aktuelles HTML-Dokument schließen
    window.location.replace("showdata.html?k=" + resulte); //Auf schowdata HTML-Dokument weiterleiten mit gescannter ID im Link
}

function ManualID() {
    //Funktion um die ID nach Knopfdruck in einer Variable zu speichern
    decodedText = document.getElementById("search").value; //Aus dem Element search wird die ID genommen und wenn sie nicht null ist in die Variable resulte gespeichert
    if (decodedText != null) {
        resulte = decodedText;
    }
    ShowResult();
}

function home() {
    document.close();
    window.location.replace("index.html");
}
