//const http = require('http')
const express = require('express')
var morgan = require('morgan')
//cross-origin policy middleware for database and app interaction

const cors = require('cors')
const app = express()

app.use(express.json())
//Show static content (index.html)
app.use(express.static('build'))
//HTTP request logging middleware
//morgan.token('data', req => { 
//  return JSON.stringify(req.body) 
//})
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    'status code:',
    tokens.status(req, res),    
    '- content length:',
    tokens.res(req, res, 'content-length'),
    '- response time:',
    tokens['response-time'](req, res), 'ms',
    '- data:',
    JSON.stringify(req.body)
  ].join(' ')
}))



let persons = [  
    {    
        id: 1,    
        name: "Arto Hellas",    
        phonenumber: "040-123456"
    },  
    {    
        id: 2,    
        name: "Ada Lovelace",    
        phonenumber: "39-44-5323523",    
       
    },  
    {    
        id: 3,    
        name: "Dan Abramov",    
        phonenumber: "12-43-234345",    
        
    },
    {    
      id: 4,    
      name: "Mary Poppendick",    
      phonenumber: "39-23-6423122",    
      
  }
  
  ]
    

//Logging middleware, option for morgan
//  const requestLogger = (request, response, next) => {
//    console.log('Method:', request.method)
//    console.log('Path:  ', request.path)
//    console.log('Body:  ', request.body)
//    console.log('---')
//    next()
//  }
//app.use(requestLogger)




app.get('/', (req, res) => {
    res.send('<h1>This is the backend for Full Stack Open 2022 phonebook exercise.</h1><br/><h2>More api info:    api/info</h2>')
})
      
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => {
    //console.log(person.id, typeof person.id, id, typeof id, person.id === id)
    return person.id === id 
    })
    console.log(person)
    if (person) {    
        response.json(person)  
    } else {    
        response.status(404).end()  
    }
  })


  app.get('/api/info', (req, res) => {
    date=new Date()
    //console.log(date)
    res.send('<h2>Phonebook has info for '+persons.length+' people </h2> <br/><h2>API endpoints:</h2></br><h3>All persons:    /api/persons</h3><br/><h3>'+ date+'</h3>')
    
})

//Create id for new person
const generateId = () => {
    const newid = Math.round(Math.random()*10000000)
    return newid
  
    //const maxId = persons.length > 0
    //  ? Math.max(...persons.map(n => n.id))
    //  : 0
    //return maxId + 1
  }



app.post('/api/persons', (request, response) => 
{  
    const body = request.body
    //console.log(request.body)
    //If no content 
    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
    
    else if (!body.phonenumber) {
        return response.status(400).json({ 
          error: 'phone number missing' 
        })
      }
    else if (persons.find(person => person.name === body.name)){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
    const person = {
        
        //Generate new id automatically here
        id: generateId(),
        name: body.name,
        phonenumber: body.phonenumber
    }

     
    

    persons = persons.concat(person)  
    console.log(person)  
    response.json(person)
})



  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log("Person to delete "+id)
    persons = persons.filter(person => person.id !== id)
    console.log(persons)
    response.status(204).end()
  })    



//Missing error handler warning middleware
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: '404, unknown endpoint, see api/info for instructions' })
  }
  
  app.use(unknownEndpoint)











const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//const app = http.createServer((request, response) => {
//  response.writeHead(200, { 'Content-Type': 'text/plain' })
//  response.end(JSON.stringify(notes))
//})
//
//const PORT = 3001
//app.listen(PORT)
//console.log(`Server running on port ${PORT}`)


