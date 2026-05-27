import express from 'express';
import cors from 'cors';
import {Bot} from '../types';

export const createServer = (client : Bot) => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (_, res) => {
        res.send(`L'API fonctionne. `);
    });

    app.post('callback/discord', (req, res) => {
        const { code, state } = req.body;
        res.json({ success: true, message: "Code reçu" });
    });

    return app;
};