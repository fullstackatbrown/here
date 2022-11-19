import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import QueuePageHeader from "@components/queue/QueuePageHeader";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";
import AppLayout from "@components/shared/AppLayout";
import QueueOptions from "@components/queue/QueueOptions";
import QueueList from "@components/queue/QueueList";
import { useSection } from "@util/section/hooks";

export default function Queue() {
    const router = useRouter();
    const {queueID: sectionID} = router.query;
    const [section, sectionLoading] = useSection(sectionID as string);
    const [showCompletedTickets, setShowCompletedTickets] = useState(true);

    // Redirect user back to home page if no queue with given ID is found
    useEffect(() => {
        if (router.isReady && !sectionLoading && !section) {
            router.push("/")
                .then(() => toast.error("We couldn't find the queue you were looking for."));
        }
    }, [router, section, sectionLoading]);

    return (
        <AppLayout title={section?.title} maxWidth="lg" loading={sectionLoading}>
            {section && !sectionLoading && <>
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
