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

	$("webview")[0].getWebContents().on("context-menu", (e, p) => {
		var event = {
			pageX: p.x,
			pageY: p.y
		}
		// Context menu
		$('body').materialMenu('init', {
			items: [
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
					text: 'Forward',
					visible: $("webview")[0].canGoForward(),
					click: () => {
						$("webview")[0].goForward();
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
			animationSpeed: 100
		});
		$('body').materialMenu('open', event, {
			noclip: true,
			delete: true
		});
	});
});
