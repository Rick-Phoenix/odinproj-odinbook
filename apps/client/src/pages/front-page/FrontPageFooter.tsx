import CircularText from "../../components/animations/RotatingText";
import SignupDialog from "../../components/dialogs/SignupDialog";

export default function FrontPageFooter() {
  return (
    <>
      <div className="relative mx-auto my-24">
        <CircularText
          text={"*DISCOVER*SHARE*LEARN"}
          data-aos="fade-up"
          data-aos-duration="2500"
          containerClassName="mx-auto"
          spacingRem={window.innerWidth > 450 ? 1.5 : 1}
        />
        <div className="text-2xl absolute-center">
          <SignupDialog text="Join Us!" />
        </div>
      </div>
    </>
  );
}
