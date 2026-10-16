
const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const isDev = !app.isPackaged;

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 960,
        minHeight: 600,
        title: 'Windfall TD',
        backgroundColor: '#222222',
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (isDev) {
        win.loadURL('http://localhost:8080');
    } else {
        win.loadFile(
            path.join(__dirname, '..', 'dist', 'index.html')
        );
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
