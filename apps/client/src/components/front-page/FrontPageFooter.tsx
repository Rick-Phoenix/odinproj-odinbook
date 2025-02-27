import CircularText from "../dialogs/custom/RotatingText";

export default function FrontPageFooter() {
  return (
    <>
      <div className="relative m-24">
        <CircularText text={"*DISCOVER*SHARE*LEARN"} onHover="slowDown" />
        <div className="text-2xl absolute-center">
          <button className="relative p-[3px]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500" />
            <div className="group relative rounded-xl bg-gray-950 px-8 py-2 font-semibold text-white transition duration-200 hover:bg-transparent">
              Come join us!
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
