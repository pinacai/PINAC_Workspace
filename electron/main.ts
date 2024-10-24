import { app, BrowserWindow, screen, ipcMain, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as fs from "fs";
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

let win: BrowserWindow | null;

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
  win = new BrowserWindow({
    width: width,
    height: height,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Save the window size when it is resized.
  win.on("resize", () => {
    win && saveSize(win.getBounds().width, win.getBounds().height);
  });
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
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

// ============================================= //
//                 Cloud Server                  //
// ============================================= //

// development server
const callDevelopmentServer = async (input: string) => {
  const response = await fetch(
    `https://nexus-for-development.pinac.workers.dev/?input=${input}`
  );
  return await response.json();
};

// ======================================================================== //
//        frontend request to backend (for backend funtionalities)          //
// ======================================================================== //

ipcMain.on("request-to-backend", (event, request) => {
  if (request["request_type"] == "save-user-info") {
    try {
      const userInfo = {
        first_name: request["first_name"],
        last_name: request["last_name"],
        email_id: request["email_id"],
        bio: request["bio"],
        image: request["image"],
      };
      const userInfoJson = JSON.stringify(userInfo);
      fs.writeFileSync(path.join(userDataPath, "user-info.json"), userInfoJson);
      event.reply("backend-response", {
        error_occurred: false,
        response: true,
        error: null,
      });
    } catch (error: unknown) {
      event.reply("backend-response", {
        error_occurred: true,
        response: false,
        error: error,
      });
    }
  }
  //
  //
  else if (request["request_type"] == "give-user-info") {
    fs.readFile(
      path.join(userDataPath, "user-info.json"),
      "utf8",
      (_, data) => {
        try {
          const userData = JSON.parse(data);
          event.reply("backend-response", userData);
        } catch {
          const userData = {
            first_name: null,
            last_name: null,
            email_id: null,
            bio: null,
            OPENAI_API_KEY: null,
            GOOGLE_API_KEY: null,
          };
          event.reply("backend-response", userData);
        }
      }
    );
  }
  //
  //
  else if (request["request_type"] == "logout") {
    fs.unlink(path.join(userDataPath, "user-info.json"), () => {});
  }
  //
  //
  else if (request["request_type"] == "upload-file") {
    const base64Data = request["file_data"];
    const fileName = request["file_name"];
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
  }
});

// Reload the app
ipcMain.on("reload-app", () => {
  win?.reload();
});

// Listen for toggling Window Size
ipcMain.on("maximizeWindow", () => {
  win?.maximize();
});

ipcMain.on("unmaximizeWindow", () => {
  win?.unmaximize();
});

// IPC listener to open external links
ipcMain.on("open-external-link", (_, url) => {
  shell.openExternal(url);
});

// ======================================================= //
//              Frontend request for Server                //
// ======================================================= //

ipcMain.on("request-to-server", async (event, request) => {
  const prompt = request["prompt"];
  const final_prompt = applyPrompt(prompt, request["user_query"]);
  //
  //
  if (request["preferred_model_type"] == "Cloud LLM") {
    const input = final_prompt.replace(" ", "+");
    const ai_response: any = await callDevelopmentServer(input);
    const response = {
      error_occurred: false,
      response: { type: "others", content: ai_response[0].response.response },
      error: null,
    };
    event.reply("server-response", response);
  }
  //
  else if (request["preferred_model_type"] == "Private LLM") {
    const response: object = await askLocalLLM(
      request["preferred_model"],
      final_prompt
    );
    event.reply("server-response", response);
  }
});
