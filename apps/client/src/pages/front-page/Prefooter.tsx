import { init } from "aos";
import { useEffect } from "react";
import TypingText from "../animations/TypingText";
import Connect from "../illustrations/Connect";
import Deals from "../illustrations/Deals";
import ShareIdeas from "../illustrations/ShareIdeas";
import Skills from "../illustrations/Skills";

export default function Prefooter() {
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div className="my-20 min-h-svh w-full flex-col gap-20 flex-center">
        <TypingText
          text="A place where you can..."
          className="text-5xl"
          grow={true}
          repeat={false}
        />

        <div className="relative">
          <div
            data-aos="fade-up"
            data-aos-duration="2000"
            className="absolute right-0 rounded-2xl bg-gradient-to-t from-slate-500 to-teal-500 p-1 text-black flex-center center-y"
          >
            <div
              className="relative rounded-xl bg-white p-3 flex-center"
              style={{ width: "calc(100%)", height: "calc(100% - 5px)" }}
            >
              <div>Connect with others</div>
            </div>
          </div>
          <Connect height={300} data-aos="fade-up" data-aos-duration="2000" />
        </div>
        <div className="relative">
          <div className="absolute right-0 rounded-2xl bg-gradient-to-t from-slate-500 to-teal-500 p-1 text-black flex-center center-y">
            <div
              className="relative rounded-xl bg-white p-3 flex-center"
              style={{ width: "calc(100%)", height: "calc(100% - 5px)" }}
            >
              <div className="">Share views and ideas</div>
            </div>
          </div>
          <ShareIdeas height={300} />
        </div>
        <div className="relative">
          <div className="absolute right-0 rounded-2xl bg-gradient-to-t from-slate-500 to-teal-500 p-1 text-black flex-center center-y">
            <div
              className="relative rounded-xl bg-white p-3 flex-center"
              style={{ width: "calc(100%)", height: "calc(100% - 5px)" }}
            >
              <div className="">Find great deals</div>
            </div>
          </div>
          <Deals height={300} />
        </div>
        <div className="relative">
          <div className="absolute right-0 rounded-2xl bg-gradient-to-t from-slate-500 to-teal-500 p-1 text-black flex-center center-y">
            <div
              className="relative rounded-xl bg-white p-3 flex-center"
              style={{ width: "calc(100%)", height: "calc(100% - 5px)" }}
            >
              <div className="">Acquire new skills</div>
            </div>
          </div>
          <Skills height={300} />
        </div>
      </div>
    </>
  );
}
