import { app, BrowserWindow, screen, ipcMain, shell, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as fs from "fs";
import SecureTokenManager from "./utilis/tokenManager";
import SecureMasterKeyManager from "./utilis/masterKeyManager";
import { refreshIdToken } from "./utilis/authManager";
import askLocalLLM from "./model/ollama";
import applyPrompt from "./prompt";

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

let mainWindow: BrowserWindow | null;

const userDataPath = app.getPath("userData");
const sizeFile = path.join(userDataPath, "window-size.json");

//
// Returns the default window size
const getDefaultSize = (): { width: number; height: number } => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return { width, height }; // max-window
};

// Retrieves the saved window size
const getSavedSize = (): { width: number; height: number } | null => {
  if (fs.existsSync(sizeFile)) {
    const sizeData = fs.readFileSync(sizeFile);
    return JSON.parse(sizeData.toString());
  }
  return null;
};

// Saves the current window size to a file
const saveSize = (width: number, height: number): void => {
  fs.writeFileSync(sizeFile, JSON.stringify({ width, height }));
};

//
const createMainWindow = () => {
  const savedSize = getSavedSize();
  const defaultSize = getDefaultSize();

  const { width, height } = savedSize || defaultSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    icon: "public/icon/Round App Logo.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Save the window size when it is resized.
  mainWindow.on("resize", () => {
    if (mainWindow) {
      saveSize(mainWindow.getBounds().width, mainWindow.getBounds().height);
    }
  });
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.whenReady().then(() => {
  createMainWindow();
});

// ================================================== //
//      Initialize TokenManager with the key          //
// ================================================== //

const masterKey = SecureMasterKeyManager.getPersistentMasterKey();
const derivedKey = SecureMasterKeyManager.deriveMasterKey(masterKey); // Derive an additional key for extra security
const tokenManager = new SecureTokenManager(derivedKey);

// ============================================= //
//                 Cloud Server                  //
// ============================================= //

const callRegularAiServer = async (input: string) => {
  const idToken = tokenManager.retrieveToken("idToken") || "";
  const response = await fetch(
    "https://pinacworkspace.pages.dev/api/chat/regular",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        messages: [],
        userInput: input,
      }),
    }
  );
  return await response.json();
};

// ======================================================================== //
//        frontend request to backend (for backend functionalities)          //
// ======================================================================== //

// Initial Auth Checking
ipcMain.on("check", (event) => {
  const status = tokenManager.hasToken("idToken");
  event.reply("auth-response", { status: status });
});

ipcMain.on("logout", () => {
  fs.unlink(path.join(userDataPath, "user-info.json"), () => {});
  tokenManager.clearAllTokens();
});

ipcMain.on("give-user-info", (event) => {
  fs.readFile(path.join(userDataPath, "user-info.json"), "utf8", (_, data) => {
    try {
      const userData = JSON.parse(data);
      event.reply("backend-response", userData);
    } catch {
      const userData = {
        displayName: null,
        email: null,
        bio: null,
      };
      event.reply("backend-response", userData);
    }
  });
});

ipcMain.on("save-user-info", (event, userInfo) => {
  const userInfoJson = JSON.stringify(userInfo);
  fs.writeFileSync(path.join(userDataPath, "user-info.json"), userInfoJson);
  event.reply("backend-response", {
    error_occurred: false,
    response: true,
    error: null,
  });
});

ipcMain.on("upload-file", (event, request) => {
  const base64Data = request.file_data;
  const fileName = request.file_name;
  const filePath = `${userDataPath}/profileImg/${fileName}`;

  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      event.reply("backend-response", {
        error_occurred: true,
        response: false,
        error: err,
      });
    } else {
      event.reply("backend-response", {
        error_occurred: false,
        response: true,
        error: null,
      });
    }
  });
});

// Reload the app
ipcMain.on("reload-app", () => {
  mainWindow?.reload();
});

// Listen for toggling Window Size
ipcMain.on("maximizeWindow", () => {
  mainWindow?.maximize();
});

ipcMain.on("unmaximizeWindow", () => {
  mainWindow?.unmaximize();
});

// IPC listener to open external links
ipcMain.on("open-external-link", (_, url) => {
  shell.openExternal(url);
});

// ======================================================= //
//              Frontend request for Server                //
// ======================================================= //

ipcMain.on("request-to-server", async (event, request) => {
  //
  const sendResponse = (
    error: boolean,
    content?: string,
    errorMessage?: string
  ) => {
    event.reply("server-response", {
      error_occurred: error,
      response: content ? { type: "others", content } : null,
      error: errorMessage || null,
    });
  };
  //
  if (request.preferred_model_type == "Cloud LLM") {
    try {
      let response = await callRegularAiServer(request.user_query);

      if (response.assistant) {
        sendResponse(false, response.assistant);
        return;
      }

      if (response.code === "TOKEN_EXPIRED") {
        try {
          await refreshIdToken(tokenManager);
          response = await callRegularAiServer(request.user_query);

          if (response.assistant) {
            sendResponse(false, response.assistant);
            return;
          }
          sendResponse(true, undefined, response.message);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          if (error.message === "TOKEN_EXPIRED") {
            sendResponse(
              true,
              undefined,
              "You are logged out. Please login again."
            );
            return;
          }
          sendResponse(true, undefined, `${error}`);
          return;
        }
      }
      sendResponse(true, undefined, response.message);
    } catch (error) {
      sendResponse(true, undefined, `${error}`);
    }
  }
  //
  else if (request.preferred_model_type == "Private LLM") {
    const prompt = request.prompt;
    const finalPrompt = applyPrompt(prompt, request.user_query);
    const response: object = await askLocalLLM(
      request.preferred_model,
      finalPrompt,
      request.image_path
    );
    event.reply("server-response", response);
  }
});

// =========================================================================== //
//                                                                             //
//                      Authentication using Deep Link                         //
//                                                                             //
// =========================================================================== //

// Registering app's custom protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("pinac-workspace", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("pinac-workspace");
}

// Handle protocol when app is already running
// for Windows and Linux
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_, commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    const url = commandLine.pop();
    if (url) {
      parseAuthDataFromUrl(url);
    } else {
      dialog.showErrorBox(
        "Error",
        "Something went wrong, unable to authenticate. Please try again."
      );
    }
  });
}

// Handle protocol if app is already running
// for MacOS
app.on("open-url", (event, url) => {
  event.preventDefault();
  parseAuthDataFromUrl(url);
});

//
//   Parse Auth data from URL   //
// ============================ //

const parseAuthDataFromUrl = (url: string) => {
  const urlObj = new URL(url);
  const encodedData = urlObj.searchParams.get("data");
  if (encodedData) {
    const authData = JSON.parse(decodeURIComponent(encodedData));
    //  Storing user-info  //
    // ------------------- //
    const userInfo = {
      displayName: authData.displayName,
      email: authData.email,
      bio: "",
      photoURL: authData.photoUrl,
    };
    const userInfoJson = JSON.stringify(userInfo);
    fs.writeFileSync(path.join(userDataPath, "user-info.json"), userInfoJson);
    //    Storing TOKEN  //
    // ----------------- //
    try {
      tokenManager.storeToken("idToken", authData.idToken);
      tokenManager.storeToken("refreshToken", authData.refreshToken);
      tokenManager.storeToken("webApiKey", authData.webApiKey);
      mainWindow?.reload(); // Reload the app
    } catch (error) {
      console.error("Token handling error:", error);
    }
  } else {
    dialog.showErrorBox(
      "Error",
      "Something went wrong, unable to authenticate. Please try again."
    );
  }
};
