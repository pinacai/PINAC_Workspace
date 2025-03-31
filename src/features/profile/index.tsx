import React, { useState, useEffect } from "react";
import { Header } from "../header/index";

// icons
import profileImage from "/icon/User Icon.png";

const Profile: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const saveUserInfo = () => {
    window.ipcRenderer.send("save-user-info", {
      displayName: displayName,
      email: emailId,
      bio: bio,
      photoURL: imageUrl,
    });
  };

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
    <div
      className="w-full h-full flex flex-col items-center justify-center scroolbar
    bg-primary dark:bg-primary-dark lg:bg-transparent dark:lg:bg-transparent"
    >
      <Header title="Profile" page="profile" />
      <div className="w-full h-full my-4 flex flex-col justify-start items-center scroolbar">
        {/* ======= profile Image ======= */}
        <div className="size-24 rounded-full flex justify-center items-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              className="object-fill overflow-hidden"
              alt="Profile Picture"
            />
          ) : (
            <img
              src={profileImage}
              className="object-fill overflow-hidden"
              alt="Profile Picture"
            />
          )}
        </div>
        <div className="w-full flex flex-col items-center">
          <form className="flex flex-col gap-3 w-full p-5 rounded-xl relative">
            <label className="relative">
              <input
                required
                placeholder=" "
                type="text"
                className="peer w-full p-2.5 pb-5 outline-none rounded-lg text-gray-200 bg-gray-800 dark:bg-primary-dark border border-gray-600 dark:border-zinc-700 shadow-md font-medium transition-all duration-300"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                }}
              />
              <span
                className="absolute left-2.5 top-4 text-gray-500 dark:text-zinc-500 text-sm cursor-text transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm 
                peer-focus:top-7 peer-focus:text-xs peer-focus:font-semibold peer-valid:top-7 peer-valid:text-xs peer-valid:font-semibold peer-valid:text-green-600"
              >
                Full Name
              </span>
            </label>

            <label className="relative">
              <input
                required
                placeholder=" "
                type="email"
                className="peer w-full p-2.5 pb-5 outline-none rounded-lg text-gray-200 bg-gray-800 dark:bg-primary-dark border border-gray-600 dark:border-zinc-700 shadow-md font-medium transition-all duration-300"
                value={emailId}
                onChange={(event) => {
                  setEmailId(event.target.value);
                }}
              />
              <span
                className="absolute left-2.5 top-4 text-gray-500 dark:text-zinc-500 text-sm cursor-text transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm 
                peer-focus:top-7 peer-focus:text-xs peer-focus:font-semibold peer-valid:top-7 peer-valid:text-xs peer-valid:font-semibold peer-valid:text-green-600"
              >
                Email
              </span>
            </label>

            <label className="relative">
              <textarea
                placeholder="Tell Us about yourself"
                className="w-full h-48 p-2.5 pb-5 outline-none rounded-lg shadow-md resize-none transition-all duration-300
                text-gray-200 bg-gray-800 dark:bg-primary-dark border border-gray-600 dark:border-zinc-700 placeholder:text-gray-500 dark:placeholder:text-zinc-500 placeholder:text-base"
                value={bio}
                onChange={(event) => {
                  setBio(event.target.value);
                }}
              />
            </label>

            {/* ======= Submit Button ======= */}
            <button
              className="w-full border-none outline-none bg-blue-600 dark:bg-blue-500 p-2.5 rounded-lg text-white text-base transition-all duration-300 hover:shadow-lg hover:shadow-blue-300 dark:hover:shadow-blue-800 active:scale-95 active:shadow-md active:shadow-blue-500"
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
  );
};

export default Profile;
