const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();


app.use(express.json());

app.use(cors());

app.use(express.static('dist'))

const Note = require('./models/note')
// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true,
//   },
//   {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false,
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true,
//   },
// ];

// const generateId = () =>{
//   const maxId = notes.length > 0? Math.max(...notes.map(n => n.id)) : 0
//   return (maxId + 1).toString()
// }

app.get("/api/notes", (request, response) => {
  Note.find({}).then(result => {
    response.json(result)
  })
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const toDelete = notes.find((note) => note.id === id);
  notes = notes.filter((note) => note.id !== id);

  if (toDelete) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  
  if(!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note);

  response.json(note);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});