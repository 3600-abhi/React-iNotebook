const connectToMongo = require('./db');
const express = require('express')

connectToMongo();

const app = express()
const port = 5000


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
  console.log(`Example app listening at http://localhost:${port}`)
})
