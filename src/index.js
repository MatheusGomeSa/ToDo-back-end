const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const userAlreadyExist = users.find(user => user.username === username);
  if (!userAlreadyExist) {
    return response.status(404).json({ error: "User not found !" })
  }
  request.user = userAlreadyExist
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userExist = users.find(user => user.username === username);
  if (userExist) {
    return response.status(400).json({ error: 'User already exists!' })
  }
  const id = uuidv4()
  const NewUser = {
    id,
    name,
    username,
    todos: []
  }
  users.push(NewUser)
  return response.status(201).json(NewUser)

  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(200).json(user.todos)
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const id = uuidv4();

  const newTodo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todoResponse = user.todos.find(todo => todo.id == id)
  if (!todoResponse) {
    return response.status(404).json({ error: "Not found todo with this id" })
  }
  todoResponse.title = title;
  todoResponse.deadline = deadline;

  return response.status(201).json(todoResponse);

  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoResponse = user.todos.find(todo => todo.id === id)
  if (!todoResponse) {
    return response.status(404).json({ error: "Not found todo with this id" })
  }
  todoResponse.done = true
  return response.status(201).json(todoResponse)
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoResponse = user.todos.find(todo => todo.id === id)
  if (!todoResponse) {
    return response.status(404).json({ error: "Not found todo with this id" })
  }
  user.todos.splice(todoResponse, 1)

  return response.status(204).send()
  // Complete aqui

  // Complete aqui
});

module.exports = app;