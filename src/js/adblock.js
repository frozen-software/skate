const { client, containsAds, initialize } = require("contains-ads");

initialize().then(() => {
    $("webview")[0].getWebContents().session.webRequest.onBeforeRequest((i, cb) => {
        const url = i.url;
        if (containsAds(url)) {
            cb({ cancel: true });
        } else {
            cb({ cancel: false });
        }
    });
});