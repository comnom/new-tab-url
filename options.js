function saveURL(event) {
	event.preventDefault();
	var newURL = document.querySelector("#newTabURL").value;
	browser.storage.local.set({url: newURL});
}

function restoreOptions() {
	function setURL(result) {
		document.querySelector("#newTabURL").value = result.url || "about:home";
	}
	
	function doError(error) {
		console.log(error);
	}
	
	var getURL = browser.storage.local.get("url");
	getURL.then(setURL, doError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveURL);
