### Authentication Overview

In this application, we use **JWT-based (JSON Web Token)** authentication to secure access to API endpoints. This ensures that only authorized users can interact with protected resources, such as creating projects, managing teams, or grading deliverables.

---

### Key Features of the Authentication System

1. **Stateless Authentication with JWT**: 
   - A **JWT** is issued to the user upon login and is sent with every subsequent request for authentication and user identification.
   - The server doesn’t store session data, making the system lightweight and scalable.

2. **Role-Based Access Control (RBAC)**:
   - Each user has a specific role (`student` or `professor`), which determines their permissions within the system.
   - Middleware validates roles to restrict access to specific actions.

3. **Authentication Middleware**:
   - Middleware functions like `verifyToken`, `isProfessor`, and `isStudent` validate the user's token and enforce role-based restrictions.

---

### Installed Packages for Authentication

- **`jsonwebtoken`**: Generates and verifies JWTs.
- **`bcryptjs`**: Safely hashes and verifies passwords.
- **`dotenv`**: Manages sensitive data (like the JWT secret) via environment variables.

---

### Principles of the Authentication Flow

#### 1. **Registration (`POST /api/users/register`)**
   - A user registers by providing their name, email, password, and role (`student` or `professor`).
   - Passwords are securely hashed using `bcryptjs` before storing them in the database.

#### 2. **Login (`POST /api/users/login`)**
   - The user provides their email and password.
   - The system verifies the credentials and generates a JWT if valid.
   - The token includes the user’s `id` and `role`, as well as an expiration timestamp.

   Example JWT Payload:
   ```json
   {
     "id": 123,
     "role": "student",
     "iat": 1672868400,
     "exp": 1672872000
   }
   ```

#### 3. **Token Verification**
   - Middleware (`verifyToken`) validates the JWT from the `Authorization` header.
   - If valid, the token’s payload (user details) is attached to the request object (`req.user`).

#### 4. **Role-Based Access**
   - Additional middleware (`isProfessor`, `isStudent`) checks the user’s role to allow or deny access to certain endpoints.

---

### How JWT Tokens Work

1. **Token Generation**:
   - After login, a JWT is generated using `jsonwebtoken.sign()`.
   - The payload contains user details (e.g., `id` and `role`) and is signed using a secret stored in `.env`.

2. **Token Usage**:
   - The token is sent in the `Authorization` header for every request:
     ```
     Authorization: Bearer <JWT_TOKEN>
     ```

3. **Token Verification**:
   - The server uses `jsonwebtoken.verify()` to decode and validate the token.
   - If valid, the server processes the request and attaches the user data from the token to `req.user`.

   Example Decoded Token:
   ```json
   {
     "id": 123,
     "role": "student",
     "iat": 1672868400,
     "exp": 1672872000
   }
   ```

---

### Controllers and Routes Overview

#### User Routes
- **`POST /api/users/register`**: 
  Registers a new user, securely hashing their password.
- **`POST /api/users/login`**: 
  Authenticates the user and returns a JWT.
- **`GET /api/users/profile`**: 
  Retrieves the logged-in user’s profile.
- **`GET /api/users/student-dashboard`**: 
  Fetches the student’s dashboard (restricted to students).
- **`GET /api/users/professor-dashboard`**: 
  Fetches the professor’s dashboard (restricted to professors).

#### Deliverable Routes
- **`POST /api/deliverables/create`**: 
  Students create deliverables for their teams.
- **`GET /api/deliverables/team/:teamId`**: 
  Fetches all deliverables for a specific team.
- **`POST /api/deliverables/assign-jury`**: 
  Professors assign jurors to deliverables.
- **`POST /api/deliverables/grade`**: 
  Jurors (students) submit grades for deliverables.
- **`PUT /api/deliverables/:deliverableId/release`**: 
  Professors release or hide grades for a deliverable.

#### Project Routes
- **`POST /api/projects/create`**: 
  Professors create new projects.
- **`GET /api/projects/`**: 
  Lists all projects (accessible by all authenticated users).
- **`PUT /api/projects/:id`**: 
  Professors edit their own projects.

#### Team Routes
- **`POST /api/teams/create`**: 
  Students create teams within a project.
- **`POST /api/teams/join`**: 
  Students join existing teams.
- **`GET /api/teams/project/:projectId`**: 
  Lists all teams for a specific project.
- **`POST /api/teams/remove-user`**: 
  Professors remove students from teams.

---

### Why This Authentication Method?

#### 1. **Stateless Authentication**:
   - **What does stateless mean?**
     - The server does not keep session data for users. Instead, the client holds the JWT, which acts as proof of authentication.
   - This makes the system lightweight, scalable, and suitable for distributed architectures.

#### 2. **Security**:
   - Passwords are hashed using `bcryptjs`, making them secure even if the database is compromised.
   - Tokens are short-lived and can be invalidated by not storing them after logout.

#### 3. **Scalability**:
   - Stateless systems are easy to scale horizontally (e.g., across multiple servers), as session data is not tied to a single server.

#### 4. **Separation of Concerns**:
   - Authentication logic is handled in middleware, while core business logic is managed in controllers. This improves code clarity and maintainability.