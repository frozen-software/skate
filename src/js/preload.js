var { ipcRenderer } = require("electron");

window.onload = () => {
    document.body.onclick = () => {
        console.log("hi");
        ipcRenderer.sendToHost("close_context_menu");
    };
};