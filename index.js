// index.js
// Enhanced Node.js app with clustering, Express, and non-blocking I/O

require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;

// Master process: fork worker processes equal to CPU cores
if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
        cluster.fork();
    });
} else {
    // Worker processes: set up the server

    // Middleware: simple request logging
    app.use((req, res, next) => {
        console.log(`Worker ${process.pid} handling request: ${req.method} ${req.url}`);
        next();
    });

    // Root endpoint
    app.get('/', (req, res) => {
        res.send('Welcome to the enhanced Node.js Scalability Demo with Clustering!');
    });

    // Demonstrate non-blocking I/O
    app.get('/data', (req, res) => {
        fs.readFile('data.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.send({ content: data });
        });
    });

    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started server on port ${PORT}`);
    });
}