### Testing All Endpoints: A Comprehensive Guide

### Table of Endpoints by Action, Role, Method, and Data

Here is a comprehensive table summarizing all endpoints, their actions, roles, HTTP methods, data payloads (if any), and the total count of each method type.

| **Action**                             | **Endpoint**                        | **Role**         | **Method** | **Body (if required)**                                                                                       |
|----------------------------------------|-------------------------------------|------------------|------------|-------------------------------------------------------------------------------------------------------------|
| **Fetch Student Dashboard**            | `/users/student-dashboard`          | Student          | GET        | N/A                                                                                                         |
| **Fetch Professor Dashboard**          | `/users/professor-dashboard`        | Professor        | GET        | N/A                                                                                                         |
| **Create a Project**                   | `/projects/create`                  | Professor        | POST       | `{ "title": "Project Title", "description": "Project Description" }`                                       |
| **Edit a Project**                     | `/projects/:id`                     | Professor        | PUT        | `{ "title": "Updated Title", "description": "Updated Description" }`                                       |
| **Create a Team**                      | `/teams/create`                     | Student          | POST       | `{ "name": "Team Name", "projectId": "<PROJECT_ID>" }`                                                     |
| **Join a Team**                        | `/teams/join`                       | Student          | POST       | `{ "teamId": "<TEAM_ID>" }`                                                                                |
| **Leave a Team**                       | `/teams/leave`                      | Student          | POST       | `{ "teamId": "<TEAM_ID>", "projectId": "<PROJECT_ID>" }`                                                   |
| **Delete a Team**                      | `/teams/:teamId`                    | Professor        | DELETE     | N/A                                                                                                         |
| **Remove a Team Member**               | `/teams/remove-user`                | Professor        | POST       | `{ "teamId": "<TEAM_ID>", "userId": "<USER_ID>" }`                                                         |
| **Fetch Teams for a Project**          | `/teams/project/:projectId`         | Both             | GET        | N/A                                                                                                         |
| **View Deliverables for a Team**       | `/deliverables/team/:teamId`        | Both             | GET        | N/A                                                                                                         |
| **Submit a Deliverable**               | `/deliverables/create`              | Student          | POST       | `{ "teamId": "<TEAM_ID>", "projectId": "<PROJECT_ID>", "title": "Title", "description": "Description", ... }` |
| **Assign Jury to a Deliverable**       | `/deliverables/assign-jury`         | Professor        | POST       | `{ "deliverableId": "<DELIVERABLE_ID>", "jurySize": 3 }`                                                   |
| **Grade Deliverables (as Jury)**       | `/deliverables/grade`               | Student (Jury)   | POST       | `{ "deliverableId": "<DELIVERABLE_ID>", "grade": 95, "feedback": "Excellent work!" }`                      |
| **Fetch Grades for a Deliverable**     | `/deliverables/:deliverableId/professor-grades` | Professor | GET        | N/A                                                                                                         |

---

### **HTTP Methods Summary**

| **Method** | **Count** | **Description**                                                                 |
|------------|-----------|---------------------------------------------------------------------------------|
| **GET**    | 7         | Fetch dashboards, teams, deliverables, and grades.                              |
| **POST**   | 6         | Create projects, teams, assign jury, grade deliverables, join/leave/remove team. |
| **PUT**    | 1         | Edit projects.                                                                  |
| **DELETE** | 1         | Delete teams.                                                                   |

---

### **Quick Analysis**

- **GET Requests**: 7 endpoints focus on fetching data for dashboards, teams, deliverables, and grades.
- **POST Requests**: 6 endpoints for actions such as creating, submitting, joining, grading, or assigning.
- **PUT Requests**: 1 endpoint for updating project details.
- **DELETE Requests**: 1 endpoint for deleting teams.

This table and summary provide a clear roadmap for all actions and testing requirements within the application. 🚀

### **Before You Start**
1. **Launch the Application**:
   - Start the backend server with:
     ```bash
     nodemon server.js
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```

2. **Set Up Testing Tools**:
   - **Postman**: Install [Postman](https://www.postman.com/).
   - **Thunder Client**: Install the Thunder Client extension in VS Code.

3. **Authentication**:
   - Log in as a `student` or `professor` to get the **JWT token**.
   - Use the **Login Endpoint** to generate the token (explained below).

4. **Add Authorization**:
   - For Postman:
     - Go to the **Authorization tab**.
     - Set the **type** to `Bearer Token`.
     - Paste the token.
   - For Thunder Client:
     - In the request, click **Headers**.
     - Add a key-value pair:
       - **Key**: `Authorization`
       - **Value**: `Bearer <Your JWT Token>`.

---

### **Endpoints for Testing**

#### **1. Student Dashboard**

##### **A. Fetch Student Dashboard**
- **Endpoint**: `GET /users/student-dashboard`
- **Role**: Student
- **Description**: Retrieves all projects available to the student.
- **Test**:
  - Use a `GET` request with the JWT token.
  - Response: List of projects with associated teams and deliverables.

##### **B. Create a Team**
- **Endpoint**: `POST /teams/create`
- **Role**: Student
- **Payload**:
  ```json
  {
    "name": "Team Alpha",
    "projectId": "<PROJECT_ID>"
  }
  ```
- **Description**: Allows a student to create a team for a project.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

##### **C. Join a Team**
- **Endpoint**: `POST /teams/join`
- **Role**: Student
- **Payload**:
  ```json
  {
    "teamId": "<TEAM_ID>"
  }
  ```
- **Description**: Joins the student to an existing team.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

##### **D. Leave a Team**
- **Endpoint**: `POST /teams/leave`
- **Role**: Student
- **Payload**:
  ```json
  {
    "teamId": "<TEAM_ID>",
    "projectId": "<PROJECT_ID>"
  }
  ```
- **Description**: Removes the student from a team.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

##### **E. Submit a Deliverable**
- **Endpoint**: `POST /deliverables/create`
- **Role**: Student
- **Payload**:
  ```json
  {
    "teamId": "<TEAM_ID>",
    "projectId": "<PROJECT_ID>",
    "title": "Deliverable 1",
    "description": "This is the first deliverable.",
    "dueDate": "2025-01-10",
    "submissionLink": "http://example.com",
    "isLastDeliverable": false
  }
  ```
- **Description**: Allows a student to submit a deliverable for a project.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

##### **F. View Deliverables**
- **Endpoint**: `GET /deliverables/team/:teamId`
- **Role**: Student
- **Description**: Fetches all deliverables for the student's team.
- **Test**:
  - Use a `GET` request with the `teamId` in the URL.
  - Response: List of deliverables.

##### **G. Grade Deliverables (as a Jury)**
- **Endpoint**: `POST /deliverables/grade`
- **Role**: Student (jury member)
- **Payload**:
  ```json
  {
    "deliverableId": "<DELIVERABLE_ID>",
    "grade": "95",
    "feedback": "Excellent work!"
  }
  ```
- **Description**: Allows a student acting as a jury member to grade a deliverable.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

---

#### **2. Professor Dashboard**

##### **A. Fetch Professor Dashboard**
- **Endpoint**: `GET /users/professor-dashboard`
- **Role**: Professor
- **Description**: Retrieves all projects created by the professor.
- **Test**:
  - Use a `GET` request with the JWT token.
  - Response: List of projects.

##### **B. Create a Project**
- **Endpoint**: `POST /projects/create`
- **Role**: Professor
- **Payload**:
  ```json
  {
    "title": "Project Alpha",
    "description": "This is a new project."
  }
  ```
- **Description**: Allows a professor to create a new project.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

##### **C. Edit a Project**
- **Endpoint**: `PUT /projects/:id`
- **Role**: Professor
- **Payload**:
  ```json
  {
    "title": "Updated Project Title",
    "description": "Updated project description."
  }
  ```
- **Description**: Updates project details.
- **Test**:
  - Use a `PUT` request with the `projectId` in the URL and the payload.
  - Response: Success message.

##### **D. Fetch Teams for a Project**
- **Endpoint**: `GET /teams/project/:projectId`
- **Role**: Professor
- **Description**: Fetches all teams for a specific project.
- **Test**:
  - Use a `GET` request with the `projectId` in the URL.
  - Response: List of teams.

##### **E. Delete a Team**
- **Endpoint**: `DELETE /teams/:teamId`
- **Role**: Professor
- **Description**: Deletes a team by its ID.
- **Test**:
  - Use a `DELETE` request with the `teamId` in the URL.
  - Response: Success message.

##### **F. Remove a Team Member**
- **Endpoint**: `POST /teams/remove-user`
- **Role**: Professor
- **Payload**:
  ```json
  {
    "teamId": "<TEAM_ID>",
    "userId": "<USER_ID>"
  }
  ```
- **Description**: Removes a student from a team.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

##### **G. View Deliverables for a Team**
- **Endpoint**: `GET /deliverables/team/:teamId`
- **Role**: Professor
- **Description**: Fetches deliverables for a specific team.
- **Test**:
  - Use a `GET` request with the `teamId` in the URL.
  - Response: List of deliverables.

##### **H. Assign Jury to a Deliverable**
- **Endpoint**: `POST /deliverables/assign-jury`
- **Role**: Professor
- **Payload**:
  ```json
  {
    "deliverableId": "<DELIVERABLE_ID>",
    "jurySize": 3
  }
  ```
- **Description**: Assigns a jury to grade a deliverable.
- **Test**:
  - Use a `POST` request with the payload.
  - Response: Success message.

##### **I. Fetch Grades for a Deliverable**
- **Endpoint**: `GET /deliverables/:deliverableId/professor-grades`
- **Role**: Professor
- **Description**: Fetches all grades for a specific deliverable.
- **Test**:
  - Use a `GET` request with the `deliverableId` in the URL.
  - Response: List of grades.

---

### **How to Test Endpoints in Postman/Thunder Client**

#### **Postman**:
1. **Create a New Request**:
   - Open Postman and click on **New > Request**.
   - Set the method (e.g., `GET`, `POST`, etc.).
   - Enter the endpoint URL.
   - For endpoints requiring a **payload**, go to the **Body tab** and select `raw` with `JSON`.
2. **Set Authorization**:
   - Go to the **Authorization tab**.
   - Choose `Bearer Token`.
   - Paste your JWT token.
3. **Send the Request**:
   - Click **Send** and review the response in the lower pane.

#### **Thunder Client**:
1. **Open Thunder Client**:
   - Click on the Thunder Client icon in VS Code.
   - Create a new request.
2. **Set Up the Request**:
   - Choose the method (e.g., `GET`, `POST`) and enter the endpoint URL.
   - If required, add the payload in the **Body** section (JSON format).
3. **Add Headers

**:
   - In the **Headers tab**, add:
     - Key: `Authorization`
     - Value: `Bearer <Your JWT Token>`
4. **Send the Request**:
   - Click **Send** to test the endpoint and view the response.

