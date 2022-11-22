import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import QueuePageHeader from "@components/queue/QueuePageHeader";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import AppLayout from "@components/shared/AppLayout";
import QueueOptions from "@components/queue/QueueOptions";
import QueueList from "@components/queue/QueueList";
import { useSection } from "@util/section/hooks";
import CourseAdminView from "@components/course/CourseAdminView";
import { Course, Section } from "model/general";

export default function Queue() {
    const router = useRouter();
    const { queueID: sectionID } = router.query;
    const [section, sectionLoading] = useSection(sectionID as string);
    const [showCompletedTickets, setShowCompletedTickets] = useState(true);

    // Redirect user back to home page if no queue with given ID is found
    useEffect(() => {
        if (router.isReady && !sectionLoading && !section) {
            router.push("/")
                .then(() => toast.error("We couldn't find the queue you were looking for."));
        }
    }, [router, section, sectionLoading]);

    let section1: Section = {
        id: "1",
        day: 1,
        location: "CIT 477",
        startTime: "1230",
        endTime: "1430",
        capacity: 100,
        enrollment: 50,
        students: [],
    }

    let course: Course = {
        code: "cs1300",
        title: "User Interface and User Experience",
        sections: [section1],
        assignments: [],
        gradeOptions: [],
        students: [],
    }

    return (
        <AppLayout title={section?.title} maxWidth="lg" loading={sectionLoading}>
            {section && !sectionLoading && <><CourseAdminView course={course} />
                {/* <QueuePageHeader queue={section}/>
                <Grid container spacing={4} marginTop={1}>
                    <QueueOptions queue={section} queueID={sectionID as string}
                                  showCompletedTickets={showCompletedTickets}
                                  setShowCompletedTickets={setShowCompletedTickets}/>
                    <QueueList queue={section}
                               showCompletedTickets={showCompletedTickets}/>
                </Grid> */}
                {/* TODO: Implement section page */}
            </>}
        </AppLayout>
    );
}
