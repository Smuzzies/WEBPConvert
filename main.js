const { app, BrowserWindow, ipcMain, contextBridge } = require('electron');
const sharp = require('sharp');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    frame: false,
    width: 500,
    height: 400,
    resizable: false, // Disable window resizing
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true, // Hide the menu bar
  });
  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();

  ipcMain.on('convert-image', (event, filePath) => {
    const outputFilePath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    sharp(filePath)
      .webp()
      .toFile(outputFilePath, (err) => {
        if (err) {
          event.sender.send('conversion-error', err.message);
        } else {
          event.sender.send('conversion-success', outputFilePath);
        }
      });
  });
});
