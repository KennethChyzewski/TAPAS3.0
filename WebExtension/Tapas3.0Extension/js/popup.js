/*
Global variables
*/
var pairId = "";
var config = {
    apiKey: "AIzaSyBcG44HsOq55TM3WkbKUUBcyM6fhiux_B4",
    authDomain: "tapas-7e377.firebaseapp.com",
    databaseURL: "https://tapas-7e377.firebaseio.com",
    projectId: "tapas-7e377",
    storageBucket: "tapas-7e377.appspot.com",
    messagingSenderId: "1030918840491"
};

/*
 * Loads all components into password extension
 */
window.onload = function() {
	/*chrome.storage.local.get("phoneToken", function(token) {
		if (chrome.runtime.lastError) {
			return;
		} else {
			authenticate(token["phoneToken"]);
		}
	});*/
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++) {
        pairId += chars.charAt(Math.floor(Math.random() * chars.length))
    }
	console.log(pairId);
    // Initialize Firebase
    firebase.initializeApp(config);
    let firebaseAppDefined = false
    setInterval(() => {
        if (!firebaseAppDefined) {
            if (firebase.app()) {
                // Your code here
                firebaseAppDefined = true
            }
        }
    }, 100)
    var database = firebase.database();

    var fcmToken = getLocalToken().then(function(fcmToken) {
        console.log(fcmToken);
		var pairing_object = {"AES_KEY": pairId,
			"EXTENSION_TOKEN": fcmToken};
		new QRCode(document.getElementById("pairqr"), JSON.stringify(pairing_object));

        return fcmToken;
    });

    console.log("Beginning messaging.");
	//autoPair();
    /*getLocalToken().then(function(token) {
        var deviceID = "1"; //localStorage.getItem("deviceID");
        var message = {
            "data": {
                'type': 'requestPass',
                'site': 'http://password.com',
                'user': 'NewUser',
                'pass': 'NewPass',
            },
            "to": token
        }
        var Http = new XMLHttpRequest();
        Http.onreadystatechange = function() {
            if (Http.readyState == XMLHttpRequest.DONE) {
                console.log(Http.responseText);
            }
        }

        const url = "https://fcm.googleapis.com/fcm/send";
        Http.open("POST", url);
        Http.setRequestHeader("Content-Type", "application/json");
        Http.setRequestHeader("Authorization", "key=AIzaSyDyQIKrg4kkkXXf72nnCL2Yq5TSMIJQEJE");
        console.log(message);
        var jsonMsg = JSON.stringify(message);
        console.log(Http.response);
        console.log("Sent message");
        return token;
    });
	*/
    firebase.messaging().onMessage(function(payload) {
        console.log("Incoming message:", payload);
        switch (payload.data.type) {
            case 'initial':
                authenticate(payload.data.token);
                break;
            case 'requestPass':
                incomingPass(payload.data.site, payload.data.user, payload.data.pass);
                break;
			case 'updateUserList':
				setTimeout(usernameList(), 1000);
				break;
            case 'newUser':
                addUser(payload.data.site, payload.data.user);
                break;
            case 'requestUsernames':
                break;
			default:
				console.log(payload);
				break;
        }
    });
    chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
       function(tabs){
          document.getElementById("url").value = tabs[0].url.split("/")[2];
          //alert(url);
       }
    );

    var authButton = document.getElementById("auth");
    auth.onclick = authenticate;

    var regButton = document.getElementById("reg");
    regButton.onclick = register;

    var sub = document.getElementById("sub");
    sub.onclick = submit;

    var back = document.getElementById("back");
    back.onclick = goBack;

    var rem = document.getElementById("remove");
    rem.onclick = remover;

    var addButton = document.getElementById("done_addpass");
    addButton.onclick = authenticate;
	
	var unPair = document.getElementById("unpair");
	unPair.onclick = unpair;

    //Checks URL formatting to include a '.' so that it's
    document.getElementById("url").oninput = (e) => {
        var urlField = document.getElementById("url");
        let fieldText = urlField.value;

        document.getElementById("form").onkeydown = function() {
            if (window.event.keyCode === 13) {
                authenticate();
                return false;
            }
        };


        /* ERROR CHECKS FOR URL 
        
        // because many of these options disable the button, this function keeps from
        // rewriting it over and over
        function disable() {
            document.getElementById("sub").disabled = true;
            urlField.style.borderColor = "red";
        }
        

        // disable if backspace or delete is pressed
        if(e.keyCode === 8 || e.keyCode === 46) {
            disable();
            return true;
        }
        
        // there needs to be at least one period or else it's not the right format
        if (!fieldText.match(/\./)) {
            disable();
            return true;
        }
       
        
        // if they type 'www.x.com' its invalid, only one period and no slashes
        if(fieldText.includes("/") || fieldText.match(/\./gi).length > 1) {
            
            // check if there are more than 2 words
            let values = fieldText.split(".");
            if (values.length != 2) {
                disable();
                return true;
            }
            
            // if any part is left null, disable
            for (let i in values) {
                if (i.length < 2) {
                    disable();
                    return true;
                }
            }
            
            disable();
            
        }

        
        // if all tests pass, let them enter
        else {
           document.getElementById("sub").disabled = false;
           urlField.style.borderColor = "lightblue";
        }
        */

    };
}


// constants we need to keep track of
var key = "";
var storedPasswords;


function unpair() {
	chrome.storage.local.remove("phoneToken");
	window.close();
}


function autoPair() {
	var token = getLocalToken().then(function(token) {
	var sendTok = CryptoJS.AES.encrypt("XHgob7CypPbDcequ1VgKRC", pairId).toString(); //localStorage.getItem("deviceID");
	var message = {
		"data": {
			'type': 'initial',
			'token': sendTok
		},
		"to": token
	}

	var Http = new XMLHttpRequest();
	Http.onreadystatechange = function() {
		if (Http.readyState == XMLHttpRequest.DONE) {
			console.log(Http.responseText);
		}
	}

	const url = "https://fcm.googleapis.com/fcm/send";
	Http.open("POST", url);
	Http.setRequestHeader("Content-Type", "application/json");
	Http.setRequestHeader("Authorization", "key=AIzaSyDyQIKrg4kkkXXf72nnCL2Yq5TSMIJQEJE");
	console.log(message);
	var jsonMsg = JSON.stringify(message);
	Http.send(jsonMsg);
	console.log("Sent message");
	return token;
});

}

function usernameList() {
    resetDisplay();
    var db = firebase.database();
    chrome.storage.local.get(["phoneToken", "accountList"], function(queryResult) {
		phoneToken = queryResult['phoneToken'];
		localAccList = queryResult['accountList'];
		console.log(phoneToken);
		console.log(localAccList);
        var usersRef = firebase.database().ref("phones/" + phoneToken);
        usersRef.once("value", function(data) {
            accList = data.val();
            if (!accList) {
                error_box = document.getElementById("login-error");
                error_box.style = "display:block;";
                error_box.innerHTML = "Could not load any usernames, please wait for a response from the server.";
                return;
            }
            var list = document.getElementById("lister");
            var table = document.querySelector("table");
			var row = table.createTHead().insertRow(0);
			row.insertCell().innerHTML = "Site";
			row.insertCell().innerHTML = "Username";
			row.insertCell().innerHTML = "Password";
            list.style.display = "inherit";
            for (var hash in accList) {
                account = accList[hash];
                if (!account || !account.site || !account.username) {
                    return;
                }
                var id = account.site + ":" + account.username;
				var row = table.insertRow();
				var siteCell = row.insertCell();
				var usernameCell = row.insertCell();
				var passwordCell = row.insertCell();
				
				siteCell.style.overflow = "scroll";
				siteCell.className="site";
				
				usernameCell.style.overflow = "scroll";
				usernameCell.className="user";
				
                siteCell.innerHTML = account.site;
                usernameCell.innerHTML = account.username;
                var passwd = null;
				localAccList.forEach(function(accObj) {
					if (accObj.username == account.username && accObj.site == account.site && accObj.password) {
						passwd = accObj.password;
						return;
					}
				});
				if (passwd == null) {
					var btn = document.createElement("input");
					btn.site=account.site;
					btn.username=account.username;
					btn.type="button";
					btn.className="btn btn-success";
					btn.value="Request"
					btn.addEventListener('click', function(e) {
						requestPassword(this.site, this.username);
					});

                    passwordCell.appendChild(btn);


                } else {
					passwordCell.style.overflow="scroll";
					passwordCell.className="pass";
                    passwordCell.innerHTML = passwd;
                }
                ;

            }

        });

    });
}

function incomingPass(site, username, password) {
    chrome.storage.local.get("accountList", function(accObj) {
        var accList = accObj['accountList'];
        var index = accList.findIndex(function(elem) {
            return elem.site == site && elem.username == username;
        });
        var updated = {
            'site': site,
            'username': username,
            'password': password
        }
        if (index != -1) {
            accList[index] = updated;
        } else {
            accList.push(updated);
        }
        setStorage('accountList', accList);
    });
    usernameList();
    
    var copyText = document.getElementById("pass123");
    copyText.value=password;
    copyText.select();
    document.execCommand("copy");
    alert("Password received and copied: "+ password);
}

function requestPassword(site, username) {
    var msg = {
        "site": site,
        "username": username
    }
    chrome.storage.local.get("phoneToken", function(theToken) {
		console.log(theToken);
        getLocalToken().then(function(extToken) {
            sendToPhone("requestPass", msg, theToken['phoneToken'], extToken);
        });
    });
}


// reset the display
function resetDisplay() {
    var register = document.getElementById("register");
    register.style.display = "none";
    if (register.querySelector("#url")) {
        register.querySelector("#url").value = "";
        register.querySelector("#username").value = "";
    }

    var addpassqr = document.getElementById("addpassqr_block");
    addpassqr.style.display = "none";
    document.getElementById("login-error").style.display = "None";
    document.getElementById("form").style.display = "None";
    document.getElementById("auth").style.display = "None";
    document.getElementById("pairqr").style.display = "None";
    document.getElementById("pairhr").style.display = "None";

    // before, it would just stack the accounts on top of each other, now we 
    // delete all the previous entries so it can stack again. 
    var tds = document.querySelectorAll("td");
    for (let i = 3; i < tds.length; i++) {
		if (tds[i].parentElement.parentElement.parentElement && tds[i].parentElement.parentElement) {
			tds[i].parentElement.parentElement.parentElement.removeChild(tds[i].parentElement.parentElement);
		}
    }
}


function getLocalToken() {
    if (!firebase.apps[0]) {
        firebase.initializeApp(config);
    }
    try {
        firebase.messaging().usePublicVapidKey("BJKoVGXUO56rQENs9hquUExldbUGlQOTqjeefJS03bUqetC7CTi5VGiejFDKwtWWyJMu2Zx-pr0M22nw2WpDBQc");
    } catch (err) {
        console.error(err);
    }

    var token = firebase.messaging().requestPermission().then(function() {
        var token = firebase.messaging().getToken().then(function(token) {
            return token;
        });
        return token;
    });
    return token;
}

function initializeFirebase() {

}

function setStorage(key, value) {
    var json = {}
    json[key] = value;
    chrome.storage.local.set(json);
}

async function getUsersFromFirebase() {
    var db = firebase.database();
    chrome.storage.local.get("phoneToken", function(phoneToken) {
		phoneToken = phoneToken['phoneToken'];
        var usersRef = firebase.database().ref("phones/" + phoneToken);
        usersRef.once("value", function(data) {
            data = data.val();
            console.log("data:", data);
        });
    });
}

function addUser(site, username) {

    var json = {
        "site": site,
        "username": username
    }
    var curList = chrome.storage.local.get('accountList', function(accObj) {
        accList = accObj['accountList'];
        accList.push(json);
        setStorage('accountList', accList);
    });
    console.log("Added user: ", site, username);
    usernameList();
}

function getStorage(field) {
    return chrome.storage.local.get(field, function(data) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        }
        return data;
    });
}

/*
 * Each user on a browser has a set key where all their passwords are stored. In 
 * future installments I plan on adding a PGP system where a user can only decrypt 
 * their passwords with their key, but for now it's all just local plaintext. This 
 * function loads all the passwords they currently have and loads the screen that 
 * displays them
 */
function authenticate(phoneToken) {

    if (!phoneToken) {
        console.error("Invalid token!");
        return;
    }
    resetDisplay();
	phoneToken = CryptoJS.AES.decrypt(phoneToken, pairId).toString(CryptoJS.enc.Utf8);
	console.log(phoneToken);
    //setStorage("phoneToken", phoneToken);
	var json = {}
	json["phoneToken"] = phoneToken;
	json["accountList"] = [];
	chrome.storage.local.set(json);
    //setStorage('accountList', [{"site": "123.com", "username": "Timmarus"}]);
    usernameList();


    // select the elements that we need, getting key if this is where to user first 
    // logged in

    /*  if (!login_user) {
        login_user = document.getElementById("login_user").value;
    }
	if (!login_pass) {
        login_pass = document.getElementById("login_pass").value;
    }
	login_user.value = "test@test.com";
	login_pass.value = "tester";
	console.log(login_user.value);
	console.log(login_pass.value);

	firebase.auth().signInWithEmailAndPassword(login_user.value, login_pass.value).then(function() {
		resetDisplay();
		var userId = firebase.auth().currentUser.uid;
		var list = document.getElementById("lister");
		var table = document.querySelector("table");
		document.getElementById("form").style.display="None";
		document.getElementById("auth").style.display="None";
		document.getElementById("pairqr").style.display="None";
		document.getElementById("pairhr").style.display="None";
		list.style.display = "inherit";
		
		
		var accounts = firebase.database().ref('users/' + userId);
		//console.log(accounts);
		accounts.once('value').then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var childKey = childSnapshot.key;
				var childData = childSnapshot.val();
				table.innerHTML += "<tr class='selectable'>" +
				"<td class='name'>" + childKey.replace(/,/g, ".") + "</td>" +
				"<td class='user'>" + childData["username"] + "</td>" +
				"<td class='pass'>" + childData["password"] + "</td>";
		});});

		
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorCode);
		console.log(errorMessage);
		error_box = document.getElementById("login-error");
		switch (errorCode) {
			case "auth/invalid-email":
				error_box.style = "display:block;";
				error_box.innerHTML = "Invalid email. Please try again with a valid email address.";
				break;
			case "auth/wrong-password":
				error_box.style = "display:block;";
				error_box.innerHTML = "Invalid password. Please try again with the correct password.";
				break;
			case "auth/user-not-found":
				error_box.style = "display:block;";
				error_box.innerHTML = "The specified user account does not exist.";
				break;
			default:
				error_box.style = "display:block;";
				error_box.innerHTML = "An unexpected error occured.";
				break;
		}
	});*/
    /*storedPasswords = JSON.parse(localStorage.getItem(key));
    var list = document.getElementById("lister");
    var table = document.querySelector("table");
    
    // set the login element to not display, display the table of passwords
    document.getElementById("form").style.display = "None";
    list.style.display = "inherit";
    
    // for each password in this user, show them their username and their password 
    for (let key in storedPasswords) {
        if (storedPasswords.hasOwnProperty(key)) {
            table.innerHTML += "<tr class='selectable'>" +
            "<td class='name'>" + key + "</td>" +
            "<td class='user'>" + storedPasswords[key]["username"] + "</td>" +
            "<td class='pass'>" + storedPasswords[key]['password']+ "</td>";
        }
    }
    
    // each row needs to be clickable to go to the site's page that gives the user 
    // more options
    var rows = document.querySelectorAll(".selectable");
    for (let i = 0; i < rows.length; i++){
        rows.item(i).addEventListener("click", function() {goToSitePage(rows.item(i));});
    }
    
    // if this is a new key, give them a warning and let them set up their passwords
    if (!storedPasswords) {
        document.getElementById("lister").innerHTML += "<div id=\"warning\">No passwords available! add more below!</div>" 
        document.getElementById("reg").style.top = "30%";
        document.getElementById("reg").onclick = register;
        
    }*/
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// this function just brings up the new registration screen
function register() {
	chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		var source = document.createRange().createContextualFragment(request.source);
		console.log(source);
		chrome.tabs.query({
            'active': true,
            'windowId': chrome.windows.WINDOW_ID_CURRENT
        },
        function(tabs) {
            document.getElementById("url").value = tabs[0].url.split("/")[2];
			
			if (source.querySelector('input[type="email"]')) {
				var inputs = source.querySelector('input[type="email"]');
				document.getElementById("username").value = inputs.value;
			} else if (source.querySelector('input[id="username"]')) {
				var inputs = source.querySelector('input[id="username"]');
				document.getElementById("username").value = inputs.value;
			} else if (source.querySelector(['input[id="user"]'])) {
				var inputs = source.querySelector('input[id="user"]');
				document.getElementById("username").value = inputs.value;
			}
			if (source.querySelectorAll('input')) {
				var query = source.querySelectorAll('input');
				var last = query.item(0);
				query.forEach(function (input) {
					if (input.type=="password") {
						document.getElementById("username").value = last.value;
						console.log(last);
						return;
					} else {
						last = input;
					}
				});
			}
        }
    );

	} else if (request.action == "getUsername") {
		console.log("Get username", request.username);
		document.getElementById("username").value = request.username;
	}
	});
  chrome.tabs.executeScript(null, {
    file: "js/getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      alert('There was an error injecting script : \n' + chrome.runtime.lastError.message);
    }
  });
    document.getElementById("lister").style.display = "None";
    document.getElementById("register").style.display = "inherit";
}

/*
 * Creates new credential with username and password
 */
async function submit() {
    console.log("Running submit sequence.");
    // get the fields the user filled in
    var name = document.getElementById("url");
    var user = document.getElementById("username");
    var password = document.getElementById("password");

    if (!firebase.apps[0]) {
        firebase.initializeApp(config);
    }



    // if the user left a trailing period, there's a bug where it lets them enter it.
    // this fixes and removes that trailing period
    if (name.value[name.value.length - 1] === ".") {
        name.value = name.value.substring(0, name.value.length - 1);
    }

    // if the name is blank or password already exists, send the user back
    /* try {
        if (!name.value || name.value.toLowerCase() in storedPasswords) {
            alert("You already have this account stored!");
            resetDisplay();
            return authenticate();
        }
    } catch {} */

    // reset the table display to normal
    if (document.getElementById("warning")) {
        document.getElementById("warning").style.display = "None";
        document.getElementById("reg").style.top = "";
    }

    //Encryption of password with Salt Value
    var salt = "saltValue";
    var password2 = password.value;
    //var encryptedPassword = CryptoJS.AES.encrypt(password2, pairId).toString();
    var encryptedPassword = password2;
    //alert(encryptedPassword);

    //Decryption of Password

    // if passwords is null, create it
    if (!storedPasswords) {
        storedPasswords = {};
    }

    // add the entry to the JSON object stored on the user's computer
    storedPasswords[name.value.toLowerCase()] = {
        "username": user.value,
        "password": password.value
    };

    console.log("Beginning messaging.");
	var token = await getLocalToken();
	var message = {
		"site": name.value,
		"username": user.value,
		"pass": encryptedPassword,
	}
	chrome.storage.local.get("phoneToken", function(phoneTokenObj) {
		phoneToken = phoneTokenObj['phoneToken'];
		sendToPhone("newPass", message, phoneToken, token);
	});
	usernameList();
    /*try {
        var deviceID = "1"; //localStorage.getItem("deviceID");
        var message = {
            "data": {
                "site": name.value,
                "username": user.value,
                "password": encryptedPassword,
                "return_token": token
            },
            "to": token
        }
        console.log("Retrieved token");

        var Http = new XMLHttpRequest();
        Http.onreadystatechange = function() {
            if (Http.readyState == XMLHttpRequest.DONE) {
                console.log(Http.responseText);
            }
        }

        const url = "https://fcm.googleapis.com/fcm/send";
        Http.open("POST", url);
        Http.setRequestHeader("Content-Type", "application/json");
        Http.setRequestHeader("Authorization", "key=AIzaSyDyQIKrg4kkkXXf72nnCL2Yq5TSMIJQEJE");
        console.log(message);
        var jsonMsg = JSON.stringify(message);
        Http.send(jsonMsg);
        console.log(jsonMsg);
        console.log(Http.response);
        console.log("Sent message");
    } catch (error) {
        console.error(error);
    }
    console.log("Completed messaging.");
    localStorage.setItem(key, JSON.stringify(storedPasswords));
    resetDisplay();
    var qr_string = user.value + ":" + encryptedPassword;
    document.getElementById("addpassqr_block").style.display = "block";
    document.getElementById("addpassqr").innerHTML = "";
    new QRCode(document.getElementById("addpassqr"), qr_string);
*/
    // Show QR code pairing
    // redraw
    //authenticate();
}


/*
 * Goes to existing Account pages  
 */
function goToSitePage(row) {
    // get the site div and load the values into it
    var site = document.getElementById("sitePage");
    site.querySelector("#siteTitle").innerHTML = row.querySelector(".name").innerHTML
    site.querySelector("#siteUser").value = row.querySelector(".user").innerHTML;
    site.querySelector("#sitePass").value = row.querySelector(".pass").innerHTML;

    // change which div is displayed to the user
    document.getElementById("lister").style.display = "none";
    document.getElementById("sitePage").style.display = "block";
}


// returns from a site's page back to the screen that lists all their accounts
function goBack() {
    document.getElementById("sitePage").style.display = "none";
    resetDisplay();
    authenticate();
}


/*
 * Takes the site being currently displayed and deletes its entry in the user's
 * saved entries then brings them back to the list screen.
 */
function remover() {
    delete storedPasswords[document.getElementById("siteTitle").innerHTML];
    document.getElementById("sitePage").style.display = "None";
    localStorage.setItem(key, JSON.stringify(storedPasswords));
    resetDisplay();
    authenticate();
}

function sendToPhone(type, message, token, myToken) {

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
    console.log("--- SendToPhone ---");
    console.log(type);
    console.log(message)
    console.log(token);
    console.log(myToken);
    console.log("-------------------");

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
        "to": "ExponentPushToken[" + token + "]" // phone token (phone id)
    }

    const url = "https://cors-anywhere.herokuapp.com/https://exp.host/--/api/v2/push/send";

    Http.open("POST", url);
    //Http.setRequestHeader("Host", "exp.host");
    Http.setRequestHeader("Accept", "application/json");
    //Http.setRequestHeader("Accept-Encoding", "gzip, deflate");
    Http.setRequestHeader("Content-Type", "application/json");

    //console.log(message);

    var jsonMsg = JSON.stringify(payload);

    Http.send(jsonMsg);
}