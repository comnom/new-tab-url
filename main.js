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
		new window			- windows.onCreated fires, 
								new tab opens, tabs.onCreated fires
*/



// Array of window ids used this session.
var sessionWindows = [];



// Class representing a session window's id and whether 
// we should allow redirection.
class windowFlags {
	constructor(id, isNew) {
		this.id = id;
		this.isNew = isNew;
	}
}



// Cheesy error handling.
function doError(error) {
	console.log(error);
}



// Store the id for the main window.
function setMainWindow(window) {
	var mainWindow = new windowFlags(window.id, false);
	sessionWindows.push(mainWindow)
}


var getMainWindow = browser.windows.getCurrent();
getMainWindow.then(setMainWindow);



function checkTab(tab) {
	function redirectTab(result) {
		browser.tabs.update(tab.id, {url: result.url, loadReplace: true});
	}
	
	if (tab.title == "New Tab") {
		if (tab.openerTabId || tab.TAB_ID_NONE) {
			return;
		}
		
		// Handle the first instance of a newly opened window.
		var hasWindow = false;
		for (i = 0; i < sessionWindows.length; i++) {
			if (sessionWindows[i].id == tab.windowId) {
				hasWindow = true;
				if (sessionWindows[i].isNew) {
					sessionWindows[i].isNew = false;
					return;
				}
				else {
					break;
				}
			}
		}
		if (!hasWindow) {
			var newWindow = new windowFlags(tab.windowId, false);
			sessionWindows.push(newWindow);
			return;
		}
		
		var getURL = browser.storage.local.get("url");
		getURL.then(redirectTab, doError);
	}
}



// Reset a windows "isNew" status if it gets removed.
// This is just to guard against redirecting restored windows first tabs.

// Note: The default restore closed window doesn't seem to need this,
// but I'm not sure if other methods of restoring windows (ie extensions) will.
function toggleWindow(windowId) {
	for (i = 0; i < sessionWindows.length; i++) {
		if (sessionWindows[i].id == windowId) {
			sessionWindows[i].isNew = true;
		}
	}
}



browser.tabs.onCreated.addListener(checkTab);
browser.windows.onRemoved.addListener(toggleWindow);
