import { useEffect, useState } from "react";

export const GreetingText = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  const getGreeting = () => {
    setGreeting(`Hey there, ${firstName}!`);
  };

  useEffect(() => {
    const fetchUserInfo = () => {
      window.ipcRenderer.send("get-user-info");
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
      className="w-full pb-8 flex items-center justify-center font-cormorant
       text-gray-900 dark:text-gray-200 text-4xl font-medium"
    >
      {greeting}
    </div>
  );
};
