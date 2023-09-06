export enum Errors {
    UNKNOWN = "Something went wrong. Try again later.",
    POPUP_BLOCKED = "Popup blocked. Please click the button again."
}

export const handleBadRequestError = (err: any) => {
    // if status starts with 4
    if (err.response?.status >= 400 && err.response?.status < 500) {
        return err.response.data
    } else {
        return Errors.UNKNOWN
    }
}

export const handleBulkUploadBadRequest = (err: any) => {
    if (err.response?.status >= 400 && err.response?.status < 500) {
        if (err.response?.status === 400) {
            return "Some permissions were not successfully added. Please check the errors and try again."
        } else {
            return err.response.data
        }
    } else {
        return Errors.UNKNOWN
    }
}