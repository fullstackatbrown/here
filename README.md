# Here

## Developer Guide

Make sure you have Go and npm installed on your device

-   Start backend: `cd backend`, `go run main.go`
-   Start frontend: `cd frontend`, `yarn dev`

## Firestore

-   Go to firebase project and follow the steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to generate a private key file. Put it in the root of backend folder and rename it as `dev-firebase-config.json`

## Backend APIs

## Data Schema

<pre>
<b>courses (collection)</b>
    id: int                     # unique id of the course
    title: string               # name of the course
    courseCode: string          # course's course code
    term: string                # semester this course is offered
    gradeOptions: []string      # list of grade options for the course
    students: map[int]int       # map from studentIDs to sectionIDs
    surveyID: string            # id of the survey attached to this course
    <b>sections (sub-collection)</b>
        id: int                             # unique id of the section
        day: string                         # the day this section runs
        startTime: string                   # the time the section starts
        endTime: string                     # the time the section ends
        location: string                    # where the section takes place
        sectionCapacity: int                # max section capacity
        numStudentsEnrolled: int            # how full the current section is
        enrolledStudents: []studentID       # studentIDs enrolled in the section
        swappedInStudents: map[int][]int    # maps assignmentIDs to studentIDs that swap into this section
        swappedOutStudents: map[int]int     # maps assignmentIDs to studentIDs that swapped out of this section
    <b>assignments (sub-collection)</b>
        id: int                             # unique assignment id
        name: string                        # name of the assignment
        mandatory: bool                     # whether or not this assignment is mandatory to complete
        startDate: string                   # when the assignment is released
        endDate: string                     # when the assignment is due
        <b>grades (sub-sub-collection)</b>
            id: int                         # unique grade id
            studentID: int                  # the id of the student the grade is for
            grade: string                   # the grade in gradeOptions
            taId: int                       # id of the TA that graded the assignment
            timeUpdated: Timestamp             # when the time was updated

<b>students (collection)</b>
    id: int
    defaultSection: map[int]int
    actualSection: map[int]map[int]int

<b>surveys (collection)</b>
    id: int
    courseID: int
    name: string
    capacity: map[int][int]
    responses: map[int][int]
    numResponses: int
</pre>
