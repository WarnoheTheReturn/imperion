import { useEffect } from 'react';

function CallbackDiscord() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        console.log('Authorization code:', code);
        if (code) {
            // 
        }
        window.location.href = '/';
    }, []);

    return <div>Callback discord</div>
}

export default CallbackDiscord