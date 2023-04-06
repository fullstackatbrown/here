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
| Get section by id | `GET /courses/{courseId}/sections/{sectionId}`    |                                                                            | All   |
| Delete section    | `DELETE /courses/{courseId}/sections/{sectionId}` |                                                                            | Admin |
| Create section    | `POST /courses/{courseId}/sections/`              | Mandatory: `day`, `startTime`, `endTime`; Optional: `location`, `capacity` | Admin |
| Update section    | `PATCH /courses/{courseId}/sections/{sectionId}`  | Optional: `day`, `startTime`, `endTime`, `location`, `capacity`            | Admin |

### Methods - Assignments

| Description          | Route                                                   | Body                                                     | Auth  |
|----------------------|---------------------------------------------------------|----------------------------------------------------------|-------|
| Get assignment by id | `GET /courses/{courseId}/assignments/{assignmentId}`    |                                                          | All   |
| Delete assignment    | `DELETE /courses/{courseId}/assignments/{assignmentId}` |                                                          | Admin |
| Create assignment    | `POST /courses/{courseId}/assignments/`                 | Mandatory: `name`, `mandatory`, `releaseDate`, `dueDate` | Admin |
| Update assignment    | `PATCH /courses/{courseId}/assignments/{assignmentId}`  | Optional: `name`, `mandatory`, `releaseDate`, `dueDate`  | Admin |

### Methods - Surveys

| Description      | Route                                                                 | Body                         | Auth  |
|------------------|-----------------------------------------------------------------------|------------------------------|-------|
| Get survey by id | `GET /courses/{courseId}/surveys/{surveyID}/`                         |                              | Staff |
| Create survey    | `POST /courses/{courseId}/surveys`                                    | Mandatory: `name`            | Admin |
| Publish          | `POST /courses/{courseId}/surveys/{surveyID}/publish`                 |                              | Admin |
| Generate Result  | `POST /courses/{courseId}/surveys/{surveyID}/results`                 |                              | Admin |
| Create response  | `POST /courses/{courseId}/surveys/{surveyID}/responses`               | Mandatory: `times: []string` | All   |
| Edit response    | `PATCH /courses/{courseId}/surveys/{surveyID}/responses/{responseId}` | Mandatory: `times: []string` | All   |

### Methods - Swaps

| Description           | Route                                              | Body                                                                           | Response                        | Auth  |
|-----------------------|----------------------------------------------------|--------------------------------------------------------------------------------|---------------------------------|-------|
| Create a Swap Request | `POST /courses/{courseId}/swaps/`                  | Mandatory: `studentID`, `oldSectionID`, `toSectionID`, `isTemporary`, `reason` | `{status: string, msg: string}` | All   |
| Update Swap Request   | `PATCH /courses/{courseId}/swaps/{swapID}/`        |                                                                                |                                 | Self  |
| Handle Swap Request   | `PATCH /courses/{courseId}/swaps/{swapID}/handle`  | Mandatory: `status`, `handledBy`                                               |                                 | Staff |
| Cancel Swap Request   | `DELETE /courses/{courseId}/swaps/{swapID}/handle` |                                                                                |                                 | Self  |


### Methods - Grades

| Description    | Route                                                                    | Body                                    | Auth  |
|----------------|--------------------------------------------------------------------------|-----------------------------------------|-------|
| Create a grade | `POST /courses/{courseId}/assignments/{assignmentID}/grades`             | Mandatory: `studentID`, `grade`, `taID` | Staff |
| Update a grade | `PATCH /courses/{courseId}/assignments/{assignmentID}/grades/{gradeId}`  | Mandatory: `studentID`, `grade`, `taID` | Staff |
| Update a grade | `DELETE /courses/{courseId}/assignments/{assignmentID}/grades/{gradeId}` | Mandatory: `studentID`, `taID`          | Staff |
| Export grades  | `POST /courses/{courseId}/export`                                        |                                         | Admin |

### Methods - Users

| Description      | Route                              | Body                    | Auth |
|------------------|------------------------------------|-------------------------|------|
| Get current user | `GET /users`                       |                         | All  |
| Get user by ID   | `GET /users/{userId}`              |                         | All  |
| Update user      | `PATCH /users/{userId}`            |                         | All  |
| Join a course    | `PATCH /users/{userId}/joinCourse` | Mandatory: `accessCode` | All  |
| Quit a course    | `PATCH /users/{userId}/quitCourse` | Mandatory: `courseID`   | All  |

## Data Schema

<pre>
<b>courses</b>
    id: string                                     # unique id of the course
    title: string                                  # name of the course
    code: string                                   # course's course code
    entryCode: string                              # course's entry code, 6 randomly generated characters
    term: string                                   # semester this course is offered
    students: map[string]string                    # map from studentIDs to sectionIDs
    swapRequests: []string

    <b>sections (sub-collection)</b>
        id: string                                 # unique id of the section
        courseID: string
        day: string                                # the day this section runs
        startTime: string                          # the time the section starts
        endTime: string                            # the time the section ends
        location: string                           # where the section takes place
        capacity: int                              # max section capacity
        swappedInStudents: map[string][]string     # maps assignmentIDs to studentIDs that swap into this section
        swappedOutStudents: map[string][]string    # maps assignmentIDs to studentIDs that swapped out of this section

    <b>assignments (sub-collection)</b>
        id: string                                 # unique assignment id
        courseID: string
        name: string                               # name of the assignment
        optional: bool                             # whether or not this assignment is optional
        maxScore: int                              # maximum points possible
        releaseDate: string                        # when the assignment is released
        dueDate: string                            # when the assignment is due

        <b>grades (sub-collection)</b>
            id: string                             # unique grade id
            studentID: string                      # the id of the student the grade is for
            assignmentID: string
            grade: int                             # grade
            gradedBy: string                       # id of the TA that graded the assignment
            timeUpdated: string                    # when the time was updated

    <b>swap (sub-collection)</b>
        id: string
        studentID: string                          # ID of student
        oldSectionID: string                       # ID of the section the student is swapping out of
        newSectionID: string                       # ID of the section the student is swapping into
        assignmentID: string                       # ID of the assignment for which the request is for, null for permanent swap
        requestTime: timestamp                     # when the request was submitted
        reason: string                             # reason for the swap
        status: string                             # pending, cancelled, approved, denied, archived
        handledBy: string                          # automatic or taID

    <b>surveys (sub-collection)</b>
        id: string
        courseID: string
        name: string
        published: bool                            # whether if the survey is published
        endTime: timestamp                         # when this survey will be made unavailable
        description: string
        capacity: map[string]map[string]int        # map from time to a map from sectionID to capacity
        responses: map[string][]string             # map from studentID to available times
        results: map[string][]string               # final results: map from sectionID to list of studentIDs

<b>profiles</b>
    displayName: string
    email: string
    access: map[string]string                      # map from courseID to "admin", or "staff"
    courses: []string                              # list of courseIDs enrolled in as student
    defaultSections: map[string]string             # map from courseID to sectionID
    actualSections: map[string]map[string]string   # map from courseID to map from assignmentID to sectionID

</pre>

### A Note on time
All time information is represented as a string in ISO format, in UTC timezone in the database. E.g. "2014-08-18T07:00:00.000Z". 