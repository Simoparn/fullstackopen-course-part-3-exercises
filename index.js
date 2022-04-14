//const http = require('http')

const express = require('express')
var morgan = require('morgan')
//cross-origin policy middleware for database and app interaction
const cors = require('cors')

const app = express()
//Show static content (index.html)
app.use(express.static('build'))
//Database address environment variable
require('dotenv').config()
//Database connection module
const Person = require('./models/person')


app.use(express.json())

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










app.get('/', (req, res) => {
    res.send('<h1>This is the backend for Full Stack Open 2022 phonebook exercise.</h1><br/><h2>More api info:    api/info</h2>')
})
      
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
    
      
   Person.findById(req.params.id).then(person => {
    if (person) {    
        res.json(person)  
    } else {    
        res.status(404).end()  
    }
    
  })
    .catch(error => next(error))    
})



app.get('/api/info', (req, res) => {
    date=new Date()
    //console.log(date)
    Person.find({}).then(persons => {
      res.send('<h2>Phonebook has info for '+ persons.length +' people </h2> <br/><h2>API endpoints:</h2></br><h3>All persons:    /api/persons</h3><br/><h3>'+ date+'</h3>')
    })
})




app.post('/api/persons', (request, response) => 
{  
    const body = request.body
    console.log("Attempted to add a new person: ", request.body)
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
    
      

     else {
       console.log("Neither of the fields is empty, adding or updating a person is allowed.\n")
        const person = new Person({
        name: body.name,
        phonenumber: body.phonenumber
        })
      
          person.save().then(savedNote => {
          response.json(savedNote)
          })
    
    
      
    
      }
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log("Id of the person to update:"+request.params.id)
  const person = {
    name: body.name,
    phonenumber: body.phonenumber
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

  app.delete('/api/persons/:id', (request, response) => {
    

    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
        .catch(error => next(error))
  })    


//Error logging middleware defined here or the endpoints will never execute before error messages

//Missing error handler warning middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: '404, unknown endpoint, see api/info for instructions' })
}
//Handle nonexistent ids
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id, no such person in database' })
  }

  next(error)
}
// Handle badly formatted ids
app.use(errorHandler)





const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})




