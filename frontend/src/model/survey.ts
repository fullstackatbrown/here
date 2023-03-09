export interface Survey {
    id: string;
    courseID: string;
    name: string;
    description: string;
    capacity: Map<string, number>;
    responses: Map<string, string[]>;
    numResponses: number;
    published: boolean;
}