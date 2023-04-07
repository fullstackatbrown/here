import { SwapRequest } from "model/swapRequest";
import { FC } from "react";

export interface RequestInformationProps {
    request: SwapRequest;
}

const RequestInformation: FC<RequestInformationProps> = (request) => {
    return <div>request info!</div>
}

export default RequestInformation