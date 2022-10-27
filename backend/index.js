// Express server is setup in this index.js file

// Hum jb backend ko run krte hain to isi file ko run kr dete hain baaki sb kux apne aap run jo jata hai
// backend run krne ke liye hum (nodemon) ka use krte hain

const connectToMongo = require('./db');
const express = require('express')
const cors = require('cors');


connectToMongo();

const app = express()
const port = 5000



app.use(cors())
// request ki body ko access krne ke liye isko use krna pdega (req.body).......................................
app.use(express.json())

// Available Routes....................
app.use('/api/auth/', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// .............Jaisa niche likha hai aise bhi use kr skte hain but manage krne me problem hogi isliye aesa nhi kr rhe......


// app.get('/', (req, res) => {
//   res.send('Namaste Express')
// })

// app.get('/api/auth', (req, res) => {
//   res.send('Namaste Express')
// })

// app.get('/api/notes', (req, res) => {
//   res.send('Namaste Express')
// })

// ............................................................

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})

