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
      className="w-full pb-6 flex flex-col items-center font-cormorant
       text-gray-900 dark:text-gray-200 lg:text-5xl text-4xl font-medium"
    >
      {" "}
      {/* From https://uiverse.io */}
      <div id="ghost" className="mb-8">
        <div id="red">
          <div id="pupil"></div>
          <div id="pupil1"></div>
          <div id="eye"></div>
          <div id="eye1"></div>
          <div id="top0"></div>
          <div id="top1"></div>
          <div id="top2"></div>
          <div id="top3"></div>
          <div id="top4"></div>
          <div id="st0"></div>
          <div id="st1"></div>
          <div id="st2"></div>
          <div id="st3"></div>
          <div id="st4"></div>
          <div id="st5"></div>
          <div id="an1"></div>
          <div id="an2"></div>
          <div id="an3"></div>
          <div id="an4"></div>
          <div id="an5"></div>
          <div id="an6"></div>
          <div id="an7"></div>
          <div id="an8"></div>
          <div id="an9"></div>
          <div id="an10"></div>
          <div id="an11"></div>
          <div id="an12"></div>
          <div id="an13"></div>
          <div id="an14"></div>
          <div id="an15"></div>
          <div id="an16"></div>
          <div id="an17"></div>
          <div id="an18"></div>
        </div>
        <div id="shadow"></div>
      </div>
      {greeting}
    </div>
  );
};
