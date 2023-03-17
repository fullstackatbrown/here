// Terms is a concatenation between season and year
// Season is a string with the following values: "Winter", "Spring", "Summer", "Fall"
// Year is a string with the following format: "YYYY"
// Sort the terms in descending order, with the most recent term first
export default function sortTerms(terms: string[]): string[] {
    return terms.sort((a, b) => {
        const [aSeason, aYear] = a.split(" ");
        const [bSeason, bYear] = b.split(" ");

        if (aYear > bYear) {
            return -1;
        } else if (aYear < bYear) {
            return 1;
        } else {
            if (aSeason === "Winter") {
                return -1;
            } else if (aSeason === "Spring") {
                return bSeason === "Winter" ? 1 : -1;
            } else if (aSeason === "Summer") {
                return bSeason === "Fall" ? -1 : 1;
            } else {
                return 1;
            }
        }
    });
}