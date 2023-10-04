// const http = require("http");
// const os = require('os')

// http.createServer(function (request, response) {
//     // Send the HTTP header 
//     // HTTP Status: 200 : OK
//     // Content Type: text/plain
//     response.writeHead(200, {'Content-Type': 'text/plain'});
    
//     // Send the response body as "Hello World"
//     response.end('Hello World\n');
//  }).listen(8081);
 
//  // Console will print the message
//  console.log('Server running at http://127.0.0.1:8081/');
//  console.log(os.homedir())
//  console.log(os.type())
//  console.log(os.hostname())
 

// importing packages
const express = require('express')
require('dotenv').config()
require('./database/connection')

const morgan = require('morgan')
const cors = require('cors')


// creating server
const app = express()
const port = process.env.PORT || 8000

// function - CRUD 
// endpoint
// .get(path, function)
// app.get('/hello',(request, response)=>{
//     response.send("HELLO THERE !!!")
// })

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// routes
const categoryRoute = require('./routes/categoryRoute')
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const orderRoute = require('./routes/orderRoute')

// adding to the pipeline
app.use('/category',categoryRoute)
app.use('/product',productRoute)
app.use('/user',userRoute)
app.use('/order',orderRoute)

app.use('/public/uploads',express.static('public/uploads'))

// starting server
app.listen(port,()=>{
    console.log("App started successfully at port " + port)
})