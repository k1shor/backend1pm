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


// routes
const categoryRoute = require('./routes/categoryRoute')


// adding to the pipeline
app.use(categoryRoute)

// starting server
app.listen(port,()=>{
    console.log("App started successfully at port " + port)
})