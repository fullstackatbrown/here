# Here

## Developer Guide

Make sure you have Go and npm installed on your device

-   Start backend: `cd backend`, `go run main.go`
-   Start frontend: `cd frontend`, `yarn dev`

## Firestore

-   Go to firebase project and follow the steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to generate a private key file. Put it in the root of backend folder and rename it as `dev-firebase-config.json`

## Backend APIs

### Methods - Courses

| Description         | Route                                        | Body                                             |
| ------------------- | -------------------------------------------- | ------------------------------------------------ |
| Get course by id    | `GET /v1/courses/{courseId}`                 |                                                  |
| Delete course by id | `DELETE /v1/courses/{courseId}`              |                                                  |
| Assign sections     | `POST /v1/courses/{courseId}/assignSections` |                                                  |
| Create course       | `POST /v1/courses`                           | Mandatory: `title`, `code`, `term`               |
| Update course       | `PATCH /v1/courses/{courseId}`               | Optional: `gradeOptions`, `students`, `surveyID` |

### Methods - Sections

| Description       | Route                                                | Body                                                                       |
| ----------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| Get section by id | `GET /v1/courses/{courseId}/sections/{sectionId}`    |                                                                            |
| Delete section    | `DELETE /v1/courses/{courseId}/sections/{sectionId}` |                                                                            |
| Create section    | `POST /v1/courses/{courseId}/sections/`              | Mandatory: `day`, `startTime`, `endTime`; Optional: `location`, `capacity` |
| Update section    | `PATCH /v1/courses/{courseId}/sections/{sectionId}`  | Optional: `day`, `startTime`, `endTime`, `location`, `capacity`            |

### Methods - Assignments

| Description          | Route                                                      | Body                                                   |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| Get assignment by id | `GET /v1/courses/{courseId}/assignments/{assignmentId}`    |                                                        |
| Delete assignment    | `DELETE /v1/courses/{courseId}/assignments/{assignmentId}` |                                                        |
| Create assignment    | `POST /v1/courses/{courseId}/assignments/`                 | Mandatory: `name`, `mandatory`, `startDate`, `endDate` |
| Update assignment    | `PATCH /v1/courses/{courseId}/assignments/{assignmentId}`  | Optional: `name`, `mandatory`, `startDate`, `endDate`  |

### Methods - Surveys

| Description               | Route                                   | Body                          |
| ------------------------- | --------------------------------------- | ----------------------------- |
| Get all student responses | `GET /v1/surveys/{surveyID}/`           |                               |
| Publish                   | `POST /v1/surveys/{surveyID}/publish`   |                               |
| Create survey             | `POST /v1/surveys`                      | Mandatory: `courseID`, `name` |
| Create response           | `POST /v1/surveys/{surveyID}/responses` | Mandatory: `times: []string`  |

### Methods - Swaps

| Description           | Route                                          | Body                                                                           | Response                  |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------- |
| Create a Swap Request | `POST /v1/courses/{courseId}/swaps/`           | Mandatory: `studentID`, `oldSectionID`, `toSectionID`, `isTemporary`, `reason` | `{ok: bool, msg: string}` |
| Handle Swap Request   | `PATCH /v1/courses/{courseId}/swaps/{swapID}/` | Mandatory: `approved`                                                          |                           |
| Get all Swaps         | `GET /v1/courses/{courseId}/swaps/`            |                                                                                | JSON of swaps             |

### Methods - Grades

| Description              | Route                                                                      | Body                                    |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| Get grades by assignment | `GET /v1/courses/{courseId}/assignments/{assignmentID}/grades`             |                                         |
| Get grades by student    | `GET /v1/courses/{courseId}/grades`                                        | Mandatory: `studentID`                  |
| Create a grade           | `POST /v1/courses/{courseId}/assignments/{assignmentID}/grades`            | Mandatory: `studentID`, `grade`, `taID` |
| Update a grade           | `PATCH /v1/courses/{courseId}/assignments/{assignmentID}/grades/{gradeId}` | Mandatory: `studentID`, `grade`, `taID` |

## Data Schema

<pre>
<b>courses (collection)</b>
    id: string                     # unique id of the course
    title: string               # name of the course
    courseCode: string          # course's course code
    term: string                # semester this course is offered
    gradeOptions: []string      # list of grade options for the course default: [completed, incomplete, ungraded]
    students: map[int]int       # map from studentIDs to sectionIDs
    surveyID: string            # id of the survey attached to this course
    <b>sections (sub-collection)</b>
        id: string                             # unique id of the section
        day: string                         # the day this section runs
        startTime: string                   # the time the section starts
        endTime: string                     # the time the section ends
        location: string                    # where the section takes place
        sectionCapacity: int                # max section capacity
        numStudentsEnrolled: int            # how full the current section is
        enrolledStudents: []string       # studentIDs enrolled in the section
        swappedInStudents: map[int][]int    # maps assignmentIDs to studentIDs that swap into this section
        swappedOutStudents: map[int]int     # maps assignmentIDs to studentIDs that swapped out of this section
    <b>assignments (sub-collection)</b>
        id: string                             # unique assignment id
        name: string                        # name of the assignment
        mandatory: bool                     # whether or not this assignment is mandatory to complete
        startDate: string                   # when the assignment is released
        endDate: string                     # when the assignment is due
        gradesByStudent: map[string]string  # map from studentID to their gradeID
        <b>grades (sub-sub-collection)</b>
            id: string                         # unique grade id
            studentID: string                  # the id of the student the grade is for
            grade: string                      # the grade in gradeOptions
            taId: string                       # id of the TA that graded the assignment
            timeUpdated: Timestamp             # when the time was updated
    <b>swapRequest (sub-collection)</b>
        id: string
        studentID: string                      # ID of student
        oldSectionID: string                   # ID of the section the student is swapping out of
        newSectionID: string                   # ID of the section the student is swapping into
        reason: string                         # reason for the swap
        approved: bool                         # if the swap was approved or not
        handledBy: string                      # automatic or taID
        isTemporary: bool                      # if this is a temporary swap or not


<b>students (collection)</b>
    id: string
    defaultSection: map[int]int                # map from courseID to sectionID
    actualSection: map[int]map[int]int         # map from courseID to map from assignmentID to sectionID

<b>surveys (collection)</b>
    id: string
    courseID: string
    name: string
    capacity: map[string]int                   # map from time to section capacity
    responses: map[int][]string                # map from studentID to available times
    numResponses: int
</pre>
