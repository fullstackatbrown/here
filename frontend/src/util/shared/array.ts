// Returns the items that are in arr1 but not in arr2
export const arraySubtract = (arr1: any[], arr2: any[]) => {
    return arr1.filter(x => !arr2.includes(x))
};

// Returns the items that are in arr1 or arr2
export const arrayUnion = (arr1: any[], arr2: any[]) => {
    return unique(arr1.concat(arr2));
}

// Check if two arrays contain the same elements
export const arraysEqual = (arr1: any[], arr2: any[]) => {
    // Check if the arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Check if every element in arr1 is included in arr2
    return arr1.every((element) => arr2.includes(element));
}

export const unique = (arr: any[]) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

export const partition = <T>(array: T[], isValid: (elem: T) => boolean) => {
    return array.reduce(([pass, fail], elem) => {
        return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    }, [[], []]);
}