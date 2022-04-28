require('dotenv').config();
const http = require('http');


const app = require('./index');

// create the server
const server=http.createServer(app);

// Start and listen on the port defined in .env file
server.listen(process.env.PORT);