import React from "react";
import styles from "./styles/SignIn.module.css";

// image
import appLogo from "../../public/img/App Logo.svg";

export const SignInPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={appLogo} alt="App Logo" className={styles.appLogo} />
        <div className={styles.bottomContainer}>
          <button className={styles.signupButton}>Sign Up</button>

          <div className={styles.signinText}>
            Already a user?
            <a href="#" className={styles.signinLink}>
              {" "}
              Sign In
            </a>
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
