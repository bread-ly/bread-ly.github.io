var inputtext;
var resulte;
function ShowResult(){
    document.close();
    window.location.replace("showdata.html?k="+resulte);
}
function ManualID(){
    decodedText = document.getElementById("search").value;
    if (decodedText != null)
    {
      resulte = decodedText;
    }
    ShowResult();
}