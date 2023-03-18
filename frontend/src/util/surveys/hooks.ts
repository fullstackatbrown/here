import { useEffect, useState } from "react";
import { collection, doc, getFirestore, onSnapshot } from "@firebase/firestore";
import { Survey } from "model/survey";
import { Course } from "model/course";

const results = {
    "section1": ["student1", "student2", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3"],
    "section2": ["student1", "student2", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3"],
    "section3": ["student1", "student2", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3", "student3"],
}

const exampleSurvey: Survey = {
    ID: "",
    courseID: "CSCI 1470",
    name: "Time Availability Survey",
    description: "Please choose all the times that you are available for.",
    endTime: new Date('March 30, 2023 03:00:00'),
    capacity: { "Tuesday 2-3pm": { "section1": 10 }, "Wednesday 2-3pm": { "section2": 50 }, "Friday 5-7pm": { "section3": 50 } },
    responses: {
        "student1": ["Tuesday 2-3pm"],
        "student2": ["Tuesday 2-3pm", "Wednesday 2-3pm"],
        "student3": ["Wednesday 2-3pm"],
        "student4": ["Wednesday 2-3pm"],
        "student5": ["Friday 5-7pm", "Wednesday 2-3pm"],
        "student6": ["Friday 5-7pm", "Wednesday 2-3pm"],
        "student7": ["Friday 5-7pm", "Tuesday 2-3pm"],
        "student8": ["Friday 5-7pm", "Tuesday 2-3pm"],
        "student9": ["Tuesday 2-3pm"],
        "student10": ["Tuesday 2-3pm", "Wednesday 2-3pm"],
        "student11": ["Tuesday 2-3pm", "Wednesday 2-3pm"],
        "student12": ["Tuesday 2-3pm", "Wednesday 2-3pm"],
        "student13": ["Wednesday 2-3pm"],
        "student14": ["Tuesday 2-3pm"],
        "student15": ["Friday 5-7pm", "Tuesday 2-3pm"],
        "student16": ["Tuesday 2-3pm", "Wednesday 2-3pm"],
        "student17": ["Tuesday 2-3pm", "Wednesday 2-3pm"],
        "student18": ["Friday 5-7pm"],
        "student19": ["Wednesday 2-3pm"],
        "student20": ["Wednesday 2-3pm"],
        "student21": ["Wednesday 2-3pm"],
        "student22": ["Wednesday 2-3pm"],
        "student23": ["Wednesday 2-3pm"],
        "student24": ["Wednesday 2-3pm"],
        "student25": ["Wednesday 2-3pm"],
        "student26": ["Wednesday 2-3pm"],
        "student27": ["Wednesday 2-3pm"],
        "student28": ["Wednesday 2-3pm"],
        "student29": ["Wednesday 2-3pm"],
        "student30": ["Wednesday 2-3pm"],
        "student31": ["Wednesday 2-3pm"],
        "student32": ["Wednesday 2-3pm"],
        "student33": ["Wednesday 2-3pm"],
        "student34": ["Wednesday 2-3pm"],
    },
    results: results,
    published: true,
}

export function useSurvey(surveyID: string | undefined): [Survey | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [survey, setSurvey] = useState<Survey | undefined>(undefined);

    useEffect(() => {
        if (surveyID && surveyID !== "") {
            const db = getFirestore();
            const unsubscribe = onSnapshot(doc(db, "surveys", surveyID), (doc) => {
                if (doc.exists()) {
                    setSurvey({ ID: doc.id, ...doc.data() } as Survey);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setSurvey(undefined)
        }
    }, [surveyID]);

    return [survey, loading];
}
