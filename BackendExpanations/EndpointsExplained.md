### Testing All Endpoints: A Comprehensive Guide


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

