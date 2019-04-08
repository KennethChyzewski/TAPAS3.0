function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}

function findUsername(source) {
	
	var script = document.createElement('script');script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";document.getElementsByTagName('head')[0].appendChild(script);
	console.log(source);
	var query = source.querySelectorAll('input');
	var last = query.item(0);
	var value = "";
	query.forEach(function (input) {
		if (input.type=="password") {
			value = $(last).val();
			return;
		} else {
			last = input;
		}
	});
	console.log(value);
	return value;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});

/*chrome.runtime.sendMessage({
	action: "getUsername",
	username: findUsername(document)
});*/