import React from "react";
import styles from "./styles/SignIn.module.css";

// image
import appLogo from "/icon/Full App Logo.svg";

type SignInPageProps = {
  isLoading?: boolean;
};

const SignInPage: React.FC<SignInPageProps> = ({ isLoading }) => {
  const handleButtonClick = () => {
    window.ipcRenderer.send(
      "open-external-link",
      "https://pinacworkspace.pages.dev/auth/sign-up/?app-auth=true"
    );
  };

  const handleLinkClick = () => {
    window.ipcRenderer.send(
      "open-external-link",
      "https://pinacworkspace.pages.dev/auth/sign-in/?app-auth=true"
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-primary dark:bg-primary-dark">
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={appLogo} alt="App Logo" className={styles.appLogo} />
        <div className={styles.bottomContainer}>
          <button className={styles.signupButton} onClick={handleButtonClick}>
            Sign Up
          </button>
          <div className={styles.signinText}>
            Already a user?
            <span className={styles.signinLink} onClick={handleLinkClick}>
              {" "}Sign In
            </span>
          </div>
          <p className={styles.footerText}>
            This is an open-source project built with contributions from the
            community. We hope you enjoy using it.
          </p>
        </div>
      </div>
      <div className={`${styles.blueCircle} ${styles.one}`}></div>
      <div className={`${styles.blueCircle} ${styles.two}`}></div>
    </div>
  );
};

export default SignInPage;
