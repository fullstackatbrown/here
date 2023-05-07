import { collection, getFirestore, onSnapshot } from "@firebase/firestore";
import { FirestoreCoursesCollection, FirestoreSurveysCollection } from "api/firebaseConst";
import { Survey } from "model/survey";
import { useEffect, useState } from "react";

export function useSurveys(courseID: string): [Survey[] | undefined, boolean] {
    const [loading, setLoading] = useState(true);
    const [survey, setSurvey] = useState<Survey[] | undefined>(undefined);

    useEffect(() => {
        const db = getFirestore();
        const unsubscribe = onSnapshot(collection(db, FirestoreCoursesCollection, courseID, FirestoreSurveysCollection), (querySnapshot) => {
            const res: Survey[] = [];
            if (querySnapshot.size === 0) {
                setSurvey(undefined)
            } else {
                querySnapshot.forEach((doc) => {
                    res.push({ ID: doc.id, ...doc.data() } as Survey);
                });
                setSurvey(res);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [courseID]);

    return [survey, loading];
}
