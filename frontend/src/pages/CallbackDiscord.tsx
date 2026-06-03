import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../App';

interface CallbackDiscordProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}


function CallbackDiscord({ setUser }: CallbackDiscordProps) {

    const navigate = useNavigate();
    const [status, setStatus] = useState("Connexion Discord en cours, veuillez patienter...");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        console.log('Authorization code:', code);
        if (!code) {
            setStatus("Erreur : Aucun code d'autorisation trouvé.");
            setTimeout(() => navigate('/'), 3000);
        }

        const fecthDiscordCallback = async () => {
            try {
                const response = await fetch(`/api/callback/discord`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code })
                });

                const data = await response.json();
                console.log(data);
                if (data.success) {
                    setStatus(data.message);
                    setUser(data.user);
                    setTimeout(() => navigate('/'), 3000);
                } else {
                    setStatus(data.message);
                    setTimeout(() => navigate('/'), 3000);
                }
            } catch (error) {
                console.error(error);
                setStatus("Erreur de fetch : " + error);
                setTimeout(() => navigate('/'), 3000);
            }
        };

        fecthDiscordCallback();
    }, []);

    return <div>{status}</div>
}

export default CallbackDiscord