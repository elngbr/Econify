### Student Dashboard: Component Hierarchy and Explanation with Code Integration

The **Student Dashboard** is the centerpiece for students, enabling interactions with projects, teams, and deliverables. It is composed of multiple components structured hierarchically, each performing a specific function. Below is a comprehensive explanation of the hierarchy, roles, and integration of the components with **code snippets**.

---

### **Hierarchy**

#### 1. **Parent Component**
   - **StudentDashboard**: Orchestrates the entire functionality and manages state, API calls, and interactions.

#### 2. **Child Components**
   - **Team Management**
     - `CreateTeam`: For creating a new team within a project.
     - `JoinTeam`: To join an existing team in a project.
     - `LeaveTeam`: For leaving an assigned team.
   - **Deliverable Management**
     - `SendDeliverable`: Redirects to the form for submitting deliverables.
     - `SeeDeliverablesToGrade`: Displays deliverables assigned for grading.
     - `DeliverableForm`: A form for creating and submitting deliverables.
     - `EditDeliverable`: For editing and deleting deliverables.

---

### **StudentDashboard**: The Parent Component

**Role**: 
The `StudentDashboard` fetches and displays a list of projects. It checks if the student belongs to a team for each project and provides options to create, join, or leave teams, as well as manage deliverables.

**Key Features**:
- Fetches project and team data using `/users/student-dashboard`.
- Opens modals for team creation (`CreateTeam`) or joining (`JoinTeam`).
- Redirects to deliverable-related actions (`SendDeliverable`, `SeeDeliverablesToGrade`).

```jsx
const StudentDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/users/student-dashboard");
      const projects = response.data.projects || [];
      setProjects(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project.projectId}>
              <h3>{project.projectTitle}</h3>
              <button onClick={() => setIsCreateTeamOpen(true)}>Create Team</button>
              <button onClick={() => setIsJoinTeamOpen(true)}>Join Team</button>
              <button onClick={() => console.log("Leave Team")}>Leave Team</button>
            </div>
          ))}
        </div>
      )}

      {isCreateTeamOpen && <CreateTeam projectId={selectedProject} onClose={() => setIsCreateTeamOpen(false)} />}
      {isJoinTeamOpen && <JoinTeam projectId={selectedProject} onClose={() => setIsJoinTeamOpen(false)} />}
    </div>
  );
};
```

---

### **Child Components**

#### **1. CreateTeam**
**Purpose**:
Handles creating a new team for the selected project.

**Key Features**:
- Takes the project ID as a prop.
- Submits the team name to `/teams/create` and updates the dashboard.

**Code**:
```jsx
const CreateTeam = ({ projectId, onClose }) => {
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/teams/create", { name: teamName, projectId });
      alert("Team created successfully!");
      onClose(); // Close modal after success
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div>
      <h2>Create Team</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
        />
        <button type="submit">Create</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};
```

---

#### **2. JoinTeam**
**Purpose**:
Lets students join an existing team.

**Key Features**:
- Fetches available teams for the project from `/teams/project/:projectId`.
- Allows students to select and join a team using `/teams/join`.

**Code**:
```jsx
const JoinTeam = ({ projectId, onClose }) => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get(`/teams/project/${projectId}`);
        setTeams(response.data.teams || []);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [projectId]);

  const handleJoin = async (teamId) => {
    try {
      await api.post("/teams/join", { teamId });
      alert("Joined team successfully!");
      onClose();
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  return (
    <div>
      <h2>Join a Team</h2>
      {teams.map((team) => (
        <div key={team.id}>
          <p>{team.name}</p>
          <button onClick={() => handleJoin(team.id)}>Join</button>
        </div>
      ))}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
```

---

#### **3. LeaveTeam**
**Purpose**:
Allows students to leave their current team.

**Key Features**:
- Submits a request to `/teams/leave` with the project and team IDs.

**Code**:
```jsx
const LeaveTeam = ({ projectId, teamId, refreshDashboard }) => {
  const handleLeave = async () => {
    try {
      await api.post("/teams/leave", { projectId, teamId });
      alert("Left team successfully!");
      refreshDashboard();
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  return <button onClick={handleLeave}>Leave Team</button>;
};
```

---

#### **4. SendDeliverable**
**Purpose**:
Redirects to the form for submitting a deliverable.

**Code**:
```jsx
const SendDeliverable = ({ projectId, teamId }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate(`/deliverables/submit/${projectId}`, {
          state: { teamId, projectId },
        })
      }
    >
      Submit Deliverable
    </button>
  );
};
```

---

#### **5. DeliverableForm**
**Purpose**:
Handles the submission of new deliverables.

**Code**:
```jsx
const DeliverableForm = ({ teamId, projectId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async () => {
    try {
      await api.post("/deliverables/create", { title, description, teamId, projectId });
      alert("Deliverable submitted successfully!");
    } catch (error) {
      console.error("Error submitting deliverable:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

#### **6. SeeDeliverablesToGrade**
**Purpose**:
Displays deliverables assigned to the student for grading.

**Code**:
```jsx
const SeeDeliverablesToGrade = () => {
  const [deliverables, setDeliverables] = useState([]);

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const response = await api.get("/deliverables/assigned");
        setDeliverables(response.data.deliverables || []);
      } catch (error) {
        console.error("Error fetching deliverables:", error);
      }
    };

    fetchDeliverables();
  }, []);

  return (
    <div>
      {deliverables.map((deliverable) => (
        <div key={deliverable.id}>
          <p>{deliverable.title}</p>
          <button onClick={() => console.log("Grade Deliverable")}>Grade</button>
        </div>
      ))}
    </div>
  );
};
```

---

### **Summary**

The **Student Dashboard** consists of modular components that manage team creation, joining, leaving, and deliverable submission. Each component is integrated into the dashboard via props and API requests, ensuring a dynamic and interactive user experience.