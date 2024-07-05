import React, { useState, useEffect,useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Menubar } from "../components/Menubar";
import "./style/ProfilePage.css";

// icons
import profileImage from "../assets/icon/user_icon.png";

export const ProfilePage: React.FC = () => {
  const [isOpt1, setIsOpt1] = useState<boolean>(true);
  const [isOpt2, setIsOpt2] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [openaiKey, setOpenaiKey] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //
  const activeOpt1 = () => {
    setIsOpt1(true);
    setIsOpt2(false);
  };

  const activeOpt2 = () => {
    setIsOpt2(true);
    setIsOpt1(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event:any) => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).replace(/^data:.+;base64,/, '');
        window.ipcRenderer.send('request-to-backend', {
          request_type: 'upload-file',
          file_data: base64String,
          file_name: file.name,
        });
        setImageUrl(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };
  
  const menuItems = [
    { label: "General", onClick: () => activeOpt1() },
    { label: "API Keys", onClick: () => activeOpt2() },
  ];

  //
  // onClick functions
  const saveUserInfo = () => {    
    window.ipcRenderer.send("request-to-backend", {
      request_type: "save-user-info",
      first_name: firstName,
      last_name: lastName,
      email_id: emailId,
      bio: bio,
      image:imageUrl
    });
  };

  const saveApiKeys = () => {
    window.ipcRenderer.send("request-to-backend", {
      request_type: "save-api-keys",
      OPENAI_API_KEY: openaiKey,
      GOOGLE_API_KEY: geminiKey,
    });
  };

  //
  // Load user data on switching to this page
  useEffect(() => {
    window.ipcRenderer.send("request-to-backend", {
      request_type: "give-user-info",
    });
    window.ipcRenderer.once("backend-response", (_, response) => {
      setFirstName(response.first_name);
      setLastName(response.last_name);
      setEmailId(response.email_id);
      setBio(response.bio);
      setOpenaiKey(response.OPENAI_API_KEY);
      setGeminiKey(response.GOOGLE_API_KEY);
      setImageUrl(response.image)
    });
  }, []);

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
                <div>
                  <div className="profile-img" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                  {imageUrl ? <img src={imageUrl} alt="Profile" /> : <img src={profileImage} alt="Profile" />}                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    required
                    style={{ display: 'none' }}
                    onChange={(e)=>handleFileChange(e)}
                  />
                </div>
                <div className="user-details">
                  <form className="form">
                    <div className="flex">
                      <label>
                        <input
                          required
                          placeholder=""
                          type="text"
                          className="input"
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
                      />
                    </label>

                    <button
                      className="submit"
                      onClick={() => {
                        saveUserInfo();
                      }}
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </>
            ) : (
              ""
            )}
            {isOpt2 ? (
              <>
                <div className="user-details">
                  <form className="form">
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

                    <button
                      className="submit"
                      onClick={() => {
                        saveApiKeys();
                      }}
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};
