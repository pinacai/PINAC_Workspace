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
    <div className="w-full h-full flex flex-col items-center justify-center scroolbar">
      <Header title="Chat History" page="history" />
      <div className="w-full py-5 px-3 lg:p-5 flex flex-col items-center">
        <div
          className="w-full h-[40px] flex items-center relative rounded-xl
          bg-gray-700 dark:bg-primary-dark border-[1.5px] border-gray-700 dark:border-zinc-500"
        >
          <CiSearch size={25} className="absolute left-2 text-gray-400" />
          <input
            placeholder="Search"
            type="search"
            className="w-full h-full p-2 pl-10 text-md outline-0 text-gray-100"
          />
        </div>
      </div>
      <div className="w-full h-full py-1 px-3 lg:px-5 flex flex-col items-center scroolbar">
        {sessions.length === 0 ? (
          <span className="font-exo text-xl">No history</span>
        ) : (
          sessions.map((session) => session)
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
