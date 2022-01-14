checkCookie();


function setCookie(name, value, days){
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  
  function getCookie(cname){
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++){
        let c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }
        if(c.indexOf(name) == 0){
            return c.substring(name.length, c.length);
        }
    }
    return null;
  }
  
  function checkCookie(){
    let link = getCookie("database");
    if(link != null)
    {
        console.log(link)
      loadData(link);
    }
    else{
      html5QrCode.start({ facingMode: "environment" }, config, onCokkieSuccess); //start filming, looking for Scansuccess and config
    }
  }
  
  function loadData(datalink){
    (function(d,script){
      script = d.createElement('script');
      script.async = true;
      script.onload = function(){
  
      };
      script.src = datalink;
      d.getElementsByTagName('head')[0].appendChild(script);
    }(document));
  }
  
  function onCokkieSuccess(decodedText, decodedresult){
    setCookie("link", decodedText, 90)
    StopFilming();
    checkCookie();
  }
  