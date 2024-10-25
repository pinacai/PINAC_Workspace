import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../header/index";
import styles from "./styles/index.module.css";

// icons
import profileImage from "/icon/user_icon.png";
import { FaPencilAlt } from "react-icons/fa";

const Profile: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [displayName, setDisplayName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  //
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).replace(
          /^data:.+;base64,/,
          ""
        );
        window.ipcRenderer.send("upload-file", {
          file_data: base64String,
          file_name: file.name,
        });
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  //
  // onClick functions
  const saveUserInfo = () => {
    window.ipcRenderer.send("save-user-info", {
      displayName: displayName,
      email: emailId,
      bio: bio,
      photoURL: imageUrl,
    });
  };

  //
  // Load user data on switching to this page
  useEffect(() => {
    window.ipcRenderer.send("give-user-info");
    window.ipcRenderer.once("backend-response", (_, response) => {
      setDisplayName(response.displayName || "");
      setEmailId(response.email || "");
      setBio(response.bio || "");
      setImageUrl(response.photoURL || null);
    });
  }, []);

  // ------------------------------------------------------ //
  return (
    <>
      <div className={styles.profileContainer}>
        {currentPath !== "/" ? (
          <Header title="Profile" subPage={false} />
        ) : (
          <Header title="Profile" subPage={true} />
        )}
        <div className={styles.profileCard}>
          <div>
            {/* ======= profile Image ======= */}
            <div className={styles.profileImgContainer}>
              <div className={styles.profileImg} style={{ cursor: "pointer" }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Profile" />
                ) : (
                  <img src={profileImage} alt="Profile" />
                )}{" "}
              </div>
              <button className={styles.editButton} onClick={handleImageClick}>
                <FaPencilAlt size={20} color="var(--sidebar-icon-color)" />
              </button>
            </div>
            {/* ======= Profile Input Form ======= */}
            <input
              type="file"
              ref={fileInputRef}
              required
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <div className={styles.userDetails}>
            <form className={styles.form}>
              <label>
                <input
                  required
                  placeholder=""
                  type="text"
                  className={styles.input}
                  value={displayName}
                  onChange={(event) => {
                    setDisplayName(event.target.value);
                  }}
                />
                <span>Full Name</span>
              </label>

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
                />
              </label>

              {/* ======= Sunmit Button ======= */}
              <button
                className={styles.submit}
                onClick={() => {
                  saveUserInfo();
                }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
