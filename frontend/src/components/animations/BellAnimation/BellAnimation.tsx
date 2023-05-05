import { FC } from "react";
import * as animationData from "./BellAlert.json";
import Lottie, { useLottie } from "lottie-react";

export interface BellAnimationProps {}

const BellAnimation: FC<BellAnimationProps> = ({}) => {
  const { View } = useLottie({
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  });

  return <>{View}</>;
};

export default BellAnimation;
