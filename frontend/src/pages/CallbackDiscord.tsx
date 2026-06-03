import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CallbackDiscord() {

    const navigate = useNavigate();
    const [status, setStatus] = useState("Connexion Discord en cours, veuillez patienter...");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        console.log('Authorization code:', code);
        if (!code) {
            setStatus("Erreur : Aucun code d'autorisation trouvé.");
            setTimeout(() => navigate('/'), 3000); // Retour à l'accueil
            return;
        }
        if (code) {
            // 
        }
        window.location.href = '/';
    }, []);

    return <div>{status}</div>
}

export default CallbackDiscord