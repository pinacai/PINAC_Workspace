import "./style/ProfilePage.css";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Menubar } from "../components/Menubar";

// icons
import profileImage from "../assets/icon/user_icon.png";

export const ProfilePage: React.FC = () => {
  const [isOpt1, setIsOpt1] = useState<boolean>(true);
  const [isOpt2, setIsOpt2] = useState<boolean>(false);

  //
  const activeOpt1 = () => {
    setIsOpt1(true);
    setIsOpt2(false);
  };

  //
  const activeOpt2 = () => {
    setIsOpt2(true);
    setIsOpt1(false);
  };

  //
  const menuItems = [
    { label: "General", onClick: () => activeOpt1() },
    { label: "API Keys", onClick: () => activeOpt2() },
  ];

  //
  // for showing input boxes
  const InputBox = (type: string, id: string, placeholder: string) => {
    return <input type={type} id={id} placeholder={placeholder} />;
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
      "Cyber_Tech_01-dark"
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
                    {InputBox("text", "full-name", "Your full name")}
                  </div>
                  <div className="sec">
                    <span>Email</span>
                    {InputBox("email", "gmail-id", "Your Email Id")}
                  </div>
                  <div className="sec">
                    <span>Bio</span>
                    <textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                    ></textarea>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {isOpt2 ? "" : ""}
          </div>
        </div>
      </div>
    </>
  );
};
