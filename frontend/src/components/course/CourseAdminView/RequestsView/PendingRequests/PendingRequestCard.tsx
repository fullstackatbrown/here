import { SwapRequest } from "model/swapRequest";
import { FC } from "react";

export interface PendingRequestProps {
  pendingRequest: SwapRequest;
}

const PendingRequest: FC<PendingRequestProps> = ({
  pendingRequest,
}) => {
  return (
    <div>hello</div>
  );
};

export default PendingRequest;