import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';




function CallbackRoblox() {

    const navigate = useNavigate();
    const [status, setStatus] = useState("Connexion Roblox en cours, veuillez patienter...");
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

        const fecthRobloxCallback = async () => {
            try {
                const response = await fetch(`/api/callback/roblox`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code , state })
                });
                const data = await response.json();
                if (data.success) {
                    setStatus(data.message);
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

        fecthRobloxCallback();
    }, []);

    return <div>{status}</div>
}

export default CallbackRoblox