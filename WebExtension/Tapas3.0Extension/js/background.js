function onClickFunction(info, tab) {
	var frameId = info["frameId"];
	switch (info.menuItemId) {
		case contextEntries["password"]:
			insertPassword(tab.url, frameId);
			break;
	}
}

var contexts = ["editable"];
var menu = [];
for (var i = 0; i < contexts.length; i++) {
	var context = contexts[i];
	var title = "Tapas";
	var id = chrome.contextMenus.create({"title": title, "contexts": [context], "onclick": onClickFunction});
	menu[context] = id;
}
console.log("context.js");

var contextEntries = [];
contextEntries["password"] = chrome.contextMenus.create(
        {"title": "Insert Password", "parentId": menu["editable"], "contexts":[context], "onclick": onClickFunction});

//Passes the message onto the content script.
chrome.extension.onMessage.addListener(function (request) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
        chrome.tabs.sendMessage(tabs[0].id, request, () => {});
    });
});

//Listens for content sending message to popup
chrome.runtime.onMessage.addListener(
    function responder(request) {
        chrome.extension.sendMessage(request);
    });
	
