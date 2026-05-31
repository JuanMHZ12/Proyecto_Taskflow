import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Subir proyecto a GitHub",
    category: "Deploy",
    priority: "Alta",
    date: "Lunes",
    owner: "Usuario",
    completed: false,
  },
];

const timeline = [
  "Definir estructura del proyecto",
  "Diseñar interfaz principal",
  "Crear componentes React",
  "Guardar tareas en LocalStorage",
  "Subir proyecto a GitHub",
];

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("taskflow-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authMode, setAuthMode] = useState("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("taskflow-tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [priority, setPriority] = useState("Media");
  const [date, setDate] = useState("Lunes");
  const [owner, setOwner] = useState("Usuario");
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("taskflow-user", JSON.stringify(user));
      setOwner(user.name);
    }
  }, [user]);

  function handleAuth(event) {
    event.preventDefault();

    if (authMode === "register") {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) return;

      const newUser = {
        name: authName.trim(),
        email: authEmail.trim(),
      };

      setUser(newUser);
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
      return;
    }

    if (!authEmail.trim() || !authPassword.trim()) return;

    const savedUser = localStorage.getItem("taskflow-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({
        name: "Usuario",
        email: authEmail.trim(),
      });
    }

    setAuthEmail("");
    setAuthPassword("");
  }

  function logout() {
    setUser(null);
  }

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const highPriority = tasks.filter(
    (task) => task.priority === "Alta" && !task.completed
  ).length;

  const progress =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "Todas" ||
        (filter === "Completadas" && task.completed) ||
        (filter === "Pendientes" && !task.completed);

      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.category.toLowerCase().includes(search.toLowerCase()) ||
        task.priority.toLowerCase().includes(search.toLowerCase()) ||
        task.owner.toLowerCase().includes(search.toLowerCase()) ||
        task.date.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, search]);

  function addTask(event) {
    event.preventDefault();

    if (title.trim() === "") return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      category,
      priority,
      date,
      owner,
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setTitle("");
    setCategory("Frontend");
    setPriority("Media");
    setDate("Lunes");
    setOwner(user ? user.name : "Usuario");
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks(tasks.filter((task) => !task.completed));
  }

  if (!user) {
    return (
      <main className={`auth-screen ${darkMode ? "dark" : ""}`}>
        <section className="auth-card">
          <p className="tag">TaskFlow</p>
          <h1>{authMode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          <p>
            Accede a tu gestor de tareas para organizar proyectos, prioridades y
            actividades de desarrollo.
          </p>

          <form className="auth-form" onSubmit={handleAuth}>
            {authMode === "register" && (
              <label>
                Nombre
                <input
                  type="text"
                  placeholder="Ejemplo: Juan José"
                  value={authName}
                  onChange={(event) => setAuthName(event.target.value)}
                />
              </label>
            )}

            <label>
              Correo
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={authEmail}
                onChange={(event) => setAuthEmail(event.target.value)}
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={authPassword}
                onChange={(event) => setAuthPassword(event.target.value)}
              />
            </label>

            <button type="submit">
              {authMode === "login" ? "Entrar" : "Registrarme"}
            </button>
          </form>

          <button
            className="switch-auth"
            type="button"
            onClick={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          >
            {authMode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={`app ${darkMode ? "dark" : ""}`}>
      <section className="hero">
        <div>
          <p className="tag">Frontend Developer Jr.</p>
          <h1>TaskFlow</h1>
          <p>
            Hola, {user.name}. Esta aplicación te permite organizar tareas,
            visualizar avances y administrar actividades de desarrollo frontend.
          </p>

          <div className="hero-info">
            <span>React</span>
            <span>LocalStorage</span>
            <span>Dashboard UI</span>
            <span>Responsive</span>
          </div>
        </div>

        <div className="progress-card">
          <span>Progreso general</span>
          <strong>{progress}%</strong>

          <div className="progress-bar">
            <div style={{ width: `${progress}%` }}></div>
          </div>

          <div className="user-mini-card">
            <span>{user.name.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </section>

      <section className="stats">
        <article>
          <span>Total</span>
          <strong>{tasks.length}</strong>
        </article>

        <article>
          <span>Pendientes</span>
          <strong>{pendingTasks}</strong>
        </article>

        <article>
          <span>Completadas</span>
          <strong>{completedTasks}</strong>
        </article>

        <article>
          <span>Prioridad alta</span>
          <strong>{highPriority}</strong>
        </article>
      </section>

      <section className="project-status">
        <article>
          <span>Estado del proyecto</span>
          <strong>{progress === 100 ? "Finalizado" : "En progreso"}</strong>
        </article>

        <article>
          <span>Próxima entrega</span>
          <strong>Viernes</strong>
        </article>

        <article>
          <span>Responsable principal</span>
          <strong>{user.name}</strong>
        </article>

        <button type="button" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Modo claro" : "Modo oscuro"}
        </button>
      </section>

      <section className="planning-grid">
        <article className="calendar-card">
          <div className="section-heading">
            <h2>Calendario semanal</h2>
            <p>Distribución visual de tareas por día.</p>
          </div>

          <div className="calendar">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day) => {
              const dayTasks = tasks.filter((task) => task.date === day);

              return (
                <div className="day-card" key={day}>
                  <h3>{day}</h3>
                  <span>{dayTasks.length} tareas</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="timeline-card">
          <div className="section-heading">
            <h2>Línea de tiempo</h2>
            <p>Etapas principales del proyecto.</p>
          </div>

          <div className="timeline">
            {timeline.map((item, index) => (
              <div className="timeline-item" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="content">
        <form className="task-form" onSubmit={addTask}>
          <h2>Nueva tarea</h2>
          <p className="form-text">
            Agrega actividades para organizar tu flujo de trabajo.
          </p>

          <label>
            Título
            <input
              type="text"
              placeholder="Ejemplo: Crear navbar responsive"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            Categoría
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Frontend</option>
              <option>React</option>
              <option>Diseño</option>
              <option>Deploy</option>
              <option>GitHub</option>
            </select>
          </label>

          <label>
            Prioridad
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>

          <label>
            Día
            <select value={date} onChange={(event) => setDate(event.target.value)}>
              <option>Lunes</option>
              <option>Martes</option>
              <option>Miércoles</option>
              <option>Jueves</option>
              <option>Viernes</option>
            </select>
          </label>

          <label>
            Responsable
            <select
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
            >
              <option>{user.name}</option>
              <option>Frontend</option>
              <option>Diseño</option>
              <option>Deploy</option>
            </select>
          </label>

          <button type="submit">Agregar tarea</button>
        </form>

        <section className="task-panel">
          <div className="panel-header">
            <div>
              <h2>Mis tareas</h2>
              <p>Organiza, filtra y actualiza tus actividades del proyecto.</p>
            </div>

            <div className="panel-controls">
              <input
                type="text"
                placeholder="Buscar tarea..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option>Todas</option>
                <option>Pendientes</option>
                <option>Completadas</option>
              </select>

              <button type="button" onClick={clearCompleted}>
                Limpiar completadas
              </button>
            </div>
          </div>

          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <p className="empty">No hay tareas para mostrar.</p>
            ) : (
              filteredTasks.map((task) => (
                <article
                  className={`task-card ${task.completed ? "completed" : ""}`}
                  key={task.id}
                >
                  <div className="task-info">
                    <h3>{task.title}</h3>

                    <div className="task-meta">
                      <span>{task.category}</span>
                      <span>{task.date}</span>
                      <span>{task.owner}</span>
                      <span className={`priority ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button type="button" onClick={() => toggleTask(task.id)}>
                      {task.completed ? "Reabrir" : "Completar"}
                    </button>

                    <button
                      type="button"
                      className="delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;