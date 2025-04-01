import React from "react";
import { Header } from "../header";
import { SessionCard } from "./components/SessionCard";
import { getAllSessions } from "../../database/db";

// icons
import { CiSearch } from "react-icons/ci";

const ChatHistory: React.FC = () => {
  const [sessions, setSessions] = React.useState<React.ReactElement[]>([]);

  // get all sessions from DB
  getAllSessions().then((sessions) => {
    setSessions(
      sessions.map((session) => (
        <SessionCard
          sessionId={session.id}
          date={`${String(session.timestamp.getDate()).padStart(
            2,
            "0"
          )}.${String(session.timestamp.getMonth() + 1).padStart(
            2,
            "0"
          )}.${String(session.timestamp.getFullYear())}`}
          title={session.title}
          key={session.id}
        />
      ))
    );
  });

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center overflow-y-auto
      bg-primary dark:bg-primary-dark lg:bg-transparent dark:lg:bg-transparent"
    >
      <Header title="Chat History" page="history" />
      <div className="w-full p-5 flex flex-col items-center">
        <div
          className="w-full h-[40px] flex items-center relative rounded-xl
          lg:bg-gray-700 dark:lg:bg-primary-dark lg:border-[1.5px] lg:border-gray-700 dark:lg:border-zinc-500
          bg-gray-200 dark:bg-tertiary-dark border-1 border-gray-300 dark:border-zinc-600"
        >
          <CiSearch
            size={25}
            className="absolute left-2 lg:text-gray-400 text-gray-500 dark:text-gray-400"
          />
          <input
            placeholder="Search"
            type="search"
            className="w-full h-full p-2 pl-10 text-md outline-0 lg:text-gray-100 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      <div className="w-full h-full py-1 px-5 flex flex-col items-center scroolbar">
        {sessions.length === 0 ? (
          <span className="font-exo text-2xl lg:text-xl">No history</span>
        ) : (
          sessions.map((session) => session)
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
