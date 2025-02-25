import LoginDialog from "../dialogs/custom/LoginDialog";
import SignupDialog from "../dialogs/custom/SignupDialog";
import { BackgroundGradientAnimation } from "./BackgroundGradientAnimation";
import FlipWords from "./ChangingWords";
import DraggableElement from "./DraggableElement";
import Threads from "./Threads";

export default function MainHero() {
  return (
    <BackgroundGradientAnimation
      interactive={false}
      className="relative h-svh flex-col gap-4 p-4 flex-center"
      gradientBackgroundEnd="rgb(30, 41, 59)"
      gradientBackgroundStart="rgb(2, 8, 23)"
    >
      <div
        className="relative size-[500px] bg-black"
        style={{
          mask: `url("data:image/svg+xml, %3Csvg stroke='white' fill='none' strokeWidth='2' viewBox='0 0 24 24' strokeLinecap='round' strokeLinejoin='round' height='100%' width='100%' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath d='M6.045 9.777a6 6 0 1 0 5.951 .023' %3E%3C/path%3E%3Cpath d='M11.997 20.196a6 6 0 1 0 -2.948 -5.97' %3E%3C/path%3E%3Cpath d='M17.95 9.785q .05 -.386 .05 -.785a6 6 0 1 0 -3.056 5.23'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      >
        <BackgroundGradientAnimation
          gradientBackgroundEnd="rgb(30, 41, 59)"
          gradientBackgroundStart="rgb(38, 98, 217)"
        />

        <DraggableElement />
      </div>
      <span className="z-20 mb-2 text-3xl italic leading-tight tracking-tight">
        Exchange
        <FlipWords
          words={["passions", "connections", "deals", "views", "opinions", "solutions"]}
          duration={2000}
          className="text-3xl"
        />
      </span>
      <div className="z-20 flex gap-4">
        <SignupDialog />
        <LoginDialog />
      </div>
      <div className="absolute bottom-0 z-10 h-[500px] w-full opacity-20">
        <Threads amplitude={3} color={[59, 65, 73]} />
      </div>
    </BackgroundGradientAnimation>
  );
}
