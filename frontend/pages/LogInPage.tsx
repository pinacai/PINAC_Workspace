import React, { useEffect, useState } from "react";
import "./style/LogInPage.css";

interface LogInPagePrompt {
  changeLogInStatus: () => void;
}

export const LogInPage: React.FC<LogInPagePrompt> = ({ changeLogInStatus }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  // const [openaiKey, setOpenaiKey] = useState<string>("");
  // const [geminiKey, setGeminiKey] = useState<string>("");

  //
  // switch to full screen for LoginPage
  useEffect(() => {
    window.ipcRenderer.send("maximizeWindow");
  }, []);

  //
  const submit = () => {
    if (firstName !== "" && lastName !== "") {
      window.ipcRenderer.send("request-to-backend", {
        request_type: "save-user-info",
        first_name: firstName,
        last_name: lastName,
        email_id: emailId,
        bio: bio,
      });

      // window.ipcRenderer.send("request-to-backend", {
      //   request_type: "save-api-keys",
      //   OPENAI_API_KEY: openaiKey,
      //   GOOGLE_API_KEY: geminiKey,
      // });

      changeLogInStatus();
      // escape full screen for LoginPage
      window.ipcRenderer.send("unmaximizeWindow");
    }
  };

  return (
    <div className="container">
      <div className="logIn-container">
        <form className="form">
          <div className="title">
            <div className="spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span>Welcome</span>
          </div>
          <p className="message">
            Please enter the API keys for the LLM you’d like to use. You must
            provide at least one API key.
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
            <textarea
              placeholder="Tell Us about yourself"
              id="bio"
              className="input"
              value={bio}
              onChange={(event) => {
                setBio(event.target.value);
              }}
              style={{ height: "150px" }}
            />
          </label>

          {/* <label>
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
          </label> */}
          <button className="submit" onClick={() => submit()}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
