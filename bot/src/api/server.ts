import express from 'express';
import path from 'path';
import {Bot} from '../types';
import cookiesParser from 'cookie-parser';
import { consumeToken } from '../store/verifyToken';
import {verifySessions} from '../store/verifySession';

export const createServer = (client : Bot) => {
    const app = express();
    app.use(express.json());
    app.use(cookiesParser());

    app.post('/api/callback/discord', async (req, res) => {
        const { code } = req.body;
        console.log('Received Discord callback with code:', code);

        try {
            const params = new URLSearchParams();
            params.append('client_id', client.config.discord.clientId);
            params.append('client_secret', client.config.discord.clientSecret);
            params.append('grant_type', 'authorization_code');
            params.append('code', code);
            params.append('redirect_uri', client.config.api.redirectUriDiscord);

            const response = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error fetching Discord token:', data);
                res.status(400).json({ success: false, message: 'Failed to fetch Discord token' });
                return;
            }


            console.log('Discord token:', data.access_token);
            // res.json({ success: true, message: 'Discord token fetched successfully' });


             const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `Bearer ${data.access_token}`
                }
            });

            const userData = await userResponse.json();

            console.log("ID Discord de l'utilisateur :", userData.id);
            console.log("Pseudo de l'utilisateur :", userData.username);

            res.cookie('discord_token', data.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 1000 * 60 * 60 * 24 
            });


           
            res.json({ 
                success: true, 
                message: "Authentification réussie",
                user: {
                    id: userData.id,
                    username: userData.username,
                    avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                }
            });



        } catch (error) {
            console.error('Error fetching Discord token:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }



        
      });

    app.post("/api/callback/roblox", async (req, res) => {
        console.log("Received Roblox callback");
        const { code, state: token } = req.body;
        

        const discordUserId = consumeToken(token);

        if (!discordUserId) {
            return res.status(401).json({ success: false, message: '❌ Invalid or expired token - Run /verify again in Discord.' });
        }

        try {
            const tokenRes = await fetch("https://apis.roblox.com/oauth/v1/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id:     client.config.api.robloxAPIID,
                client_secret: client.config.api.robloxAPISecret,
                grant_type:    "authorization_code",
                code,
                redirect_uri:  client.config.api.redirectUriRoblox,
            }),
            });

            const { access_token } = await tokenRes.json();

            const userRes = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
            });

            const robloxUser = await userRes.json();
            console.log(robloxUser);


            const session = verifySessions.get(discordUserId);
            if (session) {
                session.robloxId       = Number(robloxUser.sub);
                session.robloxVerified = true;
            }

            res.status(200).json( {
                success: true,
                message: `✅ Roblox API verified ! Welcome ${robloxUser.name} !`,
            })
            
            

        } catch (err) {
            res.status(500).json( { success: false, message: "❌ Server error , please try again." });
        }
        });


    app.post('/api/authorize/discord', (req, res) => {
        console.log("Received request for Discord authorization URL");
        const authorizeUrl = client.config.api.authorizeUrl;
        res.json({ url: authorizeUrl });
    });

    app.get('/api/me', async (req, res) => {
        const token = req.cookies.discord_token;

        if (!token) {
            return res.status(401).json({ user: null });
        }

        try {
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: { authorization: `Bearer ${token}` }
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                res.json({ user: { id: userData.id, username: userData.username } });
            } else {
                res.clearCookie('discord_token'); 
                res.status(401).json({ user: null });
            }
        } catch (error) {
            res.status(500).json({ user: null });
        }
    });

    
    app.get("/api/auth/roblox", (req, res) => {
        console.log("Received request for Roblox authorization URL");
        const token = req.query.token as string;
        if (!token) return res.status(400).send("Missing userId");

        const params = new URLSearchParams({
            client_id:     client.config.api.robloxAPIID,
            redirect_uri:  client.config.api.redirectUriRoblox,
            response_type: "code",
            scope:         "openid profile",
            state:         token,
        });

        res.redirect(`https://apis.roblox.com/oauth/v1/authorize?${params}`);
        });


    const frontendPath = path.join(__dirname, '../../../frontend/dist');
    app.use(express.static(frontendPath));


    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });


    return app;
};