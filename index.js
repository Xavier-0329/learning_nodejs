const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const errorHandler = require('./middleware/errorHandler')


app.use(express.json());

app.use(cors());

app.use(express.static('dist'))

const Note = require('./models/note');
const note = require("./models/note");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/notes", (request, response) => {
  Note.find({}).then(result => {
    response.json(result)
  })
});

app.get("/api/notes/:id", (request, response, next) => {
  const id = request.params.id
  Note.findById(id).then(result => {
  if(result) { 
    response.json(result)
  }else{
    response.status(404).send({error: 'note not found'})  
  }
  })
  .catch(error => next(error))
});

app.delete("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  Note.findByIdAndDelete(id).then((result) => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).send({ error: "note not found" })
    }
  })
  .catch(error => next(error))
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
});

app.put('/api/notes/:id', (request, response, next) => {
  const {content, important} = request.body
  Note.findById(request.params.id).then(result => {
    if(result){
      result.content = content
      result.important = important

      return result.save().then(updatedNote => {
        response.json(updatedNote)
      })
    }else{
      response.status(404).send({error: 'note not found'})
    }
  })
  .catch(error => next(error))
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(unknownEndpoint)
app.use(errorHandler)