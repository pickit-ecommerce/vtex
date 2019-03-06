(function (global){
    "use strict"
    var googleMapsApiKey = "";

    function ajax(url,method,body,calback,errorCallback){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
              if (this.status >= 200 && this.status < 300 ) {
                if(calback){
                    calback(this.responseText);
                }
              } else {
                if(errorCallback){
                    errorCallback(this.responseText || this.status || "not response from " + url);
                } else {
                    console.error(this.responseText);
                }
              }
          }
        };
        xhttp.open(method, url, true);
        xhttp.send(body);
    }

    function reportError (error){
        console.error(error);
        var errorText = error.stack ? error.stack : "" + error;
        var client = global.location.host ? global.location.host : global.location;
        var browserInfo = global.clientInformation.userAgent;
        var json = JSON.stringify({text : errorText,client:client,browserInfo:browserInfo});
        ajax(
            "https://middleware.pickit.net/plugin/log",
            "POST",
            json
        );
    }   
  
  function tryinject(url){
    try{
       ajax(
        url
        ,"GET"
        ,""
        ,function (response) {
            try{
              eval(response);
              if(googleMapsApiKey){
                  global.pickitApi.loadGoogleMapsApi(googleMapsApiKey);
              }
            }catch(error){
              reportError(error);
          }
        },function (errorThrown){
              reportError(errorThrown);
        });
      
    } catch (err){
      console.error(err);
      jQuery(document).append("<script src=" + url + "  type=\"application/javascript\"></script>");
    }
  }
  tryinject("https://middleware.pickit.net/plugin/code");
   
})(window);
//////////////////////////////////////////////////
////////////// Fin plugin Pickit /////////////////
//////////////////////////////////////////////////