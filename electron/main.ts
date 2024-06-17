import { app, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
// import { spawn } from "child_process";
import path from "node:path";
// import * as fs from "fs";
import "../backend/main";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

// let loginWindow: BrowserWindow | null;
let loadingWindow: BrowserWindow | null;
let win: BrowserWindow | null;
// let pythonProcess = null;

//
// const createLoginWindow = () => {
//   if (loadingWindow) {
//     loadingWindow.close();
//     loadingWindow = null;
//   }
//   const primaryDisplay = screen.getPrimaryDisplay();
//   const { width, height } = primaryDisplay.workAreaSize;
//   // Create the browser window.
//   loginWindow = new BrowserWindow({
//     width: width,
//     height: height,
//     autoHideMenuBar: true,
//     resizable: false,
//     show: false,
//   });
//   loginWindow.loadFile("login.html");
//   loginWindow.on("ready-to-show", () => {
//     loginWindow?.show();
//   });
// };

//
const createLoadingWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const windowX = width - 20;
  // Create the browser window.
  loadingWindow = new BrowserWindow({
    width: 320,
    height: height,
    x: windowX,
    y: 20,
    autoHideMenuBar: true,
    // frame: false,
    // resizable: false,
    show: false,
  });
  loadingWindow.loadFile("loading.html");
  loadingWindow.on("ready-to-show", () => {
    loadingWindow?.show();
  });
};

//
const createMainWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const windowX = width - 20;
  // Create the browser window.
  win = new BrowserWindow({
    width: 320,
    height: height,
    x: windowX,
    y: 20,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      sandbox: true,
      contextIsolation: true,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // // Spawn the Python process
  // pythonProcess = spawn("python", ["backend/server/main.py"]);

  // pythonProcess.stdout.on("data", (data) => {
  //   console.log(data.toString());
  // });

  // pythonProcess.stderr.on("data", (data) => {
  //   console.error(data.toString());
  // });

  // pythonProcess.on("close", (code) => {
  //   console.log(`Python script exited with code ${code}`);
  // });
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  // localStorage.removeItem('preferred-theme')
  // localStorage.removeItem('preferred-theme-pair')
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
  // // Terminate the Python process
  // if (pythonProcess) {
  //   pythonProcess.kill();
  // }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.whenReady().then(() => {
  createLoadingWindow();
  // fs.existsSync("backend/user data/.env")
  //   ? createMainWindow()
  //   : createLoginWindow();
  createMainWindow();
});
