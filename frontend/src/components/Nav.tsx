import styles from './Nav.module.css';
import { useEffect, useState } from 'react';
import type { User } from '../App';


function Nav({user} : {user: User | null})  {

    const [isScrolled, setIsScrolled] = useState(false);
    const logedClass = user ? styles.navDashboard : styles.navLogin;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClick = async () => {
        if (user) {
            const dashboardLink = "http://localhost:5173/dashboard";
            window.location.href = dashboardLink;
            return;
        }
        else {

            const getDiscordAuthorizeUrl = async () => {
                try {
                    const response = await fetch('/api/authorize/discord', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    return data.url;
                } catch (error) {
                    console.error('Error fetching Discord authorize URL:', error);
                    return "/";
                }
            };

            const discordLink = await getDiscordAuthorizeUrl();

            window.location.href = discordLink;
        }
    };

    
    return (
        <>
            <nav className={`${isScrolled ? styles.navScrolled : ""} ${styles.navContainer}`}>
                <img 
                    src="/bot_logo.png"
                    alt="Bot Logo"
                    className={styles.navLogo}
                />

                <div className={styles.navMenu}>
                    <a href="/">Home</a>
                    <a href="#faq">FAQ</a>
                    <a href="#wiki">Wiki</a>
                    <a href="#forum">Forum</a>
                    <a href="#contact">Contact</a>
                </div>
                <button className={logedClass} onClick={handleClick}>{user ? `Dashboard (${user.username})` : 'Login'}</button>

            </nav>
        
        </> 
    );
}

export default Nav;