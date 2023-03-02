# Here

## Developer Guide

Make sure you have Go and npm installed on your device

-   Start backend: `cd backend`, `go run main.go`
-   Start frontend: `cd frontend`, `yarn dev`

## Firestore

-   Go to firebase project and follow the steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to generate a private key file. Put it in the root of backend folder and rename it as `dev-firebase-config.json`

## Backend APIs

### Methods - Courses

| Description         | Route                                        | Body                                 | Auth  |
|---------------------|----------------------------------------------|--------------------------------------|-------|
| Get course by id    | `GET /v1/courses/{courseId}`                 |                                      | All   |
| Delete course by id | `DELETE /v1/courses/{courseId}`              |                                      | Admin |
| Assign sections     | `POST /v1/courses/{courseId}/assignSections` | Optional: `studentId`, `sectionId`   | Admin |
| Create course       | `POST /v1/courses`                           | Mandatory: `title`, `code`, `term`   | Admin |
| Update course       | `PATCH /v1/courses/{courseId}`               | Optional: `gradeOptions`, `surveyID` | Admin |

### Methods - Sections

| Description       | Route                                                | Body                                                                       | Auth  |
|-------------------|------------------------------------------------------|----------------------------------------------------------------------------|-------|
| Get all sections  | `GET /v1/courses/{courseId}/sections`                |                                                                            | Staff |
| Get section by id | `GET /v1/courses/{courseId}/sections/{sectionId}`    |                                                                            | All   |
| Delete section    | `DELETE /v1/courses/{courseId}/sections/{sectionId}` |                                                                            | Admin |
| Create section    | `POST /v1/courses/{courseId}/sections/`              | Mandatory: `day`, `startTime`, `endTime`; Optional: `location`, `capacity` | Admin |
| Update section    | `PATCH /v1/courses/{courseId}/sections/{sectionId}`  | Optional: `day`, `startTime`, `endTime`, `location`, `capacity`            | Admin |

### Methods - Assignments

| Description          | Route                                                      | Body                                                   | Auth  |
|----------------------|------------------------------------------------------------|--------------------------------------------------------|-------|
| Get all assignments  | `GET /v1/courses/{courseId}/assignments`                   |                                                        | All   |
| Get assignment by id | `GET /v1/courses/{courseId}/assignments/{assignmentId}`    |                                                        | All   |
| Delete assignment    | `DELETE /v1/courses/{courseId}/assignments/{assignmentId}` |                                                        | Admin |
| Create assignment    | `POST /v1/courses/{courseId}/assignments/`                 | Mandatory: `name`, `mandatory`, `startDate`, `endDate` | Admin |
| Update assignment    | `PATCH /v1/courses/{courseId}/assignments/{assignmentId}`  | Optional: `name`, `mandatory`, `startDate`, `endDate`  | Admin |

### Methods - Surveys

| Description      | Route                                                                    | Body                         | Auth  |
|------------------|--------------------------------------------------------------------------|------------------------------|-------|
| Get survey by id | `GET /v1/courses/{courseId}/surveys/{surveyID}/`                         |                              | Staff |
| Create survey    | `POST /v1/courses/{courseId}/surveys`                                    | Mandatory: `name`            | Admin |
| Publish          | `POST /v1/courses/{courseId}/surveys/{surveyID}/publish`                 |                              | Admin |
| Create response  | `POST /v1/courses/{courseId}/surveys/{surveyID}/responses`               | Mandatory: `times: []string` | All   |
| Edit response    | `PATCH /v1/courses/{courseId}/surveys/{surveyID}/responses/{responseId}` | Mandatory: `times: []string` | All   |

### Methods - Swaps

| Description           | Route                                          | Body                                                                           | Response                        | Auth         |
|-----------------------|------------------------------------------------|--------------------------------------------------------------------------------|---------------------------------|--------------|
| Create a Swap Request | `POST /v1/courses/{courseId}/swaps/`           | Mandatory: `studentID`, `oldSectionID`, `toSectionID`, `isTemporary`, `reason` | `{status: string, msg: string}` | All          |
| Update Swap Request   | `PATCH /v1/courses/{courseId}/swaps/{swapID}/` | Mandatory: `status`                                                            |                                 | Staff & Self |
| Get all Swaps         | `GET /v1/courses/{courseId}/swaps/`            |                                                                                | JSON of swaps                   | Staff        |
| Get swap by student   | `GET /v1/courses/{courseId}/swaps/me`          |                                                                                |                                 | All          |

### Methods - Grades

| Description              | Route                                                                      | Body                                    | Auth  |
|--------------------------|----------------------------------------------------------------------------|-----------------------------------------|-------|
| Get grades by assignment | `GET /v1/courses/{courseId}/assignments/{assignmentID}grades`              |                                         | Staff |
| Get grades by student    | `GET /v1/courses/{courseId}/grades`                                        | Mandatory: `studentID`                  | All   |
| Create a grade           | `POST /v1/courses/{courseId}/assignments/{assignmentID}/grades`            | Mandatory: `studentID`, `grade`, `taID` | Staff |
| Update a grade           | `PATCH /v1/courses/{courseId}/assignments/{assignmentID}/grades/{gradeId}` | Mandatory: `studentID`, `grade`, `taID` | Staff |
| Export grades            | `POST /v1/courses/{courseId}/exportGrades`                                 |                                         | Admin |

### Methods - Users

| Description      | Route                      | Body | Auth |
|------------------|----------------------------|------|------|
| Get current user | `GET /v1/users`            |      | All  |
| Get user by ID   | `GET /v1/users/{userId}`   |      | All  |
| Update user      | `PATCH /v1/users/{userId}` |      | All  |
| Join a course    | ``                         |      | All  |
| Quit a course    | ``                         |      | All  |

## Data Schema

<pre>
<b>courses (collection)</b>
    id: string                     # unique id of the course
    title: string                  # name of the course
    courseCode: string             # course's course code
    term: string                   # semester this course is offered
    gradeOptions: []string         # list of grade options for the course default: [completed, incomplete, ungraded]
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
    startDate: string                   # when the assignment is released
    endDate: string                     # when the assignment is due
    gradesByStudent: map[string]string  # map from studentID to their gradeID

<b>grades (sub-sub-collection)</b>
    id: string                         # unique grade id
    studentID: string                  # the id of the student the grade is for
    assignmentID: string
    grade: string                      # the grade in gradeOptions
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
    status: string                         # submitted, cancelled, approved, denied
    handledBy: string                      # automatic or taID

<b>profiles (collection)</b>
    displayName: string
    email: string
    auth: map[string]string                          # map from courseID to "admin", or "staff", or "student"
    defaultSections: map[string]string                # map from courseID to sectionID
    actualSections: map[string]map[string]string      # map from courseID to map from assignmentID to sectionID

<b>users (collection)</b>

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
