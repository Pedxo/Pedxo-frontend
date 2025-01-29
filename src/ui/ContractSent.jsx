import { FaPaperPlane } from "react-icons/fa6";
import Button from "./Button";

function ContractSent() {
  return (
    <section className="flex flex-col justify-center items-center w-96 p-4 pt-10 gap-10">
      <FaPaperPlane size={80} className="text-primary" />
      <div className="flex items-center flex-col gap-4 ">
        <h2 className="font-medium text-brandGreen">
          Contract Sent Successfully
        </h2>
        <p className="text-xs font-medium text-center px-4 text-black/40">
          Your contract is on the way! We will review it and have your developer
          sign the contract, then automatically onboard them to your <strong>&apos;Teams&apos;</strong>  Dashboard
        </p>
        <Button link linkTo={"/"} type="primary">Back to Home</Button>
      </div>
    </section>
  );
}

export default ContractSent;
