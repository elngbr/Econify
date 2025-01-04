![image](https://github.com/user-attachments/assets/70f7798b-784b-4499-b9b6-b0ce6f9e5c2e)



1. **Users and Teams**:
   - Many-to-Many: A user (student) can belong to multiple teams via the `UserTeams` table.
   - Professors are not part of teams but manage projects.

2. **Projects and Teams**:
   - One-to-Many: A project can have multiple teams.
   - A team belongs to one project.

3. **Teams and Deliverables**:
   - One-to-Many: A team can submit multiple deliverables.
   - Each deliverable is tied to one team.

4. **Deliverables and Jury Members**:
   - Many-to-Many: Jury members (students) are assigned to evaluate deliverables via the `DeliverableJury` table.

5. **Deliverables and Grades**:
   - One-to-Many: Each deliverable can have multiple grades, one from each assigned jury member.

6. **Users and Grades**:
   - One-to-Many: Jury members (students) give grades to deliverables.

7. **Users and Projects**:
   - One-to-Many: Professors create multiple projects.

### Why ORM (Sequelize)
Sequelize ORM simplifies managing complex relationships like Many-to-Many (`UserTeams` and `DeliverableJury`) and One-to-Many (`Projects` to `Teams`, `Teams` to `Deliverables`). It abstracts SQL queries into models and associations, reducing development time and minimizing errors in managing foreign keys, constraints, and joins. This makes the codebase more maintainable and readable.
### Linking Models and Routes in the Application

In our application, the **`db/models/index.js`** file serves as the central hub for managing Sequelize models and their relationships. This file imports all the models (e.g., `User`, `Team`, `Project`, `Deliverable`) and associates them according to the defined relationships. For example, we associate `User` with `Team` through a `UserTeams` junction table, and `Deliverable` with `User` via a `DeliverableJury` table. The `index.js` file ensures all models are correctly initialized and connected to the database. These relationships allow the application to enforce integrity and navigate between related entities easily, such as finding all members of a team or all deliverables of a project.

The **server.js** file acts as the backbone of the application, where routes are defined and linked to specific features. Each endpoint is prefixed with `/api/` (e.g., `/api/users`, `/api/teams`) to distinguish them as API routes. For instance, `/api/users` handles user-related requests like registration and login, while `/api/teams` deals with team creation, deletion, and management. The application listens on **port 3000**, serving as a **Single Page Application (SPA)** backend. This setup allows client-side code to communicate seamlessly with the API, ensuring a consistent experience across all features.


### Why SQLite Doesn't Use a Password in Your Setup

1. **File-Based Database**: SQLite is a lightweight, local database stored in a file (e.g., `db.sqlite`). It doesn’t require a username or password because access is controlled by **file system permissions**.

2. **No Built-in Passwords**: By default, SQLite doesn’t support passwords. However, tools like **SQLCipher** can add encryption and password protection if needed.

3. **Local Development Simplicity**: Your setup is for local development, where security risks are minimal. Omitting passwords reduces complexity.

4. **Controlled Access**: Only authorized processes or users with file system permissions can access the SQLite file.

---

### Example: Your SQLite Configuration vs. Credential-Based Configuration

**Your Configuration** (No Password):
```javascript
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
});
```

**Credential-Based Configuration** (For Server Databases):
```javascript
const sequelize = new Sequelize("my-db", "app", "welcome123", {
  dialect: "sqlite",
  storage: "db.sqlite",
});
```

### Explanation:
Both examples are functionally the same for SQLite. While the second includes credentials (`"app"`, `"welcome123"`), SQLite ignores these fields unless encryption is added with extensions like **SQLCipher**. In your case, leaving out the unused fields simplifies the configuration. 

For databases like **PostgreSQL** or **MySQL**, these credentials are essential for authentication because they are server-based, unlike SQLite.

However, this approach is suitable primarily for development or local testing environments. In production systems, where databases like PostgreSQL or MySQL are used, strong database passwords and network-level security (e.g., firewalls) are mandatory. Passwords are crucial for protecting databases from unauthorized access when running on shared servers or in the cloud.


