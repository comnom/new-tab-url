// Array of window ids used this session.
const sessionWindows = [];



// Class representing a session window's id and whether 
// we should allow redirection.
class windowFlags {
	constructor(id, isNew) {
		this.id = id;
		this.isNew = isNew;
	}
}


function getSessionWindow(id) {
	let window = null;
	for (i = 0; i < sessionWindows.length; i++) {
		if (sessionWindows[i].id == id) {
			window = sessionWindows[i];
			break;
		}
	}
	return window;
}


function pushSessionWindow(id, isNew) {
	sessionWindows.push(new windowFlags(id, isNew));
}



// Store the id for the main window.
async function setMainWindow() {
	let window = await browser.windows.getCurrent().catch((error) => 
		{console.log(error);});
		
	if (window !== undefined)
		pushSessionWindow(window.id, false);
}



async function checkTab(tab) {
	if (tab.openerTabId || tab.TAB_ID_NONE)
		return;
	
	if (tab.title == "New Tab") {
		const parentWindow = getSessionWindow(tab.windowId);
		if (parentWindow === null) {
			pushSessionWindow(tab.windowId, false);
			return;
		}
		else if (parentWindow.isNew) {
			parentWindow.isNew = false;
			return;
		}
		
		let urlResult = await browser.storage.local.get("url").catch((error) =>
			{console.log(error);});
			
		if (urlResult !== undefined)
			browser.tabs.update(tab.id, {url: urlResult.url, loadReplace: true});
	}
}



// Reset a windows "isNew" status if it gets removed.
// This is just to guard against redirecting restored windows first tabs.

// Note: The default restore closed window doesn't seem to need this,
// but I'm not sure if other methods of restoring windows (ie extensions) will.
function toggleWindow(windowId) {
	const window = getSessionWindow(windowId);
	if (window !== null)
		window.isNew = true;
}



browser.tabs.onCreated.addListener(checkTab);
browser.windows.onRemoved.addListener(toggleWindow);
setMainWindow();
