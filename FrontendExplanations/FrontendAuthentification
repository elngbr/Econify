## README: Authentication in the Frontend

This guide explains how **authentication** is implemented on the frontend of the Econify app. We will walk through the **context**, **components**, and **services** used for handling authentication.

---

### **Authentication Overview**
The frontend authentication system:
1. Uses **JWT tokens** to authenticate users.
2. Leverages **Context API** for global state management of user information.
3. Automatically attaches the token to API requests using Axios interceptors.
4. Ensures **protected routes** are only accessible to authorized users via the `PrivateRoute` component.

---

### **Components and Their Roles**

#### 1. **AuthContext**
File: `src/context/AuthContext.jsx`

- **Purpose**: 
  - Manages authentication state across the app (e.g., logged-in user details, login/logout functionality).
  - Provides this state globally to other components.

- **Key Functions**:
  - `login`: Saves user information and JWT token in `localStorage` and updates the context state.
  - `logout`: Clears user information from `localStorage` and the context.

- **How It Works**:
  ```jsx
  // Check if a user is stored in localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser); // Set user if found
    setLoading(false); // Stop loading once done
  }, []);

  // Login function to store user data in the context and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token); // Save the JWT token
  };

  // Logout function to clear user data
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  ```

---

#### 2. **Login Component**
File: `src/auth/Login.jsx`

- **Purpose**: Allows users to log in and retrieve a JWT token.
- **Flow**:
  1. Takes the user's email and password as input.
  2. Sends these credentials to the backend via an API call (`POST /users/login`).
  3. If the login is successful, it calls the `login` function from `AuthContext` to save the user details and token.
  4. Redirects the user to their respective dashboard (`/professor-dashboard` or `/student-dashboard`).

- **Key Code**:
  ```jsx
  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await api.post("/users/login", { email, password });
    login(response.data); // Save user and token in context
    navigate(
      response.data.role === "professor"
        ? "/professor-dashboard"
        : "/student-dashboard"
    ); // Redirect based on role
  };
  ```

---

#### 3. **Register Component**
File: `src/auth/Register.jsx`

- **Purpose**: Allows users to create a new account.
- **Flow**:
  1. Takes user details (name, email, password, role) as input.
  2. Sends these details to the backend (`POST /users/register`).
  3. If registration is successful, redirects the user to the login page.

- **Key Code**:
  ```jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/users/register", formData); // Send registration data
    navigate("/login"); // Redirect to login page
  };
  ```

---

#### 4. **PrivateRoute Component**
File: `src/auth/PrivateRoute.jsx`

- **Purpose**: Protects routes so only authenticated users can access them.
- **Flow**:
  1. Checks if the user is logged in using `AuthContext`.
  2. Redirects unauthenticated users to the login page.
  3. Optionally checks the user's role for role-based access control (RBAC).

- **Key Code**:
  ```jsx
  if (!user) return <Navigate to="/login" />; // Redirect to login if not authenticated
  if (role && user.role !== role) return <Navigate to="/" />; // Redirect if role mismatch
  return children; // Allow access if authorized
  ```

---

### **API Service**
File: `src/services/api.js`

- **Purpose**: Simplifies API calls by setting up a base URL and automatically attaching the JWT token to every request.

- **How It Works**:
  1. **Base URL**: Configures Axios to use `http://localhost:3000/api` for all requests.
  2. **Token Interceptor**:
     - Fetches the token from `localStorage`.
     - Attaches it as a `Bearer` token in the `Authorization` header for every request.

- **Key Code**:
  ```javascript
  const api = axios.create({ baseURL: "http://localhost:3000/api" });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  export default api;
  ```

---

### **Frontend Authentication Flow**
1. **Register**:
   - Users register through the `Register` component.
   - API: `POST /users/register`.
   - Redirects to the login page upon success.

2. **Login**:
   - Users log in through the `Login` component.
   - API: `POST /users/login`.
   - Saves the user and token in `localStorage` and context upon success.

3. **Access Protected Routes**:
   - Routes wrapped with `PrivateRoute` check if the user is authenticated.
   - Users without a valid token are redirected to `/login`.

4. **Role-Based Access**:
   - `PrivateRoute` can restrict access based on roles.
   - Example: Professors can access `/professor-dashboard`, but students cannot.

---

### **Frontend Testing Tip**
To test the authentication flow with the backend:
1. Clone the repo and navigate to the `Econify` project directory.
2. Start the backend:
   ```bash
   cd Econify/Backend
   nodemon server.js
   ```
3. Start the frontend:
   ```bash
   cd Econify/Frontend/my-app
   npm run dev
   ```
4. Open your browser at `http://localhost:5173` to test the app.

---

Would you like a **sample flow diagram** or further examples of how these components interact? Let me know!