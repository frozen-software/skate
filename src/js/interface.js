var electron = require("electron").remote;
var { ipcRenderer } = require("electron");
var key = electron.globalShortcut;

var mouse;
var resizeC = () => {
    /*ipcRenderer.send('size-content', {
        x: 0,
        y: 50,
        width: window.innerWidth,
        height: $(".content").height(),
    })*/
};

$(document).ready(() => {
    resizeC();

    $(".search").click(() => {
        var v = $("input").val();
        $("webview")[0].loadURL(v);
    });
    $(".refresh").click(() => {
        $("webview")[0].reload();
    });
    $(".back").click(() => {
        if ($("webview")[0].canGoBack()) {
            $("webview")[0].goBack()
        }
    });
    $(".forward").click(() => {
        if ($("webview")[0].canGoForward()) {
            $("webview")[0].goForward()
        }
    });
    $("input").on("keypress", (e) => {
        if (e.which === 13) {
            var v = $("input").val();
            $("webview")[0].loadURL(v);
        }
    });

    $("webview")[0].addEventListener("dom-ready", () => {

    });
    $("webview")[0].addEventListener("did-finish-load", () => {
        $("input").val($("webview")[0].getURL());
        if (!$("webview")[0].canGoForward()) {
            $(".forward").attr("disabled", true);
        } else {
            $(".forward").attr("disabled", false);
        }
        if (!$("webview")[0].canGoBack()) {
            $(".back").attr("disabled", true);
        } else {
            $(".back").attr("disabled", false);
        }
    });
    $("webview")[0].addEventListener("ipc-message", (e) => {
        if (e.channel == "mouse") {

        }
    });
    $("webview")[0].addEventListener("did-navigate", () => {
        $("input").val($("webview")[0].getURL());
    });
    $("button").ripple();
    $(".input").ripple();
    $('#menu').materialMenu('init', {
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
                text: 'Exit'
            },
        ]
    }).click(function () {
        $(this).materialMenu('open');
    });
    $('body').on('mousemove', (e) => {
        mouse = e;
    });
    // Right click menu
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

    $(window).on("resize", resizeC);
});