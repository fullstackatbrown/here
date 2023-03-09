# Here

## Developer Guide

Make sure you have Go and npm installed on your device

-   Start backend: `cd backend`, `go run main.go`
-   Start frontend: `cd frontend`, `yarn dev`

## Firestore

-   Go to firebase project and follow the steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to generate a private key file. Put it in the root of backend folder and rename it as `dev-firebase-config.json`

## Backend APIs

### Methods - Courses

| Description         | Route                                     | Body                                 | Auth  |
|---------------------|-------------------------------------------|--------------------------------------|-------|
| Get course by id    | `GET /courses/{courseId}`                 |                                      | All   |
| Delete course by id | `DELETE /courses/{courseId}`              |                                      | Admin |
| Assign sections     | `POST /courses/{courseId}/assignSections` | Optional: `studentId`, `sectionId`   | Admin |
| Create course       | `POST /courses`                           | Mandatory: `title`, `code`, `term`   | Admin |
| Update course       | `PATCH /courses/{courseId}`               | Optional: `gradeOptions`, `surveyID` | Admin |

### Methods - Sections

| Description       | Route                                             | Body                                                                       | Auth  |
|-------------------|---------------------------------------------------|----------------------------------------------------------------------------|-------|
| Get all sections  | `GET /courses/{courseId}/sections`                |                                                                            | Staff |
| Get section by id | `GET /courses/{courseId}/sections/{sectionId}`    |                                                                            | All   |
| Delete section    | `DELETE /courses/{courseId}/sections/{sectionId}` |                                                                            | Admin |
| Create section    | `POST /courses/{courseId}/sections/`              | Mandatory: `day`, `startTime`, `endTime`; Optional: `location`, `capacity` | Admin |
| Update section    | `PATCH /courses/{courseId}/sections/{sectionId}`  | Optional: `day`, `startTime`, `endTime`, `location`, `capacity`            | Admin |

### Methods - Assignments

| Description          | Route                                                   | Body                                                   | Auth  |
|----------------------|---------------------------------------------------------|--------------------------------------------------------|-------|
| Get all assignments  | `GET /courses/{courseId}/assignments`                   |                                                        | All   |
| Get assignment by id | `GET /courses/{courseId}/assignments/{assignmentId}`    |                                                        | All   |
| Delete assignment    | `DELETE /courses/{courseId}/assignments/{assignmentId}` |                                                        | Admin |
| Create assignment    | `POST /courses/{courseId}/assignments/`                 | Mandatory: `name`, `mandatory`, `startDate`, `endDate` | Admin |
| Update assignment    | `PATCH /courses/{courseId}/assignments/{assignmentId}`  | Optional: `name`, `mandatory`, `startDate`, `endDate`  | Admin |

### Methods - Surveys

| Description      | Route                                                                 | Body                         | Auth  |
|------------------|-----------------------------------------------------------------------|------------------------------|-------|
| Get survey by id | `GET /courses/{courseId}/surveys/{surveyID}/`                         |                              | Staff |
| Create survey    | `POST /courses/{courseId}/surveys`                                    | Mandatory: `name`            | Admin |
| Publish          | `POST /courses/{courseId}/surveys/{surveyID}/publish`                 |                              | Admin |
| Create response  | `POST /courses/{courseId}/surveys/{surveyID}/responses`               | Mandatory: `times: []string` | All   |
| Edit response    | `PATCH /courses/{courseId}/surveys/{surveyID}/responses/{responseId}` | Mandatory: `times: []string` | All   |

### Methods - Swaps

| Description           | Route                                       | Body                                                                           | Response                        | Auth         |
|-----------------------|---------------------------------------------|--------------------------------------------------------------------------------|---------------------------------|--------------|
| Create a Swap Request | `POST /courses/{courseId}/swaps/`           | Mandatory: `studentID`, `oldSectionID`, `toSectionID`, `isTemporary`, `reason` | `{status: string, msg: string}` | All          |
| Update Swap Request   | `PATCH /courses/{courseId}/swaps/{swapID}/` | Mandatory: `status`                                                            |                                 | Staff & Self |
| Get all Swaps         | `GET /courses/{courseId}/swaps/`            |                                                                                | JSON of swaps                   | Staff        |
| Get swap by student   | `GET /courses/{courseId}/swaps/me`          |                                                                                |                                 | All          |

### Methods - Grades

| Description              | Route                                                                   | Body                                    | Auth  |
|--------------------------|-------------------------------------------------------------------------|-----------------------------------------|-------|
| Get grades by assignment | `GET /courses/{courseId}/assignments/{assignmentID}grades`              |                                         | Staff |
| Get grades by student    | `GET /courses/{courseId}/grades`                                        | Mandatory: `studentID`                  | All   |
| Create a grade           | `POST /courses/{courseId}/assignments/{assignmentID}/grades`            | Mandatory: `studentID`, `grade`, `taID` | Staff |
| Update a grade           | `PATCH /courses/{courseId}/assignments/{assignmentID}/grades/{gradeId}` | Mandatory: `studentID`, `grade`, `taID` | Staff |
| Export grades            | `POST /courses/{courseId}/exportGrades`                                 |                                         | Admin |

### Methods - Users

| Description        | Route                           | Body                                            | Auth |
|--------------------|---------------------------------|-------------------------------------------------|------|
| Get current user   | `GET /users`                    |                                                 | All  |
| Get user by ID     | `GET /users/{userId}`           |                                                 | All  |
| Update user        | `PATCH /users/{userId}`         |                                                 | All  |
| Join/Quit a course | `PATCH /users/{userId}/courses` | Mandatory: `courseID`, Action: `join` or `quit` | All  |

## Data Schema

<pre>
<b>courses (collection)</b>
    id: string                     # unique id of the course
    title: string                  # name of the course
    courseCode: string             # course's course code
    term: string                   # semester this course is offered
    students: map[string]string    # map from studentIDs to sectionIDs
    surveyID: string               # id of the survey attached to this course
    sectionIDs: []string           
    assignmentIDs: []string       
    swapRequests: []string 

<b>sections (sub-collection)</b>
    id: string                                # unique id of the section
    courseID: string
    day: string                               # the day this section runs
    startTime: string                         # the time the section starts
    endTime: string                           # the time the section ends
    location: string                          # where the section takes place
    capacity: int                             # max section capacity
    numStudentsEnrolled: int                  # how full the current section is
    swappedInStudents: map[string][]string    # maps assignmentIDs to studentIDs that swap into this section
    swappedOutStudents: map[string][]string   # maps assignmentIDs to studentIDs that swapped out of this section

<b>assignments (sub-collection)</b>
    id: string                          # unique assignment id
    courseID: string
    name: string                        # name of the assignment
    mandatory: bool                     # whether or not this assignment is mandatory to complete
    maxScore: int                       # maximum points possible
    startDate: string                   # when the assignment is released
    endDate: string                     # when the assignment is due
    gradesByStudent: map[string]string  # map from studentID to their gradeID

<b>grades (sub-sub-collection)</b>
    id: string                         # unique grade id
    studentID: string                  # the id of the student the grade is for
    assignmentID: string
    grade: int                         # grade
    gradedBy: string                   # id of the TA that graded the assignment
    timeUpdated: Timestamp             # when the time was updated

<b>swapRequest (sub-collection)</b>
    id: string
    studentID: string                      # ID of student
    oldSectionID: string                   # ID of the section the student is swapping out of
    newSectionID: string                   # ID of the section the student is swapping into
    isTemporary: bool                      # if this is a temporary swap or not
    requestTime: timestamp                 # when the request was submitted
    reason: string                         # reason for the swap
    status: string                         # pending, cancelled, approved, denied, archived
    handledBy: string                      # automatic or taID

<b>profiles (collection)</b>
    displayName: string
    email: string
    access: map[string]string                         # map from courseID to "admin", or "staff"
    courses: []string                                 # list of courseIDs enrolled in as student
    defaultSections: map[string]string                # map from courseID to sectionID
    actualSections: map[string]map[string]string      # map from courseID to map from assignmentID to sectionID

<b>surveys (collection)</b>
    id: string
    courseID: string
    name: string
    published: bool                            # whether if the survey is published
    description: string
    capacity: map[string]int                   # map from time to section capacity
    responses: map[string][]string             # map from studentID to available times
    numResponses: int
</pre>
