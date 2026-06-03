import { useEffect } from 'react';

function CallbackRoblox() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        console.log('Authorization code:', code);
        if (code) {
            // 
        }
        window.location.href = '/';
    }, []);

    return <div>Callback Roblox</div>
}

export default CallbackRoblox