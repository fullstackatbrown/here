import { Swap } from "model/swap";
import { FC } from "react";

export interface RequestInformationProps {
    request: Swap;
}

const RequestInformation: FC<RequestInformationProps> = (request) => {
    return <div>request info!</div>
}

export default RequestInformation