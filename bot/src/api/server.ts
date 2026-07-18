import express from 'express';
import path from 'path';
import {Bot} from '../types';
import cookiesParser from 'cookie-parser';
import { consumeToken, createToken, getToken } from '../store/verifyToken';
import {verifySessions,createDiscordSession} from '../store/verifySession';
import { discordSessions } from '../store/verifySession';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';




export const createServer = (client : Bot) => {
    const app = express();
    if (process.env.NODE_ENV !== 'dev') {
        app.set('trust proxy', 1);
    }

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, 
        limit: 300,               
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: {
            success: false,
            message: 'To many requests, please try again later.',
        },
    });

    const callbackOauthLimiter = rateLimit({
        windowMs: 10 * 60 * 1000, 
        limit: 10,                
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: {
            success: false,
            message: 'To many requests, please try again later.',
        },
    });

    const startOauthLimiter = rateLimit({
        windowMs: 10 * 60 * 1000, 
        limit: 10,                
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        message: {
            success: false,
            message: 'To many requests, please try again later.',
        },
    });


    app.disable('x-powered-by');
    app.use(helmet({
        crossOriginResourcePolicy: { policy: 'same-origin' },
        referrerPolicy: { policy: 'no-referrer' },
    }));

    app.use(express.json());
    app.use(cookiesParser());
    app.use('/api', apiLimiter);


    const isProduction = process.env.NODE_ENV !== 'dev';

    const cookies = {
        discordState: isProduction
            ? '__Host-imperion_discord_state'
            : 'imperion_discord_state',

        session: isProduction
            ? '__Host-imperion_session'
            : 'imperion_session',
    };



    app.get('/api/callback/discord', callbackOauthLimiter, async (req, res) => {
        const { code, state } = req.query;

        const expectedState = req.cookies[cookies.discordState]

        res.clearCookie(cookies.discordState, {path: '/'})

        if (state !== expectedState || typeof code !== 'string' || typeof state !== 'string' || typeof expectedState !== 'string') {
            return res.status(403).send("❌ State OAuth invalid.")
        }

        const token = consumeToken('discord',state);

        if (!token) {
            return res.status(403).send('❌ State OAuth invalid or expired.');
        }

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

            if (!response.ok || typeof data.access_token !== 'string') {
                console.error('Error fetching Discord token');
                res.status(400).json({ success: false, message: 'Failed to fetch Discord token' });
                return;
            }

            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `Bearer ${data.access_token}`
                }
            });

            if (!userResponse.ok) {
                return res.status(401).json({
                    success: false,
                    message: 'Unable to retrieve Discord profil.',
                });
            }

            const userData = await userResponse.json();

            if (typeof userData.id !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid discord profil.',
                });
            }

            const sessionId = createDiscordSession(data.access_token,userData.id) 

            const oauthCookieName = cookies.session

            res.cookie(oauthCookieName, sessionId, {
                httpOnly: true,
                secure: isProduction, 
                sameSite: 'lax', 
                path: '/', 
                maxAge: 1000 * 60 * 60 * 24 
            });


           
            res.json({ 
                success: true, 
                message: "Authentification réussie"
            });



        } catch (error) {
            console.error('Error fetching Discord token:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        } 
      });

    app.get('/api/authorize/discord', startOauthLimiter, (req, res) => {
        console.log("Received request for Discord authorization URL");

        const state = createToken('discord');

        const oauthCookieName = cookies.discordState

        res.cookie(oauthCookieName, state, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
            maxAge: 10 * 60 * 1000,
        });

        const params = new URLSearchParams({
            client_id: client.config.discord.clientId,
            redirect_uri: client.config.api.redirectUriDiscord,
            response_type: 'code',
            scope: 'identify',
            state,
        });

        return res.redirect(
            `https://discord.com/oauth2/authorize?${params.toString()}`,
        );
    });

    app.get("/api/callback/roblox", callbackOauthLimiter, async (req, res) => {
        console.log("Received Roblox callback");
        const { code, state: token } = req.query;

        if (typeof code !== 'string' || typeof token !== 'string') {
            return res.status(400).json({
                success: false,
                message: '❌ code or state invalid.',
            });
        }
        

        const verifyToken = getToken('roblox',token);

        if (!verifyToken || !verifyToken?.userId) {
            return res.status(401).json({ success: false, message: '❌ Invalid or expired token.' });
        }
        

        const discordUserId = verifyToken.userId

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

            if (!tokenRes.ok) {
                return res.status(400).json({
                    success: false,
                    message: '❌ Roblox code redemption failed.',
                });
            }

            const tokenData  = await tokenRes.json();

            if (typeof tokenData.access_token !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: '❌ roblox token invalid.',
                });
            }


            const userRes = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });

            if (!userRes.ok) {
                return res.status(401).json({success : false, message : '❌ Invalid '})
            }



            const robloxUser = await userRes.json();
            const robloxId = Number(robloxUser.sub);

            if (!Number.isSafeInteger(robloxId)) {
                return res.status(400).json({
                    success: false,
                    message: '❌ Roblox id invalid.',
                });
            }


            const session = verifySessions.get(discordUserId);

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: '❌ Discord session invalid or expired.',
                });
            }

            session.robloxId = robloxId;
            session.robloxVerified = true;
        
            consumeToken('roblox', token);

            return res.status(200).json( {
                success: true,
                message: `✅ Roblox API verified ! Welcome ${robloxUser.name} !`,
            })
            
            

        } catch (err) {
            console.error('Roblox OAuth error:', err);
            return res.status(500).json( { success: false, message: "❌ Server error , please try again." });
        }
        });

    app.get("/api/auth/roblox", startOauthLimiter, (req, res) => {
        console.log("Received request for Roblox authorization URL");

        const token = req.query.token;
        if (!token || typeof token !== 'string') {
            return res.status(400).send("Missing userId");
        }

        const verifyToken = getToken('roblox', token);

        if (!verifyToken?.userId) {
            return res.status(401).send('❌ Token invalid or expired');
        }

        const params = new URLSearchParams({
            client_id:     client.config.api.robloxAPIID,
            redirect_uri:  client.config.api.redirectUriRoblox,
            response_type: "code",
            scope:         "openid profile",
            state:         token,
        });

        res.redirect(`https://apis.roblox.com/oauth/v1/authorize?${params.toString()}`);
        });

    

    app.get('/api/me', async (req, res) => {
        const sessionId = req.cookies[cookies.session];

        if (typeof sessionId !== 'string') {
            return res.status(401).json({ user: null, error : "Invalid Format" });
        }

        const session = discordSessions.get(sessionId);

        if (!session || session.expiresAt < Date.now()) {
            discordSessions.delete(sessionId);
            res.clearCookie(cookies.session, { path : "/" });
            return res.status(401).json({ user: null, error : "Session expired" });

        }



        try {
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: { authorization: `Bearer ${session.discordAccessToken}` }
            });
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                res.json({ user: { id: userData.id, username: userData.username } });
            } else {
                discordSessions.delete(sessionId);

                res.clearCookie(cookies.session, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: 'lax',
                    path: '/',
                });

                return res.status(401).json({ user: null });
            }
        } catch (error) {
            res.status(500).json({ user: null });
        }
    });

    




    const frontendPath = path.join(__dirname, '../../../frontend/dist');
    app.use(express.static(frontendPath));
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });


    return app;
};