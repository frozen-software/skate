const electron = require("electron").remote;
const { ipcRenderer } = require("electron");
const URL = require("url");

const key = electron.globalShortcut;
const w = $("webview")[0];

var protocol = "http";

$(document).ready(() => {
	// Webview DOM ready
	w.addEventListener("dom-ready", () => {
		w.setUserAgent(
			w.getUserAgent().replace(" Electron/4.0.0", "").replace("skate", "SkateBrowser")
		);
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

	// Received a message from preload
	w.addEventListener("ipc-message", (e) => {

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
			var v = $("input").val();
			w.loadURL(v);
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
				var v = $("input").val();
				w.loadURL(v);
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

	// Context menu
	$('body').materialMenu('init', {
		items: [
			{
				type: 'normal',
				text: 'Add Bookmark'
			},
			{
				type: 'divider'
			},
			{
				type: 'normal',
				text: 'Inspect Element'
			},
			{
				type: 'normal',
				text: 'Exit'
			}
		],
		position: '',
		animationSpeed: 100
	}).bind('contextmenu', (e) => {
		/*$('body').materialMenu('open', e, {
			noclip: true
		});*/
	});
});