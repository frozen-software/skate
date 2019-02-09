import { app, BrowserWindow, BrowserView, ipcMain } from 'electron';

if (require('electron-squirrel-startup')) {
	app.quit();
}

let mainWindow;
let view = {};

const createWindow = () => {
	mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: true
		},
		frame: true
	});

	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.webContents.openDevTools();

	/*
	view.content = new BrowserView({
		webPreferences: {
			nodeIntegration: false
		}
	});
	mainWindow.setBrowserView(view.content);

	ipcMain.on('size-content', (event, arg) => {
		console.log(arg.height);
		view.content.setBounds(arg);
	})

	view.content.setBounds({
		x: 0,
		y: 50,
		width: 100,
		height: 100
	});
	view.content.setAutoResize({
		width: true
	});
	view.content.webContents.loadURL('https://electronjs.org')
	*/

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
