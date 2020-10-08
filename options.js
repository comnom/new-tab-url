/* options.js */

"use strict";



function saveURL(event) {
	event.preventDefault();
	const newURL = document.querySelector("#newTabURL").value || "about:home";
	browser.storage.local.set({url: newURL});
}



async function restoreOptions() {
	const urlResult = await browser.storage.local.get("url").catch((error) =>
		{console.log(error);});
		
	const selector = document.querySelector("#newTabURL");
	if (urlResult !== undefined)
		selector.value = urlResult.url || "about:home";
	else
		selector.value = "about:home";
}



document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveURL);
