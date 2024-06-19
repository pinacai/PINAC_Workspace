import React, { useState } from "react";
import "./style/LogInPage.css";

interface LogInPagePrompt {
  changeLogInStatus: () => void;
}

export const LogInPage: React.FC<LogInPagePrompt> = ({ changeLogInStatus }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [openaiKey, setOpenaiKey] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");

  //
  const submit = () => {
    window.ipcRenderer.send("client-request-to-backend", {
      request_type: "save-user-info",
      first_name: firstName,
      last_name: lastName,
      email_id: emailId,
    });

    window.ipcRenderer.send("client-request-to-backend", {
      request_type: "save-api-keys",
      OPENAI_API_KEY: openaiKey,
      GOOGLE_API_KEY: geminiKey,
    });

    window.ipcRenderer.send("client-request-to-backend", {
      request_type: "start-server",
    });
    changeLogInStatus();
  };

  return (
    <div className="container">
      <div className="logIn-container">
        <form className="form">
          <p className="title">Privacy Log In</p>
          <p className="message">
            This is our privacy-first local log in. Keep your data only in your
            device.
          </p>
          <div className="flex">
            <label>
              <input
                required
                placeholder=""
                type="text"
                className="input"
                id="half-input"
                value={firstName}
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
              />
              <span>First Name</span>
            </label>

            <label>
              <input
                required
                placeholder=""
                type="text"
                className="input"
                id="half-input"
                value={lastName}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
              <span>Last Name</span>
            </label>
          </div>

          <label>
            <input
              required
              placeholder=""
              type="email"
              className="input"
              value={emailId}
              onChange={(event) => {
                setEmailId(event.target.value);
              }}
            />
            <span>Email</span>
          </label>

          <label>
            <input
              required
              placeholder=""
              type="password"
              className="input"
              value={openaiKey}
              onChange={(event) => {
                setOpenaiKey(event.target.value);
              }}
            />
            <span>OPENAI API KEY</span>
          </label>
          <label>
            <input
              required
              placeholder=""
              type="password"
              className="input"
              value={geminiKey}
              onChange={(event) => {
                setGeminiKey(event.target.value);
              }}
            />
            <span>GEMINI API KEY</span>
          </label>
          <button className="submit" onClick={() => submit()}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
