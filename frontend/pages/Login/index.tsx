import React, { useEffect, useState } from "react";
import styles from "./style/index.module.css";

interface LoginPagePrompt {
  changeLogInStatus: () => void;
}

export const LoginPage: React.FC<LoginPagePrompt> = ({ changeLogInStatus }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [bio, setBio] = useState<string>("");

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
      changeLogInStatus();
      // escape full screen for LoginPage
      window.ipcRenderer.send("unmaximizeWindow");
    }
  };

  // ------------------------------------ //
  return (
    <div className="container">
      <div className={styles.logIn_container}>
        <form className={styles.form}>
          <div className={styles.title}>
            <div className={styles.spinner}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span>Welcome</span>
          </div>
          <p className={styles.message}>
            Please enter the API keys for the LLM you’d like to use. You must
            provide at least one API key.
          </p>
          <div className={styles.flex}>
            <label>
              <input
                required
                placeholder=""
                type="text"
                className={styles.input}
                id={styles.half_input}
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
                className={styles.input}
                id={styles.half_input}
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
              className={styles.input}
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
              id={styles.bio}
              className={styles.input}
              value={bio}
              onChange={(event) => {
                setBio(event.target.value);
              }}
              style={{ height: "150px" }}
            />
          </label>

          <button className={styles.submit} onClick={() => submit()}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
