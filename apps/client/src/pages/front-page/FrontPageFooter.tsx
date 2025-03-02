import { init } from "aos";
import { useEffect } from "react";
import CircularText from "../../components/animations/RotatingText";

export default function FrontPageFooter() {
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <div className="relative m-24">
        <CircularText
          text={"*DISCOVER*SHARE*LEARN"}
          onHover="slowDown"
          data-aos="fade-up"
          data-aos-duration="2500"
        />
        <div className="text-2xl absolute-center">
          <button data-aos="fade-up" data-aos-duration="2000" className="relative p-[3px]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-600 to-teal-500" />
            <div className="group relative rounded-xl bg-gray-950 px-8 py-2 text-3xl font-semibold text-white transition duration-200 hover:bg-transparent hover:text-black">
              Join us!
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
