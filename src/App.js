import React, { useState, useEffect } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import awsExports from "./aws-exports";
import "./App.css";

Amplify.configure(awsExports);

const INITIAL_STATE = { name: "", description: "" };

const App = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [todos, setTodos] = useState([]);

  const { name, description } = formData;

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      console.log(todos);
      setTodos(todos);
    } catch (error) {
      console.error(error);
    }
  };

  const addTodo = async () => {
    try {
      if (!(name && description)) {
        return;
      }
      const res = await API.graphql(
        graphqlOperation(createTodo, { input: { ...formData } })
      );
      const newTodo = res.data.createTodo;
      setTodos((prev) => [...prev, newTodo]);
      setFormData(INITIAL_STATE);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={handleChange}
        style={styles.input}
        value={name}
        placeholder="Name"
        name="name"
      />
      <input
        onChange={handleChange}
        style={styles.input}
        value={description}
        placeholder="Description"
        name="description"
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {todos.map((todo) => (
        <div key={todo.id} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

export default App;
