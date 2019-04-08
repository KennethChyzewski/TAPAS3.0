/** 
    TEST USE OF SENDING PASSWORD TO PHONE

     var message = {
        "username": "username requesting",
         "site": "website name",
        "pass": "the password"
    }      

    *remember to encrypt the message

    sendToPhone("newPass", message, "ExponentPushToken[XHgob7CypPbDcequ1VgKRC]", "7");


    TEST USE OF REQUESTING PASSWORD FROM PHONE

    var message = {
             "username": "username requesting",
             "site": "website name"
        }  
        
    *remember to encrypt the message
    
    sendToPhone("requestPass", message, "ExponentPushToken[XHgob7CypPbDcequ1VgKRC]", "7");
    
*/




function sendToPhone(type, message, token, myToken){
	console.log("--- SendToPhone ---");
	console.log(type);
	console.log(message)
	console.log(token);
	console.log(myToken);
	console.log*"-------------------");

    /**
     * type:   "requestPass" or "newPass"
     * message:  AES encrypted message. 
     *          1) Requesting password.  
     *                      {
                                "username": "username requesting",
                                "site": "website name"
                            }  
                2) Sending password.  
     *                      {
                                "username": "username requesting",
                                "site": "website name",
                                "pass": "the password"
                            }      
     *      
     * 
     * token:  token (phone id) of phone saved on initial setup
     * myToken: token of this extension
     */

    var Http = new XMLHttpRequest();

    Http.onreadystatechange = function() {
        if (Http.readyState == XMLHttpRequest.DONE) {
            // console.log(Http.responseText);
        }
    }

    var payload = {
        "data": {
            "eID": myToken, // this is this extensions token (extension id)
            "type": type,
            "message": message
            },
        "to": token // phone token (phone id)
    }

    const url = "https://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send";

    Http.open("POST", url);
    Http.setRequestHeader("Host", "exp.host");
    Http.setRequestHeader("Accept", "application/json");
    Http.setRequestHeader("Accept-Encoding", "gzip, deflate");
    Http.setRequestHeader("Content-Type", "application/json");

    //console.log(message);

    var jsonMsg = JSON.stringify(payload);

    Http.send(jsonMsg);
}

