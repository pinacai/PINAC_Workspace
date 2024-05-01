import { app, shell, BrowserWindow, screen, ipcMain } from 'electron'
import { spawn } from 'child_process'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let pythonProcess = null

const createWindow = () => {
  // Get the primary display's work area size (usable area)
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.5),
    height: height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Spawn the Python process
  pythonProcess = spawn('python', ['python_src/main.py'])

  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString())
  })

  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString())
  })

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }

  // Terminate the Python process
  if (pythonProcess) {
    pythonProcess.kill()
  }
})

// IPC btw React & Electron
ipcMain.on('input-value', (event, data) => {
  console.log(data)
  socket.emit('message', 'Hello from Electron!')
  event.reply('input-value-reply', 'Hello from main process!')
})

// Establishing Real time communication with Python using Socket
const io = require('socket.io-client')
const socket = io('http://localhost:5000')

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('data_event', (data) => {
  console.log(`Received data: ${JSON.stringify(data)}`)
})
