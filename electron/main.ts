import { app, BrowserWindow, screen, ipcMain, shell, dialog } from "electron";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import path from "node:path";
import * as fs from "fs";
import SecureTokenManager from "./utilis/tokenManager";
import SecureMasterKeyManager from "./utilis/masterKeyManager";
import { refreshIdToken } from "./utilis/authManager";
// @ts-ignore
import findFreePort from "find-free-port";
import isDev from "electron-is-dev";
import { ChildProcessWithoutNullStreams } from "child_process";

//
// ====================================================== //
//         Functions to Manage Python Backend             //
// ====================================================== //

let pythonProcess: ChildProcessWithoutNullStreams | null;
// @ts-ignore
let backendPort: number | null;

const startPythonBackend = async () => {
  try {
    // Find an available port
    const [port] = await findFreePort(5000);
    backendPort = port;

    console.log(`Starting Python backend on port ${port}`);

    let pythonCommand;
    let pythonArgs;
    let pythonOptions;

    if (isDev) {
      if (process.platform === "win32") {
        // Windows
        pythonCommand = path.join(
          __dirname,
          "..",
          "backend",
          "venv",
          "Scripts",
          "python.exe"
        );
      } else {
        // macOS/Linux
        pythonCommand = path.join(
          __dirname,
          "..",
          "backend",
          "venv",
          "bin",
          "python"
        );
      }

      pythonArgs = [
        path.join(__dirname, "..", "backend", "app.py"),
        "--port",
        port.toString(),
      ];

      pythonOptions = {
        cwd: path.join(__dirname, "..", "backend"),
      };
    } else {
      // Production: Use the packaged Python executable
      if (process.platform === "win32") {
        pythonCommand = path.join(process.resourcesPath, "backend", "app.exe");
      } else {
        pythonCommand = path.join(process.resourcesPath, "backend", "app");
      }

      pythonArgs = ["--port", port.toString()];

      pythonOptions = {
        cwd: path.join(process.resourcesPath, "backend"),
      };
    }

    // Create environment variables - pass the port
    const env = { ...process.env, PORT: port.toString() };
    // @ts-ignore
    pythonOptions.env = env;

    // Spawn the Python process
    pythonProcess = spawn(pythonCommand, pythonArgs, pythonOptions);

    // Handle Python process output
    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python backend: ${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python backend error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python backend process exited with code ${code}`);
      pythonProcess = null;
    });

    // Return the port for the frontend to use
    return port;
  } catch (error) {
    console.error("Failed to start Python backend:", error);
    app.quit();
  }
};

//
const stopPythonBackend = () => {
  if (pythonProcess) {
    console.log("Stopping Python backend");

    if (process.platform === "win32") {
      // On Windows, use taskkill to ensure all child processes are terminated
      spawn("taskkill", ["/pid", String(pythonProcess.pid), "/f", "/t"]);
    } else {
      // On macOS/Linux, use the kill command
      pythonProcess.kill();
    }

    pythonProcess = null;
  }
};

//
// ============================================================ //
//          Creating Main Window and Initializing App           //
// ============================================================ //

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
const createMainWindow = async () => {
  const savedSize = getSavedSize();
  const defaultSize = getDefaultSize();

  const { width, height } = savedSize || defaultSize;

  // Start Python backend first
  await startPythonBackend();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    minWidth: 768,
    minHeight: 600,
    frame: false,
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

// ======================================================================== //
//        frontend request to backend (for backend functionalities)          //
// ======================================================================== //

// Initial Auth Checking
ipcMain.on("check-auth-status", (event) => {
  const status = tokenManager.hasToken("idToken");
  event.reply("auth-response", { status: status });
});

ipcMain.on("get-backend-port", (event) => {
  event.reply("backend-port", backendPort);
});

ipcMain.on("get-id-token", (event) => {
  const idToken = tokenManager.retrieveToken("idToken");
  event.reply("backend-response", idToken);
});

ipcMain.on("get-refresh-token", (event) => {
  const refreshToken = tokenManager.retrieveToken("refreshToken");
  event.reply("backend-response", refreshToken);
});

ipcMain.on("get-web-api-key", (event) => {
  const webApiKey = tokenManager.retrieveToken("webApiKey");
  event.reply("backend-response", webApiKey);
});

ipcMain.on("logout", () => {
  fs.unlink(path.join(userDataPath, "user-info.json"), () => {});
  tokenManager.clearAllTokens();
});

ipcMain.on("get-user-info", (event) => {
  fs.readFile(path.join(userDataPath, "user-info.json"), "utf8", (_, data) => {
    try {
      const userData = JSON.parse(data);
      event.reply("backend-response", userData);
    } catch {
      const userData = {
        displayName: null,
        nickname: null,
        email: null,
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

ipcMain.handle("open-file-dialog", async (_, acceptedFileTypes) => {
  const filters = [];

  if (acceptedFileTypes && acceptedFileTypes.length > 0) {
    // Convert accepted types to dialog filters
    filters.push(...acceptedFileTypes);
  } else {
    filters.push({ name: "All Files", extensions: ["*"] }); // Default filter
  }

  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: filters,
  });
  if (!result.canceled) {
    return result.filePaths[0]; // Full path to selected file
  }
  return null;
});

//
ipcMain.on("reload-app", () => {
  mainWindow?.reload();
});

ipcMain.on("open-external-link", (_, url) => {
  shell.openExternal(url);
});

// to handle window controls
ipcMain.on("minimize", () => {
  mainWindow?.minimize();
});

ipcMain.on("maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on("close", () => {
  if (mainWindow) {
    // Set a flag to skip any confirmation dialogs or save prompts
    mainWindow.webContents.closeDevTools(); // Close any open DevTools which can slow down closure
    // For immediate visual feedback, hide the window first
    mainWindow.hide();
    // Force garbage collection of any resources
    if (global.gc) global.gc();
    // Destroy the window and quit the app in one go
    mainWindow.destroy();
    stopPythonBackend();
    if (process.platform !== "darwin") {
      app.exit(0); // More immediate than app.quit()
    }
  }
});

// ======================================================== //
//                 Requesting Cloud Server                  //
// ======================================================== //

ipcMain.handle("fetch-cloud-ai-stream", async (event, requestData) => {
  const handleStreamError = (message: string) => {
    console.error("Cloud AI request error:", message);
    event.sender.send("cloud-ai-stream-error", message);
  };

  const makeStreamRequest = async (idToken: string) => {
    try {
      const response = await fetch(
        "https://pinacworkspace.pages.dev/api/chat/regular",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      // Handle HTTP errors
      if (!response.ok) {
        // Check specifically for auth/token errors
        if (response.status === 401 || response.status === 403) {
          return {
            code: "TOKEN_EXPIRED",
            message: "Authentication token expired",
          };
        }
        const responseBody = await response.json();
        return {
          code: "SERVER_ERROR",
          message: `Status (${response.status}): ${
            responseBody.message ||
            responseBody.error ||
            "INTERNAL SERVER ERROR"
          }`,
        };
      }

      // For streaming responses
      if (!response.body) {
        return { code: "EMPTY_RESPONSE", message: "Response body is null" };
      }

      // Process the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // If there's anything left in the buffer, send it
            if (buffer.trim().length > 0) {
              event.sender.send("cloud-ai-stream-chunk", buffer);
            }

            // Signal that streaming is complete
            event.sender.send("cloud-ai-stream-done");
            break;
          }

          // Decode the chunk and add it to our buffer
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process complete SSE messages from the buffer
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);

            if (line.trim().length > 0) {
              event.sender.send("cloud-ai-stream-chunk", line);
            }
          }
        }
        return { code: "SUCCESS" };
      } catch (error: any) {
        return {
          code: "STREAM_PROCESSING_ERROR",
          message: error?.message || "Error processing stream data",
        };
      }
    } catch (error: any) {
      return {
        code: "FETCH_ERROR",
        message: error?.message || "Network error while contacting AI server",
      };
    }
  };

  try {
    // check for RAG
    if (requestData.rag) {
      const response = await fetch(
        `http://localhost:${backendPort}/api/rag/default-embedder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: requestData.prompt,
            rag: requestData.rag,
            documents_path: requestData.documents_path,
          }),
        }
      );
      const context = await response.json();
      requestData.prompt = `User query: ${requestData.prompt}\n\nAnswer the following question based on the provided context. If you cannot answer the question based on the context, say so.\n\nContext:\n${context}`;
    }
    // check for Web search
    else if (requestData.web_search && requestData.quick_search) {
      const response = await fetch(
        `http://localhost:${backendPort}/api/web/search/quick-search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: requestData.prompt,
          }),
        }
      );
      const searchResult = await response.json();
      requestData.prompt = `User query: ${requestData.prompt}\n\nI've searched the web for information to help answer this query. Here are the search results:\n\n${searchResult}\n\nBased on these search results, please provide a comprehensive and accurate answer to the user's query.\nIf the search results don't contain enough information, please say so and provide the best answer based on your knowledge, clearly indicating what information comes from the search results and what comes from your pre-existing knowledge.`;
    }

    // First attempt with existing token
    let idToken = tokenManager.retrieveToken("idToken") || "";
    let result = await makeStreamRequest(idToken);

    // If token expired, try refreshing it
    if (result.code === "TOKEN_EXPIRED") {
      try {
        await refreshIdToken(tokenManager);
        idToken = tokenManager.retrieveToken("idToken") || "";

        if (!idToken) {
          handleStreamError("Failed to refresh authentication token");
          throw new Error("Failed to refresh authentication token");
        }

        // Try again with the new token
        result = await makeStreamRequest(idToken);
      } catch (refreshError: any) {
        if (refreshError.message === "TOKEN_EXPIRED") {
          handleStreamError("You are logged out. Please login again.");
          throw new Error("You are logged out. Please login again.");
        }
        handleStreamError(`Token refresh failed: ${refreshError.message}`);
        throw refreshError;
      }
    }

    // Handle any remaining errors from the request
    if (result.code !== "SUCCESS") {
      handleStreamError(result.message);
      throw new Error(result.message);
    }

    return true;
  } catch (error: any) {
    // This catch handles any errors not already processed
    handleStreamError(error.message || "Unknown error occurred");
    throw error;
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
      nickname: "",
      email: authData.email,
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
