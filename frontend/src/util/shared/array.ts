// Returns the items that are in arr1 but not in arr2
export const arraySubtract = (arr1: any[], arr2: any[]) => {
    return arr1.filter(x => !arr2.includes(x))
};

// Returns the items that are in arr1 or arr2
export const arrayUnion = (arr1: any[], arr2: any[]) => {
    return unique(arr1.concat(arr2));
}

export const unique = (arr: any[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

