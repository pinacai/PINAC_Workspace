import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Menubar } from "../components/Menubar";
import "./style/ProfilePage.css";

// icons
import profileImage from "../assets/icon/user_icon.png";

export const ProfilePage: React.FC = () => {
  const [isOpt1, setIsOpt1] = useState<boolean>(true);
  const [isOpt2, setIsOpt2] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [openaiKey, setOpenaiKey] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");

  //
  const activeOpt1 = () => {
    setIsOpt1(true);
    setIsOpt2(false);
  };

  const activeOpt2 = () => {
    setIsOpt2(true);
    setIsOpt1(false);
  };

  const menuItems = [
    { label: "General", onClick: () => activeOpt1() },
    { label: "API Keys", onClick: () => activeOpt2() },
  ];

  //
  // onClick functions
  const saveUserInfo = () => {
    window.ipcRenderer.send("client-request-to-backend", {
      request_type: "save-user-info",
      full_name: fullName,
      email_id: emailId,
      bio: bio,
    });
  };

  const saveApiKeys = () => {
    window.ipcRenderer.send("client-request-to-backend", {
      request_type: "save-api-keys",
      OPENAI_API_KEY: openaiKey,
      GOOGLE_API_KEY: geminiKey,
    });
  };

  //
  // For smooth applying of current theme
  useEffect(() => {
    const body = document.body;
    const preferredTheme = localStorage.getItem("preferred-theme");
    const preferredThemePair = localStorage.getItem("preferred-theme-pair");
    // Remove all theme classes first
    body.classList.remove(
      "Dawn_n_Dusk-light",
      "Dawn_n_Dusk-dark",
      "Cyber_Tech_01-light",
      "Cyber_Tech_01-dark",
      "Aesthetics_Unbound-light",
      "Aesthetics_Unbound-dark"
    );
    // Add desired theme pair with 'light-theme' or 'dark-theme' as user previous preference
    body.classList.add(`${preferredThemePair}-${preferredTheme}`);
  });

  return (
    <>
      <Sidebar />
      <div className="container">
        <Header title="Profile" />
        <div className="profile-container">
          <Menubar menuItems={menuItems} />
          <div className="profile-card">
            {isOpt1 ? (
              <>
                <div className="profile-img">
                  <img src={profileImage} alt="Profile image" />
                </div>
                <div className="user-details">
                  <div className="sec">
                    <span>Name</span>
                    <input
                      type="text"
                      id="full-name"
                      value={fullName}
                      onChange={(event) => {
                        setFullName(event.target.value);
                      }}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="sec">
                    <span>Email</span>
                    <input
                      type="email"
                      id="gmail-id"
                      value={emailId}
                      onChange={(event) => {
                        setEmailId(event.target.value);
                      }}
                      placeholder="Your Email Id"
                    />
                  </div>
                  <div className="sec">
                    <span>Bio</span>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(event) => {
                        setBio(event.target.value);
                      }}
                      placeholder="Tell us about yourself"
                    ></textarea>
                  </div>
                  <div className="last-sec">
                    {/* Copied this button from About Us Page */}
                    <button
                      id="aboutBtn"
                      onClick={() => {
                        saveUserInfo();
                      }}
                    >
                      <strong>Save Changes</strong>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {isOpt2 ? (
              <div className="user-details">
                <div className="sec">
                  <span>OPENAI API Key</span>
                  <input
                    type="text"
                    id="openai-key"
                    value={openaiKey}
                    onChange={(event) => {
                      setOpenaiKey(event.target.value);
                    }}
                    placeholder="Paste your key here"
                  />
                </div>
                <div className="sec">
                  <span>Gemini API Key</span>
                  <input
                    type="text"
                    id="gemini-key"
                    value={geminiKey}
                    onChange={(event) => {
                      setGeminiKey(event.target.value);
                    }}
                    placeholder="Paste your key here"
                  />
                </div>
                <div className="last-sec">
                  {/* Copied this button from About Us Page */}
                  <button
                    id="aboutBtn"
                    onClick={() => {
                      saveApiKeys();
                    }}
                  >
                    <strong>Save Changes</strong>
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
