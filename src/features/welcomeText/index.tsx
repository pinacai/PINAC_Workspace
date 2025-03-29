import { useEffect, useState } from "react";

export const WelcomeText = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  const getGreeting = () => {
    setGreeting(`Hey there, ${firstName}!`);
  };

  useEffect(() => {
    const fetchUserInfo = () => {
      window.ipcRenderer.send("give-user-info");
      window.ipcRenderer.once("backend-response", (_, response) => {
        setFirstName(response.displayName.split(" ")[0]);
      });
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    getGreeting();
  });

  // ----------------------------------- //
  return (
    <div
      className="w-full h-20 flex items-center justify-center font-cormorant
       text-gray-900 dark:text-gray-200 text-2xl lg:text-4xl md:text-3xl
       font-semibold dark:font-medium md:font-medium
      "
    >
      {greeting}
    </div>
  );
};
