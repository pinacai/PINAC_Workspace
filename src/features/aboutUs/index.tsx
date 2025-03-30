import React from "react";
import { Header } from "../header/index";
import { VscGithubInverted } from "react-icons/vsc";
import { PiGlobeHemisphereWestFill } from "react-icons/pi";
import { BsLightningChargeFill } from "react-icons/bs";

const AboutUs: React.FC = () => {
  return (
    <div
      className="w-full h-screen lg:h-full flex flex-col items-center justify-center overflow-y-auto
      bg-primary dark:bg-primary-dark lg:bg-transparent dark:lg:bg-transparent"
    >
      <Header title="About Us" page="about" />
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        {/*     View us on GitHub      */}
        {/* -------------------------- */}
        <button
          className="flex overflow-hidden items-center text-sm hover:font-medium focus-visible:outline-none
              focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
              bg-black text-gray-100 shadow hover:bg-black/90 w-56 px-4 py-3 whitespace-pre md:flex
              group relative justify-center gap-2 rounded-full transition-all duration-300 ease-out
              hover:ring-2 hover:ring-black hover:ring-offset-2"
          onClick={() =>
            window.ipcRenderer.send(
              "open-external-link",
              "https://github.com/pinacai/PINAC_Workspace"
            )
          }
        >
          <div className="flex items-center">
            <VscGithubInverted size={20} />
            <span className="ml-2">View us on GitHub</span>
          </div>
          <div className="ml-2 flex items-center gap-1 text-sm md:flex">
            <svg
              className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
              data-slot="icon"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                fill-rule="evenodd"
              ></path>
            </svg>
            <span className="inline-block tabular-nums tracking-wider font-display font-medium text-white">
              28
            </span>
          </div>
        </button>
        {/*     Visit our website      */}
        {/* -------------------------- */}
        <button
          className="flex overflow-hidden items-center text-sm hover:font-medium focus-visible:outline-none
              focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50
              bg-black text-gray-100 shadow hover:bg-black/90 w-56 px-4 py-3 whitespace-pre md:flex
              group relative justify-between gap-2 rounded-full transition-all duration-300 ease-out
              hover:ring-2 hover:ring-black hover:ring-offset-2"
          onClick={() =>
            window.ipcRenderer.send(
              "open-external-link",
              "https://pinacworkspace.pages.dev/"
            )
          }
        >
          <div className="flex items-center">
            <PiGlobeHemisphereWestFill size={20} />
            <span className="ml-2">Visit our website</span>
          </div>
          <BsLightningChargeFill
            size={20}
            className="text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
          />
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
