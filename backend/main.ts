import { ipcMain, shell } from "electron";
import * as fs from "fs";

//
// for sending requests to the server
async function sendDataToFlask(client_request: object) {
  try {
    const response = await fetch(
      "https://pinac-nexus.vercel.app/send_request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client_request),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return {
        error_occurred: true,
        response: null,
        error: response.status,
      };
    }
  } catch (error) {
    return {
      error_occurred: true,
      response: null,
      error: error,
    };
  }
}

//
// =================================================== //
//         frontend to backend functionalities         //
// =================================================== //

ipcMain.on("request-to-backend", (event, request) => {
  //
  if (request["request_type"] == "clear-chat") {
    console.log("Chat Cleared");
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
  else if (request["request_type"] == "give-user-info") {
    fs.readFile("backend/user data/user_info.json", "utf8", (_, data) => {
      try {
        const userData = JSON.parse(data);
        event.reply("backend-response", userData);
      } catch {
        const userData = {
          first_name: null,
          last_name: null,
          email_id: null,
          bio: null,
        };
        event.reply("backend-response", userData);
      }
    });
  }
  //
  //
  else if (request["request_type"] == "logout") {
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
ipcMain.on("request-to-server", async (event, request) => {
  const server_response = await sendDataToFlask(request);
  event.reply("server-response", server_response);
});
