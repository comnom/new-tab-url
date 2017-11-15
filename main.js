function checkTab(tab) {
	function redirectTab(result) {
		browser.tabs.update(tab.id, {url: result.url})
	}
	
	function doError(error) {
		console.error(error);
	}
	
	if (tab.title == "New Tab") {
		var getURL = browser.storage.local.get("url");
		getURL.then(redirectTab, doError);
	}
}

browser.tabs.onCreated.addListener(checkTab);
