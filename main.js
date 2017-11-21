/*
	explicitly opening a new tab:
		the + button  		- new tab opens, onCreated fires
		ctrl T        		- new tab opens, onCreated fires
		
	via links:
		a target=_blank 	- new tab opens, onCreated fires
		middle mouse  		- new tab opens, onCreated does not fire
		context menu		- new tab opens, onCreated does not fire
		ctrl click			- new tab opens, onCreated does not fire
		
	"suprise" new tabs:
		undo closed tab		- new tab opens, onCreated fires
*/

function checkTab(tab) {
	function redirectTab(result) {
		browser.tabs.update(tab.id, {url: result.url})
	}
	
	function doError(error) {
		console.log(error);
	}
	
	if (tab.title == "New Tab") {
		if (tab.openerTabId) {
			return;
		}
		var getURL = browser.storage.local.get("url");
		getURL.then(redirectTab, doError);
	}
}

browser.tabs.onCreated.addListener(checkTab);
