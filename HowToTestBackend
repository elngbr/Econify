### Using the Backend with Postman

This guide explains how to interact with your backend using **Postman**. The examples below cover creating accounts, logging in, and using various endpoints based on your controllers.
Here's the corrected guide with the exact path **Econify > Frontend > my-app**.

---

### Using the Backend with Postman

This guide explains how to interact with your backend using **Postman**. The examples below cover creating accounts, logging in, and using various endpoints based on your controllers.

---

### Setup

1. **Clone the Repository**:
   - Clone the repository from your version control system:
     ```bash
     git clone <repository-url>
     ```

2. **Navigate to the Backend Directory**:
   - Change to the backend directory:
     ```bash
     cd Econify/Backend
     ```

3. **Run the Backend Server**:
   - Start the backend server using `nodemon`:
     ```bash
     nodemon server.js
     ```
   - The backend will be available at `http://localhost:3000`.

---

### Frontend Testing

1. **Navigate to the Frontend Directory**:
   - Open a new terminal or PowerShell window and navigate to the frontend folder:
     ```bash
     cd Econify/Frontend/my-app
     ```

2. **Run the Frontend Application**:
   - Start the frontend development server:
     ```bash
     npm run dev
     ```
   - The frontend will be available at `http://localhost:5173` or the address shown in your terminal.

3. **Access the Application**:
   - Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

4. **Test the End-to-End Flow**:
   - Use the frontend UI to interact with your backend API. Ensure the backend server is running concurrently with the frontend.

---

### Postman Setup for Backend Testing

1. **Start Your Backend**:
   - Ensure your backend server is running as described above.

2. **Postman Installation**:
   - Download and install Postman if you haven’t already: [https://www.postman.com/downloads/](https://www.postman.com/downloads/).

3. **Authorization Header**:
   - After logging in, most endpoints require a token. Add the token to the `Authorization` header:
     ```
     Authorization: Bearer <JWT_TOKEN>
     ```

---

### Backend Testing Step-by-Step

#### 1. **Register a New User**
   - **Endpoint**: `POST /api/users/register`
   - **Method**: POST
   - **Body (JSON)**:
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "password": "securepassword",
       "role": "student",
       "major": "Computer Science",
       "year": 3
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User registered successfully.",
       "user": {
         "id": 1,
         "name": "John Doe",
         "email": "john.doe@example.com",
         "role": "student"
       }
     }
     ```

#### 2. **Login**
   - **Endpoint**: `POST /api/users/login`
   - **Method**: POST
   - **Body (JSON)**:
     ```json
     {
       "email": "john.doe@example.com",
       "password": "securepassword"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Login successful.",
       "id": 1,
       "name": "John Doe",
       "email": "john.doe@example.com",
       "role": "student",
       "token": "<JWT_TOKEN>"
     }
     ```
   - Copy the `token` and use it in subsequent requests by adding it to the `Authorization` header.

---

### Tips for Testing

1. **Organize Requests**:
   - Create a collection in Postman and group endpoints by user roles (e.g., Student, Professor).

2. **Save Tokens**:
   - Use Postman’s **Environment Variables** to save tokens and reuse them across requests.

3. **Set Headers Automatically**:
   - Configure **Authorization** headers globally for your collection.

4. **Frontend-Backend Integration**:
   - Use the frontend application to test full functionality while ensuring your backend handles the requests properly.

By following these steps, you can test both your backend and frontend seamlessly!

---

### Setup

1. **Start Your Backend**:
   - Make sure your backend is running. Start it with:
     ```
     node server.js
     ```
   - The server should be accessible at `http://localhost:3000`.

2. **Postman Installation**:
   - Download and install Postman if you haven’t already: [https://www.postman.com/downloads/](https://www.postman.com/downloads/).

3. **Authorization Header**:
   - After logging in, most endpoints require a token. Add the token to the `Authorization` header:
     ```
     Authorization: Bearer <JWT_TOKEN>
     ```

---

### Step-by-Step Instructions

#### 1. **Register a New User**
   - **Endpoint**: `POST /api/users/register`
   - **Method**: POST
   - **Body (JSON)**:
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "password": "securepassword",
       "role": "student",
       "major": "Computer Science",
       "year": 3
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User registered successfully.",
       "user": {
         "id": 1,
         "name": "John Doe",
         "email": "john.doe@example.com",
         "role": "student"
       }
     }
     ```

---

#### 2. **Login**
   - **Endpoint**: `POST /api/users/login`
   - **Method**: POST
   - **Body (JSON)**:
     ```json
     {
       "email": "john.doe@example.com",
       "password": "securepassword"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Login successful.",
       "id": 1,
       "name": "John Doe",
       "email": "john.doe@example.com",
       "role": "student",
       "token": "<JWT_TOKEN>"
     }
     ```
   - Copy the `token` and use it in subsequent requests by adding it to the `Authorization` header.

---

#### 3. **Get Profile**
   - **Endpoint**: `GET /api/users/profile`
   - **Method**: GET
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Response**:
     ```json
     {
       "id": 1,
       "name": "John Doe",
       "email": "john.doe@example.com",
       "role": "student"
     }
     ```

---

### Student Endpoints

#### 4. **View Student Dashboard**
   - **Endpoint**: `GET /api/users/student-dashboard`
   - **Method**: GET
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Response**:
     ```json
     {
       "projects": [
         {
           "projectId": 1,
           "projectTitle": "AI Research",
           "projectDescription": "Explore AI advancements.",
           "formator": "Dr. Smith",
           "isStudentInTeam": true,
           "studentTeams": [
             {
               "teamId": 3,
               "teamName": "AI Enthusiasts",
               "deliverables": [],
               "lastDeliverableId": null
             }
           ]
         }
       ]
     }
     ```

#### 5. **Join a Team**
   - **Endpoint**: `POST /api/teams/join`
   - **Method**: POST
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Body (JSON)**:
     ```json
     {
       "teamId": 3
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Successfully joined the team.",
       "team": {
         "id": 3,
         "name": "AI Enthusiasts"
       }
     }
     ```

#### 6. **View Deliverables Assigned to You**
   - **Endpoint**: `GET /api/deliverables/assigned`
   - **Method**: GET
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Response**:
     ```json
     {
       "deliverables": [
         {
           "deliverableId": 4,
           "title": "AI Paper Review",
           "description": "Review a published AI paper.",
           "dueDate": "2025-01-10T00:00:00.000Z",
           "teamName": "AI Enthusiasts",
           "projectTitle": "AI Research",
           "professorName": "Dr. Smith",
           "submissionLink": null,
           "grade": "No Grade",
           "feedback": "No Feedback"
         }
       ]
     }
     ```

---

### Professor Endpoints

#### 7. **View Professor Dashboard**
   - **Endpoint**: `GET /api/users/professor-dashboard`
   - **Method**: GET
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Response**:
     ```json
     {
       "projects": [
         {
           "projectId": 1,
           "projectTitle": "AI Research",
           "projectDescription": "Explore AI advancements."
         }
       ]
     }
     ```

#### 8. **Create a Project**
   - **Endpoint**: `POST /api/projects/create`
   - **Method**: POST
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Body (JSON)**:
     ```json
     {
       "title": "AI Research",
       "description": "Explore AI advancements."
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Project created successfully.",
       "project": {
         "id": 1,
         "title": "AI Research",
         "description": "Explore AI advancements."
       }
     }
     ```

#### 9. **Assign Jury to Deliverables**
   - **Endpoint**: `POST /api/deliverables/assign-jury`
   - **Method**: POST
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Body (JSON)**:
     ```json
     {
       "deliverableId": 4,
       "jurySize": 3
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Jury assigned successfully.",
       "jurors": [
         { "id": 6, "name": "Alice" },
         { "id": 7, "name": "Bob" },
         { "id": 8, "name": "Charlie" }
       ]
     }
     ```

---

### General Endpoints

#### 10. **Remove User from a Team**
   - **Endpoint**: `POST /api/teams/remove-user`
   - **Method**: POST
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Body (JSON)**:
     ```json
     {
       "teamId": 3,
       "userId": 6
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User 6 removed from team 3 successfully."
     }
     ```

#### 11. **Get Team Members**
   - **Endpoint**: `GET /api/teams/:teamId/members`
   - **Method**: GET
   - **Headers**:
     - `Authorization: Bearer <JWT_TOKEN>`
   - **Response**:
     ```json
     {
       "members": [
         { "id": 5, "name": "Alice", "email": "alice@example.com" },
         { "id": 6, "name": "Bob", "email": "bob@example.com" }
       ]
     }
     ```

---

### Tips for Testing in Postman
1. **Organize Requests**:
   - Create a collection in Postman and group endpoints by user roles (e.g., Student, Professor).

2. **Save Tokens**:
   - Use Postman’s **Environment Variables** to save tokens and reuse them across requests.

3. **Set Headers Automatically**:
   - Configure **Authorization** headers globally for your collection.

4. **Check Responses**:
   - Look for success messages or errors in the response to verify functionality.

By following these steps, you can interact with your backend system effectively using Postman!