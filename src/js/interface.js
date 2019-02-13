const electron = require("electron").remote;
const { ipcRenderer } = require("electron");
const URL = require("url");
const { makeUrl } = require("./js/filter.js");

const key = electron.globalShortcut;
const w = $("webview")[0];

var protocol = "http";

const search = () => {
	var v = $("input").val();
	w.loadURL(makeUrl(v));
}

$(document).ready(() => {
	// Webview DOM ready
	w.addEventListener("dom-ready", () => {
		w.setUserAgent(
			w.getUserAgent().replace(" Electron/4.0.0", "").replace("skate", "SkateBrowser")
		);
		$("webview")[0].getWebContents().insertCSS(`
			::-webkit-scrollbar {     
				background-color: rgba(212, 212, 212, 1);
				width: 14px;
				height: 14px;
				display: block;
			}

			::-webkit-scrollbar-thumb:window-inactive,
			::-webkit-scrollbar-thumb {
        		background: #6f6f6f;
    			border: 2px solid rgb(212, 212, 212);
			}
		`);
	});

	// Page finished
	w.addEventListener("did-finish-load", () => {
		$("input").val(w.getURL());
		// Forward button
		if (!w.canGoForward()) {
			$(".forward").attr("disabled", true);
		} else {
			$(".forward").attr("disabled", false);
		}
		// Backward button
		if (!w.canGoBack()) {
			$(".back").attr("disabled", true);
		} else {
			$(".back").attr("disabled", false);
		}
	});

	w.addEventListener("did-start-loading", () => {
		$(".loading").css({ display: "initial" });
		$(".http").css({ display: "none" });
		$(".https").css({ display: "none" });
		$(".error").css({ display: "none" });
		$(".file").css({ display: "none" });
	});

	w.addEventListener("did-stop-loading", () => {
		$(".loading").css({ display: "none" });
		$("." + protocol).css({ display: "initial" });
	});

	// Loaded an asset
	w.addEventListener("did-navigate", (opts) => {
		$("input").val(w.getURL());
		const p = URL.parse(opts.url).protocol;
		console.log(p);
		if (p == "https:" || p == "ftps:" || p == "wss:") {
			protocol = "https";
			$(".https").css({ display: "initial" });
			$(".http").css({ display: "none" });
			$(".error").css({ display: "none" });
			$(".loading").css({ display: "none" });
		} else {
			protocol = "http";
			$(".http").css({ display: "initial" });
			$(".https").css({ display: "none" });
			$(".error").css({ display: "none" });
			$(".loading").css({ display: "none" });
		}
		if (p == "file:") {
			$("." + protocol).css({ display: "none" });
			protocol = "file";
			$(".file").css({ display: "initial" });
		}
	});

	w.addEventListener("did-navigate-inside-page", (opts) => {
		$("input").val(opts.url);
	});

	// Search bar functions
	(() => {
		// Search button
		$(".search").click(() => {
			search();
		});

		// Refresh button
		$(".refresh").click(() => {
			w.reload();
		});

		// Back button
		$(".back").click(() => {
			if (w.canGoBack()) {
				w.goBack()
			}
		});

		// Forward button
		$(".forward").click(() => {
			if (w.canGoForward()) {
				w.goForward()
			}
		});

		// Enter key
		$("input").on("keypress", (e) => {
			if (e.which === 13) {
				search();
			}
		});
	})();

	// Ripple effects
	$("button").ripple();
	$(".input").ripple();

	// More menu
	$('.menu').materialMenu('init', {
		position: 'overlay',
		items: [
			{
				type: 'normal',
				text: 'Settings',
				click: () => {
					console.log("Settings");
				}
			},
			{
				type: 'divider'
			},
			{
				type: 'normal',
				text: 'Toggle DevTools',
				click: () => {
					electron.getCurrentWindow().webContents.toggleDevTools();
				}
			},
			{
				type: 'normal',
				text: 'Exit'
			},
		]
	}).click(() => {
		$('.menu').materialMenu('open');
	});
});