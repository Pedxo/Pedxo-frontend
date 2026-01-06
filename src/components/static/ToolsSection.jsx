import DesignGen from "../../assets/svg/DesignGen.svg";
import BuildImage from "../../assets/svg/BuildImage.svg";
import { MaxScreenWrapper } from "../MaxScreenWrapper";
import { RevealAnimation } from "../RevealAnimation";
import { motion } from "framer-motion";
import Subscription from "../../components/Subscription";

const SectionHeader = ({ title, description, width = "1/2" }) => (
  <RevealAnimation
    delay={0.2}
    duration={0.8}
    className="gap-6 md:gap-10 w-full flex flex-col items-center"
  >
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl md:text-[48px] font-bold leading-[40px] text-center m-auto md:mt-6 mt-0"
    >
      {title}
    </motion.h2>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={`w-full md:w-${width} m-auto md:mt-6 mt-0`}
    >
      <p className="text-center text-lg text-gray-600">{description}</p>
    </motion.div>
  </RevealAnimation>
);

const SidePanel = ({ position = "left" }) => (
  <RevealAnimation
    direction={position === "left" ? "left" : "right"}
    delay={0.4}
    duration={1}
    className={`w-[44px] md:w-[70px] md:h-[210px] h-[100px] bg-[#206BDC29] ${
      position === "left"
        ? "md:rounded-l-[21.78px] rounded-l-[10px]"
        : "md:rounded-r-[21.78px] rounded-r-[10px]"
    }`}
  ></RevealAnimation>
);

const ImageCard = ({ src, alt, rounded = "[20px]" }) => (
  <RevealAnimation delay={0.5} duration={0.8} className="flex-grow">
    <motion.div
      initial={{ opacity: 0, scale: 0.98, backgroundColor: "#00000000" }}
      animate={{ opacity: 1, scale: 1, backgroundColor: "#f5f5f5" }}
      transition={{ duration: 0.7 }}
      className="md:p-10 p-4 md:rounded-[40px] rounded-[20px] h-fit"
    >
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        src={src}
        className={`w-full h-full md:rounded-[${rounded}] rounded-[10px] object-contain`}
        alt={alt}
      />
    </motion.div>
  </RevealAnimation>
);

export const ToolsSection = () => {
  return (
    <MaxScreenWrapper className="px-4 md:px-24 flex flex-col items-center gap-6 md:gap-10">
      {/* First Header + Image Section */}
      <SectionHeader
        title="Design-Gen and creative senses tools."
        description="Works well with keeping creative human-in-loop to generate cool designs and creative videos using AI tools."
      />
      <Subscription />
      <MaxScreenWrapper className="max-w-[1151px] w-full relative flex items-center">
        <SidePanel position="left" />
        <ImageCard src={DesignGen} alt="Design generation illustration" />
        <SidePanel position="right" />
      </MaxScreenWrapper>

      {/* Second Header + Image Section */}
      <SectionHeader
        title="Plug-in and onboard human labour."
        description="Hire and keep creative humans to carry out tasks on-demand edge case scenarios."
      />

      <MaxScreenWrapper className="max-w-[1151px] w-full relative flex items-center">
        <SidePanel position="left" />
        <ImageCard src={BuildImage} alt="Build process illustration" />
        <SidePanel position="right" />
      </MaxScreenWrapper>
    </MaxScreenWrapper>
  );
};
