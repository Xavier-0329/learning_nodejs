const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token('body', (req, res) => {return JSON.stringify(req.body)})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () =>{
  const currentId = persons.map(n => n.id)
  let newId = Math.floor(Math.random()*1000000000).toString()
  while(currentId.find(n => n === newId)){
    newId = Math.floor(Math.random()*1000000000).toString()
  } 
  return newId.toString()
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const toDelete = persons.find((person) => person.id === id);
  persons = persons.filter((person) => person.id !== id);

  if (toDelete) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  
  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }else if(persons.find(n => n.name === body.name) || persons.find(n => n.number === body.number)){
    return response.status(400).json({
      error: 'name or number already exist'
    })
  }

  body.id = generateId();
  persons = persons.concat(body);

  response.json(body);
});

app.get("/info", (request, response) => {
  const size = persons.length;
  const date = new Date().toString();

  const info = `Phonebook has info for ${size} people<br>${date}`

  response.send(info)
});

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
