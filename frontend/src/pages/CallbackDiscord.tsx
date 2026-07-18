import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../App';

interface CallbackDiscordProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


function CallbackDiscord({ setUser }: CallbackDiscordProps) {

    const navigate = useNavigate();
    const [status, setStatus] = useState("Connexion Discord en cours, veuillez patienter...");
    const called = useRef(false);

    useEffect(() => {
        if (called.current) return;
        called.current = true;
        
        const params = new URLSearchParams(window.location.search);

        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
            setStatus("Erreur : Aucun code d'autorisation trouvé.");
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        const fetchDiscordCallback = async () => {
            try {
                const response = await fetch(`/api/callback/discord`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code, state })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    setStatus(data.message);
                    setTimeout(() => navigate('/'),3000);
                    return;
                }

                setStatus(data.message);
                setUser(data.user);

                setTimeout(() => navigate('/'), 3000);
            
            } catch (error) {
                console.error(error);
                setStatus("Erreur de communication avec le serveur.");
                setTimeout(() => navigate('/'), 3000);
            }
        };

        fetchDiscordCallback();
    }, []);

    return <div>{status}</div>
}

export default CallbackDiscord