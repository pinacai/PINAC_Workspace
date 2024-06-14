import { useState } from "react";
import "./style/EmailComposeBox.css";

interface EmailComposeBoxProps {
  emailSubject: string;
  emailBody: string;
}

export const EmailComposeBox: React.FC<EmailComposeBoxProps> = (props) => {
  const [to, setTo] = useState<string>("");
  const [subject, setSubject] = useState<string>(props.emailSubject);
  const [body, setBody] = useState<string>(props.emailBody);
  const [buttonsDisabled, setButtonsDisabled] = useState<boolean>(false); // For disabling buttons

  //
  // Disables email-composer buttons if user click cancel
  const handleGoBack = () => {
    setButtonsDisabled(true);
  };

  // Sends a meg back to server with user modified email
  // and server sends that email to recipient
  const handleSendEmail = () => {
    setButtonsDisabled(true);
    window.ipcRenderer.send("client-request-to-server", {
      request_type: "send-email",
      recipient_email: to,
      email_subject: subject,
      email_body: body,
    });
  };

  // Sends a meg back to server(python) with user modified email
  // and server creates a draft email
  const handleCreateDraft = () => {
    setButtonsDisabled(true);
    if (to != "") {
      window.ipcRenderer.send("client-request-to-server", {
        request_type: "create-draft",
        have_recipient_email: true,
        recipient_email: to,
        email_subject: subject,
        email_body: body,
      });
    } else {
      window.ipcRenderer.send("client-request-to-server", {
        request_type: "create-draft",
        have_recipient_email: false,
        email_subject: subject,
        email_body: body,
      });
    }
    console.log("Created Draft");
  };

  return (
    <div className="compose-box">
      <div className="to">
        <label htmlFor="to">To:</label>
        <input
          type="email"
          id="to"
          placeholder="Recipient Email"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
          }}
        />
      </div>
      <div className="subject">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            localStorage.setItem("subject", e.target.value);
          }}
        />
      </div>
      <div className="body">
        <textarea
          id="body"
          placeholder="Compose your email here..."
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            localStorage.setItem("body", e.target.value);
          }}
        />
      </div>
      <div className="actions">
        <button
          id="cancel-button"
          className={buttonsDisabled ? "disabled" : ""}
          onClick={handleGoBack}
          disabled={buttonsDisabled}
        >
          Cancel
        </button>
        <button
          id="send-button"
          className={buttonsDisabled ? "disabled" : ""}
          onClick={handleSendEmail}
          disabled={buttonsDisabled}
        >
          Send
        </button>
        <button
          id="save-draft-button"
          className={buttonsDisabled ? "disabled" : ""}
          onClick={handleCreateDraft}
          disabled={buttonsDisabled}
        >
          Save Draft
        </button>
      </div>
    </div>
  );
};
