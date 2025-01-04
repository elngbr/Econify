### Professor Dashboard: Comprehensive Explanation with Embedded Components and Endpoints

The **Professor Dashboard** is a central hub for professors to manage projects, teams, and deliverables. It provides functionality to **create**, **edit**, **view teams**, **manage deliverables**, and **remove members**. Some operations rely on **embedded functionality**, meaning the logic is implemented directly within components instead of using separate reusable JSX files.

---

### **Hierarchy of the Professor Dashboard**

1. **Parent Component**:
   - **ProfessorDashboard**: The main container that displays all projects and provides options for creating and managing them.

2. **Child Components**:
   - **CreateProject**: A form for creating new projects.
   - **EditProject**: A form for editing project details.
   - **ViewTeams**: Displays teams for a specific project with options to manage deliverables and members.
     - Embedded: **Delete Team**
     - Embedded: **Remove Team Member**
   - **ProfessorViewDeliverables**: Displays deliverables for a team with grading and jury assignment options.
     - Embedded: **Assign Jury**

---

### **ProfessorDashboard**: Parent Component

#### **Purpose**:
Displays a list of projects created by the professor and provides buttons to:
- **Create a new project**: Navigates to the `CreateProject` form.
- **Edit a project**: Navigates to the `EditProject` form.
- **View teams**: Navigates to the `ViewTeams` component for a specific project.

#### **Key Features**:
- Fetches projects using the **`GET /users/professor-dashboard`** endpoint.
- Uses **`navigate`** to switch to `CreateProject`, `EditProject`, or `ViewTeams`.

#### **Code**:
```jsx
const ProfessorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/users/professor-dashboard");
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Professor Dashboard</h1>
      <button
        style={styles.createButton}
        onClick={() => navigate("/create-project")}
      >
        Create Project
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.projectList}>
          {projects.map((project) => (
            <div key={project.projectId}>
              <h3>{project.projectTitle}</h3>
              <p>{project.projectDescription}</p>
              <button onClick={() => navigate(`/projects/${project.projectId}/edit`)}>
                Edit
              </button>
              <button onClick={() => navigate(`/projects/${project.projectId}/teams`)}>
                View Teams
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### **CreateProject**: Embedded Component for Project Creation

#### **Purpose**:
Allows professors to create a new project.

#### **Endpoint**:
- **`POST /projects/create`**

#### **Key Features**:
- Sends `title` and `description` to the backend.
- On success, navigates back to the `ProfessorDashboard`.

#### **Code**:
```jsx
const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects/create", { title, description });
      alert("Project created successfully!");
      navigate("/professor-dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Project Description"
      />
      <button type="submit">Create</button>
    </form>
  );
};
```

---

### **EditProject**: Embedded Component for Project Editing

#### **Purpose**:
Allows professors to edit the details of an existing project.

#### **Endpoint**:
- **`GET /projects/:id`** (fetch project details)
- **`PUT /projects/:id`** (update project details)

#### **Key Features**:
- Fetches project data using its ID.
- Allows editing `title` and `description`.

#### **Code**:
```jsx
const EditProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState({ title: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data.project);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}`, project);
      alert("Project updated successfully!");
      navigate("/professor-dashboard");
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={project.title}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
        placeholder="Project Title"
      />
      <textarea
        value={project.description}
        onChange={(e) =>
          setProject({ ...project, description: e.target.value })
        }
        placeholder="Project Description"
      />
      <button type="submit">Save Changes</button>
    </form>
  );
};
```

---

### **ViewTeams**: Embedded Team Management Component

#### **Purpose**:
Displays teams in a project and allows:
- **Viewing team deliverables**.
- **Deleting teams**.
- **Removing team members**.

#### **Endpoints**:
- **`GET /teams/project/:projectId`** (fetch teams)
- **`DELETE /teams/:teamId`** (delete team)
- **`POST /teams/remove-user`** (remove a team member)

#### **Embedded Features**:
- **Delete Team**: Deletes a team by team ID.
- **Remove Member**: Removes a member by user ID.

#### **Code**:
```jsx
const ViewTeams = ({ userRole }) => {
  const { projectId } = useParams();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        setTeams(response.data.teams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, [projectId]);

  return (
    <div>
      {teams.map((team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          {userRole === "professor" && (
            <button onClick={() => api.delete(`/teams/${team.id}`)}>
              Delete Team
            </button>
          )}
          <ViewMembers teamId={team.id} />
        </div>
      ))}
    </div>
  );
};
```

---

### **ProfessorViewDeliverables**: Deliverables Management Component

#### **Purpose**:
Displays all deliverables submitted by teams with options to:
- **Assign jurors**.
- **View grades**.

#### **Endpoints**:
- **`GET /deliverables/team/:teamId`** (fetch deliverables)
- **`POST /deliverables/assign-jury`** (assign jury)

#### **Embedded Features**:
- **Assign Jury**: Prompts the professor for jury size and sends the request to the backend.

#### **Code**:
```jsx
const ProfessorViewDeliverables = () => {
  const { teamId } = useParams();
  const [deliverables, setDeliverables] = useState([]);

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const response = await api.get(`/deliverables/team/${teamId}`);
        setDeliverables(response.data.deliverables);
      } catch (error) {
        console.error("Error fetching deliverables:", error);
      }
    };
    fetchDeliverables();
  }, [teamId]);

  const assignJury = async (deliverableId) => {
    const jurySize = prompt("Enter the number of jurors to assign:");
    try {
      await api.post("/deliverables/assign-jury", { deliverableId, jurySize });
      alert("Jury assigned successfully!");
    } catch (error) {
      console.error("Error assigning jury:", error);
    }
  };

  return (
    <div>
      {deliverables.map((deliverable) => (
        <div key={deliverable.id}>
          <h3>{deliverable.title}</h3>
          <button onClick={() => assignJury

(deliverable.id)}>Assign Jury</button>
        </div>
      ))}
    </div>
  );
};
```

---

### **Summary**

The **Professor Dashboard** integrates multiple components, each performing specific operations. It uses embedded logic for tasks like **deleting teams**, **removing members**, and **assigning jurors** to keep the components modular yet functional. The dashboard communicates with various backend endpoints to fetch and manipulate data, ensuring a seamless experience for professors managing academic projects.