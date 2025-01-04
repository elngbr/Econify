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
