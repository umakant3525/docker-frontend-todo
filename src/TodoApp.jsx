import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000/api/tasks'; // Update with your backend URL

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Create a new task
  const createTask = async () => {
    if (newTask.trim() === '') return;

    try {
      const response = await axios.post(API_URL, { title: newTask });
      setTasks([...tasks, response.data]);
      setNewTask(''); // Clear input field
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Update a task
  const updateTask = async () => {
    if (editingTaskTitle.trim() === '') return;

    try {
      const response = await axios.put(`${API_URL}/${editingTaskId}`, { title: editingTaskTitle });
      setTasks(tasks.map(task => (task._id === editingTaskId ? response.data : task)));
      setEditingTaskId(null); // Clear editing state
      setEditingTaskTitle(''); // Clear input field
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

      <div className="task-creator">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={createTask}>Add Task</button>
      </div>

      {editingTaskId && (
        <div className="task-editor">
          <input
            type="text"
            value={editingTaskTitle}
            onChange={(e) => setEditingTaskTitle(e.target.value)}
            placeholder="Update task"
          />
          <button onClick={updateTask}>Update Task</button>
          <button onClick={() => setEditingTaskId(null)}>Cancel</button>
        </div>
      )}

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <span>{task.title}</span>
            <button onClick={() => {
              setEditingTaskId(task._id);
              setEditingTaskTitle(task.title);
            }} className="edit-button">Edit</button>
            <button onClick={() => deleteTask(task._id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
