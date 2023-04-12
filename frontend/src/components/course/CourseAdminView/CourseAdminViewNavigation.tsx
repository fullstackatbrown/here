import { Badge, Button, Stack } from "@mui/material";
import { usePendingSwaps } from "api/swaps/hooks";
import { View } from "model/general";
import { CoursePermission } from "model/user";
import { useRouter } from "next/router";

interface CourseAdminViewNavigationProps {
    access: CoursePermission;
}

export default function CourseAdminViewNavigation({ access }: CourseAdminViewNavigationProps) {
    const router = useRouter();
    const { query } = router;
    const [pendingRequests, _] = usePendingSwaps(query.courseID as string);

    function navigateTo(view: View) {
        return () => {
            router.push(`${router.query.courseID}?view=${view}`, undefined, { shallow: true })
        }
    }

    function capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getNavigationButton(view: View) {
        return (
            <Button
                sx={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    fontWeight: query.view === view ? 700 : 400,
                }}
                color={query.view === view ? "inherit" : "secondary"}
                variant="text" onClick={navigateTo(view)}
            >
                {capitalizeFirstLetter(view)}
            </Button >
        )
    }

    return (
        <Stack alignItems="start">
            {getNavigationButton("sections")}
            {getNavigationButton("assignments")}
            {getNavigationButton("people")}
            {pendingRequests && pendingRequests.length > 0 ?
                <Badge
                    color="primary"
                    badgeContent={pendingRequests.length}
                    sx={{
                        "& .MuiBadge-badge": {
                            right: -10,
                            top: "50%",
                        },
                    }}
                >
                    {getNavigationButton("requests")}
                </Badge> : getNavigationButton("requests")
            }
            {access === CoursePermission.CourseAdmin && getNavigationButton("settings")}
        </Stack>
    )
}
