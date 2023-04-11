export enum Errors {
    UNKNOWN = "Something went wrong. Try again later."
}

export const handleBadRequestError = (err: any) => {
    if (err.code === "ERR_BAD_REQUEST") {
        return err.response.data
    } else {
        return Errors.UNKNOWN
    }
}