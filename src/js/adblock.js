const { client, containsAds, initialize } = require("contains-ads");

initialize({
	privacy: true,
	ads: true,
}).then(() => {
	$("webview")[0].getWebContents().session.webRequest.onBeforeRequest((i, cb) => {
		const url = i.url;
		if (containsAds(url)) {
			cb({ cancel: true });
		} else {
			cb({ cancel: false });
		}
	});

	$("webview")[0].addEventListener("ipc-message", (event) => {
		if (event.channel == "close_context_menu") {
			$('body').materialMenu("close", {
				delete: true
			});
			$('.menu').materialMenu('close');
		}
	});

	$("webview")[0].getWebContents().on("context-menu", (e, p) => {
		var event = {
			pageX: p.x,
			pageY: p.y
		}

		$('body').materialMenu("close", {
			delete: true
		});

		// Context menu
		$('body').materialMenu('init', {
			items: [
				// Navigation
				{
					type: 'normal',
					text: 'Back',
					visible: $("webview")[0].canGoBack(),
					click: () => {
						$("webview")[0].goBack();
					}
				},
				{
					type: 'normal',
					text: 'Reload',
					click: () => {
						$("webview")[0].reload();
					}
				},
				{
					type: 'normal',
					text: 'Forward',
					visible: $("webview")[0].canGoForward(),
					click: () => {
						$("webview")[0].goForward();
					}
				},
				// Media
				{
					type: 'divider',
					visible: (p.mediaType == 'image')
				},
				{
					type: 'normal',
					text: 'View Image',
					visible: (p.mediaType == 'image'),
					click: () => {
						$("webview")[0].loadURL(p.srcURL);
					}
				},
				// Dev
				{
					type: 'divider'
				},
				{
					type: 'normal',
					text: 'Inspect Element',
					click: () => {
						$("webview")[0].getWebContents().toggleDevTools()
					}
				}
			],
			position: '',
			animationSpeed: 50
		});
		$('body').materialMenu('open', event, {
			noclip: true,
			delete: true
		});
	});
});
