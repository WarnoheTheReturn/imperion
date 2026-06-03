import express from 'express';
import path from 'path';
import {Bot} from '../types';

export const createServer = (client : Bot) => {
    const app = express();
    app.use(express.json());
    app.post('callback/discord', (req, res) => {
        const { code, state } = req.body;
        res.json({ success: true, message: "Code reçu" });
    });

    const frontendPath = path.join(__dirname, '../../../frontend/dist');

    app.use(express.static(frontendPath));

    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
        

    return app;
};