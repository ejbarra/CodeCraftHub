// server.js - CAMBIAR A ESTO
const express = require('express');
const cors = require('cors');

const initServer = () => {
    const app = express();
    
    // Middlewares en orden específico
    app.use(cors());
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Middleware de logging
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`, req.body);
        next();
    });
    
    return app;
};

module.exports = initServer;