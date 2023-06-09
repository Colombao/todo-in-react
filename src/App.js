import "./App.css";

import { useEffect, useState } from "react";
import { BsBookmarkCheck, BsBookmarkCheckFill, BsTrash } from "react-icons/bs";
import InputMask from "react-input-mask";

const API = "http://localhost:5000";
function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);

      setTodos(res);
    };
    loadData();
  }, []);
  const handleValidar = () => {
    setError("");
    const [hours, minutes] = time.split(":");
    // Verificar se as horas e minutos estão dentro dos limites permitidos
    const isValidHours = hours >= 0 && hours <= 24;
    const isValidMinutes = minutes >= 0 && minutes <= 59;
    if (isValidMinutes === false && isValidHours === false) {
      setError("Minutos e Horas inválidos");
    } else if (isValidHours === false) {
      setError("Horas inválidas");
    } else if (isValidMinutes === false) {
      setError("Minutos inválidos");
    }
    return isValidHours && isValidMinutes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidar() === false) {
      return false;
    }
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };
    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]);
    setTitle(" ");
    setTime(" ");
  };

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };
  const handleEdit = async (todo) => {
    todo.done = !todo.done;
    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };
  return (
    <div className="App">
      <div className="todo-header">
        <h1>React Todo</h1>
      </div>
      <div className="form-todo">
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que vc vai fazer?</label>
            <InputMask
              type="text"
              name="title"
              placeholder="Titulo da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <InputMask
              placeholder="Numero de horas"
              mask="99:99"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
              }}
              onKeyUp={handleValidar}
            ></InputMask>
            {error && <span>{error}</span>}
          </div>
          <input type="submit" value="Enviar" />
        </form>
      </div>
      <div className="list-todo">
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não existem tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração {todo.time}</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
