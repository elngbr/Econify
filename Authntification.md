### Authentication Process Explanation
![image](https://github.com/user-attachments/assets/63719496-14b1-4215-bfef-a8bb00e0598e)


### **1. User Registration**

1. **Client-Side (Frontend)**:
   - The user enters their name, email, and password on the registration form.
   - The password is validated client-side for strength (using regex, e.g., requiring a mix of letters, numbers, and special characters).
   - Upon submission, the data is sent to the backend via an HTTP POST request to `/users/register`.

2. **Backend (Node.js)**:
   - The backend checks if the email is already registered.
   - If not:
     - The password is hashed using `bcrypt` for secure storage.
     - A new user is created in the database (`User.create()`).
     - The user role is inferred from the email (e.g., "student" for emails containing "stud.ase").
   - A success message is sent back to the frontend.

---

### **2. User Login**

1. **Client-Side (Frontend)**:
   - The user enters their email and password into the login form.
   - Upon submission, the data is sent to the backend via an HTTP POST request to `/users/login`.

2. **Backend (Node.js)**:
   - The backend retrieves the user from the database by their email.
   - If the user is found:
     - The submitted password is compared to the hashed password in the database using `bcrypt.compare()`.
     - If the password matches:
       - A JWT is generated using `jsonwebtoken.sign()` with the user’s ID and a secret key (`process.env.JWT_SECRET`).
       - The token is returned to the client, along with user details (like `role`, `name`, etc.).
   - If the user is not found or the password is invalid, an error message is sent.

3. **Client-Side Session Management**:
   - The frontend receives the user data and token.
   - The user data is saved in local storage (`localStorage.setItem()`) for persistence.
   - The token is stored separately in `localStorage` to be sent with future requests for protected routes.

---

### **3. Session Management and Role-Based Access**

1. **Middleware on Backend**:
   - For protected routes, the client sends the stored JWT in the `Authorization` header (`Bearer <token>`).
   - Middleware (`verifyToken`) extracts and verifies the token:
     - It checks if the token is valid (`jwt.verify()`).
     - If valid, it retrieves the user details from the database (`User.findByPk(decoded.id)`).
     - The user is attached to `req.user`, making it available in the route handler.
     - If invalid or expired, a 401 error is returned.

2. **Role-Based Access Control**:
   - Middleware like `isProfessor` or `isStudent` checks the role of `req.user`.
   - If the role matches the required role for the route, access is granted; otherwise, a 403 error is returned.

---

### **4. Logout**

1. **Client-Side**:
   - On logout, the frontend clears the `user` and `token` from local storage and the state.
   - This prevents unauthorized access to protected routes.

### **Steps in the Diagram:**

1. **Login:**
   - The user sends their credentials to the `/users/login` endpoint.
   - The backend validates the credentials and generates a JWT.

2. **Token Storage:**
   - The frontend saves the token in `localStorage` to persist the session.

3. **Access Protected Routes:**
   - For every subsequent request to a protected route, the token is sent in the `Authorization` header.
   - The `verifyToken` middleware ensures the token is valid before granting access.

4. **Role-Specific Routes:**
   - Middleware like `isProfessor` or `isStudent` checks the user's role to allow or deny access.

---

### Next Steps:

Would you like me to generate a **visual sequence diagram** for better clarity? If so, I’ll create a step-by-step graphical flow for the process!
