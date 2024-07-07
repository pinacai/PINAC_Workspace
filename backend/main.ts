import { ipcMain, shell } from "electron";
import { createRequire } from "node:module";
import * as fs from "fs";

//
// Establishing communication with server using Socket
const require = createRequire(import.meta.url);
const io = require("socket.io-client");
const socket = io("http://localhost:5000");

//
// =================================================== //
//         frontend to backend functionalities         //
// =================================================== //

ipcMain.on("request-to-backend", (event, request) => {
  //
  if (request["request_type"] == "check-user-login") {
    fs.access("backend/user data/.env", fs.constants.F_OK, (err) => {
      const loggedIn = !err;
      event.reply("server-response", { logged_in: loggedIn });
    });
  }
  //
  //
  else if (request["request_type"] == "clear-chat") {
    console.log("Chat Cleared");
  }
  //
  //
  else if (request["request_type"] == "give-available-llm") {
    fs.readFile("backend/user data/available_llm.json", "utf8", (_, data) => {
      try {
        const llmList = JSON.parse(data);
        event.reply("backend-response", llmList);
      } catch {
        event.reply("backend-response", {
          llm: [],
        });
      }
    });
  }
  //
  //
  else if (request["request_type"] == "save-user-info") {
    try {
      const userInfo = {
        first_name: request["first_name"],
        last_name: request["last_name"],
        email_id: request["email_id"],
        bio: request["bio"],
        image: request["image"],
      };
      const userInfoJson = JSON.stringify(userInfo);
      fs.writeFileSync("backend/user data/user_info.json", userInfoJson);
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
  else if (request["request_type"] == "save-api-keys") {
    if (request["OPENAI_API_KEY"] !== "" && request["GOOGLE_API_KEY"] !== "") {
      const apiKeys = `OPENAI_API_KEY = "${request["OPENAI_API_KEY"]}"\nGOOGLE_API_KEY = "${request["GOOGLE_API_KEY"]}"`;
      fs.writeFileSync("backend/user data/.env", apiKeys);
      fs.writeFileSync(
        "backend/user data/available_llm.json",
        JSON.stringify({
          llm: [
            "ChatGPT-3.5 turbo",
            "Gemini 1.5 Pro",
            "Gemini 1.0 Pro",
            "Gemini Flash 1.5",
          ],
        })
      );
    }
    //
    else if (request["OPENAI_API_KEY"] !== "") {
      const apiKeys = `OPENAI_API_KEY = "${request["OPENAI_API_KEY"]}"`;
      fs.writeFileSync("backend/user data/.env", apiKeys);
      fs.writeFileSync(
        "backend/user data/available_llm.json",
        JSON.stringify({ llm: ["ChatGPT-3.5 turbo"] })
      );
    }
    //
    else {
      const apiKeys = `GOOGLE_API_KEY = "${request["GOOGLE_API_KEY"]}"`;
      fs.writeFileSync("backend/user data/.env", apiKeys);
      fs.writeFileSync(
        "backend/user data/available_llm.json",
        JSON.stringify({
          llm: ["Gemini 1.5 Pro", "Gemini 1.0 Pro", "Gemini Flash 1.5"],
        })
      );
    }
  }
  //
  //
  else if (request["request_type"] == "give-user-info") {
    fs.readFile("backend/user data/user_info.json", "utf8", (_, data) => {
      try {
        const userData = JSON.parse(data);
        userData.OPENAI_API_KEY = "***********";
        userData.GOOGLE_API_KEY = "***********";
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
    });
  }
  //
  //
  else if (request["request_type"] == "logout") {
    fs.unlink("backend/user data/.env", () => {});
    fs.unlink("backend/user data/user_info.json", () => {});
  }
  //
  //
  else if (request["request_type"] == "open-url-in-browser") {
    shell.openExternal(request["url"]);
  }
  //
  //
  else if (request["request_type"] == "upload-file") {
    const base64Data = request["file_data"];
    const fileName = request["file_name"];
    const filePath = `backend/user data/img/${fileName}`;

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

// -------------------------------- //
//       Frontend to Server         //
// -------------------------------- //

ipcMain.on("request-to-server", (event, request) => {
  socket.emit("message", request);
  socket.on("message-reply", (response: object) => {
    event.reply("server-response", response);
  });
});
