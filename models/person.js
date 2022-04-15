
const mongoose = require('mongoose')

//HEROKU: set database address separately in dashboard or with heroku config:set from command line
const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {    
	console.log('connected to MongoDB')  
  })  
	.catch((error) => {    
		console.log('error connecting to MongoDB:', error.message)  
	})


const personSchema = new mongoose.Schema({
  //name: String,
  //phonenumber: String
  name: {    
    type: String,    
    minlength: 3,   
     
    required: true  
  },  
  phonenumber: {     
    type: String, 
    minlength: 8, 
    validate: {
     validator: function(v) {
        return /\d{2,3}-\d{1,10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number. The number must be in the following format: (2-3 numbers)-(1-10 numbers)`
    },
    required: true  
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
