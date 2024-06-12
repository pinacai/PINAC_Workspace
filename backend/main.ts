import { ipcMain } from "electron";
import { createRequire } from "node:module";
import * as fs from "fs";

//
// Establishing communication with server using Socket
const require = createRequire(import.meta.url);
const io = require("socket.io-client");
const socket = io("http://localhost:5000");

// ------------------------- //
//  IPC btw React & backend  //
// ------------------------- //

ipcMain.on("client-request-to-backend", (event, request) => {
  //
  //
  if (request["request_type"] == "clear-chat") {
    console.log(true);
  }
  //
  //
  else if (request["request_type"] == "save-user-info") {
    try {
      const userInfo = {
        full_name: request["full_name"],
        email_id: request["email_id"],
        bio: request["bio"],
      };
      const userInfoJson = JSON.stringify(userInfo);
      fs.writeFileSync("backend/config/user_info.json", userInfoJson);
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
    try {
      const apiKey = {
        OPENAI_API_KEY: request["OPENAI_API_KEY"],
        GOOGLE_API_KEY: request["GOOGLE_API_KEY"],
      };
      const apiKeyJson = JSON.stringify(apiKey);
      fs.writeFileSync("backend/config/API_Key.json", apiKeyJson);
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
});

// -------------------------------- //
//    React to Backend to Server    //
// -------------------------------- //

ipcMain.on("client-request", (event, request) => {
  socket.emit("message", request);
  socket.on("message-reply", (response: object) => {
    event.reply("server-response", response);
  });
});
