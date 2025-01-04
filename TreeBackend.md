Here's the structure of your **Backend** directory tree:

```bash
Econify/
└── Backend/
    ├── db/
    │   ├── models/
    │   │   ├── Deliverable.js
    │   │   ├── DeliverableJury.js
    │   │   ├── Grade.js
    │   │   ├── index.js
    │   │   ├── Project.js
    │   │   ├── Team.js
    │   │   └── User.js
    │   └── database.sqlite # SQLite database file
    ├── middlewares/
    │   └── authMiddleware.js
    ├── controllers/
    │   ├── deliverableController.js
    │   ├── gradeController.js
    │   ├── professorController.js
    │   ├── projectController.js
    │   ├── studentController.js
    │   ├── teamController.js
    │   └── userController.js
    ├── routes/
    │   ├── deliverableRoutes.js
    │   ├── gradeRoutes.js
    │   ├── projectRoutes.js
    │   ├── teamRoutes.js
    │   └── userRoutes.js
    ├── .env # Environment variables file (e.g., JWT secret)
    ├── package.json # Node.js dependencies and scripts
    ├── package-lock.json # Lockfile for dependencies
    ├── server.js # Main entry point for the backend
    └── README.md # Documentation (optional)
```

### Explanation of Each Directory

1. **`db/`**:
   - **`models/`**:
     - Contains Sequelize model definitions for `User`, `Project`, `Team`, `Deliverable`, `Grade`, and other entities.
     - Relationships between models are defined here.
   - **`database.sqlite`**:
     - The SQLite database file storing your application data.

2. **`middlewares/`**:
   - Contains middleware functions like `authMiddleware.js` for authentication and role-based access control.

3. **`controllers/`**:
   - Houses business logic for handling requests and interacting with the database.
   - Each controller corresponds to a specific feature/module:
     - `deliverableController.js`: Handles deliverables.
     - `teamController.js`: Handles teams.
     - `userController.js`: Handles authentication and user management.

4. **`routes/`**:
   - Defines API routes for each feature, connecting endpoints to the corresponding controller functions.

5. **`.env`**:
   - Contains sensitive information like the JWT secret and database configuration.

6. **`server.js`**:
   - The main entry point that starts the backend server and connects the database.

7. **`package.json`**:
   - Lists project dependencies (`express`, `sequelize`, `jsonwebtoken`, etc.) and scripts.

8. **`README.md`** (optional):
   - Provides documentation for setting up and running the backend.

---

Would you like a **visual tree representation** or a **diagram** for this structure? Let me know!